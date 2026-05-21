import { NextResponse } from "next/server";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";
import { TELECOM_DISCLAIMER } from "@/content/troptions/telexRegistry";

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
    const body = (await request.json()) as {
      to?: string;
      message?: string;
      tcpaConsentConfirmed?: boolean;
      consentSource?: string;
    };

    if (!body.tcpaConsentConfirmed) {
      const responseBody = {
        ok: false,
        error: "tcpaConsentConfirmed must be true — TCPA prior express consent required",
      };
      saveIdempotentResponse(idempotency, 422, responseBody);
      return NextResponse.json(responseBody, { status: 422 });
    }
    if (!body.to || !body.message) {
      const responseBody = { ok: false, error: "to and message are required" };
      saveIdempotentResponse(idempotency, 400, responseBody);
      return NextResponse.json(responseBody, { status: 400 });
    }

    const responseBody = {
      ok: true,
      status: "dry-run",
      simulationOnly: true,
      idempotencyKey: idempotency?.idempotencyKey,
      to: body.to,
      messageLength: body.message.length,
      tcpaConsentRecorded: true,
      consentSource: body.consentSource ?? "unspecified",
      disclaimer: TELECOM_DISCLAIMER,
      note: "SMS dry-run simulation. No message sent. Telnyx provider activation requires gate satisfaction.",
    };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
