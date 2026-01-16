import api from "./axios";

export const fetchMemberships = () => {
  return api.get("/memberships");
};

export const inviteMember = (data) => {
  return api.post("/memberships/invite", data);
};

export const acceptInvite = (inviteToken) => {
  return api.post("/memberships/accept", { inviteToken });
};

export const rejectInvite = (inviteToken) => {
  return api.post("/memberships/reject", { inviteToken });
};

export const fetchTenantMembers = (params = {}) => {
  return api.get("/memberships", { params });
};

export const fetchMyInvitations = () => {
  return api.get("/memberships/invitations");
};
