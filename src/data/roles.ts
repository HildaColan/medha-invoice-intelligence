import type { Role } from "@/types";
import { createFullPermissions, generalAccessOnly } from "./permissions";

export const ROLES: Role[] = [
  {
    id: "role-director",
    name: "Director",
    description: "Admin — all rights and full access across every module",
    permissions: createFullPermissions(),
  },
  {
    id: "role-hod",
    name: "HOD",
    description: "Head of Department — view, create & edit on operational modules; no admin access",
    permissions: generalAccessOnly(),
  },
  {
    id: "role-kam",
    name: "KAM",
    description: "Key Account Management — view, create & edit on operational modules; no admin access",
    permissions: generalAccessOnly(),
  },
  {
    id: "role-cs",
    name: "CS",
    description: "Customer Support — view, create & edit on operational modules; no admin access",
    permissions: generalAccessOnly(),
  },
  {
    id: "role-dc",
    name: "DC",
    description: "Data Center — view, create & edit on operational modules; no admin access",
    permissions: generalAccessOnly(),
  },
];
