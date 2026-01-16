import { Product } from "../models/poduct.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createProductService = async ({
  productName,
  tenantId,
  sellingPrice,
  costPrice,
  unit,
  category,
  status,
}) => {
  if (!tenantId || !productName || !sellingPrice || !unit || !category) {
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
