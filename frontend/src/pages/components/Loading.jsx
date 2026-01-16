export function BranchInfoSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-3 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded" />
      <div className="flex gap-6">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function InventoryTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, row) => (
            <tr key={row} className="border-t">
              {Array.from({ length: 5 }).map((_, col) => (
                <td key={col} className="px-6 py-4">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
