import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  globalLoading: false,

  modal: {
    type: null,
    data: null,
  },

  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoader(state) {
      state.globalLoading = true;
    },

    hideLoader(state) {
      state.globalLoading = false;
    },

    showModal(state, action) {
      const { type, data = null } = action.payload || {};

      if (!type || typeof type !== "string") return;

      state.modal.type = type;
      state.modal.data = data;
    },

    hideModal(state) {
      state.modal.type = null;
      state.modal.data = null;
    },

    pushNotification(state, action) {
      const { type = "info", message } = action.payload || {};

      if (!message || typeof message !== "string") return;

      state.notifications.push({
        id: nanoid(),
        type,
        message,
      });
    },

    clearNotifications(state) {
      state.notifications = [];
    },

    resetUIState() {
      return initialState;
    },
  },
});

export const {
  showLoader,
  hideLoader,
  showModal,
  hideModal,
  pushNotification,
  clearNotifications,
  resetUIState,
} = uiSlice.actions;

export default uiSlice.reducer;
