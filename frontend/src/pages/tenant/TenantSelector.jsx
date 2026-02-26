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
import {
  Building2,
  Plus,
  AlertCircle,
  X,
  ChevronRight,
  Crown,
  Zap,
  Gift,
  CheckCircle2,
} from "lucide-react";

/* ── Plan config ───────────────────────────────────────── */
const planConfig = {
  free: {
    label: "Free",
    icon: <Gift className="w-3 h-3" />,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  pro: {
    label: "Pro",
    icon: <Zap className="w-3 h-3" />,
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  enterprise: {
    label: "Enterprise",
    icon: <Crown className="w-3 h-3" />,
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
};

const getPlanConfig = (plan = "") =>
  planConfig[plan.toLowerCase()] || planConfig.free;

export default function TenantSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants } = useSelector((state) => state.tenant);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [plan, setPlan] = useState("free");
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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
    setSelectedId(tenant._id);
    setTimeout(() => {
      dispatch(setActiveTenant(tenant));
      dispatch(setPermissions(ROLE_PERMISSIONS[tenant.role] || []));
      navigate("/", { replace: true });
    }, 180);
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

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      {/* <div className="bg-white border-b border-slate-200"> */}
      <div className="bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">
              S
            </div> */}
            <span className="text-3xl font-bold text-slate-900">
              SELECT TENANT
            </span>
          </div>
          <button
            onClick={() => {
              setError(null);
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Tenant</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
            Your workspaces
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Select a tenant to continue, or create a new one.
          </p>
        </div>

        {/* Empty state */}
        {tenants.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-base font-semibold text-slate-800 mb-1">
              No tenants yet
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Create your first workspace to get started.
            </p>
            <button
              onClick={() => {
                setError(null);
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Tenant
            </button>
          </div>
        )}

        {/* Tenant grid */}
        {tenants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => {
              const planCfg = getPlanConfig(tenant.plan);
              const isActive = tenant.status === "active";
              const isSelected = selectedId === tenant._id;

              return (
                <button
                  key={tenant._id}
                  onClick={() => handleSelectTenant(tenant)}
                  className={`group w-full text-left bg-white rounded-2xl border transition-all duration-150 p-5 ${
                    isSelected
                      ? "border-indigo-400 ring-2 ring-indigo-400/20 shadow-md"
                      : "border-slate-200 hover:border-indigo-300 hover:shadow-md"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-4.5 h-4.5 w-[18px] h-[18px] text-indigo-500" />
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    )}
                  </div>

                  {/* Tenant name */}
                  <p className="text-sm font-semibold text-slate-900 leading-snug mb-3 truncate">
                    {tenant.tenantName}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Plan badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${planCfg.className}`}
                    >
                      {planCfg.icon}
                      {planCfg.label}
                    </span>

                    {/* Status dot */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        isActive ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-red-400"
                        }`}
                      />
                      {tenant.status}
                    </span>
                  </div>

                  {/* Role */}
                  {tenant.role && (
                    <p className="text-[11px] text-slate-400 mt-2.5 capitalize">
                      Role: {tenant.role}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsCreateOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Create Tenant
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Set up a new workspace
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
                {error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Tenant name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Tenant Name
                  </label>
                  <input
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                {/* Plan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Plan
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className={inputClass}
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                {/* Plan hint cards */}
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(planConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPlan(key)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                        plan === key
                          ? `${cfg.className} ring-2 ring-offset-1 ring-indigo-400/30`
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span>{cfg.icon}</span>
                      <span className="text-[11px] font-semibold">
                        {cfg.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                          />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create
                      </>
                    )}
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
