import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, createProduct } from "../../api/product.api";
import {
  Package,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Tag,
  Ruler,
  DollarSign,
  TrendingDown,
} from "lucide-react";

export default function ProductList() {
  const navigate = useNavigate();
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    category: "",
    unit: "",
    sellingPrice: "",
    costPrice: "",
    status: "active",
  });

  useEffect(() => {
    if (!activeTenant) return;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetchProducts({ page, limit: pagination.limit });
        const { products, pagination: pageData } = res.data.data;
        setProducts(products);
        setPagination(pageData);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [activeTenant, page]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.productName || !form.unit || !form.sellingPrice) {
      setError("Product name, unit and selling price are required");
      return;
    }
    try {
      setCreating(true);
      const res = await createProduct({
        ...form,
        sellingPrice: Number(form.sellingPrice),
        costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      });
      setProducts((prev) => [res.data.data.product, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () =>
    setForm({
      productName: "",
      category: "",
      unit: "",
      sellingPrice: "",
      costPrice: "",
      status: "active",
    });

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <Centered>Loading products…</Centered>;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Package className="w-[18px] h-[18px] text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              Products
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {pagination.total ?? products.length} product
              {pagination.total !== 1 ? "s" : ""} in{" "}
              <span className="font-medium text-slate-500">
                {activeTenant?.tenantName}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setError(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {[
                "Product",
                "Category",
                "Unit",
                "Selling Price",
                "Cost Price",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">No products found</p>
                    <button
                      onClick={() => {
                        setError(null);
                        resetForm();
                        setShowModal(true);
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Add your first product →
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isActive = product.status === "active";
                return (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Product name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          {product.productName}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {product.category ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Unit */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        <Ruler className="w-3 h-3" />
                        {product.unit}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <DollarSign className="w-3 h-3" />
                        {product.sellingPrice}
                      </span>
                    </td>

                    {/* Cost Price */}
                    <td className="px-6 py-4">
                      {product.costPrice ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold">
                          <TrendingDown className="w-3 h-3" />
                          {product.costPrice}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>

                    {/* Status */}
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
                        {product.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
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

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-600">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {pagination.totalPages}
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                  pagination.hasPrev
                    ? "bg-white border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-600"
                    : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                  pagination.hasNext
                    ? "bg-white border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-600"
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
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Add Product
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add a new product to your catalog
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                {error && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Basmati Rice"
                    value={form.productName}
                    onChange={(e) =>
                      setForm({ ...form, productName: e.target.value })
                    }
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Category
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Grains"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>

                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Unit <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. kg, pcs, litre"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>

                {/* Prices — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Selling Price (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      placeholder="0.00"
                      value={form.sellingPrice}
                      onChange={(e) =>
                        setForm({ ...form, sellingPrice: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      placeholder="0.00"
                      value={form.costPrice}
                      onChange={(e) =>
                        setForm({ ...form, costPrice: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Status
                  </label>
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? (
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
                        Creating…
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Product
                      </>
                    )}
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
