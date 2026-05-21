export type AlertSeverity = "info" | "warning" | "high" | "critical";

export type AlertCategory =
  | "legal"
  | "custody"
  | "proof"
  | "board"
  | "funding"
  | "issuance"
  | "settlement"
  | "claim"
  | "stable-unit"
  | "investor"
  | "exception"
  | "SLA";

export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface AlertRecord {
  alertId: string;
  severity: AlertSeverity;
  category: AlertCategory;
  subjectId: string;
  message: string;
  status: AlertStatus;
  createdAt: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
}

export const ALERT_REGISTRY: AlertRecord[] = [
  {
    alertId: "ALERT-001",
    severity: "critical",
    category: "exception",
    subjectId: "EXC-001",
    message: "Critical exception open for ASSET-TGOLD-001 issuance path.",
    status: "active",
    createdAt: "2026-04-25T10:45:00.000Z",
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    alertId: "ALERT-002",
    severity: "high",
    category: "legal",
    subjectId: "APR-LEGAL-001",
    message: "Legal approval remains in requested state.",
    status: "active",
    createdAt: "2026-04-25T11:15:00.000Z",
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    alertId: "ALERT-003",
    severity: "warning",
    category: "SLA",
    subjectId: "SLA-LEGAL-001",
    message: "Legal review SLA due within 24 hours.",
    status: "active",
    createdAt: "2026-04-25T12:15:00.000Z",
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
];

export function getActiveAlerts(): AlertRecord[] {
  return ALERT_REGISTRY.filter((item) => item.status === "active");
}
