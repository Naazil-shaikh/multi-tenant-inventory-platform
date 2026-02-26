import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getTenantDetails,
  updateTenantName,
  updateTenantStatus,
} from "../../api/tenant.api.js";
import {
  Settings,
  Building2,
  Pencil,
  AlertCircle,
  CheckCircle2,
  Crown,
  Zap,
  Gift,
  Power,
  Mail,
  XCircle,
  Tag,
} from "lucide-react";

/* ── Plan config ───────────────────────────────────────── */
const planConfig = {
  free: {
    label: "Free",
    icon: <Gift className="w-3.5 h-3.5" />,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  pro: {
    label: "Pro",
    icon: <Zap className="w-3.5 h-3.5" />,
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  enterprise: {
    label: "Enterprise",
    icon: <Crown className="w-3.5 h-3.5" />,
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
};

const getPlanConfig = (plan = "") =>
  planConfig[plan.toLowerCase()] || planConfig.free;

export default function TenantSettings() {
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [tenantName, setTenantName] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!activeTenant) return;
    const loadTenant = async () => {
      try {
        setLoading(true);
        const res = await getTenantDetails();
        const t = res.data.data.tenant;
        setTenant(t);
        setTenantName(t.tenantName);
        setStatus(t.status);
      } catch {
        setError("Failed to load tenant details");
      } finally {
        setLoading(false);
      }
    };
    loadTenant();
  }, [activeTenant]);

  const handleRename = async () => {
    if (!tenantName.trim()) {
      setError("Tenant name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await updateTenantName(tenantName);
      setTenant(res.data.data.tenant);
      setSuccess("Tenant name updated successfully");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update tenant name");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await updateTenantStatus({ status });
      setTenant(res.data.data.tenant);
      setSuccess(
        `Tenant ${status === "active" ? "activated" : "suspended"} successfully`,
      );
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update tenant status");
    } finally {
      setSaving(false);
    }
  };

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <SettingsSkeleton />;
  if (!tenant) return <Centered>Tenant not found</Centered>;

  const isActive = tenant.status === "active";
  const planCfg = getPlanConfig(tenant.plan);

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <Settings className="w-[18px] h-[18px] text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 leading-tight">
            Tenant Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage tenant configuration and lifecycle
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 border-l-[3px] border-l-emerald-500 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          {success}
        </div>
      )}

      {/* Tenant overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Tenant Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Name */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Name
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {tenant.tenantName}
            </p>
          </div>

          {/* Plan */}
          <div
            className={`rounded-xl border p-4 flex flex-col gap-2 ${planCfg.className}`}
          >
            <div className="flex items-center gap-1.5">
              {planCfg.icon}
              <span className="text-xs font-semibold uppercase tracking-widest opacity-70">
                Plan
              </span>
            </div>
            <p className="text-sm font-semibold capitalize">{tenant.plan}</p>
          </div>

          {/* Status */}
          <div
            className={`rounded-xl border p-4 flex flex-col gap-2 ${
              isActive
                ? "bg-emerald-50 border-emerald-100"
                : "bg-red-50 border-red-100"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Power
                className={`w-3.5 h-3.5 ${
                  isActive ? "text-emerald-500" : "text-red-400"
                }`}
              />
              <span className="text-xs font-semibold uppercase tracking-widest opacity-70">
                Status
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
              <p
                className={`text-sm font-semibold capitalize ${
                  isActive ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {tenant.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rename */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Rename Tenant
          </h2>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Tenant Name
          </label>
          <input
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder="Enter tenant name"
            className={inputClass}
          />
        </div>

        <div className="flex justify-end">
          <button
            disabled={saving || tenantName === tenant.tenantName}
            onClick={handleRename}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
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
                Saving…
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                Save Name
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tenant status — read only info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Tenant Status
          </h2>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">
          This tenant is currently{" "}
          <span
            className={`font-semibold ${
              isActive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {tenant.status}
          </span>
          . Status changes can only be performed by a platform administrator.
        </p>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          Contact platform support to activate, suspend, or close this tenant.
        </div>
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Account Actions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            For serious account changes, reach out to our support team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() =>
              (window.location.href = "mailto:naazils727@gmail.com")
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Support
          </button>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
            <XCircle className="w-3.5 h-3.5" />
            Request Account Closure
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────── */
function SettingsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-36 bg-slate-200 rounded-lg" />
          <div className="h-3 w-52 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Overview card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="h-4 w-32 bg-slate-200 rounded mb-5" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2"
            >
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Rename card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-100 rounded-lg" />
        <div className="flex justify-end">
          <div className="h-9 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Status + Actions cards */}
      {[180, 140].map((h, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="h-4 w-32 bg-slate-200 rounded mb-3" />
          <div className="h-3 w-full bg-slate-100 rounded mb-1.5" />
          <div className="h-3 w-3/4 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────── */
const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
