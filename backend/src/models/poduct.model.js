import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
  },
  unit: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

productSchema.index({ tenantId: 1, productName: 1 }, { unique: true });
export const Product = mongoose.model("Product", productSchema);
