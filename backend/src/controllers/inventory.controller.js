import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Inventory } from "../models/inventory.model.js";
import { getPaginationParams } from "../utils/pagination.js";

const listBranchInventory = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { branchId } = req.params;

  const { page, limit, skip, sort } = getPaginationParams(req.query, {
    defaultLimit: 10,
    maxLimit: 50,
    allowedSorts: ["createdAt", "quantity", "sellingPrice", "productName"],
    defaultSort: "-createdAt",
  });

  const filter = { tenantId, branchId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const [inventory, total] = await Promise.all([
    Inventory.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("productId", "productName unit"),
    // .populate("userId", "username email"),
    Inventory.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      inventory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  );
});

const getProductDetails = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { productId, branchId } = req.params;

  const inventory = await Inventory.findOne({
    tenantId,
    branchId,
    productId,
  }).populate("productId", "productName unit category status");

  if (!inventory) {
    throw new ApiError(404, "Product not found in this branch");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { inventory }, "Product fetched successfully"));
});

const updateInventoryPrice = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { productId, branchId } = req.params;
  const { sellingPrice, costPrice } = req.body;

  let updateFields = {};
  if (sellingPrice !== undefined) updateFields.sellingPrice = sellingPrice;
  if (costPrice !== undefined) updateFields.costPrice = costPrice;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "Atleast one price field is required");
  }

  const inventory = await Inventory.findOneAndUpdate(
    { tenantId, productId, branchId },
    { $set: updateFields },
    { new: true }
  ).populate("productId", "productName unit category status");

  if (!inventory) {
    throw new ApiError(404, "Inventory not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { inventory }, "Inventory updated successfully")
    );
});

export { listBranchInventory, getProductDetails, updateInventoryPrice };
