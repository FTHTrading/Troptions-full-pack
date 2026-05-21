import { NextResponse } from "next/server";
import { appendAuditEvent } from "@/lib/troptions/auditLogEngine";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "append-audit-log",
      writeAction: true,
      requireIdempotency: true,
    });
    if (guarded instanceof NextResponse) return guarded;

    idempotency = guarded.idempotency;
    const payload = await request.json();
    const event = appendAuditEvent({
      actorId: guarded.auth.actorId,
      actorRole: guarded.auth.actorRole,
      actionType: payload.actionType ?? "api-append",
      subjectId: payload.subjectId ?? "unknown",
      subjectType: payload.subjectType ?? "unknown",
      previousState: payload.previousState ?? "unknown",
      nextState: payload.nextState ?? "unknown",
      reason: payload.reason ?? "manual append request",
      evidenceIds: payload.evidenceIds ?? [],
      approvalIds: payload.approvalIds ?? [],
    });

    const responseBody = { ok: true, event };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
