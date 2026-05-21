export interface RwaOperationsRecord {
  assetId: string;
  owner: string;
  issuer: string;
  jurisdiction: string;
  assetClass: string;
  titleEvidence: string;
  valuationEvidence: string;
  lienSearchStatus: "pending" | "clear" | "blocked";
  custodyStatus: "pending" | "approved" | "blocked";
  proofStatus: "pending" | "approved" | "blocked";
  legalStatus: "pending" | "approved" | "blocked";
  reserveStatus: "pending" | "approved" | "blocked";
  tokenizationStatus: "pending" | "approved" | "blocked";
  fundingStatus: "pending" | "approved" | "blocked";
  settlementStatus: "pending" | "ready" | "blocked";
  exchangeEligibility: "pending" | "eligible" | "not-eligible";
  riskScore: number;
  nextActions: string[];
}

export const RWA_OPERATIONS_REGISTRY: RwaOperationsRecord[] = [
  {
    assetId: "RWA-GOLD-001",
    owner: "Hamilton Family Office LLC",
    issuer: "Troptions RWA Operations",
    jurisdiction: "US-NY",
    assetClass: "gold",
    titleEvidence: "vault-title-doc-001",
    valuationEvidence: "valuation-report-2026-q1",
    lienSearchStatus: "clear",
    custodyStatus: "pending",
    proofStatus: "pending",
    legalStatus: "pending",
    reserveStatus: "pending",
    tokenizationStatus: "pending",
    fundingStatus: "pending",
    settlementStatus: "pending",
    exchangeEligibility: "pending",
    riskScore: 45,
    nextActions: ["Complete legal review", "Complete custody attestation", "Publish proof package"],
  },
];
