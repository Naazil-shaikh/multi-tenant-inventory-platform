import { Membership } from "../models/membership.model.js";
import {
  inviteMemberService,
  acceptInviteService,
} from "../services/membership.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPaginationParams } from "../utils/pagination.js";
import { Invitation } from "../models/invitation.model.js";

const inviteMember = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;
  const { email, role } = req.body;

  const invitation = await inviteMemberService({ tenantId, email, role });

  return res
    .status(201)
    .json(new ApiResponse(201, { invitation }, "Invitation sent successfully"));
});

const acceptInvite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { inviteToken } = req.body;
  const userEmail = req.user.email;

  const membership = await acceptInviteService({
    inviteToken,
    userId,
    userEmail,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { membership }, "Invitation accepted"));
});

const rejectInvite = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;
  const { inviteToken } = req.body;

  const invitation = await Invitation.findOne({
    inviteToken,
    email: userEmail,
    status: "pending",
  });

  if (!invitation) {
    throw new ApiError(404, "Invitation not found");
  }

  invitation.status = "rejected";
  await invitation.save();

  return res.status(200).json(new ApiResponse(200, {}, "Invitation rejected"));
});

const listMyInvitations = asyncHandler(async (req, res) => {
  const email = req.user.email;

  const invitations = await Invitation.find({
    email,
    status: "pending",
  }).populate("tenantId", "tenantName plan");

  return res.status(200).json(new ApiResponse(200, { invitations }, "Success"));
});

const listTenantMember = asyncHandler(async (req, res) => {
  const tenantId = req.membership.tenantId;

  const { page, limit, skip, sort } = getPaginationParams(req.query, {
    defaultLimit: 10,
    maxLimit: 50,
    allowedSorts: ["createdAt"],
    defaultSort: "-createdAt",
  });

  const filter = { tenantId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;

  const [tenantMembers, total] = await Promise.all([
    Membership.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("userId", "fullName email avatar"),
    Membership.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      tenantMembers,
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

export {
  inviteMember,
  acceptInvite,
  listTenantMember,
  listMyInvitations,
  rejectInvite,
};
