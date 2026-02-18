import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const getDefaultPagination = () => ({
  page: 1,
  limit: 10,
  sort: null,
  filters: {},
});

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPagination(state, action) {
      const { resource, updates } = action.payload || {};
      if (!resource) return;

      const current = state[resource] ?? getDefaultPagination();
      const next = { ...current, ...updates };

      if (
        updates?.filters &&
        JSON.stringify(updates.filters) !== JSON.stringify(current.filters)
      ) {
        next.page = 1;
      }

      state[resource] = next;
    },

    resetPagination(state, action) {
      const { resource } = action.payload || {};
      if (!resource) return;
      state[resource] = getDefaultPagination();
    },

    clearAllPagination() {
      return {};
    },
  },
});

export const { setPagination, resetPagination, clearAllPagination } =
  paginationSlice.actions;

export default paginationSlice.reducer;
