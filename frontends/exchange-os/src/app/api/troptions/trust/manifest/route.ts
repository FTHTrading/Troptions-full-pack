import { NextResponse } from "next/server";
import { buildTrustManifest } from "@/lib/troptions/machineReadableTrust";

export async function GET() {
  return NextResponse.json({ ok: true, manifest: buildTrustManifest() });
}
