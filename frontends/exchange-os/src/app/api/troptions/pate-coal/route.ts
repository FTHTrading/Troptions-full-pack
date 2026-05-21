import { NextRequest, NextResponse } from "next/server";
import {
  createPateCoalAssetRecord,
  calculatePateCoalReadinessScore,
  getMissingPateCoalDocuments,
  recommendPateCoalFundingRoutes,
  generatePateCoalLenderPacketSummary,
  generatePateCoalDisclosure,
  blockPateCoalAsset,
  type PateCoalDocumentType,
} from "@/lib/troptions/pateCoalRwaEngine";

export async function GET() {
  const record    = createPateCoalAssetRecord();
  const readiness = calculatePateCoalReadinessScore(record);
  const routes    = recommendPateCoalFundingRoutes(record);
  const missing   = getMissingPateCoalDocuments(record);
  return NextResponse.json({
    simulationOnly: true,
    record,
    readiness,
    routes,
    missing,
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { action, submittedDocTypes, blockReason } = body as {
    action?:           string;
    submittedDocTypes?: string[];
    blockReason?:      string;
  };

  const typedDocs = submittedDocTypes as PateCoalDocumentType[] | undefined;
  const record = createPateCoalAssetRecord(typedDocs);

  switch (action) {
    case "readiness":
      return NextResponse.json(calculatePateCoalReadinessScore(record));

    case "missing":
      return NextResponse.json({
        simulationOnly: true,
        missing: getMissingPateCoalDocuments(record),
      });

    case "funding":
      return NextResponse.json({
        simulationOnly: true,
        routes: recommendPateCoalFundingRoutes(record),
      });

    case "lender-packet":
      return NextResponse.json(generatePateCoalLenderPacketSummary(record));

    case "disclosure":
      return NextResponse.json(generatePateCoalDisclosure());

    case "block": {
      if (!blockReason || typeof blockReason !== "string") {
        return NextResponse.json({ error: "blockReason is required for action=block" }, { status: 400 });
      }
      const blocked = blockPateCoalAsset(record, blockReason);
      return NextResponse.json(blocked);
    }

    default:
      return NextResponse.json({
        simulationOnly: true,
        record,
        readiness:   calculatePateCoalReadinessScore(record),
        routes:      recommendPateCoalFundingRoutes(record),
        missing:     getMissingPateCoalDocuments(record),
        lenderPacket: generatePateCoalLenderPacketSummary(record),
      });
  }
}
