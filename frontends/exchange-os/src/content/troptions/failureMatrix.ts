/**
 * Troptions Failure Matrix
 * System failure modes, detection methods, response procedures, and RTO.
 */

export type FailureSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FailureDetectionMethod = "automated-monitor" | "manual-review" | "audit" | "counterparty-report" | "compliance-check";

export interface FailureMode {
  failureId: string;
  name: string;
  affectedSystem: string;
  description: string;
  severity: FailureSeverity;
  detectionMethod: FailureDetectionMethod;
  responseOwner: string;
  responseProcedure: string;
  recoveryTimeObjective: string;
  currentResponseStatus: "not-defined" | "draft" | "approved" | "tested";
}

export const FAILURE_MATRIX: FailureMode[] = [
  {
    failureId: "FAIL-CUST-001",
    name: "Custody Provider Failure",
    affectedSystem: "Custody",
    description: "Primary custody provider becomes insolvent, suspended, or operationally unavailable.",
    severity: "CRITICAL",
    detectionMethod: "automated-monitor",
    responseOwner: "Board + Legal",
    responseProcedure: "Activate secondary custody provider. Initiate asset transfer under board resolution. Engage counsel. Notify affected token holders per disclosure policy.",
    recoveryTimeObjective: "72 hours for failover, 30 days for full transfer",
    currentResponseStatus: "not-defined",
  },
  {
    failureId: "FAIL-RES-001",
    name: "Reserve Shortfall",
    affectedSystem: "Reserve",
    description: "Token supply exceeds verified reserve balance.",
    severity: "CRITICAL",
    detectionMethod: "audit",
    responseOwner: "Board + Compliance + Legal",
    responseProcedure: "Freeze new issuance. Engage independent auditor. Disclose reserve shortfall per regulatory requirements. Remediation plan within 5 business days.",
    recoveryTimeObjective: "Disclosure within 24 hours. Remediation within 30 days.",
    currentResponseStatus: "not-defined",
  },
  {
    failureId: "FAIL-COMP-001",
    name: "Compliance Violation — Prohibited Jurisdiction Transaction",
    affectedSystem: "Compliance",
    description: "Transaction processed for participant from a prohibited jurisdiction (KP, IR, CU, SY, RU).",
    severity: "CRITICAL",
    detectionMethod: "compliance-check",
    responseOwner: "Compliance + Legal",
    responseProcedure: "Freeze transaction. File SAR if required. Engage OFAC counsel. Claw back funds if possible. Document for regulatory disclosure.",
    recoveryTimeObjective: "SAR filing within 30 days per regulation.",
    currentResponseStatus: "not-defined",
  },
  {
    failureId: "FAIL-CLAIM-001",
    name: "Prohibited Claim Published",
    affectedSystem: "Claims / Marketing",
    description: "A HIGH or CRITICAL risk claim published without approved evidence.",
    severity: "HIGH",
    detectionMethod: "automated-monitor",
    responseOwner: "Legal + Marketing",
    responseProcedure: "Remove claim from all channels immediately. Engage counsel to assess liability. Document retraction.",
    recoveryTimeObjective: "Removal within 4 hours of detection.",
    currentResponseStatus: "not-defined",
  },
  {
    failureId: "FAIL-INTEG-001",
    name: "Integration Partner Breach of Agreement",
    affectedSystem: "Integrations",
    description: "Announced partner (e.g., GivBux, QuantumXchange) denies partnership or agreement.",
    severity: "HIGH",
    detectionMethod: "counterparty-report",
    responseOwner: "Legal + Communications",
    responseProcedure: "Retract all claims referencing the integration. Engage counsel. Issue corrective communication.",
    recoveryTimeObjective: "Retraction within 24 hours.",
    currentResponseStatus: "not-defined",
  },
  {
    failureId: "FAIL-TECH-001",
    name: "Smart Contract Critical Vulnerability",
    affectedSystem: "Technology",
    description: "Critical vulnerability discovered in token contract or settlement protocol.",
    severity: "CRITICAL",
    detectionMethod: "audit",
    responseOwner: "Engineering + Legal + Board",
    responseProcedure: "Pause affected contracts via governance. Engage security auditor. Notify affected holders per disclosure policy. Deploy patched contracts after audit.",
    recoveryTimeObjective: "Pause within 1 hour. Patch deployment within 7 days post-audit.",
    currentResponseStatus: "not-defined",
  },
];

export function getCriticalFailures(): FailureMode[] {
  return FAILURE_MATRIX.filter((f) => f.severity === "CRITICAL");
}

export function getUndefinedResponses(): FailureMode[] {
  return FAILURE_MATRIX.filter((f) => f.currentResponseStatus === "not-defined");
}
