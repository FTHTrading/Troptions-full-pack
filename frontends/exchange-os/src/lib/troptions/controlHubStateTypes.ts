/**
 * Control Hub Governance State Types
 *
 * Defines the shape of every persisted record produced by the governed Clawd
 * integration layer.  These types are shared across the store, the API routes,
 * and the dashboard panel.
 *
 * SAFETY NOTE: "executed" status is reserved for future approval-gated actions.
 * It is intentionally unreachable from the current simulation-only govern route.
 */

// ─── task status ──────────────────────────────────────────────────────────────

export type ControlHubTaskStatus =
  | "requested"         // intent received, evaluation pending
  | "simulated"         // governance evaluated, simulation plan produced
  | "blocked"           // at least one capability blocked, no execution
  | "needs_approval"    // requiresApproval:true, awaiting human sign-off
  | "approved_not_executed"  // approval granted but execution not yet triggered
  | "queued"            // approved and queued for future execution
  | "executed"          // RESERVED — unreachable without approval gate
  | "failed"            // internal error during evaluation
  | "audited";          // audit entry recorded, lifecycle complete

// ─── task record ──────────────────────────────────────────────────────────────

export interface ControlHubTaskRecord {
  id: string;
  intent: string;
  status: ControlHubTaskStatus;
  auditToken: string;
  routedTo: string[];
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── simulation record ────────────────────────────────────────────────────────

export interface ControlHubSimulationRecord {
  id: string;
  taskId: string;
  simulationJson: string;   // full serialised GovernedPlan
  createdAt: string;
}

// ─── approval record ──────────────────────────────────────────────────────────

export type ControlHubApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

export interface ControlHubApprovalRecord {
  id: string;
  taskId: string;
  requiredFor: string;       // human-readable label
  status: ControlHubApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── audit entry ──────────────────────────────────────────────────────────────

export interface ControlHubAuditRecord {
  id: string;
  taskId: string;
  auditToken: string;
  intent: string;
  actionType: string;        // e.g. "govern-intent-evaluation"
  outcome: string;           // "simulated" | "blocked" | "needs-approval"
  blockedCount: number;
  requiresApproval: boolean;
  createdAt: string;
}

// ─── blocked action record ────────────────────────────────────────────────────

export interface ControlHubBlockedActionRecord {
  id: string;
  taskId: string;
  capabilityId: string;
  reason: string;
  createdAt: string;
}

// ─── recommendation record ────────────────────────────────────────────────────

export type ControlHubRecommendationPriority = "low" | "medium" | "high";

export interface ControlHubRecommendationRecord {
  id: string;
  taskId: string;
  recommendation: string;
  priority: ControlHubRecommendationPriority;
  createdAt: string;
}

// ─── state snapshot ───────────────────────────────────────────────────────────

export type ControlHubPersistenceMode =
  | "postgres"
  | "sqlite"
  | "unavailable";

export interface ControlHubStateSnapshot {
  totalTasks: number;
  totalSimulations: number;
  totalApprovalRequired: number;
  totalBlockedActions: number;
  totalAuditEntries: number;
  totalRecommendations: number;
  lastUpdatedAt: string | null;
  persistenceMode: ControlHubPersistenceMode;
}

// ─── create inputs ────────────────────────────────────────────────────────────

export interface CreateControlHubTaskInput {
  intent: string;
  status: ControlHubTaskStatus;
  auditToken: string;
  routedTo: string[];
  requiresApproval: boolean;
}

export interface CreateControlHubSimulationInput {
  taskId: string;
  simulationJson: string;
}

export interface CreateControlHubApprovalInput {
  taskId: string;
  requiredFor: string;
  status: ControlHubApprovalStatus;
}

export interface CreateControlHubAuditInput {
  taskId: string;
  auditToken: string;
  intent: string;
  actionType: string;
  outcome: string;
  blockedCount: number;
  requiresApproval: boolean;
}

export interface CreateControlHubBlockedActionInput {
  taskId: string;
  capabilityId: string;
  reason: string;
}

export interface CreateControlHubRecommendationInput {
  taskId: string;
  recommendation: string;
  priority: ControlHubRecommendationPriority;
}
