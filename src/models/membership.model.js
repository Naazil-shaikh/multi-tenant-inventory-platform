import mongoose, { Schema } from "mongoose";

const membershipSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    branchIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["tenantAdmin", "manager", "user"],
      required: true,
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "invited", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Prevent duplicate membership per tenant
membershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

export const Membership = mongoose.model("Membership", membershipSchema);
