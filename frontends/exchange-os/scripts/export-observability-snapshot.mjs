import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import pkg from "pg";

const { Pool } = pkg;

const root = process.cwd();
const dbPath = path.join(root, "data", "troptions-control-plane", "control-plane.db");
const outDir = path.join(root, "data", "observability");

function redact(entry) {
  const asText = JSON.stringify(entry);
  return asText
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "[REDACTED]")
    .replace(/"authorization"\s*:\s*"[^"]+"/gi, '"authorization":"[REDACTED]"')
    .replace(/"token"\s*:\s*"[^"]+"/gi, '"token":"[REDACTED]"')
    .replace(/"secret"\s*:\s*"[^"]+"/gi, '"secret":"[REDACTED]"');
}

function parseJsonIfNeeded(value) {
  if (value == null) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function readFromSqlite() {
  if (!fs.existsSync(dbPath)) {
    return { source: "sqlite", metrics: [], logs: [], escalations: [], drills: [] };
  }

  const db = new Database(dbPath, { readonly: true });
  try {
    const metrics = db
      .prepare("SELECT event_name AS eventName, level, tags_json AS tags, created_at AS createdAt FROM control_plane_metrics ORDER BY id DESC LIMIT 500")
      .all()
      .map((row) => ({ ...row, tags: parseJsonIfNeeded(row.tags) }));

    return {
      source: "sqlite",
      metrics,
      logs: [],
      escalations: [],
      drills: [],
    };
  } finally {
    db.close();
  }
}

async function readFromPostgres() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const [metrics, logs, escalations, drills] = await Promise.all([
      pool.query(
        `SELECT event_name AS "eventName", level, tags_json AS tags, created_at AS "createdAt"
         FROM control_plane_metrics_events
         ORDER BY id DESC
         LIMIT 500`,
      ),
      pool.query(
        `SELECT timestamp, level, service, route, actor_id AS "actorId", actor_role AS "actorRole",
                action_type AS "actionType", subject_id AS "subjectId", request_id AS "requestId",
                correlation_id AS "correlationId", outcome, duration_ms AS "durationMs", metadata_json AS metadata
         FROM control_plane_structured_logs
         ORDER BY id DESC
         LIMIT 500`,
      ),
      pool.query(
        `SELECT escalation_id AS "escalationId", level, trigger, details, created_at AS "createdAt"
         FROM control_plane_escalations
         ORDER BY id DESC
         LIMIT 500`,
      ),
      pool.query(
        `SELECT run_id AS "runId", drill_id AS "drillId", passed, started_at AS "startedAt",
                completed_at AS "completedAt", notes
         FROM control_plane_incident_drills
         ORDER BY id DESC
         LIMIT 500`,
      ),
    ]);

    return {
      source: "postgres",
      metrics: metrics.rows,
      logs: logs.rows,
      escalations: escalations.rows,
      drills: drills.rows,
    };
  } finally {
    await pool.end();
  }
}

async function run() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let payload;
  const usePostgres =
    (process.env.TROPTIONS_DB_ADAPTER || "sqlite").toLowerCase() === "postgres" &&
    Boolean(process.env.DATABASE_URL);

  if (usePostgres) {
    try {
      payload = await readFromPostgres();
    } catch {
      payload = readFromSqlite();
    }
  } else {
    payload = readFromSqlite();
  }

  const snapshot = {
    exportedAt: new Date().toISOString(),
    ...payload,
  };

  const redacted = JSON.parse(redact(snapshot));
  const fileName = `observability-${new Date().toISOString().replace(/[.:]/g, "-")}.json`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(redacted, null, 2), "utf8");
  console.log(filePath);
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
