import type { ReactNode } from "react";
import { X } from "lucide-react";
import { T, fontDisplay } from "@/theme/tokens";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export function Modal({ open, title, onClose, children, footer, width = 480 }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(34,26,20,0.45)" }} onClick={onClose} />
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ maxWidth: width, background: T.card, border: `1px solid ${T.hair}`, boxShadow: "0 24px 64px rgba(34,26,20,0.28)" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.hair}` }}>
          <span style={{ ...fontDisplay, color: T.ink, fontSize: 17, fontWeight: 600 }}>{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5EDE4]"
          >
            <X size={16} color={T.slateSoft} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${T.hair}`, background: T.mist }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
