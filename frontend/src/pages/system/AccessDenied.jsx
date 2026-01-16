export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
        <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h2>

        <p className="text-sm text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
