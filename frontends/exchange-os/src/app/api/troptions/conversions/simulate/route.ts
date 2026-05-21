import { simulateConversionRoute } from "@/lib/troptions/conversionEngine";
import {
  NextResponse,
  auditPortalAction,
  guardPortalWrite,
  saveIdempotentResponse,
} from "@/lib/troptions/portalApiGuards";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardPortalWrite(request);
    if (guarded instanceof NextResponse) return guarded;
    idempotency = guarded.idempotency;
    const payload = await request.json();
    const routeKey = new URL(request.url).pathname;

    const result = simulateConversionRoute(payload.sourceAsset ?? "USDC", payload.targetAsset ?? "USD.rIssuer", Number(payload.amount ?? 1000));
    const responseBody = { ok: true, result, simulationOnly: true };

    auditPortalAction("conversion_simulated", guarded.auth.actorId, guarded.auth.actorRole, routeKey, {
      sourceAsset: payload.sourceAsset,
      targetAsset: payload.targetAsset,
    });

    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
