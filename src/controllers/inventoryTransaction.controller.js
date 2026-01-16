import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { getPaginationParams } from "../utils/pagination.js";
import {
  addStockService,
  saleStockService,
  removeStockService,
  adjustStockService,
} from "../services/inventoryTransaction.service.js";

const addStock = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { branchId, productId } = req.params;
  const { quantity, note } = req.body;

  const stock = await addStockService({
    tenantId,
    branchId,
    productId,
    quantity,
    userId: req.user._id,
    note: note || "",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { stock }, "Stock added successfully"));
});

const saleStock = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { branchId, productId } = req.params;
  const { quantity, note } = req.body;

  const stock = await saleStockService({
    tenantId,
    branchId,
    productId,
    quantity,
    userId: req.user._id,
    note: note || "",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { stock }, "Stock sold successfully"));
});

const removeStock = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { branchId, productId } = req.params;
  const { quantity, note } = req.body;

  const stock = await removeStockService({
    tenantId,
    branchId,
    productId,
    quantity,
    userId: req.user._id,
    note: note || "",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { stock }, "Stock removed successfully"));
});

const adjustStock = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { branchId, productId } = req.params;
  const { quantity, note } = req.body;

  const stock = await adjustStockService({
    tenantId,
    branchId,
    productId,
    quantity,
    userId: req.user._id,
    note,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { stock }, "Stock adjusted successfully"));
});

const listInventoryTransactions = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { branchId, productId } = req.params;

  const { page, limit, skip, sort } = getPaginationParams(req.query, {
    defaultLimit: 20,
    maxLimit: 100,
    allowedSorts: ["createdAt", "quantity", "type"],
    defaultSort: "-createdAt",
  });

  const filter = { tenantId };

  if (branchId) filter.branchId = branchId;
  if (productId) filter.productId = productId;

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};

    if (req.query.startDate) {
      const start = new Date(req.query.startDate);
      start.setHours(0, 0, 0, 0);
      filter.createdAt.$gte = start;
    }

    if (req.query.endDate) {
      const end = new Date(req.query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  const [transactions, total] = await Promise.all([
    InventoryTransaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("productId", "productName")
      .populate("userId", "fullName email")
      .populate("branchId", "branchName location"),
    InventoryTransaction.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      transactions,
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

export {
  addStock,
  saleStock,
  removeStock,
  adjustStock,
  listInventoryTransactions,
};
