import type { Job } from "@/types";

export const JOB_STATUSES = ["All", "Completed", "Processing", "Validation Required", "Queued", "Failed"] as const;
export type JobStatusFilter = (typeof JOB_STATUSES)[number];

export const JOBS: Job[] = [
  { id: "JOB-000123", shipment: "SHP-88213", invoices: 4, forwarder: "Orient Star Freight", created: "24 Aug 2026", stage: 5, status: "Validation Required" },
  { id: "JOB-000124", shipment: "SHP-88220", invoices: 1, forwarder: "Meridian Cargo", created: "24 Aug 2026", stage: 6, status: "Completed" },
  { id: "JOB-000125", shipment: "SHP-88231", invoices: 7, forwarder: "Blue Harbor Logistics", created: "25 Aug 2026", stage: 3, status: "Processing" },
  { id: "JOB-000126", shipment: "SHP-88240", invoices: 2, forwarder: "Orient Star Freight", created: "25 Aug 2026", stage: 2, status: "Queued" },
  { id: "JOB-000127", shipment: "SHP-88245", invoices: 3, forwarder: "TransPacific Line", created: "26 Aug 2026", stage: 4, status: "Failed" },
  { id: "JOB-000128", shipment: "SHP-88251", invoices: 5, forwarder: "Blue Harbor Logistics", created: "26 Aug 2026", stage: 6, status: "Completed" },
  { id: "JOB-000129", shipment: "SHP-88254", invoices: 2, forwarder: "Meridian Cargo", created: "26 Aug 2026", stage: 1, status: "Queued" },
  { id: "JOB-000130", shipment: "SHP-88259", invoices: 6, forwarder: "Orient Star Freight", created: "26 Aug 2026", stage: 5, status: "Validation Required" },
  { id: "JOB-000131", shipment: "SHP-88262", invoices: 1, forwarder: "TransPacific Line", created: "25 Aug 2026", stage: 6, status: "Completed" },
  { id: "JOB-000132", shipment: "SHP-88266", invoices: 3, forwarder: "Cargo Alliance Group", created: "25 Aug 2026", stage: 3, status: "Processing" },
];
