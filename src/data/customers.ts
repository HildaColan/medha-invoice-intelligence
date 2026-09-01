import type { Customer } from "@/types";

export const CUSTOMERS: Customer[] = [
  {
    id: "cust-orion",
    name: "Orion Manufacturing Ltd.",
    code: "CUST-1001",
    gstin: "27ORIONM1234K1Z5",
    email: "accounts@orionmfg.com",
    phone: "+91 22 4011 2200",
    status: "Active",
  },
  {
    id: "cust-vantage",
    name: "Vantage Industrial Corp",
    code: "CUST-1002",
    gstin: "29VANTGI5678L1Z2",
    email: "billing@vantageindl.com",
    phone: "+91 80 2233 4455",
    status: "Active",
  },
  {
    id: "cust-northgate",
    name: "Northgate Automotive Pvt Ltd",
    code: "CUST-1003",
    gstin: "24NORTHG9012M1Z8",
    email: "finance@northgateauto.com",
    phone: "+91 79 6612 3300",
    status: "Active",
  },
  {
    id: "cust-summit",
    name: "Summit Precision Tools",
    code: "CUST-1004",
    gstin: "33SUMMIT3456N1Z4",
    email: "ap@summitprecision.com",
    phone: "+91 44 2871 9900",
    status: "Inactive",
  },
  {
    id: "cust-harbor",
    name: "Harborline Electronics",
    code: "CUST-1005",
    gstin: "19HARBOR7890P1Z1",
    email: "invoices@harborline.com",
    phone: "+91 33 4022 8811",
    status: "Active",
  },
];
