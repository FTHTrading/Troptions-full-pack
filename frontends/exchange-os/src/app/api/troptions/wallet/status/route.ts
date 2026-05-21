import { NextResponse } from "next/server";
import { WALLET_ACCOUNT_REGISTRY } from "@/content/troptions/walletAccountRegistry";
import { WALLET_BALANCE_REGISTRY } from "@/content/troptions/walletBalanceRegistry";
import { WALLET_CARD_REGISTRY } from "@/content/troptions/walletCardRegistry";
import { WALLET_INVITE_REGISTRY } from "@/content/troptions/walletInviteRegistry";
import { WALLET_RISK_REGISTRY } from "@/content/troptions/walletRiskRegistry";
import { WALLET_USER_REGISTRY } from "@/content/troptions/walletUserRegistry";
import { WALLET_X402_REGISTRY } from "@/content/troptions/walletX402Registry";

export async function GET() {
  return NextResponse.json({
    ok: true,
    simulationOnly: true,
    summary: {
      users: WALLET_USER_REGISTRY.length,
      accounts: WALLET_ACCOUNT_REGISTRY.length,
      invites: WALLET_INVITE_REGISTRY.length,
      balances: WALLET_BALANCE_REGISTRY.length,
      cards: WALLET_CARD_REGISTRY.length,
      risks: WALLET_RISK_REGISTRY.length,
      x402Profiles: WALLET_X402_REGISTRY.length,
    },
  });
}