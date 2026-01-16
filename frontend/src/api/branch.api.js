import api from "./axios";

export const createBranch = (data) => {
  return api.post("/branches", data);
};

export const fetchBranches = (params = {}) => {
  return api.get("/branches", { params });
};

export const getBranchById = (branchId) => {
  if (!branchId) throw new Error("branchId is required");
  return api.get(`/branches/${branchId}`);
};

export const updateBranch = (branchId, data) => {
  if (!branchId) throw new Error("branchId is required");
  return api.patch(`/branches/${branchId}`, data);
};

export const updateBranchStatus = (branchId, branchStatus) => {
  return api.patch(`/branches/${branchId}/status`, {
    branchStatus,
  });
};
