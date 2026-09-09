import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Briefcase, FilePlus2, FileOutput, Bell,
  ShieldCheck, SlidersHorizontal, ListChecks, ScrollText, Users,
  UserCircle2, ChevronDown, ChevronRight, LogOut, Settings2, Boxes,
  Building2, BarChart3,
} from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { paths, ADMIN_VIEWS } from "@/router/paths";
import { logout } from "@/features/auth/authStore";
import { useAuditLog } from "@/features/administration/auditLog";
import type { AdminViewKey } from "@/types";

interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

const NAV: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: paths.dashboard },
  { key: "jobs", label: "Jobs", icon: Briefcase, path: paths.jobs },
  { key: "createJob", label: "Create Job", icon: FilePlus2, path: paths.createJob },
  { key: "exports", label: "Exports", icon: FileOutput, path: paths.exports },
  { key: "notifications", label: "Notifications", icon: Bell, path: paths.notifications, badge: 3 },
];

const ADMIN_LABELS: Record<AdminViewKey, string> = {
  reports: "Reports",
  users: "Users",
  roles: "Roles",
  productMaster: "Product Master",
  customerMaster: "Customer Master",
  masters: "Masters",
  validationRules: "Validation Rules",
  outputMapping: "Output Mapping",
  auditLogs: "Audit Logs",
};

const ADMIN_ICONS: Record<AdminViewKey, LucideIcon> = {
  reports: BarChart3,
  users: Users,
  roles: ShieldCheck,
  productMaster: Boxes,
  customerMaster: Building2,
  masters: Settings2,
  validationRules: ListChecks,
  outputMapping: SlidersHorizontal,
  auditLogs: ScrollText,
};

export function Sidebar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logActivity } = useAuditLog();

  const isAdminRoute = location.pathname.startsWith("/administration");

  return (
    <aside className="w-[248px] shrink-0 h-screen sticky top-0 flex flex-col" style={{ background: T.brassDeep }}>
      <div className="px-6 pt-7 pb-6 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.22)" }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
          <span style={{ ...fontDisplay, color: T.brassDeep, fontWeight: 700, fontSize: 17 }}>M</span>
        </div>
        <div>
          <div style={{ ...fontDisplay, color: "#fff", fontWeight: 600, fontSize: 18, letterSpacing: 0.3 }}>MEDHA</div>
          <div style={{ ...fontMono, color: "rgba(255,255,255,0.75)", fontSize: 9.5, letterSpacing: "0.14em" }}>INVOICE INTELLIGENCE</div>
        </div>
      </div>

      <nav className="flex-1 px-3 pt-5 overflow-y-auto">
        {NAV.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors"
              style={{
                background: active ? "rgba(255,255,255,0.22)" : "transparent",
                borderLeft: active ? "2.5px solid #fff" : "2.5px solid transparent",
              }}
            >
              <Icon size={16.5} color={active ? "#fff" : "rgba(255,255,255,0.7)"} />
              <span className="text-[13.5px] flex-1" style={{ ...fontBody, color: active ? "#fff" : "rgba(255,255,255,0.82)", fontWeight: active ? 600 : 500 }}>
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[10px] rounded-full px-1.5 py-0.5" style={{ ...fontMono, background: T.rust, color: "#fff" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mt-3 text-left"
          style={{ background: isAdminRoute ? "rgba(255,255,255,0.16)" : "transparent" }}
        >
          <ShieldCheck size={16.5} color="rgba(255,255,255,0.7)" />
          <span className="text-[13.5px] flex-1" style={{ ...fontBody, color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>Administration</span>
          {adminOpen ? <ChevronDown size={14} color="rgba(255,255,255,0.7)" /> : <ChevronRight size={14} color="rgba(255,255,255,0.7)" />}
        </button>

        {adminOpen && (
          <div className="ml-3 pl-3 mt-1 mb-2" style={{ borderLeft: "1px solid rgba(255,255,255,0.22)" }}>
            {ADMIN_VIEWS.map((key) => {
              const active = location.pathname === paths.administration(key);
              const Icon = ADMIN_ICONS[key];
              return (
                <button
                  key={key}
                  onClick={() => navigate(paths.administration(key))}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md mb-0.5 text-left"
                  style={{ background: active ? "rgba(255,255,255,0.22)" : "transparent" }}
                >
                  <Icon size={13.5} color={active ? "#fff" : "rgba(255,255,255,0.65)"} />
                  <span className="text-[12.5px]" style={{ ...fontBody, color: active ? "#fff" : "rgba(255,255,255,0.78)" }}>
                    {ADMIN_LABELS[key]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <div
        className="flex items-center gap-1 px-3 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.22)" }}
      >
        <button
          onClick={() => navigate(paths.profile)}
          className="flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
          style={{ background: "rgba(255,255,255,0.16)" }}
        >
          <UserCircle2 size={20} color="#fff" />
          <div className="min-w-0">
            <div style={{ ...fontBody, color: "#fff", fontSize: 12.5, fontWeight: 600 }}>My Profile</div>
            <div style={{ ...fontMono, color: "rgba(255,255,255,0.75)", fontSize: 10 }}>admin@transorion.com</div>
          </div>
        </button>
        <button
          onClick={() => { logActivity({ action: "Logout", module: "Auth" }); logout(); navigate(paths.login, { replace: true }); }}
          title="Log out"
          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.16)" }}
        >
          <LogOut size={15} color="#fff" />
        </button>
      </div>
    </aside>
  );
}
