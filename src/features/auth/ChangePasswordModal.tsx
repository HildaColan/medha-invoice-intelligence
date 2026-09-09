import { useState } from "react";
import { T, fontBody, fontMono } from "@/theme/tokens";
import { Modal, useToast } from "@/components/ui";
import { useAuditLog } from "@/features/administration/auditLog";

export interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_FORM = { current: "", next: "", confirm: "" };

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const notify = useToast();
  const { logActivity } = useAuditLog();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    onClose();
    setForm(EMPTY_FORM);
    setError(null);
  };

  const save = () => {
    if (!form.current || !form.next || !form.confirm) {
      setError("All fields are required.");
      logActivity({ action: "Update", module: "Auth", ref: "Own account", result: "Failed" });
      return;
    }
    if (form.next.length < 8) {
      setError("New password must be at least 8 characters.");
      logActivity({ action: "Update", module: "Auth", ref: "Own account", result: "Failed" });
      return;
    }
    if (form.next !== form.confirm) {
      setError("New password and confirmation don't match.");
      logActivity({ action: "Update", module: "Auth", ref: "Own account", result: "Failed" });
      return;
    }
    close();
    notify("Password updated.");
    logActivity({ action: "Update", module: "Auth", ref: "Own account" });
  };

  return (
    <Modal
      open={open}
      title="Change password"
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
            Update password
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>
            Current password
          </label>
          <input
            type="password"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
            style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
          />
        </div>
        <div>
          <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>
            New password
          </label>
          <input
            type="password"
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
            style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
          />
        </div>
        <div>
          <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>
            Confirm new password
          </label>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
            style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
          />
        </div>
      </div>
      {error && (
        <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{error}</div>
      )}
    </Modal>
  );
}
