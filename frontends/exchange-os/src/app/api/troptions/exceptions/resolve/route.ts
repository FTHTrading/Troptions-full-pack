import { NextResponse } from "next/server";
import { resolveException } from "@/lib/troptions/exceptionEngine";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";

export async function POST(request: Request) {
  let idempotency: Parameters<typeof saveIdempotentResponse>[0];
  try {
    const guarded = await guardControlPlaneRequest(request, {
      requiredAction: "resolve-exception",
      writeAction: true,
      requireIdempotency: true,
    });
    if (guarded instanceof NextResponse) return guarded;

    idempotency = guarded.idempotency;
    const payload = await request.json();
    const exception = resolveException({
      exceptionId: payload.exceptionId,
      actorId: guarded.auth.actorId,
      actorRole: guarded.auth.actorRole,
      resolutionNote: payload.resolutionNote ?? "resolved via API",
    });

    const responseBody = { ok: true, exception };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
