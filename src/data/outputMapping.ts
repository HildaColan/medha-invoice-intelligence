import type { OutputTemplate } from "@/types";

export const OUTPUT_TEMPLATES: OutputTemplate[] = [
  {
    id: "tmpl-focus-erp",
    name: "Focus ERP",
    createdAt: "12 Jul 2026",
    createdBy: "Priya Raghavan",
    fields: [
      { id: "tmpl-focus-erp-f1", internalField: "invoiceNumber", outputField: "Invoice No." },
      { id: "tmpl-focus-erp-f2", internalField: "invoiceDate", outputField: "Invoice Date" },
    ],
  },
  {
    id: "tmpl-logysis",
    name: "Logysis",
    createdAt: "18 Jul 2026",
    createdBy: "Arun Kumar",
    fields: [
      { id: "tmpl-logysis-f1", internalField: "hsnCode", outputField: "HSN/CTH" },
      { id: "tmpl-logysis-f2", internalField: "unitPrice", outputField: "Unit Price" },
    ],
  },
  {
    id: "tmpl-icafe-icare",
    name: "iCafe / ICare",
    createdAt: "02 Aug 2026",
    createdBy: "Priya Raghavan",
    fields: [
      { id: "tmpl-icafe-icare-f1", internalField: "supplierName", outputField: "Supplier Name" },
    ],
  },
];
