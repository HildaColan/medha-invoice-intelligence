import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";
import { Field, SelectField, Td, Th } from "@/components/ui";
import { useAuditLog } from "../auditLog";

const ALL = "All";

export function AuditLogsPanel() {
  const { entries } = useAuditLog();

  // Depend on `entries` (not a frozen []) so these option lists pick up new
  // users/modules/actions as logActivity(...) appends live entries.
  const userOptions = useMemo(() => [ALL, ...Array.from(new Set(entries.map((a) => a.user)))], [entries]);
  const moduleOptions = useMemo(() => [ALL, ...Array.from(new Set(entries.map((a) => a.module)))], [entries]);
  const actionOptions = useMemo(() => [ALL, ...Array.from(new Set(entries.map((a) => a.action)))], [entries]);
  const resultOptions = [ALL, "Success", "Failed"] as const;

  const [user, setUser] = useState(ALL);
  const [module, setModule] = useState(ALL);
  const [action, setAction] = useState(ALL);
  const [result, setResult] = useState<string>(ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refQuery, setRefQuery] = useState("");

  const filtered = entries.filter((a) => {
    if (user !== ALL && a.user !== user) return false;
    if (module !== ALL && a.module !== module) return false;
    if (action !== ALL && a.action !== action) return false;
    if (result !== ALL && a.result !== result) return false;
    if (refQuery && !a.ref.toLowerCase().includes(refQuery.toLowerCase())) return false;
    const entryDate = new Date(a.time.replace(",", ""));
    if (fromDate && entryDate < new Date(fromDate)) return false;
    if (toDate && entryDate > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  });

  const clearFilters = () => {
    setUser(ALL);
    setModule(ALL);
    setAction(ALL);
    setResult(ALL);
    setFromDate("");
    setToDate("");
    setRefQuery("");
  };

  return (
    <>
      <div className="rounded-2xl p-5 mb-5 flex items-start gap-3" style={{ background: T.tealSoft, border: `1px solid ${T.teal}33` }}>
        <ShieldCheck size={18} color={T.teal} className="mt-0.5 shrink-0" />
        <div style={{ ...fontBody, color: T.slate, fontSize: 12.5 }}>
          <span style={{ fontWeight: 700, color: T.ink }}>System-generated and tamper-resistant. </span>
          Every action performed in MEDHA is captured automatically. Entries cannot be added, edited, or deleted —
          this log exists to provide traceability and support compliance review.
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-5 grid grid-cols-4 gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <SelectField label="User" value={user} onChange={setUser} options={userOptions} />
        <SelectField label="Module" value={module} onChange={setModule} options={moduleOptions} />
        <SelectField label="Activity Type" value={action} onChange={setAction} options={actionOptions} />
        <SelectField label="Status" value={result} onChange={setResult} options={resultOptions} />

        <div>
          <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
            style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
          />
        </div>
        <div>
          <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
            style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
          />
        </div>
        <Field label="Job / Reference" placeholder="e.g. JOB-000124" value={refQuery} onChange={setRefQuery} />
        <button
          onClick={clearFilters}
          className="px-3.5 py-2.5 rounded-lg text-[12.5px] font-semibold h-[38px]"
          style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
        >
          Clear
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr>
              <Th>User</Th><Th>Action</Th><Th>Module</Th><Th>Reference</Th>
              <Th>Previous → Updated</Th><Th>Status</Th><Th>Timestamp</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <Td>{a.user}</Td>
                <Td>{a.action}</Td>
                <Td>{a.module}</Td>
                <Td mono>{a.ref}</Td>
                <Td mono>
                  {a.previousValue || a.updatedValue ? (
                    <span style={{ color: T.slateSoft }}>
                      {a.previousValue ?? "—"} <span style={{ color: T.hair }}>→</span> <span style={{ color: T.ink, fontWeight: 600 }}>{a.updatedValue ?? "—"}</span>
                    </span>
                  ) : (
                    <span style={{ color: T.slateSoft }}>—</span>
                  )}
                </Td>
                <Td>
                  {a.result === "Success" ? (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.teal, fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> Success
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.rust, fontWeight: 600 }}>
                      <XCircle size={13} /> Failed
                    </span>
                  )}
                </Td>
                <Td mono>{a.time}</Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No activity matches the selected filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
