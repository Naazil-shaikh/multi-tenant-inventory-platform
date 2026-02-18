import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMyInvitations,
  acceptInvite,
  rejectInvite,
} from "../../api/membership.api";

export const loadInvitations = createAsyncThunk(
  "notification/load",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchMyInvitations();
      return res.data.data.invitations || [];
    } catch {
      return rejectWithValue("Failed to load invitations");
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  "notification/accept",
  async (inviteToken, { dispatch }) => {
    await acceptInvite(inviteToken);
    dispatch(removeInvitation(inviteToken));
  }
);

export const rejectInvitation = createAsyncThunk(
  "notification/reject",
  async (inviteToken, { dispatch }) => {
    await rejectInvite(inviteToken);
    dispatch(removeInvitation(inviteToken));
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    invitations: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    removeInvitation(state, action) {
      state.invitations = state.invitations.filter(
        (i) => i.inviteToken !== action.payload
      );
      state.unreadCount = state.invitations.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadInvitations.fulfilled, (state, action) => {
        state.invitations = action.payload;
        state.unreadCount = action.payload.length;
        state.loading = false;
      })
      .addCase(loadInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeInvitation } = notificationSlice.actions;
export default notificationSlice.reducer;
