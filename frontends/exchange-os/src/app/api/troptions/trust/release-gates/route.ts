import { NextResponse } from "next/server";
import { RELEASE_GATES, TRUST_GATES } from "@/lib/troptions/machineReadableTrust";

export async function GET() {
  return NextResponse.json({ ok: true, trustGates: TRUST_GATES, releaseGates: RELEASE_GATES });
}
