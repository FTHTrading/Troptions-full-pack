export type AccessStatus = "pending" | "approved" | "blocked" | "review-required";

export interface ClientAccountRecord {
  clientId: string;
  displayName: string;
  entityType: string;
  jurisdiction: string;
  kycStatus: AccessStatus;
  kybStatus: AccessStatus;
  sanctionsStatus: AccessStatus;
  accreditationStatus: AccessStatus;
  brokerDealerAccessStatus: AccessStatus;
  bankingAccessStatus: AccessStatus;
  custodyAccessStatus: AccessStatus;
  stablecoinAccessStatus: AccessStatus;
  xrplAccessStatus: AccessStatus;
  tradingAccessStatus: AccessStatus;
  rwaAccessStatus: AccessStatus;
  settlementAccessStatus: AccessStatus;
  documentsRequired: string[];
  openExceptions: string[];
  allowedModules: string[];
  blockedModules: string[];
  riskScore: number;
  nextActions: string[];
}

export const CLIENT_ACCOUNT_REGISTRY: ClientAccountRecord[] = [
  {
    clientId: "CL-001",
    displayName: "Hamilton Family Office",
    entityType: "family-office",
    jurisdiction: "US-NY",
    kycStatus: "approved",
    kybStatus: "approved",
    sanctionsStatus: "approved",
    accreditationStatus: "approved",
    brokerDealerAccessStatus: "review-required",
    bankingAccessStatus: "review-required",
    custodyAccessStatus: "review-required",
    stablecoinAccessStatus: "pending",
    xrplAccessStatus: "approved",
    tradingAccessStatus: "blocked",
    rwaAccessStatus: "review-required",
    settlementAccessStatus: "blocked",
    documentsRequired: ["Board resolution", "Provider onboarding forms"],
    openExceptions: ["Awaiting venue legal review"],
    allowedModules: ["dashboard", "documents", "xrpl", "reports"],
    blockedModules: ["live-trading", "live-banking-transfer"],
    riskScore: 37,
    nextActions: ["Complete broker-dealer provider engagement", "Submit settlement approval package"],
  },
  {
    clientId: "CL-002",
    displayName: "North Atlantic Infrastructure Partners",
    entityType: "institutional-investor",
    jurisdiction: "UK-LON",
    kycStatus: "approved",
    kybStatus: "review-required",
    sanctionsStatus: "approved",
    accreditationStatus: "approved",
    brokerDealerAccessStatus: "pending",
    bankingAccessStatus: "pending",
    custodyAccessStatus: "review-required",
    stablecoinAccessStatus: "pending",
    xrplAccessStatus: "review-required",
    tradingAccessStatus: "blocked",
    rwaAccessStatus: "pending",
    settlementAccessStatus: "blocked",
    documentsRequired: ["KYB refresh", "Source-of-funds attestation"],
    openExceptions: ["Jurisdiction controls pending"],
    allowedModules: ["dashboard", "onboarding", "documents"],
    blockedModules: ["trading", "settlement"],
    riskScore: 49,
    nextActions: ["Complete KYB review", "Finish sanctions refresh screening"],
  },
];
