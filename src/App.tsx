import { RouterProvider } from "react-router-dom";
import { router } from "@/router/AppRouter";
import { ToastProvider } from "@/components/ui";
import { AuditLogProvider } from "@/features/administration/auditLog";

export default function App() {
  return (
    <AuditLogProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuditLogProvider>
  );
}
