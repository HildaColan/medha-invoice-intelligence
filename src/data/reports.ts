import type { DailyJobStat, DownloadableDataset, UserActivityReportRow } from "@/types";
import { CUSTOMERS } from "./customers";
import { USERS } from "./users";
import { JOBS } from "./jobs";
import { JOB_INVOICES } from "./jobInvoices";

// Original 8 rows (uar-1..uar-8) span 24-26 Aug 2026; uar-9..uar-26 below extend
// coverage back to 29 Jun 2026 (one row roughly every 3 days) so the Date & Time
// tab's per-user table isn't empty across most of the extended DAILY_JOB_STATS range.
export const USER_ACTIVITY_REPORT: UserActivityReportRow[] = [
  { id: "uar-1", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000123", date: "24 Aug 2026", dateIso: "2026-08-24", startTime: "09:12", completionTime: "11:40", turnaround: "2h 28m", recordsProcessed: 4, rework: false, lastActivity: "Export Generated", status: "Completed" },
  { id: "uar-2", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000124", date: "24 Aug 2026", dateIso: "2026-08-24", startTime: "10:05", completionTime: "12:02", turnaround: "1h 57m", recordsProcessed: 1, rework: false, lastActivity: "Validation Approved", status: "Completed" },
  { id: "uar-3", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000125", date: "25 Aug 2026", dateIso: "2026-08-25", startTime: "08:40", completionTime: "—", turnaround: "—", recordsProcessed: 7, rework: true, lastActivity: "Data Modification", status: "Pending" },
  { id: "uar-4", user: "Suresh Iyer", role: "CS", jobNumber: "JOB-000126", date: "25 Aug 2026", dateIso: "2026-08-25", startTime: "13:20", completionTime: "14:05", turnaround: "45m", recordsProcessed: 2, rework: false, lastActivity: "Job Creation", status: "Completed" },
  { id: "uar-5", user: "Meena Pillai", role: "HOD", jobNumber: "JOB-000131", date: "25 Aug 2026", dateIso: "2026-08-25", startTime: "16:30", completionTime: "18:22", turnaround: "1h 52m", recordsProcessed: 1, rework: false, lastActivity: "Validation Approved", status: "Completed" },
  { id: "uar-6", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000127", date: "26 Aug 2026", dateIso: "2026-08-26", startTime: "09:00", completionTime: "—", turnaround: "—", recordsProcessed: 3, rework: true, lastActivity: "OCR Processing Failed", status: "Rework" },
  { id: "uar-7", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000132", date: "25 Aug 2026", dateIso: "2026-08-25", startTime: "11:15", completionTime: "12:48", turnaround: "1h 33m", recordsProcessed: 3, rework: false, lastActivity: "Product Master Updated", status: "Completed" },
  { id: "uar-8", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000130", date: "26 Aug 2026", dateIso: "2026-08-26", startTime: "07:55", completionTime: "09:30", turnaround: "1h 35m", recordsProcessed: 6, rework: false, lastActivity: "Export Generated", status: "Completed" },
  { id: "uar-9", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000091", date: "29 Jun 2026", dateIso: "2026-06-29", startTime: "08:00", completionTime: "08:30", turnaround: "30m", recordsProcessed: 1, rework: false, lastActivity: "Export Generated", status: "Completed" },
  { id: "uar-10", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000092", date: "02 Jul 2026", dateIso: "2026-07-02", startTime: "09:07", completionTime: "09:54", turnaround: "47m", recordsProcessed: 2, rework: false, lastActivity: "Validation Approved", status: "Completed" },
  { id: "uar-11", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000093", date: "05 Jul 2026", dateIso: "2026-07-05", startTime: "10:14", completionTime: "11:18", turnaround: "1h 4m", recordsProcessed: 3, rework: false, lastActivity: "Data Modification", status: "Completed" },
  { id: "uar-12", user: "Suresh Iyer", role: "CS", jobNumber: "JOB-000094", date: "08 Jul 2026", dateIso: "2026-07-08", startTime: "11:21", completionTime: "12:42", turnaround: "1h 21m", recordsProcessed: 4, rework: false, lastActivity: "Job Creation", status: "Completed" },
  { id: "uar-13", user: "Meena Pillai", role: "HOD", jobNumber: "JOB-000095", date: "11 Jul 2026", dateIso: "2026-07-11", startTime: "12:28", completionTime: "—", turnaround: "—", recordsProcessed: 5, rework: true, lastActivity: "OCR Processing Failed", status: "Rework" },
  { id: "uar-14", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000096", date: "14 Jul 2026", dateIso: "2026-07-14", startTime: "13:35", completionTime: "15:30", turnaround: "1h 55m", recordsProcessed: 6, rework: false, lastActivity: "Product Master Updated", status: "Completed" },
  { id: "uar-15", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000097", date: "17 Jul 2026", dateIso: "2026-07-17", startTime: "14:42", completionTime: "—", turnaround: "—", recordsProcessed: 7, rework: false, lastActivity: "Export Generated", status: "Pending" },
  { id: "uar-16", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000098", date: "20 Jul 2026", dateIso: "2026-07-20", startTime: "15:49", completionTime: "18:18", turnaround: "2h 29m", recordsProcessed: 1, rework: false, lastActivity: "Validation Approved", status: "Completed" },
  { id: "uar-17", user: "Suresh Iyer", role: "CS", jobNumber: "JOB-000099", date: "23 Jul 2026", dateIso: "2026-07-23", startTime: "08:56", completionTime: "11:42", turnaround: "2h 46m", recordsProcessed: 2, rework: false, lastActivity: "Data Modification", status: "Completed" },
  { id: "uar-18", user: "Meena Pillai", role: "HOD", jobNumber: "JOB-000100", date: "26 Jul 2026", dateIso: "2026-07-26", startTime: "09:03", completionTime: "—", turnaround: "—", recordsProcessed: 3, rework: true, lastActivity: "Job Creation", status: "Rework" },
  { id: "uar-19", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000101", date: "29 Jul 2026", dateIso: "2026-07-29", startTime: "10:10", completionTime: "11:00", turnaround: "50m", recordsProcessed: 4, rework: false, lastActivity: "OCR Processing Failed", status: "Completed" },
  { id: "uar-20", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000102", date: "01 Aug 2026", dateIso: "2026-08-01", startTime: "11:17", completionTime: "12:24", turnaround: "1h 7m", recordsProcessed: 5, rework: false, lastActivity: "Product Master Updated", status: "Completed" },
  { id: "uar-21", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000103", date: "04 Aug 2026", dateIso: "2026-08-04", startTime: "12:24", completionTime: "13:48", turnaround: "1h 24m", recordsProcessed: 6, rework: false, lastActivity: "Export Generated", status: "Completed" },
  { id: "uar-22", user: "Suresh Iyer", role: "CS", jobNumber: "JOB-000104", date: "07 Aug 2026", dateIso: "2026-08-07", startTime: "13:31", completionTime: "—", turnaround: "—", recordsProcessed: 7, rework: false, lastActivity: "Validation Approved", status: "Pending" },
  { id: "uar-23", user: "Meena Pillai", role: "HOD", jobNumber: "JOB-000105", date: "10 Aug 2026", dateIso: "2026-08-10", startTime: "14:38", completionTime: "—", turnaround: "—", recordsProcessed: 1, rework: true, lastActivity: "Data Modification", status: "Rework" },
  { id: "uar-24", user: "Arun Kumar", role: "KAM", jobNumber: "JOB-000106", date: "13 Aug 2026", dateIso: "2026-08-13", startTime: "15:45", completionTime: "18:00", turnaround: "2h 15m", recordsProcessed: 2, rework: false, lastActivity: "Job Creation", status: "Completed" },
  { id: "uar-25", user: "Divya Menon", role: "HOD", jobNumber: "JOB-000107", date: "16 Aug 2026", dateIso: "2026-08-16", startTime: "08:52", completionTime: "11:24", turnaround: "2h 32m", recordsProcessed: 3, rework: false, lastActivity: "OCR Processing Failed", status: "Completed" },
  { id: "uar-26", user: "Karthik Subramaniam", role: "DC", jobNumber: "JOB-000108", date: "19 Aug 2026", dateIso: "2026-08-19", startTime: "09:59", completionTime: "12:48", turnaround: "2h 49m", recordsProcessed: 4, rework: false, lastActivity: "Product Master Updated", status: "Completed" },
];

// 29 Jun - 26 Aug 2026 (59 days), starting on a Monday so Weekly buckets align
// cleanly. The original 7 rows (20-26 Aug) keep their exact values so the default
// Daily view is unchanged; everything before that is new, synthetic history.
export const DAILY_JOB_STATS: DailyJobStat[] = [
  { day: "29 Jun", date: "2026-06-29", completed: 4, pending: 1 },
  { day: "30 Jun", date: "2026-06-30", completed: 5, pending: 2 },
  { day: "01 Jul", date: "2026-07-01", completed: 6, pending: 3 },
  { day: "02 Jul", date: "2026-07-02", completed: 7, pending: 1 },
  { day: "03 Jul", date: "2026-07-03", completed: 8, pending: 2 },
  { day: "04 Jul", date: "2026-07-04", completed: 4, pending: 1 },
  { day: "05 Jul", date: "2026-07-05", completed: 2, pending: 0 },
  { day: "06 Jul", date: "2026-07-06", completed: 6, pending: 2 },
  { day: "07 Jul", date: "2026-07-07", completed: 7, pending: 3 },
  { day: "08 Jul", date: "2026-07-08", completed: 8, pending: 1 },
  { day: "09 Jul", date: "2026-07-09", completed: 4, pending: 2 },
  { day: "10 Jul", date: "2026-07-10", completed: 5, pending: 3 },
  { day: "11 Jul", date: "2026-07-11", completed: 2, pending: 0 },
  { day: "12 Jul", date: "2026-07-12", completed: 3, pending: 1 },
  { day: "13 Jul", date: "2026-07-13", completed: 8, pending: 3 },
  { day: "14 Jul", date: "2026-07-14", completed: 4, pending: 1 },
  { day: "15 Jul", date: "2026-07-15", completed: 5, pending: 2 },
  { day: "16 Jul", date: "2026-07-16", completed: 6, pending: 3 },
  { day: "17 Jul", date: "2026-07-17", completed: 7, pending: 1 },
  { day: "18 Jul", date: "2026-07-18", completed: 3, pending: 1 },
  { day: "19 Jul", date: "2026-07-19", completed: 4, pending: 0 },
  { day: "20 Jul", date: "2026-07-20", completed: 5, pending: 1 },
  { day: "21 Jul", date: "2026-07-21", completed: 6, pending: 2 },
  { day: "22 Jul", date: "2026-07-22", completed: 7, pending: 3 },
  { day: "23 Jul", date: "2026-07-23", completed: 8, pending: 1 },
  { day: "24 Jul", date: "2026-07-24", completed: 4, pending: 2 },
  { day: "25 Jul", date: "2026-07-25", completed: 4, pending: 0 },
  { day: "26 Jul", date: "2026-07-26", completed: 2, pending: 1 },
  { day: "27 Jul", date: "2026-07-27", completed: 7, pending: 2 },
  { day: "28 Jul", date: "2026-07-28", completed: 8, pending: 3 },
  { day: "29 Jul", date: "2026-07-29", completed: 4, pending: 1 },
  { day: "30 Jul", date: "2026-07-30", completed: 5, pending: 2 },
  { day: "31 Jul", date: "2026-07-31", completed: 6, pending: 3 },
  { day: "01 Aug", date: "2026-08-01", completed: 2, pending: 1 },
  { day: "02 Aug", date: "2026-08-02", completed: 3, pending: 0 },
  { day: "03 Aug", date: "2026-08-03", completed: 4, pending: 3 },
  { day: "04 Aug", date: "2026-08-04", completed: 5, pending: 1 },
  { day: "05 Aug", date: "2026-08-05", completed: 6, pending: 2 },
  { day: "06 Aug", date: "2026-08-06", completed: 7, pending: 3 },
  { day: "07 Aug", date: "2026-08-07", completed: 8, pending: 1 },
  { day: "08 Aug", date: "2026-08-08", completed: 3, pending: 0 },
  { day: "09 Aug", date: "2026-08-09", completed: 4, pending: 1 },
  { day: "10 Aug", date: "2026-08-10", completed: 6, pending: 1 },
  { day: "11 Aug", date: "2026-08-11", completed: 7, pending: 2 },
  { day: "12 Aug", date: "2026-08-12", completed: 8, pending: 3 },
  { day: "13 Aug", date: "2026-08-13", completed: 4, pending: 1 },
  { day: "14 Aug", date: "2026-08-14", completed: 5, pending: 2 },
  { day: "15 Aug", date: "2026-08-15", completed: 4, pending: 1 },
  { day: "16 Aug", date: "2026-08-16", completed: 2, pending: 0 },
  { day: "17 Aug", date: "2026-08-17", completed: 8, pending: 2 },
  { day: "18 Aug", date: "2026-08-18", completed: 4, pending: 3 },
  { day: "19 Aug", date: "2026-08-19", completed: 5, pending: 1 },
  { day: "20 Aug", date: "2026-08-20", completed: 4, pending: 1 },
  { day: "21 Aug", date: "2026-08-21", completed: 5, pending: 2 },
  { day: "22 Aug", date: "2026-08-22", completed: 3, pending: 1 },
  { day: "23 Aug", date: "2026-08-23", completed: 6, pending: 0 },
  { day: "24 Aug", date: "2026-08-24", completed: 7, pending: 2 },
  { day: "25 Aug", date: "2026-08-25", completed: 5, pending: 3 },
  { day: "26 Aug", date: "2026-08-26", completed: 8, pending: 1 },
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

/**
 * Sample file entries for the document-manifest exports (Original/Corrected
 * Documents, Supporting Attachments, Other Records — Reports "Master Data" tab).
 * Mirrors the shape of CreateJobView's local MOCK_FILES but is a separate array —
 * this build has no real file storage, so manifests are cycled from this fixture
 * per job. TODO(BE): replace with actual file download endpoint.
 */
export interface MockDocumentFile {
  name: string;
  size: string;
  kind: string;
}

export const MOCK_DOCUMENT_FILES: MockDocumentFile[] = [
  { name: "invoice_001.pdf", size: "482 KB", kind: "Searchable" },
  { name: "invoice_002.pdf", size: "1.1 MB", kind: "Scanned" },
  { name: "invoice_003.pdf", size: "356 KB", kind: "Searchable" },
];
