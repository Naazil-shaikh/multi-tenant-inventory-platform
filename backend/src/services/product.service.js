import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/poduct.model.js";
import { ApiError } from "../utils/ApiError.js";
import { getPaginationParams } from "../utils/pagination.js";

export const createProductService = async ({
  tenantId,
  productName,
  sellingPrice,
  costPrice,
  unit,
  category,
  status,
}) => {
  if (
    !tenantId ||
    !productName ||
    sellingPrice === undefined ||
    !unit ||
    !category
  ) {
    throw new ApiError(400, "Required fields missing");
  }
  try {
    const product = await Product.create({
      productName,
      tenantId,
      sellingPrice,
      costPrice,
      unit,
      category,
      status,
    });

    if (!product) {
      throw new ApiError(400, "Product creating failed");
    }
    return product;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, "Product with this name already exists");
    }

    if (error.name === "ValidationError") {
      throw new ApiError(
        400,
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ")
      );
    }

    if (error.name === "CastError") {
      throw new ApiError(400, `Invalid value for ${error.path}`);
    }

    throw new ApiError(500, "Failed to create product");
  }
};

export async function productById({ tenantId, productId }) {
  const product = await Product.findOne({
    _id: productId,
    tenantId,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}

export const getProductByName = async ({ tenantId, productName }) => {
  const product = await Product.findOne({
    tenantId,
    productName: {
      $regex: productName,
      $options: "i",
    },
  });

  if (product.length === 0) {
    throw new ApiError(404, "Product not found");
  }

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const getLowStockProducts = async ({ tenantId, threshold = 5 }) => {
  const lowStockProducts = await Inventory.find({
    tenantId,
    quantity: { $lte: threshold },
  })
    .populate("productId", "productName")
    .populate("branchId", "branchName");

  return lowStockProducts.map((item) => ({
    productName: item.productId.productName,
    branchName: item.branchId.branchName,
    quantity: item.quantity,
  }));
};

export const getOutOfStockProducts = async ({ tenantId }) => {
  const outOfStockProducts = await Inventory.find({
    tenantId,
    quantity: { $eq: 0 },
  })
    .populate("productId", "productName")
    .populate("branchId", "branchName");

  return outOfStockProducts.map((item) => ({
    productName: item.productId.productName,
    branchName: item.branchId.branchName,
    quantity: item.quantity,
  }));
};

export const listProductsService = async ({ tenantId, query }) => {
  const { page, limit, skip, sort } = getPaginationParams(query, {
    defaultLimit: 10,
    maxLimit: 50,
    allowedSorts: ["createdAt", "sellingPrice", "productName"],
    defaultSort: "-createdAt",
  });

  const filter = { tenantId };

  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export const updateProductService = async ({ tenantId, productId, data }) => {
  const { productName, sellingPrice, costPrice, unit, category, status } = data;

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

  return product;
};

export const updateProductStatusService = async ({
  tenantId,
  productId,
  status,
}) => {
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

  return product;
};

export const updateProductByName = async ({
  tenantId,
  productName,
  updates,
}) => {
  const updateList = {};
  const {
    productName: newProductName,
    sellingPrice,
    costPrice,
    unit,
    category,
    status,
  } = updates;

  if (newProductName !== undefined) updateList.productName = newProductName;
  if (sellingPrice !== undefined) updateList.sellingPrice = sellingPrice;
  if (costPrice !== undefined) updateList.costPrice = costPrice;
  if (unit !== undefined) updateList.unit = unit;
  if (category !== undefined) updateList.category = category;
  if (status !== undefined) updateList.status = status;

  if (Object.keys(updateList).length === 0) {
    throw new ApiError(400, "Atleast one field is required");
  }

  const product = await Product.findOneAndUpdate(
    {
      productName: {
        $regex: productName,
        $options: "i",
      },
      tenantId,
    },
    {
      $set: updateList,
    },
    { new: true }
  );

  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  return {
    productName: product.productName,
    sellingPrice: product.sellingPrice,
    costPrice: product.costPrice,
    unit: product.unit,
    category: product.category,
    status: product.status,
  };
};
