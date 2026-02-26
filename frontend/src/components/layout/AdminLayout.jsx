import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";
import { LayoutDashboard, Building2, CreditCard, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Tenants", icon: Building2, to: "/admin/tenants" },
  { label: "Plans", icon: CreditCard, to: "/admin/plans" },
  { label: "Users", icon: Users, to: "/admin/users" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-zinc-200 hidden md:flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-bold tracking-tight">
              S
            </div>
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">
              StockPilot
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-3 mb-3">
            Admin
          </p>
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            © {new Date().getFullYear()} StockPilot
          </p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* <Header /> */}
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
