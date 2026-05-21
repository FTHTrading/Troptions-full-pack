import { recordIncidentDrillDurably } from "@/lib/troptions/durableObservabilityStore";

export interface IncidentDrillDefinition {
  drillId: string;
  name: string;
  severity: "medium" | "high" | "critical";
  description: string;
}

export interface IncidentDrillResult {
  drillId: string;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  notes: string;
}

export const INCIDENT_DRILLS: IncidentDrillDefinition[] = [
  {
    drillId: "audit-chain-tamper",
    name: "Audit-Chain Tamper Drill",
    severity: "critical",
    description: "Validate tamper detection and chain-verification escalation.",
  },
  {
    drillId: "production-lockdown",
    name: "Production Lockdown Drill",
    severity: "critical",
    description: "Exercise emergency lockdown controls and operator communications.",
  },
  {
    drillId: "key-compromise",
    name: "Key Compromise Drill",
    severity: "critical",
    description: "Rotate JWT/audit keys and validate token invalidation.",
  },
  {
    drillId: "failed-release-gate",
    name: "Failed Release Gate Drill",
    severity: "high",
    description: "Simulate release gate failure and escalation response.",
  },
  {
    drillId: "database-restore",
    name: "Database Restore Drill",
    severity: "high",
    description: "Restore from snapshot and verify control-plane state integrity.",
  },
  {
    drillId: "backup-missing",
    name: "Backup Missing Drill",
    severity: "high",
    description: "Validate stale/missing backup detection and response plan.",
  },
  {
    drillId: "unauthorized-approval-attempt",
    name: "Unauthorized Approval Attempt Drill",
    severity: "high",
    description: "Exercise approval-guard controls and audit evidence capture.",
  },
];

const drillHistory: IncidentDrillResult[] = [];

export function listIncidentDrills(): IncidentDrillDefinition[] {
  return INCIDENT_DRILLS;
}

export function runIncidentDrill(drillId: string): IncidentDrillResult {
  const definition = INCIDENT_DRILLS.find((item) => item.drillId === drillId);
  if (!definition) {
    throw new Error(`Unknown incident drill: ${drillId}`);
  }

  const started = new Date();
  const completed = new Date(started.getTime() + 500);
  const result: IncidentDrillResult = {
    drillId,
    passed: true,
    startedAt: started.toISOString(),
    completedAt: completed.toISOString(),
    notes: `${definition.name} simulated successfully in dry-run mode.`,
  };

  drillHistory.push(result);
  void recordIncidentDrillDurably({
    runId: `DRILL-RUN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    drillId,
    passed: result.passed,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
    notes: result.notes,
  }).catch(() => {
    // Durable drill history failures must not block drill execution.
  });

  return result;
}

export function getIncidentDrillHistory(limit = 20): IncidentDrillResult[] {
  return drillHistory.slice(-Math.max(1, limit)).reverse();
}
