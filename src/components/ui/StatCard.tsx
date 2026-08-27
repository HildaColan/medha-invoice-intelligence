import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}

export function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl p-5 flex-1 min-w-[170px]" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + "1A" }}>
          <Icon size={17} color={accent} />
        </div>
        {sub && (
          <span className="text-[11px] flex items-center gap-1" style={{ ...fontMono, color: T.teal }}>
            <TrendingUp size={12} /> {sub}
          </span>
        )}
      </div>
      <div className="text-3xl" style={{ ...fontDisplay, color: T.ink, fontWeight: 600 }}>{value}</div>
      <div className="text-[12.5px] mt-1" style={{ ...fontBody, color: T.slateSoft }}>{label}</div>
    </div>
  );
}
