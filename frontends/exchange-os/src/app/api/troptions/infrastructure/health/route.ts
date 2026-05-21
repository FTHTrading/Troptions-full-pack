import { NextResponse } from "next/server";
import { getMockHealthChecks, getMockInfraDashboardSummary } from "@/lib/troptions/infrastructure/mockData";
import { getOverallHealth } from "@/lib/troptions/infrastructure/health";

export function GET() {
  const checks = getMockHealthChecks();
  const overall = getOverallHealth(checks);
  const summary = getMockInfraDashboardSummary();
  return NextResponse.json({ ok: true, overall, checks, summary });
}
