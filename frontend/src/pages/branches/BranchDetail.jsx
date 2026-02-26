import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchBranchInventory } from "../../api/inventory.api";
import {
  getBranchById,
  updateBranch,
  updateBranchStatus,
} from "../../api/branch.api";
import {
  MapPin,
  Hash,
  ArrowLeft,
  Pencil,
  PowerOff,
  Power,
  ArrowRight,
  PackageOpen,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";

export default function BranchDetail() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({ branchName: "", location: "" });

  useEffect(() => {
    if (!activeTenant || !branchId) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getBranchById(branchId);
        const b = res.data.data.branch;
        setBranch(b);
        setForm({ branchName: b.branchName, location: b.location });
      } catch {
        setError("Failed to load branch");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTenant, branchId]);

  useEffect(() => {
    if (!activeTenant || !branchId) return;
    const loadInventory = async () => {
      try {
        setInventoryLoading(true);
        const res = await fetchBranchInventory(branchId, { limit: 5 });
        setInventory(res.data.data.inventory || []);
      } catch {
        setInventory([]);
      } finally {
        setInventoryLoading(false);
      }
    };
    loadInventory();
  }, [activeTenant, branchId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      const res = await updateBranch(branchId, form);
      setBranch(res.data.data.branch);
      setIsEditOpen(false);
    } catch (e) {
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setSaving(true);
      const next = branch.branchStatus === "active" ? "closed" : "active";
      const res = await updateBranchStatus(branchId, next);
      setBranch(res.data.data.branch);
    } catch {
      setError("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <Centered>Loading branch…</Centered>;
  if (!branch) return <Centered>Branch not found</Centered>;

  const isActive = branch.branchStatus === "active";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/branches")}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All branches
      </button>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Icon block */}
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              {branch.branchName}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">{branch.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>

          <button
            onClick={handleToggleStatus}
            disabled={saving}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isActive
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {isActive ? (
              <PowerOff className="w-3.5 h-3.5" />
            ) : (
              <Power className="w-3.5 h-3.5" />
            )}
            {isActive ? "Close Branch" : "Reopen Branch"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Meta cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetaCard
          label="Location"
          value={branch.location}
          icon={<MapPin className="w-4 h-4 text-indigo-400" />}
          accent="indigo"
        />
        <MetaCard
          label="Status"
          icon={
            isActive ? (
              <Power className="w-4 h-4 text-emerald-500" />
            ) : (
              <PowerOff className="w-4 h-4 text-red-400" />
            )
          }
          accent={isActive ? "emerald" : "red"}
          value={
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-semibold capitalize ${
                isActive ? "text-emerald-600" : "text-red-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
              {branch.branchStatus}
            </span>
          }
        />
        <MetaCard
          label="Branch ID"
          value={
            <span className="font-mono text-xs text-slate-500 break-all">
              {branch._id}
            </span>
          }
          icon={<Hash className="w-4 h-4 text-slate-400" />}
          accent="slate"
        />
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Current Inventory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live stock available in this branch
            </p>
          </div>
          <button
            onClick={() => navigate(`/inventory/branch/${branchId}`)}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {inventoryLoading && (
          <div className="px-6 py-10 text-center text-sm text-slate-400">
            Loading inventory…
          </div>
        )}

        {!inventoryLoading && inventory.length === 0 && (
          <div className="px-6 py-12 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <PackageOpen className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">
              No products in inventory yet
            </p>
          </div>
        )}

        {!inventoryLoading && inventory.length > 0 && (
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3.5 text-sm font-medium text-slate-800">
                    {item.productId?.productName}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-500">
                    {item.productId?.unit}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() =>
                        navigate(
                          `/inventory/branch/${branchId}/product/${item.productId?._id}`,
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      View
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Operations CTA */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Branch Operations
          </h2>
          <p className="text-sm text-indigo-200 mt-0.5">
            View full inventory history and stock transactions for this branch.
          </p>
        </div>
        <button
          onClick={() => navigate(`/inventory/branch/${branchId}`)}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors"
        >
          View Inventory
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Edit Branch
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update branch details
                  </p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Branch Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors"
                    value={form.branchName}
                    onChange={(e) =>
                      setForm({ ...form, branchName: e.target.value })
                    }
                    placeholder="Branch name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Location
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="City, Country"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving…" : "Save Changes"}
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

/* ── Sub-components ─────────────────────────────────────── */

const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);

const accentMap = {
  indigo: "bg-indigo-50 border-indigo-100",
  emerald: "bg-emerald-50 border-emerald-100",
  red: "bg-red-50 border-red-100",
  slate: "bg-slate-50 border-slate-200",
};

const MetaCard = ({ label, value, icon, accent = "slate" }) => (
  <div
    className={`rounded-2xl border p-5 flex flex-col gap-3 ${accentMap[accent]}`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
    <div className="text-sm font-medium text-slate-800">{value}</div>
  </div>
);
