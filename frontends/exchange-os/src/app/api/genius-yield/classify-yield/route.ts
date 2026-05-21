import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, classifyYieldStructure } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = classifyYieldStructure(payload);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.riskLevel,
      legalReviewRequired: result.requiredLegalReview,
      reasons: result.reasons.concat(result.blockedReasons),
      saferAlternative: result.saferAlternative,
    }),
  );
}