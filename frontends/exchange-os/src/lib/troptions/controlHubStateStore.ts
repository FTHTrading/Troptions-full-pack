/**
 * Control Hub Governance State Store
 *
 * Provides create/list functions for all Control Hub persistence records.
 * Primary store: SQLite via `getControlPlaneDb()` (always available).
 * Durable store: Postgres via `controlHubDurableStore` (when configured).
 *
 * SAFETY RULES enforced here:
 * - No execution-enabling logic
 * - No financial, wallet, trade, or settlement operations
 * - Simulation-only boundaries are preserved — this store only records evaluations
 */

import crypto from "node:crypto";
import { getControlPlaneDb } from "@/lib/troptions/db";
import {
  resolveDatabaseAdapterType,
} from "@/lib/troptions/databaseAdapter";
import type {
  ControlHubTaskRecord,
  ControlHubSimulationRecord,
  ControlHubApprovalRecord,
  ControlHubAuditRecord,
  ControlHubBlockedActionRecord,
  ControlHubRecommendationRecord,
  ControlHubStateSnapshot,
  ControlHubPersistenceMode,
  CreateControlHubTaskInput,
  CreateControlHubSimulationInput,
  CreateControlHubApprovalInput,
  CreateControlHubAuditInput,
  CreateControlHubBlockedActionInput,
  CreateControlHubRecommendationInput,
} from "@/lib/troptions/controlHubStateTypes";

// ─── id generation ────────────────────────────────────────────────────────────

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

// ─── task records ──────────────────────────────────────────────────────────────

export function createTaskRecord(input: CreateControlHubTaskInput): ControlHubTaskRecord {
  const db = getControlPlaneDb();
  const now = new Date().toISOString();
  const record: ControlHubTaskRecord = {
    id: newId("cht"),
    intent: input.intent,
    status: input.status,
    auditToken: input.auditToken,
    routedTo: input.routedTo,
    requiresApproval: input.requiresApproval,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    `INSERT INTO control_hub_tasks
       (id, intent, status, audit_token, routed_to, requires_approval, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    record.id,
    record.intent,
    record.status,
    record.auditToken,
    JSON.stringify(record.routedTo),
    record.requiresApproval ? 1 : 0,
    record.createdAt,
    record.updatedAt,
  );

  return record;
}

export function getTaskRecord(id: string): ControlHubTaskRecord | null {
  const db = getControlPlaneDb();
  const row = db
    .prepare("SELECT * FROM control_hub_tasks WHERE id = ?")
    .get(id) as DbTaskRow | undefined;

  return row ? rowToTask(row) : null;
}

export function listTaskRecords(limit = 100): ControlHubTaskRecord[] {
  const db = getControlPlaneDb();
  const rows = db
    .prepare("SELECT * FROM control_hub_tasks ORDER BY created_at DESC, rowid DESC LIMIT ?")
    .all(limit) as DbTaskRow[];

  return rows.map(rowToTask);
}

interface DbTaskRow {
  id: string;
  intent: string;
  status: string;
  audit_token: string;
  routed_to: string;
  requires_approval: number;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: DbTaskRow): ControlHubTaskRecord {
  return {
    id: row.id,
    intent: row.intent,
    status: row.status as ControlHubTaskRecord["status"],
    auditToken: row.audit_token,
    routedTo: JSON.parse(row.routed_to) as string[],
    requiresApproval: row.requires_approval === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── simulation records ────────────────────────────────────────────────────────

export function createSimulationRecord(
  input: CreateControlHubSimulationInput,
): ControlHubSimulationRecord {
  const db = getControlPlaneDb();
  const now = new Date().toISOString();
  const record: ControlHubSimulationRecord = {
    id: newId("chs"),
    taskId: input.taskId,
    simulationJson: input.simulationJson,
    createdAt: now,
  };

  db.prepare(
    "INSERT INTO control_hub_simulations (id, task_id, simulation_json, created_at) VALUES (?, ?, ?, ?)",
  ).run(record.id, record.taskId, record.simulationJson, record.createdAt);

  return record;
}

export function listSimulationRecords(
  taskId?: string,
  limit = 100,
): ControlHubSimulationRecord[] {
  const db = getControlPlaneDb();
  const rows = taskId
    ? (db
        .prepare(
          "SELECT * FROM control_hub_simulations WHERE task_id = ? ORDER BY created_at DESC LIMIT ?",
        )
        .all(taskId, limit) as DbSimRow[])
    : (db
        .prepare("SELECT * FROM control_hub_simulations ORDER BY created_at DESC LIMIT ?")
        .all(limit) as DbSimRow[]);

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    simulationJson: r.simulation_json,
    createdAt: r.created_at,
  }));
}

interface DbSimRow {
  id: string;
  task_id: string;
  simulation_json: string;
  created_at: string;
}

// ─── approval records ──────────────────────────────────────────────────────────

export function createApprovalRecord(
  input: CreateControlHubApprovalInput,
): ControlHubApprovalRecord {
  const db = getControlPlaneDb();
  const now = new Date().toISOString();
  const record: ControlHubApprovalRecord = {
    id: newId("cha"),
    taskId: input.taskId,
    requiredFor: input.requiredFor,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    `INSERT INTO control_hub_approvals
       (id, task_id, required_for, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    record.id,
    record.taskId,
    record.requiredFor,
    record.status,
    record.createdAt,
    record.updatedAt,
  );

  return record;
}

export function listApprovalRecords(
  taskId?: string,
  limit = 100,
): ControlHubApprovalRecord[] {
  const db = getControlPlaneDb();
  const rows = taskId
    ? (db
        .prepare(
          "SELECT * FROM control_hub_approvals WHERE task_id = ? ORDER BY created_at DESC LIMIT ?",
        )
        .all(taskId, limit) as DbApprovalRow[])
    : (db
        .prepare("SELECT * FROM control_hub_approvals ORDER BY created_at DESC LIMIT ?")
        .all(limit) as DbApprovalRow[]);

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    requiredFor: r.required_for,
    status: r.status as ControlHubApprovalRecord["status"],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

interface DbApprovalRow {
  id: string;
  task_id: string;
  required_for: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ─── audit records ─────────────────────────────────────────────────────────────

export function createAuditRecord(input: CreateControlHubAuditInput): ControlHubAuditRecord {
  const db = getControlPlaneDb();
  const now = new Date().toISOString();
  const record: ControlHubAuditRecord = {
    id: newId("cau"),
    taskId: input.taskId,
    auditToken: input.auditToken,
    intent: input.intent,
    actionType: input.actionType,
    outcome: input.outcome,
    blockedCount: input.blockedCount,
    requiresApproval: input.requiresApproval,
    createdAt: now,
  };

  db.prepare(
    `INSERT INTO control_hub_audit_entries
       (id, task_id, audit_token, intent, action_type, outcome, blocked_count, requires_approval, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    record.id,
    record.taskId,
    record.auditToken,
    record.intent,
    record.actionType,
    record.outcome,
    record.blockedCount,
    record.requiresApproval ? 1 : 0,
    record.createdAt,
  );

  return record;
}

export function listAuditRecords(limit = 100): ControlHubAuditRecord[] {
  const db = getControlPlaneDb();
  const rows = db
    .prepare("SELECT * FROM control_hub_audit_entries ORDER BY created_at DESC LIMIT ?")
    .all(limit) as DbAuditRow[];

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    auditToken: r.audit_token,
    intent: r.intent,
    actionType: r.action_type,
    outcome: r.outcome,
    blockedCount: r.blocked_count,
    requiresApproval: r.requires_approval === 1,
    createdAt: r.created_at,
  }));
}

interface DbAuditRow {
  id: string;
  task_id: string;
  audit_token: string;
  intent: string;
  action_type: string;
  outcome: string;
  blocked_count: number;
  requires_approval: number;
  created_at: string;
}

// ─── blocked action records ────────────────────────────────────────────────────

export function createBlockedActionRecord(
  input: CreateControlHubBlockedActionInput,
): ControlHubBlockedActionRecord {
  const db = getControlPlaneDb();
  const now = new Date().toISOString();
  const record: ControlHubBlockedActionRecord = {
    id: newId("chb"),
    taskId: input.taskId,
    capabilityId: input.capabilityId,
    reason: input.reason,
    createdAt: now,
  };

  db.prepare(
    "INSERT INTO control_hub_blocked_actions (id, task_id, capability_id, reason, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(record.id, record.taskId, record.capabilityId, record.reason, record.createdAt);

  return record;
}

export function listBlockedActionRecords(
  taskId?: string,
  limit = 100,
): ControlHubBlockedActionRecord[] {
  const db = getControlPlaneDb();
  const rows = taskId
    ? (db
        .prepare(
          "SELECT * FROM control_hub_blocked_actions WHERE task_id = ? ORDER BY created_at DESC LIMIT ?",
        )
        .all(taskId, limit) as DbBlockedRow[])
    : (db
        .prepare("SELECT * FROM control_hub_blocked_actions ORDER BY created_at DESC LIMIT ?")
        .all(limit) as DbBlockedRow[]);

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    capabilityId: r.capability_id,
    reason: r.reason,
    createdAt: r.created_at,
  }));
}

interface DbBlockedRow {
  id: string;
  task_id: string;
  capability_id: string;
  reason: string;
  created_at: string;
}

// ─── recommendation records ────────────────────────────────────────────────────

export function createRecommendationRecord(
  input: CreateControlHubRecommendationInput,
): ControlHubRecommendationRecord {
  const db = getControlPlaneDb();
  const now = new Date().toISOString();
  const record: ControlHubRecommendationRecord = {
    id: newId("chr"),
    taskId: input.taskId,
    recommendation: input.recommendation,
    priority: input.priority,
    createdAt: now,
  };

  db.prepare(
    "INSERT INTO control_hub_recommendations (id, task_id, recommendation, priority, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(
    record.id,
    record.taskId,
    record.recommendation,
    record.priority,
    record.createdAt,
  );

  return record;
}

export function listRecommendationRecords(
  taskId?: string,
  limit = 100,
): ControlHubRecommendationRecord[] {
  const db = getControlPlaneDb();
  const rows = taskId
    ? (db
        .prepare(
          "SELECT * FROM control_hub_recommendations WHERE task_id = ? ORDER BY created_at DESC LIMIT ?",
        )
        .all(taskId, limit) as DbRecommendationRow[])
    : (db
        .prepare("SELECT * FROM control_hub_recommendations ORDER BY created_at DESC LIMIT ?")
        .all(limit) as DbRecommendationRow[]);

  return rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    recommendation: r.recommendation,
    priority: r.priority as ControlHubRecommendationRecord["priority"],
    createdAt: r.created_at,
  }));
}

interface DbRecommendationRow {
  id: string;
  task_id: string;
  recommendation: string;
  priority: string;
  created_at: string;
}

// ─── state snapshot ────────────────────────────────────────────────────────────

export function getControlHubStateSnapshot(): ControlHubStateSnapshot {
  const db = getControlPlaneDb();

  const count = (table: string): number => {
    const row = db.prepare(`SELECT COUNT(*) as n FROM ${table}`).get() as { n: number };
    return row.n;
  };

  const countWhere = (table: string, col: string, val: string | number): number => {
    const row = db
      .prepare(`SELECT COUNT(*) as n FROM ${table} WHERE ${col} = ?`)
      .get(val) as { n: number };
    return row.n;
  };

  const lastRow = db
    .prepare("SELECT updated_at FROM control_hub_tasks ORDER BY updated_at DESC LIMIT 1")
    .get() as { updated_at: string } | undefined;

  const persistenceMode: ControlHubPersistenceMode =
    resolveDatabaseAdapterType() === "postgres" ? "postgres" : "sqlite";

  return {
    totalTasks: count("control_hub_tasks"),
    totalSimulations: count("control_hub_simulations"),
    totalApprovalRequired: countWhere("control_hub_tasks", "requires_approval", 1),
    totalBlockedActions: count("control_hub_blocked_actions"),
    totalAuditEntries: count("control_hub_audit_entries"),
    totalRecommendations: count("control_hub_recommendations"),
    lastUpdatedAt: lastRow?.updated_at ?? null,
    persistenceMode,
  };
}
