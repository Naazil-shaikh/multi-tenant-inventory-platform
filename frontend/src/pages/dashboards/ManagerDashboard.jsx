export default function ManagerDashboard() {
  const data = {
    branchStats: {
      branchName: "Main Branch",
      totalProducts: 86,
      lowStockCount: 7,
      todaySalesCount: 42,
      todayAdjustments: 2,
    },

    recentTransactions: [
      {
        id: "tx_001",
        date: "2025-01-22",
        type: "SALE",
        productName: "Burger Buns",
        quantity: 18,
      },
      {
        id: "tx_002",
        date: "2025-01-22",
        type: "ADD",
        productName: "Milk Bread",
        quantity: 40,
      },
      {
        id: "tx_003",
        date: "2025-01-21",
        type: "ADJUST",
        productName: "Whole Wheat Loaf",
        quantity: -6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <div>
        <p className="text-sm text-gray-500">Branch</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          {data.branchStats.branchName}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Total Products"
          value={data.branchStats.totalProducts}
        />
        <KpiCard
          label="Low Stock Items"
          value={data.branchStats.lowStockCount}
          highlight
        />
        <KpiCard
          label="Today's Sales"
          value={data.branchStats.todaySalesCount}
        />
        <KpiCard
          label="Adjustments Today"
          value={data.branchStats.todayAdjustments}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Low Stock Alerts
        </h2>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>⚠️ Milk Bread is below minimum threshold</li>
          <li>⚠️ Whole Wheat Loaf stock critically low</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Transactions
          </h2>
        </div>

        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Date</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Product</TableHeader>
              <TableHeader>Quantity</TableHeader>
            </tr>
          </thead>

          <tbody>
            {data.recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.productName}</TableCell>
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
