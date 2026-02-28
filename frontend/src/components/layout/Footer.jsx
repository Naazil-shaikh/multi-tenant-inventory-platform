export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand column */}
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">
                S
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                StockPilot
              </span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              A modern multi-tenant inventory and operations platform built for
              structured, scalable teams.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-4 pt-1">
              {[
                { val: "99.9%", label: "Uptime" },
                { val: "SOC 2", label: "Compliant" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900"
                >
                  <span className="text-xs font-semibold text-white">
                    {val}
                  </span>
                  <span className="text-[11px] text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="flex flex-col sm:flex-row gap-10 text-sm">
            {[
              {
                heading: "Company",
                links: ["About", "Careers", "Contact"],
              },
              {
                heading: "Legal",
                links: ["Privacy Policy", "Terms of Service"],
              },
              {
                heading: "Support",
                links: ["Help Center", "Documentation", "Status"],
              },
            ].map(({ heading, links }) => (
              <div key={heading} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {heading}
                </p>
                <div className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <span
                      key={link}
                      className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors text-sm"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <p>
            © {new Date().getFullYear()} StockPilot Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {["Security", "Compliance", "Cookies"].map((item) => (
              <span
                key={item}
                className="hover:text-indigo-400 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
