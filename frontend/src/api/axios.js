import axios from "axios";
import store from "../store";
import { forceLogout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const tenant = state.tenant.activeTenant;
  const token = state.auth.accessToken;

  if (tenant?._id) {
    config.headers["X-Tenant-Id"] = tenant._id;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      store.dispatch(forceLogout());
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post("/users/refresh-token");

      return api(originalRequest);
    } catch (refreshError) {
      store.dispatch(forceLogout());
      return Promise.reject(refreshError);
    }
  }
);

export default api;
