import { NextResponse } from "next/server";
import {
  GENIUS_GATES,
  GENIUS_NAMESPACES,
  GENIUS_PROFILE,
  evaluateStablecoinAction,
} from "@/lib/troptions/genius";
import type { IssuerMode, StablecoinAction } from "@/lib/troptions/genius";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      action?: StablecoinAction;
      mode?: IssuerMode;
      selectedPartner?: string;
      namespaceId?: string;
    };

    if (!payload.action) {
      return NextResponse.json({ ok: false, error: "action is required" }, { status: 400 });
    }

    const namespace = payload.namespaceId
      ? GENIUS_NAMESPACES.find((item) => item.namespaceId === payload.namespaceId)
      : undefined;

    const decision = evaluateStablecoinAction(
      {
        ...GENIUS_PROFILE,
        issuerMode: payload.mode ?? GENIUS_PROFILE.issuerMode,
        ppsiPartnerName: payload.selectedPartner ?? GENIUS_PROFILE.ppsiPartnerName,
      },
      GENIUS_GATES,
      payload.action,
      namespace,
    );

    return NextResponse.json({
      ok: true,
      simulationOnly: !["live_mint", "live_burn", "live_redemption"].includes(payload.action),
      selectedPartner: payload.selectedPartner ?? null,
      namespaceId: namespace?.namespaceId ?? null,
      allowed: decision.allowed,
      reasons: decision.reasons,
      required_next_steps: decision.requiredNextSteps,
      risk_rating: decision.riskRating,
      status: decision.status,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 });
  }
}