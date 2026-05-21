import { NextResponse } from "next/server";
import { BLOCKED_PATTERNS, MOCK_CREDIT_UNION_PARTNER, MOCK_YIELD_INPUT, SAFER_STRUCTURES, YIELD_ENGINE_MODE, buildYieldOpportunityOverview } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function GET() {
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result: {
        overview: buildYieldOpportunityOverview(),
        sampleYieldInput: MOCK_YIELD_INPUT,
        samplePartner: MOCK_CREDIT_UNION_PARTNER,
        blockedPatterns: BLOCKED_PATTERNS,
        saferStructures: SAFER_STRUCTURES,
      },
      riskLevel: "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: ["Mock opportunities are for sandbox analysis only."],
      saferAlternative: "Use the mock opportunities to shape diligence, not to market live financial products.",
    }),
  );
}