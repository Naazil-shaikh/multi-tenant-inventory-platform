import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import tenantReducer from "./slices/tenantSlice";
import permissionReducer from "./slices/permissionSlice";
// import notificationReducer from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    permission: permissionReducer,
    // notification: notificationReducer,
  },
});

export default store;
