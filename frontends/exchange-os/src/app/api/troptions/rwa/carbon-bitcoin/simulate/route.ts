import { NextResponse } from "next/server";
import { seedCarbonRegistryIfEmpty } from "@/lib/troptions/carbonCreditEngine";
import {
  createCarbonCreditBitcoinSettlementFlow,
  type CarbonBitcoinFlowInput,
} from "@/lib/troptions/carbonBitcoinFlowEngine";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Partial<CarbonBitcoinFlowInput>;
  try {
    body = (await req.json()) as Partial<CarbonBitcoinFlowInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const requiredKeys: (keyof CarbonBitcoinFlowInput)[] = [
    "carbonAssetId",
    "settlementId",
    "payerName",
    "payeeName",
    "usdReferenceValue",
  ];
  const missing = requiredKeys.filter((k) => body[k] === undefined || body[k] === null);
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields", missing, simulation: true },
      { status: 400 }
    );
  }

  seedCarbonRegistryIfEmpty();
  const flow = createCarbonCreditBitcoinSettlementFlow(body as CarbonBitcoinFlowInput);

  return NextResponse.json({
    ok: true,
    simulation: true,
    blocked: flow.blocked,
    requestedAction: flow.requestedAction,
    flow,
    notice:
      "No live Bitcoin custody, exchange, signing, money transmission, carbon offset guarantee, or public investment functionality was performed.",
  });
}
