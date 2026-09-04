import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarClock, CheckCircle2, Database, Download, FileSpreadsheet, FileText, RefreshCcw } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from "@/theme/tokens";
import { ChartCard, Field, SectionHeading, SelectField, StatCard, Td, Th, useToast } from "@/components/ui";
import { CUSTOMERS, DAILY_JOB_STATS, DOWNLOADABLE_DATASETS, JOBS, JOB_INVOICES, USERS, USER_ACTIVITY_REPORT } from "@/data";
import type { ReportJobStatus } from "@/types";
import { exportRowsAsCsv, exportRowsAsExcel } from "./exportUtils";

type TabKey = "activity" | "datetime" | "downloads";

const TABS: { key: TabKey; label: string }[] = [
  { key: "activity", label: "User Activity & Job Performance" },
  { key: "datetime", label: "Date & Time Reporting" },
  { key: "downloads", label: "Master Data & Document Download" },
];

const ALL = "All";
const USER_OPTIONS = [ALL, ...USERS.map((u) => u.name)];
const STATUS_OPTIONS: Array<ReportJobStatus | "All"> = ["All", "Completed", "Pending", "Rework"];
const ACTIVITY_OPTIONS = [ALL, ...Array.from(new Set(USER_ACTIVITY_REPORT.map((r) => r.lastActivity)))];

export function ReportsView() {
  const notify = useToast();
  const [tab, setTab] = useState<TabKey>("activity");

  const [user, setUser] = useState(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [activityType, setActivityType] = useState(ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredActivity = USER_ACTIVITY_REPORT.filter((r) => {
    if (user !== ALL && r.user !== user) return false;
    if (status !== ALL && r.status !== status) return false;
    if (activityType !== ALL && r.lastActivity !== activityType) return false;
    const d = new Date(r.date);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;
    return true;
  });

  const completedCount = filteredActivity.filter((r) => r.status === "Completed").length;
  const pendingCount = filteredActivity.filter((r) => r.status === "Pending").length;
  const reworkCount = filteredActivity.filter((r) => r.rework).length;

  const exportActivity = (format: "excel" | "csv" | "pdf") => {
    if (format === "pdf") {
      notify("PDF export isn't available in this preview — use Excel or CSV.");
      return;
    }
    const rows = filteredActivity.map((r) => ({
      User: r.user,
      Role: r.role,
      "Job Number": r.jobNumber,
      Date: r.date,
      "Start Time": r.startTime,
      "Completion Time": r.completionTime,
      Turnaround: r.turnaround,
      "Records Processed": r.recordsProcessed,
      Rework: r.rework ? "Yes" : "No",
      "Last Activity": r.lastActivity,
      Status: r.status,
    }));
    if (rows.length === 0) {
      notify("No rows match the current filters.");
      return;
    }
    if (format === "excel") exportRowsAsExcel("user-activity-report.xlsx", rows);
    else exportRowsAsCsv("user-activity-report.csv", rows);
    notify(`${format === "excel" ? "Excel" : "CSV"} report downloaded.`);
  };

  const [datasetQuery, setDatasetQuery] = useState("");
  const filteredDatasets = DOWNLOADABLE_DATASETS.filter((d) => d.name.toLowerCase().includes(datasetQuery.toLowerCase()));

  const downloadDataset = (id: string) => {
    switch (id) {
      case "ds-customer-master":
        exportRowsAsExcel("customer-master.xlsx", CUSTOMERS.map((c) => ({ Code: c.code, Name: c.name, GSTIN: c.gstin, Email: c.email, Phone: c.phone, Status: c.status })));
        break;
      case "ds-user-master":
        exportRowsAsExcel("user-master.xlsx", USERS.map((u) => ({ Name: u.name, Email: u.email, Role: u.role, Status: u.status })));
        break;
      case "ds-job-master":
        exportRowsAsExcel("job-master.xlsx", JOBS.map((j) => ({ "Job No.": j.id, Shipment: j.shipment, Forwarder: j.forwarder, Invoices: j.invoices, Created: j.created, Status: j.status })));
        break;
      case "ds-invoice-master":
        exportRowsAsExcel("invoice-master.xlsx", JOB_INVOICES.map((i) => ({ "Invoice Number": i.number, "Source File": i.sourceFile, Status: i.status, "Duplicate Of": i.duplicateOf ?? "" })));
        break;
      default:
        notify("No records available for this dataset in the current preview.");
        return;
    }
    notify("Download started.");
  };

  const totalCompleted7d = DAILY_JOB_STATS.reduce((sum, d) => sum + d.completed, 0);
  const totalPending7d = DAILY_JOB_STATS.reduce((sum, d) => sum + d.pending, 0);

  return (
    <div className="px-8 py-7">
      <SectionHeading eyebrow="ADMIN / DIRECTOR" title="Reports" />

      <div className="flex gap-1 mb-6 overflow-x-auto overflow-y-hidden" style={{ borderBottom: `1px solid ${T.hair}` }}>
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="shrink-0 px-4 py-2.5 text-[13px] font-semibold -mb-px"
              style={{
                ...fontBody,
                color: active ? T.brass : T.slateSoft,
                borderBottom: active ? `2px solid ${T.brass}` : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "activity" && (
        <>
          <div className="flex gap-4 flex-wrap mb-5">
            <StatCard icon={CheckCircle2} label="Completed" value={String(completedCount)} accent={T.teal} />
            <StatCard icon={AlertTriangle} label="Pending" value={String(pendingCount)} accent={T.brass} />
            <StatCard icon={RefreshCcw} label="Required rework" value={String(reworkCount)} accent={T.rust} />
          </div>

          <div className="rounded-2xl p-4 mb-4 grid grid-cols-5 gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <SelectField label="User" value={user} onChange={setUser} options={USER_OPTIONS} />
            <SelectField label="Job Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            <SelectField label="Activity Type" value={activityType} onChange={setActivityType} options={ACTIVITY_OPTIONS} />
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <button onClick={() => exportActivity("excel")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold" style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}>
              <FileSpreadsheet size={14} /> Excel
            </button>
            <button onClick={() => exportActivity("csv")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold" style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}>
              <FileText size={14} /> CSV
            </button>
            <button onClick={() => exportActivity("pdf")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold" style={{ background: T.brass, color: "#fff", ...fontBody }}>
              <Download size={14} /> PDF
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <Th>User</Th><Th>Role</Th><Th>Job No.</Th><Th>Date</Th><Th>Start</Th><Th>Completion</Th>
                    <Th>Turnaround</Th><Th>Records</Th><Th>Rework</Th><Th>Last Activity</Th><Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivity.map((r) => (
                    <tr key={r.id}>
                      <Td>{r.user}</Td>
                      <Td mono>{r.role}</Td>
                      <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{r.jobNumber}</span></Td>
                      <Td mono>{r.date}</Td>
                      <Td mono>{r.startTime}</Td>
                      <Td mono>{r.completionTime}</Td>
                      <Td mono>{r.turnaround}</Td>
                      <Td mono>{r.recordsProcessed}</Td>
                      <Td>{r.rework ? <span style={{ color: T.rust, fontWeight: 600 }}>Yes</span> : "No"}</Td>
                      <Td>{r.lastActivity}</Td>
                      <Td>
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                          style={{
                            ...fontMono,
                            background: r.status === "Completed" ? T.tealSoft : r.status === "Rework" ? T.rustSoft : T.brassSoft,
                            color: r.status === "Completed" ? T.teal : r.status === "Rework" ? T.rust : T.brass,
                          }}
                        >
                          {r.status}
                        </span>
                      </Td>
                    </tr>
                  ))}
                  {filteredActivity.length === 0 && (
                    <tr><td colSpan={11} className="px-4 py-8 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No activity matches the selected filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "datetime" && (
        <>
          <ChartCard title="Jobs completed vs. pending, last 7 days" sub="Daily processing volume across all users">
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DAILY_JOB_STATS} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.hair} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.slateSoft, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: T.hair }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: T.slateSoft, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} width={26} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                  <Bar dataKey="completed" name="Completed" fill={T.teal} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill={T.brass} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-[11px]" style={{ ...fontBody, color: T.slateSoft }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: T.teal }} /> Completed
              </span>
              <span className="flex items-center gap-1.5 text-[11px]" style={{ ...fontBody, color: T.slateSoft }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: T.brass }} /> Pending
              </span>
            </div>
          </ChartCard>

          <div className="grid grid-cols-3 gap-4 mt-5">
            <StatCard icon={CheckCircle2} label="Total completed (7 days)" value={String(totalCompleted7d)} accent={T.teal} />
            <StatCard icon={AlertTriangle} label="Total pending (7 days)" value={String(totalPending7d)} accent={T.brass} />
            <StatCard icon={CalendarClock} label="Avg. processing time" value="1h 42m" accent={T.slate} />
          </div>
        </>
      )}

      {tab === "downloads" && (
        <>
          <div className="mb-5 max-w-sm">
            <Field label="Search datasets" value={datasetQuery} onChange={setDatasetQuery} placeholder="e.g. Customer, Job, Invoice" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredDatasets.map((ds) => (
              <div key={ds.id} className="rounded-2xl p-5 flex items-start justify-between gap-4" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.brassSoft }}>
                    <Database size={16} color={T.brass} />
                  </div>
                  <div className="min-w-0">
                    <div style={{ ...fontDisplay, color: T.ink, fontWeight: 600, fontSize: 14 }}>{ds.name}</div>
                    <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12, marginTop: 2 }}>{ds.description}</div>
                    {ds.recordCount !== undefined && (
                      <div style={{ ...fontMono, color: T.teal, fontSize: 11, marginTop: 6 }}>{ds.recordCount} records available</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => downloadDataset(ds.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold"
                  style={
                    ds.recordCount !== undefined
                      ? { background: T.brass, color: "#fff", ...fontBody }
                      : { background: "#fff", border: `1px solid ${T.hair}`, color: T.slate, ...fontBody }
                  }
                >
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
