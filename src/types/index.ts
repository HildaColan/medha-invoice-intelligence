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

export interface AuditEntry {
  user: string;
  action: string;
  ref: string;
  time: string;
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
  | "masters"
  | "validationRules"
  | "outputMapping"
  | "auditLogs";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Session {
  id: string;
  device: string;
  loc: string;
  time: string;
  current: boolean;
}

export interface NotificationPreferences {
  jobComplete: boolean;
  jobFailed: boolean;
  exportReady: boolean;
  weeklyDigest: boolean;
}
