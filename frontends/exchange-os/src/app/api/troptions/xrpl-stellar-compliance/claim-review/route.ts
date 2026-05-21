import { NextRequest, NextResponse } from "next/server";
import { reviewPublicClaim } from "@/lib/troptions/xrpl-stellar-compliance/globalCompliancePolicyEngine";
import { persistPublicClaimReview } from "@/lib/troptions/xrpl-stellar-compliance/xrplStellarComplianceControlHubBridge";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { claimText } = body as { claimText?: unknown };

  if (!claimText || typeof claimText !== "string") {
    return NextResponse.json(
      { error: "claimText is required and must be a string" },
      { status: 400 }
    );
  }

  if (claimText.length > 2000) {
    return NextResponse.json(
      { error: "claimText must be 2000 characters or fewer" },
      { status: 400 }
    );
  }

  const review = reviewPublicClaim(claimText);
  const { taskId, auditRecordId, auditToken } = persistPublicClaimReview(claimText);

  return NextResponse.json({
    isAllowed: review.isAllowed,
    prohibitedPhrases: review.prohibitedPhrases,
    correctionSuggestion: review.correctionSuggestion,
    taskId,
    auditRecordId,
    auditToken,
    persistedStatus: "persisted_simulation_only",
    liveExecutionAllowed: false,
    reviewedAt: review.reviewedAt,
  });
}
