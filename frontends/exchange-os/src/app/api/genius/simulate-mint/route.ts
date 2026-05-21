import crypto from "node:crypto";
import { NextResponse } from "next/server";
import {
  GENIUS_GATES,
  GENIUS_NAMESPACES,
  GENIUS_PROFILE,
  canNamespaceReceiveSimulation,
} from "@/lib/troptions/genius";
import type { SimulatedLedgerEvent } from "@/lib/troptions/genius";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { memberNamespace?: string; amount?: string };

    if (!payload.memberNamespace || !payload.amount) {
      return NextResponse.json({ ok: false, error: "memberNamespace and amount are required" }, { status: 400 });
    }

    const namespace = GENIUS_NAMESPACES.find((item) => item.namespaceId === payload.memberNamespace);
    if (!namespace) {
      return NextResponse.json({ ok: false, error: "Unknown namespace" }, { status: 404 });
    }

    if (!canNamespaceReceiveSimulation(namespace, GENIUS_PROFILE, GENIUS_GATES)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Namespace is not mock-approved for sandbox stablecoin simulation.",
          liveBlocked: true,
        },
        { status: 400 },
      );
    }

    const event: SimulatedLedgerEvent = {
      eventId: crypto.randomUUID(),
      tokenSymbol: "TROP-USD-SIM",
      amount: payload.amount,
      from: "reserve_simulator",
      to: "member_namespace",
      status: "simulated_only",
      legalNotice:
        "No live token issued. No money moved. Compliance sandbox only. Live issuance remains blocked pending legal, regulatory, reserve, AML/KYC, and board approvals.",
    };

    return NextResponse.json({ ok: true, simulationOnly: true, event });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}