import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { resolveTenantContext } from "../middlewares/tenantContext.middleware.js";
import { ROLE_PERMISSIONS } from "../constants/rolePermssions.js";

const router = Router();

// GET /api/v1/debug/context
// Returns current req.user, req.membership, and permissions for debugging
router.get("/context", verifyJwt, resolveTenantContext, (req, res) => {
  const membership = req.membership
    ? req.membership.toObject
      ? req.membership.toObject()
      : req.membership
    : null;
  const role = membership?.role || null;
  const permissions = ROLE_PERMISSIONS[role] || [];

  res.json({
    ok: true,
    user: {
      _id: req.user._id,
      email: req.user.email,
      isSuperAdmin: req.user.isSuperAdmin || false,
    },
    membership,
    role,
    permissions,
  });
});

export default router;
