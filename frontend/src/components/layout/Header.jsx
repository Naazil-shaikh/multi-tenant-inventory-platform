import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUser, setOpenUser] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        const u = res.data.data;
        dispatch(setUser(u));
        setForm({
          fullName: u.fullName || "",
          email: u.email || "",
          avatar: u.avatar || "",
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white flex items-center justify-center font-semibold shadow-md group-hover:scale-105 transition">
              S
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              StockPilot
            </span>
          </div>

          {/* Active Tenant Badge */}
          {activeTenant && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-sm shadow-sm">
              <div>
                <p className="font-medium text-zinc-900">
                  {activeTenant.tenantName}
                </p>
                <p className="text-xs text-zinc-500">{activeTenant?.role}</p>
              </div>

              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-900 text-white">
                {activeTenant.plan}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">
          {/* Notification Button */}
          <button
            onClick={() => navigate("/invitations")}
            className="relative w-10 h-10 rounded-xl hover:bg-zinc-100 transition flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-zinc-700" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <div
              onClick={() => setOpenUser((p) => !p)}
              className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-zinc-100 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-zinc-900">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-white flex items-center justify-center font-semibold shadow">
                  {(user?.fullName || "U")[0]}
                </div>
              )}

              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </div>

            {openUser && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="px-4 py-3 border-b border-zinc-100">
                  <p className="text-sm font-semibold text-zinc-900">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-zinc-500">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setOpenUser(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 transition"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setOpenUser(false);
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
