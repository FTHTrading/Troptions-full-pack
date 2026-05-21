/**
 * TROPTIONS PayOps — Status Transition Engine
 *
 * EXECUTION RULE: "executed" status can only be granted by a confirmed
 * real adapter result. Mock and manual_proof adapters cannot produce
 * "executed" status. They cap at "approved_not_executed".
 *
 * COMPLIANCE RULE: "blocked_by_compliance" is a terminal block state.
 * A blocked payout cannot move to any execution state.
 */

import type { PayoutStatus, AdapterCategory } from "./types";

// ─── Valid Transitions ────────────────────────────────────────────────────────

/**
 * Maps each status to the set of statuses it may transition to.
 * The "executed" target is guarded separately by adapter checks.
 */
export const VALID_PAYOUT_TRANSITIONS: Record<PayoutStatus, PayoutStatus[]> = {
  draft: ["pending_approval", "cancelled"],
  pending_approval: ["approved_not_executed", "cancelled", "blocked_by_compliance"],
  approved_not_executed: ["execution_pending", "cancelled", "blocked_by_compliance"],
  execution_pending: ["executed", "failed", "blocked_by_compliance"],
  executed: [], // terminal
  failed: ["draft"], // can be re-drafted
  cancelled: [], // terminal
  blocked_by_compliance: ["draft"], // can only be reset after compliance resolution
};

// ─── Adapters that can produce "executed" ────────────────────────────────────

/**
 * Only these adapter categories can cause a payout to reach "executed" status.
 * Mock and manual_proof adapters are explicitly excluded.
 */
const EXECUTION_CAPABLE_ADAPTERS: AdapterCategory[] = [
  "bank_partner",
  "payroll_partner",
  "wallet_partner",
  "stablecoin_partner",
  "card_partner",
];

// ─── Transition Guards ────────────────────────────────────────────────────────

/**
 * Returns true if the given status transition is structurally valid.
 * Does NOT check adapter configuration — use canExecute() for that.
 */
export function isValidTransition(from: PayoutStatus, to: PayoutStatus): boolean {
  return VALID_PAYOUT_TRANSITIONS[from].includes(to);
}

/**
 * Returns true if the adapter category is capable of producing confirmed executions.
 * Mock and manual_proof adapters always return false.
 */
export function adapterCanExecute(category: AdapterCategory): boolean {
  return EXECUTION_CAPABLE_ADAPTERS.includes(category);
}

/**
 * Returns true if a payout is in a terminal state (no further transitions possible
 * without explicit reset).
 */
export function isTerminalStatus(status: PayoutStatus): boolean {
  return status === "executed" || status === "cancelled";
}

/**
 * Returns true if the payout is blocked — no execution may proceed.
 */
export function isBlocked(status: PayoutStatus): boolean {
  return status === "blocked_by_compliance";
}

/**
 * Attempts to transition a payout from `from` to `to`.
 * Returns the new status on success, or an error string.
 *
 * Rules enforced:
 * 1. Transition must be in VALID_PAYOUT_TRANSITIONS.
 * 2. If to === "executed", adapterCategory must be in EXECUTION_CAPABLE_ADAPTERS.
 * 3. "blocked_by_compliance" cannot transition to any execution state.
 */
export function transitionPayoutStatus(
  from: PayoutStatus,
  to: PayoutStatus,
  adapterCategory: AdapterCategory
): { ok: true; status: PayoutStatus } | { ok: false; error: string } {
  // Guard: blocked state
  if (from === "blocked_by_compliance" && to !== "draft") {
    return {
      ok: false,
      error:
        "Payout is blocked by compliance. Resolve the compliance issue and reset to draft before resubmitting.",
    };
  }

  // Guard: valid transition
  if (!isValidTransition(from, to)) {
    return {
      ok: false,
      error: `Invalid transition: ${from} → ${to}. Allowed from ${from}: [${VALID_PAYOUT_TRANSITIONS[from].join(", ")}]`,
    };
  }

  // Guard: execution_pending and executed both require a capable adapter
  if ((to === "executed" || to === "execution_pending") && !adapterCanExecute(adapterCategory)) {
    return {
      ok: false,
      error: `Adapter category "${adapterCategory}" cannot request or confirm execution. ` +
        `Execution requires a configured bank_partner, payroll_partner, wallet_partner, ` +
        `stablecoin_partner, or card_partner adapter in production mode.`,
    };
  }

  return { ok: true, status: to };
}

// ─── Status Display Helpers ───────────────────────────────────────────────────

export type StatusColorScheme = {
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export const PAYOUT_STATUS_COLORS: Record<PayoutStatus, StatusColorScheme> = {
  draft: {
    bg: "bg-slate-800/60",
    text: "text-slate-300",
    border: "border-slate-600/50",
    dot: "bg-slate-400",
  },
  pending_approval: {
    bg: "bg-yellow-900/60",
    text: "text-yellow-300",
    border: "border-yellow-700/50",
    dot: "bg-yellow-400",
  },
  approved_not_executed: {
    bg: "bg-blue-900/60",
    text: "text-blue-300",
    border: "border-blue-700/50",
    dot: "bg-blue-400",
  },
  execution_pending: {
    bg: "bg-cyan-900/60",
    text: "text-cyan-300",
    border: "border-cyan-700/50",
    dot: "bg-cyan-400",
  },
  executed: {
    bg: "bg-emerald-900/60",
    text: "text-emerald-300",
    border: "border-emerald-700/50",
    dot: "bg-emerald-400",
  },
  failed: {
    bg: "bg-red-900/60",
    text: "text-red-300",
    border: "border-red-700/50",
    dot: "bg-red-400",
  },
  cancelled: {
    bg: "bg-gray-800/60",
    text: "text-gray-400",
    border: "border-gray-600/50",
    dot: "bg-gray-500",
  },
  blocked_by_compliance: {
    bg: "bg-orange-900/60",
    text: "text-orange-300",
    border: "border-orange-700/50",
    dot: "bg-orange-400",
  },
};

export const COMPLIANCE_STATUS_COLORS: Record<string, StatusColorScheme> = {
  not_started: {
    bg: "bg-slate-800/60",
    text: "text-slate-400",
    border: "border-slate-600/50",
    dot: "bg-slate-500",
  },
  pending: {
    bg: "bg-yellow-900/60",
    text: "text-yellow-300",
    border: "border-yellow-700/50",
    dot: "bg-yellow-400",
  },
  approved: {
    bg: "bg-emerald-900/60",
    text: "text-emerald-300",
    border: "border-emerald-700/50",
    dot: "bg-emerald-400",
  },
  rejected: {
    bg: "bg-red-900/60",
    text: "text-red-300",
    border: "border-red-700/50",
    dot: "bg-red-400",
  },
  expired: {
    bg: "bg-orange-900/60",
    text: "text-orange-300",
    border: "border-orange-700/50",
    dot: "bg-orange-400",
  },
  manual_review: {
    bg: "bg-purple-900/60",
    text: "text-purple-300",
    border: "border-purple-700/50",
    dot: "bg-purple-400",
  },
  blocked: {
    bg: "bg-red-900/80",
    text: "text-red-200",
    border: "border-red-600/60",
    dot: "bg-red-500",
  },
};
