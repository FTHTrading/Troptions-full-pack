export interface BankingRailRecord {
  railId: string;
  railType:
    | "ACH"
    | "Fedwire"
    | "domestic-wire"
    | "SWIFT"
    | "SEPA"
    | "escrow"
    | "lockbox"
    | "trust-account"
    | "custody-account"
    | "treasury-account"
    | "payment-processor"
    | "fx-provider";
  provider: string;
  jurisdiction: string;
  complianceStatus: "pending" | "approved" | "blocked";
  liveTransferEnabled: boolean;
  mode: "dry-run" | "instruction-ready";
}

export const BANKING_RAIL_REGISTRY: BankingRailRecord[] = [
  {
    railId: "BR-ACH-01",
    railType: "ACH",
    provider: "Provider Bank A",
    jurisdiction: "US",
    complianceStatus: "approved",
    liveTransferEnabled: false,
    mode: "instruction-ready",
  },
  {
    railId: "BR-SWIFT-02",
    railType: "SWIFT",
    provider: "Global Bank B",
    jurisdiction: "GB",
    complianceStatus: "pending",
    liveTransferEnabled: false,
    mode: "dry-run",
  },
];
