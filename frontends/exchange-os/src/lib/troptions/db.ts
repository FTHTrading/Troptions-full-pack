import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const CONTROL_PLANE_DIR = path.join(process.cwd(), "data", "troptions-control-plane");
const DB_PATH = path.join(CONTROL_PLANE_DIR, "control-plane.db");

let db: Database.Database | null = null;

function ensureControlPlaneDir(): void {
  if (!fs.existsSync(CONTROL_PLANE_DIR)) {
    fs.mkdirSync(CONTROL_PLANE_DIR, { recursive: true });
  }
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS control_plane_state (
      name TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_plane_users (
      actor_id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      email TEXT,
      display_name TEXT,
      auth_provider TEXT NOT NULL,
      auth_subject TEXT,
      last_seen_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_plane_idempotency (
      idempotency_key TEXT NOT NULL,
      route_key TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      request_hash TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      response_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      PRIMARY KEY (idempotency_key, route_key, actor_id)
    );

    CREATE TABLE IF NOT EXISTS control_plane_rate_limit (
      bucket_key TEXT NOT NULL,
      window_start INTEGER NOT NULL,
      hit_count INTEGER NOT NULL,
      PRIMARY KEY (bucket_key, window_start)
    );

    CREATE TABLE IF NOT EXISTS control_plane_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT NOT NULL,
      level TEXT NOT NULL,
      tags_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_hub_tasks (
      id TEXT PRIMARY KEY,
      intent TEXT NOT NULL,
      status TEXT NOT NULL,
      audit_token TEXT NOT NULL,
      routed_to TEXT NOT NULL,
      requires_approval INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_hub_simulations (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      simulation_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_hub_approvals (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      required_for TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_hub_audit_entries (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      audit_token TEXT NOT NULL,
      intent TEXT NOT NULL,
      action_type TEXT NOT NULL,
      outcome TEXT NOT NULL,
      blocked_count INTEGER NOT NULL DEFAULT 0,
      requires_approval INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_hub_blocked_actions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      capability_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS control_hub_recommendations (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'low',
      created_at TEXT NOT NULL
    );
  `);
}

export function getControlPlaneDb(): Database.Database {
  if (db) return db;

  ensureControlPlaneDir();
  const database = new Database(DB_PATH);
  database.pragma("journal_mode = WAL");
  database.pragma("synchronous = NORMAL");
  initSchema(database);
  db = database;
  return db;
}

export function loadStateFromDb<T>(name: string): T[] | null {
  const database = getControlPlaneDb();
  const row = database
    .prepare("SELECT payload FROM control_plane_state WHERE name = ?")
    .get(name) as { payload: string } | undefined;

  if (!row) return null;
  const parsed = JSON.parse(row.payload) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`[ControlPlaneDb] State ${name} is not a JSON array.`);
  }

  return parsed as T[];
}

export function saveStateToDb<T>(name: string, payload: T[]): void {
  const database = getControlPlaneDb();
  const now = new Date().toISOString();
  database
    .prepare(
      `INSERT INTO control_plane_state (name, payload, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET
         payload = excluded.payload,
         updated_at = excluded.updated_at`,
    )
    .run(name, JSON.stringify(payload), now);
}

export interface UserAccountUpsertInput {
  actorId: string;
  role: string;
  authProvider: "jwt" | "token";
  authSubject?: string;
  email?: string;
  displayName?: string;
}

export function upsertUserAccount(input: UserAccountUpsertInput): void {
  const database = getControlPlaneDb();
  const now = new Date().toISOString();
  database
    .prepare(
      `INSERT INTO control_plane_users (
         actor_id, role, email, display_name, auth_provider, auth_subject, last_seen_at, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(actor_id) DO UPDATE SET
         role = excluded.role,
         email = COALESCE(excluded.email, control_plane_users.email),
         display_name = COALESCE(excluded.display_name, control_plane_users.display_name),
         auth_provider = excluded.auth_provider,
         auth_subject = COALESCE(excluded.auth_subject, control_plane_users.auth_subject),
         last_seen_at = excluded.last_seen_at,
         updated_at = excluded.updated_at`,
    )
    .run(
      input.actorId,
      input.role,
      input.email ?? null,
      input.displayName ?? null,
      input.authProvider,
      input.authSubject ?? null,
      now,
      now,
      now,
    );
}

export interface IdempotencyRecord {
  statusCode: number;
  responseJson: string;
}

export function getIdempotencyRecord(
  idempotencyKey: string,
  routeKey: string,
  actorId: string,
  requestHash: string,
): IdempotencyRecord | null {
  const database = getControlPlaneDb();
  const now = new Date().toISOString();
  database
    .prepare(
      "DELETE FROM control_plane_idempotency WHERE expires_at <= ?",
    )
    .run(now);

  const row = database
    .prepare(
      `SELECT request_hash, status_code, response_json
       FROM control_plane_idempotency
       WHERE idempotency_key = ? AND route_key = ? AND actor_id = ?`,
    )
    .get(idempotencyKey, routeKey, actorId) as
    | { request_hash: string; status_code: number; response_json: string }
    | undefined;

  if (!row) return null;
  if (row.request_hash !== requestHash) {
    throw new Error("Idempotency key reuse detected with a different request payload.");
  }

  return {
    statusCode: row.status_code,
    responseJson: row.response_json,
  };
}

export function saveIdempotencyRecord(
  idempotencyKey: string,
  routeKey: string,
  actorId: string,
  requestHash: string,
  statusCode: number,
  responseBody: unknown,
  ttlSeconds: number,
): void {
  const database = getControlPlaneDb();
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();

  database
    .prepare(
      `INSERT INTO control_plane_idempotency (
         idempotency_key, route_key, actor_id, request_hash, status_code, response_json, created_at, expires_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(idempotency_key, route_key, actor_id) DO UPDATE SET
         request_hash = excluded.request_hash,
         status_code = excluded.status_code,
         response_json = excluded.response_json,
         created_at = excluded.created_at,
         expires_at = excluded.expires_at`,
    )
    .run(
      idempotencyKey,
      routeKey,
      actorId,
      requestHash,
      statusCode,
      JSON.stringify(responseBody),
      createdAt,
      expiresAt,
    );
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtEpochSeconds: number;
}

export function consumeRateLimit(bucketKey: string, limit: number, windowSeconds: number): RateLimitResult {
  const database = getControlPlaneDb();
  const nowEpochSeconds = Math.floor(Date.now() / 1000);
  const windowStart = nowEpochSeconds - (nowEpochSeconds % windowSeconds);
  const resetAt = windowStart + windowSeconds;

  database
    .prepare(
      "INSERT INTO control_plane_rate_limit (bucket_key, window_start, hit_count) VALUES (?, ?, 0) ON CONFLICT(bucket_key, window_start) DO NOTHING",
    )
    .run(bucketKey, windowStart);

  database
    .prepare(
      "UPDATE control_plane_rate_limit SET hit_count = hit_count + 1 WHERE bucket_key = ? AND window_start = ?",
    )
    .run(bucketKey, windowStart);

  const row = database
    .prepare(
      "SELECT hit_count FROM control_plane_rate_limit WHERE bucket_key = ? AND window_start = ?",
    )
    .get(bucketKey, windowStart) as { hit_count: number };

  const remaining = Math.max(0, limit - row.hit_count);
  return {
    allowed: row.hit_count <= limit,
    limit,
    remaining,
    resetAtEpochSeconds: resetAt,
  };
}

export function insertMetric(eventName: string, level: "info" | "warn" | "error", tags: Record<string, unknown>): void {
  const database = getControlPlaneDb();
  database
    .prepare(
      "INSERT INTO control_plane_metrics (event_name, level, tags_json, created_at) VALUES (?, ?, ?, ?)",
    )
    .run(eventName, level, JSON.stringify(tags), new Date().toISOString());
}

export function hashRequestBody(bodyText: string): string {
  return crypto.createHash("sha256").update(bodyText, "utf8").digest("hex");
}
