import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { JobsView } from "@/features/jobs/JobsView";
import { CreateJobView } from "@/features/jobs/CreateJobView";
import { JobDetailView } from "@/features/jobs/JobDetailView";
import { ExportsView } from "@/features/exports/ExportsView";
import { NotificationsView } from "@/features/notifications/NotificationsView";
import { AdministrationView } from "@/features/administration/AdministrationView";
import { ProfileView } from "@/features/profile/ProfileView";
import { AccountSettingsView } from "@/features/account-settings/AccountSettingsView";
import { paths } from "./paths";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: paths.dashboard, element: <DashboardView /> },
      { path: paths.jobs, element: <JobsView /> },
      { path: paths.createJob, element: <CreateJobView /> },
      { path: "/jobs/:id/edit", element: <CreateJobView /> },
      { path: "/jobs/:id", element: <JobDetailView /> },
      { path: paths.exports, element: <ExportsView /> },
      { path: paths.notifications, element: <NotificationsView /> },
      { path: "/administration", element: <Navigate to={paths.administration("users")} replace /> },
      { path: "/administration/:view", element: <AdministrationView /> },
      { path: paths.profile, element: <ProfileView /> },
      { path: paths.accountSettings, element: <AccountSettingsView /> },
      { path: "*", element: <Navigate to={paths.dashboard} replace /> },
    ],
  },
]);
