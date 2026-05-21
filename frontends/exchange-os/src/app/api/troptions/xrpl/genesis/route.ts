/**
 * POST /api/troptions/xrpl/genesis
 *
 * Real XRPL genesis operations — configures issuer accounts, establishes
 * trustlines, issues IOUs, creates DEX offers, and creates AMM pools.
 *
 * All operations are server-side signed using env-loaded seeds.
 * Requires: Authorization: Bearer <GENESIS_ADMIN_KEY>
 *
 * BODY { op: string, params?: object }
 *
 * Operations:
 *   configure-issuer          — AccountSet DefaultRipple on issuer wallet
 *   configure-distributor     — AccountSet RequireDestTag on distributor
 *   set-distributor-trustline — TrustSet from distributor to issuer
 *   issue-initial-supply      — Payment: issuer → distributor (1B TROPTIONS)
 *   issue-tokens              — Payment: issuer → address (params.toAddress, params.amount)
 *   create-sell-offer         — OfferCreate: sell TROPTIONS for XRP
 *   create-buy-offer          — OfferCreate: buy TROPTIONS with XRP
 *   place-seed-liquidity      — Both bid and ask offers at default spread
 *   create-amm                — AMMCreate: TROPTIONS/XRP AMM pool
 *   wallet-status             — Read-only: all genesis wallet balances
 *   issuer-trustlines         — Read-only: all TROPTIONS trustlines on issuer
 */
import { NextResponse } from "next/server";
import { guardPortalWrite } from "@/lib/troptions/portalApiGuards";
import {
  verifyGenesisAdminKey,
  configureIssuerAccount,
  configureDistributorAccount,
  setDistributorTrustline,
  issueInitialSupply,
  issueTokens,
  createSellOffer,
  createBuyOffer,
  placeSeedLiquidity,
  createTroptionsXrpAmm,
  getGenesisWalletStatus,
  getAccountTrustlines,
} from "@/lib/troptions/xrplGenesisEngine";
import type { IouIssueParams } from "@/lib/troptions/xrplGenesisEngine";

type GenesisOp =
  | "configure-issuer"
  | "configure-distributor"
  | "set-distributor-trustline"
  | "issue-initial-supply"
  | "issue-tokens"
  | "create-sell-offer"
  | "create-buy-offer"
  | "place-seed-liquidity"
  | "create-amm"
  | "wallet-status"
  | "issuer-trustlines";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  // Verify genesis admin key from Authorization header
  const authHeader = request.headers.get("Authorization") ?? "";
  const adminKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!verifyGenesisAdminKey(adminKey)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing GENESIS_ADMIN_KEY in Authorization header." },
      { status: 403 }
    );
  }

  let body: { op: GenesisOp; params?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { op, params = {} } = body;

  try {
    switch (op) {
      case "configure-issuer": {
        const result = await configureIssuerAccount({
          requireAuth: Boolean(params.requireAuth),
          noFreeze:    Boolean(params.noFreeze),
        });
        return NextResponse.json({ op, ...result });
      }

      case "configure-distributor": {
        const result = await configureDistributorAccount();
        return NextResponse.json({ op, ...result });
      }

      case "set-distributor-trustline": {
        const limit = typeof params.limit === "string" ? params.limit : "10000000000";
        const result = await setDistributorTrustline(limit);
        return NextResponse.json({ op, ...result });
      }

      case "issue-initial-supply": {
        const result = await issueInitialSupply();
        return NextResponse.json({ op, ...result });
      }

      case "issue-tokens": {
        const toAddress = params.toAddress as string | undefined;
        const amount    = params.amount as string | undefined;
        if (!toAddress || !amount) {
          return NextResponse.json(
            { ok: false, error: "Required: params.toAddress and params.amount" },
            { status: 400 }
          );
        }
        const issueParams: IouIssueParams = {
          toAddress,
          amount,
          destinationTag: typeof params.destinationTag === "number" ? params.destinationTag : undefined,
        };
        const result = await issueTokens(issueParams);
        return NextResponse.json({ op, ...result });
      }

      case "create-sell-offer": {
        const troptions = params.troptionsAmount as string | undefined;
        const xrpDrops  = params.xrpDrops as string | undefined;
        if (!troptions || !xrpDrops) {
          return NextResponse.json(
            { ok: false, error: "Required: params.troptionsAmount and params.xrpDrops" },
            { status: 400 }
          );
        }
        const result = await createSellOffer(
          troptions,
          xrpDrops,
          typeof params.expirySeconds === "number" ? params.expirySeconds : undefined
        );
        return NextResponse.json({ op, ...result });
      }

      case "create-buy-offer": {
        const xrpDrops  = params.xrpDrops as string | undefined;
        const troptions = params.troptionsAmount as string | undefined;
        if (!xrpDrops || !troptions) {
          return NextResponse.json(
            { ok: false, error: "Required: params.xrpDrops and params.troptionsAmount" },
            { status: 400 }
          );
        }
        const result = await createBuyOffer(
          xrpDrops,
          troptions,
          typeof params.expirySeconds === "number" ? params.expirySeconds : undefined
        );
        return NextResponse.json({ op, ...result });
      }

      case "place-seed-liquidity": {
        const results = await placeSeedLiquidity({
          sellTroptions: params.sellTroptions as string | undefined,
          sellForXrp:    params.sellForXrp    as string | undefined,
          buyTroptions:  params.buyTroptions  as string | undefined,
          buyForXrp:     params.buyForXrp     as string | undefined,
        });
        return NextResponse.json({ op, ok: results.every(r => r.ok), results });
      }

      case "create-amm": {
        const result = await createTroptionsXrpAmm({
          troptionsAmount: params.troptionsAmount as string | undefined,
          xrpAmount:       params.xrpAmount       as string | undefined,
          tradingFee:      typeof params.tradingFee === "number" ? params.tradingFee : undefined,
        });
        return NextResponse.json({ op, ...result });
      }

      case "wallet-status": {
        const status = await getGenesisWalletStatus();
        return NextResponse.json({ op, ok: true, wallets: status });
      }

      case "issuer-trustlines": {
        const issuerAddress = process.env.XRPL_ISSUER_ADDRESS ?? "";
        if (!issuerAddress) {
          return NextResponse.json(
            { ok: false, error: "XRPL_ISSUER_ADDRESS not set" },
            { status: 500 }
          );
        }
        const result = await getAccountTrustlines(issuerAddress);
        return NextResponse.json({ op, ...result });
      }

      default: {
        return NextResponse.json(
          { ok: false, error: `Unknown op: ${op as string}` },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: message, op },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const authHeader = request.headers.get("Authorization") ?? "";
  const adminKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!verifyGenesisAdminKey(adminKey)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing GENESIS_ADMIN_KEY." },
      { status: 403 }
    );
  }

  const status = await getGenesisWalletStatus();
  return NextResponse.json({
    ok:      true,
    network: process.env.XRPL_WS_URL ?? "wss://xrplcluster.com",
    wallets: status,
    availableOps: [
      "configure-issuer",
      "configure-distributor",
      "set-distributor-trustline",
      "issue-initial-supply",
      "issue-tokens",
      "create-sell-offer",
      "create-buy-offer",
      "place-seed-liquidity",
      "create-amm",
      "wallet-status",
      "issuer-trustlines",
    ],
  });
}
