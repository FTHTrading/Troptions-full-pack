import { NextResponse } from "next/server";
import { transitionWorkflow } from "@/lib/troptions/workflowEngine";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "transition-workflow",
      writeAction: true,
      requireIdempotency: true,
    });
    if (guarded instanceof NextResponse) return guarded;

    idempotency = guarded.idempotency;
    const payload = await request.json();
    const result = transitionWorkflow({
      subjectId: payload.subjectId,
      subjectType: payload.subjectType,
      fromStatus: payload.fromStatus,
      toStatus: payload.toStatus,
      actorRole: guarded.auth.actorRole,
      reason: payload.reason ?? "workflow transition request",
      evidenceIds: payload.evidenceIds ?? [],
      approvalIds: payload.approvalIds ?? [],
    });

    const responseBody = { ok: result.success, result };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
