import { useState } from "react";
import { Boxes, CheckCircle2, CircleAlert, PenLine, Plus } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { Field, Modal, SelectField, StatCard, Td, Th } from "@/components/ui";
import { PRODUCTS } from "@/data";
import type { Product, ProductStatus } from "@/types";

const STATUS_OPTIONS: readonly ProductStatus[] = ["Active", "Unmatched"];

const EMPTY_PRODUCT: Product = { part: "", model: "", desc: "", hsn: "", duty: "", status: "Active" };

export function ProductMasterPanel() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<string | null>(null);
  const [form, setForm] = useState<Product>(EMPTY_PRODUCT);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingPart(null);
    setForm(EMPTY_PRODUCT);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingPart(p.part);
    setForm(p);
    setError(null);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const save = () => {
    if (!form.part.trim() || !form.desc.trim()) {
      setError("Part No. and Description are required.");
      return;
    }
    if (!editingPart && products.some((p) => p.part === form.part)) {
      setError("A product with this Part No. already exists.");
      return;
    }
    setProducts((prev) =>
      editingPart ? prev.map((p) => (p.part === editingPart ? form : p)) : [form, ...prev],
    );
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
            <tr><Th>Part No.</Th><Th>Model No.</Th><Th>Description</Th><Th>HSN/CTH</Th><Th>Duty</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.part}>
                <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{p.part}</span></Td>
                <Td mono>{p.model}</Td>
                <Td>{p.desc}</Td>
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
        width={560}
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
              {editingPart ? "Save changes" : "Add product"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Part No." value={form.part} onChange={(v) => setForm({ ...form, part: v })} mono disabled={!!editingPart} />
          <Field label="Model No." value={form.model} onChange={(v) => setForm({ ...form, model: v })} mono />
          <div className="col-span-2">
            <Field label="Description" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
          </div>
          <Field label="HSN/CTH" value={form.hsn} onChange={(v) => setForm({ ...form, hsn: v })} mono />
          <Field label="Duty" value={form.duty} onChange={(v) => setForm({ ...form, duty: v })} mono />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as ProductStatus })}
            options={STATUS_OPTIONS}
          />
        </div>
        {error && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
