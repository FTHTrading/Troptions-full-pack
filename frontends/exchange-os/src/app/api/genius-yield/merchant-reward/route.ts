import { NextResponse } from "next/server";
import { YIELD_ENGINE_MODE, classifyMerchantReward } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = classifyMerchantReward(payload);
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result,
      riskLevel: result.classification,
      legalReviewRequired: true,
      reasons: [result.reason],
      saferAlternative: result.saferStructure,
    }),
  );
}