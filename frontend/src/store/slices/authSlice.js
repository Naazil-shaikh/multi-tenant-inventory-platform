import { createSlice } from "@reduxjs/toolkit";

const getInitialAuthState = () => {
  try {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) return null;

    const parsed = JSON.parse(storedAuth);

    if (!parsed?.accessToken || !parsed?.user?.id || !parsed?.user?.email) {
      return null;
    }

    return {
      user: {
        id: parsed.user.id,
        fullName: parsed.user.fullName ?? "",
        email: parsed.user.email,
        isSuperAdmin: Boolean(parsed.user.isSuperAdmin),
        avatar: parsed.user.avatar,
      },
      accessToken: parsed.accessToken,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  } catch {
    return null;
  }
};

const initialState = getInitialAuthState() ?? {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  avatar: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      const { user, accessToken } = action.payload;

      if (!accessToken || !user?.id || !user?.email) {
        state.loading = false;
        state.error = "Invalid authentication payload";
        return;
      }

      state.user = {
        id: user.id,
        fullName: user.fullName ?? "",
        email: user.email,
        isSuperAdmin: Boolean(user.isSuperAdmin),
        avatar: user.avatar,
      };

      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: state.user,
          accessToken,
        })
      );
    },

    setImage(state, action) {
      const { avatarImage, coverImage = "" } = action.payload;
      state.avatarImage = avatarImage;
      state.coverImage = coverImage;
    },

    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload || "Login failed";
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("auth");
    },

    setUser(state, action) {
      const user = action.payload;

      const userId = user.id || user._id;
      if (!userId || !user?.email) return;

      state.user = {
        id: userId,
        fullName: user.fullName ?? "",
        email: user.email,
        isSuperAdmin: Boolean(user.isSuperAdmin),
        avatar: user.avatar ?? state.user?.avatar,
      };

      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...parsed,
            user: state.user,
          })
        );
      }
    },

    forceLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = "Session expired";

      localStorage.removeItem("auth");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  setImage,
  loginFailure,
  logout,
  forceLogout,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
