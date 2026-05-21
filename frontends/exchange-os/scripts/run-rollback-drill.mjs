import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const root = process.cwd();
const dbDir = path.join(root, "data", "troptions-control-plane");
const dbPath = path.join(dbDir, "control-plane.db");
const tmpDir = path.join(root, "data", "tmp");
const backupPath = path.join(tmpDir, `rollback-drill-${Date.now()}.db`);
const markerName = "__rollback_drill_marker__";

function ensureDirs() {
  fs.mkdirSync(dbDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });
}

function ensureStateTable() {
  const db = new Database(dbPath);
  try {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS control_plane_state (
        name TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    ).run();
  } finally {
    db.close();
  }
}

function restoreFromBackup() {
  for (const suffix of ["", "-wal", "-shm"]) {
    const target = `${dbPath}${suffix}`;
    if (fs.existsSync(target)) {
      fs.rmSync(target);
    }
  }

  fs.copyFileSync(backupPath, dbPath);
  for (const suffix of ["-wal", "-shm"]) {
    const sourceSidecar = `${backupPath}${suffix}`;
    if (fs.existsSync(sourceSidecar)) {
      fs.copyFileSync(sourceSidecar, `${dbPath}${suffix}`);
    }
  }
}

function run() {
  ensureDirs();
  ensureStateTable();

  const startedAt = Date.now();

  fs.copyFileSync(dbPath, backupPath);
  for (const suffix of ["-wal", "-shm"]) {
    const sidecar = `${dbPath}${suffix}`;
    if (fs.existsSync(sidecar)) {
      fs.copyFileSync(sidecar, `${backupPath}${suffix}`);
    }
  }

  const db = new Database(dbPath);
  try {
    db.prepare(
      `INSERT INTO control_plane_state (name, payload, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
    ).run(markerName, JSON.stringify({ drill: true }), new Date().toISOString());
  } finally {
    db.close();
  }

  const restoreStarted = Date.now();
  restoreFromBackup();
  const restoreElapsedMs = Date.now() - restoreStarted;

  const verifyDb = new Database(dbPath, { readonly: true });
  let markerExists = false;
  try {
    const row = verifyDb.prepare("SELECT 1 AS present FROM control_plane_state WHERE name = ?").get(markerName);
    markerExists = Boolean(row?.present);
  } finally {
    verifyDb.close();
  }

  const result = {
    startedAt: new Date(startedAt).toISOString(),
    completedAt: new Date().toISOString(),
    backupPath,
    rollbackVerified: !markerExists,
    restoreElapsedMs,
    totalElapsedMs: Date.now() - startedAt,
  };

  console.log(JSON.stringify(result, null, 2));
  if (!result.rollbackVerified) {
    process.exitCode = 2;
  }
}

run();
