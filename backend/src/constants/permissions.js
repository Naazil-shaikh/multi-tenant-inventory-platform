export const PERMISSIONS = {
  // Tenant-level
  TENANT_VIEW: "tenant:view",
  TENANT_UPDATE: "tenant:update",
  TENANT_SUSPEND: "tenant:suspend",

  // Membership / users
  MEMBER_INVITE: "member:invite",
  MEMBER_REMOVE: "member:remove",
  MEMBER_ROLE_CHANGE: "member:role_change",
  MEMBER_VIEW: "member:view",

  // Branch
  BRANCH_CREATE: "branch:create",
  BRANCH_UPDATE: "branch:update",
  BRANCH_VIEW: "branch:view",

  // Product
  PRODUCT_CREATE: "product:create",
  PRODUCT_UPDATE: "product:update",
  PRODUCT_VIEW: "product:view",

  // Inventory
  INVENTORY_ADD: "inventory:add",
  INVENTORY_REMOVE: "inventory:remove",
  INVENTORY_ADJUST: "inventory:adjust",
  INVENTORY_VIEW: "inventory:view",
  INVENTORY_AUDIT_VIEW: "inventory:audit:view",

  // Analytics
  ANALYTICS_VIEW: "analytics:view",
};
