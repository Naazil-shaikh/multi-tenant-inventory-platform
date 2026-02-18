import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchProducts, createProduct } from "../../api/product.api";

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

  const loadProducts = async () => {
    if (!activeTenant) return;

    try {
      setLoading(true);

      const res = await fetchProducts({
        page: pagination.page,
        limit: pagination.limit,
      });

      const { products, pagination: pageData } = res.data.data;

      setProducts(products);
      setPagination((prev) => ({ ...prev, ...pageData }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeTenant) return;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const res = await fetchProducts({
          page,
          limit: pagination.limit,
        });

        const { products, pagination: pageData } = res.data.data;

        setProducts(products);
        setPagination(pageData);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeTenant, page]);

  if (!activeTenant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No tenant selected
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

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

      const createdProduct = res.data.data.product;

      setProducts((prev) => [createdProduct, ...prev]);

      // Reset modal
      setShowModal(false);
      setForm({
        productName: "",
        category: "",
        unit: "",
        sellingPrice: "",
        costPrice: "",
        status: "active",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create product. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };
  // Add product view

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Tenant-wide product catalog</p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Product Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Unit</TableHeader>
              <TableHeader>Selling Price</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.category || "-"}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>₹{product.sellingPrice}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      product.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full mr-10">
        <div className="w-full flex justify-end gap-3 mt-4">
          <button
            disabled={!pagination.hasPrev}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 text-sm rounded-md border transition
      ${
        pagination.hasPrev
          ? "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      }`}
          >
            Prev
          </button>

          <button
            disabled={!pagination.hasNext}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 text-sm rounded-md border transition
      ${
        pagination.hasNext
          ? "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      }`}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowModal(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <form
              onSubmit={handleCreateProduct}
              className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold">Add Product</h2>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                  {error}
                </div>
              )}

              <Input
                label="Product Name"
                value={form.productName}
                onChange={(v) => setForm({ ...form, productName: v })}
              />
              <Input
                label="Category"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
              />
              <Input
                label="Unit (pcs / kg)"
                value={form.unit}
                onChange={(v) => setForm({ ...form, unit: v })}
              />
              <Input
                label="Selling Price"
                type="number"
                value={form.sellingPrice}
                onChange={(v) => setForm({ ...form, sellingPrice: v })}
              />
              <Input
                label="Cost Price (optional)"
                type="number"
                value={form.costPrice}
                onChange={(v) => setForm({ ...form, costPrice: v })}
              />

              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      productName: "",
                      category: "",
                      unit: "",
                      sellingPrice: "",
                      costPrice: "",
                      status: "active",
                    }),
                      setShowModal(false);
                  }}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  disabled={creating}
                  type="submit"
                  className="px-4 py-2 text-sm bg-black text-white rounded"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

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

function Input({ label, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={label}
      className="w-full border rounded px-3 py-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
