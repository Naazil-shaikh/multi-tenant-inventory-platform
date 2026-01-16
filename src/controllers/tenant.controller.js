import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Tenant } from "../models/tenant.model.js";
import {
  createTenantService,
  changeTenantNameService,
  changeTenantStatusService,
} from "../services/tenant.service.js";

const createTenant = asyncHandler(async (req, res) => {
  const { tenantName, plan } = req.body;

  if (!tenantName?.trim()) {
    throw new ApiError(400, "Tenant name is required");
  }

  const { tenant, membership } = await createTenantService({
    tenantName: tenantName.trim(),
    plan: plan || "free",
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { tenant, membership },
        "Tenant created successfully"
      )
    );
});

const listMyTenants = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tenants = await Tenant.aggregate([
    {
      $lookup: {
        from: "memberships",
        localField: "_id",
        foreignField: "tenantId",
        as: "memberships",
      },
    },
    {
      $unwind: "$memberships",
    },
    {
      $match: {
        "memberships.userId": userId,
        "memberships.status": "active",
      },
    },
    {
      $group: {
        _id: "$_id",
        tenantName: { $first: "$tenantName" },
        plan: { $first: "$plan" },
        status: { $first: "$status" },
        ownerId: { $first: "$ownerId" },
        membership: { $first: "$memberships" },
      },
    },
  ]);

  const enriched = tenants.map((t) => ({
    _id: t._id,
    tenantName: t.tenantName,
    plan: t.plan,
    status: t.status,
    role: t.membership?.role || null,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tenants: enriched },
        "Tenants fetched successfully"
      )
    );
});

const changeTenantName = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { tenantName } = req.body;

  if (!tenantName?.trim()) {
    throw new ApiError(400, "Tenant name is required");
  }

  const tenant = await changeTenantNameService({
    tenantId,
    tenantName: tenantName.trim(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { tenant }, "Tenant name updated"));
});

const changeStatus = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { status } = req.body;

  if (!["active", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid tenant status");
  }

  const tenant = await changeTenantStatusService({
    tenantId,
    status,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { tenant }, "Tenant status updated"));
});

const getTenantDetails = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId; // 🔒 CHANGED: tenant derived from membership

  const tenant = await Tenant.findById(tenantId);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { tenant }, "Tenant fetched successfully")); // 🔒 CHANGED: message fixed
});

export {
  createTenant,
  changeTenantName,
  changeStatus,
  getTenantDetails,
  listMyTenants,
};
