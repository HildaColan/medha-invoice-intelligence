import type { JobInvoiceNumber } from "@/types";

export const JOB_INVOICES: JobInvoiceNumber[] = [
  { id: "inv-10041", number: "INV-10041", sourceFile: "invoice_001.pdf", status: "New" },
  { id: "inv-10042", number: "INV-10042", sourceFile: "invoice_002.pdf", status: "New" },
  { id: "inv-10043", number: "INV-10043", sourceFile: "invoice_003.pdf", status: "New" },
  { id: "inv-10009", number: "INV-10009", sourceFile: "invoice_004.pdf", status: "Duplicate", duplicateOf: "JOB-000098" },
];
