export type ActionStatus = "pending" | "running" | "completed" | "failed" | "blocked";

export interface ControlPlaneAction {
  actionId: string;
  actionType:
    | "workflow-transition"
    | "approval-request"
    | "approval-decision"
    | "exception-resolution"
    | "alert-acknowledge"
    | "release-gate-evaluation";
  subjectId: string;
  subjectType: "asset" | "claim" | "proof" | "funding" | "settlement" | "workflow" | "exception";
  requestedBy: string;
  status: ActionStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export const ACTION_REGISTRY: ControlPlaneAction[] = [
  {
    actionId: "ACT-001",
    actionType: "approval-request",
    subjectId: "ASSET-TGOLD-001",
    subjectType: "asset",
    requestedBy: "issuer-admin-1",
    status: "pending",
    reason: "Request legal and custody approvals for issuance readiness.",
    createdAt: "2026-04-25T09:30:00.000Z",
    updatedAt: "2026-04-25T09:30:00.000Z",
  },
  {
    actionId: "ACT-002",
    actionType: "exception-resolution",
    subjectId: "EXC-001",
    subjectType: "exception",
    requestedBy: "custody-officer-1",
    status: "running",
    reason: "Resolve custody agreement blocker.",
    createdAt: "2026-04-25T10:30:00.000Z",
    updatedAt: "2026-04-25T11:00:00.000Z",
  },
  {
    actionId: "ACT-003",
    actionType: "release-gate-evaluation",
    subjectId: "GATE-SETTLEMENT-001",
    subjectType: "settlement",
    requestedBy: "compliance-officer-1",
    status: "blocked",
    reason: "Settlement gate check failed due to readiness blockers.",
    createdAt: "2026-04-25T12:00:00.000Z",
    updatedAt: "2026-04-25T12:05:00.000Z",
  },
];

export function getPendingActions(): ControlPlaneAction[] {
  return ACTION_REGISTRY.filter((item) => item.status === "pending" || item.status === "running");
}
