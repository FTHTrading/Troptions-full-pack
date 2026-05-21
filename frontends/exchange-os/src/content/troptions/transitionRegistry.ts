import type { TroptionsRole } from "@/content/troptions/roleRegistry";

export type TransitionStatus =
  | "not-started"
  | "in-progress"
  | "blocked"
  | "ready"
  | "approved"
  | "rejected"
  | "open"
  | "acknowledged"
  | "requested"
  | "in-review"
  | "in-remediation"
  | "resolved"
  | "escalated";

export interface TransitionRule {
  subjectType: "asset" | "claim" | "proof" | "funding" | "settlement" | "workflow" | "exception";
  fromStatus: TransitionStatus;
  toStatus: TransitionStatus;
  allowedRoles: TroptionsRole[];
  requiredEvidence: string[];
  requiredApprovals: string[];
  blockOnOpenExceptions: boolean;
}

export const TRANSITION_REGISTRY: TransitionRule[] = [
  {
    subjectType: "workflow",
    fromStatus: "not-started",
    toStatus: "in-progress",
    allowedRoles: ["issuer-admin", "super-admin", "compliance-officer"],
    requiredEvidence: ["intake-record"],
    requiredApprovals: [],
    blockOnOpenExceptions: false,
  },
  {
    subjectType: "workflow",
    fromStatus: "in-progress",
    toStatus: "ready",
    allowedRoles: ["issuer-admin", "compliance-officer", "super-admin"],
    requiredEvidence: ["evidence-checklist"],
    requiredApprovals: ["legal-approval", "custody-approval", "compliance-approval"],
    blockOnOpenExceptions: true,
  },
  {
    subjectType: "workflow",
    fromStatus: "ready",
    toStatus: "approved",
    allowedRoles: ["board-member", "super-admin"],
    requiredEvidence: ["approval-log"],
    requiredApprovals: ["board-approval"],
    blockOnOpenExceptions: true,
  },
  {
    subjectType: "workflow",
    fromStatus: "in-progress",
    toStatus: "blocked",
    allowedRoles: ["compliance-officer", "legal-reviewer", "custody-officer", "super-admin"],
    requiredEvidence: ["blocker-report"],
    requiredApprovals: [],
    blockOnOpenExceptions: false,
  },
  {
    subjectType: "claim",
    fromStatus: "blocked",
    toStatus: "in-review",
    allowedRoles: ["legal-reviewer", "compliance-officer", "super-admin"],
    requiredEvidence: ["claim-evidence-pack"],
    requiredApprovals: ["disclosure-approval"],
    blockOnOpenExceptions: true,
  },
  {
    subjectType: "claim",
    fromStatus: "in-review",
    toStatus: "approved",
    allowedRoles: ["legal-reviewer", "compliance-officer"],
    requiredEvidence: ["claim-legal-memo"],
    requiredApprovals: ["legal-approval", "compliance-approval"],
    blockOnOpenExceptions: true,
  },
  {
    subjectType: "exception",
    fromStatus: "open",
    toStatus: "resolved",
    allowedRoles: ["compliance-officer", "legal-reviewer", "custody-officer", "super-admin"],
    requiredEvidence: ["remediation-proof"],
    requiredApprovals: [],
    blockOnOpenExceptions: false,
  },
];

export function getTransitionRule(
  subjectType: TransitionRule["subjectType"],
  fromStatus: TransitionStatus,
  toStatus: TransitionStatus,
): TransitionRule | undefined {
  return TRANSITION_REGISTRY.find(
    (rule) => rule.subjectType === subjectType && rule.fromStatus === fromStatus && rule.toStatus === toStatus,
  );
}
