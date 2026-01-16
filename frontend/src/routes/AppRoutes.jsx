import { Routes, Route, Navigate } from "react-router-dom";

import AuthGuard from "./gaurds/AuthGaurd";
import TenantGuard from "./gaurds/TenantGaurd";
import PermissionGuard from "./gaurds/PermissionGaurd";

import AuthLayout from "../components/layout/AuthLayout";
import TenantLayout from "../components/layout/TenantLayout";
import AdminLayout from "../components/layout/AdminLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import TenantSelector from "../pages/tenant/TenantSelector";

import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantSettings from "../pages/tenant/TenantSettings";

import BranchList from "../pages/branches/BranchList";
import BranchDetail from "../pages/branches/BranchDetail";

import ProductList from "../pages/products/ProductList";
import ProductDetail from "../pages/products/ProductDetail";

import Members from "../pages/members/Members";
import Invitations from "../pages/user/Invitation";

import BranchTransaction from "../pages/inventory/BranchTransaction";
import InventoryTransaction from "../pages/inventory/InventoryTransaction";
import ProductTransaction from "../pages/inventory/ProductTransaction";

import Profile from "../pages/user/Profile";

import ManagerDashboard from "../pages/dashboards/ManagerDashboard";
import TenantAdminDashboard from "../pages/dashboards/TenantAdminDashboard";
import SuperAdminDashboard from "../pages/dashboards/SuperAdminDashboard";

import AccessDenied from "../pages/system/AccessDenied";
import NotFound from "../pages/system/NotFound";

import { PERMISSIONS } from "../permissionConstants/Permission";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/tenants/select"
        element={
          <AuthGuard>
            <TenantSelector />
          </AuthGuard>
        }
      />

      <Route
        element={
          <AuthGuard>
            <TenantGuard>
              <TenantLayout />
            </TenantGuard>
          </AuthGuard>
        }
      >
        <Route path="/" element={<TenantDashboard />} />

        <Route
          path="/invitations"
          element={
            <AuthGuard>
              <Invitations />
            </AuthGuard>
          }
        />

        <Route
          path="/dashboard/manager"
          element={
            <PermissionGuard permission={PERMISSIONS.MANAGER_VIEW}>
              <ManagerDashboard />
            </PermissionGuard>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <PermissionGuard permission={PERMISSIONS.TENANT_ADMIN_VIEW}>
              <TenantAdminDashboard />
            </PermissionGuard>
          }
        />

        <Route
          path="/branches"
          element={
            <PermissionGuard permission={PERMISSIONS.BRANCH_VIEW}>
              <BranchList />
            </PermissionGuard>
          }
        />
        <Route
          path="/branches/:branchId"
          element={
            <PermissionGuard permission={PERMISSIONS.BRANCH_VIEW}>
              <BranchDetail />
            </PermissionGuard>
          }
        />

        <Route
          path="/products"
          element={
            <PermissionGuard permission={PERMISSIONS.PRODUCT_VIEW}>
              <ProductList />
            </PermissionGuard>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <PermissionGuard permission={PERMISSIONS.PRODUCT_VIEW}>
              <ProductDetail />
            </PermissionGuard>
          }
        />

        <Route
          path="/inventory"
          element={
            <PermissionGuard permission={PERMISSIONS.INVENTORY_AUDIT_VIEW}>
              <InventoryTransaction />
            </PermissionGuard>
          }
        />
        <Route
          path="/inventory/branch/:branchId"
          element={
            <PermissionGuard permission={PERMISSIONS.INVENTORY_AUDIT_VIEW}>
              <BranchTransaction />
            </PermissionGuard>
          }
        />
        <Route
          path="/inventory/branch/:branchId/product/:productId"
          element={
            <PermissionGuard permission={PERMISSIONS.INVENTORY_AUDIT_VIEW}>
              <ProductTransaction />
            </PermissionGuard>
          }
        />

        <Route
          path="/members"
          element={
            <PermissionGuard permission={PERMISSIONS.MEMBER_VIEW}>
              <Members />
            </PermissionGuard>
          }
        />

        <Route
          path="/tenant/settings"
          element={
            <PermissionGuard permission={PERMISSIONS.TENANT_UPDATE}>
              <TenantSettings />
            </PermissionGuard>
          }
        />

        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route
          path="/admin"
          element={
            <PermissionGuard permission={PERMISSIONS.SUPER_ADMIN}>
              <SuperAdminDashboard />
            </PermissionGuard>
          }
        />
      </Route>

      <Route path="/403" element={<AccessDenied />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
