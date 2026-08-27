import { ArrowRight } from "lucide-react";
import { T } from "@/theme/tokens";
import { Td, Th } from "@/components/ui";

const OUTPUT_MAPPINGS: Array<[string, string, string]> = [
  ["invoiceNumber", "Invoice No.", "Focus ERP"],
  ["hsnCode", "HSN/CTH", "Logysis"],
  ["supplierName", "Supplier Name", "iCafe / ICare"],
  ["invoiceDate", "Invoice Date", "Focus ERP"],
  ["unitPrice", "Unit Price", "Logysis"],
];

export function OutputMappingPanel() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.hair}` }}>
      <table className="w-full">
        <thead>
          <tr><Th>Internal field</Th><Th></Th><Th>Output field</Th><Th>Template</Th></tr>
        </thead>
        <tbody>
          {OUTPUT_MAPPINGS.map((m, i) => (
            <tr key={i}>
              <Td mono>{m[0]}</Td>
              <Td><ArrowRight size={13} color={T.slateSoft} /></Td>
              <Td mono>{m[1]}</Td>
              <Td>{m[2]}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
