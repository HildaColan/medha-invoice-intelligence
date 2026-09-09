import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: readonly string[];
  mono?: boolean;
}

export function SelectField({ label, value, onChange, options, mono }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="block text-[11.5px] mb-1.5"
        style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 pl-3.5 pr-3 py-2.5 rounded-lg outline-none text-[13px] text-left"
        style={{ background: "#fff", border: `1px solid ${T.hair}`, ...(mono ? fontMono : fontBody), color: T.slate }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} color={T.slateSoft} className="shrink-0" />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl py-1.5 max-h-64 overflow-y-auto"
          style={{ background: T.card, boxShadow: "0 12px 32px rgba(34,26,20,0.16)" }}
        >
          {options.map((o) => {
            const selected = o === value;
            return (
              <button
                key={o}
                type="button"
                onClick={() => select(o)}
                onMouseDown={(e) => e.preventDefault()}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-[13px] text-left transition-colors"
                style={{
                  ...(mono ? fontMono : fontBody),
                  color: selected ? T.brass : T.slate,
                  fontWeight: selected ? 600 : 400,
                  background: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.brassSoft)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span className="truncate">{o}</span>
                {selected && <Check size={14} color={T.brass} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
