import { useState } from "react";
import { PenLine, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { T, fontBody, fontDisplay } from "@/theme/tokens";
import { Field, Modal } from "@/components/ui";
import { ROLES } from "@/data";
import type { Role } from "@/types";

const EMPTY_ROLE: Role = { id: "", name: "", description: "" };

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function RolesPanel() {
  const [roles, setRoles] = useState<Role[]>(ROLES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Role>(EMPTY_ROLE);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_ROLE);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (r: Role) => {
    setEditingId(r.id);
    setForm(r);
    setError(null);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const save = () => {
    if (!form.name.trim() || !form.description.trim()) {
      setError("Role name and description are required.");
      return;
    }
    setRoles((prev) => {
      if (editingId) {
        return prev.map((r) => (r.id === editingId ? form : r));
      }
      const id = `role-${slugify(form.name)}` || `role-${Date.now()}`;
      if (prev.some((r) => r.id === id)) {
        setError("A role with a similar name already exists.");
        return prev;
      }
      return [...prev, { ...form, id }];
    });
    setModalOpen(false);
  };

  const remove = (r: Role) => {
    if (window.confirm(`Remove the "${r.name}" role? Users assigned to it will need to be reassigned.`)) {
      setRoles((prev) => prev.filter((role) => role.id !== r.id));
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          <Plus size={15} /> Add role
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {roles.map((r) => (
          <div key={r.id} className="rounded-2xl p-5" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
            <div className="flex items-start justify-between">
              <ShieldCheck size={18} color={T.brass} />
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(r)} aria-label={`Edit ${r.name}`} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F5EDE4]">
                  <PenLine size={13} color={T.slateSoft} />
                </button>
                <button onClick={() => remove(r)} aria-label={`Remove ${r.name}`} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F5EDE4]">
                  <Trash2 size={13} color={T.rust} />
                </button>
              </div>
            </div>
            <div style={{ ...fontDisplay, color: T.ink, fontSize: 16, fontWeight: 600, marginTop: 10 }}>{r.name}</div>
            <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12.5, marginTop: 4 }}>{r.description}</div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? "Edit role" : "Add role"}
        onClose={close}
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
              {editingId ? "Save changes" : "Add role"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Role name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        </div>
        {error && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
