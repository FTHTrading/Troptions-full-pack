import { canEnableAlgorithmicTrading } from "@/lib/troptions/algorithmicTradingEngine";
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

    const gate = canEnableAlgorithmicTrading({
      legalApproved: Boolean(payload.legalApproved),
      complianceApproved: Boolean(payload.complianceApproved),
      riskApproved: Boolean(payload.riskApproved),
      custodyApproved: Boolean(payload.custodyApproved),
      venueApproved: Boolean(payload.venueApproved),
      boardApproved: Boolean(payload.boardApproved),
    });

    const responseBody = gate.allowed
      ? { ok: true, simulationOnly: false, gate }
      : buildBlockedResponse(gate.blockedReasons, { gate, simulationOnly: true });

    auditPortalAction("trading_simulated", guarded.auth.actorId, guarded.auth.actorRole, routeKey, {
      strategyId: payload.strategyId ?? "ALG-001",
      allowed: gate.allowed,
    });

    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
