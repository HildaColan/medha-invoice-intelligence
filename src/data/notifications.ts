import type { AppNotification } from "@/types";

export const NOTIFICATIONS: AppNotification[] = [
  { title: "Job JOB-000128 completed processing", detail: "Ready for review and export.", time: "8 min ago", kind: "success" },
  { title: "Job JOB-000127 encountered a processing error", detail: "OCR timeout on invoice_003.pdf — retry required.", time: "1 hr ago", kind: "error" },
  { title: "Product master updated", detail: "214 records refreshed by Priya Raghavan.", time: "3 hr ago", kind: "info" },
  { title: "Job JOB-000131 export generated", detail: "Logysis template applied successfully.", time: "5 hr ago", kind: "success" },
  { title: "Duplicate invoice number detected", detail: "INV-10041 already exists under JOB-000119.", time: "Yesterday", kind: "error" },
];
