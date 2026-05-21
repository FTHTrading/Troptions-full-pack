import { NextResponse } from "next/server";
import { AI_ENTITY_REGISTRY } from "@/content/troptions/aiEntityRegistry";
import { AI_DISCLAIMER } from "@/content/troptions/aiSearchRegistry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    disclaimer: AI_DISCLAIMER,
    count: AI_ENTITY_REGISTRY.length,
    entities: AI_ENTITY_REGISTRY,
  });
}
