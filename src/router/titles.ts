/**
 * Resolves the current route to the short breadcrumb title shown in the
 * Topbar (e.g. "MEDHA / Dashboard"), mirroring the original `titles` map.
 */
export function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  if (pathname === "/jobs") return "Jobs";
  if (pathname === "/jobs/new") return "Create Job";
  if (pathname.endsWith("/edit")) return `Edit ${pathname.split("/")[2] ?? "Job"}`;
  if (pathname.startsWith("/jobs/")) return pathname.split("/").pop() ?? "Job";
  if (pathname === "/exports") return "Exports";
  if (pathname === "/notifications") return "Notifications";
  if (pathname.startsWith("/administration")) return "Administration";
  if (pathname === "/profile") return "My Profile";
  if (pathname === "/account-settings") return "Account Settings";
  return "MEDHA";
}
