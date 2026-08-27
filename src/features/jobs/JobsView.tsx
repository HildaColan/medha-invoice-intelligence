import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Eye, FileCheck2, FilePlus2, Filter, Layers, PenLine } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { PipelineStrip, SectionHeading, Stamp, StatCard, Td, Th } from "@/components/ui";
import { JOBS, JOB_STATUSES } from "@/data";
import type { JobStatusFilter } from "@/data/jobs";
import { paths } from "@/router/paths";
import type { Job } from "@/types";

export function JobsView() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<JobStatusFilter>("All");
  const goJob = (job: Job) => navigate(paths.jobDetail(job.id));
  const goEditJob = (job: Job) => navigate(paths.jobEdit(job.id));
  const openCreateJob = () => navigate(paths.createJob);

  const cycleFilter = () => {
    const idx = JOB_STATUSES.indexOf(statusFilter);
    setStatusFilter(JOB_STATUSES[(idx + 1) % JOB_STATUSES.length]);
  };
  const filteredJobs = statusFilter === "All" ? JOBS : JOBS.filter((j) => j.status === statusFilter);

  return (
    <div className="px-8 py-7">
      <SectionHeading
        eyebrow="JOB MANAGEMENT"
        title="All jobs"
        action={
          <div className="flex gap-2">
            <button onClick={cycleFilter} className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12.5px]" style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate, fontWeight: 600 }}>
              <Filter size={13.5} /> Status: {statusFilter}
            </button>
            <button onClick={openCreateJob} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12.5px] font-semibold" style={{ background: T.brass, color: "#fff", ...fontBody }}>
              <FilePlus2 size={14} /> New Job
            </button>
          </div>
        }
      />
      <div className="flex gap-4 flex-wrap mb-6">
        <StatCard icon={Layers} label="Total invoices in scope" value="112" accent={T.slate} />
        <StatCard icon={FileCheck2} label="Avg. invoices / job" value="3.7" accent={T.teal} />
        <StatCard icon={Clock} label="Avg. processing time" value="4m 12s" accent={T.brass} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Job No.</Th><Th>Shipment</Th><Th>Forwarder</Th><Th>Invoices</Th><Th>Created</Th><Th>Pipeline</Th><Th>Status</Th><Th>Actions</Th></tr>
          </thead>
          <tbody>
            {filteredJobs.map((j) => (
              <tr key={j.id} className="hover:bg-[#F5EDE4]">
                <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{j.id}</span></Td>
                <Td mono>{j.shipment}</Td>
                <Td>{j.forwarder}</Td>
                <Td mono>{j.invoices}</Td>
                <Td mono>{j.created}</Td>
                <Td><PipelineStrip stage={j.stage} compact /></Td>
                <Td><Stamp status={j.status} /></Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <button onClick={() => goJob(j)} aria-label={`View ${j.id}`} className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.slate, fontWeight: 600 }}>
                      <Eye size={14} color={T.slateSoft} /> View
                    </button>
                    <button onClick={() => goEditJob(j)} aria-label={`Edit ${j.id}`} className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.brass, fontWeight: 600 }}>
                      <PenLine size={14} color={T.brass} /> Edit
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {filteredJobs.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No jobs match "{statusFilter}".</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
