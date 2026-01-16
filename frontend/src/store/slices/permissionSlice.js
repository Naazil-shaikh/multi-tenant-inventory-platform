import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allowed: [],
  loading: false,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions(state, action) {
      const permissions = action.payload;

      if (
        !Array.isArray(permissions) ||
        permissions.some((p) => typeof p !== "string")
      ) {
        state.allowed = [];
        state.loading = false;
        return;
      }

      state.allowed = permissions;
      state.loading = false;
    },

    clearPermissions(state) {
      state.allowed = [];
      state.loading = false;
    },

    permissionsLoading(state) {
      state.loading = true;
    },
  },
});

export const { setPermissions, clearPermissions, permissionsLoading } =
  permissionSlice.actions;

export default permissionSlice.reducer;
