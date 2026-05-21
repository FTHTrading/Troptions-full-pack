import { NextResponse } from "next/server";
import { guardControlPlaneRequest, saveIdempotentResponse } from "@/lib/troptions/requestGuards";
import {
  assertNoSensitiveXrplInputs,
  buildXrplApiEnvelope,
} from "@/lib/troptions/xrplPlatformApiUtils";
import { simulateXrplNftMint } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

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
    assertNoSensitiveXrplInputs(body);

    const result = simulateXrplNftMint({
      assetId: String(body.assetId ?? ""),
      kybStatus: String(body.kybStatus ?? "unknown") as "verified" | "pending" | "unknown" | "failed",
      metadataDefined: Boolean(body.metadataDefined),
      legalReviewComplete: Boolean(body.legalReviewComplete),
    });

    const envelope = buildXrplApiEnvelope({ simulation: result });
    saveIdempotentResponse(idempotency, 200, envelope);
    return NextResponse.json(envelope);
  } catch (err) {
    const body = { ok: false, error: (err as Error).message };
    saveIdempotentResponse(idempotency, 400, body);
    return NextResponse.json(body, { status: 400 });
  }
}
