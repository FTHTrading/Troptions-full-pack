import { NextResponse } from "next/server";
import { buildYieldOpportunityOverview, YIELD_ENGINE_MODE } from "@/lib/troptions-genius-yield";
import { buildYieldApiEnvelope } from "@/lib/troptions-genius-yield/api";

export async function GET() {
  return NextResponse.json(
    buildYieldApiEnvelope({
      complianceMode: YIELD_ENGINE_MODE,
      result: buildYieldOpportunityOverview(),
      riskLevel: "gray_area_requires_counsel",
      legalReviewRequired: true,
      reasons: ["Opportunity engine is in research-only mode and cannot enable live issuance."],
      saferAlternative: "Use the engine for compliant opportunity mapping and partner diligence.",
    }),
  );
}