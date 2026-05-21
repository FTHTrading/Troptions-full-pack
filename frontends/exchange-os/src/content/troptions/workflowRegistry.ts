export type WorkflowCategory =
  | "asset-intake"
  | "proof-package"
  | "legal-review"
  | "custody-review"
  | "board-approval"
  | "investor-readiness"
  | "funding-readiness"
  | "issuance-readiness"
  | "settlement-readiness"
  | "exception-management";

export type WorkflowStatus =
  | "not-started"
  | "in-progress"
  | "blocked"
  | "ready"
  | "approved"
  | "rejected";

export type WorkflowRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface WorkflowStage {
  stageId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  requiredInputs: string[];
  exitCriteria: string[];
  blockers: string[];
  approver: string;
  evidenceRequired: string[];
}

export interface TroptionsWorkflow {
  workflowId: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  owner: string;
  status: WorkflowStatus;
  stages: WorkflowStage[];
  requiredInputs: string[];
  requiredEvidence: string[];
  requiredApprovals: string[];
  blockingConditions: string[];
  outputs: string[];
  riskLevel: WorkflowRiskLevel;
  nextAction: string;
}

const BASE_STAGES: WorkflowStage[] = [
  {
    stageId: "stage-intake",
    name: "Intake",
    description: "Collect subject metadata and source links.",
    status: "in-progress",
    requiredInputs: ["subject-id", "owner", "jurisdiction"],
    exitCriteria: ["intake-form-complete", "scope-validated"],
    blockers: [],
    approver: "operations",
    evidenceRequired: ["intake-record"],
  },
  {
    stageId: "stage-evidence",
    name: "Evidence",
    description: "Validate evidence inventory and missing documents.",
    status: "blocked",
    requiredInputs: ["required-doc-list", "source-documents"],
    exitCriteria: ["evidence-gaps-tracked", "exceptions-raised"],
    blockers: ["missing-documents"],
    approver: "compliance",
    evidenceRequired: ["evidence-checklist"],
  },
  {
    stageId: "stage-approval",
    name: "Approval",
    description: "Route to legal, custody, and board approval gates.",
    status: "not-started",
    requiredInputs: ["legal-memo", "custody-opinion", "board-pack"],
    exitCriteria: ["approval-matrix-signed"],
    blockers: ["approval-pending"],
    approver: "board",
    evidenceRequired: ["approval-log"],
  },
];

export const WORKFLOW_REGISTRY: TroptionsWorkflow[] = [
  {
    workflowId: "WF-INTAKE-001",
    name: "Troptions Asset Intake Workflow",
    description: "Controls asset onboarding from intake through scored readiness.",
    category: "asset-intake",
    owner: "Asset Operations",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["asset-profile", "owner-entity", "jurisdiction"],
    requiredEvidence: ["title-docs", "classification-memo"],
    requiredApprovals: ["legal", "compliance"],
    blockingConditions: ["missing-title", "jurisdiction-undefined"],
    outputs: ["asset-readiness-record"],
    riskLevel: "HIGH",
    nextAction: "Complete intake packets for all evaluation assets.",
  },
  {
    workflowId: "WF-PROOF-001",
    name: "Troptions Proof Package Workflow",
    description: "Tracks proof package collection, review, anchoring, and publication.",
    category: "proof-package",
    owner: "Proof Operations",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["proof-item", "required-documents"],
    requiredEvidence: ["hash-manifest", "reviewer-signoff"],
    requiredApprovals: ["proof-review", "board"],
    blockingConditions: ["open-proof-exception"],
    outputs: ["proof-readiness-record"],
    riskLevel: "HIGH",
    nextAction: "Clear missing audit and reserve package evidence.",
  },
  {
    workflowId: "WF-LEGAL-001",
    name: "Troptions Legal Review Workflow",
    description: "Gates all claims, assets, and routes through counsel sign-off.",
    category: "legal-review",
    owner: "Legal",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["subject-dossier", "risk-summary"],
    requiredEvidence: ["counsel-memo", "jurisdiction-analysis"],
    requiredApprovals: ["lead-counsel"],
    blockingConditions: ["counsel-unassigned", "memo-missing"],
    outputs: ["legal-readiness-record"],
    riskLevel: "CRITICAL",
    nextAction: "Assign counsel to every CRITICAL queue item.",
  },
  {
    workflowId: "WF-CUSTODY-001",
    name: "Troptions Custody Review Workflow",
    description: "Validates custody agreement status and asset custody controls.",
    category: "custody-review",
    owner: "Custody Operations",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["custody-provider", "asset-mapping"],
    requiredEvidence: ["custody-agreement", "insurance-attestation"],
    requiredApprovals: ["custody-lead", "board"],
    blockingConditions: ["agreement-not-active"],
    outputs: ["custody-readiness-record"],
    riskLevel: "HIGH",
    nextAction: "Convert evaluation custody providers to active agreements.",
  },
  {
    workflowId: "WF-BOARD-001",
    name: "Troptions Board Approval Workflow",
    description: "Enforces board sign-off before funding, issuance, and launch.",
    category: "board-approval",
    owner: "Board Secretary",
    status: "blocked",
    stages: BASE_STAGES,
    requiredInputs: ["board-pack", "risk-register"],
    requiredEvidence: ["board-resolution", "minutes"],
    requiredApprovals: ["board"],
    blockingConditions: ["board-resolution-missing"],
    outputs: ["board-approval-record"],
    riskLevel: "CRITICAL",
    nextAction: "Schedule board votes for pending funding and issuance subjects.",
  },
  {
    workflowId: "WF-INVESTOR-001",
    name: "Troptions Investor Readiness Workflow",
    description: "Validates KYC, sanctions, accreditation, docs, and wallet allowlist controls.",
    category: "investor-readiness",
    owner: "Compliance",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["investor-profile", "route-type"],
    requiredEvidence: ["kyc-report", "sanctions-screen", "wallet-allowlist-proof"],
    requiredApprovals: ["compliance"],
    blockingConditions: ["kyc-incomplete", "sanctions-pending", "allowlist-missing"],
    outputs: ["investor-readiness-record"],
    riskLevel: "CRITICAL",
    nextAction: "Complete accreditation and wallet allowlist checks for pending investors.",
  },
  {
    workflowId: "WF-FUND-001",
    name: "Troptions Funding Readiness Workflow",
    description: "Gates route activation on legal and board approvals.",
    category: "funding-readiness",
    owner: "Capital Markets",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["funding-route", "investor-eligibility-model"],
    requiredEvidence: ["legal-opinion", "board-approval"],
    requiredApprovals: ["legal", "board"],
    blockingConditions: ["legal-approval-missing", "board-approval-missing"],
    outputs: ["funding-readiness-record"],
    riskLevel: "CRITICAL",
    nextAction: "Resolve legal approvals before any route moves beyond evaluation-only.",
  },
  {
    workflowId: "WF-ISSUE-001",
    name: "Troptions Issuance Readiness Workflow",
    description: "Blocks issuance until legal, custody, and proof scores reach threshold.",
    category: "issuance-readiness",
    owner: "Issuance Operations",
    status: "blocked",
    stages: BASE_STAGES,
    requiredInputs: ["asset-readiness-score"],
    requiredEvidence: ["legal-score>=80", "custody-score>=80", "proof-score>=80"],
    requiredApprovals: ["legal", "custody", "board"],
    blockingConditions: ["minimum-score-not-met"],
    outputs: ["issuance-readiness-record"],
    riskLevel: "CRITICAL",
    nextAction: "Raise legal/custody/proof readiness on blocked assets.",
  },
  {
    workflowId: "WF-SETTLE-001",
    name: "Troptions Settlement Readiness Workflow",
    description: "Ensures custody, legal, proof, and settlement controls are complete before settlement.",
    category: "settlement-readiness",
    owner: "Settlement Operations",
    status: "blocked",
    stages: BASE_STAGES,
    requiredInputs: ["settlement-configuration", "custody-control-map"],
    requiredEvidence: ["settlement-score>=80", "legal-approved", "proof-approved", "custody-approved"],
    requiredApprovals: ["settlement-lead", "compliance"],
    blockingConditions: ["settlement-threshold-not-met"],
    outputs: ["settlement-readiness-record"],
    riskLevel: "CRITICAL",
    nextAction: "Clear legal/proof/custody blockers for settlement candidates.",
  },
  {
    workflowId: "WF-EXC-001",
    name: "Troptions Exception Management Workflow",
    description: "Tracks unresolved exceptions that prevent approval and release.",
    category: "exception-management",
    owner: "Risk Office",
    status: "in-progress",
    stages: BASE_STAGES,
    requiredInputs: ["exception-log", "linked-subject-id"],
    requiredEvidence: ["exception-root-cause", "remediation-plan"],
    requiredApprovals: ["risk", "owner"],
    blockingConditions: ["exception-open"],
    outputs: ["exception-resolution-record"],
    riskLevel: "HIGH",
    nextAction: "Resolve open exceptions tied to issuance and settlement.",
  },
];

export function getWorkflowById(workflowId: string): TroptionsWorkflow | undefined {
  return WORKFLOW_REGISTRY.find((w) => w.workflowId === workflowId);
}

export function getWorkflowsByCategory(category: WorkflowCategory): TroptionsWorkflow[] {
  return WORKFLOW_REGISTRY.filter((w) => w.category === category);
}

export function getBlockedWorkflows(): TroptionsWorkflow[] {
  return WORKFLOW_REGISTRY.filter((w) => w.status === "blocked");
}
