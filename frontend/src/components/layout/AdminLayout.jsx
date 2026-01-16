import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <nav className="space-y-3 text-sm">
          <div>Dashboard</div>
          <div>Tenants</div>
          <div>Plans</div>
          <div>Users</div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
