import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex-col justify-between p-12 overflow-hidden">
        {/* Background accents */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/30">
            S
          </div>
          <span className="text-base font-semibold text-white tracking-tight">
            StockPilot
          </span>
        </div>

        {/* Core positioning */}
        <div className="relative z-10">
          {/* Accent line */}
          <div className="w-10 h-0.5 bg-indigo-400 rounded-full mb-6" />

          <p className="text-3xl font-semibold text-white leading-snug mb-6">
            Structured inventory.
            <br />
            <span className="text-indigo-300">Controlled access.</span>
            <br />
            Scalable operations.
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Built with multi-tenant architecture, secure authentication, and
            role-based access control to help teams manage inventory with
            clarity and confidence.
          </p>

          {/* Trust badges */}
          {/* <div className="flex items-center gap-4 mt-8">
            {[
              { val: "99.9%", label: "Uptime" },
              { val: "SOC 2", label: "Compliant" },
              { val: "256-bit", label: "Encrypted" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">{val}</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Bottom note */}
        <div className="relative z-10 text-xs text-slate-600">
          © {new Date().getFullYear()} StockPilot Inc.
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-semibold text-slate-900">
              StockPilot
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
