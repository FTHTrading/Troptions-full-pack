import { NextResponse } from "next/server";
import { generateRwaRegistryReport, getAllRwaReadinessScores } from "@/lib/troptions/rwa-adapters/readiness";

export function GET() {
  return NextResponse.json({
    ok: true,
    registry: generateRwaRegistryReport(),
    scores: getAllRwaReadinessScores(),
  });
}
