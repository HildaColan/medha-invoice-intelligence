import { T } from "@/theme/tokens";
import type { AccuracyDatum, StatusBreakdownDatum, TrendPoint } from "@/types";

export const TREND_DATA: TrendPoint[] = [
  { day: "13 Aug", jobs: 4, docs: 11 }, { day: "14 Aug", jobs: 6, docs: 15 },
  { day: "15 Aug", jobs: 3, docs: 8 }, { day: "16 Aug", jobs: 7, docs: 18 },
  { day: "17 Aug", jobs: 5, docs: 13 }, { day: "18 Aug", jobs: 2, docs: 6 },
  { day: "19 Aug", jobs: 8, docs: 21 }, { day: "20 Aug", jobs: 6, docs: 16 },
  { day: "21 Aug", jobs: 9, docs: 24 }, { day: "22 Aug", jobs: 7, docs: 19 },
  { day: "23 Aug", jobs: 5, docs: 14 }, { day: "24 Aug", jobs: 10, docs: 27 },
  { day: "25 Aug", jobs: 8, docs: 22 }, { day: "26 Aug", jobs: 6, docs: 17 },
];

export const STATUS_BREAKDOWN: StatusBreakdownDatum[] = [
  { name: "Completed", value: 24, color: T.teal },
  { name: "Processing", value: 6, color: T.slateSoft },
  { name: "Validation Req.", value: 5, color: T.brass },
  { name: "Failed", value: 3, color: T.rust },
];

export const ACCURACY_DATA: AccuracyDatum[] = [
  { field: "Inv. No.", accuracy: 98 }, { field: "Inv. Date", accuracy: 97 },
  { field: "Supplier", accuracy: 94 }, { field: "Quantity", accuracy: 99 },
  { field: "Unit Price", accuracy: 96 }, { field: "HSN Match", accuracy: 89 },
];
