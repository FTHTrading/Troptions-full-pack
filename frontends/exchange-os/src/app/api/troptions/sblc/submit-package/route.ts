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

    const responseBody = buildBlockedResponse(
      [
        "SBLC remains pending until SWIFT and bank confirmation are complete",
        "Legal, fraud, and board approvals are required",
      ],
      { submitted: true, sblcId: payload.sblcId ?? "SBLC-NEW" },
    );

    auditPortalAction("sblc_submit_package", guarded.auth.actorId, guarded.auth.actorRole, routeKey, {
      sblcId: payload.sblcId ?? "SBLC-NEW",
    });

    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
