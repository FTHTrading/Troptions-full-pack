export interface XrplRegistryRecord {
  accountId: string;
  classicAddress: string;
  xAddress: string;
  entityOwner: string;
  accountType: string;
  allowlistStatus: "pending" | "approved" | "blocked";
  trustlines: number;
  issuedCurrencies: string[];
  ammPools: string[];
  dexPairs: string[];
  lastLedgerSeen: number;
  riskStatus: "normal" | "heightened" | "blocked";
  enabledStatus: "disabled" | "read-only" | "simulation-only";
}

export const XRPL_REGISTRY: XrplRegistryRecord[] = [
  {
    accountId: "XRPL-ACC-001",
    classicAddress: "rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY",
    xAddress: "X7xYV...placeholder",
    entityOwner: "Hamilton Family Office LLC",
    accountType: "treasury-observer",
    allowlistStatus: "approved",
    trustlines: 3,
    issuedCurrencies: ["USD", "EUR"],
    ammPools: ["XRPL-AMM-001"],
    dexPairs: ["USD/XRP"],
    lastLedgerSeen: 92110000,
    riskStatus: "normal",
    enabledStatus: "read-only",
  },
];
