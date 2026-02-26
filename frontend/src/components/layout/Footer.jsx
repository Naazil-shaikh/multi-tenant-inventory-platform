export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-gradient-to-b from-zinc-50 to-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white flex items-center justify-center font-semibold shadow-md">
                S
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900">
                StockPilot
              </span>
            </div>

            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              A modern multi-tenant inventory and operations platform built for
              growing businesses.
            </p>
          </div>

          {/* Links Column */}
          <div className="flex flex-col sm:flex-row gap-10 text-sm">
            <div className="space-y-3">
              <p className="font-semibold text-zinc-900">Company</p>
              <div className="flex flex-col gap-2 text-zinc-500">
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  About
                </span>
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Careers
                </span>
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Contact
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-zinc-900">Legal</p>
              <div className="flex flex-col gap-2 text-zinc-500">
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Privacy Policy
                </span>
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Terms of Service
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-zinc-900">Support</p>
              <div className="flex flex-col gap-2 text-zinc-500">
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Help Center
                </span>
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Documentation
                </span>
                <span className="hover:text-zinc-900 cursor-pointer transition">
                  Status
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>
            © {new Date().getFullYear()} StockPilot Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-900 cursor-pointer transition">
              Security
            </span>
            <span className="hover:text-zinc-900 cursor-pointer transition">
              Compliance
            </span>
            <span className="hover:text-zinc-900 cursor-pointer transition">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
