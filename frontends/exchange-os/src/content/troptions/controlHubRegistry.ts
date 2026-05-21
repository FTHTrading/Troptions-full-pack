import { CLAWD_CAPABILITIES, CLAWD_SYSTEM_PROMPT_CONSTRAINTS } from "@/content/troptions/clawdCapabilities";
import { OPENCLAW_ALLOWED_ACTIONS, OPENCLAW_BLOCKED_ACTIONS } from "@/content/troptions/openClawPolicyRegistry";
import { JEFE_ALLOWED_ACTIONS, JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";
import { OPENCLAW_AGENT_REGISTRY } from "@/content/troptions/openClawAgentRegistry";
import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";

// ─── types ───────────────────────────────────────────────────────────────────

export type AgentTier = "fast" | "deep" | "specialist";
export type GovernanceModel = "approval-gated" | "simulation-only" | "read-only";
export type IntentCategory =
  | "retrieve"
  | "summarize"
  | "simulate"
  | "generate"
  | "explain"
  | "approve"
  | "execute";

export interface ControlHubAgentTier {
  tier: AgentTier;
  label: string;
  description: string;
  agents: string[];
  governanceModel: GovernanceModel;
  humanApprovalRequired: boolean;
}

export interface ClawdRoutingRule {
  intentPattern: string;
  routedTo: string[];
  reason: string;
  requiresApproval: boolean;
}

export interface ControlHubConfig {
  id: string;
  label: string;
  description: string;
  clawdAgentId: string;
  activeMode: "simulation-governed";
  constraintCount: number;
  allowedCapabilityCount: number;
  blockedCapabilityCount: number;
  enforcedPolicies: {
    openClawBlocked: number;
    jefeBlocked: number;
  };
  auditModel: "full-audit";
  humanReviewRequired: true;
}

// ─── governance tiers ─────────────────────────────────────────────────────────

export const CONTROL_HUB_AGENT_TIERS: ControlHubAgentTier[] = [
  {
    tier: "fast",
    label: "Fast Tier — Jefe",
    description: "Dashboard co-pilot and task dispatcher. Simulation-safe. Reads registries, routes tasks, drafts checklists.",
    agents: OPENCLAW_AGENT_REGISTRY.filter((a) => a.tier === "fast").map((a) => a.label),
    governanceModel: "simulation-only",
    humanApprovalRequired: false,
  },
  {
    tier: "deep",
    label: "Deep Tier — Clawd",
    description: "Governed reasoning engine. Constrained to read, explain, summarize, and draft. Cannot approve, sign, or execute.",
    agents: OPENCLAW_AGENT_REGISTRY.filter((a) => a.tier === "deep").map((a) => a.label),
    governanceModel: "approval-gated",
    humanApprovalRequired: true,
  },
  {
    tier: "specialist",
    label: "Specialist Tier",
    description: "Domain-specific simulated agents for x402, XRPL, wallets, compliance, site-ops, and trading.",
    agents: OPENCLAW_AGENT_REGISTRY.filter((a) => a.tier === "specialist").map((a) => a.label),
    governanceModel: "simulation-only",
    humanApprovalRequired: false,
  },
];

// ─── Clawd routing rules ──────────────────────────────────────────────────────

export const CLAWD_ROUTING_RULES: ClawdRoutingRule[] = [
  {
    intentPattern: "board-package",
    routedTo: ["clawd", "rag-agent"],
    reason: "Board packages require deep reasoning and source-grounded citations.",
    requiresApproval: true,
  },
  {
    intentPattern: "audit-summary",
    routedTo: ["clawd"],
    reason: "Audit summaries require governance-aware context and structured output.",
    requiresApproval: false,
  },
  {
    intentPattern: "policy-explanation",
    routedTo: ["clawd"],
    reason: "Policy explanations require authoritative constraint context from Clawd.",
    requiresApproval: false,
  },
  {
    intentPattern: "x402-readiness",
    routedTo: ["jefe", "x402-agent"],
    reason: "x402 readiness checks are handled by Jefe (fast) + x402 specialist agent.",
    requiresApproval: false,
  },
  {
    intentPattern: "xrpl-readiness",
    routedTo: ["jefe", "xrpl-agent"],
    reason: "XRPL readiness delegated to Jefe + XRPL specialist.",
    requiresApproval: false,
  },
  {
    intentPattern: "site-check",
    routedTo: ["jefe", "site-ops-agent"],
    reason: "Site health checks are fast-tier: Jefe dispatches to site-ops-agent.",
    requiresApproval: false,
  },
  {
    intentPattern: "compliance-checklist",
    routedTo: ["jefe", "compliance-agent"],
    reason: "Compliance checklists are drafted by the compliance specialist with Jefe routing.",
    requiresApproval: true,
  },
  {
    intentPattern: "draft-report",
    routedTo: ["clawd"],
    reason: "Institutional report drafting requires Clawd's constrained generation.",
    requiresApproval: true,
  },
];

// ─── Jefe commands that invoke Clawd ─────────────────────────────────────────

export const JEFE_CLAWD_COMMANDS = JEFE_COMMAND_REGISTRY.filter((cmd) =>
  cmd.routedAgents.includes("clawd")
);

// ─── control hub config (computed from registries) ───────────────────────────

export const CONTROL_HUB_CONFIG: ControlHubConfig = {
  id: "troptions-control-hub",
  label: "Troptions Governed Clawd Control Hub",
  description:
    "Central governance layer for Clawd integration into the Troptions institutional OS. " +
    "Enforces capability constraints, routes intents to the correct agent tier, and maintains a full audit trail.",
  clawdAgentId: "clawd",
  activeMode: "simulation-governed",
  constraintCount: CLAWD_SYSTEM_PROMPT_CONSTRAINTS.length,
  allowedCapabilityCount: CLAWD_CAPABILITIES.filter((c) => c.allowed).length,
  blockedCapabilityCount: CLAWD_CAPABILITIES.filter((c) => !c.allowed).length,
  enforcedPolicies: {
    openClawBlocked: OPENCLAW_BLOCKED_ACTIONS.length,
    jefeBlocked: JEFE_BLOCKED_ACTIONS.length,
  },
  auditModel: "full-audit",
  humanReviewRequired: true,
};

// ─── allowed + blocked action counts for display ─────────────────────────────

export const CONTROL_HUB_POLICY_SUMMARY = {
  clawdAllowed: CLAWD_CAPABILITIES.filter((c) => c.allowed).map((c) => ({ id: c.id, label: c.label, category: c.category })),
  clawdBlocked: CLAWD_CAPABILITIES.filter((c) => !c.allowed).map((c) => ({ id: c.id, label: c.label, reason: c.description })),
  openClawAllowed: [...OPENCLAW_ALLOWED_ACTIONS],
  openClawBlocked: [...OPENCLAW_BLOCKED_ACTIONS],
  jefeAllowed: [...JEFE_ALLOWED_ACTIONS],
  jefeBlocked: [...JEFE_BLOCKED_ACTIONS],
  constraints: [...CLAWD_SYSTEM_PROMPT_CONSTRAINTS],
} as const;
