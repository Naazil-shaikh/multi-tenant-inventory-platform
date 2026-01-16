import api from "./axios";

export const fetchBranchInventory = (branchId, params = {}) => {
  if (!branchId) throw new Error("branchId required");
  return api.get(`/inventory/branches/${branchId}`, { params });
};

export const getInventoryProduct = (branchId, productId) => {
  if (!branchId || !productId) {
    throw new Error("branchId and productId required");
  }

  return api.get(`/inventory/branches/${branchId}/products/${productId}`);
};

export const updateInventoryPrice = (branchId, productId, data) => {
  return api.patch(
    `/inventory/branches/${branchId}/products/${productId}/price`,
    data
  );
};
