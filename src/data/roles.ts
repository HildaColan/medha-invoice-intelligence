import type { Role } from "@/types";

export const ROLES: Role[] = [
  { id: "role-administrator", name: "Administrator", description: "Full system access — users, master data, configuration, audit" },
  { id: "role-operational-user", name: "Operational User", description: "Create jobs, upload invoices, review & correct, export" },
  { id: "role-reviewer", name: "Reviewer / Approver", description: "Review extracted data, verify corrections, approve export" },
];
