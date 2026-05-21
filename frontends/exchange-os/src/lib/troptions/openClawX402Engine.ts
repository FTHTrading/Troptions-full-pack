import { OPENCLAW_X402_CONTROLS } from "@/content/troptions/openClawX402Registry";
import { buildX402PaymentIntentDryRun, buildX402ReadinessReport } from "@/lib/troptions/x402ReadinessEngine";

export function getOpenClawX402Readiness() {
  const report = buildX402ReadinessReport();
  return {
    mode: "simulation",
    controls: OPENCLAW_X402_CONTROLS,
    report,
    blockedReasons: [
      "Live payment collection disabled",
      "Live settlement disabled",
      "Provider approval pending",
    ],
  };
}

export function simulateOpenClawX402PaymentIntent(input: {
  amount: string;
  currency: string;
  payer: string;
  payee: string;
  idempotencyKey: string;
}) {
  const intent = buildX402PaymentIntentDryRun(input);
  return {
    mode: "simulation",
    intent,
    blockedActions: ["enable-live-x402", "settle"],
    requiredApprovals: ["Provider approval", "Compliance approval", "Board approval"],
  };
}
