import { useState } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { Field, Modal, SelectField, Td, Th } from "@/components/ui";
import { AUDIT, USERS } from "@/data";
import type { AuditEntry } from "@/types";

const USER_OPTIONS = ["System", ...USERS.map((u) => u.name)];

function nowLabel(): string {
  const datePart = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timePart = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${datePart}, ${timePart}`;
}

function emptyEntry(): AuditEntry {
  return { id: "", user: USER_OPTIONS[0], action: "", ref: "", time: nowLabel() };
}

export function AuditLogsPanel() {
  const [logs, setLogs] = useState<AuditEntry[]>(AUDIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AuditEntry>(emptyEntry());
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyEntry());
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (entry: AuditEntry) => {
    setEditingId(entry.id);
    setForm(entry);
    setError(null);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const save = () => {
    if (!form.action.trim() || !form.ref.trim()) {
      setError("Action and Reference are required.");
      return;
    }
    setLogs((prev) => {
      if (editingId) {
        return prev.map((l) => (l.id === editingId ? form : l));
      }
      const id = `audit-${Date.now()}`;
      return [{ ...form, id }, ...prev];
    });
    setModalOpen(false);
  };

  const remove = (entry: AuditEntry) => {
    if (window.confirm(`Remove this audit log entry for "${entry.action}"?`)) {
      setLogs((prev) => prev.filter((l) => l.id !== entry.id));
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
          <Plus size={15} /> Add entry
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>User</Th><Th>Action</Th><Th>Reference</Th><Th>Timestamp</Th><Th></Th></tr>
          </thead>
          <tbody>
            {logs.map((a) => (
              <tr key={a.id}>
                <Td>{a.user}</Td>
                <Td>{a.action}</Td>
                <Td mono>{a.ref}</Td>
                <Td mono>{a.time}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(a)} aria-label={`Edit entry ${a.action}`}>
                      <PenLine size={14} color={T.slateSoft} />
                    </button>
                    <button onClick={() => remove(a)} aria-label={`Remove entry ${a.action}`}>
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
        title={editingId ? "Edit audit log entry" : "Add audit log entry"}
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
              {editingId ? "Save changes" : "Add entry"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SelectField
            label="User"
            value={form.user}
            onChange={(v) => setForm({ ...form, user: v })}
            options={USER_OPTIONS}
          />
          <Field label="Action" value={form.action} onChange={(v) => setForm({ ...form, action: v })} />
          <Field label="Reference" value={form.ref} onChange={(v) => setForm({ ...form, ref: v })} mono />
          <Field label="Timestamp" value={form.time} onChange={(v) => setForm({ ...form, time: v })} mono />
        </div>
        {error && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
