import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { AdapterHealth, StateDatabaseAdapter } from "@/lib/troptions/databaseAdapter";

const CONTROL_PLANE_DIR = path.join(process.cwd(), "data", "troptions-control-plane");
const DB_PATH = path.join(CONTROL_PLANE_DIR, "control-plane.db");

let sqliteDb: Database.Database | null = null;

function getSqliteDb(): Database.Database {
  if (sqliteDb) return sqliteDb;

  if (!fs.existsSync(CONTROL_PLANE_DIR)) {
    fs.mkdirSync(CONTROL_PLANE_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.prepare(
    `CREATE TABLE IF NOT EXISTS control_plane_state (
      name TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ).run();

  sqliteDb = db;
  return db;
}

export function createSqliteAdapter(): StateDatabaseAdapter {
  return {
    type: "sqlite",
    isConfigured: () => true,
    async healthCheck(): Promise<AdapterHealth> {
      const start = Date.now();
      try {
        const db = getSqliteDb();
        db.prepare("SELECT 1 as ok").get();
        return {
          ok: true,
          adapter: "sqlite",
          latencyMs: Date.now() - start,
          details: DB_PATH,
        };
      } catch (error) {
        return {
          ok: false,
          adapter: "sqlite",
          latencyMs: Date.now() - start,
          error: (error as Error).message,
        };
      }
    },
  };
}
