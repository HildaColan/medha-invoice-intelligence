import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, CircleAlert, PenLine } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { PipelineStrip, Stamp, Td, Th, useToast } from "@/components/ui";
import { JOBS, LINE_ITEMS } from "@/data";
import { paths } from "@/router/paths";

interface SummaryField {
  label: string;
  val: string;
  mono: boolean;
}

const INITIAL_SUMMARY: SummaryField[] = [
  { label: "Invoice Number", val: "INV-10041", mono: true },
  { label: "Supplier", val: "ABC Technologies Pte Ltd", mono: false },
  { label: "Currency", val: "USD", mono: true },
  { label: "Invoice Total", val: "USD 5,388.00", mono: true },
  { label: "Incoterms", val: "FOB", mono: true },
  { label: "Country of Origin", val: "Singapore", mono: false },
];

export function JobDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notify = useToast();
  const job = JOBS.find((j) => j.id === id);

  const [editMode, setEditMode] = useState(false);
  const [summary, setSummary] = useState<SummaryField[]>(INITIAL_SUMMARY);

  // Unknown job id — fall back to the jobs list rather than rendering a blank page.
  if (!job) return <Navigate to={paths.jobs} replace />;

  const back = () => navigate(paths.jobs);

  const updateField = (idx: number, next: string) => {
    setSummary((prev) => prev.map((f, i) => (i === idx ? { ...f, val: next } : f)));
  };

  const toggleEdit = () => {
    if (editMode) notify("Field changes saved.");
    setEditMode(!editMode);
  };

  const consolidate = () => {
    notify(`CSV generated for ${job.id} — check the Exports section.`);
    navigate(paths.exports);
  };

  return (
    <div className="px-8 py-7">
      <button onClick={back} className="text-[12px] mb-3 flex items-center gap-1" style={{ ...fontMono, color: T.slateSoft }}>
        ← All jobs
      </button>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div style={{ ...fontMono, color: T.brass, fontSize: 11, letterSpacing: "0.12em", fontWeight: 700 }}>JOB REVIEW</div>
          <h2 style={{ ...fontDisplay, color: T.ink, fontSize: 26, fontWeight: 600 }}>{job.id}</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <span style={{ ...fontMono, color: T.slateSoft, fontSize: 12.5 }}>{job.shipment}</span>
            <Stamp status={job.status} />
          </div>
        </div>
        <div className="rounded-xl px-5 py-3.5" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
          <PipelineStrip stage={job.stage} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {summary.map((f, idx) => (
          <div key={f.label} className="rounded-xl p-4" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div style={{ ...fontMono, color: T.slateSoft, fontSize: 10.5, letterSpacing: "0.08em" }}>{f.label.toUpperCase()}</div>
            {editMode ? (
              <input
                value={f.val}
                onChange={(e) => updateField(idx, e.target.value)}
                className="mt-1 w-full outline-none rounded-md px-2 py-1 -ml-2"
                style={{ ...(f.mono ? fontMono : fontBody), color: T.ink, fontSize: 15, fontWeight: 600, background: T.mist, border: `1px solid ${T.hair}` }}
              />
            ) : (
              <div className="mt-1" style={{ ...(f.mono ? fontMono : fontBody), color: T.ink, fontSize: 15, fontWeight: 600 }}>{f.val}</div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center justify-between">
          <div style={{ ...fontDisplay, color: T.ink, fontSize: 16, fontWeight: 600 }}>Line items</div>
          <div style={{ ...fontMono, color: T.slateSoft, fontSize: 11 }}>{LINE_ITEMS.length} items · avg. confidence 88%</div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <Th>#</Th><Th>Description</Th><Th>Part No.</Th><Th>HSN/CTH</Th><Th>Qty</Th>
              <Th>Unit Price</Th><Th>Value</Th><Th>Confidence</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {LINE_ITEMS.map((it) => (
              <tr key={it.line}>
                <Td mono>{it.line}</Td>
                <Td>{it.desc}</Td>
                <Td mono>{it.part}</Td>
                <Td mono>{it.hsn === "—" ? <span style={{ color: T.rust }}>Not found</span> : it.hsn}</Td>
                <Td mono>{it.qty}</Td>
                <Td mono>{it.unit}</Td>
                <Td mono>{it.value}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full" style={{ background: T.hair }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${it.conf}%`, background: it.conf > 80 ? T.teal : T.brass }} />
                    </div>
                    <span style={{ ...fontMono, fontSize: 11, color: T.slateSoft }}>{it.conf}%</span>
                  </div>
                </Td>
                <Td>
                  {it.status === "valid" ? (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.teal, fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> Valid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.rust, fontWeight: 600 }}>
                      <CircleAlert size={13} /> Review
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl p-5 flex items-start gap-3 mb-6" style={{ background: T.rustSoft, border: `1px solid ${T.rust}33` }}>
        <CircleAlert size={18} color={T.rust} className="mt-0.5" />
        <div>
          <div style={{ ...fontBody, color: T.rust, fontWeight: 700, fontSize: 13 }}>HSN/CTH not identified — Line 3</div>
          <div style={{ ...fontBody, color: T.slate, fontSize: 12.5, marginTop: 2 }}>
            No matching product master record was found for part SMC-004X. Select a product manually or add a new master record.
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={toggleEdit}
          className="px-4 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2"
          style={{ background: editMode ? T.brassSoft : "#fff", border: `1px solid ${editMode ? T.brass : T.hair}`, ...fontBody, color: editMode ? T.brass : T.slate }}
        >
          <PenLine size={14} /> {editMode ? "Save fields" : "Edit fields"}
        </button>
        <button onClick={consolidate} className="px-5 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2" style={{ background: T.teal, color: "#fff", ...fontBody }}>
          Consolidate & Generate CSV
        </button>
      </div>
    </div>
  );
}
