import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, LogOut, Search, Settings2, UserCircle2, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { NOTIFICATIONS } from "@/data";
import type { NotificationKind } from "@/types";
import { paths } from "@/router/paths";
import { getPageTitle } from "@/router/titles";

type PanelKey = "notif" | "profile" | null;

const notifIconFor = (kind: NotificationKind): LucideIcon =>
  kind === "success" ? CheckCircle2 : kind === "error" ? XCircle : Bell;

const notifColorFor = (kind: NotificationKind): string =>
  kind === "success" ? T.teal : kind === "error" ? T.rust : T.brass;

export function Topbar() {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const title = getPageTitle(location.pathname);

  const toggle = (panel: PanelKey) => setOpenPanel(openPanel === panel ? null : panel);

  return (
    <div
      className="sticky top-0 z-20 flex items-center justify-between px-8 py-4"
      style={{ background: T.mist + "F2", backdropFilter: "blur(6px)", borderBottom: `1px solid ${T.hair}` }}
    >
      <div style={{ ...fontMono, color: T.slateSoft, fontSize: 11.5, letterSpacing: "0.08em" }}>
        MEDHA / <span style={{ color: T.ink, fontWeight: 600 }}>{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full" style={{ background: "#fff", border: `1px solid ${T.hair}`, width: 260 }}>
          <Search size={14} color={T.slateSoft} />
          <input
            placeholder="Search jobs, invoices, parts…"
            className="bg-transparent outline-none text-[12.5px] w-full"
            style={{ ...fontBody, color: T.slate }}
          />
        </div>

        {/* Notification popover */}
        <div className="relative">
          <button
            onClick={() => toggle("notif")}
            className="relative w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: openPanel === "notif" ? T.brassSoft : "#fff", border: `1px solid ${openPanel === "notif" ? T.brass : T.hair}` }}
          >
            <Bell size={15} color={T.slate} />
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full" style={{ background: T.rust }} />
          </button>
          {openPanel === "notif" && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpenPanel(null)} />
              <div
                className="absolute right-0 mt-2 w-[440px] rounded-2xl overflow-hidden z-20"
                style={{ background: T.card, border: `1px solid ${T.hair}`, boxShadow: "0 12px 32px rgba(34,26,20,0.16)" }}
              >
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${T.hair}` }}>
                  <span style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>Notifications</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ ...fontMono, background: T.rustSoft, color: T.rust }}>
                    3 new
                  </span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {NOTIFICATIONS.slice(0, 4).map((n, i) => {
                    const Icon = notifIconFor(n.kind);
                    return (
                      <div key={i} className="flex items-start gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid ${T.hair}` }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: notifColorFor(n.kind) + "1A" }}>
                          <Icon size={14} color={notifColorFor(n.kind)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div style={{ ...fontBody, color: T.ink, fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                          <div style={{ ...fontBody, color: T.slateSoft, fontSize: 11.5, marginTop: 2 }}>{n.detail}</div>
                          <div style={{ ...fontMono, color: T.slateSoft, fontSize: 10.5, marginTop: 4 }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => { navigate(paths.notifications); setOpenPanel(null); }}
                  className="w-full text-center px-4 py-3 text-[12px] font-semibold"
                  style={{ ...fontBody, color: T.brass, borderTop: `1px solid ${T.hair}` }}
                >
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        {/* Profile popover */}
        <div className="relative">
          <button
            onClick={() => toggle("profile")}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold"
            style={{ background: T.brass, color: "#fff", ...fontDisplay, outline: openPanel === "profile" ? `2px solid ${T.brass}44` : "none" }}
          >
            PR
          </button>
          {openPanel === "profile" && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpenPanel(null)} />
              <div
                className="absolute right-0 mt-2 w-[240px] rounded-2xl overflow-hidden z-20"
                style={{ background: T.card, border: `1px solid ${T.hair}`, boxShadow: "0 12px 32px rgba(34,26,20,0.16)" }}
              >
                <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${T.hair}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold" style={{ background: T.brass, color: "#fff", ...fontDisplay }}>
                    PR
                  </div>
                  <div className="min-w-0">
                    <div style={{ ...fontBody, color: T.ink, fontSize: 13, fontWeight: 700 }}>Priya Raghavan</div>
                    <div style={{ ...fontMono, color: T.slateSoft, fontSize: 10.5 }}>admin@transorion.com</div>
                  </div>
                </div>
                <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${T.hair}` }}>
                  <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold" style={{ ...fontMono, background: T.tealSoft, color: T.teal }}>
                    Administrator
                  </span>
                </div>
                <button
                  onClick={() => { navigate(paths.profile); setOpenPanel(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[#F5EDE4]"
                >
                  <UserCircle2 size={15} color={T.slateSoft} />
                  <span style={{ ...fontBody, color: T.slate, fontSize: 12.5, fontWeight: 500 }}>My Profile</span>
                </button>
                <button
                  onClick={() => { navigate(paths.accountSettings); setOpenPanel(null); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[#F5EDE4]"
                >
                  <Settings2 size={15} color={T.slateSoft} />
                  <span style={{ ...fontBody, color: T.slate, fontSize: 12.5, fontWeight: 500 }}>Account Settings</span>
                </button>
                <button
                  onClick={() => setOpenPanel(null)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[#F5EDE4]"
                  style={{ borderTop: `1px solid ${T.hair}` }}
                >
                  <LogOut size={15} color={T.rust} />
                  <span style={{ ...fontBody, color: T.rust, fontSize: 12.5, fontWeight: 600 }}>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
