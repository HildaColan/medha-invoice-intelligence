import type { AppUser } from "@/types";

export const USERS: AppUser[] = [
  { name: "Priya Raghavan", email: "priya.r@transorion.com", role: "Administrator", status: "Active" },
  { name: "Arun Kumar", email: "arun.k@transorion.com", role: "Operational User", status: "Active" },
  { name: "Divya Menon", email: "divya.m@transorion.com", role: "Reviewer", status: "Active" },
  { name: "Suresh Iyer", email: "suresh.i@transorion.com", role: "Operational User", status: "Deactivated" },
  { name: "Karthik Subramaniam", email: "karthik.s@transorion.com", role: "Operational User", status: "Active" },
  { name: "Meena Pillai", email: "meena.p@transorion.com", role: "Reviewer", status: "Active" },
];
