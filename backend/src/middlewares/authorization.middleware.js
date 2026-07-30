import { ROLE_PERMISSIONS } from "../constants/rolePermssions.js";
import { hasPermission } from "../services/permission.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requirePermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.membership) {
      throw new ApiError(500, "Tenant context not resolved");
    }
    if (!hasPermission(req.membership, permission)) {
      throw new ApiError(401, "Permission not granted");
    }
    let membershipRole = req.membership?.role;

    try {
      membershipRole = String(membershipRole).trim();
    } catch (e) {
      membershipRole = req.membership?.role;
    }

    next();
  });
};

// console.log(
//   "[requirePermission] Full membership object:",
//   JSON.stringify(req.membership, null, 2)
// );
// console.log("[requirePermission] Membership role field:", membershipRole);
// console.log("[requirePermission] Required permission:", permission);

// const rolePermissions = ROLE_PERMISSIONS[membershipRole] || [];
// console.log(
//   "[requirePermission] Role permissions for role '" + membershipRole + "':",
//   rolePermissions
// );
// console.log(
//   "[requirePermission] Has permission:",
//   rolePermissions.includes(permission)
// );

// if (!rolePermissions.includes(permission)) {
//   console.log(
//     "[requirePermission] DENYING - Permission not found in role permissions"
//   );
//   throw new ApiError(403, "Permission denied");
// }
