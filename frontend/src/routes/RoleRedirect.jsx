import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleRedirect() {
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  // Logged in but no tenant yet
  if (!activeTenant) {
    return <Navigate to="/tenants/select" replace />;
  }

  // Tenant exists → role-based redirect
  switch (activeTenant.role) {
    case "tenantAdmin":
      return "/dashboard/admin";
    case "manager":
      return "/dashboard/manager";
    default:
      return "/products";
  }
}
