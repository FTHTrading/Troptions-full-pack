export interface X402WalletAccess {
  readonly x402AccessId: string;
  readonly walletId: string;
  readonly userId: string;
  readonly x402Status: "disabled" | "readiness" | "testnet" | "production";
  readonly operatorRole: "none" | "participant" | "admin" | "proposer";
  readonly paymentIntentLimit: string;
  readonly monthlyPaymentIntentUsage: string;
  readonly monthlyPaymentIntentLimit: string;
  readonly apiKeyHashed?: string;
  readonly refreshTokenHashed?: string;
  readonly approvedAt?: string;
  readonly enabledAt?: string;
  readonly suspendedAt?: string;
  readonly disclaimers: readonly string[];
}

export const WALLET_X402_REGISTRY: readonly X402WalletAccess[] = [
  {
    x402AccessId: "x402_kevan_001",
    walletId: "wallet_kevan_main",
    userId: "user_kevan_burns",
    x402Status: "readiness",
    operatorRole: "admin",
    paymentIntentLimit: "100000.00",
    monthlyPaymentIntentUsage: "0.00",
    monthlyPaymentIntentLimit: "500000.00",
    approvedAt: "2026-04-25T12:00:00Z",
    enabledAt: undefined,
    suspendedAt: undefined,
    disclaimers: [
      "x402 payment intents are simulation-only in readiness mode",
      "Live ATP settlement requires Apostle Chain operator approval",
      "Dry-run mode enabled — no actual transactions will execute",
      "Production x402 requires additional AML/sanctions screening",
    ],
  },
];

export function getX402AccessByWalletId(walletId: string): X402WalletAccess | undefined {
  return WALLET_X402_REGISTRY.find((access) => access.walletId === walletId);
}

export function getX402AccessByUserId(userId: string): X402WalletAccess | undefined {
  return WALLET_X402_REGISTRY.find((access) => access.userId === userId);
}

export function isX402PaymentIntentAllowed(access: X402WalletAccess): boolean {
  const usageFloat = parseFloat(access.monthlyPaymentIntentUsage || "0");
  const limitFloat = parseFloat(access.monthlyPaymentIntentLimit || "0");
  return access.x402Status !== "disabled" && usageFloat < limitFloat;
}

export function canEnableX402Production(access: X402WalletAccess): boolean {
  return access.x402Status === "testnet" && access.operatorRole !== "none";
}
