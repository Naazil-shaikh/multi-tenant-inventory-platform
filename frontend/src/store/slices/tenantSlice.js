import { createSlice } from "@reduxjs/toolkit";
import { forceLogout } from "./authSlice";

/* =========================
   HYDRATE FROM LOCALSTORAGE
========================= */
const getInitialTenantState = () => {
  try {
    const stored = localStorage.getItem("activeTenant");
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Only require _id for header attachment
    if (!parsed?._id) return null;

    return parsed;
  } catch {
    return null;
  }
};

const initialState = {
  activeTenant: getInitialTenantState(),
  tenants: [],
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenantList(state, action) {
      state.tenants = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },

    setActiveTenant(state, action) {
      const tenant = action.payload;

      // 🔥 Only require _id
      if (!tenant?._id) {
        state.error = "Invalid tenant payload";
        return;
      }

      if (tenant.status === "suspended") {
        state.activeTenant = null;
        state.error = "Tenant is suspended";
        localStorage.removeItem("activeTenant");
        return;
      }

      state.activeTenant = tenant;
      state.error = null;

      localStorage.setItem("activeTenant", JSON.stringify(tenant));
    },

    clearActiveTenant(state) {
      state.activeTenant = null;
      state.error = null;
      localStorage.removeItem("activeTenant");
    },

    resetTenantState(state) {
      state.activeTenant = null;
      state.tenants = [];
      state.loading = false;
      state.error = null;
      localStorage.removeItem("activeTenant");
    },

    userRemovedFromTenant(state, action) {
      const removedTenantId = action.payload;

      state.tenants = state.tenants.filter((t) => t._id !== removedTenantId);

      if (state.activeTenant?._id === removedTenantId) {
        state.activeTenant = null;
        localStorage.removeItem("activeTenant");
        state.error = "Access to tenant revoked";
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(forceLogout, (state) => {
      state.activeTenant = null;
      state.tenants = [];
      state.loading = false;
      state.error = null;
      localStorage.removeItem("activeTenant");
    });
  },
});

export const {
  setTenantList,
  setActiveTenant,
  clearActiveTenant,
  resetTenantState,
  userRemovedFromTenant,
} = tenantSlice.actions;

export default tenantSlice.reducer;
