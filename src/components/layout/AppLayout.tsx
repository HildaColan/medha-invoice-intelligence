import { Outlet } from "react-router-dom";
import { T, fontBody } from "@/theme/tokens";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ ...fontBody, background: T.mist }}>
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}
