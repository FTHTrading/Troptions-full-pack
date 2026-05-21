/**
 * Troptions Cloud — Namespace x402 Policy Engine
 *
 * Evaluates x402 payment/usage actions against namespace configuration,
 * membership plan, and action policy.
 *
 * SAFETY RULES (enforced at runtime):
 * 1. Live payments are disabled for all namespaces.
 * 2. All usage events are simulation-only records.
 * 3. No wallet movement. No card collection. No external settlement.
 * 4. Healthcare/financial/legal/investment actions require extra review.
 * 5. Every event is auditable with a unique auditToken.
 *
 * simulationOnly: true, livePaymentsEnabled: false — always.
 */

import crypto from "crypto";
import {
  getNamespaceX402Profile,
} from "@/content/troptions-cloud/namespaceX402Registry";
import type {
  NamespaceX402PaymentDecision,
  NamespaceX402UsageEvent,
  NamespaceX402CreditLedgerEntry,
  X402ActionPolicy,
} from "@/lib/troptions-cloud/namespaceAiX402Types";

// ─── Internal evaluation result ───────────────────────────────────────────────

interface X402ActionEvaluation {
  actionId: string;
  policy: "free" | "metered" | "approval_required" | "blocked";
  reason: string | null;
  simulatedCreditCost: number;
  currency: "TROPTIONS_CREDIT" | "XRP_SIM" | "XLM_SIM" | "USD_SIM";
}

// ─── Decision builder ─────────────────────────────────────────────────────────

export function createX402PaymentDecision(
  partial: Omit<
    NamespaceX402PaymentDecision,
    "simulationOnly" | "livePaymentTriggered" | "timestamp" | "auditToken"
  >,
): NamespaceX402PaymentDecision {
  return {
    ...partial,
    simulationOnly: true,
    livePaymentTriggered: false,
    timestamp: new Date().toISOString(),
    auditToken: `x402-decision-${crypto.randomUUID()}`,
  };
}

// ─── Action policy lookup ─────────────────────────────────────────────────────

export function evaluateX402PaymentRequirement(params: {
  namespaceId: string;
  actionId: string;
}): X402ActionEvaluation {
  const { namespaceId, actionId } = params;

  const profile = getNamespaceX402Profile(namespaceId);
  if (!profile) {
    return {
      actionId,
      policy: "blocked",
      reason: `Namespace '${namespaceId}' not found in x402 registry.`,
      simulatedCreditCost: 0,
      currency: "TROPTIONS_CREDIT",
    };
  }

  if (profile.blockedActions.includes(actionId)) {
    return { actionId, policy: "blocked", reason: `Action '${actionId}' is blocked for namespace '${namespaceId}'.`, simulatedCreditCost: 0, currency: "TROPTIONS_CREDIT" };
  }

  if (profile.approvalRequiredActions.includes(actionId)) {
    const template = profile.servicePricingTemplates.find((t) => t.actionId === actionId);
    return {
      actionId,
      policy: "approval_required",
      reason: `Action '${actionId}' requires Control Hub approval.`,
      simulatedCreditCost: template?.simulatedCreditCost ?? 0,
      currency: template?.currency ?? "TROPTIONS_CREDIT",
    };
  }

  if (profile.freeActions.includes(actionId)) {
    return { actionId, policy: "free", reason: null, simulatedCreditCost: 0, currency: "TROPTIONS_CREDIT" };
  }

  if (profile.paymentRequiredActions.includes(actionId)) {
    const template = profile.servicePricingTemplates.find((t) => t.actionId === actionId);
    return {
      actionId,
      policy: "metered",
      reason: null,
      simulatedCreditCost: template?.simulatedCreditCost ?? 1,
      currency: template?.currency ?? "TROPTIONS_CREDIT",
    };
  }

  // Unknown action → require approval by default
  return {
    actionId,
    policy: "approval_required",
    reason: `Action '${actionId}' is unknown — defaulting to approval_required.`,
    simulatedCreditCost: 0,
    currency: "TROPTIONS_CREDIT",
  };
}

// ─── Membership access check ──────────────────────────────────────────────────

export function evaluateX402MembershipAccess(params: {
  namespaceId: string;
  actionId: string;
  membershipPlan: string;
}): { allowed: boolean; reason: string | null } {
  const { namespaceId, actionId, membershipPlan } = params;

  const profile = getNamespaceX402Profile(namespaceId);
  if (!profile) {
    return { allowed: false, reason: `Namespace '${namespaceId}' not found.` };
  }

  const planActions = profile.membershipPlanMapping[membershipPlan];
  if (!planActions) {
    return { allowed: false, reason: `Membership plan '${membershipPlan}' not found for namespace '${namespaceId}'.` };
  }

  if (!planActions.includes(actionId)) {
    return {
      allowed: false,
      reason: `Action '${actionId}' is not included in membership plan '${membershipPlan}' for namespace '${namespaceId}'.`,
    };
  }

  return { allowed: true, reason: null };
}

// ─── Main evaluations ─────────────────────────────────────────────────────────

export function evaluateX402Action(params: {
  namespaceId: string;
  actionId: string;
  memberId: string;
  membershipPlan: string;
}): NamespaceX402PaymentDecision {
  const { namespaceId, actionId, memberId, membershipPlan } = params;

  const profile = getNamespaceX402Profile(namespaceId);
  if (!profile) {
    return createX402PaymentDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      actionId,
      decision: "block",
      blockReason: `Namespace '${namespaceId}' not found in x402 registry.`,
      approvalReason: null,
      simulatedCreditCost: 0,
      membershipPlan,
    });
  }

  // Check blocked
  if (profile.blockedActions.includes(actionId)) {
    return createX402PaymentDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      actionId,
      decision: "block",
      blockReason: `Action '${actionId}' is blocked for namespace '${namespaceId}'.`,
      approvalReason: null,
      simulatedCreditCost: 0,
      membershipPlan,
    });
  }

  // Check membership access
  const membershipCheck = evaluateX402MembershipAccess({ namespaceId, actionId, membershipPlan });
  if (!membershipCheck.allowed) {
    return createX402PaymentDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      actionId,
      decision: "block",
      blockReason: membershipCheck.reason ?? "Membership plan does not include this action.",
      approvalReason: null,
      simulatedCreditCost: 0,
      membershipPlan,
    });
  }

  // Get action policy
  const actionPolicy = evaluateX402PaymentRequirement({ namespaceId, actionId });
  const cost = actionPolicy.simulatedCreditCost;

  if (actionPolicy.policy === "blocked") {
    return createX402PaymentDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      actionId,
      decision: "block",
      blockReason: actionPolicy.reason ?? "Action is blocked.",
      approvalReason: null,
      simulatedCreditCost: 0,
      membershipPlan,
    });
  }

  if (actionPolicy.policy === "approval_required") {
    return createX402PaymentDecision({
      decisionId: crypto.randomUUID(),
      namespaceId,
      memberId,
      actionId,
      decision: "require_approval",
      blockReason: null,
      approvalReason: actionPolicy.reason ?? "Action requires Control Hub approval.",
      simulatedCreditCost: cost,
      membershipPlan,
    });
  }

  const isFree = actionPolicy.policy === "free";
  return createX402PaymentDecision({
    decisionId: crypto.randomUUID(),
    namespaceId,
    memberId,
    actionId,
    decision: isFree ? "allow_free" : "allow_metered",
    blockReason: null,
    approvalReason: null,
    simulatedCreditCost: cost,
    membershipPlan,
  });
}

export function simulateX402UsageCharge(params: {
  namespaceId: string;
  actionId: string;
  memberId: string;
  membershipPlan: string;
}): NamespaceX402UsageEvent {
  const { namespaceId, actionId, memberId, membershipPlan } = params;

  const decision = evaluateX402Action({ namespaceId, actionId, memberId, membershipPlan });
  const template = getNamespaceX402Profile(namespaceId)?.servicePricingTemplates.find((t) => t.actionId === actionId);
  const actionPolicy = evaluateX402PaymentRequirement({ namespaceId, actionId });
  const policyLabel: X402ActionPolicy = actionPolicy.policy;

  return {
    id: `usage-${crypto.randomUUID()}`,
    namespaceId,
    memberId,
    actionId,
    actionLabel: template?.actionLabel ?? actionId,
    simulatedCreditCost: decision.simulatedCreditCost,
    currency: actionPolicy.currency,
    membershipPlan,
    policy: policyLabel,
    chargeMode: "simulation",
    timestamp: new Date().toISOString(),
    controlHubTaskId: null,
    auditToken: `usage-${crypto.randomUUID()}`,
  };
}

export function simulateX402CreditDebit(params: {
  namespaceId: string;
  memberId: string;
  amount: number;
  referenceActionId: string | null;
  type: "credit" | "debit" | "reserve" | "release";
}): NamespaceX402CreditLedgerEntry {
  const { namespaceId, memberId, amount, referenceActionId, type } = params;

  return {
    id: `ledger-${crypto.randomUUID()}`,
    namespaceId,
    memberId,
    type,
    simulatedAmount: amount,
    currency: "TROPTIONS_CREDIT",
    referenceActionId,
    ledgerMode: "simulation",
    balanceAfter: 0, // simulation does not track real balance
    auditToken: `ledger-${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
  };
}
