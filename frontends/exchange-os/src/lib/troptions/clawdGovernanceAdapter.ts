import { CLAWD_CAPABILITIES, CLAWD_SYSTEM_PROMPT_CONSTRAINTS } from "@/content/troptions/clawdCapabilities";
import { OPENCLAW_BLOCKED_ACTIONS } from "@/content/troptions/openClawPolicyRegistry";
import { JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";
import { CLAWD_ROUTING_RULES, CONTROL_HUB_CONFIG } from "@/content/troptions/controlHubRegistry";

// ─── types ────────────────────────────────────────────────────────────────────

export interface GovernedPlanStep {
  step: number;
  action: string;
  description: string;
}

export interface GovernedPlan {
  ok: true;
  simulationOnly: true;
  intent: string;
  allowed: string[];
  blocked: { id: string; reason: string }[];
  appliedConstraints: string[];
  routedTo: string[];
  requiresApproval: boolean;
  routingReason: string;
  plan: GovernedPlanStep[];
  auditToken: string;
}

export interface GovernanceStatus {
  agentId: string;
  label: string;
  status: "online" | "simulated" | "offline";
  mode: string;
  constraintCount: number;
  allowedCapabilityCount: number;
  blockedCapabilityCount: number;
  enforcedPolicies: {
    openClawBlocked: number;
    jefeBlocked: number;
  };
  humanReviewRequired: boolean;
}

// ─── evaluate a free-text intent against governance policy ───────────────────

export function evaluateClawdIntent(intent: string): GovernedPlan {
  const intentLower = intent.toLowerCase();

  // Check if intent maps to any blocked capability
  const triggeredBlocked = CLAWD_CAPABILITIES.filter(
    (c) => !c.allowed && intentLower.includes(c.id.replace(/-/g, " "))
  );

  // Check if intent matches an OpenClaw blocked action
  const openClawTriggered = OPENCLAW_BLOCKED_ACTIONS.filter((action) =>
    intentLower.includes(action.replace(/-/g, " "))
  );

  // Check if intent matches a Jefe blocked action
  const jefeTriggered = JEFE_BLOCKED_ACTIONS.filter((action) =>
    intentLower.includes(action.replace(/-/g, " "))
  );

  // All blocked actions for this intent
  const blocked: GovernedPlan["blocked"] = [
    ...triggeredBlocked.map((c) => ({ id: c.id, reason: c.description })),
    ...openClawTriggered.map((a) => ({ id: a, reason: `OpenClaw policy: '${a}' is a blocked action` })),
    ...jefeTriggered.map((a) => ({ id: a, reason: `Jefe policy: '${a}' is a blocked action` })),
  ];

  // Allowed capabilities relevant to this intent
  const allowed = CLAWD_CAPABILITIES.filter((c) => c.allowed && intentLower.includes(c.id.replace(/-/g, " "))).map(
    (c) => c.id
  );

  // If no specific match, default to read/summarize/explain
  const resolvedAllowed =
    allowed.length > 0 ? allowed : ["retrieve-entity", "summarize-queue", "explain-gates"];

  // Find routing rule
  const rule = CLAWD_ROUTING_RULES.find((r) => intentLower.includes(r.intentPattern.replace(/-/g, " ")));
  const routedTo = rule ? rule.routedTo : ["clawd"];
  const requiresApproval = rule ? rule.requiresApproval : false;
  const routingReason = rule ? rule.reason : "Default routing to Clawd for deep reasoning.";

  // Deterministic audit token (NOT a secret — opaque reference for session linking only)
  const auditToken = `ctrl-${Date.now().toString(36)}-${intentLower.slice(0, 8).replace(/\s/g, "_")}`;

  return {
    ok: true,
    simulationOnly: true,
    intent,
    allowed: resolvedAllowed,
    blocked,
    appliedConstraints: [...CLAWD_SYSTEM_PROMPT_CONSTRAINTS],
    routedTo,
    requiresApproval,
    routingReason,
    plan: [
      { step: 1, action: "guard", description: "Evaluate intent against governance policy — check blocked actions" },
      { step: 2, action: "route", description: `Route to: ${routedTo.join(", ")}` },
      { step: 3, action: "retrieve", description: "Retrieve relevant entities and registry data" },
      { step: 4, action: "summarize", description: "Summarize with applied constraints and disclaimer" },
      ...(requiresApproval
        ? [{ step: 5, action: "escalate", description: "Escalate to human operator for approval before output is acted upon" }]
        : []),
    ],
    auditToken,
  };
}

// ─── get current governance status ───────────────────────────────────────────

export function getClawdGovernanceStatus(): GovernanceStatus {
  return {
    agentId: CONTROL_HUB_CONFIG.clawdAgentId,
    label: "Clawd",
    status: "online",
    mode: CONTROL_HUB_CONFIG.activeMode,
    constraintCount: CONTROL_HUB_CONFIG.constraintCount,
    allowedCapabilityCount: CONTROL_HUB_CONFIG.allowedCapabilityCount,
    blockedCapabilityCount: CONTROL_HUB_CONFIG.blockedCapabilityCount,
    enforcedPolicies: CONTROL_HUB_CONFIG.enforcedPolicies,
    humanReviewRequired: CONTROL_HUB_CONFIG.humanReviewRequired,
  };
}

// ─── check if a single action is blocked by any layer ─────────────────────────

export function isActionBlockedByGovernance(action: string): { blocked: boolean; blockedBy: string[] } {
  const blockedBy: string[] = [];

  const clawdBlock = CLAWD_CAPABILITIES.find((c) => !c.allowed && c.id === action);
  if (clawdBlock) blockedBy.push("clawd-capability-policy");

  if ((OPENCLAW_BLOCKED_ACTIONS as readonly string[]).includes(action)) {
    blockedBy.push("openclaw-policy");
  }

  if ((JEFE_BLOCKED_ACTIONS as readonly string[]).includes(action)) {
    blockedBy.push("jefe-policy");
  }

  return { blocked: blockedBy.length > 0, blockedBy };
}
