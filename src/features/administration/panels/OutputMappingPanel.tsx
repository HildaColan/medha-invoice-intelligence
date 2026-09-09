import { useState } from "react";
import { ArrowRight, PenLine, Plus, Rows3, Trash2 } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";
import { Field, Modal, Td, Th } from "@/components/ui";
import { OUTPUT_TEMPLATES } from "@/data";
import type { OutputFieldMapping, OutputTemplate } from "@/types";
import { useAuditLog } from "../auditLog";

const CURRENT_USER = "Priya Raghavan";

function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const EMPTY_FIELD_FORM = { internalField: "", outputField: "" };

export function OutputMappingPanel() {
  const { logActivity } = useAuditLog();
  const [templates, setTemplates] = useState<OutputTemplate[]>(OUTPUT_TEMPLATES);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateError, setTemplateError] = useState<string | null>(null);

  const [fieldsTemplateId, setFieldsTemplateId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldForm, setFieldForm] = useState(EMPTY_FIELD_FORM);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const activeTemplate = templates.find((t) => t.id === fieldsTemplateId) ?? null;

  const openAddTemplate = () => {
    setEditingTemplateId(null);
    setTemplateName("");
    setTemplateError(null);
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (t: OutputTemplate) => {
    setEditingTemplateId(t.id);
    setTemplateName(t.name);
    setTemplateError(null);
    setTemplateModalOpen(true);
  };

  const closeTemplateModal = () => setTemplateModalOpen(false);

  const saveTemplate = () => {
    if (!templateName.trim()) {
      setTemplateError("Template name is required.");
      return;
    }
    const previousTemplate = editingTemplateId ? templates.find((t) => t.id === editingTemplateId) : null;
    setTemplates((prev) => {
      if (editingTemplateId) {
        return prev.map((t) => (t.id === editingTemplateId ? { ...t, name: templateName } : t));
      }
      const id = `tmpl-${slugify(templateName)}` || `tmpl-${Date.now()}`;
      if (prev.some((t) => t.id === id)) {
        setTemplateError("A template with this name already exists.");
        return prev;
      }
      const newTemplate: OutputTemplate = {
        id,
        name: templateName,
        createdAt: todayLabel(),
        createdBy: CURRENT_USER,
        fields: [],
      };
      return [newTemplate, ...prev];
    });
    setTemplateModalOpen(false);
    logActivity({
      action: editingTemplateId ? "Edit" : "Create",
      module: "Output Mapping",
      ref: templateName,
      previousValue: editingTemplateId ? previousTemplate?.name : undefined,
      updatedValue: templateName,
    });
  };

  const removeTemplate = (t: OutputTemplate) => {
    if (window.confirm(`Remove the "${t.name}" template and all its field mappings?`)) {
      setTemplates((prev) => prev.filter((x) => x.id !== t.id));
      logActivity({ action: "Delete", module: "Output Mapping", ref: t.name });
    }
  };

  const openFieldsModal = (t: OutputTemplate) => {
    setFieldsTemplateId(t.id);
    setEditingFieldId(null);
    setFieldForm(EMPTY_FIELD_FORM);
    setFieldError(null);
  };

  const closeFieldsModal = () => setFieldsTemplateId(null);

  const startEditField = (f: OutputFieldMapping) => {
    setEditingFieldId(f.id);
    setFieldForm({ internalField: f.internalField, outputField: f.outputField });
    setFieldError(null);
  };

  const resetFieldForm = () => {
    setEditingFieldId(null);
    setFieldForm(EMPTY_FIELD_FORM);
    setFieldError(null);
  };

  const saveField = () => {
    if (!fieldForm.internalField.trim() || !fieldForm.outputField.trim()) {
      setFieldError("Both internal field and output field are required.");
      return;
    }
    const templateName = activeTemplate?.name ?? "";
    const previousField = editingFieldId ? activeTemplate?.fields.find((f) => f.id === editingFieldId) : null;
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== fieldsTemplateId) return t;
        if (editingFieldId) {
          return { ...t, fields: t.fields.map((f) => (f.id === editingFieldId ? { ...f, ...fieldForm } : f)) };
        }
        const id = `${t.id}-f-${slugify(fieldForm.internalField)}` || `${t.id}-f-${Date.now()}`;
        if (t.fields.some((f) => f.id === id)) {
          setFieldError("This internal field is already mapped in this template.");
          return t;
        }
        return { ...t, fields: [...t.fields, { id, ...fieldForm }] };
      }),
    );
    resetFieldForm();
    logActivity({
      action: editingFieldId ? "Edit" : "Create",
      module: "Output Mapping",
      ref: `${templateName} — ${fieldForm.internalField}`,
      previousValue: previousField?.outputField,
      updatedValue: fieldForm.outputField,
    });
  };

  const removeField = (f: OutputFieldMapping) => {
    const templateName = activeTemplate?.name ?? "";
    setTemplates((prev) =>
      prev.map((t) => (t.id === fieldsTemplateId ? { ...t, fields: t.fields.filter((x) => x.id !== f.id) } : t)),
    );
    if (editingFieldId === f.id) resetFieldForm();
    logActivity({
      action: "Delete",
      module: "Output Mapping",
      ref: `${templateName} — ${f.internalField}`,
      previousValue: f.outputField,
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddTemplate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          <Plus size={15} /> Add template
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Template name</Th><Th>Created at</Th><Th>Created by</Th><Th>Fields</Th><Th></Th></tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <Td><span style={{ fontWeight: 600, color: T.ink }}>{t.name}</span></Td>
                <Td mono>{t.createdAt}</Td>
                <Td>{t.createdBy}</Td>
                <Td>{t.fields.length} field{t.fields.length === 1 ? "" : "s"}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openFieldsModal(t)} aria-label={`Manage fields for ${t.name}`}>
                      <Rows3 size={14} color={T.slateSoft} />
                    </button>
                    <button onClick={() => openEditTemplate(t)} aria-label={`Edit ${t.name}`}>
                      <PenLine size={14} color={T.slateSoft} />
                    </button>
                    <button onClick={() => removeTemplate(t)} aria-label={`Remove ${t.name}`}>
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
        open={templateModalOpen}
        title={editingTemplateId ? "Edit template" : "Add template"}
        onClose={closeTemplateModal}
        width={440}
        footer={
          <>
            <button
              onClick={closeTemplateModal}
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            >
              Cancel
            </button>
            <button
              onClick={saveTemplate}
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              {editingTemplateId ? "Save changes" : "Add template"}
            </button>
          </>
        }
      >
        <Field label="Template name" value={templateName} onChange={setTemplateName} />
        {templateError && (
          <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{templateError}</div>
        )}
      </Modal>

      <Modal
        open={!!activeTemplate}
        title={activeTemplate ? `${activeTemplate.name} — field mapping` : ""}
        onClose={closeFieldsModal}
        width={560}
        footer={
          <button
            onClick={closeFieldsModal}
            className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
            style={{ background: T.brass, color: "#fff", ...fontBody }}
          >
            Close
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          {activeTemplate && activeTemplate.fields.length > 0 ? (
            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${T.hair}` }}>
              <table className="w-full">
                <thead>
                  <tr><Th>Internal field</Th><Th></Th><Th>Output field</Th><Th></Th></tr>
                </thead>
                <tbody>
                  {activeTemplate.fields.map((f) => (
                    <tr key={f.id}>
                      <Td mono>{f.internalField}</Td>
                      <Td><ArrowRight size={13} color={T.slateSoft} /></Td>
                      <Td mono>{f.outputField}</Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditField(f)} aria-label={`Edit ${f.internalField} mapping`}>
                            <PenLine size={13} color={T.slateSoft} />
                          </button>
                          <button onClick={() => removeField(f)} aria-label={`Remove ${f.internalField} mapping`}>
                            <Trash2 size={13} color={T.rust} />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12.5 }}>No field mappings yet — add one below.</div>
          )}

          <div>
            <div style={{ ...fontMono, color: T.slateSoft, fontSize: 11, letterSpacing: "0.04em", marginBottom: 6 }}>
              {editingFieldId ? "EDIT FIELD MAPPING" : "ADD FIELD MAPPING"}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Internal field" value={fieldForm.internalField} onChange={(v) => setFieldForm({ ...fieldForm, internalField: v })} mono />
              <Field label="Output field" value={fieldForm.outputField} onChange={(v) => setFieldForm({ ...fieldForm, outputField: v })} mono />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              {editingFieldId && (
                <button
                  onClick={resetFieldForm}
                  className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold"
                  style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={saveField}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-semibold"
                style={{ background: T.brass, color: "#fff", ...fontBody }}
              >
                {!editingFieldId && <Plus size={13} />}
                {editingFieldId ? "Save field" : "Add field"}
              </button>
            </div>
            {fieldError && (
              <div className="mt-2 text-[12px]" style={{ ...fontBody, color: T.rust }}>{fieldError}</div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
