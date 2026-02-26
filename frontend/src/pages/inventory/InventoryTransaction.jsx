import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInventoryTransactions } from "../../api/inventoryTransaction.api";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Minus,
  ClipboardList,
  Filter as FilterIcon,
  X,
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
export default function InventoryTransactions() {
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
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

  const [draftFilters, setDraftFilters] = useState({
    branchId: "",
    productId: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  useEffect(() => {
    if (!activeTenant) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchInventoryTransactions({
          page,
          limit: pagination.limit,
          ...appliedFilters,
        });
        const payload = res.data.data;
        setTransactions(payload.transactions || []);
        setPagination(payload.pagination);
      } catch (e) {
        setError("Failed to load inventory transactions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTenant, page, appliedFilters]);

  const handleApply = () => {
    setPage(1);
    setAppliedFilters(
      Object.fromEntries(Object.entries(draftFilters).filter(([_, v]) => v)),
    );
  };

  const handleReset = () => {
    setDraftFilters({
      branchId: "",
      productId: "",
      type: "",
      startDate: "",
      endDate: "",
    });
    setAppliedFilters({});
    setPage(1);
  };

  if (!activeTenant) return <Centered>No tenant selected</Centered>;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors placeholder:text-slate-300";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <ClipboardList className="w-[18px] h-[18px] text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              Inventory Transactions
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tenant-wide inventory audit log
            </p>
          </div>
        </div>

        {/* Permission badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
          <AlertCircle className="w-3.5 h-3.5" />
          INVENTORY_AUDIT_VIEW required
        </span>
      </div>

      {/* Filters card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold">
              Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Type
            </label>
            <select
              className={inputClass}
              value={draftFilters.type}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, type: e.target.value }))
              }
            >
              <option value="">All Types</option>
              <option value="ADD">ADD</option>
              <option value="SALE">SALE</option>
              <option value="REMOVE">REMOVE</option>
              <option value="ADJUST">ADJUST</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Start Date
            </label>
            <input
              type="date"
              className={inputClass}
              value={draftFilters.startDate}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, startDate: e.target.value }))
              }
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              End Date
            </label>
            <input
              type="date"
              className={inputClass}
              value={draftFilters.endDate}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, endDate: e.target.value }))
              }
            />
          </div>

          {/* Apply */}
          <button
            onClick={handleApply}
            className="h-[42px] flex items-center justify-center gap-2 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <FilterIcon className="w-3.5 h-3.5" />
            Apply
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="h-[42px] flex items-center justify-center gap-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reset
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

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Table header row */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Transaction Log
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {pagination.total ?? transactions.length} total records
              {hasActiveFilters && (
                <span className="ml-1 text-indigo-500 font-medium">
                  · filtered
                </span>
              )}
            </p>
          </div>

          {/* Type legend */}
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

        {loading ? (
          <TransactionTableSkeleton />
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Date",
                  "Type",
                  "Qty",
                  "Product",
                  "Branch",
                  "User",
                  "Note",
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-400">
                        No transactions found
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleReset}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Clear filters →
                        </button>
                      )}
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

                      {/* Product */}
                      <td className="px-6 py-3.5 text-sm font-medium text-slate-700">
                        {tx.productId?.productName || "—"}
                      </td>

                      {/* Branch */}
                      <td className="px-6 py-3.5">
                        {tx.branchId ? (
                          <div>
                            <p className="text-xs font-medium text-slate-700">
                              {tx.branchId.branchName}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {tx.branchId.location}
                            </p>
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
        )}

        {/* Pagination */}
        {!loading && transactions.length > 0 && (
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

/* ── Skeleton ──────────────────────────────────────────── */
function TransactionTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex gap-8">
        {[80, 60, 40, 100, 120, 130, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 bg-slate-200 rounded"
            style={{ width: w }}
          />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, row) => (
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
          <div className="h-3.5 w-28 bg-slate-100 rounded" />
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

/* ── Helpers ───────────────────────────────────────────── */
const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
