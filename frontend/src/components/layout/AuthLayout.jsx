import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 bg-zinc-900 flex-col justify-between p-12">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-zinc-900 text-xs font-bold">
            S
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            StockPilot
          </span>
        </div>

        {/* Quote block */}
        <div>
          <p className="text-2xl font-semibold text-white leading-snug mb-6">
            One platform.
            <br />
            Every tenant.
            <br />
            Full control.
          </p>
          <div className="flex gap-6">
            {[
              ["99.9%", "Uptime"],
              ["SOC 2", "Compliant"],
              ["256-bit", "Encryption"],
            ].map(([val, label]) => (
              <div key={label}>
                <p className="text-base font-semibold text-white">{val}</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} StockPilot Inc.
        </p>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-semibold text-zinc-900">
              StockPilot
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
