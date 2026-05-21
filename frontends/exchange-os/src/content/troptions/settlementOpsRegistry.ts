export interface SettlementOpsRecord {
  intentId: string;
  counterpartyVerification: "pending" | "verified" | "blocked";
  paymentRailSelection: string;
  custodyRouteSelection: string;
  stablecoinRouteSelection: string;
  xrplRouteSimulationStatus: "pending" | "complete" | "blocked";
  fxQuoteStatus: "pending" | "quoted" | "blocked";
  approvalPackageStatus: "pending" | "approved" | "blocked";
  settlementInstructionStatus: "pending" | "prepared" | "blocked";
  completionReportStatus: "pending" | "complete";
}

export const SETTLEMENT_OPS_REGISTRY: SettlementOpsRecord[] = [
  {
    intentId: "SETTLE-001",
    counterpartyVerification: "pending",
    paymentRailSelection: "ACH",
    custodyRouteSelection: "third-party-custody",
    stablecoinRouteSelection: "SC-USDC-ETH",
    xrplRouteSimulationStatus: "pending",
    fxQuoteStatus: "pending",
    approvalPackageStatus: "pending",
    settlementInstructionStatus: "pending",
    completionReportStatus: "pending",
  },
];
