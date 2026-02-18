import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Branch } from "../models/branches.model.js";
import { ApiError } from "../utils/ApiError.js";
import { getPaginationParams } from "../utils/pagination.js";

const createBranch = asyncHandler(async (req, res) => {
  const { branchName, location, branchStatus = "active" } = req.body;
  const tenantId = req.membership.tenantId;

  if (!branchName || !location) {
    throw new ApiError(400, "Branch name and location are required");
  }

  let branch;
  try {
    branch = await Branch.create({
      tenantId,
      branchName,
      location,
      branchStatus,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(
        409,
        "Branch with this name already exists for this tenant"
      );
    }
    throw err;
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { branch }, "Branch created successfully"));
});

const listBranches = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;

  const { page, limit, skip, sort } = getPaginationParams(req.query, {
    defaultLimit: 10,
    maxLimit: 50,
    allowedSorts: ["createdAt", "quantity", "sellingPrice"],
    defaultSort: "-createdAt",
  });

  const filter = { tenantId };
  if (req.query.branchStatus) filter.status = req.query.branchStatus;

  const [branches, total] = await Promise.all([
    Branch.find(filter).sort(sort).skip(skip).limit(limit),
    Branch.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      branches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  );
});

const getBranchDetails = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const tenantId = req.membership.tenantId;

  const branch = await Branch.findOne({
    _id: branchId,
    tenantId,
  });

  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { branch }, "Branch fetched successfully"));
});

const updateBranch = asyncHandler(async (req, res) => {
  const { branchName, location, branchStatus } = req.body;
  const { branchId } = req.params;
  const tenantId = req.membership.tenantId;
  const updateFields = {};

  if (branchName !== undefined) updateFields.branchName = branchName;
  if (location !== undefined) updateFields.location = location;
  if (branchStatus !== undefined) updateFields.branchStatus = branchStatus;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "Atleast one field is required to update");
  }

  const branch = await Branch.findOneAndUpdate(
    { _id: branchId, tenantId },
    { $set: updateFields },
    { new: true }
  );

  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { branch }, "Branch updated successfully"));
});

const updateBranchStatus = asyncHandler(async (req, res) => {
  const { branchStatus } = req.body;
  const { branchId } = req.params;
  const tenantId = req.membership.tenantId;

  if (!["active", "closed"].includes(branchStatus)) {
    throw new ApiError(400, "Invalid branch status");
  }

  const branch = await Branch.findOneAndUpdate(
    { _id: branchId, tenantId },
    { $set: { branchStatus } },
    { new: true }
  );

  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { branch }, "Branch status updated successfully")
    );
});

export {
  createBranch,
  listBranches,
  getBranchDetails,
  updateBranch,
  updateBranchStatus,
};
