import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, evaluatePublicChainUse } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = evaluatePublicChainUse(payload);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.allowedForLive ? "likely_allowed_with_review" : "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: result.liveBlockers,
      saferAlternative: "Use public chains for research or sandbox only until chain review, audit, custody, and monitoring controls are complete.",
    }),
  );
}