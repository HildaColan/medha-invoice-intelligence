import { useState } from "react";
import { Building2, CheckCircle2, CircleAlert, PenLine, Plus, Trash2 } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { Field, Modal, SelectField, StatCard, Td, Th } from "@/components/ui";
import { CUSTOMERS } from "@/data";
import type { Customer, CustomerStatus } from "@/types";

const STATUS_OPTIONS: readonly CustomerStatus[] = ["Active", "Inactive"];

const EMPTY_CUSTOMER: Customer = { id: "", name: "", code: "", gstin: "", email: "", phone: "", status: "Active" };

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CustomerMasterPanel() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Customer>(EMPTY_CUSTOMER);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_CUSTOMER);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm(c);
    setError(null);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const save = () => {
    if (!form.name.trim() || !form.code.trim()) {
      setError("Customer name and code are required.");
      return;
    }
    setCustomers((prev) => {
      if (editingId) {
        return prev.map((c) => (c.id === editingId ? form : c));
      }
      const id = `cust-${slugify(form.name)}` || `cust-${Date.now()}`;
      if (prev.some((c) => c.id === id)) {
        setError("A customer with a similar name already exists.");
        return prev;
      }
      return [{ ...form, id }, ...prev];
    });
    setModalOpen(false);
  };

  const remove = (c: Customer) => {
    if (window.confirm(`Remove "${c.name}"? Products linked to this customer will keep their existing tag.`)) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== c.id));
    }
  };

  const active = customers.filter((c) => c.status === "Active").length;

  return (
    <>
      <div className="flex gap-4 flex-wrap mb-6">
        <StatCard icon={Building2} label="Total customers" value={String(customers.length)} accent={T.slate} />
        <StatCard icon={CheckCircle2} label="Active" value={String(active)} accent={T.teal} />
        <StatCard icon={CircleAlert} label="Inactive" value={String(customers.length - active)} accent={T.rust} />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          style={{ background: T.brass, color: "#fff", ...fontBody }}
        >
          <Plus size={15} /> Add customer
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <table className="w-full">
          <thead>
            <tr><Th>Code</Th><Th>Name</Th><Th>GSTIN</Th><Th>Email</Th><Th>Phone</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <Td mono><span style={{ fontWeight: 600, color: T.ink }}>{c.code}</span></Td>
                <Td>{c.name}</Td>
                <Td mono>{c.gstin}</Td>
                <Td>{c.email}</Td>
                <Td mono>{c.phone}</Td>
                <Td>
                  {c.status === "Active" ? (
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
                    <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`}>
                      <PenLine size={14} color={T.slateSoft} />
                    </button>
                    <button onClick={() => remove(c)} aria-label={`Remove ${c.name}`}>
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
        title={editingId ? "Edit customer" : "Add customer"}
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
              {editingId ? "Save changes" : "Add customer"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Customer name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          </div>
          <Field label="Customer code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} mono disabled={!!editingId} />
          <Field label="GSTIN" value={form.gstin} onChange={(v) => setForm({ ...form, gstin: v })} mono />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} mono />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as CustomerStatus })}
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
