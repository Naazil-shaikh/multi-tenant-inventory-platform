import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { setPermissions } from "../../store/slices/permissionSlice";
import { ROLE_PERMISSIONS } from "../../permissionConstants/RolePermission";

export default function PermissionGuard({ permission, children }) {
  const dispatch = useDispatch();

  const allowed = useSelector((state) => state.permission?.allowed) || [];

  const activeTenant = useSelector((state) => state.tenant?.activeTenant);

  if (activeTenant && allowed.length === 0 && activeTenant.role) {
    dispatch(setPermissions(ROLE_PERMISSIONS[activeTenant.role] || []));
  }

  if (!allowed.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
