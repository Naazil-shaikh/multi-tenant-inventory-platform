import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function TenantGuard({ children }) {
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  if (!activeTenant) {
    return <Navigate to="/tenants/select" replace />;
  }

  return children;
}
