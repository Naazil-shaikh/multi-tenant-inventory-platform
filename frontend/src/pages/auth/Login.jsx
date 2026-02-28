import { User, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../store/slices/authSlice";
import { loginUser } from "../../api/user.api";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };
      const res = await loginUser(payload);
      const { user, accessToken } = res.data.data;
      dispatch(
        loginSuccess({
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            isSuperAdmin: user.isSuperAdmin,
            avatar: user.avatar,
          },
          accessToken,
        }),
      );
      navigate("/tenants/select");
    } catch (error) {
      dispatch(
        loginFailure(error.response?.data?.message || "Invalid credentials"),
      );
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Secure access
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Welcome back.
        </h1>
      </div>

      {/* Error */}
      {authError && (
        <div className="mb-6 flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {authError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Identifier */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Email or Username
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-7 border-t border-slate-100" />

      <p className="text-sm text-slate-400 text-center">
        No account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-indigo-600 font-medium hover:text-indigo-800 underline underline-offset-4 transition-colors"
        >
          Create one
        </button>
      </p>
    </div>
  );
}
