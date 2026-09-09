import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportRowsAsExcel(filename: string, rows: Record<string, unknown>[]): void {
  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Report");
  XLSX.writeFile(workbook, filename);
}

export function exportRowsAsCsv(filename: string, rows: Record<string, unknown>[]): void {
  const sheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(sheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export interface PdfExportOptions {
  title: string;
  /** Applied-filter summary lines, printed under the title so the download retains context. */
  filterSummaryLines: string[];
}

export function exportRowsAsPdf(filename: string, rows: Record<string, unknown>[], opts: PdfExportOptions): void {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text(opts.title, 14, 15);

  let cursorY = 22;
  if (opts.filterSummaryLines.length > 0) {
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    for (const line of opts.filterSummaryLines) {
      doc.text(line, 14, cursorY);
      cursorY += 5;
    }
    doc.setTextColor(20, 20, 20);
    cursorY += 2;
  }

  const head = rows.length > 0 ? [Object.keys(rows[0])] : [[]];
  const body = rows.map((row) => Object.values(row).map((v) => String(v ?? "")));

  autoTable(doc, {
    head,
    body,
    startY: cursorY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [176, 78, 39] },
  });

  doc.save(filename);
}
