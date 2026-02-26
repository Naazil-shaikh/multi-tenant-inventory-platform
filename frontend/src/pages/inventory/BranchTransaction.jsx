import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBranchById } from "../../api/branch.api";
import { fetchBranchTransactions } from "../../api/inventoryTransaction.api";
import {
  ArrowLeft,
  MapPin,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

/* ── Transaction type config ───────────────────────────── */
const typeConfig = {
  in: {
    label: "Stock In",
    icon: <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-500" />,
    className: "bg-emerald-50 text-emerald-700",
  },
  out: {
    label: "Stock Out",
    icon: <ArrowUpCircle className="w-3.5 h-3.5 text-red-400" />,
    className: "bg-red-50 text-red-600",
  },
  adjustment: {
    label: "Adjustment",
    icon: <RefreshCw className="w-3.5 h-3.5 text-amber-500" />,
    className: "bg-amber-50 text-amber-700",
  },
};

const getTypeConfig = (type = "") => {
  const key = type.toLowerCase();
  return (
    typeConfig[key] || {
      label: type,
      icon: null,
      className: "bg-slate-100 text-slate-600",
    }
  );
};

/* ── Main component ────────────────────────────────────── */
export default function BranchInventoryTransactions() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(null);
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
    if (!activeTenant || !branchId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const branchRes = await getBranchById(branchId);
        setBranch(branchRes.data.data.branch);
        const txRes = await fetchBranchTransactions(branchId, {
          page,
          limit: pagination.limit,
        });
        const payload = txRes.data.data;
        setTransactions(payload.transactions || []);
        setPagination(payload.pagination);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTenant, branchId, page, pagination.limit]);

  if (!activeTenant) return <Centered>No tenant selected</Centered>;

  if (loading)
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <BranchInfoSkeleton />
        <InventoryTableSkeleton />
      </div>
    );

  if (!branch) return <Centered>Branch not found</Centered>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Branch info card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <button
          onClick={() => navigate(`/branches/${branchId}`)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Branch
        </button>

        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              {branch.branchName}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">{branch.location}</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Inventory Transactions
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
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Transaction History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {pagination.total ?? transactions.length} total records
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Legend */}
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <span
                key={key}
                className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.className}`}
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
              {["Date", "Type", "Qty", "Product", "User", "Note"].map((h) => (
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
                      No transactions found
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
                      <span className="text-xs text-slate-500 whitespace-nowrap">
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

                    {/* User */}
                    <td className="px-6 py-3.5">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {tx.userId?.email || "—"}
                      </span>
                    </td>

                    {/* Note */}
                    <td className="px-6 py-3.5 text-sm text-slate-400 max-w-[160px] truncate">
                      {tx.note || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination — inside card footer */}
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
export function BranchInfoSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
      <div className="h-4 w-28 bg-slate-100 rounded-lg mb-5" />
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-slate-100 rounded-lg" />
          <div className="h-3.5 w-32 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function InventoryTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-100 rounded-lg" />
          <div className="h-3 w-24 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {[80, 72, 88].map((w) => (
            <div
              key={w}
              className="h-6 rounded-full bg-slate-100"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {/* Table head */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex gap-8">
        {[80, 60, 40, 100, 120, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 bg-slate-200 rounded"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 6 }).map((_, row) => (
        <div
          key={row}
          className="px-6 py-4 border-b border-slate-100 flex gap-8 items-center"
        >
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-2.5 w-14 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
          <div className="h-6 w-10 bg-slate-100 rounded-md" />
          <div className="h-3.5 w-28 bg-slate-100 rounded" />
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
