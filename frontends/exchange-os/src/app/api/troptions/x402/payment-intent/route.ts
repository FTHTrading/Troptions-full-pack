import { NextResponse } from "next/server";
import {
  guardControlPlaneRequest,
  saveIdempotentResponse,
} from "@/lib/troptions/requestGuards";
import { buildX402PaymentIntentDryRun } from "@/lib/troptions/x402ReadinessEngine";

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
      amount?: string;
      currency?: string;
      payee?: string;
      payer?: string;
    };

    const { amount = "0", currency = "USD", payee = "", payer = "" } = body;

    if (!payee || !payer) {
      const responseBody = { ok: false, error: "payee and payer are required" };
      saveIdempotentResponse(idempotency, 400, responseBody);
      return NextResponse.json(responseBody, { status: 400 });
    }

    const intent = buildX402PaymentIntentDryRun({
      amount,
      currency,
      payee,
      payer,
      idempotencyKey: idempotency?.idempotencyKey ?? "",
    });
    const responseBody = { ok: true, intent };
    saveIdempotentResponse(idempotency, 200, responseBody);
    return NextResponse.json(responseBody);
  } catch (error) {
    const responseBody = { ok: false, error: (error as Error).message };
    saveIdempotentResponse(idempotency, 400, responseBody);
    return NextResponse.json(responseBody, { status: 400 });
  }
}
