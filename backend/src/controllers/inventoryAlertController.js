import { Inventory } from "../models/inventory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const LOW_STOCK_THRESHOLD = 5;

export const getLowStockAlert = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;

  const lowStockCount = await Inventory.countDocuments({
    tenantId,
    quantity: { $lte: LOW_STOCK_THRESHOLD },
  });

  return res.status(200).json(
    new ApiResponse(200, {
      threshold: LOW_STOCK_THRESHOLD,
      count: lowStockCount,
    })
  );
});
