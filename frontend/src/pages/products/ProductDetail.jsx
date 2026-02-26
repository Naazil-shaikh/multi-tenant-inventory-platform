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
import {
  ArrowLeft,
  Package,
  Pencil,
  PowerOff,
  AlertCircle,
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  Minus,
  RefreshCw,
  Tag,
  Ruler,
  DollarSign,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";

/* ── Action config ─────────────────────────────────────── */
const actionConfig = {
  add: {
    label: "Add Stock",
    icon: <ArrowDownCircle className="w-4 h-4" />,
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    modalColor: "text-emerald-700",
    confirmColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  sale: {
    label: "Sale",
    icon: <ArrowUpCircle className="w-4 h-4" />,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    modalColor: "text-indigo-700",
    confirmColor: "bg-indigo-600 hover:bg-indigo-700",
  },
  remove: {
    label: "Remove",
    icon: <Minus className="w-4 h-4" />,
    color: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
    modalColor: "text-red-600",
    confirmColor: "bg-red-600 hover:bg-red-700",
  },
  adjust: {
    label: "Adjust",
    icon: <RefreshCw className="w-4 h-4" />,
    color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    modalColor: "text-amber-700",
    confirmColor: "bg-amber-600 hover:bg-amber-700",
  },
};

/* ── Main component ────────────────────────────────────── */
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
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
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

  const isActive = product.status === "active";
  const inventoryDisabled = branches.length === 0;
  const activeCfg = actionType ? actionConfig[actionType] : null;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All products
      </button>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              {product.productName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Product details & inventory control
            </p>
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
            onClick={() => setIsDeactivateOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            Deactivate
          </button>
        </div>
      </div>

      {/* Page error */}
      {pageError && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {pageError}
        </div>
      )}

      {/* Meta cards */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetaCard
          icon={<Tag className="w-4 h-4 text-indigo-400" />}
          label="Category"
          value={product.category || "—"}
          accent="bg-indigo-50 border-indigo-100"
        />
        <MetaCard
          icon={<Ruler className="w-4 h-4 text-slate-400" />}
          label="Unit"
          value={product.unit}
          accent="bg-slate-50 border-slate-200"
        />
        <MetaCard
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          label="Selling Price"
          value={`₹${product.sellingPrice}`}
          accent="bg-emerald-50 border-emerald-100"
        />
        <MetaCard
          icon={<TrendingDown className="w-4 h-4 text-amber-400" />}
          label="Cost Price"
          value={product.costPrice ? `₹${product.costPrice}` : "—"}
          accent="bg-amber-50 border-amber-100"
        />
      </div> */}

      {/* Status + Stock Actions card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Stock Actions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Apply inventory changes per branch
            </p>
          </div>
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
            {product.status}
          </span>
        </div>

        {inventoryDisabled && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            No branches found. Create a branch to manage inventory.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(actionConfig).map(([type, cfg]) => (
            <button
              key={type}
              disabled={inventoryDisabled}
              onClick={() => {
                setModalError(null);
                setActionType(type);
                setActionForm({ branchId: "", quantity: "", note: "" });
              }}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${cfg.color}`}
            >
              {cfg.icon}
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Action Modal */}
      {actionType && activeCfg && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setActionType(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2
                    className={`text-base font-semibold capitalize ${activeCfg.modalColor}`}
                  >
                    {activeCfg.label}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {product.productName} · select branch & quantity
                  </p>
                </div>
                <button
                  onClick={() => setActionType(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleInventoryAction} className="p-6 space-y-4">
                {modalError && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {modalError}
                  </div>
                )}

                {/* Branch */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Branch
                  </label>
                  <select
                    className={inputClass}
                    value={actionForm.branchId}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, branchId: e.target.value })
                    }
                  >
                    <option value="">Select branch</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.branchName}
                        {b.location ? ` — ${b.location}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    placeholder="e.g. 50"
                    value={actionForm.quantity}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, quantity: e.target.value })
                    }
                  />
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Note
                    {actionType === "adjust" ? (
                      <span className="text-red-400 ml-1 normal-case tracking-normal">
                        *required
                      </span>
                    ) : (
                      <span className="text-slate-300 ml-1 normal-case tracking-normal">
                        (optional)
                      </span>
                    )}
                  </label>
                  <input
                    className={inputClass}
                    placeholder={
                      actionType === "adjust"
                        ? "Reason for adjustment…"
                        : "Add a note…"
                    }
                    value={actionForm.note}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, note: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActionType(null)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${activeCfg.confirmColor}`}
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
                        Processing…
                      </>
                    ) : (
                      <>
                        {activeCfg.icon}
                        Confirm {activeCfg.label}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Edit Product
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update product details
                  </p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                {[
                  {
                    key: "productName",
                    label: "Product Name",
                    type: "text",
                    placeholder: "e.g. Basmati Rice",
                  },
                  {
                    key: "category",
                    label: "Category",
                    type: "text",
                    placeholder: "e.g. Grains",
                  },
                  {
                    key: "unit",
                    label: "Unit",
                    type: "text",
                    placeholder: "e.g. kg, pcs",
                  },
                  {
                    key: "sellingPrice",
                    label: "Selling Price (₹)",
                    type: "number",
                    placeholder: "0.00",
                  },
                  {
                    key: "costPrice",
                    label: "Cost Price (₹)",
                    type: "number",
                    placeholder: "0.00 (optional)",
                  },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {label}
                    </label>
                    <input
                      type={type}
                      className={inputClass}
                      placeholder={placeholder}
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}

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
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Deactivate Confirm Modal */}
      {isDeactivateOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsDeactivateOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <TriangleAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Deactivate Product?
                  </h2>
                  <p className="text-sm text-slate-400 mt-1.5">
                    <span className="font-medium text-slate-600">
                      {product.productName}
                    </span>{" "}
                    will be marked inactive and hidden from operations.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsDeactivateOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSoftDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────── */
const MetaCard = ({ icon, label, value, accent }) => (
  <div className={`rounded-2xl border p-4 flex flex-col gap-2.5 ${accent}`}>
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
);

const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
