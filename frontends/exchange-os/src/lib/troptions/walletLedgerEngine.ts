import { getWalletBalances } from "@/content/troptions/walletBalanceRegistry";

export const WALLET_BALANCE_DISCLAIMER =
  "Wallet balances shown in this environment may be internal ledger, demo, testnet, pending, or provider-reported balances. Live funding, withdrawals, card activation, stablecoin settlement, chain execution, and x402 payment settlement require compliance approval, provider approval, custody approval, jurisdiction review, and release-gate authorization.";

export interface LedgerBalance {
  currency: string;
  chain: string;
  amount: string;
  status: "demo" | "testnet" | "pending" | "verified" | "unverified";
  disclaimer: string;
}

export interface WalletLedgerView {
  walletId: string;
  totalDemoBalance: string;
  totalPendingBalance: string;
  totalVerifiedBalance: string;
  balances: readonly LedgerBalance[];
  disclaimer: string;
}

export function getWalletLedger(walletId: string): WalletLedgerView {
  const balances = getWalletBalances(walletId);

  const ledgerBalances: LedgerBalance[] = balances.map((b) => ({
    currency: b.currency,
    chain: b.chain,
    amount: b.amount,
    status: b.status,
    disclaimer: b.disclaimer,
  }));

  const totalDemo = balances
    .filter((b) => b.status === "demo")
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);

  const totalPending = balances
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);

  const totalVerified = balances
    .filter((b) => b.status === "verified")
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);

  return {
    walletId,
    totalDemoBalance: totalDemo.toFixed(2),
    totalPendingBalance: totalPending.toFixed(2),
    totalVerifiedBalance: totalVerified.toFixed(2),
    balances: ledgerBalances,
    disclaimer: WALLET_BALANCE_DISCLAIMER,
  };
}

export function hasVerifiedBalances(walletId: string): boolean {
  const balances = getWalletBalances(walletId);
  return balances.some((b) => b.status === "verified");
}

export function getTotalAvailableForSend(walletId: string): string {
  const balances = getWalletBalances(walletId);
  const available = balances
    .filter((b) => b.status === "verified" || b.status === "demo")
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);
  return available.toFixed(2);
}
