/**
 * POST /api/troptions/stellar/lp
 *
 * Real Stellar Liquidity Pool operations — create and deposit into
 * TROPTIONS/XLM and TROPTIONS/USDC AMM pools.
 *
 * Requires: Authorization: Bearer <GENESIS_ADMIN_KEY>
 *
 * Operations:
 *   create-xlm-pool   — changeTrust + liquidityPoolDeposit for XLM/TROPTIONS pool
 *   create-usdc-pool  — changeTrust + liquidityPoolDeposit for USDC/TROPTIONS pool
 *
 * GET returns LP pool readiness status.
 */
import { NextResponse } from "next/server";
import { guardPortalWrite, guardPortalRead } from "@/lib/troptions/portalApiGuards";
import {
  verifyGenesisAdminKey,
  createTroptionsXlmPool,
  createTroptionsUsdcPool,
  getStellarGenesisStatus,
} from "@/lib/troptions/stellarGenesisEngine";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const authHeader = request.headers.get("Authorization") ?? "";
  const adminKey   = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!verifyGenesisAdminKey(adminKey)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing GENESIS_ADMIN_KEY in Authorization header." },
      { status: 403 }
    );
  }

  let body: { op: string; params?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { op, params = {} } = body;

  try {
    switch (op) {
      case "create-xlm-pool": {
        const result = await createTroptionsXlmPool({
          xlmAmount:       typeof params.xlmAmount       === "string" ? params.xlmAmount       : "10000",
          troptionsAmount: typeof params.troptionsAmount === "string" ? params.troptionsAmount : "1000000",
        });
        return NextResponse.json({ op, ...result });
      }

      case "create-usdc-pool": {
        const result = await createTroptionsUsdcPool({
          usdcAmount:      typeof params.usdcAmount      === "string" ? params.usdcAmount      : "10000",
          troptionsAmount: typeof params.troptionsAmount === "string" ? params.troptionsAmount : "1000000",
        });
        return NextResponse.json({ op, ...result });
      }

      default: {
        return NextResponse.json(
          { ok: false, error: `Unknown op: ${op}` },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message, op }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  const status = await getStellarGenesisStatus();
  const lpWallet = status.lpManager;

  return NextResponse.json({
    ok:           true,
    lpWalletReady: lpWallet?.ok === true,
    lpWallet:      lpWallet ?? null,
    availableOps:  ["create-xlm-pool", "create-usdc-pool"],
    pools: [
      {
        id:     "troptions-xlm",
        pair:   "TROPTIONS/XLM",
        status: "not-created",
        note:   "30bp fee (LiquidityPoolFeeV18 = 30)",
      },
      {
        id:     "troptions-usdc",
        pair:   "TROPTIONS/USDC",
        status: "not-created",
        note:   "USDC issuer: GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      },
    ],
  });
}
