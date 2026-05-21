import { evaluateEntityAccess } from "@/lib/troptions/entityAccessEngine";
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
    const accessCheck = evaluateEntityAccess(payload.entityId ?? "ENT-100");
    const routeKey = new URL(request.url).pathname;

    const responseBody = accessCheck.allowed
      ? { ok: true, simulationOnly: true, accessRequestAccepted: true, accessCheck }
      : buildBlockedResponse(accessCheck.blockedReasons, { accessRequestAccepted: false, accessCheck });

    auditPortalAction("client_portal_access_request", guarded.auth.actorId, guarded.auth.actorRole, routeKey, {
      entityId: payload.entityId ?? "ENT-100",
      accepted: accessCheck.allowed,
    });

    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
