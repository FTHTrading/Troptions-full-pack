/**
 * POST /api/troptions/stellar/genesis
 *
 * Real Stellar genesis operations — configures issuer accounts, establishes
 * trustlines, issues TROPTIONS, creates DEX offers, and generates stellar.toml.
 *
 * Requires: Authorization: Bearer <GENESIS_ADMIN_KEY> for write operations.
 * GET returns read-only status (no admin key required).
 *
 * Operations:
 *   configure-issuer          — SetOptions homeDomain + auth flags on issuer
 *   set-distributor-trustline — changeTrust from distributor to issuer
 *   set-lp-trustline          — changeTrust from LP wallet to issuer
 *   issue-supply              — Payment: issuer → distributor (1B TROPTIONS)
 *   issue-to-address          — Payment: issuer → params.toAddress (params.amount)
 *   create-sell-offer         — manageSellOffer TROPTIONS→XLM on Stellar DEX
 *   create-usdc-sell-offer    — manageSellOffer TROPTIONS→USDC on Stellar DEX
 *   genesis-status            — Read-only: all Stellar genesis wallet balances
 *   stellar-toml              — Returns full stellar.toml content for troptions.org
 */
import { NextResponse } from "next/server";
import { guardPortalWrite, guardPortalRead } from "@/lib/troptions/portalApiGuards";
import {
  verifyGenesisAdminKey,
  configureStellarIssuer,
  setDistributorTrustline,
  setLpTrustline,
  issueToDistributor,
  issueToAddress,
  createStellarSellOffer,
  createStellarSellOfferUsdc,
  getStellarGenesisStatus,
  generateStellarToml,
} from "@/lib/troptions/stellarGenesisEngine";

type GenesisOp =
  | "configure-issuer"
  | "set-distributor-trustline"
  | "set-lp-trustline"
  | "issue-supply"
  | "issue-to-address"
  | "create-sell-offer"
  | "create-usdc-sell-offer"
  | "genesis-status"
  | "stellar-toml";

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
        const result = await configureStellarIssuer({
          authRequired:   Boolean(params.authRequired),
          authRevocable:  Boolean(params.authRevocable),
          authClawback:   Boolean(params.authClawback),
        });
        return NextResponse.json({ op, ...result });
      }

      case "set-distributor-trustline": {
        const limit = typeof params.limit === "string" ? params.limit : "1000000000";
        const result = await setDistributorTrustline(limit);
        return NextResponse.json({ op, ...result });
      }

      case "set-lp-trustline": {
        const limit = typeof params.limit === "string" ? params.limit : "1000000000";
        const result = await setLpTrustline(limit);
        return NextResponse.json({ op, ...result });
      }

      case "issue-supply": {
        const amount = typeof params.amount === "string" ? params.amount : "1000000000";
        const result = await issueToDistributor(amount);
        return NextResponse.json({ op, ...result });
      }

      case "issue-to-address": {
        const toAddress = params.toAddress as string | undefined;
        const amount    = params.amount    as string | undefined;
        if (!toAddress || !amount) {
          return NextResponse.json(
            { ok: false, error: "Required: params.toAddress and params.amount" },
            { status: 400 }
          );
        }
        const result = await issueToAddress(toAddress, amount);
        return NextResponse.json({ op, ...result });
      }

      case "create-sell-offer": {
        const amount      = params.amount      as string | undefined;
        const xlmPerToken = params.xlmPerToken as string | undefined;
        if (!amount || !xlmPerToken) {
          return NextResponse.json(
            { ok: false, error: "Required: params.amount and params.xlmPerToken" },
            { status: 400 }
          );
        }
        const result = await createStellarSellOffer(amount, xlmPerToken);
        return NextResponse.json({ op, ...result });
      }

      case "create-usdc-sell-offer": {
        const amount       = params.amount       as string | undefined;
        const usdcPerToken = params.usdcPerToken as string | undefined;
        if (!amount || !usdcPerToken) {
          return NextResponse.json(
            { ok: false, error: "Required: params.amount and params.usdcPerToken" },
            { status: 400 }
          );
        }
        const result = await createStellarSellOfferUsdc(amount, usdcPerToken);
        return NextResponse.json({ op, ...result });
      }

      case "genesis-status": {
        const status = await getStellarGenesisStatus();
        return NextResponse.json({ op, ok: true, wallets: status });
      }

      case "stellar-toml": {
        const issuerAddress = process.env.STELLAR_ISSUER_ADDRESS ?? "";
        if (!issuerAddress) {
          return NextResponse.json(
            { ok: false, error: "STELLAR_ISSUER_ADDRESS not set in environment" },
            { status: 500 }
          );
        }
        const toml = generateStellarToml(issuerAddress);
        return NextResponse.json({ op, ok: true, toml });
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
    return NextResponse.json({ ok: false, error: message, op }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const guarded = await guardPortalRead(request);
  if (guarded instanceof NextResponse) return guarded;

  const status = await getStellarGenesisStatus();
  return NextResponse.json({
    ok:      true,
    network: process.env.STELLAR_HORIZON_URL ?? "https://horizon.stellar.org",
    wallets: status,
    availableOps: [
      "configure-issuer",
      "set-distributor-trustline",
      "set-lp-trustline",
      "issue-supply",
      "issue-to-address",
      "create-sell-offer",
      "create-usdc-sell-offer",
      "genesis-status",
      "stellar-toml",
    ],
  });
}
