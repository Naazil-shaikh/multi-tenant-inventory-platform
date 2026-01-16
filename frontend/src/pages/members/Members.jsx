import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  fetchTenantMembers,
  inviteMember as inviteMemberApi,
} from "../../api/membership.api";

export default function Members() {
  const activeTenant = useSelector((s) => s.tenant.activeTenant);

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const [error, setError] = useState(null);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "user",
  });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!activeTenant) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchTenantMembers({
          page,
          limit: 10,
        });

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
    setError(null);

    if (!inviteForm.email) {
      setError("Email is required");
      return;
    }

    try {
      setInviting(true);
      await inviteMemberApi(inviteForm);

      setPage(1);
      setIsInviteOpen(false);
      setInviteForm({ email: "", role: "user" });
    } catch (e) {
      setError(e.response?.data?.message || "Invitation failed");
    } finally {
      setInviting(false);
    }
  };

  if (!activeTenant) {
    return <Centered>No tenant selected</Centered>;
  }

  if (loading) {
    return <Centered>Loading members…</Centered>;
  }

  /* -------- UI -------- */
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div
        className={`max-w-7xl mx-auto p-8 space-y-6 ${
          isInviteOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
            <p className="text-sm text-gray-500">
              Tenant members and access roles
            </p>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800 cursor-pointer"
          >
            Invite Member
          </button>
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
              </tr>
            </thead>

            <tbody>
              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No members found
                  </td>
                </tr>
              )}

              {members.map((m) => (
                <tr key={m._id} className="border-t">
                  <Td>{m.userId?.fullName || "-"}</Td>
                  <Td>{m.userId?.email || "-"}</Td>
                  <Td className="capitalize">{m.role}</Td>
                  <Td>
                    <StatusBadge status={m.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex justify-end gap-3">
            <PageBtn
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </PageBtn>
            <PageBtn
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </PageBtn>
          </div>
        )}
      </div>

      {isInviteOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsInviteOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <form
              onSubmit={handleInvite}
              className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-4"
            >
              <h2 className="text-lg font-semibold">Invite Member</h2>

              <input
                type="email"
                placeholder="user@example.com"
                className="w-full border rounded px-3 py-2 text-sm"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((p) => ({ ...p, email: e.target.value }))
                }
              />

              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={inviteForm.role}
                onChange={(e) =>
                  setInviteForm((p) => ({ ...p, role: e.target.value }))
                }
              >
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  disabled={inviting}
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded"
                >
                  {inviting ? "Inviting…" : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

const Centered = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    {children}
  </div>
);

const ErrorBox = ({ children }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-4 text-sm text-gray-800 ${className}`}>{children}</td>
);

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-green-100 text-green-700",
    invited: "bg-blue-100 text-blue-700",
    suspended: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
};

const PageBtn = ({ children, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`px-4 py-2 text-sm rounded border ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);
