import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchBranches, createBranch } from "../../api/branch.api";
import {
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  X,
  Building2,
} from "lucide-react";

export default function BranchList() {
  const navigate = useNavigate();
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [pageError, setPageError] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ branchName: "", location: "" });

  const loadBranches = async (page = pagination.page) => {
    try {
      setLoading(true);
      setPageError(null);
      const res = await fetchBranches({ page, limit: pagination.limit });
      const { branches, pagination: pageData } = res.data.data;
      setBranches(branches);
      setPagination((p) => ({ ...p, ...pageData }));
    } catch (e) {
      setPageError(e.response?.data?.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeTenant) return;
    loadBranches(pagination.page);
  }, [activeTenant, pagination.page]);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!form.branchName.trim()) {
      setModalError("Branch name is required");
      return;
    }
    try {
      setCreating(true);
      setModalError(null);
      await createBranch(form);
      setShowCreate(false);
      setForm({ branchName: "", location: "" });
      await loadBranches(1);
    } catch (e) {
      setModalError(e.response?.data?.message || "Failed to create branch");
    } finally {
      setCreating(false);
    }
  };

  if (!activeTenant) return <Centered>No tenant selected</Centered>;

  if (loading) return <Centered>Loading branches…</Centered>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Building2 className="w-4.5 h-4.5 w-[18px] h-[18px] text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              Branches
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {branches.length} branch{branches.length !== 1 ? "es" : ""} under{" "}
              <span className="font-medium text-slate-500">
                {activeTenant?.tenantName}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setModalError(null);
            setShowCreate(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      {/* Page error */}
      {pageError && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {pageError}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Branch Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {branches.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">No branches found</p>
                    <button
                      onClick={() => {
                        setModalError(null);
                        setShowCreate(true);
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Create your first branch →
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              branches.map((branch) => {
                const isActive = branch.branchStatus === "active";
                return (
                  <tr
                    key={branch._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          {branch.branchName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {branch.location || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-red-400"
                          }`}
                        />
                        {branch.branchStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/branches/${branch._id}`)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination — inside card, bottom border area */}
        {branches.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Page{" "}
              <span className="font-semibold text-slate-600">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                disabled={!pagination.hasPrev}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-slate-600 transition-colors ${
                  pagination.hasPrev
                    ? "bg-white border-slate-200 hover:bg-slate-100 cursor-pointer"
                    : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={!pagination.hasNext}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                className={`w-8 h-8 flex items-center justify-center rounded-lg border text-slate-600 transition-colors ${
                  pagination.hasNext
                    ? "bg-white border-slate-200 hover:bg-slate-100 cursor-pointer"
                    : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setShowCreate(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Create Branch
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add a new branch to your tenant
                  </p>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleCreateBranch} className="p-6 space-y-4">
                {modalError && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {modalError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Branch Name
                  </label>
                  <input
                    placeholder="e.g. Downtown Store"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors"
                    value={form.branchName}
                    onChange={(e) =>
                      setForm({ ...form, branchName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Location
                  </label>
                  <input
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? "Creating…" : "Create Branch"}
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

const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
