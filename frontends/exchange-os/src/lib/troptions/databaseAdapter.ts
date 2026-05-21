import { createPostgresAdapter } from "@/lib/troptions/postgresAdapter";
import { createSqliteAdapter } from "@/lib/troptions/sqliteAdapter";

export type DatabaseAdapterType = "sqlite" | "postgres";

export interface AdapterHealth {
  ok: boolean;
  adapter: DatabaseAdapterType;
  latencyMs?: number;
  error?: string;
  details?: string;
}

export interface StateDatabaseAdapter {
  readonly type: DatabaseAdapterType;
  isConfigured(): boolean;
  healthCheck(): Promise<AdapterHealth>;
}

let activeAdapter: StateDatabaseAdapter | null = null;

export function resolveDatabaseAdapterType(): DatabaseAdapterType {
  const configured = (process.env.TROPTIONS_DB_ADAPTER ?? "sqlite").toLowerCase();
  if (configured === "postgres" && process.env.DATABASE_URL?.trim()) {
    return "postgres";
  }

  return "sqlite";
}

export function getDatabaseAdapter(): StateDatabaseAdapter {
  if (activeAdapter) return activeAdapter;

  const type = resolveDatabaseAdapterType();
  activeAdapter = type === "postgres" ? createPostgresAdapter() : createSqliteAdapter();
  return activeAdapter;
}

export function resetDatabaseAdapterForTests(): void {
  activeAdapter = null;
}
