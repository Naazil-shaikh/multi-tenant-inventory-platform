import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  getTenantDetails,
  updateTenantName,
  updateTenantStatus,
} from "../../api/tenant.api.js";

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
        Loading tenant settings…
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Tenant not found
      </div>
    );
  }

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
      console.log("1");
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
      setSuccess(`Tenant ${status === "active" ? "activated" : "suspended"}`);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update tenant status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Tenant Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage tenant configuration and lifecycle
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tenant Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <OverviewItem label="Tenant Name" value={tenant.tenantName} />
          <OverviewItem label="Plan" value={tenant.plan} />
          <OverviewItem
            label="Status"
            value={tenant.status}
            valueClass={
              tenant.status === "active" ? "text-green-700" : "text-red-700"
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Rename Tenant</h2>

        <input
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />

        <button
          disabled={saving}
          onClick={handleRename}
          className="px-4 py-2 text-sm border border-gray-300 rounded bg-slate-100 hover:bg-slate-200"
        >
          {saving ? "Saving…" : "Save Name"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Tenant Status</h2>

        <p className="text-sm text-gray-600">
          This tenant is currently
          <span
            className={`ml-1 font-medium ${
              tenant.status === "active" ? "text-green-700" : "text-red-700"
            }`}
          >
            {tenant.status}
          </span>
        </p>

        <p className="text-xs text-gray-500">
          Tenant status can only be changed by a platform administrator.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Account Actions</h2>

        <p className="text-sm text-gray-600">
          If you want to suspend or close this tenant, please contact platform
          support.
        </p>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded
                 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            onClick={() =>
              (window.location.href = "mailto:naazils727@gmail.com")
            }
          >
            Contact Support
          </button>

          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded
                 bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Request Account Closure
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewItem({ label, value, valueClass = "" }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}
