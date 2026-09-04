import type { DailyJobStat, DownloadableDataset, UserActivityReportRow } from "@/types";
import { CUSTOMERS } from "./customers";
import { USERS } from "./users";
import { JOBS } from "./jobs";
import { JOB_INVOICES } from "./jobInvoices";

export const USER_ACTIVITY_REPORT: UserActivityReportRow[] = [
  { id: "uar-1", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000123", date: "24 Aug 2026", startTime: "09:12", completionTime: "11:40", turnaround: "2h 28m", recordsProcessed: 4, rework: false, lastActivity: "Export Generated", status: "Completed" },
  { id: "uar-2", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000124", date: "24 Aug 2026", startTime: "10:05", completionTime: "12:02", turnaround: "1h 57m", recordsProcessed: 1, rework: false, lastActivity: "Validation Approved", status: "Completed" },
  { id: "uar-3", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000125", date: "25 Aug 2026", startTime: "08:40", completionTime: "—", turnaround: "—", recordsProcessed: 7, rework: true, lastActivity: "Data Modification", status: "Pending" },
  { id: "uar-4", user: "Suresh Iyer", role: "CS", jobNumber: "JOB-000126", date: "25 Aug 2026", startTime: "13:20", completionTime: "14:05", turnaround: "45m", recordsProcessed: 2, rework: false, lastActivity: "Job Creation", status: "Completed" },
  { id: "uar-5", user: "Meena Pillai", role: "HOD", jobNumber: "JOB-000131", date: "25 Aug 2026", startTime: "16:30", completionTime: "18:22", turnaround: "1h 52m", recordsProcessed: 1, rework: false, lastActivity: "Validation Approved", status: "Completed" },
  { id: "uar-6", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000127", date: "26 Aug 2026", startTime: "09:00", completionTime: "—", turnaround: "—", recordsProcessed: 3, rework: true, lastActivity: "OCR Processing Failed", status: "Rework" },
  { id: "uar-7", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000132", date: "25 Aug 2026", startTime: "11:15", completionTime: "12:48", turnaround: "1h 33m", recordsProcessed: 3, rework: false, lastActivity: "Product Master Updated", status: "Completed" },
  { id: "uar-8", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000130", date: "26 Aug 2026", startTime: "07:55", completionTime: "09:30", turnaround: "1h 35m", recordsProcessed: 6, rework: false, lastActivity: "Export Generated", status: "Completed" },
];

export const DAILY_JOB_STATS: DailyJobStat[] = [
  { day: "20 Aug", completed: 4, pending: 1 },
  { day: "21 Aug", completed: 5, pending: 2 },
  { day: "22 Aug", completed: 3, pending: 1 },
  { day: "23 Aug", completed: 6, pending: 0 },
  { day: "24 Aug", completed: 7, pending: 2 },
  { day: "25 Aug", completed: 5, pending: 3 },
  { day: "26 Aug", completed: 8, pending: 1 },
];

export const DOWNLOADABLE_DATASETS: DownloadableDataset[] = [
  { id: "ds-customer-master", name: "Customer Master", description: "All customer records with billing and contact details.", recordCount: CUSTOMERS.length },
  { id: "ds-user-master", name: "User Master", description: "All user accounts, roles, and status.", recordCount: USERS.length },
  { id: "ds-job-master", name: "Job Master", description: "All jobs with shipment, forwarder, and pipeline stage.", recordCount: JOBS.length },
  { id: "ds-invoice-master", name: "Invoice Master", description: "Invoice numbers captured across jobs, including duplicates.", recordCount: JOB_INVOICES.length },
  { id: "ds-extracted-data", name: "Extracted Data", description: "Field-level data extracted from uploaded invoices." },
  { id: "ds-transaction-details", name: "Transaction Details", description: "Line-item level transaction records." },
  { id: "ds-original-documents", name: "Original Uploaded Documents", description: "Source PDFs as uploaded, before extraction." },
  { id: "ds-corrected-documents", name: "Corrected / Updated Documents", description: "Documents after manual correction." },
  { id: "ds-supporting-attachments", name: "Supporting Attachments", description: "Additional attachments linked to a job." },
  { id: "ds-other-records", name: "Other System-Generated Records", description: "Any other record generated automatically by MEDHA." },
];
