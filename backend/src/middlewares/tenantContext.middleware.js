import { Membership } from "../models/membership.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const resolveTenantContext = asyncHandler(async (req, res, next) => {
  const tenantId = req.headers["x-tenant-id"];
  const userId = req.user._id;

  console.log("[resolveTenantContext] X-Tenant-Id:", tenantId);
  console.log("[resolveTenantContext] UserId:", userId);

  if (!tenantId) {
    throw new ApiError(400, "X-Tenant-Id header is required");
  }

  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    console.log("[resolveTenantContext] Invalid ObjectId format:", tenantId);
    throw new ApiError(400, "Invalid tenant ID format");
  }

  let userObjectId = null;
  try {
    userObjectId = mongoose.Types.ObjectId(userId);
  } catch (e) {
    console.log("[resolveTenantContext] Invalid userId format:", userId);
  }

  const membership = await Membership.findOne({
    tenantId: new mongoose.Types.ObjectId(tenantId),
    userId: userObjectId || userId,
    status: "active",
  }).select("tenantId userId role status");

  console.log("[resolveTenantContext] Membership found:", !!membership);
  if (membership) {
    console.log("[resolveTenantContext] Membership role:", membership.role);
    console.log(
      "[resolveTenantContext] Full membership:",
      JSON.stringify(membership, null, 2)
    );
  }

  if (!membership) {
    throw new ApiError(403, "Not a member of this tenant");
  }

  req.membership = membership;
  next();
});
