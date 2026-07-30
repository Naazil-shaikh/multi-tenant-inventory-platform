import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AIAssistant from "../ai/AiAssistant";

export default function TenantLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* <Header /> */}
      <main className="flex-1 px-6 py-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
      <AIAssistant />
      {/* <Footer /> */}
    </div>
  );
}
