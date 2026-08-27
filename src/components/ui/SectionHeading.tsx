import type { ReactNode } from "react";
import { T, fontDisplay, fontMono } from "@/theme/tokens";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
      <div>
        {eyebrow && (
          <div className="text-[11px] tracking-[0.18em] mb-1" style={{ ...fontMono, color: T.brass, fontWeight: 600 }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ ...fontDisplay, color: T.ink, fontSize: 24, fontWeight: 600 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
