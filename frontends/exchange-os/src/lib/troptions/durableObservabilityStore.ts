import { Pool } from "pg";
import type { EscalationLevel } from "@/lib/troptions/alertEscalation";
import type { StructuredLogEvent } from "@/lib/troptions/structuredLogger";

export interface DurableMetricEvent {
  eventName: string;
  level: "info" | "warn" | "error";
  tags: Record<string, unknown>;
  createdAt?: string;
}

export interface DurableEscalationEvent {
  escalationId: string;
  level: EscalationLevel;
  trigger: string;
  details: string;
  createdAt: string;
}

export interface DurableIncidentDrillEvent {
  runId: string;
  drillId: string;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  notes: string;
}

let pool: Pool | null = null;
let schemaReady = false;

function isPostgresAdapterEnabled(): boolean {
  const adapter = (process.env.TROPTIONS_DB_ADAPTER ?? "sqlite").toLowerCase();
  return adapter === "postgres" && Boolean(process.env.DATABASE_URL?.trim());
}

export function isDurableObservabilityEnabled(): boolean {
  return isPostgresAdapterEnabled();
}

function getPool(): Pool | null {
  if (!isPostgresAdapterEnabled()) return null;
  if (pool) return pool;

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

async function ensureSchema(): Promise<boolean> {
  if (schemaReady) return true;
  const pgPool = getPool();
  if (!pgPool) return false;

  const client = await pgPool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS control_plane_structured_logs (
        id BIGSERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL,
        level TEXT NOT NULL,
        service TEXT NOT NULL,
        route TEXT,
        actor_id TEXT,
        actor_role TEXT,
        action_type TEXT,
        subject_id TEXT,
        request_id TEXT,
        correlation_id TEXT,
        outcome TEXT,
        duration_ms INTEGER,
        metadata_json JSONB
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS control_plane_metrics_events (
        id BIGSERIAL PRIMARY KEY,
        event_name TEXT NOT NULL,
        level TEXT NOT NULL,
        tags_json JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS control_plane_escalations (
        id BIGSERIAL PRIMARY KEY,
        escalation_id TEXT UNIQUE NOT NULL,
        level TEXT NOT NULL,
        trigger TEXT NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS control_plane_incident_drills (
        id BIGSERIAL PRIMARY KEY,
        run_id TEXT UNIQUE NOT NULL,
        drill_id TEXT NOT NULL,
        passed BOOLEAN NOT NULL,
        started_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ NOT NULL,
        notes TEXT NOT NULL
      )
    `);

    schemaReady = true;
    return true;
  } finally {
    client.release();
  }
}

export async function recordStructuredLogDurably(event: StructuredLogEvent): Promise<void> {
  if (!(await ensureSchema())) return;
  const pgPool = getPool();
  if (!pgPool) return;

  await pgPool.query(
    `INSERT INTO control_plane_structured_logs (
       timestamp, level, service, route, actor_id, actor_role, action_type,
       subject_id, request_id, correlation_id, outcome, duration_ms, metadata_json
     )
     VALUES ($1::timestamptz, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)`,
    [
      event.timestamp,
      event.level,
      event.service,
      event.route ?? null,
      event.actorId ?? null,
      event.actorRole ?? null,
      event.actionType ?? null,
      event.subjectId ?? null,
      event.requestId ?? null,
      event.correlationId ?? null,
      event.outcome ?? null,
      typeof event.durationMs === "number" ? event.durationMs : null,
      JSON.stringify(event.metadata ?? {}),
    ],
  );
}

export async function recordMetricEventDurably(event: DurableMetricEvent): Promise<void> {
  if (!(await ensureSchema())) return;
  const pgPool = getPool();
  if (!pgPool) return;

  await pgPool.query(
    `INSERT INTO control_plane_metrics_events (event_name, level, tags_json, created_at)
     VALUES ($1, $2, $3::jsonb, $4::timestamptz)`,
    [
      event.eventName,
      event.level,
      JSON.stringify(event.tags),
      event.createdAt ?? new Date().toISOString(),
    ],
  );
}

export async function recordEscalationDurably(event: DurableEscalationEvent): Promise<void> {
  if (!(await ensureSchema())) return;
  const pgPool = getPool();
  if (!pgPool) return;

  await pgPool.query(
    `INSERT INTO control_plane_escalations (escalation_id, level, trigger, details, created_at)
     VALUES ($1, $2, $3, $4, $5::timestamptz)
     ON CONFLICT (escalation_id) DO NOTHING`,
    [event.escalationId, event.level, event.trigger, event.details, event.createdAt],
  );
}

export async function recordIncidentDrillDurably(event: DurableIncidentDrillEvent): Promise<void> {
  if (!(await ensureSchema())) return;
  const pgPool = getPool();
  if (!pgPool) return;

  await pgPool.query(
    `INSERT INTO control_plane_incident_drills (
       run_id, drill_id, passed, started_at, completed_at, notes
     ) VALUES ($1, $2, $3, $4::timestamptz, $5::timestamptz, $6)
     ON CONFLICT (run_id) DO NOTHING`,
    [event.runId, event.drillId, event.passed, event.startedAt, event.completedAt, event.notes],
  );
}

export async function getDurableObservabilityExport(limit = 500): Promise<{
  logs: unknown[];
  metrics: unknown[];
  escalations: unknown[];
  drills: unknown[];
}> {
  if (!(await ensureSchema())) {
    return { logs: [], metrics: [], escalations: [], drills: [] };
  }

  const pgPool = getPool();
  if (!pgPool) {
    return { logs: [], metrics: [], escalations: [], drills: [] };
  }

  const safeLimit = Math.max(1, Math.min(limit, 5000));

  const [logs, metrics, escalations, drills] = await Promise.all([
    pgPool.query(
      `SELECT timestamp, level, service, route, actor_id AS "actorId", actor_role AS "actorRole",
              action_type AS "actionType", subject_id AS "subjectId", request_id AS "requestId",
              correlation_id AS "correlationId", outcome, duration_ms AS "durationMs", metadata_json AS metadata
       FROM control_plane_structured_logs
       ORDER BY id DESC
       LIMIT $1`,
      [safeLimit],
    ),
    pgPool.query(
      `SELECT event_name AS "eventName", level, tags_json AS tags, created_at AS "createdAt"
       FROM control_plane_metrics_events
       ORDER BY id DESC
       LIMIT $1`,
      [safeLimit],
    ),
    pgPool.query(
      `SELECT escalation_id AS "escalationId", level, trigger, details, created_at AS "createdAt"
       FROM control_plane_escalations
       ORDER BY id DESC
       LIMIT $1`,
      [safeLimit],
    ),
    pgPool.query(
      `SELECT run_id AS "runId", drill_id AS "drillId", passed, started_at AS "startedAt",
              completed_at AS "completedAt", notes
       FROM control_plane_incident_drills
       ORDER BY id DESC
       LIMIT $1`,
      [safeLimit],
    ),
  ]);

  return {
    logs: logs.rows,
    metrics: metrics.rows,
    escalations: escalations.rows,
    drills: drills.rows,
  };
}
