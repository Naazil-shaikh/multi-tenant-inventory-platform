import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  createBranch,
  listBranches,
  getBranchDetails,
  updateBranch,
  updateBranchStatus,
} from "../controllers/branch.controller.js";

const router = Router();

router.post(
  "/",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.BRANCH_CREATE),
  createBranch
);

router.get(
  "/",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.BRANCH_VIEW),
  listBranches
);

router.get(
  "/:branchId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.BRANCH_VIEW),
  getBranchDetails
);

router.patch(
  "/:branchId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.BRANCH_UPDATE),
  updateBranch
);

router.patch(
  "/:branchId/status",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.BRANCH_UPDATE),
  updateBranchStatus
);

export default router;
