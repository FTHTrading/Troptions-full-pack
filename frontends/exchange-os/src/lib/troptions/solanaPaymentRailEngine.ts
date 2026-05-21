import { SOLANA_RAIL_CAPABILITIES } from "@/content/troptions/solanaRailRegistry";

export interface SolanaPaymentIntentRequest {
  merchantId: string;
  amount: string;
  currency: string;
  reference?: string;
}

export function getSolanaRailSummary() {
  return {
    capabilities: SOLANA_RAIL_CAPABILITIES,
    mode: "simulation-only" as const,
  };
}

export function simulateSolanaPaymentIntent(request: SolanaPaymentIntentRequest) {
  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: [
      "Live Solana settlement is disabled",
      "Provider and compliance approvals are required",
    ],
    intent: {
      merchantId: request.merchantId,
      amount: request.amount,
      currency: request.currency,
      reference: request.reference ?? "none",
      encodedRequest: `solana-pay://simulate?merchant=${encodeURIComponent(request.merchantId)}&amount=${encodeURIComponent(request.amount)}&currency=${encodeURIComponent(request.currency)}`,
    },
  };
}
