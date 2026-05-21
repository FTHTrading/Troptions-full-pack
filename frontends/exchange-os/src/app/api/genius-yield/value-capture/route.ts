import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, detectCompliantValueCapture } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST() {
  const result = detectCompliantValueCapture();
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: "likely_allowed_with_review",
      legalReviewRequired: true,
      reasons: ["Allowed value capture comes from software and compliance services, not holder yield."],
      saferAlternative: result.suggestedCompliantStructure,
    }),
  );
}