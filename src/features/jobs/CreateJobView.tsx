import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, Upload } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { Field, SelectField, Td, Th } from "@/components/ui";
import { useToast } from "@/components/ui";
import { JOBS, MASTER_DATA, OUTPUT_TEMPLATES } from "@/data";
import { paths } from "@/router/paths";
import { useAuditLog } from "@/features/administration/auditLog";

const STEPS = ["Job Details", "Upload Documents", "Review & Queue"] as const;

const FORWARDER_OPTIONS = MASTER_DATA.forwarders.map((f) => f.name);
const MODE_OPTIONS = MASTER_DATA.shipmentModes.map((m) => m.name);
const TYPE_OPTIONS = MASTER_DATA.shipmentTypes.map((t) => t.name);
const PORT_CODE_OPTIONS = MASTER_DATA.portCodes.map((p) => p.code);
const LOCATION_OPTIONS = MASTER_DATA.locations.map((l) => l.name);
const BILLING_CUSTOMER_OPTIONS = MASTER_DATA.billingCustomers.map((c) => c.name);
const IMPORTER_EXPORTER_OPTIONS = MASTER_DATA.importersExporters.map((e) => e.name);
const TEMPLATE_OPTIONS = OUTPUT_TEMPLATES.map((t) => t.name);

interface MockFile {
  name: string;
  size: string;
  kind: string;
}

const MOCK_FILES: MockFile[] = [
  { name: "invoice_001.pdf", size: "482 KB", kind: "Searchable" },
  { name: "invoice_002.pdf", size: "1.1 MB", kind: "Scanned" },
  { name: "invoice_003.pdf", size: "356 KB", kind: "Searchable" },
];

interface JobForm {
  hawbHbl: string;
  forwarder: string;
  mode: string;
  type: string;
  portCode: string;
  location: string;
  billingCustomer: string;
  importer: string;
  exporter: string;
  template: string;
  invoiceNumber: string;
}

/**
 * Handles both "Create Job" (/jobs/new) and "Edit Job" (/jobs/:id/edit).
 * Edit mode prefills every field from the existing job and swaps the final
 * button for "Update Job" instead of "Create & Send to Queue".
 */
export function CreateJobView() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const job = isEdit ? JOBS.find((j) => j.id === id) : undefined;

  // Unknown job id in the edit route — fall back rather than rendering a blank form.
  if (isEdit && !job) return <Navigate to={paths.jobs} replace />;

  const navigate = useNavigate();
  const notify = useToast();
  const { logActivity } = useAuditLog();
  const [step, setStep] = useState(1);
  const back = () => navigate(paths.jobs);

  const buildInitialForm = (): JobForm => ({
    hawbHbl: job?.shipment ?? "",
    forwarder: (job && FORWARDER_OPTIONS.includes(job.forwarder) ? job.forwarder : FORWARDER_OPTIONS[0]) ?? "",
    mode: MODE_OPTIONS[0] ?? "",
    type: TYPE_OPTIONS[0] ?? "",
    portCode: PORT_CODE_OPTIONS[0] ?? "",
    location: LOCATION_OPTIONS[0] ?? "",
    billingCustomer: BILLING_CUSTOMER_OPTIONS[0] ?? "",
    importer: IMPORTER_EXPORTER_OPTIONS[0] ?? "",
    exporter: IMPORTER_EXPORTER_OPTIONS[1] ?? IMPORTER_EXPORTER_OPTIONS[0] ?? "",
    template: TEMPLATE_OPTIONS[0] ?? "",
    invoiceNumber: "",
  });

  const [form, setForm] = useState<JobForm>(buildInitialForm);
  const setField = (key: keyof JobForm) => (v: string) => setForm((prev) => ({ ...prev, [key]: v }));

  const jobNumber = job ? job.id : "JOB-000133";
  const summaryRows: Array<[string, string]> = [
    ["Job Number", jobNumber],
    ["HAWB/HBL", form.hawbHbl || "—"],
    ["Forwarder", form.forwarder || "—"],
    ["Template", form.template || "—"],
    ["Port Code", form.portCode || "—"],
    ["Invoices", job ? `${job.invoices} files` : "3 files"],
  ];

  const submit = () => {
    notify(isEdit ? `${jobNumber} updated.` : `${jobNumber} created and sent to queue.`);
    logActivity({ action: isEdit ? "Update" : "Create", module: "Jobs", ref: jobNumber });
    back();
  };

  return (
    <div className="px-8 py-7">
      <button onClick={back} className="text-[12px] mb-3 flex items-center gap-1" style={{ ...fontMono, color: T.slateSoft }}>
        ← Cancel
      </button>

      {/* centered column: heading, stepper, form */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div style={{ ...fontMono, color: T.brass, fontSize: 11, letterSpacing: "0.14em", fontWeight: 700 }}>
              {isEdit ? "EDIT JOB" : "NEW JOB · AUTO-GENERATED"}
            </div>
            <h2 style={{ ...fontDisplay, color: T.ink, fontSize: 24, fontWeight: 600 }}>{jobNumber}</h2>
          </div>
          {!isEdit && (
            <button
              onClick={() => notify(`Draft saved — resume ${jobNumber} anytime from Jobs.`)}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            >
              Save as Draft
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-5 mb-7">
          {STEPS.map((s, i) => {
            const idx = i + 1;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-1"
                  style={{ background: idx === step ? T.brassSoft : "transparent", border: `1px solid ${idx <= step ? T.brass : T.hair}` }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ ...fontMono, background: idx <= step ? T.brass : T.hair, color: idx <= step ? "#fff" : T.slateSoft }}
                  >
                    {idx}
                  </span>
                  <span className="text-[12px] truncate" style={{ ...fontBody, color: idx === step ? T.ink : T.slateSoft, fontWeight: idx === step ? 600 : 500 }}>
                    {s}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="rounded-2xl p-7 grid grid-cols-2 gap-5" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <Field label="HAWB/HBL" value={form.hawbHbl} onChange={setField("hawbHbl")} placeholder="HAWB-88270" mono />
            <SelectField label="ACTUAL FORWARDER" value={form.forwarder} onChange={setField("forwarder")} options={FORWARDER_OPTIONS} />
            <SelectField label="SHIPMENT MODE" value={form.mode} onChange={setField("mode")} options={MODE_OPTIONS} />
            <SelectField label="SHIPMENT TYPE" value={form.type} onChange={setField("type")} options={TYPE_OPTIONS} />
            <SelectField label="PORT CODE" value={form.portCode} onChange={setField("portCode")} options={PORT_CODE_OPTIONS} mono />
            <SelectField label="LOCATION" value={form.location} onChange={setField("location")} options={LOCATION_OPTIONS} />
            <SelectField label="BILLING CUSTOMER" value={form.billingCustomer} onChange={setField("billingCustomer")} options={BILLING_CUSTOMER_OPTIONS} />
            <SelectField label="IMPORTER" value={form.importer} onChange={setField("importer")} options={IMPORTER_EXPORTER_OPTIONS} />
            <SelectField label="EXPORTER" value={form.exporter} onChange={setField("exporter")} options={IMPORTER_EXPORTER_OPTIONS} />
            <SelectField label="TEMPLATE" value={form.template} onChange={setField("template")} options={TEMPLATE_OPTIONS} />
            <Field label="INVOICE NUMBER (if known)" value={form.invoiceNumber} onChange={setField("invoiceNumber")} placeholder="Optional" mono />
          </div>
        )}

        {step === 2 && (
          <>
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3 mb-5" style={{ border: `1.5px dashed ${T.hair}`, background: T.card }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: T.brassSoft }}>
                <Upload size={20} color={T.brass} />
              </div>
              <div style={{ ...fontBody, color: T.slate, fontSize: 14, fontWeight: 600 }}>
                {isEdit ? "Drop additional invoice PDFs here, or browse" : "Drop invoice PDFs here, or browse"}
              </div>
              <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12, textAlign: "center" }}>
                Supports multiple, multi-page, searchable & scanned PDFs · up to 50 files
              </div>
              <button
                onClick={() => notify("File picker isn't available in this preview — sample files are shown below.")}
                className="mt-2 px-4 py-2 rounded-lg text-[12.5px] font-semibold"
                style={{ background: T.brass, color: "#fff", ...fontBody }}
              >
                Browse files
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
              <table className="w-full">
                <thead>
                  <tr><Th>File name</Th><Th>Size</Th><Th>Type</Th><Th>Status</Th></tr>
                </thead>
                <tbody>
                  {MOCK_FILES.map((f) => (
                    <tr key={f.name}>
                      <Td mono>{f.name}</Td>
                      <Td mono>{f.size}</Td>
                      <Td>{f.kind}</Td>
                      <Td>
                        <span className="flex items-center gap-1 text-[12px]" style={{ color: T.teal, fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> Ready
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-7" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
              <div style={{ ...fontDisplay, color: T.ink, fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Summary</div>
              <div className="grid grid-cols-2 gap-4">
                {summaryRows.map(([l, v]) => (
                  <div key={l}>
                    <div style={{ ...fontMono, color: T.slateSoft, fontSize: 10.5, letterSpacing: "0.06em" }}>{l.toUpperCase()}</div>
                    <div style={{ ...fontMono, color: T.ink, fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: T.brassSoft, border: `1px solid ${T.brass}44` }}>
              <FileCheck2 size={26} color={T.brass} className="shrink-0" />
              <div>
                <div style={{ ...fontBody, color: T.ink, fontWeight: 700, fontSize: 13.5 }}>{isEdit ? "Ready to update" : "Ready to queue"}</div>
                <div style={{ ...fontBody, color: T.slate, fontSize: 11.5, marginTop: 2 }}>
                  {isEdit
                    ? "Changes will be re-validated against the product master and current pipeline stage."
                    : "Documents will be classified, extracted, matched and validated automatically."}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : back())}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
            style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
          >
            <ArrowLeft size={14} /> {step > 1 ? "Back" : "Cancel"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={submit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: isEdit ? T.brass : T.teal, color: "#fff", ...fontBody }}
            >
              {isEdit ? "Update Job" : "Create & Send to Queue"} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
