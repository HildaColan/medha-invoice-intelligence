import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { T, fontBody, fontMono } from "@/theme/tokens";

export interface DateRangePickerProps {
  label?: string;
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
  placeholder?: string;
}

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

export function DateRangePicker({ label, from, to, onApply, placeholder = "Select date range" }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (from ? new Date(from) : new Date()));
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);
  const [dragAnchor, setDragAnchor] = useState<string | null>(null);
  const [dragCursor, setDragCursor] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openPicker = () => {
    setDraftFrom(from);
    setDraftTo(to);
    setViewDate(from ? new Date(from) : new Date());
    setOpen(true);
  };

  const pickDay = (iso: string) => {
    if (!draftFrom || (draftFrom && draftTo)) {
      setDraftFrom(iso);
      setDraftTo("");
    } else if (iso < draftFrom) {
      setDraftFrom(iso);
      setDraftTo("");
    } else {
      setDraftTo(iso);
    }
  };

  // Click-and-drag range selection: mousedown starts the anchor, mouseenter while
  // dragging previews the range, mouseup finalizes it. A mouseup on the same day
  // (no movement) falls back to the click-to-click two-step selection above.
  useEffect(() => {
    if (dragAnchor === null) return;
    const onMouseUp = () => {
      const anchor = dragAnchor;
      const end = dragCursor ?? dragAnchor;
      if (end === anchor) {
        pickDay(anchor);
      } else {
        setDraftFrom(anchor < end ? anchor : end);
        setDraftTo(anchor < end ? end : anchor);
      }
      setDragAnchor(null);
      setDragCursor(null);
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragAnchor, dragCursor]);

  const startDrag = (iso: string) => {
    setDragAnchor(iso);
    setDragCursor(iso);
  };

  const dragOver = (iso: string) => {
    if (dragAnchor) setDragCursor(iso);
  };

  const previewFrom = dragAnchor
    ? (dragAnchor < (dragCursor ?? dragAnchor) ? dragAnchor : (dragCursor ?? dragAnchor))
    : draftFrom;
  const previewTo = dragAnchor
    ? (dragAnchor < (dragCursor ?? dragAnchor) ? (dragCursor ?? dragAnchor) : dragAnchor)
    : draftTo;

  const apply = () => {
    onApply(draftFrom, draftTo || draftFrom);
    setOpen(false);
  };

  const clear = () => {
    setDraftFrom("");
    setDraftTo("");
    onApply("", "");
    setOpen(false);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(firstOfMonth.getDay());

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const displayText = from ? `${formatDisplay(from)} — ${formatDisplay(to || from)}` : "";

  return (
    <div className="relative" ref={rootRef}>
      {label && (
        <label className="block text-[11px] mb-1.5" style={{ ...fontMono, color: T.slateSoft, letterSpacing: "0.04em" }}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] w-full text-left"
        style={{ border: `1px solid ${T.hair}`, background: "#fff", ...fontBody, color: displayText ? T.slate : T.slateSoft }}
      >
        <Calendar size={14} color={T.slateSoft} className="shrink-0" />
        <span className="truncate">{displayText || placeholder}</span>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 rounded-2xl p-4"
          style={{ background: T.card, border: `1px solid ${T.hair}`, boxShadow: "0 12px 32px rgba(34,26,20,0.16)", width: 300 }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ border: `1px solid ${T.hair}` }}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} color={T.slate} />
            </button>
            <div style={{ ...fontBody, color: T.ink, fontWeight: 600, fontSize: 13.5 }}>
              {MONTH_NAMES[month]} {year}
            </div>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ border: `1px solid ${T.hair}` }}
              aria-label="Next month"
            >
              <ChevronRight size={14} color={T.slate} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div key={i} className="text-center text-[10.5px] py-1" style={{ ...fontMono, color: T.slateSoft }}>
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 select-none">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const iso = toIso(year, month, day);
              const isFrom = iso === previewFrom;
              const isTo = iso === previewTo || (!previewTo && iso === previewFrom);
              const inRange = previewFrom && previewTo && iso > previewFrom && iso < previewTo;
              return (
                <div key={i} className="flex items-center justify-center py-0.5" style={{ background: inRange ? T.brassSoft : "transparent" }}>
                  <button
                    type="button"
                    onMouseDown={() => startDrag(iso)}
                    onMouseEnter={() => dragOver(iso)}
                    onDragStart={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12.5px]"
                    style={{
                      ...fontBody,
                      background: isFrom || isTo ? T.brass : "transparent",
                      color: isFrom || isTo ? "#fff" : T.slate,
                      fontWeight: isFrom || isTo ? 700 : 400,
                    }}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${T.hair}` }}>
            <button
              type="button"
              onClick={clear}
              disabled={!draftFrom && !draftTo}
              className="text-[12px] font-medium disabled:opacity-40"
              style={{ ...fontBody, color: T.slateSoft }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={!draftFrom}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold disabled:opacity-50"
              style={{ background: T.brass, color: "#fff", ...fontBody }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
