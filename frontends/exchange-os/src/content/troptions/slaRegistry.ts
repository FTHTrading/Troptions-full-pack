export type SlaType =
  | "legal-review-due"
  | "custody-review-due"
  | "proof-review-due"
  | "board-package-due"
  | "claim-review-due"
  | "exception-remediation-due"
  | "investor-readiness-due"
  | "funding-route-review-due";

export type SlaStatus = "active" | "breached" | "paused" | "completed";

export interface SlaTimer {
  slaId: string;
  type: SlaType;
  subjectId: string;
  dueAt: string;
  status: SlaStatus;
  ownerRole: string;
  createdAt: string;
}

export const SLA_REGISTRY: SlaTimer[] = [
  {
    slaId: "SLA-LEGAL-001",
    type: "legal-review-due",
    subjectId: "APR-LEGAL-001",
    dueAt: "2026-04-27T00:00:00.000Z",
    status: "active",
    ownerRole: "legal-reviewer",
    createdAt: "2026-04-25T09:00:00.000Z",
  },
  {
    slaId: "SLA-CUST-001",
    type: "custody-review-due",
    subjectId: "APR-CUST-001",
    dueAt: "2026-04-26T18:00:00.000Z",
    status: "active",
    ownerRole: "custody-officer",
    createdAt: "2026-04-25T10:00:00.000Z",
  },
  {
    slaId: "SLA-EXC-001",
    type: "exception-remediation-due",
    subjectId: "EXC-001",
    dueAt: "2026-04-26T12:00:00.000Z",
    status: "active",
    ownerRole: "compliance-officer",
    createdAt: "2026-04-25T10:45:00.000Z",
  },
];

export function getBreachedSla(nowIso = new Date().toISOString()): SlaTimer[] {
  return SLA_REGISTRY.filter((timer) => timer.status === "active" && timer.dueAt < nowIso);
}
