import { ApiError } from "../utils/ApiError.js";
import { Tenant } from "../models/tenant.model.js";
import { Membership } from "../models/membership.model.js";
import mongoose from "mongoose";

export const createTenantService = async ({ tenantName, plan, userId }) => {
  if (!tenantName || !userId) {
    throw new ApiError(400, "Tenant name and user are required");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const [tenant] = await Tenant.create(
      [
        {
          tenantName,
          plan: plan || "free",
          ownerId: userId,
        },
      ],
      { session }
    );

    const [membership] = await Membership.create(
      [
        {
          tenantId: tenant._id,
          userId,
          role: "tenantAdmin",
          status: "active",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { tenant, membership };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const changeTenantNameService = async ({ tenantId, tenantName }) => {
  if (!tenantId || !tenantName) {
    throw new ApiError(400, "All fields are required");
  }

  const tenant = await Tenant.findByIdAndUpdate(
    tenantId,
    { $set: { tenantName } },
    { new: true }
  );

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  return tenant;
};

export const changeTenantStatusService = async ({ tenantId, status }) => {
  if (!tenantId || !status) {
    throw new ApiError(400, "All fields are required");
  }

  if (!["active", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid tenant status");
  }

  const tenant = await Tenant.findByIdAndUpdate(
    tenantId,
    { $set: { status } },
    { new: true }
  );

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  return tenant;
};
