import type { LineItem } from "@/types";

export const LINE_ITEMS: LineItem[] = [
  { line: 1, desc: "Precision Bearing Assembly", part: "PBX-2210", hsn: "8482.10", qty: 240, unit: "USD 4.20", value: "USD 1,008.00", conf: 98, status: "valid" },
  { line: 2, desc: "Hydraulic Control Valve", part: "HCV-771", hsn: "8481.80", qty: 60, unit: "USD 38.50", value: "USD 2,310.00", conf: 95, status: "valid" },
  { line: 3, desc: "Sensor Module, Type C", part: "SMC-004X", hsn: "—", qty: 500, unit: "USD 2.10", value: "USD 1,050.00", conf: 61, status: "review" },
  { line: 4, desc: "Aluminium Mounting Bracket", part: "AMB-330", hsn: "7616.99", qty: 1200, unit: "USD 0.85", value: "USD 1,020.00", conf: 99, status: "valid" },
  { line: 5, desc: "Gasket Seal Kit, Type B", part: "GSK-118", hsn: "4016.93", qty: 80, unit: "USD 12.60", value: "USD 1,008.00", conf: 91, status: "valid" },
  { line: 6, desc: "Terminal Connector Block", part: "TCB-556", hsn: "8536.90", qty: 300, unit: "USD 0.64", value: "USD 192.00", conf: 84, status: "valid" },
];
