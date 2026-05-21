import { NextResponse } from "next/server";
import { getMockRwaEvidenceRecords, getRwaEvidenceGapSummary } from "@/lib/troptions/rwa-adapters/evidence";

export function GET() {
  return NextResponse.json({
    ok: true,
    evidence: getMockRwaEvidenceRecords(),
    gaps: getRwaEvidenceGapSummary(),
  });
}
