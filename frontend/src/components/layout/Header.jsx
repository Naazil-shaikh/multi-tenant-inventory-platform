import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { logoutUser } from "../../api/user.api";
import { logout } from "../../store/slices/authSlice";

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

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const loggingOutUser = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-6">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-500/25 group-hover:bg-indigo-700 transition-colors">
              S
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              StockPilot
            </span>
          </div>

          {/* Active tenant badge */}
          {activeTenant && (
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              <div>
                <p className="font-medium text-slate-800 leading-tight">
                  {activeTenant.tenantName}
                </p>
                {activeTenant?.role && (
                  <p className="text-[11px] text-slate-400 capitalize leading-tight">
                    {activeTenant.role}
                  </p>
                )}
              </div>
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-600 text-white capitalize">
                {activeTenant.plan}
              </span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => navigate("/invitations")}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center"
            title="Invitations"
          >
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px] text-slate-500" />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenUser((p) => !p)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {/* Avatar */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
              )}

              {/* Name + email */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user?.fullName || "User"}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight truncate max-w-[140px]">
                  {user?.email}
                </p>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  openUser ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {openUser && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenUser(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/60 overflow-hidden z-20">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setOpenUser(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        loggingOutUser();
                        setOpenUser(false);
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
