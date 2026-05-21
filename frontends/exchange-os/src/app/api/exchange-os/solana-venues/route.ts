import { NextResponse } from "next/server";
import {
  SOLANA_DEX_REGISTRY,
  SOLANA_LAUNCHPAD_COMPETITORS,
  SOLANA_OPEN_SOURCE_STACK,
} from "@/data/solanaDexRegistry";


export async function GET() {
  return NextResponse.json({
    data: {
      coreRegistry: SOLANA_DEX_REGISTRY,
      competitorWatchlist: SOLANA_LAUNCHPAD_COMPETITORS,
      openSourceStack: SOLANA_OPEN_SOURCE_STACK,
    },
    generatedAt: new Date().toISOString(),
    truthLabel:
      "static_config_no_live_data — Solana venue intelligence registry, no live market data",
    version: "1.0",
  });
}
