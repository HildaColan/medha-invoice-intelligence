import { T, fontMono } from "@/theme/tokens";
import type { JobStatus } from "@/types";

interface StampVisual {
  c: string;
  bg: string;
  label: string;
}

const STAMP_MAP: Record<JobStatus, StampVisual> = {
  Completed: { c: T.teal, bg: T.tealSoft, label: "CLEARED" },
  "Validation Required": { c: T.brass, bg: T.brassSoft, label: "REVIEW" },
  Processing: { c: T.slate, bg: "#ECE7E0", label: "IN TRANSIT" },
  Queued: { c: T.slateSoft, bg: "#EFEAE3", label: "QUEUED" },
  Failed: { c: T.rust, bg: T.rustSoft, label: "HALTED" },
};

export interface StampProps {
  status: JobStatus;
}

export function Stamp({ status }: StampProps) {
  const s = STAMP_MAP[status] ?? STAMP_MAP.Queued;
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 text-[10px] font-semibold rounded-full border-2"
      style={{ ...fontMono, color: s.c, borderColor: s.c, background: s.bg, transform: "rotate(-2deg)", letterSpacing: "0.12em" }}
    >
      {s.label}
    </span>
  );
}
