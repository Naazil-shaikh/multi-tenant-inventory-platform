import { ROLE_PERMISSIONS } from "../constants/rolePermssions.js";

export const hasPermission = (membership, permission) => {
  if (membership.isSuperAdmin) {
    return true;
  }

  const permissions = ROLE_PERMISSIONS[membership.role];

  return permissions.includes(permission);
};
