import { NextResponse } from "next/server";
import { buildDisclaimers } from "@/lib/troptions/machineReadableTrust";

export async function GET() {
  return NextResponse.json({ ok: true, disclaimers: buildDisclaimers() });
}
