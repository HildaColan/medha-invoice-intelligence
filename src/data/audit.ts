import type { AuditEntry } from "@/types";

export const AUDIT: AuditEntry[] = [
  { user: "Priya Raghavan", action: "Export Generated", ref: "JOB-000124", time: "24 Aug 2026, 16:02" },
  { user: "Arun Kumar", action: "Data Modification", ref: "INV-10041, Line 3", time: "24 Aug 2026, 15:41" },
  { user: "System", action: "Job Creation", ref: "JOB-000127", time: "26 Aug 2026, 09:10" },
  { user: "Meena Pillai", action: "Validation Approved", ref: "JOB-000131", time: "25 Aug 2026, 18:22" },
  { user: "System", action: "OCR Processing Failed", ref: "JOB-000127, invoice_003.pdf", time: "26 Aug 2026, 09:47" },
  { user: "Karthik Subramaniam", action: "Product Master Updated", ref: "214 records", time: "26 Aug 2026, 11:03" },
];
