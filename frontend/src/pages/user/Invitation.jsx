import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyInvitations,
  acceptInvite,
  rejectInvite,
} from "../../api/membership.api";

export default function Invitations() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState(null);
  const [processingToken, setProcessingToken] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchMyInvitations();
        setInvitations(res.data.data.invitations || []);
      } catch (e) {
        console.log(e);
        setError("Failed to load invitations");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAccept = async (inviteToken) => {
    try {
      setProcessingToken(inviteToken);
      await acceptInvite(inviteToken);
      navigate("/tenants/select");
    } catch {
      setError("Failed to accept invitation");
    } finally {
      setProcessingToken(null);
    }
  };

  const handleReject = async (inviteToken) => {
    try {
      setProcessingToken(inviteToken);
      await rejectInvite(inviteToken);
      setInvitations((prev) =>
        prev.filter((i) => i.inviteToken !== inviteToken)
      );
    } catch {
      setError("Failed to reject invitation");
    } finally {
      setProcessingToken(null);
    }
  };

  if (loading) {
    return <Centered>Loading invitations…</Centered>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Invitations</h1>
          <p className="text-sm text-gray-500">
            Invitations to join organizations
          </p>
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        {invitations.length === 0 && (
          <EmptyState onContinue={() => navigate("/tenants/select")} />
        )}

        {invitations.map((invite) => (
          <div
            key={invite.inviteToken}
            className="bg-white rounded-lg shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-900">{invite.tenantName}</p>
              <p className="text-sm text-gray-500">
                Role: <span className="capitalize">{invite.role}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(invite.inviteToken)}
                disabled={processingToken === invite.inviteToken}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Reject
              </button>

              <button
                onClick={() => handleAccept(invite.inviteToken)}
                disabled={processingToken === invite.inviteToken}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
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

const EmptyState = ({ onContinue }) => (
  <div className="bg-white rounded-lg shadow p-10 text-center space-y-4">
    <p className="text-gray-700 font-medium">You have no pending invitations</p>
    <button
      onClick={onContinue}
      className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
    >
      Continue
    </button>
  </div>
);
