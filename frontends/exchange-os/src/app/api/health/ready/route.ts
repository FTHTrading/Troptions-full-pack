import { NextResponse } from "next/server";
import { getDatabaseAdapter } from "@/lib/troptions/databaseAdapter";
import { validateTroptionsEnvironment } from "@/lib/troptions/envValidation";
import { trackControlPlaneEvent } from "@/lib/troptions/monitoring";

async function checkDatabase(): Promise<{ ok: boolean; error?: string; adapter: string; details?: string }> {
  try {
    const health = await getDatabaseAdapter().healthCheck();
    if (!health.ok) {
      return {
        ok: false,
        adapter: health.adapter,
        error: health.error,
        details: health.details,
      };
    }

    return {
      ok: true,
      adapter: health.adapter,
      details: health.details,
    };
  } catch (error) {
    return { ok: false, adapter: "unknown", error: (error as Error).message };
  }
}

export async function GET() {
  const env = validateTroptionsEnvironment();
  const db = await checkDatabase();

  const ready = env.ok && db.ok;
  const status = ready ? 200 : 503;

  trackControlPlaneEvent("health_check", ready ? "info" : "warn", {
    routeKey: "/api/health/ready",
    status: ready ? "ready" : "not-ready",
    adapter: db.adapter,
  });

  return NextResponse.json(
    {
      ok: ready,
      status: ready ? "ready" : "not-ready",
      checks: {
        environment: env,
        database: db,
      },
      ts: new Date().toISOString(),
    },
    { status },
  );
}
