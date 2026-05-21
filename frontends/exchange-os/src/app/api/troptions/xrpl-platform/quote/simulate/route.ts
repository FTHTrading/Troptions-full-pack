import { simulateXrplTrade } from "@/lib/troptions/xrplTradeSimulationEngine";
import { guardPortalWrite, NextResponse, saveIdempotentResponse } from "@/lib/troptions/portalApiGuards";
import { assertNoSensitiveXrplInputs, buildXrplApiEnvelope } from "@/lib/troptions/xrplPlatformApiUtils";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const body = await request.json() as Record<string, unknown> & { fromAsset?: string; toAsset?: string; amount?: number; venue?: "dex" | "amm" | "pathfinding" };
  assertNoSensitiveXrplInputs(body);

  const responseBody = buildXrplApiEnvelope({
    mode: "simulation",
    quote: simulateXrplTrade({ fromAsset: body.fromAsset ?? "XRP", toAsset: body.toAsset ?? "TROPTIONS", amount: typeof body.amount === "number" ? body.amount : 1000, venue: body.venue }),
    blockedReason: "Quote simulation only. No XRPL transaction was signed or submitted.",
    requiredApprovals: ["Operator auth", "Idempotency key", "Audit trail"],
    auditHint: "Simulation-only quote.",
  });

  saveIdempotentResponse(guarded.idempotency, 200, responseBody);
  return NextResponse.json(responseBody);
}