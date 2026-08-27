import type { ReactNode } from "react";
import { T, fontBody, fontMono } from "@/theme/tokens";

export interface ThProps {
  children?: ReactNode;
}

export function Th({ children }: ThProps) {
  return (
    <th
      className="text-left px-4 py-3 text-[11px] tracking-wider font-semibold"
      style={{ ...fontMono, color: T.slateSoft, borderBottom: `1px solid ${T.hair}` }}
    >
      {children}
    </th>
  );
}

export interface TdProps {
  children?: ReactNode;
  mono?: boolean;
}

export function Td({ children, mono }: TdProps) {
  return (
    <td
      className="px-4 py-3.5 text-[13px]"
      style={{ ...(mono ? fontMono : fontBody), color: T.slate, borderBottom: `1px solid ${T.hair}` }}
    >
      {children}
    </td>
  );
}
