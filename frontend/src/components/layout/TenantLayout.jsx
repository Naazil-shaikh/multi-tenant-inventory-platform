import { Outlet } from "react-router-dom";

export default function TenantLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
