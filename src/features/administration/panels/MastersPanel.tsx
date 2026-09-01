import { useState } from "react";
import { CheckCircle2, CircleAlert, PenLine, Plus, Trash2 } from "lucide-react";
import { T, fontBody, fontDisplay } from "@/theme/tokens";
import { Field, Modal, SelectField, Td, Th } from "@/components/ui";
import { MASTER_CATEGORIES, MASTER_DATA } from "@/data";
import type { MasterCategoryKey, MasterEntry, MasterEntryStatus } from "@/types";

const STATUS_OPTIONS: readonly MasterEntryStatus[] = ["Active", "Inactive"];

const EMPTY_ENTRY: MasterEntry = { id: "", code: "", name: "", status: "Active" };

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function MastersPanel() {
  const [activeKey, setActiveKey] = useState<MasterCategoryKey>(MASTER_CATEGORIES[0].key);
  const [data, setData] = useState<Record<MasterCategoryKey, MasterEntry[]>>(MASTER_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MasterEntry>(EMPTY_ENTRY);
  const [error, setError] = useState<string | null>(null);

  const category = MASTER_CATEGORIES.find((c) => c.key === activeKey)!;
  const entries = data[activeKey];

  const selectCategory = (key: MasterCategoryKey) => {
    setActiveKey(key);
    setModalOpen(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_ENTRY);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (entry: MasterEntry) => {
    setEditingId(entry.id);
    setForm(entry);
    setError(null);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const save = () => {
    if (!form.code.trim() || !form.name.trim()) {
      setError(`${category.codeLabel} and ${category.nameLabel} are required.`);
      return;
    }
    setData((prev) => {
      const list = prev[activeKey];
      if (editingId) {
        return { ...prev, [activeKey]: list.map((e) => (e.id === editingId ? form : e)) };
      }
      const id = `${activeKey}-${slugify(form.name)}` || `${activeKey}-${Date.now()}`;
      if (list.some((e) => e.id === id)) {
        setError("An entry with a similar name already exists.");
        return prev;
      }
      return { ...prev, [activeKey]: [{ ...form, id }, ...list] };
    });
    setModalOpen(false);
  };

  const remove = (entry: MasterEntry) => {
    if (window.confirm(`Remove "${entry.name}"?`)) {
      setData((prev) => ({ ...prev, [activeKey]: prev[activeKey].filter((e) => e.id !== entry.id) }));
    }
  };

  return (
    <>
      <div className="flex gap-1 mb-6 overflow-x-auto overflow-y-hidden" style={{ borderBottom: `1px solid ${T.hair}` }}>
        {MASTER_CATEGORIES.map((c) => {
          const active = c.key === activeKey;
          return (
            <button
              key={c.key}
              onClick={() => selectCategory(c.key)}
              className="shrink-0 px-4 py-2.5 text-[13px] font-semibold -mb-px"
              style={{
                ...fontBody,
                color: active ? T.brass : T.slateSoft,
                borderBottom: active ? `2px solid ${T.brass}` : "2px solid transparent",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 style={{ ...fontDisplay, color: T.ink, fontSize: 18, fontWeight: 600 }}>{category.label}</h3>
          <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12.5, marginTop: 2 }}>{category.description}</div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold shrink-0"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          <Plus size={15} /> Add {category.nameLabel.toLowerCase()}
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>{category.codeLabel}</Th><Th>{category.nameLabel}</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{e.code}</span></Td>
                <Td>{e.name}</Td>
                <Td>
                  {e.status === "Active" ? (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.teal, fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[12px]" style={{ ...fontBody, color: T.rust, fontWeight: 600 }}>
                      <CircleAlert size={13} /> Inactive
                    </span>
                  )}
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(e)} aria-label={`Edit ${e.name}`}>
                      <PenLine size={14} color={T.slateSoft} />
                    </button>
                    <button onClick={() => remove(e)} aria-label={`Remove ${e.name}`}>
                      <Trash2 size={14} color={T.rust} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? `Edit ${category.nameLabel.toLowerCase()}` : `Add ${category.nameLabel.toLowerCase()}`}
        onClose={close}
        width={480}
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
              {editingId ? "Save changes" : "Add"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label={category.codeLabel} value={form.code} onChange={(v) => setForm({ ...form, code: v })} mono disabled={!!editingId} />
          <Field label={category.nameLabel} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as MasterEntryStatus })}
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
