import type { TroptionsRole } from "@/content/troptions/roleRegistry";

export type ApprovalType =
  | "legal-approval"
  | "custody-approval"
  | "compliance-approval"
  | "proof-approval"
  | "board-approval"
  | "funding-approval"
  | "issuance-approval"
  | "settlement-approval"
  | "disclosure-approval"
  | "emergency-override-approval";

export type ApprovalStatus =
  | "requested"
  | "in-review"
  | "approved"
  | "rejected"
  | "expired"
  | "revoked";

export interface ApprovalRecord {
  approvalId: string;
  subjectId: string;
  subjectType: "asset" | "claim" | "proof" | "funding" | "settlement" | "workflow";
  approvalType: ApprovalType;
  requestedBy: string;
  assignedTo: string;
  requiredRole: TroptionsRole;
  status: ApprovalStatus;
  evidenceIds: string[];
  notes: string;
  createdAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
}

export const APPROVAL_REGISTRY: ApprovalRecord[] = [
  {
    approvalId: "APR-LEGAL-001",
    subjectId: "ASSET-TGOLD-001",
    subjectType: "asset",
    approvalType: "legal-approval",
    requestedBy: "issuer-admin-1",
    assignedTo: "legal-reviewer-1",
    requiredRole: "legal-reviewer",
    status: "requested",
    evidenceIds: ["evidence-legal-draft"],
    notes: "Legal classification memo pending.",
    createdAt: "2026-04-25T09:00:00.000Z",
    decidedAt: null,
    decisionReason: null,
  },
  {
    approvalId: "APR-CUST-001",
    subjectId: "ASSET-TGOLD-001",
    subjectType: "asset",
    approvalType: "custody-approval",
    requestedBy: "issuer-admin-1",
    assignedTo: "custody-officer-1",
    requiredRole: "custody-officer",
    status: "in-review",
    evidenceIds: ["vault-receipt-draft"],
    notes: "Custody agreement review in progress.",
    createdAt: "2026-04-25T10:00:00.000Z",
    decidedAt: null,
    decisionReason: null,
  },
  {
    approvalId: "APR-BOARD-001",
    subjectId: "WF-ISSUE-001",
    subjectType: "workflow",
    approvalType: "board-approval",
    requestedBy: "compliance-officer-1",
    assignedTo: "board-member-1",
    requiredRole: "board-member",
    status: "requested",
    evidenceIds: ["board-pack-v1"],
    notes: "Issuance release board package pending.",
    createdAt: "2026-04-25T11:30:00.000Z",
    decidedAt: null,
    decisionReason: null,
  },
];

export function getPendingApprovals(): ApprovalRecord[] {
  return APPROVAL_REGISTRY.filter((item) => item.status === "requested" || item.status === "in-review");
}
