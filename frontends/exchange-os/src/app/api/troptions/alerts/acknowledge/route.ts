import { NextResponse } from "next/server";
import { acknowledgeAlert } from "@/lib/troptions/alertEngine";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "acknowledge-alert",
      writeAction: true,
      requireIdempotency: true,
    });
    if (guarded instanceof NextResponse) return guarded;

    idempotency = guarded.idempotency;
    const payload = await request.json();
    const alert = acknowledgeAlert({
      alertId: payload.alertId,
      actorId: guarded.auth.actorId,
      actorRole: guarded.auth.actorRole,
      reason: payload.reason ?? "acknowledged via API",
    });

    const responseBody = { ok: true, alert };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
