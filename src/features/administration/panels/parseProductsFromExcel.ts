import * as XLSX from "xlsx";
import type { Product, ProductStatus } from "@/types";

export type ParsedProductRow = Partial<Product>;

const HEADER_ALIASES: Record<string, keyof Product> = {
  partno: "part",
  partnumber: "part",
  part: "part",
  modelno: "model",
  modelnumber: "model",
  model: "model",
  description: "desc",
  desc: "desc",
  hsn: "hsn",
  hsncth: "hsn",
  hsncode: "hsn",
  duty: "duty",
  dutyrate: "duty",
  status: "status",
  customer: "customer",
  customername: "customer",
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeStatus(value: unknown): ProductStatus {
  return String(value ?? "").trim().toLowerCase() === "unmatched" ? "Unmatched" : "Active";
}

export async function parseProductsFromExcel(file: File): Promise<ParsedProductRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  return rows
    .map((row) => {
      const mapped: ParsedProductRow = {};
      for (const [rawHeader, value] of Object.entries(row)) {
        const field = HEADER_ALIASES[normalizeHeader(rawHeader)];
        if (!field || value === "" || value === undefined) continue;
        if (field === "status") {
          mapped.status = normalizeStatus(value);
        } else {
          mapped[field] = String(value).trim();
        }
      }
      return mapped;
    })
    .filter((row) => !!row.part || !!row.desc);
}
