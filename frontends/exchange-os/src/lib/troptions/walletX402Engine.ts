import {
  isX402PaymentIntentAllowed,
  canEnableX402Production,
  type X402WalletAccess,
} from "@/content/troptions/walletX402Registry";

export interface X402PaymentIntentRequest {
  walletId: string;
  amount: string;
  currency: string;
  recipientAddress: string;
  purpose?: string;
}

export interface X402PaymentIntentResult {
  ok: boolean;
  paymentIntentId?: string;
  status: "dry-run" | "simulation" | "readiness" | "testnet" | "production";
  message: string;
  dryRunResult?: {
    wouldSucceed: boolean;
    estimatedFee: string;
    estimatedTime: string;
  };
  blockedReason?: string;
  requiresApprovals?: readonly string[];
}

export function createX402PaymentIntent(
  walletX402Access: X402WalletAccess,
  request: X402PaymentIntentRequest
): X402PaymentIntentResult {
  const intentId = `x402_intent_${request.walletId}_${Date.now()}`;

  if (!isX402PaymentIntentAllowed(walletX402Access)) {
    return {
      ok: false,
      status: "production",
      message: "x402 payment intent limit reached or access disabled",
      blockedReason: "x402-limit-exceeded",
    };
  }

  if (walletX402Access.x402Status === "disabled") {
    return {
      ok: false,
      status: "production",
      message: "x402 access is disabled for this wallet",
      blockedReason: "x402-disabled",
      requiresApprovals: ["Enable x402 access", "Verify operator role", "Accept x402 disclaimers"],
    };
  }

  return {
    ok: true,
    paymentIntentId: intentId,
    status: "readiness",
    message: `x402 payment intent created in ${walletX402Access.x402Status} mode: ${intentId}. Amount: ${request.amount} ${request.currency}`,
    dryRunResult: {
      wouldSucceed: true,
      estimatedFee: (parseFloat(request.amount) * 0.001).toFixed(2),
      estimatedTime: "2-5 seconds (dry-run, actual time depends on Apostle Chain load)",
    },
    requiresApprovals: [
      "Live x402 requires Apostle Chain operator approval",
      "Production settlement requires ATP collateral verification",
    ],
  };
}

export function canUpgradeX402ToProduction(walletX402Access: X402WalletAccess): boolean {
  return canEnableX402Production(walletX402Access);
}

export function getX402Disclaimers(): readonly string[] {
  return [
    "x402 is currently in readiness mode with dry-run payment intents only",
    "Live ATP settlement requires Apostle Chain operator node approval",
    "No actual transactions will execute in readiness mode",
    "Production x402 requires additional compliance and audit approval",
    "x402 operators assume custody and settlement risk",
  ];
}
