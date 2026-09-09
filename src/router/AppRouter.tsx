import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { LoginView } from "@/features/auth/LoginView";
import { isAuthenticated } from "@/features/auth/authStore";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { JobsView } from "@/features/jobs/JobsView";
import { CreateJobView } from "@/features/jobs/CreateJobView";
import { JobDetailView } from "@/features/jobs/JobDetailView";
import { ExportsView } from "@/features/exports/ExportsView";
import { NotificationsView } from "@/features/notifications/NotificationsView";
import { ReportsView } from "@/features/reports/ReportsView";
import { AdministrationView } from "@/features/administration/AdministrationView";
import { ProfileView } from "@/features/profile/ProfileView";
import { paths } from "./paths";

function RequireAuth() {
  if (!isAuthenticated()) return <Navigate to={paths.login} replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: paths.login, element: <LoginView /> },
  {
    element: <RequireAuth />,
    children: [
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
          { path: paths.reports, element: <ReportsView /> },
          { path: "/administration", element: <Navigate to={paths.administration("users")} replace /> },
          { path: "/administration/:view", element: <AdministrationView /> },
          { path: paths.profile, element: <ProfileView /> },
          { path: "*", element: <Navigate to={paths.dashboard} replace /> },
        ],
      },
    ],
  },
]);
