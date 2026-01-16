export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 gap-2">
        <div>© {new Date().getFullYear()} StockPilot. All rights reserved.</div>

        <div className="flex gap-4">
          <span className="hover:text-gray-900 cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-gray-900 cursor-pointer">Terms</span>
          <span className="hover:text-gray-900 cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}
