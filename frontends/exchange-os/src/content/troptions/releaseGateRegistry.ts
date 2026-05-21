export type ReleaseGateType =
  | "public-content-release-gate"
  | "claim-publication-gate"
  | "asset-issuance-gate"
  | "stable-unit-launch-gate"
  | "funding-route-activation-gate"
  | "settlement-release-gate"
  | "investor-access-gate"
  | "board-package-release-gate";

export type ReleaseGateStatus = "pass" | "fail" | "warn";

export interface ReleaseGateRecord {
  gateId: string;
  gateType: ReleaseGateType;
  subjectId: string;
  status: ReleaseGateStatus;
  failingRules: string[];
  lastEvaluatedAt: string;
}

export const RELEASE_GATE_REGISTRY: ReleaseGateRecord[] = [
  {
    gateId: "GATE-CONTENT-001",
    gateType: "public-content-release-gate",
    subjectId: "content-global",
    status: "warn",
    failingRules: ["banned-term-scan-pending"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-CLAIM-001",
    gateType: "claim-publication-gate",
    subjectId: "CLAIM-UNITY-001",
    status: "fail",
    failingRules: ["claim-blocked", "claim-evidence-missing"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-ISSUANCE-001",
    gateType: "asset-issuance-gate",
    subjectId: "ASSET-TGOLD-001",
    status: "fail",
    failingRules: ["legal-score-below-threshold", "custody-score-below-threshold", "proof-score-below-threshold"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-STABLE-001",
    gateType: "stable-unit-launch-gate",
    subjectId: "SU-TROP-USD-001",
    status: "fail",
    failingRules: ["licensing-approval-missing"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-FUND-001",
    gateType: "funding-route-activation-gate",
    subjectId: "FUND-CENT-001",
    status: "fail",
    failingRules: ["legal-approval-missing"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-SETTLEMENT-001",
    gateType: "settlement-release-gate",
    subjectId: "ASSET-TGOLD-001",
    status: "fail",
    failingRules: ["legal-gate-fail", "custody-gate-fail", "proof-gate-fail", "compliance-gate-fail", "board-gate-fail"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-INVESTOR-001",
    gateType: "investor-access-gate",
    subjectId: "INV-002",
    status: "fail",
    failingRules: ["sanctions-missing", "documents-missing", "wallet-allowlist-missing"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
  {
    gateId: "GATE-BOARD-001",
    gateType: "board-package-release-gate",
    subjectId: "WF-ISSUE-001",
    status: "fail",
    failingRules: ["board-approval-missing"],
    lastEvaluatedAt: "2026-04-25T12:00:00.000Z",
  },
];

export function getFailedReleaseGates(): ReleaseGateRecord[] {
  return RELEASE_GATE_REGISTRY.filter((item) => item.status === "fail");
}
