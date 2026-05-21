import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import pkg from "pg";

const { Pool } = pkg;
const isDryRun = process.argv.includes("--dry-run");

const root = process.cwd();
const sqlitePath = path.join(root, "data", "troptions-control-plane", "control-plane.db");

export function buildMigrationPlan() {
  if (!fs.existsSync(sqlitePath)) {
    return { sqlitePath, totalRows: 0, rows: [] };
  }

  const sqlite = new Database(sqlitePath, { readonly: true });
  const rows = sqlite
    .prepare("SELECT name, payload, updated_at FROM control_plane_state ORDER BY name")
    .all();
  sqlite.close();

  return {
    sqlitePath,
    totalRows: rows.length,
    rows,
  };
}

async function run() {
  const plan = buildMigrationPlan();
  console.log(JSON.stringify({ mode: isDryRun ? "dry-run" : "execute", sqlitePath: plan.sqlitePath, totalRows: plan.totalRows }, null, 2));

  if (isDryRun) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for migration execution.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS control_plane_state (
        name TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      )
    `);

    for (const row of plan.rows) {
      await client.query(
        `INSERT INTO control_plane_state (name, payload, updated_at)
         VALUES ($1, $2::jsonb, $3::timestamptz)
         ON CONFLICT(name) DO UPDATE SET
           payload = excluded.payload,
           updated_at = excluded.updated_at`,
        [row.name, row.payload, row.updated_at],
      );
    }

    console.log(`Migrated ${plan.totalRows} control-plane state rows to Postgres.`);
  } finally {
    client.release();
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("migrate-sqlite-to-postgres.mjs")) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
