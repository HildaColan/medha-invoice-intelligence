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

export interface AuditEntry {
  id: string;
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

