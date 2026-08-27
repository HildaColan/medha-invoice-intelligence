import { CheckCircle2 } from "lucide-react";
import { PIPELINE_STAGES } from "@/data";
import { T, fontMono } from "@/theme/tokens";

export interface PipelineStripProps {
  /** 1-based index of the current stage */
  stage: number;
  compact?: boolean;
}

export function PipelineStrip({ stage, compact }: PipelineStripProps) {
  return (
    <div className="flex items-center">
      {PIPELINE_STAGES.map((label, i) => {
        const idx = i + 1;
        const done = idx < stage;
        const active = idx === stage;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center" style={{ width: compact ? 14 : 64 }}>
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: compact ? 10 : 22,
                  height: compact ? 10 : 22,
                  background: done ? T.teal : active ? T.brass : "#EAE3DA",
                  border: active ? `2px solid ${T.brass}` : "none",
                }}
              >
                {!compact && done && <CheckCircle2 size={13} color="#fff" />}
              </div>
              {!compact && (
                <span
                  className="mt-1 text-[9px] text-center leading-tight"
                  style={{ ...fontMono, color: active ? T.brass : done ? T.teal : T.slateSoft }}
                >
                  {label}
                </span>
              )}
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                style={{
                  width: compact ? 8 : 20,
                  height: 2,
                  background: idx < stage ? T.teal : T.hair,
                  marginBottom: compact ? 0 : 14,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
