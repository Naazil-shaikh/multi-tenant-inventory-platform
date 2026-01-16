import { Tenant } from "../models/tenant.model.js";
import { Product } from "../models/poduct.model.js";
import { Branch } from "../models/branches.model.js";
import { Membership } from "../models/membership.model.js";
import { Inventory } from "../models/inventory.model.js";
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const LOW_STOCK_THRESHOLD = 5;

export const getTenantDashboard = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;

  const [
    tenant,
    totalProducts,
    totalBranches,
    totalMembers,
    lowStockCount,
    recentActivities,
  ] = await Promise.all([
    Tenant.findById(tenantId).select("tenantName"),
    Product.countDocuments({ tenantId }),
    Branch.countDocuments({ tenantId }),
    Membership.countDocuments({ tenantId, status: "active" }),
    Inventory.countDocuments({
      tenantId,
      quantity: { $lte: LOW_STOCK_THRESHOLD },
    }),
    InventoryTransaction.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId", "productName")
      .populate("branchId", "branchName")
      .populate("userId", "email"),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      tenantName: tenant?.tenantName,
      KPIs: {
        totalProducts,
        totalBranches,
        totalMembers,
        lowStockCount,
      },
      recentActivities: recentActivities.map((tx) => ({
        id: tx._id,
        type: tx.type,
        product: tx.productId?.productName,
        branch: tx.branchId?.branchName,
        user: tx.userId?.email,
        quantity: tx.quantity,
        createdAt: tx.createdAt,
      })),
    })
  );
});
