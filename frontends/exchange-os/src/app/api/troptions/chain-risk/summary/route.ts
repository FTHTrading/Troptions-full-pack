import { NextResponse } from "next/server";
import { buildChainRiskSummary } from "@/lib/troptions/chainRiskScoringEngine";

export async function GET() {
  return NextResponse.json({ ok: true, summary: buildChainRiskSummary() });
}
