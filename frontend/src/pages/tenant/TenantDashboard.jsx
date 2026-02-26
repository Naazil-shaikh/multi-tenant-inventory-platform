import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchTenantDashboard } from "../../api/dashboard.api";
import {
  Package,
  Building2,
  Users,
  AlertTriangle,
  Settings,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Minus,
  Activity,
} from "lucide-react";

/* ── KPI config ────────────────────────────────────────── */
const kpiConfig = {
  Products: {
    icon: <Package className="w-5 h-5 text-indigo-500" />,
    accent: "bg-indigo-50 border-indigo-100",
    valueColor: "text-indigo-700",
    route: "/products",
  },
  Branches: {
    icon: <Building2 className="w-5 h-5 text-emerald-500" />,
    accent: "bg-emerald-50 border-emerald-100",
    valueColor: "text-emerald-700",
    route: "/branches",
  },
  Members: {
    icon: <Users className="w-5 h-5 text-violet-500" />,
    accent: "bg-violet-50 border-violet-100",
    valueColor: "text-violet-700",
    route: "/members",
  },
  "Low Stock": {
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    accent: "bg-red-50 border-red-200",
    valueColor: "text-red-600",
    route: "/inventory?filter=low-stock",
  },
};

/* ── Activity type icon ────────────────────────────────── */
const activityIcon = (type = "") => {
  const t = type.toUpperCase();
  if (t.includes("ADD") || t.includes("IN"))
    return <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-500" />;
  if (t.includes("SALE") || t.includes("OUT"))
    return <ArrowUpCircle className="w-3.5 h-3.5 text-red-400" />;
  if (t.includes("ADJUST"))
    return <RefreshCw className="w-3.5 h-3.5 text-amber-500" />;
  if (t.includes("REMOVE"))
    return <Minus className="w-3.5 h-3.5 text-rose-500" />;
  return <Activity className="w-3.5 h-3.5 text-slate-400" />;
};

export default function TenantDashboard() {
  const navigate = useNavigate();
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    if (!activeTenant) return;
    const loadDashboard = async () => {
      try {
        const res = await fetchTenantDashboard();
        setDashboard(res.data.data);
      } catch {
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [activeTenant]);

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <DashboardSkeleton />;
  if (!dashboard)
    return (
      <Centered className="text-red-500">Failed to load dashboard</Centered>
    );

  const { tenantName, KPIs, recentActivities } = dashboard;

  const kpiItems = [
    { label: "Products", value: KPIs.totalProducts },
    { label: "Branches", value: KPIs.totalBranches },
    { label: "Members", value: KPIs.totalMembers },
    { label: "Low Stock", value: KPIs.lowStockCount },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/tenants/select")}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-3"
          >
            ← Switch workspace
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Active Tenant
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 leading-tight">
            {tenantName}
          </h1>
        </div>

        <button
          onClick={() => navigate("/tenant/settings")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0 self-start"
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiItems.map(({ label, value }) => {
          const cfg = kpiConfig[label];
          return (
            <button
              key={label}
              onClick={() => navigate(cfg.route)}
              className={`group w-full text-left rounded-2xl border p-5 hover:shadow-md transition-all duration-150 ${cfg.accent}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center">
                  {cfg.icon}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p
                className={`text-3xl font-bold ${cfg.valueColor} leading-none mb-1.5`}
              >
                {value ?? "—"}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Activity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest inventory transactions
            </p>
          </div>
          <button
            onClick={() => navigate("/inventory")}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activity list */}
        {!recentActivities?.length ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentActivities.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 px-6 py-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Icon */}
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {activityIcon(a.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
                    <span className="font-semibold text-slate-700 capitalize">
                      {a.type}
                    </span>

                    {a.product && (
                      <>
                        <span className="text-slate-300">·</span>
                        <Link
                          to={`/products/${a.productId}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors truncate"
                        >
                          {a.product}
                        </Link>
                      </>
                    )}

                    {a.branch && (
                      <>
                        <span className="text-slate-300">@</span>
                        <Link
                          to={`/branches/${a.branchId}`}
                          className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors truncate"
                        >
                          {a.branch}
                        </Link>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    ·{" "}
                    {new Date(a.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-100 rounded" />
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-9 w-24 bg-slate-200 rounded-xl" />
      </div>

      {/* KPI skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-200 mb-4" />
            <div className="h-8 w-16 bg-slate-200 rounded-lg mb-2" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Activity skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-4 w-14 bg-slate-100 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-6 py-4 border-b border-slate-100"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-48 bg-slate-100 rounded" />
              <div className="h-3 w-28 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────── */
const Centered = ({ children, className = "" }) => (
  <div
    className={`flex items-center justify-center h-64 text-sm text-slate-400 ${className}`}
  >
    {children}
  </div>
);
