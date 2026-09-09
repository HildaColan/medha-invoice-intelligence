import { useState } from "react";
import { AlertTriangle, CheckCircle2, Database, Download, FileSpreadsheet, FileText } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { DateRangePicker, Field, SectionHeading, SelectField, StatCard, Td, Th, useToast } from "@/components/ui";
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
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");

  const [appliedUser, setAppliedUser] = useState(ALL);
  const [appliedRole, setAppliedRole] = useState(ALL);
  const [appliedStatus, setAppliedStatus] = useState<string>(ALL);
  const [appliedActivityType, setAppliedActivityType] = useState(ALL);
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");

  const hasActivityFilters =
    user !== ALL || role !== ALL || status !== ALL || activityType !== ALL || !!draftDateFrom || !!draftDateTo ||
    appliedUser !== ALL || appliedRole !== ALL || appliedStatus !== ALL || appliedActivityType !== ALL ||
    !!appliedDateFrom || !!appliedDateTo;

  const applyActivityFilters = () => {
    setAppliedUser(user);
    setAppliedRole(role);
    setAppliedStatus(status);
    setAppliedActivityType(activityType);
    setAppliedDateFrom(draftDateFrom);
    setAppliedDateTo(draftDateTo);
  };

  const clearActivityFilters = () => {
    setUser(ALL);
    setRole(ALL);
    setStatus(ALL);
    setActivityType(ALL);
    setDraftDateFrom("");
    setDraftDateTo("");
    setAppliedUser(ALL);
    setAppliedRole(ALL);
    setAppliedStatus(ALL);
    setAppliedActivityType(ALL);
    setAppliedDateFrom("");
    setAppliedDateTo("");
  };

  const filteredActivity = USER_ACTIVITY_REPORT.filter((r) => {
    if (appliedUser !== ALL && r.user !== appliedUser) return false;
    if (appliedRole !== ALL && r.role !== appliedRole) return false;
    if (appliedStatus !== ALL && r.status !== appliedStatus) return false;
    if (appliedActivityType !== ALL && r.lastActivity !== appliedActivityType) return false;
    if (appliedDateFrom && r.dateIso < appliedDateFrom) return false;
    if (appliedDateTo && r.dateIso > appliedDateTo) return false;
    return true;
  });

  const buildActivityFilterSummary = (): string[] => {
    const parts: string[] = [];
    if (appliedUser !== ALL) parts.push(`User: ${appliedUser}`);
    if (appliedRole !== ALL) parts.push(`Role: ${appliedRole}`);
    if (appliedStatus !== ALL) parts.push(`Job Status: ${appliedStatus}`);
    if (appliedActivityType !== ALL) parts.push(`Activity Type: ${appliedActivityType}`);
    if (appliedDateFrom) parts.push(`From: ${appliedDateFrom}`);
    if (appliedDateTo) parts.push(`To: ${appliedDateTo}`);
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

  const [appliedGranularity, setAppliedGranularity] = useState<Granularity>("Daily");
  const [appliedDailyDate, setAppliedDailyDate] = useState("");
  const [appliedCustomFrom, setAppliedCustomFrom] = useState("");
  const [appliedCustomTo, setAppliedCustomTo] = useState("");

  const changeGranularity = (next: string) => {
    setGranularity(next as Granularity);
    setDailyDate("");
    setCustomFrom("");
    setCustomTo("");
  };

  const hasDateTimeFilters =
    granularity !== "Daily" || !!dailyDate || !!customFrom || !!customTo ||
    appliedGranularity !== "Daily" || !!appliedDailyDate || !!appliedCustomFrom || !!appliedCustomTo;

  const applyDateTimeFilters = () => {
    setAppliedGranularity(granularity);
    setAppliedDailyDate(dailyDate);
    setAppliedCustomFrom(customFrom);
    setAppliedCustomTo(customTo);
  };

  const clearDateTimeFilters = () => {
    setGranularity("Daily");
    setDailyDate("");
    setCustomFrom("");
    setCustomTo("");
    setAppliedGranularity("Daily");
    setAppliedDailyDate("");
    setAppliedCustomFrom("");
    setAppliedCustomTo("");
  };

  const allStatDates = DAILY_JOB_STATS.map((d) => d.date);
  const minStatDate = allStatDates[0];
  const maxStatDate = allStatDates[allStatDates.length - 1];

  let periodStart = minStatDate;
  let periodEnd = maxStatDate;
  const singleDayRow = appliedGranularity === "Daily" && appliedDailyDate ? DAILY_JOB_STATS.find((d) => d.date === appliedDailyDate) : undefined;

  if (appliedGranularity === "Daily") {
    if (appliedDailyDate) {
      periodStart = appliedDailyDate;
      periodEnd = appliedDailyDate;
    } else {
      const last7 = DAILY_JOB_STATS.slice(-7);
      periodStart = last7[0].date;
      periodEnd = last7[last7.length - 1].date;
    }
  } else if (appliedGranularity === "Custom Range") {
    periodStart = appliedCustomFrom || minStatDate;
    periodEnd = appliedCustomTo || maxStatDate;
  }

  const periodActivityRows = USER_ACTIVITY_REPORT.filter((r) => r.dateIso >= periodStart && r.dateIso <= periodEnd);
  const periodUserSummaries = buildPeriodUserSummaries(periodActivityRows);

  const downloadDateTimeReport = () => {
    if (periodUserSummaries.length === 0) {
      notify("No data to download for the selected period.");
      return;
    }
    exportRowsAsCsv(
      `date-time-report_${periodStart}_${periodEnd}.csv`,
      periodUserSummaries.map((s) => ({
        User: s.user,
        "Jobs Completed": s.jobsCompleted,
        "Jobs Pending": s.jobsPending,
        "Rework Count": s.reworkCount,
        "Avg Turnaround": s.avgTurnaround,
      }))
    );
    logActivity({ action: "Download", module: "Reports", ref: `Date & Time Report (${periodStart} to ${periodEnd})` });
    notify("Report downloaded.");
  };

  // ---- Tab 3: Master Data & Document Download ----
  const [selectedDatasetName, setSelectedDatasetName] = useState("");
  const selectedDataset = DOWNLOADABLE_DATASETS.find((d) => d.name === selectedDatasetName);

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

  const hasMasterDataFilters =
    !!mdFromDate || !!mdToDate || !!mdJobNumber || mdCustomer !== ALL || mdUser !== ALL || !!mdInvoiceNumber || mdStatus !== ALL;

  const clearMasterDataFilters = () => {
    setMdFromDate("");
    setMdToDate("");
    setMdJobNumber("");
    setMdCustomer(ALL);
    setMdUser(ALL);
    setMdInvoiceNumber("");
    setMdStatus(ALL);
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
          <div className="rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div className="w-[180px]">
              <SelectField label="User" value={user} onChange={setUser} options={USER_OPTIONS} />
            </div>
            <div className="w-[180px]">
              <SelectField label="Role" value={role} onChange={setRole} options={ROLE_OPTIONS} />
            </div>
            <div className="w-[180px]">
              <SelectField label="Job Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            </div>
            <div className="w-[180px]">
              <SelectField label="Activity Type" value={activityType} onChange={setActivityType} options={ACTIVITY_OPTIONS} />
            </div>
            <div className="w-[240px]">
              <DateRangePicker
                label="Date Range"
                from={draftDateFrom}
                to={draftDateTo}
                onApply={(f, t) => {
                  setDraftDateFrom(f);
                  setDraftDateTo(t);
                }}
                placeholder="Select date range"
              />
            </div>
            <button
              onClick={applyActivityFilters}
              className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              Apply
            </button>
            {hasActivityFilters && (
              <button
                onClick={clearActivityFilters}
                className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              >
                Clear
              </button>
            )}
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
            <div className="flex items-end gap-2">
              <button
                onClick={applyDateTimeFilters}
                className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
                style={{ background: T.brass, color: "#fff", ...fontBody }}
              >
                Apply
              </button>
              {hasDateTimeFilters && (
                <button
                  onClick={clearDateTimeFilters}
                  className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
                  style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {singleDayRow !== undefined ? (
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard icon={CheckCircle2} label={`Completed — ${appliedDailyDate}`} value={String(singleDayRow.completed)} accent={T.teal} />
              <StatCard icon={AlertTriangle} label={`Pending — ${appliedDailyDate}`} value={String(singleDayRow.pending)} accent={T.brass} />
            </div>
          ) : appliedGranularity === "Daily" && appliedDailyDate ? (
            <div className="rounded-2xl p-5 mb-5 text-center text-[12.5px]" style={{ background: T.card, border: `1px solid ${T.hair}`, ...fontBody, color: T.slateSoft }}>
              No data recorded for {appliedDailyDate}.
            </div>
          ) : null}

          <div className="flex justify-end mb-3">
            <button
              onClick={downloadDateTimeReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              <Download size={13} /> Download
            </button>
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
          <div className="rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-end" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div className="w-[240px]">
              <DateRangePicker label="Date Range" from={mdFromDate} to={mdToDate} onApply={(f, t) => { setMdFromDate(f); setMdToDate(t); }} placeholder="Select date range" />
            </div>
            <div className="w-[180px]">
              <Field label="Job Number" placeholder="e.g. JOB-000124" value={mdJobNumber} onChange={setMdJobNumber} />
            </div>
            <div className="w-[180px]">
              <SelectField label="Customer" value={mdCustomer} onChange={setMdCustomer} options={CUSTOMER_OPTIONS} />
            </div>
            <div className="w-[180px]">
              <SelectField label="User" value={mdUser} onChange={setMdUser} options={USER_OPTIONS} />
            </div>
            <div className="w-[180px]">
              <Field label="Invoice Number" placeholder="e.g. INV-10041" value={mdInvoiceNumber} onChange={setMdInvoiceNumber} />
            </div>
            <div className="w-[180px]">
              <SelectField label="Status" value={mdStatus} onChange={setMdStatus} options={JOB_STATUSES} />
            </div>
            {hasMasterDataFilters && (
              <button
                onClick={clearMasterDataFilters}
                className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="mb-5 max-w-sm">
            <SelectField
              label="Search datasets"
              value={selectedDatasetName || "Select a dataset"}
              onChange={(v) => setSelectedDatasetName(v === "Select a dataset" ? "" : v)}
              options={["Select a dataset", ...DOWNLOADABLE_DATASETS.map((d) => d.name)]}
            />
          </div>

          {selectedDataset ? (
            <div className="rounded-2xl p-5 flex items-start justify-between gap-4 max-w-xl" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.brassSoft }}>
                  <Database size={16} color={T.brass} />
                </div>
                <div className="min-w-0">
                  <div style={{ ...fontDisplay, color: T.ink, fontWeight: 600, fontSize: 14 }}>{selectedDataset.name}</div>
                  <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12, marginTop: 2 }}>{selectedDataset.description}</div>
                  {selectedDataset.recordCount !== undefined && (
                    <div style={{ ...fontMono, color: T.teal, fontSize: 11, marginTop: 6 }}>{selectedDataset.recordCount} records available</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => downloadDataset(selectedDataset.id)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold"
                style={{ background: T.brass, color: "#fff", ...fontBody }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          ) : (
            <div className="rounded-2xl p-5 max-w-xl text-center text-[12.5px]" style={{ background: T.card, border: `1px solid ${T.hair}`, ...fontBody, color: T.slateSoft }}>
              Select a dataset above to view its details and download it.
            </div>
          )}
        </>
      )}
    </div>
  );
}
