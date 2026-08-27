import { T, fontMono } from "@/theme/tokens";
import { Td, Th } from "@/components/ui";

const VALIDATION_RULES: Array<[string, string, string]> = [
  ["Invoice Number", "Mandatory", "Must not be empty"],
  ["Quantity × Unit Price", "Calculation", "≈ Line Value (tolerance 1%)"],
  ["Invoice Number", "Duplicate check", "Unique within job"],
  ["HSN/CTH", "Master validation", "Must exist in product master"],
  ["Invoice Total", "Calculation", "≈ Sum of line values + tax"],
  ["Currency", "Mandatory", "Must not be empty"],
];

export function ValidationRulesPanel() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
      <table className="w-full">
        <thead>
          <tr><Th>Field</Th><Th>Rule type</Th><Th>Condition</Th><Th>Status</Th></tr>
        </thead>
        <tbody>
          {VALIDATION_RULES.map((r, i) => (
            <tr key={i}>
              <Td mono>{r[0]}</Td>
              <Td>{r[1]}</Td>
              <Td>{r[2]}</Td>
              <Td>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ ...fontMono, background: T.tealSoft, color: T.teal }}>
                  Enabled
                </span>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
