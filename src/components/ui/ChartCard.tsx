import type { ReactNode } from "react";
import { T, fontBody, fontDisplay } from "@/theme/tokens";

export interface ChartCardProps {
  title: string;
  sub?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, sub, children, className }: ChartCardProps) {
  return (
    <div className={"rounded-2xl p-5 " + (className ?? "")} style={{ background: T.card, border: `1px solid ${T.hair}` }}>
      <div style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>{title}</div>
      {sub && <div style={{ ...fontBody, color: T.slateSoft, fontSize: 11.5, marginTop: 1, marginBottom: 6 }}>{sub}</div>}
      {children}
    </div>
  );
}
