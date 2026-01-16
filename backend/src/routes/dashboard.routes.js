import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { getTenantDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/tenant",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.TENANT_VIEW),
  getTenantDashboard
);

export default router;
