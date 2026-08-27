import { T } from "@/theme/tokens";

export interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
}

export function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className="relative rounded-full transition-colors shrink-0"
      style={{ width: 38, height: 22, background: on ? T.teal : T.hair }}
    >
      <span
        className="absolute top-[3px] rounded-full bg-white transition-all"
        style={{ width: 16, height: 16, left: on ? 19 : 3, boxShadow: "0 1px 2px rgba(34,26,20,0.3)" }}
      />
    </button>
  );
}
