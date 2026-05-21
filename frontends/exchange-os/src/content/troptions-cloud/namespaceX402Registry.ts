/**
 * Troptions Cloud — Namespace x402 Readiness Registry
 *
 * Defines x402 payment readiness and usage metering configuration
 * for every Troptions namespace.
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   x402Enabled: false         — for ALL namespaces
 *   simulationOnly: true       — for ALL namespaces
 *   livePaymentsEnabled: false — for ALL namespaces
 *
 * No live payments, no live wallet movement, no external settlement.
 * All usage events are simulation-only records in the Control Hub.
 */

import type { NamespaceX402Profile, X402ServicePricingTemplate } from "@/lib/troptions-cloud/namespaceAiX402Types";

// ─── Action identifiers ───────────────────────────────────────────────────────

export const X402_ACTIONS = {
  AI_PROMPT: "ai_prompt",
  AI_AGENT_RUN: "ai_agent_run",
  KNOWLEDGE_VAULT_SEARCH: "knowledge_vault_search",
  REPORT_EXPORT: "report_export",
  DOCUMENT_HASH: "document_hash",
  PROOF_PACKET_GENERATE: "proof_packet_generate",
  WEB3_READINESS_REPORT: "web3_readiness_report",
  XRPL_ROUTE_SIMULATION: "xrpl_route_simulation",
  STELLAR_ROUTE_SIMULATION: "stellar_route_simulation",
  MEMBERSHIP_ACCESS_SIMULATION: "membership_access_simulation",
} as const;

// ─── Default pricing templates ────────────────────────────────────────────────

const STANDARD_PRICING: X402ServicePricingTemplate[] = [
  { actionId: X402_ACTIONS.AI_PROMPT, actionLabel: "AI Prompt", simulatedCreditCost: 1, currency: "TROPTIONS_CREDIT", membershipRequirement: "member", approvalRequired: false },
  { actionId: X402_ACTIONS.AI_AGENT_RUN, actionLabel: "AI Agent Run", simulatedCreditCost: 5, currency: "TROPTIONS_CREDIT", membershipRequirement: "creator", approvalRequired: false },
  { actionId: X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, actionLabel: "Knowledge Vault Search", simulatedCreditCost: 0, currency: "TROPTIONS_CREDIT", membershipRequirement: "member", approvalRequired: false },
  { actionId: X402_ACTIONS.REPORT_EXPORT, actionLabel: "Report Export", simulatedCreditCost: 2, currency: "TROPTIONS_CREDIT", membershipRequirement: "creator", approvalRequired: false },
  { actionId: X402_ACTIONS.DOCUMENT_HASH, actionLabel: "Document Hash", simulatedCreditCost: 1, currency: "TROPTIONS_CREDIT", membershipRequirement: "member", approvalRequired: false },
  { actionId: X402_ACTIONS.PROOF_PACKET_GENERATE, actionLabel: "Proof Packet", simulatedCreditCost: 3, currency: "TROPTIONS_CREDIT", membershipRequirement: "creator", approvalRequired: true },
  { actionId: X402_ACTIONS.WEB3_READINESS_REPORT, actionLabel: "Web3 Readiness Report", simulatedCreditCost: 5, currency: "TROPTIONS_CREDIT", membershipRequirement: "business", approvalRequired: true },
  { actionId: X402_ACTIONS.XRPL_ROUTE_SIMULATION, actionLabel: "XRPL Route Simulation", simulatedCreditCost: 10, currency: "TROPTIONS_CREDIT", membershipRequirement: "business", approvalRequired: true },
  { actionId: X402_ACTIONS.STELLAR_ROUTE_SIMULATION, actionLabel: "Stellar Route Simulation", simulatedCreditCost: 10, currency: "TROPTIONS_CREDIT", membershipRequirement: "business", approvalRequired: true },
  { actionId: X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION, actionLabel: "Membership Access Simulation", simulatedCreditCost: 0, currency: "TROPTIONS_CREDIT", membershipRequirement: null, approvalRequired: false },
];

const ENTERPRISE_PRICING: X402ServicePricingTemplate[] = [
  ...STANDARD_PRICING.map((p) => ({ ...p, simulatedCreditCost: p.simulatedCreditCost * 0.5 })), // 50% discount
];

// ─── Membership plan → allowed actions mapping ────────────────────────────────

const STANDARD_PLAN_MAPPING: Record<string, string[]> = {
  visitor: [X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
  registered: [X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH],
  member: [
    X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
    X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
    X402_ACTIONS.AI_PROMPT,
    X402_ACTIONS.DOCUMENT_HASH,
  ],
  creator: [
    X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
    X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
    X402_ACTIONS.AI_PROMPT,
    X402_ACTIONS.AI_AGENT_RUN,
    X402_ACTIONS.DOCUMENT_HASH,
    X402_ACTIONS.REPORT_EXPORT,
  ],
  business: [
    X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
    X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
    X402_ACTIONS.AI_PROMPT,
    X402_ACTIONS.AI_AGENT_RUN,
    X402_ACTIONS.DOCUMENT_HASH,
    X402_ACTIONS.REPORT_EXPORT,
    X402_ACTIONS.PROOF_PACKET_GENERATE,
    X402_ACTIONS.WEB3_READINESS_REPORT,
  ],
  professional: [
    X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
    X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
    X402_ACTIONS.AI_PROMPT,
    X402_ACTIONS.AI_AGENT_RUN,
    X402_ACTIONS.DOCUMENT_HASH,
    X402_ACTIONS.REPORT_EXPORT,
    X402_ACTIONS.PROOF_PACKET_GENERATE,
    X402_ACTIONS.WEB3_READINESS_REPORT,
    X402_ACTIONS.XRPL_ROUTE_SIMULATION,
    X402_ACTIONS.STELLAR_ROUTE_SIMULATION,
  ],
  enterprise: Object.values(X402_ACTIONS),
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const NAMESPACE_X402_REGISTRY: NamespaceX402Profile[] = [
  {
    namespaceId: "troptions",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM", "XRP_SIM", "XLM_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [
      X402_ACTIONS.AI_PROMPT,
      X402_ACTIONS.AI_AGENT_RUN,
      X402_ACTIONS.REPORT_EXPORT,
      X402_ACTIONS.DOCUMENT_HASH,
      X402_ACTIONS.PROOF_PACKET_GENERATE,
    ],
    freeActions: [
      X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
      X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
    ],
    approvalRequiredActions: [
      X402_ACTIONS.WEB3_READINESS_REPORT,
      X402_ACTIONS.XRPL_ROUTE_SIMULATION,
      X402_ACTIONS.STELLAR_ROUTE_SIMULATION,
    ],
    blockedActions: [],
    complianceNotes: [
      "No live payments. All charges are simulated TROPTIONS credits.",
      "x402 rails are not live — simulation only.",
    ],
    recommendedNextAction: "Enable live x402 after Control Hub approval and legal review.",
  },

  {
    namespaceId: "troptions-enterprise",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM", "XRP_SIM", "XLM_SIM", "ENTERPRISE_CREDIT_SIM"],
    usageMeteringMode: "metered_simulation",
    creditLedgerMode: "balance_tracking_simulation",
    membershipPlanMapping: {
      ...STANDARD_PLAN_MAPPING,
      enterprise: Object.values(X402_ACTIONS),
    },
    servicePricingTemplates: ENTERPRISE_PRICING,
    paymentRequiredActions: [
      X402_ACTIONS.AI_AGENT_RUN,
      X402_ACTIONS.REPORT_EXPORT,
      X402_ACTIONS.PROOF_PACKET_GENERATE,
    ],
    freeActions: [
      X402_ACTIONS.AI_PROMPT,
      X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
      X402_ACTIONS.DOCUMENT_HASH,
      X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
    ],
    approvalRequiredActions: [
      X402_ACTIONS.WEB3_READINESS_REPORT,
      X402_ACTIONS.XRPL_ROUTE_SIMULATION,
      X402_ACTIONS.STELLAR_ROUTE_SIMULATION,
    ],
    blockedActions: [],
    complianceNotes: [
      "Enterprise namespace — metered simulation with balance tracking.",
      "No live payments. No live settlement.",
    ],
    recommendedNextAction: "Complete enterprise onboarding review before enabling live metering.",
  },

  {
    namespaceId: "troptions-health",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: {
      ...STANDARD_PLAN_MAPPING,
      member: [X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
      creator: [X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.AI_PROMPT, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    },
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.REPORT_EXPORT],
    freeActions: [X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [
      X402_ACTIONS.AI_AGENT_RUN,
      X402_ACTIONS.PROOF_PACKET_GENERATE,
      X402_ACTIONS.DOCUMENT_HASH,
    ],
    blockedActions: [
      X402_ACTIONS.XRPL_ROUTE_SIMULATION,
      X402_ACTIONS.STELLAR_ROUTE_SIMULATION,
      X402_ACTIONS.WEB3_READINESS_REPORT,
    ],
    complianceNotes: [
      "Healthcare namespace — highest safety posture.",
      "No PHI. No diagnosis. No treatment. No emergency guidance.",
      "All AI actions require approval. No live payments.",
    ],
    recommendedNextAction: "Complete HIPAA-equivalent compliance review before any expansion.",
  },

  {
    namespaceId: "troptions-media",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.REPORT_EXPORT],
    freeActions: [X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.PROOF_PACKET_GENERATE, X402_ACTIONS.WEB3_READINESS_REPORT],
    blockedActions: [X402_ACTIONS.XRPL_ROUTE_SIMULATION, X402_ACTIONS.STELLAR_ROUTE_SIMULATION],
    complianceNotes: ["Media namespace — standard simulation posture.", "No live payments."],
    recommendedNextAction: "Define content monetization policy before enabling live metering.",
  },

  {
    namespaceId: "troptions-business",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM", "XRP_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.REPORT_EXPORT, X402_ACTIONS.PROOF_PACKET_GENERATE],
    freeActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.WEB3_READINESS_REPORT, X402_ACTIONS.XRPL_ROUTE_SIMULATION],
    blockedActions: [X402_ACTIONS.STELLAR_ROUTE_SIMULATION],
    complianceNotes: ["Business namespace — standard simulation.", "No live payments."],
    recommendedNextAction: "Define business usage policy and complete legal review.",
  },

  {
    namespaceId: "troptions-ai",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM"],
    usageMeteringMode: "metered_simulation",
    creditLedgerMode: "balance_tracking_simulation",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.REPORT_EXPORT],
    freeActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [
      X402_ACTIONS.PROOF_PACKET_GENERATE,
      X402_ACTIONS.WEB3_READINESS_REPORT,
      X402_ACTIONS.XRPL_ROUTE_SIMULATION,
      X402_ACTIONS.STELLAR_ROUTE_SIMULATION,
    ],
    blockedActions: [],
    complianceNotes: ["AI platform namespace — metered simulation.", "No live payments, no external API calls."],
    recommendedNextAction: "Define AI platform pricing tiers before enabling live metering.",
  },

  {
    namespaceId: "troptions-real-estate",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.REPORT_EXPORT, X402_ACTIONS.PROOF_PACKET_GENERATE],
    freeActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.WEB3_READINESS_REPORT, X402_ACTIONS.XRPL_ROUTE_SIMULATION],
    blockedActions: [X402_ACTIONS.STELLAR_ROUTE_SIMULATION],
    complianceNotes: ["Real estate namespace. No investment advice. No live payments."],
    recommendedNextAction: "Complete real estate and investment compliance review.",
  },

  {
    namespaceId: "troptions-solar",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.REPORT_EXPORT],
    freeActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.PROOF_PACKET_GENERATE, X402_ACTIONS.WEB3_READINESS_REPORT],
    blockedActions: [X402_ACTIONS.XRPL_ROUTE_SIMULATION, X402_ACTIONS.STELLAR_ROUTE_SIMULATION],
    complianceNotes: ["Solar namespace. No live payments."],
    recommendedNextAction: "Define solar project financing policy before enabling live metering.",
  },

  {
    namespaceId: "troptions-education",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: {
      ...STANDARD_PLAN_MAPPING,
      visitor: [X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH],
      registered: [X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.AI_PROMPT],
    },
    servicePricingTemplates: STANDARD_PRICING.map((p) => ({ ...p, simulatedCreditCost: Math.max(0, p.simulatedCreditCost - 1) })),
    paymentRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.REPORT_EXPORT],
    freeActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.PROOF_PACKET_GENERATE, X402_ACTIONS.WEB3_READINESS_REPORT],
    blockedActions: [X402_ACTIONS.XRPL_ROUTE_SIMULATION, X402_ACTIONS.STELLAR_ROUTE_SIMULATION],
    complianceNotes: ["Education namespace — discounted simulation credits.", "No live payments."],
    recommendedNextAction: "Define education access model before enabling live metering.",
  },

  {
    namespaceId: "troptions-xchange",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM", "XRP_SIM", "XLM_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: {
      ...STANDARD_PLAN_MAPPING,
      business: [
        X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION,
        X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH,
        X402_ACTIONS.WEB3_READINESS_REPORT,
        X402_ACTIONS.XRPL_ROUTE_SIMULATION,
        X402_ACTIONS.STELLAR_ROUTE_SIMULATION,
      ],
    },
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.XRPL_ROUTE_SIMULATION, X402_ACTIONS.STELLAR_ROUTE_SIMULATION, X402_ACTIONS.WEB3_READINESS_REPORT],
    freeActions: [X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.PROOF_PACKET_GENERATE],
    blockedActions: [],
    complianceNotes: [
      "Xchange namespace — Web3 route simulations only. No live DEX execution.",
      "No live payments. No live wallet movement.",
    ],
    recommendedNextAction: "Complete Web3 compliance review before enabling live route execution.",
  },

  {
    namespaceId: "troptions-web3",
    x402Enabled: false,
    simulationOnly: true,
    livePaymentsEnabled: false,
    acceptedRails: ["TROPTIONS_CREDIT_SIM", "XRP_SIM"],
    usageMeteringMode: "simulation_only",
    creditLedgerMode: "simulation_only",
    membershipPlanMapping: STANDARD_PLAN_MAPPING,
    servicePricingTemplates: STANDARD_PRICING,
    paymentRequiredActions: [X402_ACTIONS.AI_AGENT_RUN, X402_ACTIONS.WEB3_READINESS_REPORT, X402_ACTIONS.PROOF_PACKET_GENERATE],
    freeActions: [X402_ACTIONS.AI_PROMPT, X402_ACTIONS.KNOWLEDGE_VAULT_SEARCH, X402_ACTIONS.MEMBERSHIP_ACCESS_SIMULATION],
    approvalRequiredActions: [X402_ACTIONS.XRPL_ROUTE_SIMULATION, X402_ACTIONS.STELLAR_ROUTE_SIMULATION],
    blockedActions: [],
    complianceNotes: ["Web3 namespace — no live contract deployment, no private key generation.", "No live payments."],
    recommendedNextAction: "Complete Web3 legal and compliance review.",
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getNamespaceX402Profile(
  namespaceId: string,
): NamespaceX402Profile | undefined {
  return NAMESPACE_X402_REGISTRY.find((p) => p.namespaceId === namespaceId);
}

export function getAllNamespaceX402Profiles(): NamespaceX402Profile[] {
  return NAMESPACE_X402_REGISTRY;
}

export function getNamespacesWithLivePaymentsDisabled(): NamespaceX402Profile[] {
  return NAMESPACE_X402_REGISTRY.filter((p) => !p.livePaymentsEnabled);
}
