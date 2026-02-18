import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  listBranchInventory,
  getProductDetails,
  updateInventoryPrice,
} from "../controllers/inventory.controller.js";

const router = Router();

router.get(
  "/branches/:branchId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_VIEW),
  listBranchInventory
);

router.get(
  "/branches/:branchId/products/:productId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.INVENTORY_VIEW),
  getProductDetails
);

router.patch(
  "/branches/:branchId/products/:productId/price",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  updateInventoryPrice
);

export default router;
