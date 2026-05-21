import { NextResponse } from "next/server";
import { SOLANA_DEX_REGISTRY, SOLANA_LAUNCHPAD_COMPETITORS, SOLANA_OPEN_SOURCE_STACK } from "@/data/solanaDexRegistry";

export async function GET() {
  return NextResponse.json({
    dexRegistry: SOLANA_DEX_REGISTRY,
    launchpadCompetitors: SOLANA_LAUNCHPAD_COMPETITORS,
    openSourceStack: SOLANA_OPEN_SOURCE_STACK,
    integrationPriority: {
      phase_1: ["Jupiter", "Meteora", "Raydium", "Orca Whirlpools", "Token-2022", "Metaplex"],
      phase_2: ["OpenBook V2", "Phoenix", "Pyth"],
      phase_3: ["Drift", "Lifinity", "Saros"],
      monitor_only: ["Pump.fun", "Bonk.fun", "Moonshot", "Bags.fm", "LaunchLab"]
    },
    proofPacketRequirements: [
      "Mint address",
      "Token standard: SPL Token or Token-2022",
      "Metadata account",
      "Mint authority",
      "Freeze authority",
      "Update authority",
      "Transfer hook status if Token-2022",
      "Transfer fee status if Token-2022",
      "Permanent delegate status if Token-2022",
      "Top holders",
      "Creator/team wallets",
      "LP wallet",
      "Pool address",
      "Liquidity venue",
      "LP lock or vesting proof",
      "Legal memo",
      "KYC/AML status",
      "Marketing review",
      "Launch committee status"
    ],
    generatedAt: new Date().toISOString()
  });
}
