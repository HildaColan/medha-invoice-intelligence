import { useState } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import { T, fontMono } from "@/theme/tokens";
import { Field, Modal, SelectField, Td, Th, useToast } from "@/components/ui";
import { ROLES, USERS } from "@/data";
import type { AppUser, UserStatus } from "@/types";
import { useAuditLog } from "../auditLog";

const EMPTY_USER: AppUser = { name: "", email: "", role: "HOD", status: "Active" };
const STATUS_OPTIONS: readonly UserStatus[] = ["Active", "Deactivated"];
const CURRENT_USER_EMAIL = "priya.r@transorion.com";

export function UsersPanel() {
  const notify = useToast();
  const { logActivity } = useAuditLog();
  const [users, setUsers] = useState<AppUser[]>(USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [form, setForm] = useState<AppUser>(EMPTY_USER);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingEmail(null);
    setForm(EMPTY_USER);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (u: AppUser) => {
    setEditingEmail(u.email);
    setForm(u);
    setError(null);
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    if (!editingEmail && users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
      setError("A user with this email already exists.");
      return;
    }
    const previous = editingEmail ? users.find((u) => u.email === editingEmail) : undefined;
    setUsers((prev) => (editingEmail ? prev.map((u) => (u.email === editingEmail ? form : u)) : [form, ...prev]));
    setModalOpen(false);
    notify(editingEmail ? `${form.name}'s access updated.` : `${form.name} added as ${form.role}.`);
    logActivity({
      action: editingEmail ? "Edit" : "Create",
      module: "Users",
      ref: form.email,
      previousValue: previous ? `${previous.role} / ${previous.status}` : undefined,
      updatedValue: `${form.role} / ${form.status}`,
    });
  };

  const remove = (u: AppUser) => {
    if (u.email === CURRENT_USER_EMAIL) {
      notify("You can't remove your own account.");
      return;
    }
    if (window.confirm(`Remove ${u.name}? They will lose access to MEDHA.`)) {
      setUsers((prev) => prev.filter((row) => row.email !== u.email));
      notify(`${u.name} removed.`);
      logActivity({ action: "Delete", module: "Users", ref: u.email, previousValue: `${u.role} / ${u.status}` });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold" style={{ background: T.brass, color: "#fff" }}>
          <Plus size={15} /> Add user
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <Td><span style={{ fontWeight: 600, color: T.ink }}>{u.name}</span></Td>
                <Td mono>{u.email}</Td>
                <Td>{u.role}</Td>
                <Td>
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ ...fontMono, background: u.status === "Active" ? T.tealSoft : T.rustSoft, color: u.status === "Active" ? T.teal : T.rust }}
                  >
                    {u.status}
                  </span>
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(u)} aria-label={`Edit ${u.name}`}><PenLine size={14} color={T.slateSoft} /></button>
                    <button onClick={() => remove(u)} aria-label={`Remove ${u.name}`}><Trash2 size={14} color={T.rust} /></button>
                  </div>
                </Td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[12.5px]" style={{ color: T.slateSoft }}>No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editingEmail ? "Edit user" : "Add user"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-lg text-[13px] font-semibold" style={{ background: "#fff", border: `1px solid ${T.hair}`, color: T.slate }}>
              Cancel
            </button>
            <button onClick={save} className="px-4 py-2.5 rounded-lg text-[13px] font-semibold" style={{ background: T.brass, color: "#fff" }}>
              {editingEmail ? "Save changes" : "Add user"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" value={form.email} mono onChange={(v) => setForm({ ...form, email: v })} disabled={!!editingEmail} />
          <SelectField label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={ROLES.map((r) => r.name)} />
          <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as UserStatus })} options={STATUS_OPTIONS} />
        </div>
        {error && <div className="mt-4 text-[12.5px]" style={{ color: T.rust }}>{error}</div>}
      </Modal>
    </>
  );
}
