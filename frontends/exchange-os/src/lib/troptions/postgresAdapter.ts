import { Pool } from "pg";
import type { AdapterHealth, StateDatabaseAdapter } from "@/lib/troptions/databaseAdapter";

let pool: Pool | null = null;
let schemaReady = false;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool = new Pool({ connectionString });
  return pool;
}

async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS control_plane_state (
        name TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      )
    `);
    schemaReady = true;
  } finally {
    client.release();
  }
}

export function createPostgresAdapter(): StateDatabaseAdapter {
  return {
    type: "postgres",
    isConfigured: () => Boolean(process.env.DATABASE_URL?.trim()),
    async healthCheck(): Promise<AdapterHealth> {
      const start = Date.now();
      if (!process.env.DATABASE_URL?.trim()) {
        return {
          ok: false,
          adapter: "postgres",
          latencyMs: Date.now() - start,
          details: "DATABASE_URL missing; adapter is disabled.",
        };
      }

      try {
        await ensureSchema();
        await getPool().query("SELECT 1 as ok");
        return {
          ok: true,
          adapter: "postgres",
          latencyMs: Date.now() - start,
        };
      } catch (error) {
        return {
          ok: false,
          adapter: "postgres",
          latencyMs: Date.now() - start,
          error: (error as Error).message,
        };
      }
    },
  };
}
