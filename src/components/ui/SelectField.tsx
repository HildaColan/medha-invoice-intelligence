import type { ChangeEvent } from "react";
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
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
        style={{ background: "#fff", border: `1px solid ${T.hair}`, ...(mono ? fontMono : fontBody), color: T.slate }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
