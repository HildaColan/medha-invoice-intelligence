import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarClock, CheckCircle2, Database, Download, FileSpreadsheet, FileText, RefreshCcw } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from "@/theme/tokens";
import { ChartCard, Field, SectionHeading, SelectField, StatCard, Td, Th, useToast } from "@/components/ui";
import { useAuditLog } from "@/features/administration/auditLog";
import {
  CUSTOMERS,
  DAILY_JOB_STATS,
  DOWNLOADABLE_DATASETS,
  JOBS,
  JOB_INVOICES,
  JOB_STATUSES,
  LINE_ITEMS,
  MOCK_DOCUMENT_FILES,
  USERS,
  USER_ACTIVITY_REPORT,
} from "@/data";
import type { DocumentManifestRow, PeriodUserSummary, ReportJobStatus, TransactionDetailRow, UserActivityReportRow } from "@/types";
import { exportRowsAsCsv, exportRowsAsExcel, exportRowsAsPdf } from "./exportUtils";

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
const ROLE_OPTIONS = [ALL, ...Array.from(new Set(USER_ACTIVITY_REPORT.map((r) => r.role)))];
const CUSTOMER_OPTIONS = [ALL, ...CUSTOMERS.map((c) => c.name)];

const GRANULARITY_OPTIONS = ["Daily", "Weekly", "Monthly", "Custom Range"] as const;
type Granularity = (typeof GRANULARITY_OPTIONS)[number];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseTurnaroundToMinutes(turnaround: string): number | null {
  if (turnaround === "—") return null;
  const hMatch = turnaround.match(/(\d+)h/);
  const mMatch = turnaround.match(/(\d+)m/);
  if (!hMatch && !mMatch) return null;
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const minutes = mMatch ? parseInt(mMatch[1], 10) : 0;
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function isoWeekBucketLabel(dateIso: string): string {
  const d = new Date(`${dateIso}T00:00:00`);
  const diffToMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return `Wk ${String(d.getDate()).padStart(2, "0")} ${MONTH_NAMES[d.getMonth()]}`;
}

function monthBucketLabel(dateIso: string): string {
  const d = new Date(`${dateIso}T00:00:00`);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function aggregateByBucket(
  rows: { date: string; completed: number; pending: number }[],
  labelFn: (dateIso: string) => string
): { label: string; completed: number; pending: number }[] {
  const buckets = new Map<string, { completed: number; pending: number }>();
  const order: string[] = [];
  for (const r of rows) {
    const label = labelFn(r.date);
    if (!buckets.has(label)) {
      buckets.set(label, { completed: 0, pending: 0 });
      order.push(label);
    }
    const bucket = buckets.get(label)!;
    bucket.completed += r.completed;
    bucket.pending += r.pending;
  }
  return order.map((label) => ({ label, ...buckets.get(label)! }));
}

function buildPeriodUserSummaries(rows: UserActivityReportRow[]): PeriodUserSummary[] {
  const groups = new Map<string, { jobsCompleted: number; jobsPending: number; reworkCount: number; minutes: number[] }>();
  for (const r of rows) {
    if (!groups.has(r.user)) groups.set(r.user, { jobsCompleted: 0, jobsPending: 0, reworkCount: 0, minutes: [] });
    const g = groups.get(r.user)!;
    if (r.status === "Completed") g.jobsCompleted += 1;
    if (r.status === "Pending") g.jobsPending += 1;
    if (r.rework) g.reworkCount += 1;
    const minutes = parseTurnaroundToMinutes(r.turnaround);
    if (minutes !== null) g.minutes.push(minutes);
  }
  return Array.from(groups.entries()).map(([user, g]) => ({
    user,
    jobsCompleted: g.jobsCompleted,
    jobsPending: g.jobsPending,
    reworkCount: g.reworkCount,
    avgTurnaround: g.minutes.length > 0 ? formatMinutes(g.minutes.reduce((a, b) => a + b, 0) / g.minutes.length) : "—",
  }));
}

/** JOBS.created / MASTER_ENTRY-style display dates ("24 Aug 2026") -> ISO, for range comparisons. */
function displayDateToIso(display: string): string {
  const [dd, mon, yyyy] = display.split(" ");
  const monthIndex = MONTH_NAMES.indexOf(mon);
  return `${yyyy}-${String(monthIndex + 1).padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export function ReportsView() {
  const notify = useToast();
  const { logActivity } = useAuditLog();
  const [tab, setTab] = useState<TabKey>("activity");

  // ---- Tab 1: User Activity & Job Performance ----
  const [user, setUser] = useState(ALL);
  const [role, setRole] = useState(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [activityType, setActivityType] = useState(ALL);
  const [specificDate, setSpecificDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [startTimeFrom, setStartTimeFrom] = useState("");
  const [startTimeTo, setStartTimeTo] = useState("");

  const filteredActivity = USER_ACTIVITY_REPORT.filter((r) => {
    if (user !== ALL && r.user !== user) return false;
    if (role !== ALL && r.role !== role) return false;
    if (status !== ALL && r.status !== status) return false;
    if (activityType !== ALL && r.lastActivity !== activityType) return false;
    if (specificDate) {
      if (r.dateIso !== specificDate) return false;
    } else {
      if (fromDate && r.dateIso < fromDate) return false;
      if (toDate && r.dateIso > toDate) return false;
    }
    if (startTimeFrom && r.startTime < startTimeFrom) return false;
    if (startTimeTo && r.startTime > startTimeTo) return false;
    return true;
  });

  const completedCount = filteredActivity.filter((r) => r.status === "Completed").length;
  const pendingCount = filteredActivity.filter((r) => r.status === "Pending").length;
  const reworkCount = filteredActivity.filter((r) => r.rework).length;
  const completedLabel = user === ALL ? "Completed" : `Jobs completed — ${user}`;

  const buildActivityFilterSummary = (): string[] => {
    const parts: string[] = [];
    if (user !== ALL) parts.push(`User: ${user}`);
    if (role !== ALL) parts.push(`Role: ${role}`);
    if (status !== ALL) parts.push(`Job Status: ${status}`);
    if (activityType !== ALL) parts.push(`Activity Type: ${activityType}`);
    if (specificDate) parts.push(`Date: ${specificDate}`);
    else {
      if (fromDate) parts.push(`From: ${fromDate}`);
      if (toDate) parts.push(`To: ${toDate}`);
    }
    if (startTimeFrom) parts.push(`Start time from: ${startTimeFrom}`);
    if (startTimeTo) parts.push(`Start time to: ${startTimeTo}`);
    return parts.length > 0 ? [`Filters — ${parts.join(", ")}`] : ["Filters — none applied"];
  };

  const exportActivity = (format: "excel" | "csv" | "pdf") => {
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
    if (format === "excel") {
      exportRowsAsExcel("user-activity-report.xlsx", rows);
    } else if (format === "csv") {
      exportRowsAsCsv("user-activity-report.csv", rows);
    } else {
      exportRowsAsPdf("user-activity-report.pdf", rows, {
        title: "User Activity & Job Performance Report",
        filterSummaryLines: buildActivityFilterSummary(),
      });
    }
    logActivity({ action: "Download", module: "Reports", ref: `User Activity Report (${format.toUpperCase()})` });
    notify(`${format === "excel" ? "Excel" : format === "csv" ? "CSV" : "PDF"} report downloaded.`);
  };

  // ---- Tab 2: Date & Time Reporting ----
  const [granularity, setGranularity] = useState<Granularity>("Daily");
  const [dailyDate, setDailyDate] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const changeGranularity = (next: string) => {
    setGranularity(next as Granularity);
    setDailyDate("");
    setCustomFrom("");
    setCustomTo("");
  };

  const allStatDates = DAILY_JOB_STATS.map((d) => d.date);
  const minStatDate = allStatDates[0];
  const maxStatDate = allStatDates[allStatDates.length - 1];

  let periodStart = minStatDate;
  let periodEnd = maxStatDate;
  let chartRows: { label: string; completed: number; pending: number }[];
  const singleDayRow = granularity === "Daily" && dailyDate ? DAILY_JOB_STATS.find((d) => d.date === dailyDate) : undefined;

  if (granularity === "Daily") {
    if (dailyDate) {
      periodStart = dailyDate;
      periodEnd = dailyDate;
      chartRows = [];
    } else {
      const last7 = DAILY_JOB_STATS.slice(-7);
      periodStart = last7[0].date;
      periodEnd = last7[last7.length - 1].date;
      chartRows = last7.map((d) => ({ label: d.day, completed: d.completed, pending: d.pending }));
    }
  } else if (granularity === "Weekly") {
    chartRows = aggregateByBucket(DAILY_JOB_STATS, isoWeekBucketLabel);
  } else if (granularity === "Monthly") {
    chartRows = aggregateByBucket(DAILY_JOB_STATS, monthBucketLabel);
  } else {
    periodStart = customFrom || minStatDate;
    periodEnd = customTo || maxStatDate;
    const rangeRows = DAILY_JOB_STATS.filter((d) => d.date >= periodStart && d.date <= periodEnd);
    chartRows = rangeRows.map((d) => ({ label: d.day, completed: d.completed, pending: d.pending }));
  }

  const periodRows = DAILY_JOB_STATS.filter((d) => d.date >= periodStart && d.date <= periodEnd);
  const totalCompletedPeriod = periodRows.reduce((sum, d) => sum + d.completed, 0);
  const totalPendingPeriod = periodRows.reduce((sum, d) => sum + d.pending, 0);

  const periodActivityRows = USER_ACTIVITY_REPORT.filter((r) => r.dateIso >= periodStart && r.dateIso <= periodEnd);
  const periodUserSummaries = buildPeriodUserSummaries(periodActivityRows);
  const periodMinutes = periodActivityRows
    .map((r) => parseTurnaroundToMinutes(r.turnaround))
    .filter((m): m is number => m !== null);
  const avgProcessingTime = periodMinutes.length > 0
    ? formatMinutes(periodMinutes.reduce((a, b) => a + b, 0) / periodMinutes.length)
    : "1h 42m";

  const periodDayCount = periodRows.length;
  const periodLabel = periodDayCount === 1 ? "1 day" : `${periodDayCount} days`;

  // ---- Tab 3: Master Data & Document Download ----
  const [datasetQuery, setDatasetQuery] = useState("");
  const filteredDatasets = DOWNLOADABLE_DATASETS.filter((d) => d.name.toLowerCase().includes(datasetQuery.toLowerCase()));

  const [mdFromDate, setMdFromDate] = useState("");
  const [mdToDate, setMdToDate] = useState("");
  const [mdJobNumber, setMdJobNumber] = useState("");
  const [mdCustomer, setMdCustomer] = useState(ALL);
  const [mdUser, setMdUser] = useState(ALL);
  const [mdInvoiceNumber, setMdInvoiceNumber] = useState("");
  const [mdStatus, setMdStatus] = useState<string>(ALL);

  const buildMasterDataFilterSummary = (): string => {
    const parts: string[] = [];
    if (mdFromDate) parts.push(`From ${mdFromDate}`);
    if (mdToDate) parts.push(`To ${mdToDate}`);
    if (mdJobNumber) parts.push(`Job ${mdJobNumber}`);
    if (mdCustomer !== ALL) parts.push(`Customer ${mdCustomer}`);
    if (mdUser !== ALL) parts.push(`User ${mdUser}`);
    if (mdInvoiceNumber) parts.push(`Invoice ${mdInvoiceNumber}`);
    if (mdStatus !== ALL) parts.push(`Status ${mdStatus}`);
    return parts.join(", ");
  };

  const downloadDataset = (id: string) => {
    switch (id) {
      case "ds-customer-master": {
        const rows = CUSTOMERS.filter((c) => mdCustomer === ALL || c.name === mdCustomer);
        exportRowsAsExcel("customer-master.xlsx", rows.map((c) => ({ Code: c.code, Name: c.name, GSTIN: c.gstin, Email: c.email, Phone: c.phone, Status: c.status })));
        break;
      }
      case "ds-user-master": {
        const rows = USERS.filter((u) => mdUser === ALL || u.name === mdUser);
        exportRowsAsExcel("user-master.xlsx", rows.map((u) => ({ Name: u.name, Email: u.email, Role: u.role, Status: u.status })));
        break;
      }
      case "ds-job-master": {
        const rows = JOBS.filter((j) => {
          if (mdJobNumber && !j.id.toLowerCase().includes(mdJobNumber.toLowerCase())) return false;
          if (mdStatus !== ALL && j.status !== mdStatus) return false;
          const createdIso = displayDateToIso(j.created);
          if (mdFromDate && createdIso < mdFromDate) return false;
          if (mdToDate && createdIso > mdToDate) return false;
          return true;
        });
        exportRowsAsExcel("job-master.xlsx", rows.map((j) => ({ "Job No.": j.id, Shipment: j.shipment, Forwarder: j.forwarder, Invoices: j.invoices, Created: j.created, Status: j.status })));
        break;
      }
      case "ds-invoice-master": {
        const rows = JOB_INVOICES.filter((i) => !mdInvoiceNumber || i.number.toLowerCase().includes(mdInvoiceNumber.toLowerCase()));
        exportRowsAsExcel("invoice-master.xlsx", rows.map((i) => ({ "Invoice Number": i.number, "Source File": i.sourceFile, Status: i.status, "Duplicate Of": i.duplicateOf ?? "" })));
        break;
      }
      case "ds-extracted-data": {
        // TODO(BE): line items aren't tied to a job/invoice yet — export as-is until that FK exists.
        exportRowsAsExcel("extracted-data.xlsx", LINE_ITEMS.map((li) => ({ Line: li.line, Description: li.desc, Part: li.part, HSN: li.hsn, Qty: li.qty, "Unit Price": li.unit, Value: li.value, "Confidence %": li.conf, Status: li.status })));
        break;
      }
      case "ds-transaction-details": {
        // TODO(BE): flatten via a real job/line-item relationship once one exists — cycled per job for this demo.
        const rows: TransactionDetailRow[] = JOBS.map((j, idx) => {
          const li = LINE_ITEMS[idx % LINE_ITEMS.length];
          return { jobNumber: j.id, shipment: j.shipment, line: li.line, desc: li.desc, part: li.part, hsn: li.hsn, qty: li.qty, unit: li.unit, value: li.value, status: li.status };
        });
        exportRowsAsExcel("transaction-details.xlsx", rows.map((r) => ({ "Job No.": r.jobNumber, Shipment: r.shipment, Line: r.line, Description: r.desc, Part: r.part, HSN: r.hsn, Qty: r.qty, "Unit Price": r.unit, Value: r.value, Status: r.status })));
        break;
      }
      case "ds-original-documents":
      case "ds-corrected-documents":
      case "ds-supporting-attachments":
      case "ds-other-records": {
        // TODO(BE): replace with actual file download endpoint — no real files exist in this build yet.
        const typeLabel = DOWNLOADABLE_DATASETS.find((d) => d.id === id)?.name ?? "Document";
        const rows: DocumentManifestRow[] = JOBS.map((j, idx) => {
          const f = MOCK_DOCUMENT_FILES[idx % MOCK_DOCUMENT_FILES.length];
          return { fileName: f.name, job: j.id, type: typeLabel, size: f.size, kind: f.kind, date: j.created, source: "Demo Fixture — not a real file" };
        });
        exportRowsAsCsv(`${id.replace("ds-", "")}-manifest.csv`, rows.map((r) => ({ "File Name": r.fileName, "Job No.": r.job, Type: r.type, Size: r.size, Kind: r.kind, Date: r.date, Source: r.source })));
        break;
      }
      default:
        notify("No records available for this dataset in the current preview.");
        return;
    }
    const dsName = DOWNLOADABLE_DATASETS.find((d) => d.id === id)?.name ?? id;
    const filterNote = buildMasterDataFilterSummary();
    logActivity({ action: "Download", module: "Master Data", ref: filterNote ? `${dsName} (${filterNote})` : dsName });
    notify("Download started.");
  };

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
            <StatCard icon={CheckCircle2} label={completedLabel} value={String(completedCount)} accent={T.teal} />
            <StatCard icon={AlertTriangle} label="Pending" value={String(pendingCount)} accent={T.brass} />
            <StatCard icon={RefreshCcw} label="Required rework" value={String(reworkCount)} accent={T.rust} />
          </div>

          <div className="rounded-2xl p-4 mb-4 grid grid-cols-5 gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <SelectField label="User" value={user} onChange={setUser} options={USER_OPTIONS} />
            <SelectField label="Role" value={role} onChange={setRole} options={ROLE_OPTIONS} />
            <SelectField label="Job Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            <SelectField label="Activity Type" value={activityType} onChange={setActivityType} options={ACTIVITY_OPTIONS} />
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>Specific Date</label>
              <input
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-4 grid grid-cols-5 gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>From Date</label>
              <input
                type="date"
                value={fromDate}
                disabled={!!specificDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: specificDate ? T.mist : "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>To Date</label>
              <input
                type="date"
                value={toDate}
                disabled={!!specificDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: specificDate ? T.mist : "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>Start Time From</label>
              <input
                type="time"
                value={startTimeFrom}
                onChange={(e) => setStartTimeFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>Start Time To</label>
              <input
                type="time"
                value={startTimeTo}
                onChange={(e) => setStartTimeTo(e.target.value)}
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
          <div className="rounded-2xl p-4 mb-5 grid grid-cols-4 gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <SelectField label="Granularity" value={granularity} onChange={changeGranularity} options={GRANULARITY_OPTIONS} />
            {granularity === "Daily" && (
              <div>
                <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>Single Day (optional)</label>
                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                  style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
                />
              </div>
            )}
            {granularity === "Custom Range" && (
              <>
                <div>
                  <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                    style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                    style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
                  />
                </div>
              </>
            )}
          </div>

          {singleDayRow !== undefined ? (
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard icon={CheckCircle2} label={`Completed — ${dailyDate}`} value={String(singleDayRow.completed)} accent={T.teal} />
              <StatCard icon={AlertTriangle} label={`Pending — ${dailyDate}`} value={String(singleDayRow.pending)} accent={T.brass} />
            </div>
          ) : granularity === "Daily" && dailyDate ? (
            <div className="rounded-2xl p-5 mb-5 text-center text-[12.5px]" style={{ background: T.card, border: `1px solid ${T.hair}`, ...fontBody, color: T.slateSoft }}>
              No data recorded for {dailyDate}.
            </div>
          ) : (
            <ChartCard
              title={
                granularity === "Daily"
                  ? "Jobs completed vs. pending, last 7 days"
                  : `Jobs completed vs. pending — ${granularity}`
              }
              sub="Daily processing volume across all users"
            >
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRows} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.hair} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: T.slateSoft, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: T.hair }} tickLine={false} />
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
          )}

          <div className="grid grid-cols-3 gap-4 mt-5 mb-6">
            <StatCard icon={CheckCircle2} label={`Total completed (${periodLabel})`} value={String(totalCompletedPeriod)} accent={T.teal} />
            <StatCard icon={AlertTriangle} label={`Total pending (${periodLabel})`} value={String(totalPendingPeriod)} accent={T.brass} />
            <StatCard icon={CalendarClock} label="Avg. processing time" value={avgProcessingTime} accent={T.slate} />
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <table className="w-full">
              <thead>
                <tr>
                  <Th>User</Th><Th>Jobs Completed</Th><Th>Jobs Pending</Th><Th>Rework Count</Th><Th>Avg Turnaround</Th>
                </tr>
              </thead>
              <tbody>
                {periodUserSummaries.map((s) => (
                  <tr key={s.user}>
                    <Td>{s.user}</Td>
                    <Td mono>{s.jobsCompleted}</Td>
                    <Td mono>{s.jobsPending}</Td>
                    <Td mono>{s.reworkCount}</Td>
                    <Td mono>{s.avgTurnaround}</Td>
                  </tr>
                ))}
                {periodUserSummaries.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No user activity in the selected period.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "downloads" && (
        <>
          <div className="rounded-2xl p-4 mb-5 grid grid-cols-4 gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>From Date</label>
              <input
                type="date"
                value={mdFromDate}
                onChange={(e) => setMdFromDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
            <div>
              <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>To Date</label>
              <input
                type="date"
                value={mdToDate}
                onChange={(e) => setMdToDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg outline-none text-[12.5px]"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              />
            </div>
            <Field label="Job Number" placeholder="e.g. JOB-000124" value={mdJobNumber} onChange={setMdJobNumber} />
            <SelectField label="Customer" value={mdCustomer} onChange={setMdCustomer} options={CUSTOMER_OPTIONS} />
            <SelectField label="User" value={mdUser} onChange={setMdUser} options={USER_OPTIONS} />
            <Field label="Invoice Number" placeholder="e.g. INV-10041" value={mdInvoiceNumber} onChange={setMdInvoiceNumber} />
            <SelectField label="Status" value={mdStatus} onChange={setMdStatus} options={JOB_STATUSES} />
          </div>

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
                  style={{ background: T.brass, color: "#fff", ...fontBody }}
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
