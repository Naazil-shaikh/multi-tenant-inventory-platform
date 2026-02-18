import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  inviteMember,
  acceptInvite,
  listTenantMember,
  listMyInvitations,
  rejectInvite,
} from "../controllers/membership.controller.js";

const router = Router();

router.post(
  "/invite",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.MEMBER_INVITE),
  inviteMember
);
router.get("/invitations", verifyJwt, listMyInvitations);

router.get(
  "/",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.MEMBER_VIEW),
  listTenantMember
);

router.post("/accept", verifyJwt, acceptInvite);
router.post("/reject", verifyJwt, rejectInvite);

export default router;
