// TROPTIONS Exchange OS — API: x402 Payment Verification
// POST /exchange-os/api/x402/verify

import { NextResponse } from "next/server";
import { verifyX402Payment } from "@/lib/exchange-os/x402/verify";
import { x402Config } from "@/config/exchange-os/x402";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      serviceId?: string;
      nonce?: string;
      txHash?: string;
      paymentHeader?: string;
    };

    const { serviceId, nonce, txHash, paymentHeader } = body;

    if (!serviceId || !nonce) {
      return NextResponse.json({ error: "serviceId and nonce are required" }, { status: 400 });
    }

    const result = await verifyX402Payment({ serviceId, nonce, txHash, paymentHeader });

    if (!result.verified) {
      return NextResponse.json(
        { error: result.error ?? "Payment verification failed", ...result },
        { status: 402 }
      );
    }

    return NextResponse.json({ ...result, demoMode: x402Config.demoMode });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Verification error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
