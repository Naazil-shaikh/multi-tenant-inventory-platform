import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import {
  setPermissions,
  clearPermissions,
} from "./store/slices/permissionSlice";
import { ROLE_PERMISSIONS } from "./permissionConstants/RolePermission";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const activeTenant = useSelector((state) => state.tenant.activeTenant);

  useEffect(() => {
    if (activeTenant?.role) {
      dispatch(setPermissions(ROLE_PERMISSIONS[activeTenant.role] || []));
    } else {
      dispatch(clearPermissions());
    }
  }, [activeTenant, dispatch]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-400">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
