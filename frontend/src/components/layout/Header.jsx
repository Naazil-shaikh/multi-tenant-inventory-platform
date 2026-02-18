import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const activeTenant = useSelector((state) => state.tenant.activeTenant);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [openUser, setOpenUser] = useState(false);

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
        console.log(u, ":User data");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-semibold">
              S
            </div>
            <span className="text-lg font-semibold text-gray-900">
              StockPilot
            </span>
          </div>

          {activeTenant && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md bg-gray-50 border text-sm">
              <span className="font-medium text-gray-900">
                {activeTenant.tenantName}
              </span>
              <span className="h-4 w-px bg-gray-300" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white">
                {activeTenant.plan}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/invitations")}
            className="w-9 h-9 rounded-md hover:bg-gray-100 flex items-center justify-center"
            title="Invitations"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.6 1.6L4 17h5"
              />
            </svg>
          </button>

          <div className="relative">
            <div
              onClick={() => setOpenUser((p) => !p)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {(activeTenant && activeTenant?.role) || "—"}
                </p>
              </div>

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
                  {(user?.fullName || "U")[0]}
                </div>
              )}
            </div>

            {openUser && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setOpenUser(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setOpenUser(false);
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
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
