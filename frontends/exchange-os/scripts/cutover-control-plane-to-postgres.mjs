import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import pkg from "pg";

const { Pool } = pkg;

const root = process.cwd();
const sqlitePath = path.join(root, "data", "troptions-control-plane", "control-plane.db");
const verifyOnly = process.argv.includes("--verify-only");

function readSqliteStateRows() {
  if (!fs.existsSync(sqlitePath)) {
    return [];
  }

  const sqlite = new Database(sqlitePath, { readonly: true });
  try {
    return sqlite
      .prepare("SELECT name, payload, updated_at FROM control_plane_state ORDER BY name")
      .all();
  } finally {
    sqlite.close();
  }
}

async function ensurePgTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS control_plane_state (
      name TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `);
}

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for control-plane Postgres cutover.");
  }

  const startedAt = Date.now();
  const sqliteRows = readSqliteStateRows();

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await ensurePgTable(client);

    if (!verifyOnly) {
      await client.query("BEGIN");
      for (const row of sqliteRows) {
        await client.query(
          `INSERT INTO control_plane_state (name, payload, updated_at)
           VALUES ($1, $2::jsonb, $3::timestamptz)
           ON CONFLICT(name) DO UPDATE SET
             payload = excluded.payload,
             updated_at = excluded.updated_at`,
          [row.name, row.payload, row.updated_at],
        );
      }
      await client.query("COMMIT");
    }

    const pgCountRow = await client.query("SELECT COUNT(*)::int AS count FROM control_plane_state");
    const postgresCount = pgCountRow.rows[0]?.count ?? 0;

    const result = {
      mode: verifyOnly ? "verify-only" : "execute",
      sqlitePath,
      sqliteRows: sqliteRows.length,
      postgresRows: postgresCount,
      verified: postgresCount >= sqliteRows.length,
      elapsedMs: Date.now() - startedAt,
      next: "Set TROPTIONS_DB_ADAPTER=postgres and run validate:env + smoke:prod.",
    };

    console.log(JSON.stringify(result, null, 2));

    if (!result.verified) {
      process.exitCode = 2;
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
