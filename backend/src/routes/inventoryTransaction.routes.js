import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  addStock,
  saleStock,
  removeStock,
  adjustStock,
  listInventoryTransactions,
} from "../controllers/inventoryTransaction.controller.js";

const router = Router();

router.get(
  "/",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_AUDIT_VIEW),
  listInventoryTransactions
);

router.get(
  "/branches/:branchId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_AUDIT_VIEW),
  listInventoryTransactions
);

router.get(
  "/branches/:branchId/products/:productId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_AUDIT_VIEW),
  listInventoryTransactions
);

router.post(
  "/branches/:branchId/products/:productId/add",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_ADD),
  addStock
);

router.post(
  "/branches/:branchId/products/:productId/sale",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_REMOVE),
  saleStock
);

router.post(
  "/branches/:branchId/products/:productId/remove",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_REMOVE),
  removeStock
);

router.post(
  "/branches/:branchId/products/:productId/adjust",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_ADJUST),
  adjustStock
);

export default router;
