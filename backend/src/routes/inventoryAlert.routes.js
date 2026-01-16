import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { getLowStockAlert } from "../controllers/inventoryAlertController.js";

const router = Router();

router.get(
  "/low-stock",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_VIEW),
  getLowStockAlert
);

export default router;
