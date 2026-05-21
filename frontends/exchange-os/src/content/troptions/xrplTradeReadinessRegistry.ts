export interface XrplTradeReadinessRecord {
  readonly id: string;
  readonly stage: "market-data" | "testnet-lab" | "mainnet-execution";
  readonly title: string;
  readonly allowed: boolean;
  readonly requiredApprovals: readonly string[];
  readonly blockedTransactionTypes: readonly string[];
}

export const XRPL_TRADE_READINESS_REGISTRY: readonly XrplTradeReadinessRecord[] = [
  {
    id: "readiness-market-data",
    stage: "market-data",
    title: "Live market data and monitoring",
    allowed: true,
    requiredApprovals: [],
    blockedTransactionTypes: [],
  },
  {
    id: "readiness-testnet",
    stage: "testnet-lab",
    title: "Testnet execution lab",
    allowed: true,
    requiredApprovals: ["Operator auth", "Idempotency key", "Audit trail"],
    blockedTransactionTypes: ["Signed mainnet OfferCreate", "Signed mainnet Payment", "Signed mainnet AMM transactions"],
  },
  {
    id: "readiness-mainnet",
    stage: "mainnet-execution",
    title: "Mainnet execution readiness",
    allowed: false,
    requiredApprovals: [
      "Legal approval",
      "Custody approval",
      "Provider approval",
      "Compliance approval",
      "Signer approval",
      "Board approval",
    ],
    blockedTransactionTypes: [
      "mainnet OfferCreate",
      "mainnet Payment submission",
      "mainnet AMMCreate",
      "mainnet AMMDeposit",
      "mainnet AMMWithdraw",
      "mainnet wallet signing",
      "private key import",
      "seed import",
      "family seed import",
      "automated live trading",
    ],
  },
];