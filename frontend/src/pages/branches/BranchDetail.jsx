import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchBranchInventory } from "../../api/inventory.api";
import {
  getBranchById,
  updateBranch,
  updateBranchStatus,
} from "../../api/branch.api";

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
  const [form, setForm] = useState({
    branchName: "",
    location: "",
  });

  useEffect(() => {
    if (!activeTenant || !branchId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getBranchById(branchId);
        const b = res.data.data.branch;

        setBranch(b);
        setForm({
          branchName: b.branchName,
          location: b.location,
        });
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
  if (loading) return <Centered>Loading…</Centered>;
  if (!branch) return <Centered>Branch not found</Centered>;

  const isActive = branch.branchStatus === "active";

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {branch.branchName}
            </h1>
            <p className="text-sm text-gray-500">
              Branch configuration & operational status
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md
                         bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Edit Branch
            </button>

            <button
              onClick={handleToggleStatus}
              disabled={saving}
              className={`px-4 py-2 text-sm border rounded-md cursor-pointer
                ${
                  isActive
                    ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                    : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                }`}
            >
              {isActive ? "Close Branch" : "Reopen Branch"}
            </button>
          </div>
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Meta label="Location" value={branch.location} />
            <Meta
              label="Status"
              value={branch.branchStatus}
              valueClass={isActive ? "text-green-700" : "text-red-700"}
            />
            <Meta label="Branch ID" value={branch._id} mono />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Current Inventory
              </h2>
              <p className="text-sm text-gray-500">
                Live stock available in this branch
              </p>
            </div>

            <button
              onClick={() => navigate(`/inventory/branch/${branchId}`)}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              View full inventory →
            </button>
          </div>

          {inventoryLoading && (
            <p className="text-sm text-gray-500">Loading inventory…</p>
          )}

          {!inventoryLoading && inventory.length === 0 && (
            <p className="text-sm text-gray-500">
              No products in inventory yet
            </p>
          )}

          {!inventoryLoading && inventory.length > 0 && (
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader>Product</TableHeader>
                    <TableHeader>Quantity</TableHeader>
                    <TableHeader>Unit</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item) => (
                    <tr key={item._id} className="border-t">
                      <TableCell>{item.productId?.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.productId?.unit}</TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            navigate(
                              `/inventory/branch/${branchId}/product/${item.productId?._id}`
                            )
                          }
                          className="text-sm cursor-pointer text-blue-600 hover:underline"
                        >
                          View
                        </button>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Branch Operations
            </h2>
            <p className="text-sm text-gray-500">
              Inventory and stock data for this branch
            </p>
          </div>

          <button
            onClick={() => navigate(`/inventory/branch/${branchId}`)}
            className="inline-flex items-center gap-2 cursor-pointer
                       px-5 py-2.5 text-sm border border-gray-300 rounded-md
                       bg-gray-900 text-white hover:bg-gray-800"
          >
            View Branch Inventory →
          </button>
        </div>

        {isEditOpen && (
          <Modal onClose={() => setIsEditOpen(false)}>
            <form onSubmit={handleUpdate} className="space-y-4">
              <h2 className="text-lg font-semibold">Edit Branch</h2>

              <div>
                <p className="text-sm text-gray-600 mb-1">Branch Name</p>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={form.branchName}
                  onChange={(e) =>
                    setForm({ ...form, branchName: e.target.value })
                  }
                />
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md
                             bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md
                             bg-gray-900 text-white hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}

const Centered = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    {children}
  </div>
);

const Meta = ({ label, value, valueClass = "", mono = false }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p
      className={`font-medium ${valueClass} ${
        mono ? "font-mono text-xs break-all" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

const ErrorBox = ({ children }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
    {children}
  </div>
);

const Modal = ({ children, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {children}
      </div>
    </div>
  </>
);

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
