import { Td, Th } from "@/components/ui";
import { T } from "@/theme/tokens";
import { AUDIT } from "@/data";

export function AuditLogsPanel() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
      <table className="w-full">
        <thead>
          <tr><Th>User</Th><Th>Action</Th><Th>Reference</Th><Th>Timestamp</Th></tr>
        </thead>
        <tbody>
          {AUDIT.map((a, i) => (
            <tr key={i}>
              <Td>{a.user}</Td>
              <Td>{a.action}</Td>
              <Td mono>{a.ref}</Td>
              <Td mono>{a.time}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
