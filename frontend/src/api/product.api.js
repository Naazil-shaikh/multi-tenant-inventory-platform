import api from "./axios";

export const createProduct = (data) => {
  return api.post("/products", data);
};

export const fetchProducts = (params = {}) => {
  return api.get("/products", { params });
};

export const getProductById = (productId) => {
  if (!productId) throw new Error("productId required");
  return api.get(`/products/${productId}`);
};

export const updateProduct = (productId, data) => {
  if (!productId) throw new Error("productId required");
  return api.patch(`/products/${productId}`, data);
};

export const updateProductStatus = (productId, status) => {
  if (!productId) throw new Error("productId required");
  return api.patch(`/products/${productId}/status`, { status });
};
