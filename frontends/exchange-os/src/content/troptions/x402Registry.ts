export interface X402Capability {
  id: string;
  label: string;
  description: string;
  status: "ready" | "gated" | "simulation" | "blocked";
  gatesRequired: string[];
  dryRun: boolean;
}

export const X402_CAPABILITIES: X402Capability[] = [
  {
    id: "payment-channel",
    label: "Payment Channel",
    description: "HTTP 402 payment channel for machine-payable API access",
    status: "gated",
    gatesRequired: ["provider", "legal", "compliance"],
    dryRun: true,
  },
  {
    id: "api-gateway",
    label: "API Gateway Integration",
    description: "x402 gateway integration for monetized institutional API access",
    status: "gated",
    gatesRequired: ["provider", "board"],
    dryRun: true,
  },
  {
    id: "agent-payment-rail",
    label: "Agent Payment Rail",
    description: "AI agent-to-agent x402 payment rail for autonomous workflows",
    status: "gated",
    gatesRequired: ["provider", "legal", "compliance", "board"],
    dryRun: true,
  },
  {
    id: "compliance-gate",
    label: "Compliance Gate",
    description: "Compliance check gate before any x402 payment is processed",
    status: "ready",
    gatesRequired: [],
    dryRun: false,
  },
  {
    id: "rate-limiting",
    label: "Rate Limiting",
    description: "Per-agent and per-entity rate limiting for x402 endpoints",
    status: "ready",
    gatesRequired: [],
    dryRun: false,
  },
  {
    id: "audit-log",
    label: "Audit Log",
    description: "Immutable audit log of all x402 payment intents and outcomes",
    status: "ready",
    gatesRequired: [],
    dryRun: false,
  },
];

export const X402_DISCLAIMER =
  "x402 payment capabilities are subject to provider, legal, compliance, and board approval gates. No live payments are processed until all gates are satisfied. Troptions provides institutional operating infrastructure subject to provider, legal, compliance, custody, jurisdiction, and board approval gates.";

export const X402_BLOCKED_ACTIONS = [
  "process_live_payment",
  "charge_card",
  "debit_account",
  "transfer_funds",
  "settle_payment",
  "bypass_compliance",
];

export function getX402CapabilityById(id: string): X402Capability | undefined {
  return X402_CAPABILITIES.find((c) => c.id === id);
}

export function getReadyCapabilities(): X402Capability[] {
  return X402_CAPABILITIES.filter((c) => c.status === "ready");
}

export function getGatedCapabilities(): X402Capability[] {
  return X402_CAPABILITIES.filter((c) => c.status === "gated");
}
