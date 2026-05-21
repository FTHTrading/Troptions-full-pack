import { NextResponse } from "next/server";
import { generateCrossRailReadinessReport } from "@/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge";

export async function GET() {
  try {
    const report = generateCrossRailReadinessReport();
    return NextResponse.json({ ok: true, report });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Cross-rail readiness report unavailable." },
      { status: 503 },
    );
  }
}
