import { useState } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { Field, Modal, SelectField, Td, Th, Toggle } from "@/components/ui";
import { VALIDATION_RULES, VALIDATION_RULE_TYPES } from "@/data";
import type { ValidationRule, ValidationRuleType } from "@/types";

const EMPTY_RULE: ValidationRule = { id: "", field: "", ruleType: VALIDATION_RULE_TYPES[0], condition: "", enabled: true };

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ValidationRulesPanel() {
  const [rules, setRules] = useState<ValidationRule[]>(VALIDATION_RULES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ValidationRule>(EMPTY_RULE);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_RULE);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (rule: ValidationRule) => {
    setEditingId(rule.id);
    setForm(rule);
    setError(null);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const save = () => {
    if (!form.field.trim() || !form.condition.trim()) {
      setError("Field and Condition are required.");
      return;
    }
    setRules((prev) => {
      if (editingId) {
        return prev.map((r) => (r.id === editingId ? form : r));
      }
      const id = `vr-${slugify(form.field)}-${slugify(form.ruleType)}` || `vr-${Date.now()}`;
      if (prev.some((r) => r.id === id)) {
        setError("A similar rule already exists for this field.");
        return prev;
      }
      return [{ ...form, id }, ...prev];
    });
    setModalOpen(false);
  };

  const remove = (rule: ValidationRule) => {
    if (window.confirm(`Remove the validation rule for "${rule.field}"?`)) {
      setRules((prev) => prev.filter((r) => r.id !== rule.id));
    }
  };

  const toggleEnabled = (rule: ValidationRule) => {
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <>
      <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
        <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12.5 }}>
          Rules applied automatically during invoice extraction and review.
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold shrink-0"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          <Plus size={15} /> Add rule
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Field</Th><Th>Rule type</Th><Th>Condition</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id}>
                <Td mono>{r.field}</Td>
                <Td>{r.ruleType}</Td>
                <Td>{r.condition}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Toggle on={r.enabled} onChange={() => toggleEnabled(r)} />
                    <span style={{ ...fontBody, color: r.enabled ? T.teal : T.slateSoft, fontSize: 12, fontWeight: 600 }}>
                      {r.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(r)} aria-label={`Edit rule for ${r.field}`}>
                      <PenLine size={14} color={T.slateSoft} />
                    </button>
                    <button onClick={() => remove(r)} aria-label={`Remove rule for ${r.field}`}>
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
        title={editingId ? "Edit validation rule" : "Add validation rule"}
        onClose={close}
        width={520}
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
              {editingId ? "Save changes" : "Add rule"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Field" value={form.field} onChange={(v) => setForm({ ...form, field: v })} mono />
          <SelectField
            label="Rule type"
            value={form.ruleType}
            onChange={(v) => setForm({ ...form, ruleType: v as ValidationRuleType })}
            options={VALIDATION_RULE_TYPES}
          />
          <Field label="Condition" value={form.condition} onChange={(v) => setForm({ ...form, condition: v })} />
        </div>
        {error && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
        )}
      </Modal>
    </>
  );
}
