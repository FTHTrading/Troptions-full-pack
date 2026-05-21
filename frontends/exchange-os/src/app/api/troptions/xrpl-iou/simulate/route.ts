import { NextRequest, NextResponse } from "next/server";
import {
  createXrplIouPacket,
  validateXrplIouPacket,
  generateIouIssuanceChecklist,
  type XrplIouAssetType,
} from "@/lib/troptions/xrplIouIssuanceEngine";

/**
 * POST /api/troptions/xrpl-iou/simulate
 *
 * Simulates an XRPL IOU issuance packet with the provided parameters.
 * Returns the full readiness result including score, status, and document checklist.
 * Simulation-only. No live issuance, signing, or on-chain operation is performed.
 *
 * Body: {
 *   assetType: XrplIouAssetType,
 *   currencyCode: string,
 *   xrplCurrencyHex?: string,
 *   issuanceLimit: string,
 *   proposedAmount: string,
 *   holderAddress?: string,
 *   evidenceRefs?: string[],
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      assetType?: string;
      currencyCode?: string;
      xrplCurrencyHex?: string;
      issuanceLimit?: string;
      proposedAmount?: string;
      holderAddress?: string;
      evidenceRefs?: string[];
    };

    if (!body.assetType) {
      return NextResponse.json({ error: "assetType is required" }, { status: 400 });
    }
    if (!body.currencyCode) {
      return NextResponse.json({ error: "currencyCode is required" }, { status: 400 });
    }
    if (!body.issuanceLimit) {
      return NextResponse.json({ error: "issuanceLimit is required" }, { status: 400 });
    }
    if (!body.proposedAmount) {
      return NextResponse.json({ error: "proposedAmount is required" }, { status: 400 });
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
      currencyCode: body.currencyCode,
      xrplCurrencyHex: body.xrplCurrencyHex,
      issuanceLimit: body.issuanceLimit,
      proposedAmount: body.proposedAmount,
      holderAddress: body.holderAddress,
      evidenceRefs: body.evidenceRefs,
    });

    const validationErrors = validateXrplIouPacket(packet);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 422 });
    }

    const readiness = generateIouIssuanceChecklist(packet);

    return NextResponse.json({
      simulationOnly: true,
      packet: {
        packetId: packet.packetId,
        assetType: packet.assetType,
        currencyCode: packet.currencyCode,
        xrplCurrencyHex: packet.xrplCurrencyHex,
        issuerAddress: packet.issuerAddress,
        issuanceLimit: packet.issuanceLimit,
        proposedAmount: packet.proposedAmount,
        authorizedTrustlineRequired: packet.authorizedTrustlineRequired,
        status: readiness.status,
        createdAt: packet.createdAt,
      },
      readiness: {
        score: readiness.score,
        scoreLabel: readiness.scoreLabel,
        status: readiness.status,
        blockedReasons: readiness.blockedReasons,
        nextSteps: readiness.nextSteps,
        documents: readiness.documents,
      },
      disclaimer:
        "This is a simulation-only result. No live IOU issuance, signing, or on-chain operation was performed. All execution requires legal, compliance, provider, custody, signer, and board approvals.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
