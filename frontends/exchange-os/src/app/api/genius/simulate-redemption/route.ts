import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { SimulatedRedemptionEvent } from "@/lib/troptions/genius";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { memberNamespace?: string; amount?: string };

    if (!payload.memberNamespace || !payload.amount) {
      return NextResponse.json({ ok: false, error: "memberNamespace and amount are required" }, { status: 400 });
    }

    const redemption: SimulatedRedemptionEvent = {
      redemptionId: crypto.randomUUID(),
      memberNamespace: payload.memberNamespace,
      amount: payload.amount,
      status: "simulated_only",
      blockedLiveReason:
        "Live redemption remains blocked until regulated issuer approval, reserve attestation, legal sign-off, board approval, and redemption operations controls are fully active.",
    };

    return NextResponse.json({ ok: true, simulationOnly: true, redemption });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}