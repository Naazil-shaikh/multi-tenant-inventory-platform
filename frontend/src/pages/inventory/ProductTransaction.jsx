import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProductById } from "../../api/product.api";
import { fetchProductTransactions } from "../../api/inventoryTransaction.api";
import {
  ArrowLeft,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Minus,
  ClipboardList,
  Tag,
  Ruler,
  Power,
} from "lucide-react";

/* ── Transaction type config ───────────────────────────── */
const typeConfig = {
  ADD: {
    label: "Add",
    icon: <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-500" />,
    className: "bg-emerald-50 text-emerald-700",
  },
  SALE: {
    label: "Sale",
    icon: <ArrowUpCircle className="w-3.5 h-3.5 text-red-400" />,
    className: "bg-red-50 text-red-600",
  },
  REMOVE: {
    label: "Remove",
    icon: <Minus className="w-3.5 h-3.5 text-rose-500" />,
    className: "bg-rose-50 text-rose-700",
  },
  ADJUST: {
    label: "Adjust",
    icon: <RefreshCw className="w-3.5 h-3.5 text-amber-500" />,
    className: "bg-amber-50 text-amber-700",
  },
};

const getTypeConfig = (type = "") => {
  const key = type.toUpperCase();
  return (
    typeConfig[key] || {
      label: type,
      icon: null,
      className: "bg-slate-100 text-slate-600",
    }
  );
};

/* ── Main component ────────────────────────────────────── */
export default function ProductInventoryTransactions() {
  const { productId, branchId } = useParams();
  const navigate = useNavigate();
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    if (!activeTenant || !productId || !branchId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const productRes = await getProductById(productId);
        setProduct(productRes.data.data.product);
        const txRes = await fetchProductTransactions(branchId, productId, {
          page,
          limit: pagination.limit,
        });
        const payload = txRes.data.data;
        setTransactions(payload.transactions || []);
        setPagination(payload.pagination);
      } catch (e) {
        setError(
          e.response?.data?.message || "Failed to load product transactions",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTenant, productId, branchId, page]);

  if (!activeTenant) return <Centered>No tenant selected</Centered>;

  if (loading)
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <ProductInfoSkeleton />
        <TableSkeleton cols={6} />
      </div>
    );

  if (!product) return <Centered>Product not found</Centered>;

  const isActive = product.status === "active";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Product info card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 leading-tight">
                {product.productName}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Product transaction history
              </p>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2">
            <MetaPill
              icon={<Tag className="w-3.5 h-3.5 text-indigo-400" />}
              label="Category"
              value={product.category}
              className="bg-indigo-50 border-indigo-100 text-indigo-700"
            />
            <MetaPill
              icon={<Ruler className="w-3.5 h-3.5 text-slate-400" />}
              label="Unit"
              value={product.unit}
              className="bg-slate-50 border-slate-200 text-slate-600"
            />
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isActive
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-red-50 border-red-100 text-red-600"
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
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Transactions table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Transaction History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {pagination.total ?? transactions.length} total records
            </p>
          </div>

          {/* Legend */}
          <div className="hidden lg:flex items-center gap-2">
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.className}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            ))}
          </div>
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Date", "Type", "Qty", "Branch", "User", "Note"].map((h) => (
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
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">
                      No transactions found for this product
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const cfg = getTypeConfig(tx.type);
                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Date */}
                    <td className="px-6 py-3.5">
                      <span className="text-xs text-slate-600 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {new Date(tx.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>

                    {/* Qty */}
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        {tx.quantity}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="px-6 py-3.5">
                      {tx.branchId ? (
                        <div>
                          <p className="text-xs font-medium text-slate-700">
                            {tx.branchId.branchName}
                          </p>
                          {tx.branchId.location && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {tx.branchId.location}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </td>

                    {/* User */}
                    <td className="px-6 py-3.5">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {tx.userId?.email || "—"}
                      </span>
                    </td>

                    {/* Note */}
                    <td className="px-6 py-3.5 text-sm text-slate-400 max-w-[140px] truncate">
                      {tx.note || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {transactions.length > 0 && (
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
    </div>
  );
}

/* ── Skeletons ─────────────────────────────────────────── */
function ProductInfoSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
      <div className="h-4 w-16 bg-slate-100 rounded-lg mb-5" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-44 bg-slate-100 rounded-lg" />
            <div className="h-3 w-28 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-slate-100 rounded-lg" />
          <div className="h-8 w-16 bg-slate-100 rounded-lg" />
          <div className="h-8 w-20 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton({ cols = 6 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-100 rounded-lg" />
          <div className="h-3 w-24 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {[80, 72, 88, 72].map((w, i) => (
            <div
              key={i}
              className="h-6 rounded-full bg-slate-100"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex gap-8">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-200 rounded"
            style={{ width: 60 + i * 10 }}
          />
        ))}
      </div>
      {Array.from({ length: 7 }).map((_, row) => (
        <div
          key={row}
          className="px-6 py-4 border-b border-slate-100 flex gap-8 items-center"
        >
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-2.5 w-14 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full" />
          <div className="h-6 w-10 bg-slate-100 rounded-md" />
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-slate-100 rounded" />
            <div className="h-2.5 w-16 bg-slate-100 rounded" />
          </div>
          <div className="h-5 w-32 bg-slate-100 rounded-md" />
          <div className="h-3.5 w-20 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────── */
const MetaPill = ({ icon, label, value, className }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${className}`}
  >
    {icon}
    <span className="text-[10px] font-normal opacity-60 uppercase tracking-wider">
      {label}:
    </span>
    {value}
  </span>
);

const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
