import { simulateSettlement } from "@/lib/troptions/settlementOpsEngine";
import {
  NextResponse,
  auditPortalAction,
  buildBlockedResponse,
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

    const simulation = simulateSettlement(payload.intentId ?? "SETTLE-001");
    const responseBody = simulation.allowed
      ? { ok: true, simulationOnly: true, simulation }
      : buildBlockedResponse(simulation.blockedReasons, { simulation, simulationOnly: true });

    auditPortalAction("settlement_simulated", guarded.auth.actorId, guarded.auth.actorRole, routeKey, {
      intentId: payload.intentId ?? "SETTLE-001",
      allowed: simulation.allowed,
    });

    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
