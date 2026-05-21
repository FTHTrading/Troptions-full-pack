import path from "node:path";
import { execFileSync } from "node:child_process";
import { createPostgresAdapter } from "@/lib/troptions/postgresAdapter";
import { getDatabaseAdapter, resetDatabaseAdapterForTests, resolveDatabaseAdapterType } from "@/lib/troptions/databaseAdapter";
import { createSqliteAdapter } from "@/lib/troptions/sqliteAdapter";
import { clearStructuredLogsForTests, logStructuredEvent, redactSecrets } from "@/lib/troptions/structuredLogger";
import { getMetricsSnapshot, incrementMetric, resetMetricsForTests } from "@/lib/troptions/metricsRegistry";
import { clearEscalationLogForTests, evaluateEscalationPolicies } from "@/lib/troptions/alertEscalation";
import { getDurableObservabilityExport, isDurableObservabilityEnabled } from "@/lib/troptions/durableObservabilityStore";
import { RETENTION_POLICY, buildBackupRetentionPlan } from "@/lib/troptions/retentionPolicy";
import { INCIDENT_DRILLS } from "@/lib/troptions/incidentDrills";
import { runProductionSmokeChecks } from "@/lib/troptions/productionSmokeChecks";
import { getObservabilitySnapshot } from "@/lib/troptions/observabilityEngine";

describe("Phase 9 production data layer and observability", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetDatabaseAdapterForTests();
    resetMetricsForTests();
    clearStructuredLogsForTests();
    clearEscalationLogForTests();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("SQLite adapter health check passes", async () => {
    const adapter = createSqliteAdapter();
    const health = await adapter.healthCheck();
    expect(health.ok).toBe(true);
    expect(health.adapter).toBe("sqlite");
  });

  it("Postgres adapter is disabled safely without DATABASE_URL", async () => {
    delete process.env.DATABASE_URL;
    const adapter = createPostgresAdapter();
    expect(adapter.isConfigured()).toBe(false);

    const health = await adapter.healthCheck();
    expect(health.ok).toBe(false);
    expect(health.details?.toLowerCase()).toContain("disabled");
  });

  it("database adapter defaults to SQLite", () => {
    delete process.env.TROPTIONS_DB_ADAPTER;
    delete process.env.DATABASE_URL;

    expect(resolveDatabaseAdapterType()).toBe("sqlite");
    expect(getDatabaseAdapter().type).toBe("sqlite");
  });

  it("database adapter selects Postgres when configured", () => {
    process.env.TROPTIONS_DB_ADAPTER = "postgres";
    process.env.DATABASE_URL = "postgres://localhost:5432/troptions";

    expect(resolveDatabaseAdapterType()).toBe("postgres");
    expect(getDatabaseAdapter().type).toBe("postgres");
  });

  it("structured logger redacts secrets", () => {
    const payload = redactSecrets({
      token: "abc",
      authorization: "Bearer hello",
      nested: { privateKey: "secret-key" },
    }) as Record<string, unknown>;

    expect(payload.token).toBe("[REDACTED]");
    expect(payload.authorization).toBe("[REDACTED]");
    expect((payload.nested as Record<string, unknown>).privateKey).toBe("[REDACTED]");
  });

  it("metrics registry increments counters", () => {
    incrementMetric("api_requests_total");
    incrementMetric("api_requests_total");
    incrementMetric("auth_failures");

    const snapshot = getMetricsSnapshot();
    expect(snapshot.api_requests_total).toBe(2);
    expect(snapshot.auth_failures).toBe(1);
  });

  it("alert escalation triggers for repeated auth failures", async () => {
    incrementMetric("auth_failures", 6);
    const escalations = await evaluateEscalationPolicies();
    expect(escalations.some((item) => item.trigger === "repeated-auth-failures")).toBe(true);
  });

  it("retention policy has required durations", () => {
    expect(RETENTION_POLICY.structuredApiLogs.days).toBe(90);
    expect(RETENTION_POLICY.monitoringMetrics.days).toBe(395);
    expect(RETENTION_POLICY.incidentRecords.days).toBe(2555);
    expect(RETENTION_POLICY.auditLogs.days).toBe(Number.POSITIVE_INFINITY);
  });

  it("incident drill registry includes required drills", () => {
    const ids = INCIDENT_DRILLS.map((item) => item.drillId);
    expect(ids).toEqual(
      expect.arrayContaining([
        "audit-chain-tamper",
        "production-lockdown",
        "key-compromise",
        "failed-release-gate",
        "database-restore",
        "backup-missing",
        "unauthorized-approval-attempt",
      ]),
    );
  });

  it("production smoke checks return pass/fail object", async () => {
    Object.assign(process.env, {
      NODE_ENV: "test",
      TROPTIONS_CONTROL_PLANE_TOKEN: "test-token",
      TROPTIONS_ALLOW_STATIC_TOKEN_AUTH: "1",
    });

    const result = await runProductionSmokeChecks();
    expect(typeof result.ok).toBe("boolean");
    expect(result.checks).toBeDefined();
    expect(result.checks.healthLive).toBeDefined();
  });

  it("observability snapshot excludes secrets", async () => {
    logStructuredEvent({
      level: "info",
      service: "troptions-control-plane",
      actionType: "test",
      metadata: {
        token: "hidden",
        authorization: "Bearer abc",
        safe: "ok",
      },
    });

    const snapshot = await getObservabilitySnapshot();
    const logsAsString = JSON.stringify(snapshot.recentLogs);
    expect(logsAsString).not.toContain("Bearer abc");
    expect(logsAsString).not.toContain("hidden");
    expect(logsAsString).toContain("[REDACTED]");
  });

  it("backup retention plan keeps expected snapshots", () => {
    const now = new Date("2026-04-25T12:00:00.000Z");
    const snapshots = [
      { filePath: "daily-1.db", createdAt: new Date("2026-04-24T12:00:00.000Z") },
      { filePath: "daily-2.db", createdAt: new Date("2026-04-23T12:00:00.000Z") },
      { filePath: "weekly-1.db", createdAt: new Date("2026-03-20T12:00:00.000Z") },
      { filePath: "weekly-2.db", createdAt: new Date("2026-03-18T12:00:00.000Z") },
      { filePath: "monthly-1.db", createdAt: new Date("2025-10-01T12:00:00.000Z") },
      { filePath: "old.db", createdAt: new Date("2024-01-01T12:00:00.000Z") },
    ];

    const plan = buildBackupRetentionPlan(snapshots, now);
    expect(plan.keep).toContain(path.normalize("daily-1.db"));
    expect(plan.keep).toContain(path.normalize("daily-2.db"));
    expect(plan.prune).toContain(path.normalize("old.db"));
  });

  it("database migration script dry-run mode works", () => {
    const output = execFileSync("node", ["scripts/migrate-sqlite-to-postgres.mjs", "--dry-run"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(output).toContain("dry-run");
  });

  it("durable observability is disabled by default without Postgres config", async () => {
    delete process.env.TROPTIONS_DB_ADAPTER;
    delete process.env.DATABASE_URL;

    expect(isDurableObservabilityEnabled()).toBe(false);
    await expect(getDurableObservabilityExport(10)).resolves.toEqual({
      logs: [],
      metrics: [],
      escalations: [],
      drills: [],
    });
  });

  it("observability snapshot includes durable mode metadata", async () => {
    delete process.env.TROPTIONS_DB_ADAPTER;
    delete process.env.DATABASE_URL;

    const snapshot = await getObservabilitySnapshot();
    expect(snapshot.durableObservability).toBeDefined();
    expect(typeof snapshot.durableObservability.enabled).toBe("boolean");
    expect(snapshot.durableObservability.enabled).toBe(false);
  });
});
