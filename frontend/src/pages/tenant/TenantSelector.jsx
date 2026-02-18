import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setActiveTenant,
  setTenantList,
  clearActiveTenant,
} from "../../store/slices/tenantSlice";
import {
  setPermissions,
  clearPermissions,
} from "../../store/slices/permissionSlice";

import {
  fetchMyTenants,
  createTenant as createTenantApi,
} from "../../api/tenant.api";

import { ROLE_PERMISSIONS } from "../../permissionConstants/RolePermission";
import { Building2, Plus, AlertCircle } from "lucide-react";

export default function TenantSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tenants } = useSelector((state) => state.tenant);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [plan, setPlan] = useState("free");
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const res = await fetchMyTenants();

        const normalized = res.data.data.tenants.map((t) => {
          const role =
            t.role || t.membership?.role || t.memberships?.[0]?.role || null;

          return {
            _id: t._id,
            tenantName: t.tenantName,
            plan: t.plan,
            status: t.status,
            role,
          };
        });

        dispatch(setTenantList(normalized));
      } catch {
        dispatch(setTenantList([]));
      }
    };

    loadTenants();
  }, [dispatch]);

  const handleSelectTenant = (tenant) => {
    dispatch(setActiveTenant(tenant));
    dispatch(setPermissions(ROLE_PERMISSIONS[tenant.role] || []));
    navigate("/", { replace: true });
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    setError(null);

    if (!tenantName.trim()) {
      setError("Tenant name is required");
      return;
    }

    try {
      setCreating(true);

      const res = await createTenantApi({ tenantName, plan });
      const t = res.data.data.tenant;

      const newTenant = {
        _id: t._id,
        tenantName: t.tenantName,
        plan: t.plan,
        status: t.status,
        role: "tenantAdmin",
      };

      dispatch(setTenantList([newTenant, ...tenants]));
      dispatch(setActiveTenant(newTenant));
      dispatch(setPermissions(ROLE_PERMISSIONS[newTenant.role]));

      setIsCreateOpen(false);
      setTenantName("");
      setPlan("free");

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create tenant");
      dispatch(clearActiveTenant());
      dispatch(clearPermissions());
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Select a Tenant
          </h1>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white text-sm"
          >
            <Plus className="h-4 w-4" />
            Create Tenant
          </button>
        </div>

        {tenants.length === 0 && (
          <div className="bg-white border rounded-lg p-10 text-center">
            <Building2 className="h-10 w-10 mx-auto text-gray-400 mb-4" />
            <h2 className="text-lg font-medium">No tenants found</h2>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm"
            >
              Create Tenant
            </button>
          </div>
        )}

        {tenants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <div
                key={tenant._id}
                onClick={() => handleSelectTenant(tenant)}
                className="cursor-pointer bg-white rounded-lg border p-6 hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-4">
                  {tenant.tenantName}
                </h2>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Plan</span>
                  <span className="capitalize font-medium">{tenant.plan}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`font-medium ${
                      tenant.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreateOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsCreateOpen(false)}
          />

          <div className="fixed inset-0 z-20 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Create Tenant</h2>

              {error && (
                <div className="mb-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateTenant} className="space-y-4">
                <input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Tenant name"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />

                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 text-sm border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 text-sm bg-black text-white rounded-md"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
