import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { fetchInventoryTransactions } from "../../api/inventoryTransaction.api";

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

  if (!activeTenant) {
    return <Centered>No tenant selected</Centered>;
  }

  if (loading) {
    return <Centered>Loading inventory transactions…</Centered>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory Transactions
        </h1>
        <p className="text-sm text-gray-500">Tenant-wide inventory audit log</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
        Permission required: <strong>INVENTORY_AUDIT_VIEW</strong>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Filter label="Type">
            <select
              className="w-full border rounded px-3 py-2 text-sm"
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
          </Filter>

          <Filter label="Start Date">
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              value={draftFilters.startDate}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, startDate: e.target.value }))
              }
            />
          </Filter>

          <Filter label="End Date">
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              value={draftFilters.endDate}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, endDate: e.target.value }))
              }
            />
          </Filter>

          <div>
            <button
              onClick={() => {
                setPage(1);
                setAppliedFilters(
                  Object.fromEntries(
                    Object.entries(draftFilters).filter(([_, v]) => v)
                  )
                );
              }}
              className="w-full h-10 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 cursor-pointer"
            >
              Apply
            </button>
          </div>

          <div>
            <button
              onClick={() => {
                setDraftFilters({
                  branchId: "",
                  productId: "",
                  type: "",
                  startDate: "",
                  endDate: "",
                });
                setAppliedFilters({});
                setPage(1);
              }}
              className="w-full h-10 text-sm border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Qty</Th>
              <Th>Product</Th>
              <Th>Branch</Th>
              <Th>User</Th>
              <Th>Note</Th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}

            {transactions.map((tx) => (
              <tr key={tx._id} className="border-t">
                <Td>{new Date(tx.createdAt).toLocaleString()}</Td>
                <Td>{tx.type}</Td>
                <Td>{tx.quantity}</Td>
                <Td>{tx.productId?.productName || "-"}</Td>
                <Td>
                  {tx.branchId
                    ? `${tx.branchId.branchName}, ${tx.branchId.location}`
                    : "-"}
                </Td>
                <Td>{tx.userId?.email || "-"}</Td>
                <Td>{tx.note || "-"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <button
          disabled={!pagination.hasPrev}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 text-sm rounded-md border
            ${
              pagination.hasPrev
                ? "bg-white hover:bg-gray-50 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          Prev
        </button>

        <button
          disabled={!pagination.hasNext}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 text-sm rounded-md border
            ${
              pagination.hasNext
                ? "bg-white hover:bg-gray-50 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const cleanFilters = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));

const updateFilter = (setFilters, setPage, key, value) => {
  setPage(1);
  setFilters((prev) => ({ ...prev, [key]: value }));
};

const Centered = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    {children}
  </div>
);

const ErrorBox = ({ children }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
    {children}
  </div>
);

const Filter = ({ label, children }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-800">{children}</td>
);
