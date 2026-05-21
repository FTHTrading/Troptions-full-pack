import { EXCEPTION_REGISTRY, type WorkflowException } from "@/content/troptions/exceptionRegistry";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";
import { assertAuthorized } from "@/lib/troptions/authorizationEngine";
import { appendAuditEvent } from "@/lib/troptions/auditLogEngine";
import {
  ensureControlPlanePersistenceLoaded,
  persistExceptionRegistry,
} from "@/lib/troptions/controlPlanePersistence";

export type ExceptionType =
  | "missing-legal-approval"
  | "missing-custody-proof"
  | "missing-reserve-proof"
  | "missing-board-approval"
  | "missing-investor-eligibility"
  | "missing-sanctions-clearance"
  | "prohibited-jurisdiction"
  | "unsupported-claim"
  | "unstable-stable-unit-status"
  | "unresolved-audit-exception"
  | "settlement-blocker"
  | "funding-blocker";

export type ExtendedExceptionStatus =
  | "open"
  | "acknowledged"
  | "in-remediation"
  | "resolved"
  | "rejected"
  | "escalated";

export interface ResolveExceptionInput {
  exceptionId: string;
  actorId: string;
  actorRole: TroptionsRole;
  resolutionNote: string;
}

function getException(exceptionId: string): WorkflowException {
  ensureControlPlanePersistenceLoaded();
  const exception = EXCEPTION_REGISTRY.find((item) => item.exceptionId === exceptionId);
  if (!exception) throw new Error(`[ExceptionEngine] Exception ${exceptionId} was not found.`);
  return exception;
}

export function hasOpenCriticalException(subjectId: string): boolean {
  ensureControlPlanePersistenceLoaded();
  return EXCEPTION_REGISTRY.some(
    (item) => item.subjectId === subjectId && item.severity === "CRITICAL" && item.status !== "resolved",
  );
}

export function resolveException(input: ResolveExceptionInput): WorkflowException {
  ensureControlPlanePersistenceLoaded();
  assertAuthorized(input.actorRole, "resolve-exception");
  const exception = getException(input.exceptionId);

  if (!input.resolutionNote.trim()) {
    throw new Error("[ExceptionEngine] Resolution note is required.");
  }

  if (input.actorRole === "viewer" || input.actorRole === "ai-concierge" || input.actorRole === "auditor") {
    throw new Error(`[ExceptionEngine] Role ${input.actorRole} cannot resolve exceptions.`);
  }

  const previous = exception.status;
  exception.status = "resolved";
  exception.nextAction = `Resolved by ${input.actorRole}: ${input.resolutionNote}`;
  persistExceptionRegistry();

  appendAuditEvent({
    actorId: input.actorId,
    actorRole: input.actorRole,
    actionType: "exception-resolved",
    subjectId: exception.subjectId,
    subjectType: exception.subjectType,
    previousState: previous,
    nextState: exception.status,
    reason: input.resolutionNote,
    evidenceIds: [],
    approvalIds: [],
  });

  return exception;
}

export function getOpenCriticalExceptions(): WorkflowException[] {
  ensureControlPlanePersistenceLoaded();
  return EXCEPTION_REGISTRY.filter((item) => item.severity === "CRITICAL" && item.status !== "resolved");
}
