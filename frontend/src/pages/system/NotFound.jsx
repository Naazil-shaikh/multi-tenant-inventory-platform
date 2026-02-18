export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>

        <p className="text-sm text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
    </div>
  );
}
