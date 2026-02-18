import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getProductById } from "../../api/product.api";
import { fetchProductTransactions } from "../../api/inventoryTransaction.api";

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
          e.response?.data?.message || "Failed to load product transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTenant, productId, branchId, page]);

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <Centered>Loading…</Centered>;
  if (!product) return <Centered>Product not found</Centered>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 ">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-800 mb-3 cursor-pointer"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold">{product.productName}</h1>

        <div className="flex gap-6 text-sm text-gray-700 mt-2">
          <Meta label="Category" value={product.category} />
          <Meta label="Unit" value={product.unit} />
          <Meta
            label="Status"
            value={product.status}
            valueClass={
              product.status === "active" ? "text-green-600" : "text-red-600"
            }
          />
        </div>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Qty</Th>
              <Th>Branch</Th>
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
                <Td>
                  {tx.branchId?.branchName || "-"}
                  {tx.branchId?.location && `, ${tx.branchId.location}`}
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

const Meta = ({ label, value, valueClass = "" }) => (
  <div>
    <span className="text-gray-500">{label}:</span>{" "}
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
);
