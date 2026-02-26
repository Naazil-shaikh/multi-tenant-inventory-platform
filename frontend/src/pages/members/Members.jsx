import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchTenantMembers,
  inviteMember as inviteMemberApi,
} from "../../api/membership.api";
import {
  Users,
  UserPlus,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Shield,
} from "lucide-react";

/* ── Status config ─────────────────────────────────────── */
const statusConfig = {
  active: {
    className: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  invited: {
    className: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-400",
  },
  suspended: {
    className: "bg-red-50 text-red-600",
    dot: "bg-red-400",
  },
};

const getStatusConfig = (status = "") => {
  return (
    statusConfig[status.toLowerCase()] || {
      className: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    }
  );
};

/* ── Role config ───────────────────────────────────────── */
const roleConfig = {
  manager: "bg-violet-50 text-violet-700 border-violet-100",
  user: "bg-slate-100 text-slate-600 border-slate-200",
  admin: "bg-amber-50 text-amber-700 border-amber-100",
};

const getRoleClass = (role = "") =>
  roleConfig[role.toLowerCase()] ||
  "bg-slate-100 text-slate-600 border-slate-200";

/* ── Main component ────────────────────────────────────── */
export default function Members() {
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "user" });
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    if (!activeTenant) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchTenantMembers({ page, limit: 10 });
        const { tenantMembers, pagination } = res.data.data;
        setMembers(tenantMembers);
        setPagination(pagination);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTenant, page]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError(null);
    if (!inviteForm.email) {
      setInviteError("Email is required");
      return;
    }
    try {
      setInviting(true);
      await inviteMemberApi(inviteForm);
      setPage(1);
      setIsInviteOpen(false);
      setInviteForm({ email: "", role: "user" });
    } catch (e) {
      setInviteError(e.response?.data?.message || "Invitation failed");
    } finally {
      setInviting(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:bg-white transition-colors";

  if (!activeTenant) return <Centered>No tenant selected</Centered>;
  if (loading) return <Centered>Loading members…</Centered>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Users className="w-[18px] h-[18px] text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 leading-tight">
              Members
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {members.length} member{members.length !== 1 ? "s" : ""} in{" "}
              <span className="font-medium text-slate-500">
                {activeTenant?.tenantName}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setInviteError(null);
            setIsInviteOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Page error */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Members table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Member", "Role", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {members.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">No members found</p>
                    <button
                      onClick={() => {
                        setInviteError(null);
                        setIsInviteOpen(true);
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Invite your first member →
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((m) => {
                const statusCfg = getStatusConfig(m.status);
                const initials = (m.userId?.fullName || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={m._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Member */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {m.userId?.fullName || "—"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {m.userId?.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold capitalize ${getRoleClass(
                          m.role,
                        )}`}
                      >
                        <Shield className="w-3 h-3" />
                        {m.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusCfg.className}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                        />
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && members.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-600">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {pagination.totalPages}
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                  pagination.hasPrev
                    ? "bg-white border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-600"
                    : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                  pagination.hasNext
                    ? "bg-white border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-600"
                    : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsInviteOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Invite Member
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Send an invitation to join{" "}
                    <span className="font-medium text-slate-600">
                      {activeTenant?.tenantName}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleInvite} className="p-6 space-y-4">
                {inviteError && (
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {inviteError}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className={`${inputClass} pl-10`}
                      value={inviteForm.email}
                      onChange={(e) =>
                        setInviteForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Role
                  </label>
                  <select
                    className={inputClass}
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm((p) => ({ ...p, role: e.target.value }))
                    }
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                {/* Role descriptions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    {
                      role: "User",
                      desc: "View and manage assigned inventory",
                      color: "border-slate-200 bg-slate-50",
                      badge: "bg-slate-100 text-slate-600",
                    },
                    {
                      role: "Manager",
                      desc: "Full branch and product access",
                      color: "border-violet-100 bg-violet-50",
                      badge: "bg-violet-100 text-violet-700",
                    },
                  ].map(({ role, desc, color, badge }) => (
                    <div
                      key={role}
                      className={`rounded-xl border p-3 ${color} ${
                        inviteForm.role === role.toLowerCase()
                          ? "ring-2 ring-indigo-400/30"
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold mb-1.5 ${badge}`}
                      >
                        <Shield className="w-3 h-3" />
                        {role}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {inviting ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
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
                        Sending…
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Send Invite
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────── */
const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-64 text-sm text-slate-400">
    {children}
  </div>
);
