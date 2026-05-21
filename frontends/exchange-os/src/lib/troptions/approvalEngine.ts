import {
  APPROVAL_REGISTRY,
  type ApprovalRecord,
  type ApprovalStatus,
  type ApprovalType,
  getPendingApprovals,
} from "@/content/troptions/approvalRegistry";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";
import { assertAuthorized } from "@/lib/troptions/authorizationEngine";
import { appendAuditEvent } from "@/lib/troptions/auditLogEngine";
import {
  ensureControlPlanePersistenceLoaded,
  persistApprovalRegistry,
} from "@/lib/troptions/controlPlanePersistence";

export interface RequestApprovalInput {
  subjectId: string;
  subjectType: ApprovalRecord["subjectType"];
  approvalType: ApprovalType;
  requestedBy: string;
  assignedTo: string;
  actorRole: TroptionsRole;
  evidenceIds: string[];
  notes: string;
}

export interface DecideApprovalInput {
  approvalId: string;
  actorId: string;
  actorRole: TroptionsRole;
  decisionReason: string;
}

const APPROVAL_ROLE_BY_TYPE: Record<ApprovalType, TroptionsRole> = {
  "legal-approval": "legal-reviewer",
  "custody-approval": "custody-officer",
  "compliance-approval": "compliance-officer",
  "proof-approval": "proof-reviewer",
  "board-approval": "board-member",
  "funding-approval": "compliance-officer",
  "issuance-approval": "board-member",
  "settlement-approval": "compliance-officer",
  "disclosure-approval": "legal-reviewer",
  "emergency-override-approval": "super-admin",
};

function createApprovalId(type: ApprovalType): string {
  const short = type.replace("-approval", "").toUpperCase();
  return `APR-${short}-${Date.now()}`;
}

export function requestApproval(input: RequestApprovalInput): ApprovalRecord {
  ensureControlPlanePersistenceLoaded();
  assertAuthorized(input.actorRole, "request-approval");

  const requiredRole = APPROVAL_ROLE_BY_TYPE[input.approvalType];
  const now = new Date().toISOString();
  const record: ApprovalRecord = {
    approvalId: createApprovalId(input.approvalType),
    subjectId: input.subjectId,
    subjectType: input.subjectType,
    approvalType: input.approvalType,
    requestedBy: input.requestedBy,
    assignedTo: input.assignedTo,
    requiredRole,
    status: "requested",
    evidenceIds: input.evidenceIds,
    notes: input.notes,
    createdAt: now,
    decidedAt: null,
    decisionReason: null,
  };

  APPROVAL_REGISTRY.push(record);
  persistApprovalRegistry();
  appendAuditEvent({
    actorId: input.requestedBy,
    actorRole: input.actorRole,
    actionType: "approval-requested",
    subjectId: record.subjectId,
    subjectType: record.subjectType,
    previousState: "none",
    nextState: record.status,
    reason: input.notes,
    evidenceIds: input.evidenceIds,
    approvalIds: [record.approvalId],
  });

  return record;
}

function findApproval(approvalId: string): ApprovalRecord {
  const record = APPROVAL_REGISTRY.find((item) => item.approvalId === approvalId);
  if (!record) throw new Error(`[ApprovalEngine] Approval ${approvalId} was not found.`);
  return record;
}

function checkApprovalRole(record: ApprovalRecord, actorRole: TroptionsRole): void {
  if (record.requiredRole !== actorRole) {
    throw new Error(
      `[ApprovalEngine] Approval ${record.approvalId} requires role ${record.requiredRole}, got ${actorRole}.`,
    );
  }
}

export function approveApproval(input: DecideApprovalInput): ApprovalRecord {
  ensureControlPlanePersistenceLoaded();
  const record = findApproval(input.approvalId);
  checkApprovalRole(record, input.actorRole);

  const actionByRole: Record<TroptionsRole, string | null> = {
    "super-admin": "approve-emergency-override",
    "compliance-officer": "approve-compliance",
    "legal-reviewer": "approve-legal",
    "custody-officer": "approve-custody",
    "board-member": "approve-board",
    "proof-reviewer": "approve-proof",
    "treasury-operator": null,
    "settlement-operator": null,
    "issuer-admin": null,
    "investor-support": null,
    auditor: null,
    viewer: null,
    "ai-concierge": null,
  };

  const action = actionByRole[input.actorRole];
  if (!action) {
    throw new Error(`[ApprovalEngine] Role ${input.actorRole} cannot approve approvals.`);
  }

  assertAuthorized(input.actorRole, action as never);

  if (record.approvalType === "emergency-override-approval") {
    throw new Error(
      "[ApprovalEngine] Emergency override approval cannot bypass legal, custody, sanctions, or prohibited jurisdiction rules.",
    );
  }

  const previousStatus = record.status;
  record.status = "approved";
  record.decidedAt = new Date().toISOString();
  record.decisionReason = input.decisionReason;
  persistApprovalRegistry();

  appendAuditEvent({
    actorId: input.actorId,
    actorRole: input.actorRole,
    actionType: "approval-approved",
    subjectId: record.subjectId,
    subjectType: record.subjectType,
    previousState: previousStatus,
    nextState: record.status,
    reason: input.decisionReason,
    evidenceIds: record.evidenceIds,
    approvalIds: [record.approvalId],
  });

  return record;
}

export function rejectApproval(input: DecideApprovalInput): ApprovalRecord {
  ensureControlPlanePersistenceLoaded();
  const record = findApproval(input.approvalId);
  checkApprovalRole(record, input.actorRole);
  assertAuthorized(input.actorRole, "reject-approval");

  const previousStatus = record.status;
  record.status = "rejected";
  record.decidedAt = new Date().toISOString();
  record.decisionReason = input.decisionReason;
  persistApprovalRegistry();

  appendAuditEvent({
    actorId: input.actorId,
    actorRole: input.actorRole,
    actionType: "approval-rejected",
    subjectId: record.subjectId,
    subjectType: record.subjectType,
    previousState: previousStatus,
    nextState: record.status,
    reason: input.decisionReason,
    evidenceIds: record.evidenceIds,
    approvalIds: [record.approvalId],
  });

  return record;
}

export function getApprovalStatus(approvalId: string): ApprovalStatus {
  ensureControlPlanePersistenceLoaded();
  return findApproval(approvalId).status;
}

export function hasApproval(subjectId: string, approvalType: ApprovalType): boolean {
  ensureControlPlanePersistenceLoaded();
  return APPROVAL_REGISTRY.some(
    (item) => item.subjectId === subjectId && item.approvalType === approvalType && item.status === "approved",
  );
}

export function hasIssuanceApprovalBundle(subjectId: string): boolean {
  return (
    hasApproval(subjectId, "legal-approval") &&
    hasApproval(subjectId, "custody-approval") &&
    hasApproval(subjectId, "compliance-approval") &&
    hasApproval(subjectId, "board-approval")
  );
}

export function hasSettlementApprovalBundle(subjectId: string): boolean {
  return (
    hasApproval(subjectId, "legal-approval") &&
    hasApproval(subjectId, "custody-approval") &&
    hasApproval(subjectId, "proof-approval") &&
    hasApproval(subjectId, "compliance-approval")
  );
}

export function getPendingApprovalsSummary() {
  ensureControlPlanePersistenceLoaded();
  const pending = getPendingApprovals();
  return {
    count: pending.length,
    items: pending,
  };
}
