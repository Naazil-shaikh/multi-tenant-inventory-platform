import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

inventorySchema.index(
  { tenantId: 1, branchId: 1, productId: 1 },
  { unique: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
