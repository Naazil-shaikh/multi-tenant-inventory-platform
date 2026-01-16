import { Invitation } from "../models/invitation.model.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";
import { Membership } from "../models/membership.model.js";
import mongoose from "mongoose";

const inviteMemberService = async ({ tenantId, email, role }) => {
  if (!tenantId || !email || !role) {
    throw new ApiError(400, "All values are required");
  }

  if (!["manager", "user"].includes(role)) {
    throw new ApiError(400, "Invalid role category");
  }

  const existingInvitation = await Invitation.findOne({
    tenantId,
    email,
    status: "pending",
  });

  if (existingInvitation) {
    throw new ApiError(
      409,
      "An active invitation already exists for this email"
    );
  }

  const inviteToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    tenantId,
    email,
    role,
    inviteToken,
    status: "pending",
    expiresAt,
  });

  return invitation;
};

const acceptInviteService = async ({ inviteToken, userId, userEmail }) => {
  if (!userId || !inviteToken) {
    throw new ApiError(400, "All fields are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await Invitation.findOne({
      inviteToken,
      status: "pending",
    }).session(session);

    if (!invitation) {
      throw new ApiError(404, "Invalid or expired invitation");
    }

    if (invitation.email !== userEmail) {
      throw new ApiError(
        403,
        "This invitation is not intended for your account"
      );
    }

    if (invitation.expiresAt < new Date()) {
      await Invitation.findByIdAndUpdate(
        invitation._id,
        {
          $set: { status: "expired" },
        },
        { session }
      );
      throw new ApiError(400, "Invitation has expired");
    }

    const existingMembership = await Membership.findOne({
      tenantId: invitation.tenantId,
      userId,
    }).session(session);

    if (existingMembership) {
      throw new ApiError(409, "User already a member of this tenant");
    }

    const membership = await Membership.create(
      [
        {
          tenantId: invitation.tenantId,
          userId,
          role: invitation.role,
          status: "active",
        },
      ],
      { session }
    );

    await Invitation.findByIdAndUpdate(
      invitation._id,
      { $set: { status: "accepted" } },

      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return membership;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export { inviteMemberService, acceptInviteService };
