export default function SuperAdminDashboard() {
  const data = {
    globalStats: {
      totalTenants: 48,
      activeTenants: 39,
      suspendedTenants: 9,
      planDistribution: {
        free: 21,
        pro: 18,
        enterprise: 9,
      },
    },

    tenants: [
      {
        tenantId: "t_001",
        tenantName: "Acme Corp",
        plan: "pro",
        status: "active",
      },
      {
        tenantId: "t_002",
        tenantName: "Bakery Central",
        plan: "free",
        status: "suspended",
      },
      {
        tenantId: "t_003",
        tenantName: "Retail Ops",
        plan: "enterprise",
        status: "active",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          SuperAdmin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Platform-wide overview and control
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-800">
        Restricted access: <strong>SuperAdmin only</strong>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Total Tenants" value={data.globalStats.totalTenants} />
        <KpiCard
          label="Active Tenants"
          value={data.globalStats.activeTenants}
        />
        <KpiCard
          label="Suspended Tenants"
          value={data.globalStats.suspendedTenants}
          highlight
        />
        <KpiCard
          label="Plan Distribution"
          multiline
          value={`Free: ${data.globalStats.planDistribution.free}
Pro: ${data.globalStats.planDistribution.pro}
Enterprise: ${data.globalStats.planDistribution.enterprise}`}
        />
      </div>

      {/* Tenant List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Tenant Name</TableHeader>
              <TableHeader>Plan</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>

          <tbody>
            {data.tenants.map((tenant) => (
              <tr key={tenant.tenantId} className="border-t">
                <TableCell>{tenant.tenantName}</TableCell>
                <TableCell className="capitalize">{tenant.plan}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      tenant.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                      View
                    </span>
                    <span className="text-sm text-red-600 cursor-pointer hover:underline">
                      Suspend
                    </span>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, value, multiline = false, highlight = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={`font-semibold ${
          multiline ? "whitespace-pre-line text-sm" : "text-2xl"
        } ${highlight ? "text-red-600" : "text-gray-900"}`}
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

function TableCell({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-800 ${className}`}>
      {children}
    </td>
  );
}
