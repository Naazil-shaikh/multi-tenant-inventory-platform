import api from "./axios";

export const fetchInventoryTransactions = (params = {}) => {
  return api.get("/inventory-transactions", { params });
};

export const fetchBranchTransactions = (branchId, params = {}) => {
  if (!branchId) throw new Error("branchId required");
  return api.get(`/inventory-transactions/branches/${branchId}`, {
    params,
  });
};

export const fetchProductTransactions = (branchId, productId, params = {}) => {
  if (!branchId || !productId) {
    throw new Error("branchId & productId required");
  }

  return api.get(
    `/inventory-transactions/branches/${branchId}/products/${productId}`,
    { params }
  );
};

export const addStock = (branchId, productId, data) => {
  return api.post(
    `/inventory-transactions/branches/${branchId}/products/${productId}/add`,
    data
  );
};

export const saleStock = (branchId, productId, data) => {
  return api.post(
    `/inventory-transactions/branches/${branchId}/products/${productId}/sale`,
    data
  );
};

export const removeStock = (branchId, productId, data) => {
  return api.post(
    `/inventory-transactions/branches/${branchId}/products/${productId}/remove`,
    data
  );
};

export const adjustStock = (branchId, productId, data) => {
  return api.post(
    `/inventory-transactions/branches/${branchId}/products/${productId}/adjust`,
    data
  );
};
