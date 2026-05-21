import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, detectRWAStablecoinConfusion } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = detectRWAStablecoinConfusion(payload);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.blocked ? "prohibited_block" : "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: result.reasons,
      saferAlternative: result.saferLanguage,
    }),
  );
}