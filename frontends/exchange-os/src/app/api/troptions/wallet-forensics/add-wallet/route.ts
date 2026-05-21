import { NextRequest } from "next/server";
import { guardPostRequest, storeIdempotentResponse } from "@/lib/troptions/walletForensicsApiGuards";

interface AddWalletRequest {
  readonly address?: string;
  readonly label?: string;
  readonly investigationNote?: string;
}

export async function POST(request: NextRequest) {
  const guard = await guardPostRequest(request);
  if (!guard.ok) return guard.response;

  const payload = guard.payload as AddWalletRequest;
  const address = payload.address?.trim();
  const label = payload.label?.trim() ?? "Unlabeled wallet";

  if (!address) {
    return storeIdempotentResponse(request, { ok: false, error: "address is required." }, 400);
  }

  const body = {
    ok: true,
    mode: "read-only-stub",
    message: "Wallet ingestion stub accepted for investigation queue. No signing, no fund movement, no on-chain submission.",
    data: {
      address,
      label,
      investigationNote: payload.investigationNote ?? "",
    },
  };

  return storeIdempotentResponse(request, body, 200);
}
