import { NextResponse } from "next/server";
import {
  GENIUS_GATES,
  GENIUS_PROFILE,
  createRegulatorPacketSummary,
} from "@/lib/troptions/genius";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    packet: createRegulatorPacketSummary(GENIUS_PROFILE, GENIUS_GATES),
  });
}