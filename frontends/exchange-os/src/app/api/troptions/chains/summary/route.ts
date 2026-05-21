import { NextResponse } from "next/server";
import { MULTI_CHAIN_REGISTRY } from "@/content/troptions/multiChainRegistry";

export async function GET() {
  return NextResponse.json({ ok: true, chains: MULTI_CHAIN_REGISTRY });
}
