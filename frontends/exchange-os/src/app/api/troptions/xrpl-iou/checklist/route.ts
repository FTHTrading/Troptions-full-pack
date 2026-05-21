import { NextRequest, NextResponse } from "next/server";
import {
  createXrplIouPacket,
  generateIouIssuanceChecklist,
  type XrplIouAssetType,
} from "@/lib/troptions/xrplIouIssuanceEngine";

/**
 * POST /api/troptions/xrpl-iou/checklist
 *
 * Returns the full required document checklist for a given IOU asset type.
 * Simulation-only. No live issuance is triggered.
 *
 * Body: { assetType: XrplIouAssetType }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { assetType?: string };

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
    const packet = createXrplIouPacket(assetType, {
      currencyCode: assetType,
      issuanceLimit: "0",
      proposedAmount: "0",
    });

    const checklist = generateIouIssuanceChecklist(packet);

    return NextResponse.json({
      simulationOnly: true,
      assetType,
      checklist: {
        documents: checklist.documents,
        blockedReasons: checklist.blockedReasons,
        nextSteps: checklist.nextSteps,
        score: checklist.score,
        scoreLabel: checklist.scoreLabel,
        status: checklist.status,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
