import type { AdminViewKey } from "@/types";

export const paths = {
  login: "/login",
  dashboard: "/",
  jobs: "/jobs",
  createJob: "/jobs/new",
  jobDetail: (id: string) => `/jobs/${id}`,
  jobEdit: (id: string) => `/jobs/${id}/edit`,
  exports: "/exports",
  notifications: "/notifications",
  reports: "/reports",
  administration: (view: AdminViewKey = "users") => `/administration/${view}`,
  profile: "/profile",
} as const;

export const ADMIN_VIEWS: AdminViewKey[] = [
  "users",
  "roles",
  "productMaster",
  "customerMaster",
  "masters",
  "validationRules",
  "outputMapping",
  "auditLogs",
];
