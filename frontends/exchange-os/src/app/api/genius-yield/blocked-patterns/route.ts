import { NextResponse } from "next/server";
import { BLOCKED_PATTERNS, YIELD_ENGINE_MODE } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function GET() {
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result: BLOCKED_PATTERNS,
      riskLevel: "prohibited_block",
      legalReviewRequired: true,
      reasons: ["These patterns present prohibited or high-risk stablecoin yield structures."],
      saferAlternative: "Replace these patterns with tokenized deposit routing, merchant-funded rebates, or software/service revenue lines.",
    }),
  );
}