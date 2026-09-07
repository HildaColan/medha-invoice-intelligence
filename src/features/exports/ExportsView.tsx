import { useState } from "react";
import { Clock, Download, FileOutput } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";
import { SectionHeading, StatCard, Td, Th, useToast } from "@/components/ui";
import { EXPORTS } from "@/data";
import type { ExportRecord } from "@/types";
import { useAuditLog } from "@/features/administration/auditLog";

export function ExportsView() {
  const notify = useToast();
  const { logActivity } = useAuditLog();
  const [exportsList, setExportsList] = useState<ExportRecord[]>(EXPORTS);

  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("00:00");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("23:59");
  const [appliedRange, setAppliedRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const download = (file: ExportRecord) => {
    setExportsList((prev) => prev.map((e) => (e.file === file.file ? { ...e, status: "Downloaded" } : e)));
    notify(`${file.status === "Downloaded" ? "Re-downloading" : "Downloading"} ${file.file}…`);
    logActivity({ action: "Download", module: "Exports", ref: file.file, previousValue: file.status, updatedValue: "Downloaded" });
  };

  const applyPeriodFilter = () => {
    const from = fromDate ? new Date(`${fromDate}T${fromTime || "00:00"}`) : null;
    const to = toDate ? new Date(`${toDate}T${toTime || "23:59"}`) : null;
    setAppliedRange({ from, to });
    notify(from || to ? "Period filter applied." : "Period filter cleared.");
  };

  const clearPeriodFilter = () => {
    setFromDate("");
    setFromTime("00:00");
    setToDate("");
    setToTime("23:59");
    setAppliedRange({ from: null, to: null });
  };

  const filteredExports = exportsList.filter((e) => {
    if (!appliedRange.from && !appliedRange.to) return true;
    const d = new Date(e.date);
    if (appliedRange.from && d < appliedRange.from) return false;
    if (appliedRange.to && d > appliedRange.to) return false;
    return true;
  });

  return (
    <div className="px-8 py-7">
      <SectionHeading eyebrow="EXPORT MANAGEMENT" title="Generated exports" />
      <div className="flex gap-4 flex-wrap mb-6">
        <StatCard icon={FileOutput} label="Exports this month" value="19" accent={T.brass} />
        <StatCard icon={Download} label="Downloaded" value={String(exportsList.filter((e) => e.status === "Downloaded").length)} accent={T.teal} />
        <StatCard icon={Clock} label="Awaiting download" value={String(exportsList.filter((e) => e.status !== "Downloaded").length)} accent={T.slate} />
      </div>

      <div className="rounded-2xl p-4 mb-5 flex items-end gap-4 flex-wrap" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <div>
          <label className="block text-[11px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>FROM</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-[12.5px] outline-none"
              style={{ border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            />
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="px-3 py-2 rounded-lg text-[12.5px] outline-none"
              style={{ border: `1px solid ${T.hair}`, ...fontMono, color: T.slate }}
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>TO</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-[12.5px] outline-none"
              style={{ border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            />
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="px-3 py-2 rounded-lg text-[12.5px] outline-none"
              style={{ border: `1px solid ${T.hair}`, ...fontMono, color: T.slate }}
            />
          </div>
        </div>
        <button
          onClick={applyPeriodFilter}
          className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          Apply period
        </button>
        <button
          onClick={clearPeriodFilter}
          className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
          style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
        >
          Clear
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Job No.</Th><Th>File name</Th><Th>Template</Th><Th>Generated by</Th><Th>Date</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {filteredExports.map((e) => (
              <tr key={e.file}>
                <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{e.job}</span></Td>
                <Td mono>{e.file}</Td>
                <Td>{e.type}</Td>
                <Td>{e.by}</Td>
                <Td mono>{e.date}</Td>
                <Td>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ ...fontMono, background: T.tealSoft, color: T.teal }}>
                    {e.status}
                  </span>
                </Td>
                <Td><button onClick={() => download(e)} aria-label={`Download ${e.file}`}><Download size={15} color={T.slateSoft} /></button></Td>
              </tr>
            ))}
            {filteredExports.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No exports in the selected period.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
