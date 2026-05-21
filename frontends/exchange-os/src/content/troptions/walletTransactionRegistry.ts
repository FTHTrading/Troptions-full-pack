export interface WalletTransaction {
  readonly transactionId: string;
  readonly walletId: string;
  readonly transactionType: "send" | "receive" | "convert" | "funding-deposit" | "card-funding" | "x402-payment";
  readonly status: "simulation" | "pending" | "completed" | "failed" | "cancelled";
  readonly amount: string;
  readonly currency: string;
  readonly sourceChain: string;
  readonly destinationChain: string;
  readonly counterparty?: string;
  readonly description: string;
  readonly fee: string;
  readonly createdAt: string;
  readonly completedAt?: string;
  readonly simulationNote?: string;
  readonly blockedReason?: string;
}

export const WALLET_TRANSACTION_REGISTRY: readonly WalletTransaction[] = [];

export function getWalletTransactions(walletId: string): readonly WalletTransaction[] {
  return WALLET_TRANSACTION_REGISTRY.filter((tx) => tx.walletId === walletId);
}

export function getTransactionByTransactionId(transactionId: string): WalletTransaction | undefined {
  return WALLET_TRANSACTION_REGISTRY.find((tx) => tx.transactionId === transactionId);
}

export function getCompletedTransactions(walletId: string): readonly WalletTransaction[] {
  return WALLET_TRANSACTION_REGISTRY.filter(
    (tx) => tx.walletId === walletId && tx.status === "completed"
  );
}

export function getSimulationTransactions(walletId: string): readonly WalletTransaction[] {
  return WALLET_TRANSACTION_REGISTRY.filter(
    (tx) => tx.walletId === walletId && tx.status === "simulation"
  );
}

export function hasVerifiedTransactions(walletId: string): boolean {
  return getCompletedTransactions(walletId).length > 0;
}
