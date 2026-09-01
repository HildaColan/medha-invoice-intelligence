import { Briefcase, Building2, Camera, Clock, FileCheck2, FileOutput, MapPin } from "lucide-react";
import { T, fontBody, fontDisplay, fontMono } from "@/theme/tokens";
import { Field, SectionHeading, StatCard, Td, Th, useToast } from "@/components/ui";

const CURRENT_USER_NAME = "Priya Raghavan";

const ACTIVITY_STATS = [
  { icon: Briefcase, label: "Jobs created", value: "38", accent: T.brass },
  { icon: FileOutput, label: "Exports generated", value: "19", accent: T.teal },
  { icon: FileCheck2, label: "Validations approved", value: "112", accent: T.slate },
] as const;

export function ProfileView() {
  const notify = useToast();

  return (
    <div className="px-8 py-7">
      <SectionHeading eyebrow="MY PROFILE" title={CURRENT_USER_NAME} />

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Identity card */}
        <div className="col-span-1 rounded-2xl p-6 flex flex-col items-center text-center" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-[24px] font-semibold" style={{ background: T.brass, color: "#fff", ...fontDisplay }}>
              PR
            </div>
            <button
              onClick={() => notify("Photo upload isn't available in this preview.")}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: T.ink, border: `2px solid ${T.card}` }}
            >
              <Camera size={12} color="#fff" />
            </button>
          </div>
          <div style={{ ...fontDisplay, color: T.ink, fontSize: 17, fontWeight: 600, marginTop: 14 }}>{CURRENT_USER_NAME}</div>
          <div style={{ ...fontMono, color: T.slateSoft, fontSize: 11, marginTop: 2 }}>admin@transorion.com</div>
          <span className="mt-3 px-2.5 py-1 rounded-full text-[10.5px] font-semibold" style={{ ...fontMono, background: T.tealSoft, color: T.teal }}>
            Administrator
          </span>
          <div className="w-full mt-5 pt-5 flex flex-col gap-2.5" style={{ borderTop: `1px solid ${T.hair}` }}>
            <span className="flex items-center gap-2 text-[12px]" style={{ ...fontBody, color: T.slate }}>
              <Building2 size={13.5} color={T.slateSoft} /> Transorion Logistics Pvt. Ltd.
            </span>
            <span className="flex items-center gap-2 text-[12px]" style={{ ...fontBody, color: T.slate }}>
              <MapPin size={13.5} color={T.slateSoft} /> Chennai, India
            </span>
            <span className="flex items-center gap-2 text-[12px]" style={{ ...fontBody, color: T.slate }}>
              <Clock size={13.5} color={T.slateSoft} /> Joined 12 Mar 2024
            </span>
          </div>
        </div>

        {/* Editable details */}
        <div className="col-span-2 rounded-2xl p-6" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
          <div className="flex items-center justify-between mb-5">
            <div style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>Personal details</div>
            <button
              onClick={() => notify("Profile updated.")}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              Save changes
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name" value="Priya Raghavan" />
            <Field label="Job title" value="Trade Operations Lead" />
            <Field label="Email address" value="admin@transorion.com" mono />
            <Field label="Phone number" value="+91 98400 12345" mono />
            {/* <Field label="Department" value="Trade Compliance" /> */}
            <Field label="Role" value="Administrator" disabled />
          </div>
        </div>
      </div>

      {/* <SectionHeading title="Activity summary" />
      <div className="flex gap-4 flex-wrap mb-6">
        {ACTIVITY_STATS.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} accent={s.accent} />
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
        <div className="px-6 pt-5 pb-4">
          <div style={{ ...fontDisplay, color: T.ink, fontSize: 15.5, fontWeight: 600 }}>Recent activity</div>
          <div style={{ ...fontBody, color: T.slateSoft, fontSize: 12 }}>Your latest actions across MEDHA</div>
        </div>
        <table className="w-full">
          <thead>
            <tr><Th>Action</Th><Th>Reference</Th><Th>Timestamp</Th></tr>
          </thead>
          <tbody>
            {AUDIT.filter((a) => a.user === CURRENT_USER_NAME).map((a, i) => (
              <tr key={i}>
                <Td>{a.action}</Td>
                <Td mono>{a.ref}</Td>
                <Td mono>{a.time}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
