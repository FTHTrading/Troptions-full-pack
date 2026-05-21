import { NextResponse } from "next/server";
import { MOCK_CREDIT_UNION_PARTNER, YIELD_ENGINE_MODE, scoreCreditUnionCUSOOpportunity } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function GET() {
  const result = scoreCreditUnionCUSOOpportunity(MOCK_CREDIT_UNION_PARTNER);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.totalScore >= 70 ? "likely_allowed_with_review" : "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: ["Partner packet supports diligence, board review, and regulator packet preparation only."],
      saferAlternative: "Use the packet for partner sequencing and regulatory readiness rather than launch claims.",
    }),
  );
}