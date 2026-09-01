import { Fragment, useState } from "react";
import { PenLine, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { Field, Modal } from "@/components/ui";
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  ROLES,
  TOTAL_PERMISSIONS,
  createEmptyPermissions,
  emptyModulePermissions,
  grantedCount,
} from "@/data";
import type { PermissionAction, Role, RolePermissions } from "@/types";

const EMPTY_ROLE: Role = { id: "", name: "", description: "", permissions: createEmptyPermissions() };

const ACTION_LABELS: Record<PermissionAction, string> = {
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
};

const MODULE_GROUPS = Array.from(new Set(PERMISSION_MODULES.map((m) => m.group)));

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

  const toggleCell = (moduleKey: string, action: PermissionAction) => {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: {
          ...(prev.permissions[moduleKey] ?? emptyModulePermissions()),
          [action]: !prev.permissions[moduleKey]?.[action],
        },
      },
    }));
  };

  const toggleRow = (moduleKey: string) => {
    const current = form.permissions[moduleKey] ?? emptyModulePermissions();
    const allOn = PERMISSION_ACTIONS.every((a) => current[a]);
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: { view: !allOn, create: !allOn, edit: !allOn, delete: !allOn },
      },
    }));
  };

  const toggleColumn = (action: PermissionAction) => {
    const allOn = PERMISSION_MODULES.every((m) => form.permissions[m.key]?.[action]);
    setForm((prev) => {
      const next: RolePermissions = { ...prev.permissions };
      for (const m of PERMISSION_MODULES) {
        next[m.key] = { ...(next[m.key] ?? emptyModulePermissions()), [action]: !allOn };
      }
      return { ...prev, permissions: next };
    });
  };

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
            <div
              className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10.5px] font-semibold"
              style={{ ...fontMono, background: T.tealSoft, color: T.teal }}
            >
              {grantedCount(r.permissions)} / {TOTAL_PERMISSIONS} permissions
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? "Edit role" : "Add role"}
        onClose={close}
        width={720}
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          </div>

          <div>
            <label
              className="block text-[11.5px] mb-2"
              style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}
            >
              MENU PERMISSIONS
            </label>
            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${T.hair}` }}>
              <div className="max-h-[340px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: T.mist }}>
                      <th
                        className="text-left px-3.5 py-2.5 text-[11px] font-semibold sticky top-0"
                        style={{ ...fontMono, color: T.slateSoft, background: T.mist, borderBottom: `1px solid ${T.hair}` }}
                      >
                        Menu
                      </th>
                      {PERMISSION_ACTIONS.map((action) => (
                        <th
                          key={action}
                          className="px-3 py-2.5 text-[11px] font-semibold sticky top-0"
                          style={{ ...fontMono, color: T.slateSoft, background: T.mist, borderBottom: `1px solid ${T.hair}` }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleColumn(action)}
                            className="flex flex-col items-center gap-1 w-full"
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={PERMISSION_MODULES.every((m) => form.permissions[m.key]?.[action])}
                              style={{ accentColor: T.brass }}
                            />
                            {ACTION_LABELS[action]}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULE_GROUPS.map((group) => (
                      <Fragment key={group}>
                        <tr>
                          <td
                            colSpan={PERMISSION_ACTIONS.length + 1}
                            className="px-3.5 py-1.5 text-[10px] font-semibold tracking-wider"
                            style={{ ...fontMono, color: T.slateSoft, background: "#F5EDE4", borderBottom: `1px solid ${T.hair}` }}
                          >
                            {group.toUpperCase()}
                          </td>
                        </tr>
                        {PERMISSION_MODULES.filter((m) => m.group === group).map((m) => (
                          <tr key={m.key}>
                            <td
                              className="px-3.5 py-2 text-[12.5px]"
                              style={{ ...fontBody, color: T.slate, borderBottom: `1px solid ${T.hair}` }}
                            >
                              <button type="button" onClick={() => toggleRow(m.key)} className="text-left hover:underline">
                                {m.label}
                              </button>
                            </td>
                            {PERMISSION_ACTIONS.map((action) => (
                              <td
                                key={action}
                                className="px-3 py-2 text-center"
                                style={{ borderBottom: `1px solid ${T.hair}` }}
                              >
                                <input
                                  type="checkbox"
                                  checked={form.permissions[m.key]?.[action] ?? false}
                                  onChange={() => toggleCell(m.key, action)}
                                  style={{ accentColor: T.brass }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
