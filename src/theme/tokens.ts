import type { CSSProperties } from "react";

/* ---------------------------------------------------------------
   MEDHA — AI Invoice Extraction System
   Theme: Transorion brand palette — Orange with White
   Charcoal Ink #221A14 · Warm Paper #FBF6F1 · Transorion Orange #E0600C
   Manifest Teal #1C7C74 (success) · Alert Red #C1392B (error) · Warm Slate #4A3F35
   Display: Fraunces | Body: IBM Plex Sans | Data: IBM Plex Mono
----------------------------------------------------------------*/

export const T = {
  ink: "#221A14",
  inkSoft: "#332921",
  mist: "#FBF6F1",
  card: "#FFFFFF",
  brass: "#E0600C",
  brassDeep: "#C2530B",
  brassSoft: "#FBE4CF",
  teal: "#1C7C74",
  tealSoft: "#DCEEEC",
  rust: "#C1392B",
  rustSoft: "#F8DFDA",
  slate: "#4A3F35",
  slateSoft: "#8A7C70",
  hair: "#E8E1D7",
} as const;

export const fontDisplay: CSSProperties = { fontFamily: "'Fraunces', serif" };
export const fontBody: CSSProperties = { fontFamily: "'IBM Plex Sans', sans-serif" };
export const fontMono: CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

export const tooltipStyle: CSSProperties = { background: T.ink, border: "none", borderRadius: 8, padding: "8px 12px" };
export const tooltipLabelStyle: CSSProperties = { ...fontMono, color: "#B8AA9C", fontSize: 11 };
export const tooltipItemStyle: CSSProperties = { ...fontBody, color: "#fff", fontSize: 12 };
