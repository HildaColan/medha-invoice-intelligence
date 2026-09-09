import type { ModulePermissions, PermissionAction, RolePermissions } from "@/types";

export interface PermissionModule {
  key: string;
  label: string;
  group: "General" | "Administration" | "Reports";
}

export const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete"];

export const PERMISSION_MODULES: PermissionModule[] = [
  { key: "dashboard", label: "Dashboard", group: "General" },
  { key: "jobs", label: "Jobs", group: "General" },
  { key: "createJob", label: "Create Job", group: "General" },
  { key: "exports", label: "Exports", group: "General" },
  { key: "notifications", label: "Notifications", group: "General" },
  { key: "reports", label: "Reports", group: "Reports" },
  { key: "users", label: "Users", group: "Administration" },
  { key: "roles", label: "Roles", group: "Administration" },
  { key: "productMaster", label: "Product Master", group: "Administration" },
  { key: "customerMaster", label: "Customer Master", group: "Administration" },
  { key: "masters", label: "Masters", group: "Administration" },
  { key: "validationRules", label: "Validation Rules", group: "Administration" },
  { key: "outputMapping", label: "Output Mapping", group: "Administration" },
  { key: "auditLogs", label: "Audit Logs", group: "Administration" },
];

export function emptyModulePermissions(): ModulePermissions {
  return { view: false, create: false, edit: false, delete: false };
}

export function createEmptyPermissions(): RolePermissions {
  return Object.fromEntries(PERMISSION_MODULES.map((m) => [m.key, emptyModulePermissions()]));
}

export function createFullPermissions(): RolePermissions {
  return Object.fromEntries(
    PERMISSION_MODULES.map((m) => [m.key, { view: true, create: true, edit: true, delete: true }]),
  );
}

/** View, Create & Edit on every "General" module; no access to Administration or Reports. */
export function generalAccessOnly(): RolePermissions {
  const permissions = createEmptyPermissions();
  for (const m of PERMISSION_MODULES) {
    if (m.group === "General") {
      permissions[m.key] = { view: true, create: true, edit: true, delete: false };
    }
  }
  return permissions;
}

export function grantedCount(permissions: RolePermissions): number {
  return PERMISSION_MODULES.reduce(
    (sum, m) => sum + PERMISSION_ACTIONS.filter((a) => permissions[m.key]?.[a]).length,
    0,
  );
}

export const TOTAL_PERMISSIONS = PERMISSION_MODULES.length * PERMISSION_ACTIONS.length;
