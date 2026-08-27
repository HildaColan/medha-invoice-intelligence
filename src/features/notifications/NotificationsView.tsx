import type { LucideIcon } from "lucide-react";
import { Bell, CheckCircle2, Package, XCircle } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";
import { SectionHeading, StatCard } from "@/components/ui";
import { NOTIFICATIONS } from "@/data";
import type { NotificationKind } from "@/types";

const iconFor = (kind: NotificationKind): LucideIcon =>
  kind === "success" ? CheckCircle2 : kind === "error" ? XCircle : Bell;

const colorFor = (kind: NotificationKind): string =>
  kind === "success" ? T.teal : kind === "error" ? T.rust : T.brass;

export function NotificationsView() {
  return (
    <div className="px-8 py-7">
      <SectionHeading eyebrow="ACTIVITY" title="Notifications" />
      <div className="flex gap-4 flex-wrap mb-6">
        <StatCard icon={Bell} label="Total this week" value="27" accent={T.brass} />
        <StatCard icon={CheckCircle2} label="Success events" value="18" accent={T.teal} />
        <StatCard icon={XCircle} label="Failures / errors" value="6" accent={T.rust} />
        <StatCard icon={Package} label="System / info" value="3" accent={T.slate} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        {NOTIFICATIONS.map((n, i) => {
          const Icon = iconFor(n.kind);
          return (
            <div
              key={i}
              className="flex items-start gap-4 px-6 py-4"
              style={{ borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${T.hair}` : "none" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: colorFor(n.kind) + "1A" }}>
                <Icon size={16} color={colorFor(n.kind)} />
              </div>
              <div className="flex-1">
                <div style={{ ...fontBody, color: T.ink, fontSize: 13.5, fontWeight: 600 }}>{n.title}</div>
                <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12.5, marginTop: 2 }}>{n.detail}</div>
              </div>
              <div className="shrink-0" style={{ ...fontMono, color: T.slateSoft, fontSize: 11 }}>{n.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
