import api from "./axios";

export const fetchTenantDashboard = () => {
  return api.get("/dashboard/tenant");
};
