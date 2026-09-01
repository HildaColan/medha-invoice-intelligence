import type { ValidationRule, ValidationRuleType } from "@/types";

export const VALIDATION_RULE_TYPES: ValidationRuleType[] = [
  "Mandatory",
  "Calculation",
  "Duplicate check",
  "Master validation",
];

export const VALIDATION_RULES: ValidationRule[] = [
  { id: "vr-invoice-number-mandatory", field: "Invoice Number", ruleType: "Mandatory", condition: "Must not be empty", enabled: true },
  { id: "vr-qty-unit-price", field: "Quantity × Unit Price", ruleType: "Calculation", condition: "≈ Line Value (tolerance 1%)", enabled: true },
  { id: "vr-invoice-number-duplicate-check", field: "Invoice Number", ruleType: "Duplicate check", condition: "Unique within job", enabled: true },
  { id: "vr-hsn-cth-master-validation", field: "HSN/CTH", ruleType: "Master validation", condition: "Must exist in product master", enabled: true },
  { id: "vr-invoice-total", field: "Invoice Total", ruleType: "Calculation", condition: "≈ Sum of line values + tax", enabled: true },
  { id: "vr-currency-mandatory", field: "Currency", ruleType: "Mandatory", condition: "Must not be empty", enabled: false },
];
