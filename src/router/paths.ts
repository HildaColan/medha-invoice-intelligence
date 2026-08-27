import type { AdminViewKey } from "@/types";

export const paths = {
  dashboard: "/",
  jobs: "/jobs",
  createJob: "/jobs/new",
  jobDetail: (id: string) => `/jobs/${id}`,
  jobEdit: (id: string) => `/jobs/${id}/edit`,
  exports: "/exports",
  notifications: "/notifications",
  administration: (view: AdminViewKey = "users") => `/administration/${view}`,
  profile: "/profile",
  accountSettings: "/account-settings",
} as const;

export const ADMIN_VIEWS: AdminViewKey[] = [
  "users",
  "roles",
  "productMaster",
  "masters",
  "validationRules",
  "outputMapping",
  "auditLogs",
];
