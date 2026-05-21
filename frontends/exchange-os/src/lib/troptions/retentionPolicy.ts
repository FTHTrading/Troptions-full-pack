import path from "node:path";

export interface RetentionDuration {
  label: string;
  days: number;
  notes: string;
}

export interface BackupSnapshot {
  filePath: string;
  createdAt: Date;
}

export interface BackupRetentionPlan {
  keep: string[];
  prune: string[];
}

export const RETENTION_POLICY = {
  auditLogs: { label: "indefinite", days: Number.POSITIVE_INFINITY, notes: "Archive only with legal-counsel approval." },
  monitoringMetrics: { label: "13 months", days: 395, notes: "Operational telemetry baseline retention." },
  structuredApiLogs: { label: "90 days", days: 90, notes: "JSON request/event logs." },
  incidentRecords: { label: "7 years", days: 2555, notes: "Regulatory incident trail." },
  approvalRecords: { label: "7 years", days: 2555, notes: "Approval evidence and decisions." },
  claimReviewRecords: { label: "7 years", days: 2555, notes: "Claim review and diligence records." },
  backupSnapshots: {
    dailyDays: 30,
    weeklyWeeks: 12,
    monthlyMonths: 12,
  },
} as const;

function weekBucket(date: Date): string {
  const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function monthBucket(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function buildBackupRetentionPlan(snapshots: BackupSnapshot[], now = new Date()): BackupRetentionPlan {
  const sorted = [...snapshots].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const keep = new Set<string>();
  const dailyCutoff = now.getTime() - RETENTION_POLICY.backupSnapshots.dailyDays * 86400000;
  const weeklyCutoff = now.getTime() - RETENTION_POLICY.backupSnapshots.weeklyWeeks * 7 * 86400000;
  const monthlyCutoff = new Date(now);
  monthlyCutoff.setUTCMonth(monthlyCutoff.getUTCMonth() - RETENTION_POLICY.backupSnapshots.monthlyMonths);

  const weeklyBuckets = new Set<string>();
  const monthlyBuckets = new Set<string>();

  for (const snapshot of sorted) {
    const created = snapshot.createdAt.getTime();
    const normalizedPath = path.normalize(snapshot.filePath);

    if (created >= dailyCutoff) {
      keep.add(normalizedPath);
      continue;
    }

    if (created >= weeklyCutoff) {
      const bucket = weekBucket(snapshot.createdAt);
      if (!weeklyBuckets.has(bucket)) {
        weeklyBuckets.add(bucket);
        keep.add(normalizedPath);
      }
      continue;
    }

    if (snapshot.createdAt >= monthlyCutoff) {
      const bucket = monthBucket(snapshot.createdAt);
      if (!monthlyBuckets.has(bucket)) {
        monthlyBuckets.add(bucket);
        keep.add(normalizedPath);
      }
    }
  }

  const prune = sorted
    .map((item) => path.normalize(item.filePath))
    .filter((filePath) => !keep.has(filePath));

  return {
    keep: [...keep],
    prune,
  };
}

export function getRetentionPolicySummary(): Record<string, RetentionDuration | string> {
  return {
    auditLogs: RETENTION_POLICY.auditLogs,
    monitoringMetrics: RETENTION_POLICY.monitoringMetrics,
    structuredApiLogs: RETENTION_POLICY.structuredApiLogs,
    backupSnapshots: `daily ${RETENTION_POLICY.backupSnapshots.dailyDays}d, weekly ${RETENTION_POLICY.backupSnapshots.weeklyWeeks}w, monthly ${RETENTION_POLICY.backupSnapshots.monthlyMonths}m`,
    incidentRecords: RETENTION_POLICY.incidentRecords,
    approvalRecords: RETENTION_POLICY.approvalRecords,
    claimReviewRecords: RETENTION_POLICY.claimReviewRecords,
  };
}
