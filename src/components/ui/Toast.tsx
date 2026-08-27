import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { T, fontBody } from "@/theme/tokens";

type NotifyFn = (message: string) => void;

const ToastContext = createContext<NotifyFn>(() => {});

/**
 * Lightweight toast used for actions that don't navigate anywhere or open a
 * modal (save draft, download, revoke session, etc.) so every button still
 * gives the person real feedback without needing a backend.
 */
export const useToast = (): NotifyFn => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const notify: NotifyFn = (message) => {
    setToast(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 2800);
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[999] px-5 py-3 rounded-xl flex items-center gap-2.5"
          style={{ transform: "translateX(-50%)", background: T.ink, boxShadow: "0 16px 40px rgba(34,26,20,0.35)" }}
        >
          <CheckCircle2 size={15} color={T.teal} />
          <span style={{ ...fontBody, color: "#fff", fontSize: 13, fontWeight: 500 }}>{toast}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}
