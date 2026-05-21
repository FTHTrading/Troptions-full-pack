import { getTransitionRule, type TransitionRule, type TransitionStatus } from "@/content/troptions/transitionRegistry";
import { EXCEPTION_REGISTRY } from "@/content/troptions/exceptionRegistry";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";
import { assertAuthorized } from "@/lib/troptions/authorizationEngine";
import { appendAuditEvent } from "@/lib/troptions/auditLogEngine";
import { APPROVAL_REGISTRY } from "@/content/troptions/approvalRegistry";
import { ensureControlPlanePersistenceLoaded } from "@/lib/troptions/controlPlanePersistence";

export interface TransitionWorkflowInput {
  subjectId: string;
  subjectType: TransitionRule["subjectType"];
  fromStatus: TransitionStatus;
  toStatus: TransitionStatus;
  actorRole: TroptionsRole;
  reason: string;
  evidenceIds: string[];
  approvalIds: string[];
}

export interface TransitionWorkflowResult {
  success: boolean;
  transitionApplied: boolean;
  subjectId: string;
  fromStatus: TransitionStatus;
  toStatus: TransitionStatus;
  blocker?: string;
  auditEventId?: string;
}

function hasOpenExceptions(subjectId: string): boolean {
  return EXCEPTION_REGISTRY.some(
    (item) => item.subjectId === subjectId && (item.status === "open" || item.status === "in-review"),
  );
}

function hasRequiredEvidence(requiredEvidence: string[], evidenceIds: string[]): boolean {
  return requiredEvidence.every((required) => evidenceIds.includes(required));
}

function hasRequiredApprovals(subjectId: string, requiredApprovals: string[], approvalIds: string[]): boolean {
  const approvedForSubject = APPROVAL_REGISTRY.filter(
    (item) => item.subjectId === subjectId && item.status === "approved",
  );

  return requiredApprovals.every((requiredType) => {
    const linkedApproval = approvedForSubject.some(
      (item) => item.approvalType === requiredType && approvalIds.includes(item.approvalId),
    );
    return linkedApproval;
  });
}

export function transitionWorkflow(input: TransitionWorkflowInput): TransitionWorkflowResult {
  ensureControlPlanePersistenceLoaded();
  assertAuthorized(input.actorRole, "transition-workflow");

  const rule = getTransitionRule(input.subjectType, input.fromStatus, input.toStatus);
  if (!rule) {
    return {
      success: false,
      transitionApplied: false,
      subjectId: input.subjectId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      blocker: "transition-not-allowed",
    };
  }

  if (!rule.allowedRoles.includes(input.actorRole)) {
    return {
      success: false,
      transitionApplied: false,
      subjectId: input.subjectId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      blocker: "actor-role-not-permitted",
    };
  }

  if (!hasRequiredEvidence(rule.requiredEvidence, input.evidenceIds)) {
    return {
      success: false,
      transitionApplied: false,
      subjectId: input.subjectId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      blocker: "required-evidence-missing",
    };
  }

  if (!hasRequiredApprovals(input.subjectId, rule.requiredApprovals, input.approvalIds)) {
    return {
      success: false,
      transitionApplied: false,
      subjectId: input.subjectId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      blocker: "required-approvals-missing",
    };
  }

  if (rule.blockOnOpenExceptions && hasOpenExceptions(input.subjectId)) {
    return {
      success: false,
      transitionApplied: false,
      subjectId: input.subjectId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      blocker: "open-exception-present",
    };
  }

  const event = appendAuditEvent({
    actorId: `actor-${input.actorRole}`,
    actorRole: input.actorRole,
    actionType: "workflow-transition",
    subjectId: input.subjectId,
    subjectType: input.subjectType,
    previousState: input.fromStatus,
    nextState: input.toStatus,
    reason: input.reason,
    evidenceIds: input.evidenceIds,
    approvalIds: input.approvalIds,
  });

  return {
    success: true,
    transitionApplied: true,
    subjectId: input.subjectId,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    auditEventId: event.eventId,
  };
}
