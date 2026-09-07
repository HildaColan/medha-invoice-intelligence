import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { AUDIT } from "@/data";
import type { AuditEntry, AuditLogInput } from "@/types";

const AUDIT_LOG_STORAGE_KEY = "medha_audit_log";

/** No real session/auth exists yet — every entry defaults to this demo user. */
export const CURRENT_USER = "Priya Raghavan";

interface AuditLogContextValue {
  entries: AuditEntry[];
  logActivity: (input: AuditLogInput) => void;
}

const AuditLogContext = createContext<AuditLogContextValue>({
  entries: [],
  logActivity: () => {},
});

/**
 * Every action performed by a user, everywhere in the app.
 * useAuditLog() returns { entries, logActivity } — call logActivity right after
 * the state update / notify(...) call for whatever action just completed.
 */
export const useAuditLog = (): AuditLogContextValue => useContext(AuditLogContext);

function formatAuditTime(date: Date): string {
  const datePart = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${datePart}, ${hh}:${mm}`;
}

function generateAuditId(): string {
  return `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadInitialEntries(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuditEntry[];
  } catch {
    // malformed/unavailable storage — fall back to the seed data below
  }
  return AUDIT;
}

/**
 * Diffs two flat previous/updated field maps, returning only the changed ones.
 * Shared by any screen that needs "previous value → updated value" per field
 * (e.g. JobDetailView's field-level edit logging).
 */
export function diffFields(
  previous: Record<string, string>,
  updated: Record<string, string>
): { field: string; from: string; to: string }[] {
  const changes: { field: string; from: string; to: string }[] = [];
  for (const key of Object.keys(updated)) {
    if (previous[key] !== updated[key]) {
      changes.push({ field: key, from: previous[key] ?? "", to: updated[key] });
    }
  }
  return changes;
}

// AuditLogProvider must wrap RouterProvider itself (see App.tsx) rather than nest
// inside the route tree — LoginView is a route sibling of the authenticated subtree
// in AppRouter.tsx, not a descendant, so it needs the same access as every other screen.
export function AuditLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AuditEntry[]>(loadInitialEntries);

  const logActivity = (input: AuditLogInput) => {
    const entry: AuditEntry = {
      id: generateAuditId(),
      user: input.user ?? CURRENT_USER,
      action: input.action,
      module: input.module,
      ref: input.ref ?? "—",
      previousValue: input.previousValue,
      updatedValue: input.updatedValue,
      result: input.result ?? "Success",
      time: formatAuditTime(new Date()),
    };
    setEntries((prev) => {
      const next = [entry, ...prev];
      try {
        localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full/unavailable — in-memory state still updates for this session
      }
      return next;
    });
  };

  return <AuditLogContext.Provider value={{ entries, logActivity }}>{children}</AuditLogContext.Provider>;
}
