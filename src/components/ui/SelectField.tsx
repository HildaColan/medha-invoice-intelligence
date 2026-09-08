import type { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: readonly string[];
  mono?: boolean;
}

export function SelectField({ label, value, onChange, options, mono }: SelectFieldProps) {
  return (
    <div>
      <label
        className="block text-[11.5px] mb-1.5"
        style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg outline-none text-[13px]"
          style={{ background: "#fff", border: `1px solid ${T.hair}`, ...(mono ? fontMono : fontBody), color: T.slate }}
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          color={T.slateSoft}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2"
          style={{ right: 12 }}
        />
      </div>
    </div>
  );
}
