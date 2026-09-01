import type { Role } from "@/types";
import { createEmptyPermissions, createFullPermissions } from "./permissions";

function permissionsFor(overrides: Record<string, Partial<Record<"view" | "create" | "edit" | "delete", boolean>>>) {
  const base = createEmptyPermissions();
  for (const [key, actions] of Object.entries(overrides)) {
    base[key] = { ...base[key], ...actions };
  }
  return base;
}

export const ROLES: Role[] = [
  {
    id: "role-administrator",
    name: "Administrator",
    description: "Full system access — users, master data, configuration, audit",
    permissions: createFullPermissions(),
  },
  {
    id: "role-operational-user",
    name: "Operational User",
    description: "Create jobs, upload invoices, review & correct, export",
    permissions: permissionsFor({
      dashboard: { view: true },
      jobs: { view: true, create: true, edit: true },
      createJob: { view: true, create: true },
      exports: { view: true, create: true },
      notifications: { view: true },
    }),
  },
  {
    id: "role-reviewer",
    name: "Reviewer / Approver",
    description: "Review extracted data, verify corrections, approve export",
    permissions: permissionsFor({
      dashboard: { view: true },
      jobs: { view: true, edit: true },
      exports: { view: true },
      notifications: { view: true },
      auditLogs: { view: true },
    }),
  },
];
