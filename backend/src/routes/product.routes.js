import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  updateProductStatus,
} from "../controllers/product.controller.js";

const router = Router();

router.post(
  "/",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.PRODUCT_CREATE),
  createProduct
);

router.get(
  "/",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.PRODUCT_VIEW),
  listProducts
);

router.get(
  "/:productId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.PRODUCT_VIEW),
  getProductById
);

router.patch(
  "/:productId",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  updateProduct
);

router.patch(
  "/:productId/status",
  verifyJwt,
  resolveTenantContext,
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  updateProductStatus
);

export default router;
