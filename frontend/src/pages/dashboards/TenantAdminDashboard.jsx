export default function TenantAdminDashboard() {
  const data = {
    adminStats: {
      totalBranches: 6,
      totalProducts: 142,
      lowStockCount: 11,
      totalMembers: 18,
    },

    recentTransactions: [
      {
        id: "tx_001",
        date: "2025-01-22",
        type: "SALE",
        productName: "Burger Buns",
        branchName: "Main Branch",
        quantity: 30,
      },
      {
        id: "tx_002",
        date: "2025-01-22",
        type: "ADD",
        productName: "Milk Bread",
        branchName: "Andheri West",
        quantity: 80,
      },
      {
        id: "tx_003",
        date: "2025-01-21",
        type: "ADJUST",
        productName: "Whole Wheat Loaf",
        branchName: "Pune Central",
        quantity: -12,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Tenant Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Operational overview of your tenant
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Total Branches" value={data.adminStats.totalBranches} />
        <KpiCard label="Total Products" value={data.adminStats.totalProducts} />
        <KpiCard
          label="Low Stock Items"
          value={data.adminStats.lowStockCount}
          highlight
        />
        <KpiCard label="Total Members" value={data.adminStats.totalMembers} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Alerts</h2>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>⚠️ 11 products are running low on stock</li>
          <li>⚠️ Pune Central branch reported negative adjustment</li>
        </ul>
      </div>

      {/* Recent Inventory Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Inventory Transactions
          </h2>
        </div>

        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Date</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Product</TableHeader>
              <TableHeader>Branch</TableHeader>
              <TableHeader>Quantity</TableHeader>
            </tr>
          </thead>
          <tbody>
            {data.recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.productName}</TableCell>
                <TableCell>{tx.branchName}</TableCell>
                <TableCell>{tx.quantity}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, value, highlight = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-semibold ${
          highlight ? "text-red-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
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
