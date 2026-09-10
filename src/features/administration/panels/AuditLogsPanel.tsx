import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { DateRangePicker, Field, SelectField, Td, Th } from "@/components/ui";
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

  const [appliedUser, setAppliedUser] = useState(ALL);
  const [appliedModule, setAppliedModule] = useState(ALL);
  const [appliedAction, setAppliedAction] = useState(ALL);
  const [appliedResult, setAppliedResult] = useState<string>(ALL);
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  const [appliedRefQuery, setAppliedRefQuery] = useState("");

  const filtered = entries.filter((a) => {
    if (appliedUser !== ALL && a.user !== appliedUser) return false;
    if (appliedModule !== ALL && a.module !== appliedModule) return false;
    if (appliedAction !== ALL && a.action !== appliedAction) return false;
    if (appliedResult !== ALL && a.result !== appliedResult) return false;
    if (appliedRefQuery && !a.ref.toLowerCase().includes(appliedRefQuery.toLowerCase())) return false;
    const entryDate = new Date(a.time.replace(",", ""));
    if (appliedFromDate && entryDate < new Date(appliedFromDate)) return false;
    if (appliedToDate && entryDate > new Date(`${appliedToDate}T23:59:59`)) return false;
    return true;
  });

  const hasFilters =
    user !== ALL || module !== ALL || action !== ALL || result !== ALL || !!fromDate || !!toDate || !!refQuery ||
    appliedUser !== ALL || appliedModule !== ALL || appliedAction !== ALL || appliedResult !== ALL ||
    !!appliedFromDate || !!appliedToDate || !!appliedRefQuery;

  const applyFilters = () => {
    setAppliedUser(user);
    setAppliedModule(module);
    setAppliedAction(action);
    setAppliedResult(result);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedRefQuery(refQuery);
  };

  const clearFilters = () => {
    setUser(ALL);
    setModule(ALL);
    setAction(ALL);
    setResult(ALL);
    setFromDate("");
    setToDate("");
    setRefQuery("");
    setAppliedUser(ALL);
    setAppliedModule(ALL);
    setAppliedAction(ALL);
    setAppliedResult(ALL);
    setAppliedFromDate("");
    setAppliedToDate("");
    setAppliedRefQuery("");
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

      <div className="rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <div className="w-[200px]">
          <SelectField label="User" value={user} onChange={setUser} options={userOptions} />
        </div>
        <div className="w-[200px]">
          <SelectField label="Module" value={module} onChange={setModule} options={moduleOptions} />
        </div>
        <div className="w-[200px]">
          <SelectField label="Activity Type" value={action} onChange={setAction} options={actionOptions} />
        </div>
        <div className="w-[180px]">
          <SelectField label="Status" value={result} onChange={setResult} options={resultOptions} />
        </div>
        <div className="w-[260px]">
          <DateRangePicker label="Date Range" from={fromDate} to={toDate} onApply={(f, t) => { setFromDate(f); setToDate(t); }} placeholder="Select date range" />
        </div>
        <div className="w-[220px]">
          <Field label="Job / Reference" placeholder="e.g. JOB-000124" value={refQuery} onChange={setRefQuery} />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold h-[38px]"
            style={{ background: T.brass, color: "#fff", ...fontBody }}
          >
            Apply
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3.5 py-2.5 rounded-lg text-[12.5px] font-semibold h-[38px]"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr>
              <Th>User/UserId</Th><Th>Action</Th><Th>Module</Th><Th>Reference</Th>
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
