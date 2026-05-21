import { NextResponse } from "next/server";
import { requestApproval } from "@/lib/troptions/approvalEngine";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";

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
    const payload = await request.json();
    const record = requestApproval({
      subjectId: payload.subjectId,
      subjectType: payload.subjectType,
      approvalType: payload.approvalType,
      requestedBy: guarded.auth.actorId,
      assignedTo: payload.assignedTo ?? "unassigned",
      actorRole: guarded.auth.actorRole,
      evidenceIds: payload.evidenceIds ?? [],
      notes: payload.notes ?? "requested via API",
    });

    const responseBody = { ok: true, approval: record };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
