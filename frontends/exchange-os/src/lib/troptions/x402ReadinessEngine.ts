import { X402_CAPABILITIES, X402_BLOCKED_ACTIONS, X402_DISCLAIMER, getReadyCapabilities, getGatedCapabilities } from "@/content/troptions/x402Registry";

export interface X402ReadinessReport {
  overallStatus: "simulation-only" | "partial-ready" | "fully-ready";
  readyCount: number;
  gatedCount: number;
  blockedActions: string[];
  capabilities: typeof X402_CAPABILITIES;
  disclaimer: string;
}

export function buildX402ReadinessReport(): X402ReadinessReport {
  const ready = getReadyCapabilities();
  const gated = getGatedCapabilities();

  return {
    overallStatus: gated.length > 0 ? "simulation-only" : "partial-ready",
    readyCount: ready.length,
    gatedCount: gated.length,
    blockedActions: X402_BLOCKED_ACTIONS,
    capabilities: X402_CAPABILITIES,
    disclaimer: X402_DISCLAIMER,
  };
}

export interface X402PaymentIntentDryRun {
  intentId: string;
  status: "dry-run";
  amount: string;
  currency: string;
  payee: string;
  payer: string;
  gateStatus: "pending";
  complianceCleared: false;
  simulationOnly: true;
  disclaimer: string;
  timestamp: string;
}

export function buildX402PaymentIntentDryRun(params: {
  amount: string;
  currency: string;
  payee: string;
  payer: string;
  idempotencyKey: string;
}): X402PaymentIntentDryRun {
  return {
    intentId: `x402-dryrun-${params.idempotencyKey.slice(0, 8)}`,
    status: "dry-run",
    amount: params.amount,
    currency: params.currency,
    payee: params.payee,
    payer: params.payer,
    gateStatus: "pending",
    complianceCleared: false,
    simulationOnly: true,
    disclaimer: X402_DISCLAIMER,
    timestamp: new Date().toISOString(),
  };
}
