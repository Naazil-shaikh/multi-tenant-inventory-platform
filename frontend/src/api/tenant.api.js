import api from "./axios.js";

export const createTenant = (data) => {
  return api.post("/tenants", data);
};

export const fetchMyTenants = () => {
  return api.get("/tenants");
};

export const getTenantDetails = () => {
  return api.get("/tenants/me");
};

export const updateTenantName = (tenantName) => {
  return api.patch("/tenants/me/name", { tenantName });
};

export const updateTenantStatus = (status) => {
  return api.patch("/tenants/me/status", { status });
};
