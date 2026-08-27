import type { ChangeEvent } from "react";
import { T, fontBody, fontMono } from "@/theme/tokens";

export interface FieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  /**
   * When provided, the field becomes a controlled input (used by CRUD forms
   * like Add/Edit Product and Add/Edit Role). When omitted, the field stays
   * uncontrolled via `defaultValue`, matching the original static mock forms
   * (Create Job wizard, Profile details).
   */
  onChange?: (next: string) => void;
  mono?: boolean;
  disabled?: boolean;
}

export function Field({ label, placeholder, value, onChange, mono, disabled }: FieldProps) {
  const controlled = onChange !== undefined;
  const controlledProps = controlled
    ? { value: value ?? "", onChange: (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value) }
    : { defaultValue: value };

  return (
    <div>
      <label
        className="block text-[11.5px] mb-1.5"
        style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
      >
        {label}
      </label>
      <input
        placeholder={placeholder}
        disabled={disabled}
        {...controlledProps}
        className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
        style={{
          background: disabled ? T.mist : "#fff",
          border: `1px solid ${T.hair}`,
          ...(mono ? fontMono : fontBody),
          color: disabled ? T.slateSoft : T.slate,
        }}
      />
    </div>
  );
}
