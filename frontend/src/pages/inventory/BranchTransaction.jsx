import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getBranchById } from "../../api/branch.api";
import { fetchBranchTransactions } from "../../api/inventoryTransaction.api";

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
  if (loading) return <Centered>Loading…</Centered>;
  if (!branch) return <Centered>Branch not found</Centered>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => navigate(`/branches/${branchId}`)}
          className="text-sm text-gray-500 hover:text-gray-800 mb-3"
        >
          ← Back to Branch
        </button>

        <h1 className="text-2xl font-semibold">{branch.branchName}</h1>
        <p className="text-sm text-gray-500">{branch.location}</p>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Qty</Th>
              <Th>Product</Th>
              <Th>User</Th>
              <Th>Note</Th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
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
          className={`px-4 py-2 text-sm rounded-md border ${
            pagination.hasPrev
              ? "bg-white hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Prev
        </button>

        <button
          disabled={!pagination.hasNext}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 text-sm rounded-md border ${
            pagination.hasNext
              ? "bg-white hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
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
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
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
