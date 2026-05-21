export interface StablecoinRailRecord {
  routeId: string;
  asset: "USDC" | "EURC" | "PYUSD" | "RLUSD" | "USDT" | "DAI" | "troptions-accounting-unit" | "gold-linked-unit" | "treasury-linked-unit";
  issuer: string;
  chain: string;
  custodyRequirement: string;
  redemptionRequirement: string;
  jurisdictionRestrictions: string[];
  settlementUseCase: string;
  riskNotes: string;
  approvalStatus: "pending" | "approved" | "blocked";
  enabledStatus: "disabled" | "simulation-only" | "enabled";
  requiresLicensingApproval: boolean;
}

export const STABLECOIN_RAIL_REGISTRY: StablecoinRailRecord[] = [
  {
    routeId: "SC-USDC-ETH",
    asset: "USDC",
    issuer: "Circle",
    chain: "Ethereum",
    custodyRequirement: "Qualified custody provider required",
    redemptionRequirement: "Issuer and provider redemption policy applies",
    jurisdictionRestrictions: ["OFAC sanctioned regions blocked"],
    settlementUseCase: "Institutional settlement simulation",
    riskNotes: "Counterparty and chain risk review required",
    approvalStatus: "approved",
    enabledStatus: "simulation-only",
    requiresLicensingApproval: false,
  },
  {
    routeId: "SC-TROPTIONS-UNIT",
    asset: "troptions-accounting-unit",
    issuer: "Troptions",
    chain: "Internal Ledger",
    custodyRequirement: "Provider custody required",
    redemptionRequirement: "No public redemption until legal and reserve approvals",
    jurisdictionRestrictions: ["Public launch blocked without licensing"],
    settlementUseCase: "Internal accounting simulation",
    riskNotes: "Licensing and reserve governance unresolved",
    approvalStatus: "pending",
    enabledStatus: "disabled",
    requiresLicensingApproval: true,
  },
];
