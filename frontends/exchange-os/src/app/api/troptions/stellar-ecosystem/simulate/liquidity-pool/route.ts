import { NextResponse } from "next/server";
import { guardControlPlaneRequest, saveIdempotentResponse } from "@/lib/troptions/requestGuards";
import { simulateStellarLiquidityPool } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "request-approval",
      writeAction: true,
      requireIdempotency: true,
    });
    if (guarded instanceof NextResponse) return guarded;
    idempotency = guarded.idempotency;

    const body = (await request.json()) as Record<string, unknown>;

    const result = simulateStellarLiquidityPool({
      assetId: String(body.assetId ?? ""),
      lpProviderKycStatus: String(body.lpProviderKycStatus ?? "unknown") as "verified" | "pending" | "unknown" | "failed",
      riskDisclosureAcknowledged: Boolean(body.riskDisclosureAcknowledged),
    });

    const envelope = { ok: true, isLivePublicNetworkEnabled: false, simulation: result };
    saveIdempotentResponse(idempotency, 200, envelope);
    return NextResponse.json(envelope);
  } catch (err) {
    const body = { ok: false, error: (err as Error).message };
    saveIdempotentResponse(idempotency, 400, body);
    return NextResponse.json(body, { status: 400 });
  }
}
