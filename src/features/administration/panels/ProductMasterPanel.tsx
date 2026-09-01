import { useState, type ChangeEvent } from "react";
import { Boxes, CheckCircle2, CircleAlert, FileCheck2, PenLine, Plus, UploadCloud } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";
import { Field, Modal, SelectField, StatCard, Td, Th } from "@/components/ui";
import { CUSTOMERS, PRODUCTS } from "@/data";
import type { Product, ProductStatus } from "@/types";
import { parseProductsFromExcel, type ParsedProductRow } from "./parseProductsFromExcel";

const STATUS_OPTIONS: readonly ProductStatus[] = ["Active", "Unmatched"];
const CUSTOMER_NAMES = CUSTOMERS.map((c) => c.name);

const EMPTY_PRODUCT: Product = { part: "", model: "", desc: "", hsn: "", duty: "", status: "Active", customer: CUSTOMER_NAMES[0] ?? "" };

export function ProductMasterPanel() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<string | null>(null);
  const [form, setForm] = useState<Product>(EMPTY_PRODUCT);
  const [error, setError] = useState<string | null>(null);
  const [importRows, setImportRows] = useState<ParsedProductRow[]>([]);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const clearImport = () => {
    setImportRows([]);
    setImportFileName(null);
    setImportError(null);
  };

  const openAdd = () => {
    setEditingPart(null);
    setForm(EMPTY_PRODUCT);
    setError(null);
    clearImport();
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingPart(p.part);
    setForm(p);
    setError(null);
    clearImport();
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportError(null);
    setImporting(true);
    try {
      const rows = await parseProductsFromExcel(file);
      if (rows.length === 0) {
        setImportError("No recognizable product rows found in this file.");
        setImportRows([]);
        setImportFileName(null);
        return;
      }
      setImportFileName(file.name);
      setImportRows(rows);
    } catch {
      setImportError("Couldn't read this file. Upload a valid .xlsx, .xls, or .csv file.");
      setImportRows([]);
      setImportFileName(null);
    } finally {
      setImporting(false);
    }
  };

  const save = () => {
    if (editingPart) {
      if (!form.part.trim() || !form.desc.trim()) {
        setError("Part No. and Description are required.");
        return;
      }
      setProducts((prev) => prev.map((p) => (p.part === editingPart ? form : p)));
      setModalOpen(false);
      return;
    }

    if (importRows.length === 0) {
      setError("Upload an Excel file with product data to add.");
      return;
    }
    const existingParts = new Set(products.map((p) => p.part));
    const newProducts: Product[] = importRows
      .filter((row) => row.part && !existingParts.has(row.part))
      .map((row) => ({
        part: row.part ?? "",
        model: row.model ?? "—",
        desc: row.desc ?? "",
        hsn: row.hsn ?? "—",
        duty: row.duty ?? "—",
        status: row.status ?? "Active",
        customer: row.customer || form.customer,
      }));
    if (newProducts.length === 0) {
      setError("No new products to add — check the file has a Part No. column and isn't already in Product Master.");
      return;
    }
    setProducts((prev) => [...newProducts, ...prev]);
    setModalOpen(false);
  };

  const matched = products.filter((p) => p.status === "Active").length;
  const unmatched = products.length - matched;
  const matchedPct = products.length ? Math.round((matched / products.length) * 100) : 0;

  return (
    <>
      <div className="flex gap-4 flex-wrap mb-6">
        <StatCard icon={Boxes} label="Total records" value={String(products.length)} accent={T.slate} />
        <StatCard icon={CheckCircle2} label="Matched & active" value={String(matched)} sub={`${matchedPct}%`} accent={T.teal} />
        <StatCard icon={CircleAlert} label="Unmatched" value={String(unmatched)} accent={T.rust} />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          <Plus size={15} /> Add product
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Part No.</Th><Th>Model No.</Th><Th>Description</Th><Th>Customer</Th><Th>HSN/CTH</Th><Th>Duty</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.part}>
                <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{p.part}</span></Td>
                <Td mono>{p.model}</Td>
                <Td>{p.desc}</Td>
                <Td>{p.customer}</Td>
                <Td mono>{p.hsn}</Td>
                <Td mono>{p.duty}</Td>
                <Td>
                  {p.status === "Active" ? (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.teal, fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.rust, fontWeight: 600 }}>
                      <CircleAlert size={13} /> Unmatched
                    </span>
                  )}
                </Td>
                <Td>
                  <button onClick={() => openEdit(p)} aria-label={`Edit ${p.part}`}>
                    <PenLine size={14} color={T.slateSoft} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editingPart ? "Edit product" : "Add product"}
        onClose={close}
        width={600}
        footer={
          <>
            <button
              onClick={close}
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              {editingPart
                ? "Save changes"
                : importRows.length > 1
                ? `Add ${importRows.length} products`
                : "Add product"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {!editingPart && (
            <>
              <SelectField
                label="Customer"
                value={form.customer}
                onChange={(v) => setForm({ ...form, customer: v })}
                options={CUSTOMER_NAMES}
              />

              <div>
                <label
                  className="block text-[11.5px] mb-1.5"
                  style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
                >
                  UPLOAD FILE
                </label>
                <label
                  className="flex items-center justify-center gap-2 px-4 py-6 rounded-lg cursor-pointer w-full"
                  style={{ border: `1px dashed ${T.hair}`, background: T.mist }}
                >
                  <UploadCloud size={16} color={T.slateSoft} />
                  <span style={{ ...fontBody, color: T.slate, fontSize: 13, fontWeight: 600 }}>
                    {importing ? "Reading…" : "Click to upload .xlsx, .xls, or .csv"}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={importing}
                  />
                </label>
                {importFileName && (
                  <div
                    className="flex items-center justify-between mt-3 px-3 py-2 rounded-lg"
                    style={{ background: "#fff", border: `1px solid ${T.hair}` }}
                  >
                    <span className="flex items-center gap-2 text-[12px]" style={{ ...fontBody, color: T.teal, fontWeight: 600 }}>
                      <FileCheck2 size={14} />
                      {importFileName} — {importRows.length} row{importRows.length === 1 ? "" : "s"} found
                    </span>
                    <button onClick={clearImport} className="text-[11.5px]" style={{ ...fontBody, color: T.slateSoft }}>
                      Clear
                    </button>
                  </div>
                )}
                {importError && (
                  <div className="mt-3 text-[12px]" style={{ ...fontBody, color: T.rust }}>{importError}</div>
                )}
              </div>

              {importRows.length > 0 && (
                <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${T.hair}` }}>
                  <div className="max-h-[220px] overflow-y-auto">
                    <table className="w-full">
                      <thead>
                        <tr><Th>Part No.</Th><Th>Description</Th><Th>Customer</Th></tr>
                      </thead>
                      <tbody>
                        {importRows.map((row, i) => (
                          <tr key={i}>
                            <Td mono>{row.part || "—"}</Td>
                            <Td>{row.desc || "—"}</Td>
                            <Td>{row.customer || form.customer}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {editingPart && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Part No." value={form.part} onChange={(v) => setForm({ ...form, part: v })} mono disabled />
              <Field label="Model No." value={form.model} onChange={(v) => setForm({ ...form, model: v })} mono />
              <div className="col-span-2">
                <Field label="Description" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
              </div>
              <SelectField
                label="Customer"
                value={form.customer}
                onChange={(v) => setForm({ ...form, customer: v })}
                options={CUSTOMER_NAMES}
              />
              <Field label="HSN/CTH" value={form.hsn} onChange={(v) => setForm({ ...form, hsn: v })} mono />
              <Field label="Duty" value={form.duty} onChange={(v) => setForm({ ...form, duty: v })} mono />
              <SelectField
                label="Status"
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v as ProductStatus })}
                options={STATUS_OPTIONS}
              />
            </div>
          )}
        </div>
        {error && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
