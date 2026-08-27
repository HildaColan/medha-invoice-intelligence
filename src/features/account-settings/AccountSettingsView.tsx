import { useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { KeyRound, LogOut, Monitor, Smartphone, Trash2 } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { Modal, SectionHeading, Td, Th, Toggle, useToast } from "@/components/ui";
import type { NotificationPreferences, Session } from "@/types";

const INITIAL_SESSIONS: Session[] = [
  { id: "s1", device: "Chrome · macOS", loc: "Chennai, IN", time: "Active now", current: true },
  { id: "s2", device: "MEDHA Mobile · iOS", loc: "Chennai, IN", time: "2 hr ago", current: false },
  { id: "s3", device: "Chrome · Windows", loc: "Mumbai, IN", time: "3 days ago", current: false },
];

interface SettingsRowProps {
  icon?: LucideIcon;
  title: string;
  sub?: string;
  right: ReactNode;
}

function SettingsRow({ icon: Icon, title, sub, right }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4" style={{ borderBottom: `1px solid ${T.hair}` }}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.brass + "1A" }}>
            <Icon size={16} color={T.brass} />
          </div>
        )}
        <div className="min-w-0">
          <div style={{ ...fontBody, color: T.ink, fontSize: 13.5, fontWeight: 600 }}>{title}</div>
          {sub && <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

export function AccountSettingsView() {
  const notify = useToast();
  const [notif, setNotif] = useState<NotificationPreferences>({
    jobComplete: true,
    jobFailed: true,
    exportReady: true,
    weeklyDigest: false,
  });
  const [twoFA, setTwoFA] = useState(true);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState<string | null>(null);
  const [deactivated, setDeactivated] = useState(false);

  const savePassword = () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("New password and confirmation don't match.");
      return;
    }
    setPwModalOpen(false);
    setPwForm({ current: "", next: "", confirm: "" });
    setPwError(null);
    notify("Password updated.");
  };

  const signOutOthers = () => {
    const otherCount = sessions.filter((s) => !s.current).length;
    if (otherCount === 0) {
      notify("No other sessions to sign out.");
      return;
    }
    setSessions((prev) => prev.filter((s) => s.current));
    notify(`Signed out of ${otherCount} other session${otherCount > 1 ? "s" : ""}.`);
  };

  const revokeSession = (s: Session) => {
    setSessions((prev) => prev.filter((row) => row.id !== s.id));
    notify(`Revoked "${s.device}".`);
  };

  const deactivateAccount = () => {
    if (window.confirm("Deactivate your account? You'll lose access until an administrator reactivates it.")) {
      setDeactivated(true);
      notify("Your account has been deactivated.");
    }
  };

  return (
    <div className="px-8 py-7">
      <SectionHeading eyebrow="MY ACCOUNT" title="Account settings" />

      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* Security */}
        <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
          <div className="px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${T.hair}` }}>
            <div style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>Security</div>
            <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12 }}>Password and sign-in protection</div>
          </div>
          <SettingsRow
            icon={KeyRound}
            title="Password"
            sub="Last changed 41 days ago"
            right={
              <button onClick={() => setPwModalOpen(true)} className="px-3.5 py-2 rounded-lg text-[12px] font-semibold" style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}>
                Change
              </button>
            }
          />
          <SettingsRow
            icon={Smartphone}
            title="Two-factor authentication"
            sub="Require a code from your phone at sign-in"
            right={
              <Toggle
                on={twoFA}
                onChange={(v) => {
                  setTwoFA(v);
                  notify(v ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
                }}
              />
            }
          />
          <div className="px-6 py-4">
            <button onClick={signOutOthers} className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ ...fontBody, color: T.rust }}>
              <LogOut size={13.5} /> Sign out of all other sessions
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
          <div className="px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${T.hair}` }}>
            <div style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>Notification preferences</div>
            <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12 }}>Choose what MEDHA emails you about</div>
          </div>
          <SettingsRow
            title="Job completed"
            sub="A job finishes processing and is ready for review"
            right={<Toggle on={notif.jobComplete} onChange={(v) => setNotif((prev) => ({ ...prev, jobComplete: v }))} />}
          />
          <SettingsRow
            title="Job failed"
            sub="A job hits an error and needs attention"
            right={<Toggle on={notif.jobFailed} onChange={(v) => setNotif((prev) => ({ ...prev, jobFailed: v }))} />}
          />
          <SettingsRow
            title="Export ready"
            sub="A generated export file is ready to download"
            right={<Toggle on={notif.exportReady} onChange={(v) => setNotif((prev) => ({ ...prev, exportReady: v }))} />}
          />
          <div style={{ borderBottom: "none" }}>
            <SettingsRow
              title="Weekly digest"
              sub="A Monday summary of jobs, exports and accuracy"
              right={<Toggle on={notif.weeklyDigest} onChange={(v) => setNotif((prev) => ({ ...prev, weeklyDigest: v }))} />}
            />
          </div>
        </div>
      </div>

      {/* Active sessions */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <div className="px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${T.hair}` }}>
          <div style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>Active sessions</div>
          <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12 }}>Where you're currently signed in</div>
        </div>
        <table className="w-full">
          <thead>
            <tr><Th>Device</Th><Th>Location</Th><Th>Last active</Th><Th></Th></tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <Td>
                  <span className="flex items-center gap-2" style={{ fontWeight: 600, color: T.ink }}>
                    <Monitor size={14} color={T.slateSoft} /> {s.device}
                    {s.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ ...fontMono, background: T.tealSoft, color: T.teal }}>
                        This device
                      </span>
                    )}
                  </span>
                </Td>
                <Td>{s.loc}</Td>
                <Td mono>{s.time}</Td>
                <Td>
                  {!s.current && (
                    <button onClick={() => revokeSession(s)} style={{ ...fontBody, color: T.rust, fontSize: 12, fontWeight: 600 }}>
                      Revoke
                    </button>
                  )}
                </Td>
              </tr>
            ))}
            {sessions.length === 1 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-[12.5px]" style={{ ...fontBody, color: T.slateSoft }}>No other active sessions.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4"
        style={{ background: deactivated ? T.mist : T.rustSoft, border: `1px solid ${deactivated ? T.hair : T.rust + "33"}` }}
      >
        <div className="flex items-start gap-3">
          <Trash2 size={18} color={deactivated ? T.slateSoft : T.rust} className="mt-0.5" />
          <div>
            <div style={{ ...fontBody, color: deactivated ? T.slateSoft : T.rust, fontWeight: 700, fontSize: 13 }}>
              {deactivated ? "Account deactivated" : "Deactivate account"}
            </div>
            <div style={{ ...fontBody, color: T.slate, fontSize: 12.5, marginTop: 2 }}>
              {deactivated ? "Contact an administrator to reactivate your access." : "You'll lose access to MEDHA until an administrator reactivates your account."}
            </div>
          </div>
        </div>
        <button
          onClick={deactivateAccount}
          disabled={deactivated}
          className="px-4 py-2.5 rounded-lg text-[12.5px] font-semibold shrink-0"
          style={{ background: deactivated ? T.hair : T.rust, color: deactivated ? T.slateSoft : "#fff", ...fontBody, cursor: deactivated ? "default" : "pointer" }}
        >
          {deactivated ? "Deactivated" : "Deactivate"}
        </button>
      </div>

      <Modal
        open={pwModalOpen}
        title="Change password"
        onClose={() => {
          setPwModalOpen(false);
          setPwError(null);
        }}
        footer={
          <>
            <button
              onClick={() => {
                setPwModalOpen(false);
                setPwError(null);
              }}
              className="px-4 py-2.5 rounded-lg text-[13px] font-semibold"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            >
              Cancel
            </button>
            <button onClick={savePassword} className="px-4 py-2.5 rounded-lg text-[13px] font-semibold" style={{ background: T.brass, color: "#fff", ...fontBody }}>
              Update password
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>Current password</label>
            <input
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            />
          </div>
          <div>
            <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>New password</label>
            <input
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            />
          </div>
          <div>
            <label className="block text-[11.5px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>Confirm new password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg outline-none text-[13px]"
              style={{ background: "#fff", border: `1px solid ${T.hair}`, ...fontBody, color: T.slate }}
            />
          </div>
        </div>
        {pwError && <div className="mt-4 text-[12.5px]" style={{ ...fontBody, color: T.rust }}>{pwError}</div>}
      </Modal>
    </div>
  );
}
