import type { MasterCategoryKey, MasterEntry } from "@/types";

export interface MasterCategory {
  key: MasterCategoryKey;
  label: string;
  description: string;
  codeLabel: string;
  nameLabel: string;
}

export const MASTER_CATEGORIES: MasterCategory[] = [
  {
    key: "shipmentModes",
    label: "Shipment Modes",
    description: "Modes of transport used for shipments — sea, air, road, or rail.",
    codeLabel: "Code",
    nameLabel: "Mode",
  },
  {
    key: "shipmentTypes",
    label: "Shipment Types",
    description: "Classification of shipment flow — import, export, re-export, or transshipment.",
    codeLabel: "Code",
    nameLabel: "Type",
  },
  {
    key: "locations",
    label: "Locations",
    description: "Cities and locations referenced across jobs and shipments.",
    codeLabel: "Code",
    nameLabel: "Location",
  },
  {
    key: "portCodes",
    label: "Port Codes",
    description: "Port and terminal codes used for customs and logistics documentation.",
    codeLabel: "Port Code",
    nameLabel: "Port Name",
  },
  {
    key: "billingCustomers",
    label: "Billing Customers",
    description: "Customers billed for invoice extraction and processing services.",
    codeLabel: "Code",
    nameLabel: "Customer",
  },
  {
    key: "importersExporters",
    label: "Importers / Exporters",
    description: "Registered importer and exporter entities (IEC holders).",
    codeLabel: "Code",
    nameLabel: "Entity Name",
  },
];

export const MASTER_DATA: Record<MasterCategoryKey, MasterEntry[]> = {
  shipmentModes: [
    { id: "sm-sea", code: "SEA", name: "Sea Freight", status: "Active" },
    { id: "sm-air", code: "AIR", name: "Air Freight", status: "Active" },
    { id: "sm-road", code: "ROAD", name: "Road Transport", status: "Active" },
    { id: "sm-rail", code: "RAIL", name: "Rail Transport", status: "Inactive" },
  ],
  shipmentTypes: [
    { id: "st-imp", code: "IMP", name: "Import", status: "Active" },
    { id: "st-exp", code: "EXP", name: "Export", status: "Active" },
    { id: "st-reexp", code: "REEXP", name: "Re-export", status: "Active" },
    { id: "st-trans", code: "TRANS", name: "Transshipment", status: "Inactive" },
  ],
  locations: [
    { id: "loc-maa", code: "MAA", name: "Chennai", status: "Active" },
    { id: "loc-bom", code: "BOM", name: "Mumbai", status: "Active" },
    { id: "loc-nsa", code: "NSA", name: "Nhava Sheva", status: "Active" },
    { id: "loc-ccu", code: "CCU", name: "Kolkata", status: "Active" },
    { id: "loc-cok", code: "COK", name: "Cochin", status: "Inactive" },
  ],
  portCodes: [
    { id: "pc-inmaa1", code: "INMAA1", name: "Chennai Sea Port", status: "Active" },
    { id: "pc-innsa1", code: "INNSA1", name: "Nhava Sheva Port", status: "Active" },
    { id: "pc-inbom4", code: "INBOM4", name: "Mumbai Air Cargo", status: "Active" },
    { id: "pc-inccu1", code: "INCCU1", name: "Kolkata Port", status: "Inactive" },
  ],
  billingCustomers: [
    { id: "bc-orion", code: "BC-1001", name: "Orion Manufacturing Ltd.", status: "Active" },
    { id: "bc-vantage", code: "BC-1002", name: "Vantage Industrial Corp", status: "Active" },
    { id: "bc-northgate", code: "BC-1003", name: "Northgate Automotive Pvt Ltd", status: "Active" },
  ],
  importersExporters: [
    { id: "ie-transorion", code: "IEC-0456123", name: "Transorion Logistics Pvt Ltd", status: "Active" },
    { id: "ie-orion", code: "IEC-0456124", name: "Orion Manufacturing Ltd.", status: "Active" },
    { id: "ie-harbor", code: "IEC-0456125", name: "Harborline Electronics", status: "Inactive" },
  ],
};
