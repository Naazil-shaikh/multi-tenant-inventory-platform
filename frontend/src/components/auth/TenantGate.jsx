import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function TenantGate({ children }) {
  const activeTenant = useSelector((state) => state.tenant.activeTenant);
  const location = useLocation();

  if (!activeTenant) {
    return (
      <Navigate
        to="/tenants/select"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
