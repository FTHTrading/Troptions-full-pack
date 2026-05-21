import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, scoreCreditUnionCUSOOpportunity } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = scoreCreditUnionCUSOOpportunity(payload);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.totalScore >= 70 ? "likely_allowed_with_review" : "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: ["Partner opportunity scores support diligence sequencing only."],
      saferAlternative: "Advance only partner diligence, packet readiness, and integration planning until approvals exist.",
    }),
  );
}