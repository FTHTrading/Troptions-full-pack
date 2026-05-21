import { NextRequest, NextResponse } from "next/server";
import { evaluateMomentumClaim } from "@/lib/troptions/momentum/momentumComplianceEngine";

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

  const result = evaluateMomentumClaim(claimText);

  return NextResponse.json({
    outcome: result.outcome,
    reason: result.reason,
    claimText: result.claimText,
    matchedRule: result.matchedRule,
    requiresLegalReview: result.requiresLegalReview,
    requiresComplianceReview: result.requiresComplianceReview,
    liveExecutionAllowed: false,
    timestamp: result.timestamp,
  });
}
