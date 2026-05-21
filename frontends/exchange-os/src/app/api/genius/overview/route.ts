import { NextResponse } from "next/server";
import { GENIUS_CONTROL_TOWER_REGISTRY } from "@/content/troptions/geniusControlTowerRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    data: GENIUS_CONTROL_TOWER_REGISTRY.overview,
  });
}