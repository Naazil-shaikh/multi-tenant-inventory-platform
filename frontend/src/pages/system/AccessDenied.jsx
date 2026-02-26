// AccessDenied.jsx
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-7 h-7 text-red-500" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-red-500 uppercase tracking-widest mb-4">
          403
        </span>

        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Access Denied
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          You don't have permission to view this page. Contact your admin if you
          think this is a mistake.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    </div>
  );
}
