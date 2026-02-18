import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchTenantDashboard } from "../../api/dashboard.api";

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
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [activeTenant]);

  if (!activeTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No tenant selected
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  const { tenantName, KPIs, recentActivities } = dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/tenants/select")}
            className="text-gray-600 hover:text-gray-900 mb-5"
            title="Back to Tenant Selector"
          >
            ← Go Back
          </button>
          <p className="text-sm text-gray-500">Active Tenant</p>
          <h1 className="text-2xl font-semibold text-gray-900">{tenantName}</h1>
        </div>

        <button
          onClick={() => navigate("/tenant/settings")}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100"
        >
          Tenant Settings
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Products"
          value={KPIs.totalProducts}
          onClick={() => navigate("/products")}
        />
        <KpiCard
          label="Branches"
          value={KPIs.totalBranches}
          onClick={() => navigate("/branches")}
        />
        <KpiCard
          label="Members"
          value={KPIs.totalMembers}
          onClick={() => navigate("/members")}
        />
        <KpiCard
          label="Low Stock"
          value={KPIs.lowStockCount}
          danger
          onClick={() => navigate("/inventory?filter=low-stock")}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>

        {recentActivities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity</p>
        ) : (
          <ul className="space-y-4">
            {recentActivities.map((a) => (
              <li key={a.id} className="border-b last:border-b-0 pb-3">
                <div className="text-sm text-gray-800">
                  <span className="font-medium">{a.type}</span>

                  {a.product && (
                    <>
                      {" "}
                      —{" "}
                      <Link
                        to={`/products/${a.productId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {a.product}
                      </Link>
                    </>
                  )}

                  {a.branch && (
                    <>
                      {" "}
                      @{" "}
                      <Link
                        to={`/branches/${a.branchId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {a.branch}
                      </Link>
                    </>
                  )}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, onClick, danger = false }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-6 cursor-pointer transition shadow-sm hover:shadow-md
        ${danger ? "bg-red-50 border border-red-300" : "bg-white"}`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={`text-3xl font-semibold ${
          danger ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
