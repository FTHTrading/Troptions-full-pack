export type ExceptionSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ExceptionStatus =
  | "open"
  | "acknowledged"
  | "in-review"
  | "in-remediation"
  | "resolved"
  | "rejected"
  | "escalated";

export interface WorkflowException {
  exceptionId: string;
  subjectId: string;
  subjectType: "asset" | "claim" | "proof" | "funding" | "settlement";
  workflowCategory: string;
  description: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  remediationOwner: string;
  blockers: string[];
  openedAt: string;
  nextAction: string;
}

export const EXCEPTION_REGISTRY: WorkflowException[] = [
  {
    exceptionId: "EXC-001",
    subjectId: "ASSET-TGOLD-001",
    subjectType: "asset",
    workflowCategory: "issuance-readiness",
    description: "Gold custody and reserve evidence incomplete.",
    severity: "CRITICAL",
    status: "open",
    remediationOwner: "Custody Operations",
    blockers: ["custody-agreement-missing", "reserve-ratio-missing"],
    openedAt: "2026-04-25",
    nextAction: "Publish custody agreement and reserve schedule.",
  },
  {
    exceptionId: "EXC-002",
    subjectId: "CLAIM-UNITY-001",
    subjectType: "claim",
    workflowCategory: "legal-review",
    description: "Stable/asset-backed language is still unresolved in legal workflow.",
    severity: "CRITICAL",
    status: "open",
    remediationOwner: "Legal",
    blockers: ["legal-classification-memo-missing"],
    openedAt: "2026-04-25",
    nextAction: "Complete stable unit classification and licensing analysis.",
  },
  {
    exceptionId: "EXC-003",
    subjectId: "POR-001",
    subjectType: "proof",
    workflowCategory: "proof-package",
    description: "Reserve proof package has missing attestation evidence.",
    severity: "HIGH",
    status: "in-review",
    remediationOwner: "Proof Operations",
    blockers: ["custodian-attestation-missing"],
    openedAt: "2026-04-25",
    nextAction: "Upload attestation and verifier report.",
  },
];

export function getOpenExceptions(): WorkflowException[] {
  return EXCEPTION_REGISTRY.filter((item) => item.status !== "resolved");
}

export function hasOpenExceptionsForSubject(subjectId: string): boolean {
  return EXCEPTION_REGISTRY.some((item) => item.subjectId === subjectId && item.status !== "resolved");
}
