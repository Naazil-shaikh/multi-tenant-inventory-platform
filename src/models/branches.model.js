import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  branchStatus: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
});

branchSchema.index({ tenantId: 1, branchName: 1 }, { unique: true });
export const Branch = mongoose.model("Branch", branchSchema);
