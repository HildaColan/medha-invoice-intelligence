export type JobStatus =
  | "Completed"
  | "Validation Required"
  | "Processing"
  | "Queued"
  | "Failed";

export interface Job {
  id: string;
  shipment: string;
  invoices: number;
  forwarder: string;
  created: string;
  /** 1-based index into PIPELINE_STAGES representing current stage */
  stage: number;
  status: JobStatus;
}

export type LineItemStatus = "valid" | "review";

export interface LineItem {
  line: number;
  desc: string;
  part: string;
  hsn: string;
  qty: number;
  unit: string;
  value: string;
  /** confidence percentage, 0-100 */
  conf: number;
  status: LineItemStatus;
}

export type ProductStatus = "Active" | "Unmatched";

export interface Product {
  part: string;
  model: string;
  desc: string;
  hsn: string;
  duty: string;
  status: ProductStatus;
  customer: string;
}

export type CustomerStatus = "Active" | "Inactive";

export interface Customer {
  id: string;
  name: string;
  code: string;
  gstin: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}

export type MasterEntryStatus = "Active" | "Inactive";

export interface MasterEntry {
  id: string;
  code: string;
  name: string;
  status: MasterEntryStatus;
}

export type MasterCategoryKey =
  | "forwarders"
  | "shipmentModes"
  | "shipmentTypes"
  | "locations"
  | "portCodes"
  | "billingCustomers"
  | "importersExporters";

export type ValidationRuleType = "Mandatory" | "Calculation" | "Duplicate check" | "Master validation";

export interface ValidationRule {
  id: string;
  field: string;
  ruleType: ValidationRuleType;
  condition: string;
  enabled: boolean;
  template: string;
}

export interface OutputFieldMapping {
  id: string;
  internalField: string;
  outputField: string;
}

export interface OutputTemplate {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  fields: OutputFieldMapping[];
}

export type UserStatus = "Active" | "Deactivated";

export type UserRole = string;

export interface AppUser {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type ExportStatus = "Downloaded" | "Generated";

export interface ExportRecord {
  job: string;
  file: string;
  type: string;
  by: string;
  date: string;
  status: ExportStatus;
}

export type NotificationKind = "success" | "error" | "info";

export interface AppNotification {
  title: string;
  detail: string;
  time: string;
  kind: NotificationKind;
}

export type AuditResult = "Success" | "Failed";

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  module: string;
  ref: string;
  previousValue?: string;
  updatedValue?: string;
  result: AuditResult;
  time: string;
}

/** Input to useAuditLog().logActivity — id/time are auto-filled, user/result default. */
export interface AuditLogInput {
  user?: string;
  action: string;
  module: string;
  ref?: string;
  previousValue?: string;
  updatedValue?: string;
  result?: AuditResult;
}

export type InvoiceNumberStatus = "New" | "Duplicate";

export interface JobInvoiceNumber {
  id: string;
  number: string;
  sourceFile: string;
  status: InvoiceNumberStatus;
  /** Prior job this invoice number was already seen on, when status is "Duplicate" */
  duplicateOf?: string;
}

export interface TrendPoint {
  day: string;
  jobs: number;
  docs: number;
}

export interface StatusBreakdownDatum {
  name: string;
  value: number;
  color: string;
}

export interface AccuracyDatum {
  field: string;
  accuracy: number;
}

export type AdminViewKey =
  | "users"
  | "roles"
  | "productMaster"
  | "customerMaster"
  | "masters"
  | "validationRules"
  | "outputMapping"
  | "auditLogs";

export type PermissionAction = "view" | "create" | "edit" | "delete";

export type ModulePermissions = Record<PermissionAction, boolean>;

export type RolePermissions = Record<string, ModulePermissions>;

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
}

export type ReportJobStatus = "Completed" | "Pending" | "Rework";

export interface UserActivityReportRow {
  id: string;
  user: string;
  role: string;
  jobNumber: string;
  date: string;
  /** ISO YYYY-MM-DD form of `date`, for reliable range/bucket comparisons */
  dateIso: string;
  startTime: string;
  completionTime: string;
  turnaround: string;
  recordsProcessed: number;
  rework: boolean;
  lastActivity: string;
  status: ReportJobStatus;
}

export interface DailyJobStat {
  day: string;
  /** ISO YYYY-MM-DD form of `day`, for reliable range/bucket comparisons */
  date: string;
  completed: number;
  pending: number;
}

export interface DownloadableDataset {
  id: string;
  name: string;
  description: string;
  /** Records available to export in this preview; undefined means not yet populated */
  recordCount?: number;
}

/** Row of the Date & Time tab's per-user detailed table (Part 4). */
export interface PeriodUserSummary {
  user: string;
  jobsCompleted: number;
  jobsPending: number;
  reworkCount: number;
  avgTurnaround: string;
}

/**
 * Row for the "no real files yet" manifest exports (Original/Corrected Documents,
 * Supporting Attachments, Other Records — Part 5). `source` marks the row as
 * fabricated demo data so the marker travels inside the downloaded file itself.
 * TODO(BE): replace with actual file download endpoint.
 */
export interface DocumentManifestRow {
  fileName: string;
  job: string;
  type: string;
  size: string;
  kind: string;
  date: string;
  source: string;
}

/** Flattened Job + LineItem row for the "Transaction Details" dataset export (Part 5). */
export interface TransactionDetailRow {
  jobNumber: string;
  shipment: string;
  line: number;
  desc: string;
  part: string;
  hsn: string;
  qty: number;
  unit: string;
  value: string;
  status: LineItemStatus;
}

