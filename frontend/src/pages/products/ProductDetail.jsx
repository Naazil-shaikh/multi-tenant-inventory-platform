import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  getProductById,
  updateProduct,
  updateProductStatus,
} from "../../api/product.api";

import {
  addStock,
  saleStock,
  removeStock,
  adjustStock,
} from "../../api/inventoryTransaction.api";

import { fetchBranches } from "../../api/branch.api";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [branches, setBranches] = useState([]);

  const [pageError, setPageError] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({});
  const [actionForm, setActionForm] = useState({
    branchId: "",
    quantity: "",
    note: "",
  });

  useEffect(() => {
    if (!activeTenant || !productId) return;

    const load = async () => {
      try {
        setLoading(true);
        const [pRes, bRes] = await Promise.all([
          getProductById(productId),
          fetchBranches({ limit: 100 }),
        ]);

        const p = pRes.data.data.product;
        setProduct(p);
        setForm({
          productName: p.productName,
          category: p.category || "",
          unit: p.unit,
          sellingPrice: p.sellingPrice,
          costPrice: p.costPrice || "",
        });

        setBranches(bRes.data.data.branches || []);
      } catch {
        setPageError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTenant, productId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setPageError(null);

    try {
      setSaving(true);
      const res = await updateProduct(productId, {
        ...form,
        sellingPrice: Number(form.sellingPrice),
        costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      });
      setProduct(res.data.data.product);
      setIsEditOpen(false);
    } catch (e) {
      setPageError(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async () => {
    await updateProductStatus(productId, "inactive");
    navigate("/products");
  };

  const handleInventoryAction = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (!actionForm.branchId || !actionForm.quantity) {
      setModalError("Branch and quantity are required");
      return;
    }

    if (actionType === "adjust" && !actionForm.note.trim()) {
      setModalError("Note is required for adjustment");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        quantity: Number(actionForm.quantity),
        note: actionForm.note,
      };

      const apiMap = {
        add: addStock,
        sale: saleStock,
        remove: removeStock,
        adjust: adjustStock,
      };

      await apiMap[actionType](actionForm.branchId, productId, payload);

      setActionType(null);
      setActionForm({ branchId: "", quantity: "", note: "" });
    } catch (e) {
      setModalError(e.response?.data?.message || "Inventory action failed");
    } finally {
      setSaving(false);
    }
  };

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <Centered>Loading…</Centered>;
  if (!product) return <Centered>Product not found</Centered>;

  const inventoryDisabled = branches.length === 0;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.productName}
            </h1>
            <p className="text-sm text-gray-500">
              Product details & inventory control
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-slate-100 text-slate-700 cursor-pointer hover:bg-slate-200"
            >
              Edit Product
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-red-50 text-red-700 cursor-pointer hover:bg-red-100"
            >
              Deactivate
            </button>
          </div>
        </div>

        {pageError && <ErrorBox>{pageError}</ErrorBox>}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Actions
            </h2>
            <p className="text-sm text-gray-500">
              Apply inventory changes per branch
            </p>
          </div>

          {inventoryDisabled && (
            <p className="text-sm text-gray-500">
              Create a branch to manage inventory
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {[
              ["add", "Add Stock", "green"],
              ["sale", "Sale", "blue"],
              ["remove", "Remove", "orange"],
              ["adjust", "Adjust", "purple"],
            ].map(([t, label, color]) => (
              <button
                key={t}
                disabled={inventoryDisabled}
                onClick={() => {
                  setModalError(null);
                  setActionType(t);
                }}
                className={`px-4 py-2 text-sm border border-gray-300 rounded-md cursor-pointer
                  bg-${color}-50 text-${color}-700 hover:bg-${color}-100
                  disabled:opacity-50`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {actionType && (
          <Modal onClose={() => setActionType(null)}>
            <form onSubmit={handleInventoryAction} className="space-y-4">
              <h2 className="text-lg font-semibold capitalize">
                {actionType} stock
              </h2>
              <p className="text-sm text-gray-500">
                Applied to selected branch
              </p>

              {modalError && <ErrorBox>{modalError}</ErrorBox>}

              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={actionForm.branchId}
                onChange={(e) =>
                  setActionForm({ ...actionForm, branchId: e.target.value })
                }
              >
                <option value="">Select branch</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.branchName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Quantity"
                value={actionForm.quantity}
                onChange={(e) =>
                  setActionForm({ ...actionForm, quantity: e.target.value })
                }
              />

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder={
                  actionType === "adjust"
                    ? "Note (required)"
                    : "Note (optional)"
                }
                value={actionForm.note}
                onChange={(e) =>
                  setActionForm({ ...actionForm, note: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-900 text-white hover:bg-gray-800"
                >
                  {saving ? "Processing…" : "Confirm"}
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
