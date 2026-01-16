import { createSlice } from "@reduxjs/toolkit";
import { forceLogout } from "./authSlice";

const getInitialTenantState = () => {
  try {
    const stored = localStorage.getItem("activeTenant");
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (
      !parsed?._id ||
      !parsed?.tenantName ||
      !parsed?.plan ||
      !parsed?.status ||
      !parsed?.role
    ) {
      return null;
    }

    if (parsed.status === "suspended") {
      return null;
    }

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

      if (
        !tenant?._id ||
        !tenant?.tenantName ||
        !tenant?.plan ||
        !tenant?.status ||
        !tenant?.role
      ) {
        state.error = "Invalid tenant payload";
        return;
      }

      if (tenant.status === "suspended") {
        state.activeTenant = null;
        state.error = "Tenant is suspended";
        localStorage.removeItem("activeTenant");
        return;
      }

      state.activeTenant = {
        _id: tenant._id,
        tenantName: tenant.tenantName,
        plan: tenant.plan,
        status: tenant.status,
        role: tenant.role,
      };

      state.error = null;
      localStorage.setItem("activeTenant", JSON.stringify(state.activeTenant));
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
