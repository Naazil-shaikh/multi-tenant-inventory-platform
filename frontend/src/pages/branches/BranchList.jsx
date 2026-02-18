import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchBranches, createBranch } from "../../api/branch.api";

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

      const res = await fetchBranches({
        page,
        limit: pagination.limit,
      });

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
        Loading branches…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      {pageError && <div className="text-sm text-red-600">{pageError}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Branches</h1>
          <p className="text-sm text-gray-500">
            List of branches under the active tenant
          </p>
        </div>

        <button
          onClick={() => {
            setModalError(null);
            setShowCreate(true);
          }}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md
                     bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
        >
          + Add Branch
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Branch Name</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>

          <tbody>
            {branches.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No branches found
                </td>
              </tr>
            )}

            {branches.map((branch) => (
              <tr key={branch._id} className="border-t">
                <TableCell>{branch.branchName}</TableCell>
                <TableCell>{branch.location}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      branch.branchStatus === "active"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {branch.branchStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/branches/${branch._id}`)}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={!pagination.hasPrev}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            className={`px-3 py-1 rounded border text-sm ${
              pagination.hasPrev
                ? "bg-white hover:bg-gray-50 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Prev
          </button>

          <button
            disabled={!pagination.hasNext}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            className={`px-3 py-1 rounded border text-sm ${
              pagination.hasNext
                ? "bg-white hover:bg-gray-50 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {showCreate && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowCreate(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <form
              onSubmit={handleCreateBranch}
              className="bg-white rounded-lg shadow-xl
                         w-full max-w-md p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold">Create Branch</h2>

              {modalError && (
                <p className="text-sm text-red-600">{modalError}</p>
              )}

              <input
                placeholder="Branch Name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={form.branchName}
                onChange={(e) =>
                  setForm({ ...form, branchName: e.target.value })
                }
              />

              <input
                placeholder="Location"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded
                             bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  disabled={creating}
                  className="px-4 py-2 text-sm border border-gray-300 rounded
                             bg-gray-900 text-white hover:bg-gray-800"
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-6 py-4 text-sm text-gray-800">{children}</td>;
}
