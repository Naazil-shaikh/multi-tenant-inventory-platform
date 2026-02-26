// NotFound.jsx
import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-7 h-7 text-indigo-400" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-4">
          404
        </span>

        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>

          {/* <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </button> */}
        </div>
      </div>
    </div>
  );
}
