export const OPENCLAW_X402_TASKS = [
  "simulate x402 payment intent",
  "check x402 readiness",
  "list x402 blocked reasons",
  "draft x402 paid API plan",
  "draft x402 report-access flow",
  "draft x402 agent-tool access plan",
  "check x402 provider approval status",
] as const;

export const OPENCLAW_X402_CONTROLS = {
  livePaymentCollectionEnabled: false,
  liveSettlementEnabled: false,
  apiKeyExposureAllowed: false,
  defaultMode: "dry-run",
  humanApprovalRequired: true,
} as const;
