export interface WalletBalance {
  readonly balanceId: string;
  readonly walletId: string;
  readonly currency: string;
  readonly chain: string;
  readonly amount: string;
  readonly status: "demo" | "testnet" | "pending" | "verified" | "unverified";
  readonly lastUpdated: string;
  readonly verifiedBy?: string;
  readonly disclaimer: string;
}

export const WALLET_BALANCE_REGISTRY: readonly WalletBalance[] = [
  {
    balanceId: "bal_kevan_trop_usd",
    walletId: "wallet_kevan_main",
    currency: "TROP USD",
    chain: "internal-ledger",
    amount: "50000.00",
    status: "demo",
    lastUpdated: "2026-04-25T23:10:00Z",
    disclaimer:
      "Demo balance. Internal ledger only. Live funding requires provider approval, custody approval, and compliance review.",
  },
  {
    balanceId: "bal_kevan_usdf_stellar",
    walletId: "wallet_kevan_main",
    currency: "USDF",
    chain: "stellar",
    amount: "25000.00",
    status: "pending",
    lastUpdated: "2026-04-25T23:10:00Z",
    disclaimer:
      "Pending balance. Requires custody provider approval and provider route verification before live settlement.",
  },
  {
    balanceId: "bal_kevan_usdf_xrpl",
    walletId: "wallet_kevan_main",
    currency: "USDF",
    chain: "xrpl",
    amount: "25000.00",
    status: "pending",
    lastUpdated: "2026-04-25T23:10:00Z",
    disclaimer:
      "Pending balance. Testnet-ready route. Production requires provider approval and custody routing.",
  },
  {
    balanceId: "bal_kevan_uny",
    walletId: "wallet_kevan_main",
    currency: "UNY",
    chain: "internal-ledger",
    amount: "50000.00",
    status: "demo",
    lastUpdated: "2026-04-25T23:10:00Z",
    disclaimer:
      "Demo token allocation. Internal ledger only. Do not represent as liquid or transferable without provider approval.",
  },
  {
    balanceId: "bal_kevan_x402_credits",
    walletId: "wallet_kevan_main",
    currency: "x402 Credits",
    chain: "x402",
    amount: "1000.00",
    status: "demo",
    lastUpdated: "2026-04-25T23:10:00Z",
    disclaimer:
      "Demo x402 credits. Simulation mode only. Live payment settlement requires Apostle Chain operator approval.",
  },
];

export function getWalletBalances(walletId: string): readonly WalletBalance[] {
  return WALLET_BALANCE_REGISTRY.filter((balance) => balance.walletId === walletId);
}

export function getBalanceByIdAndWalletId(balanceId: string, walletId: string): WalletBalance | undefined {
  return WALLET_BALANCE_REGISTRY.find((balance) => balance.balanceId === balanceId && balance.walletId === walletId);
}

export function getTotalDemoBalance(walletId: string): string {
  const balances = getWalletBalances(walletId).filter((b) => b.status === "demo");
  const total = balances.reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
  return total.toFixed(2);
}
