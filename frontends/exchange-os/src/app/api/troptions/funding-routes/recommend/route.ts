import { NextRequest, NextResponse } from "next/server";
import {
  createXrplIouPacket,
  generateIouIssuanceChecklist,
  type XrplIouAssetType,
} from "@/lib/troptions/xrplIouIssuanceEngine";
import {
  calculateFundingReadiness,
  generateLenderPacketSummary,
  generateUseOfProceedsPlan,
} from "@/lib/troptions/fundingRouteEngine";

/**
 * POST /api/troptions/funding-routes/recommend
 *
 * Recommends funding routes for a given asset type and optional readiness context.
 * Returns route eligibility, lender packet summary, and use-of-proceeds plan.
 * Simulation-only. No live execution, lending, or AMM operation is performed.
 *
 * Body: {
 *   assetType: XrplIouAssetType,
 *   estimatedProceeds?: string,
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      assetType?: string;
      estimatedProceeds?: string;
    };

    if (!body.assetType) {
      return NextResponse.json({ error: "assetType is required" }, { status: 400 });
    }

    const validTypes: XrplIouAssetType[] = ["AXL001", "BTCREC", "GOLD", "CARBON", "RWA", "USD", "TROPTIONS"];
    if (!validTypes.includes(body.assetType as XrplIouAssetType)) {
      return NextResponse.json(
        { error: `Invalid assetType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const assetType = body.assetType as XrplIouAssetType;

    // Build a base (empty) packet to drive readiness calculation
    const packet = createXrplIouPacket(assetType, {
      currencyCode: assetType,
      issuanceLimit: "0",
      proposedAmount: "0",
    });
    const readiness = generateIouIssuanceChecklist(packet);

    const fundingReadiness = calculateFundingReadiness(assetType, readiness);
    const lenderPacket    = generateLenderPacketSummary(assetType, readiness);
    const proceedsPlan    = generateUseOfProceedsPlan(assetType, body.estimatedProceeds ?? "TBD");

    return NextResponse.json({
      simulationOnly: true,
      assetType,
      fundingReadiness: {
        overallScore:      fundingReadiness.overallScore,
        scoreLabel:        fundingReadiness.scoreLabel,
        topBlocker:        fundingReadiness.topBlocker,
        recommendedRoutes: fundingReadiness.recommendedRoutes.map((r) => ({
          route:       r.route,
          displayName: r.displayName,
          eligibility: r.eligibility,
          conditions:  r.conditions,
          timeline:    r.estimatedTimeline,
        })),
        conditionalRoutes: fundingReadiness.conditionalRoutes.map((r) => ({
          route:        r.route,
          displayName:  r.displayName,
          eligibility:  r.eligibility,
          conditions:   r.conditions,
          blockedReasons: r.blockedReasons,
          timeline:     r.estimatedTimeline,
        })),
        blockedRoutes: fundingReadiness.blockedRoutes.map((r) => ({
          route:          r.route,
          displayName:    r.displayName,
          eligibility:    r.eligibility,
          blockedReasons: r.blockedReasons,
        })),
      },
      lenderPacket: {
        headline:             lenderPacket.headline,
        keyStrengths:         lenderPacket.keyStrengths,
        keyRisks:             lenderPacket.keyRisks,
        requiredDisclosures:  lenderPacket.requiredDisclosures,
        missingItems:         lenderPacket.missingItems,
      },
      proceedsPlan: {
        estimatedProceeds: proceedsPlan.estimatedProceeds,
        waterfall:         proceedsPlan.waterfall,
        restrictions:      proceedsPlan.restrictions,
      },
      disclaimer:
        "This is a simulation-only result. No live lending, credit, AMM, or Aave execution was performed. All routes require legal, compliance, provider, custody, signer, and board approvals before any real-world execution.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
