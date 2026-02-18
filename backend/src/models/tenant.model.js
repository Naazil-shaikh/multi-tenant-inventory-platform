import mongoose, { Schema } from "mongoose";

const tenantSchema = new Schema({
  tenantName: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free",
  },
  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active",
  },
});

export const Tenant = mongoose.model("Tenant", tenantSchema);
