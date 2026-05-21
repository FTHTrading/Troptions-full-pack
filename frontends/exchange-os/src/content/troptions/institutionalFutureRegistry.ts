export interface InstitutionalFutureCapability {
  id: string;
  capability: string;
  readiness: "active-build" | "design-phase" | "blocked-until-approval";
  module: string;
  notes: string;
}

export const INSTITUTIONAL_FUTURE_CAPABILITIES: readonly InstitutionalFutureCapability[] = [
  {
    id: "IF-CAP-ONBOARD",
    capability: "Onboard clients with staged diligence",
    readiness: "active-build",
    module: "client-portal",
    notes: "KYC/KYB readiness and access controls are workflow-gated.",
  },
  {
    id: "IF-CAP-POF-SBLC",
    capability: "Manage POF and SBLC evidence packages",
    readiness: "active-build",
    module: "proof-room",
    notes: "Evidence storage and approval sequencing required before release.",
  },
  {
    id: "IF-CAP-RWA",
    capability: "Intake RWA assets with custody/title requirements",
    readiness: "active-build",
    module: "rwa-intake",
    notes: "Title, valuation, legal, and custody checkpoints are mandatory.",
  },
  {
    id: "IF-CAP-RAILS",
    capability: "Evaluate banking and stablecoin rails",
    readiness: "design-phase",
    module: "rail-evaluation",
    notes: "Provider dependencies and compliance approvals control progression.",
  },
  {
    id: "IF-CAP-XRPL",
    capability: "Simulate XRPL routes and conversions",
    readiness: "active-build",
    module: "xrpl-simulation",
    notes: "Simulation-first mode only until provider and compliance approval.",
  },
  {
    id: "IF-CAP-AI",
    capability: "Publish AI-readable trust and source maps",
    readiness: "active-build",
    module: "ai-trust",
    notes: "Machine-readable manifests and source registries support diligence workflows.",
  },
  {
    id: "IF-CAP-TELECOM",
    capability: "Support telecom concierge workflows in dry-run",
    readiness: "blocked-until-approval",
    module: "telecom",
    notes: "Provider, legal, and TCPA controls required before production.",
  },
  {
    id: "IF-CAP-X402",
    capability: "Enable x402 machine-payable report access",
    readiness: "design-phase",
    module: "x402",
    notes: "Commercial terms, legal classification, and provider controls pending.",
  },
];

export const INSTITUTIONAL_BLOCKED_ACTIONS: readonly string[] = [
  "No live banking transfer",
  "No live securities offering",
  "No live broker-dealer activity",
  "No fake POF",
  "No fake SBLC",
  "No live XRPL signing",
  "No live trading",
  "No public stablecoin launch",
  "No guaranteed liquidity",
  "No guaranteed returns",
  "No custody claims without provider approval",
  "No merchant count claims without dated source evidence",
];

export const INSTITUTIONAL_TRANSITION_MESSAGE =
  "Troptions spent years proving that digital value could be used in the real world. The next era is institutional infrastructure with source tracking, proof gates, custody controls, and compliance-aware operations.";
