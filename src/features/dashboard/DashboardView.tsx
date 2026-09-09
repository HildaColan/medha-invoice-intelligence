import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { AlertTriangle, Briefcase, CheckCircle2, Clock, Download, Eye, FilePlus2, FileOutput, Filter, PenLine, XCircle } from "lucide-react";
import { T, fontBody, fontDisplay, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from "@/theme/tokens";
import { ChartCard, DateRangePicker, PipelineStrip, SectionHeading, Stamp, StatCard, Td, Th, useToast } from "@/components/ui";
import { ACCURACY_DATA, JOBS, JOB_STATUSES, STATUS_BREAKDOWN, TREND_DATA } from "@/data";
import type { JobStatusFilter } from "@/data/jobs";
import { paths } from "@/router/paths";
import type { Job } from "@/types";
import { exportRowsAsCsv } from "@/features/reports/exportUtils";
import { useAuditLog } from "@/features/administration/auditLog";

function formatDot(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

export function DashboardView() {
  const navigate = useNavigate();
  const notify = useToast();
  const { logActivity } = useAuditLog();
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("All");
  const goJob = (job: Job) => navigate(paths.jobDetail(job.id));
  const goEditJob = (job: Job) => navigate(paths.jobEdit(job.id));
  const openCreateJob = () => navigate(paths.createJob);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const cycleFilter = () => {
    const idx = JOB_STATUSES.indexOf(statusFilter);
    setStatusFilter(JOB_STATUSES[(idx + 1) % JOB_STATUSES.length]);
  };
  const recentJobs = (statusFilter === "All" ? JOBS : JOBS.filter((j) => j.status === statusFilter)).slice(0, 5);

  const applyPeriod = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    notify(from ? `Period applied: ${formatDot(from)} — ${formatDot(to)}` : "Period cleared.");
  };

  const downloadPeriodData = () => {
    const from = fromDate ? new Date(`${fromDate}T00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59`) : null;
    const rows = JOBS.filter((j) => {
      const d = new Date(j.created);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });

    const periodLabel = fromDate && toDate ? `FROM ${formatDot(fromDate)} TO ${formatDot(toDate)}` : "ALL";

    exportRowsAsCsv(
      `dashboard-jobs_${fromDate || "all"}_${toDate || "all"}.csv`,
      rows.map((j) => ({
        "Job No.": j.id,
        Shipment: j.shipment,
        Forwarder: j.forwarder,
        Invoices: j.invoices,
        Created: j.created,
        Status: j.status,
      }))
    );
    notify(`Downloaded ${rows.length} job(s) for period ${periodLabel}.`);
    logActivity({ action: "Download", module: "Dashboard", ref: periodLabel, result: "Success" });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-7 max-w-[1600px] mx-auto">
      <SectionHeading
        eyebrow="OPERATIONS OVERVIEW · 26 AUG 2026"
        title="Good afternoon, Priya."
        action={
          <div className="flex items-end gap-3 flex-wrap justify-end">
            <div className="w-[220px]">
              <DateRangePicker label="PERIOD" from={fromDate} to={toDate} onApply={applyPeriod} placeholder="Select period" />
            </div>
            {(fromDate || toDate) && (
              <button
                onClick={() => applyPeriod("", "")}
                className="px-3.5 py-2 rounded-lg text-[12px] font-semibold"
                style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
              >
                Clear
              </button>
            )}
            <button
              onClick={downloadPeriodData}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              <Download size={13} /> Download
            </button>
            <button
              onClick={openCreateJob}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              <FilePlus2 size={15} /> New Job
            </button>
          </div>
        }
      />

      <div className="flex gap-4 flex-wrap mb-6">
        <StatCard icon={Briefcase} label="Total jobs this month" value="38" sub="+12%" accent={T.brass} />
        <StatCard icon={Clock} label="Processing" value="6" accent={T.slate} />
        <StatCard icon={CheckCircle2} label="Completed" value="24" sub="+8%" accent={T.teal} />
        <StatCard icon={AlertTriangle} label="Validation required" value="5" accent={T.brass} />
        <StatCard icon={XCircle} label="Failed" value="3" accent={T.rust} />
        <StatCard icon={FileOutput} label="Exports generated" value="19" accent={T.slate} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <ChartCard title="Jobs & documents, last 14 days" sub="Volume processed through the pipeline" className="lg:col-span-2">
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.brass} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={T.brass} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="docsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.teal} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.hair} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: T.slateSoft, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: T.hair }} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 10, fill: T.slateSoft, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} width={26} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                <Area type="monotone" dataKey="docs" name="Documents" stroke={T.teal} fill="url(#docsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="jobs" name="Jobs" stroke={T.brass} fill="url(#jobsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ ...fontBody, color: T.slateSoft }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: T.brass }} /> Jobs
            </span>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ ...fontBody, color: T.slateSoft }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: T.teal }} /> Documents
            </span>
          </div>
        </ChartCard>

        <ChartCard title="Status breakdown" sub="Current job portfolio">
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={STATUS_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={44} outerRadius={64} paddingAngle={3}>
                  {STATUS_BREAKDOWN.map((s, i) => (
                    <Cell key={i} fill={s.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
            {STATUS_BREAKDOWN.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-[10.5px]" style={{ ...fontBody, color: T.slateSoft }}>
                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: s.color }} /> {s.name} · {s.value}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <ChartCard title="Extraction accuracy by field" sub="Validated against ground-truth sample (approx. 95% target)" className="lg:col-span-1">
          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACCURACY_DATA} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.hair} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: T.slateSoft, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="field" width={62} tick={{ fontSize: 10, fill: T.slate, fontFamily: "IBM Plex Sans" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                  {ACCURACY_DATA.map((d, i) => (
                    <Cell key={i} fill={d.accuracy >= 95 ? T.teal : T.brass} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-wrap gap-2">
            <div>
              <div style={{ ...fontDisplay, color: T.ink, fontSize: 17, fontWeight: 600 }}>Recent jobs</div>
              <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12 }}>Live pipeline position for the latest shipments</div>
            </div>
            <button onClick={cycleFilter} className="flex items-center gap-1.5 text-[12px]" style={{ ...fontBody, color: T.brass, fontWeight: 600 }}>
              <Filter size={13} /> {statusFilter === "All" ? "Filter" : statusFilter}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr><Th>Job No.</Th><Th>Forwarder</Th><Th>Invoices</Th><Th>Pipeline</Th><Th>Status</Th><Th>Actions</Th></tr>
              </thead>
              <tbody>
                {recentJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-[#F5EDE4]">
                    <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{j.id}</span></Td>
                    <Td>{j.forwarder}</Td>
                    <Td mono>{j.invoices}</Td>
                    <Td><PipelineStrip stage={j.stage} compact /></Td>
                    <Td><Stamp status={j.status} /></Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <button onClick={() => goJob(j)} aria-label={`View ${j.id}`}><Eye size={14} color={T.slateSoft} /></button>
                        <button onClick={() => goEditJob(j)} aria-label={`Edit ${j.id}`}><PenLine size={14} color={T.brass} /></button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {recentJobs.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No jobs match "{statusFilter}".</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
