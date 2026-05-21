import { NextRequest } from "next/server";
import { classifyXrplTransaction } from "@/lib/troptions/xrplTransactionClassifier";
import { guardPostRequest, storeIdempotentResponse } from "@/lib/troptions/walletForensicsApiGuards";

interface ClassifyTransactionRequest {
  readonly currency?: string;
  readonly classification?: "unknown" | "native-xrp-payment" | "issued-currency-iou" | "exchange-deposit";
  readonly to?: string;
  readonly destinationTag?: string;
  readonly nativeOrIou?: "native" | "iou";
}

export async function POST(request: NextRequest) {
  const guard = await guardPostRequest(request);
  if (!guard.ok) return guard.response;

  const payload = guard.payload as ClassifyTransactionRequest;

  if (!payload.currency || !payload.classification || !payload.to || !payload.nativeOrIou) {
    return storeIdempotentResponse(
      request,
      { ok: false, error: "currency, classification, to, and nativeOrIou are required." },
      400,
    );
  }

  const classification = classifyXrplTransaction({
    currency: payload.currency,
    classification: payload.classification,
    to: payload.to,
    destinationTag: payload.destinationTag,
    nativeOrIou: payload.nativeOrIou,
  });

  return storeIdempotentResponse(
    request,
    {
      ok: true,
      mode: "read-only-stub",
      classification,
      note: "Classification only. This endpoint never signs, submits, or moves funds.",
    },
    200,
  );
}
