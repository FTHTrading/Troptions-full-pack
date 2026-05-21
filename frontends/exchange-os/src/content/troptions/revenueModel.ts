/**
 * Troptions Revenue Model
 * Platform fee streams, transaction fees, licensing, and ecosystem revenue.
 */

export type RevenueStream = {
  streamId: string;
  name: string;
  category: "transaction-fee" | "custody-fee" | "licensing-fee" | "platform-fee" | "advisory-fee" | "membership-fee" | "data-fee";
  description: string;
  rateOrStructure: string;
  currency: string;
  eligibilityGates: string[];
  status: "evaluation" | "modeling" | "board-approved" | "active" | "suspended";
  estimatedAnnualRevenue: string | null;
};

export const REVENUE_MODEL: RevenueStream[] = [
  {
    streamId: "REV-TRANS-001",
    name: "Troptions Pay Transaction Fee",
    category: "transaction-fee",
    description: "Fee assessed on every Troptions Pay transaction processed through the payment rail.",
    rateOrStructure: "TBD — modeling in progress",
    currency: "USDC or USD",
    eligibilityGates: ["GivBux agreement signed", "Merchant network verified", "Legal classification complete"],
    status: "evaluation",
    estimatedAnnualRevenue: null,
  },
  {
    streamId: "REV-SALP-001",
    name: "SALP Asset Intake and Tokenization Fee",
    category: "platform-fee",
    description: "Fee charged to asset providers upon intake and tokenization through the SALP protocol.",
    rateOrStructure: "TBD — flat + basis points on asset value",
    currency: "USD or USDC",
    eligibilityGates: ["SALP protocol operational", "First asset tokenized"],
    status: "evaluation",
    estimatedAnnualRevenue: null,
  },
  {
    streamId: "REV-CUST-001",
    name: "Custody Infrastructure Fee",
    category: "custody-fee",
    description: "Fee for custody management services including multi-sig operations, reporting, and insurance.",
    rateOrStructure: "TBD — basis points on AUC",
    currency: "USD",
    eligibilityGates: ["Custody agreements signed", "Custody infrastructure operational"],
    status: "evaluation",
    estimatedAnnualRevenue: null,
  },
  {
    streamId: "REV-LIC-001",
    name: "White-Label Ecosystem Licensing",
    category: "licensing-fee",
    description: "Licensing fee for third-party operators using the TROPTIONS compliance-controlled platform infrastructure.",
    rateOrStructure: "TBD — annual SaaS license plus revenue share",
    currency: "USD",
    eligibilityGates: ["TROPTIONS platform operational", "Licensing legal structure complete"],
    status: "evaluation",
    estimatedAnnualRevenue: null,
  },
  {
    streamId: "REV-MEM-001",
    name: "Institutional Member Portal Fee",
    category: "membership-fee",
    description: "Annual fee for institutional member access including KYC, diligence tools, proof workflows, and reporting.",
    rateOrStructure: "TBD — tiered membership tiers",
    currency: "USD",
    eligibilityGates: ["Portal operational", "KYC/KYB flows live"],
    status: "evaluation",
    estimatedAnnualRevenue: null,
  },
];

export function getActiveRevenueStreams(): RevenueStream[] {
  return REVENUE_MODEL.filter((r) => r.status === "active");
}
