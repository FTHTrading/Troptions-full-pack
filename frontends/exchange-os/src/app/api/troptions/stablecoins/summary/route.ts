import { NextResponse } from "next/server";
import { buildStablecoinSummary } from "@/lib/troptions/stablecoinRiskEngine";

export async function GET() {
  return NextResponse.json({ ok: true, summary: buildStablecoinSummary() });
}
