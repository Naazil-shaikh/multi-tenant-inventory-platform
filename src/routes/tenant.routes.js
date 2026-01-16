import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  createTenant,
  getTenantDetails,
  changeTenantName,
  changeStatus,
  listMyTenants,
} from "../controllers/tenant.controller.js";

const router = Router();

router.post("/", verifyJwt, createTenant);

router.get(
  "/me",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.TENANT_VIEW),
  getTenantDetails
);

router.get("/", verifyJwt, listMyTenants);

router.patch(
  "/me/name",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.TENANT_UPDATE),
  changeTenantName
);

router.patch(
  "/me/status",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.TENANT_SUSPEND),
  changeStatus
);

export default router;
