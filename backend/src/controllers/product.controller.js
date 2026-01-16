import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/poduct.model.js";
import { getPaginationParams } from "../utils/pagination.js";
import { createProductService } from "../services/product.service.js";

const createProduct = asyncHandler(async (req, res) => {
  const { productName, sellingPrice, costPrice, unit, category, status } =
    req.body;
  console.log("Create product body:", req.body);

  if (!productName || !sellingPrice || !unit) {
    throw new ApiError(400, "Required fields missing");
  }

  const tenantId = req.membership.tenantId;

  const product = await createProductService({
    productName,
    tenantId,
    sellingPrice,
    costPrice,
    unit,
    category,
    status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product created successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const tenantId = req.membership.tenantId;

  const product = await Product.findOne({
    _id: productId,
    tenantId,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched"));
});

const listProducts = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;

  const { page, limit, skip, sort } = getPaginationParams(req.query, {
    defaultLimit: 10,
    maxLimit: 50,
    allowedSorts: ["createdAt", "sellingPrice", "productName"],
    defaultSort: "-createdAt",
  });

  const filter = { tenantId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      products,
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

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const tenantId = req.membership.tenantId;

  const { productName, sellingPrice, costPrice, unit, category, status } =
    req.body;

  const updateList = {};
  if (productName !== undefined) updateList.productName = productName;
  if (sellingPrice !== undefined) updateList.sellingPrice = sellingPrice;
  if (costPrice !== undefined) updateList.costPrice = costPrice;
  if (unit !== undefined) updateList.unit = unit;
  if (category !== undefined) updateList.category = category;
  if (status !== undefined) updateList.status = status;

  if (Object.keys(updateList).length === 0) {
    throw new ApiError(400, "Atleast one field is required");
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, tenantId },
    { $set: updateList },
    { new: true }
  );

  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product updated successfully"));
});

const updateProductStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const tenantId = req.membership.tenantId;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, tenantId },
    { $set: { status } },
    { new: true }
  );

  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Status updated successfully"));
});

export {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  updateProductStatus,
};
