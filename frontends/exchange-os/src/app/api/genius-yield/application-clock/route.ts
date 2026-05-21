import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, calculatePPSIApplicationClock } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = calculatePPSIApplicationClock(payload);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.readinessToFile ? "likely_allowed_with_review" : "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: result.riskWarnings,
      saferAlternative: "Use the application clock to improve packet completeness and timing discipline, not to assume approval.",
    }),
  );
}