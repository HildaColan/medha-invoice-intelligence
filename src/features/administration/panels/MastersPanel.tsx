import { ChevronRight } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";
import { useToast } from "@/components/ui";

const MASTER_DATA_ITEMS = [
  "Shipment Modes",
  "Shipment Types",
  "Locations",
  "Port Codes",
  "Billing Customers",
  "Importers / Exporters",
];

export function MastersPanel() {
  const notify = useToast();
  return (
    <div className="grid grid-cols-2 gap-4">
      {MASTER_DATA_ITEMS.map((c) => (
        <button
          key={c}
          onClick={() => notify(`Opening ${c} — manage entries here.`)}
          className="rounded-xl px-5 py-4 flex items-center justify-between text-left"
          style={{ background: T.card, border: `1px solid ${T.hair}` }}
        >
          <span style={{ ...fontBody, color: T.ink, fontSize: 13.5, fontWeight: 600 }}>{c}</span>
          <ChevronRight size={15} color={T.slateSoft} />
        </button>
      ))}
    </div>
  );
}
