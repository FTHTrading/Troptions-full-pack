/**
 * POST /api/troptions/xrpl/nft
 *
 * Real XRPL NFT (XLS-20) operations — mint single NFTs or the genesis batch,
 * and list NFTs held by the NFT issuer wallet.
 *
 * Requires: Authorization: Bearer <GENESIS_ADMIN_KEY> for mint operations.
 * GET operations return read-only NFT data (no admin key required).
 *
 * Operations (POST):
 *   mint-single       — Mint one NFToken (params: uri, taxon, transferFee?, flags?)
 *   mint-genesis-batch — Mint all 8 genesis collection NFTs
 *
 * Operations (GET ?op=nft-list):
 *   nft-list          — List NFTs held by the NFT_ISSUER wallet
 */
import { NextResponse } from "next/server";
import { guardPortalWrite, guardPortalRead } from "@/lib/troptions/portalApiGuards";
import {
  verifyGenesisAdminKey,
  mintNFToken,
  mintGenesisBatch,
  getAccountInfo,
} from "@/lib/troptions/xrplGenesisEngine";
import type { NftMintParams } from "@/lib/troptions/xrplGenesisEngine";

export async function POST(request: Request) {
  const guarded = await guardPortalWrite(request);
  if (guarded instanceof NextResponse) return guarded;

  const authHeader = request.headers.get("Authorization") ?? "";
  const adminKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

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
      case "mint-single": {
        const uri = params.uri as string | undefined;
        const taxon = params.taxon as number | undefined;
        if (!uri) {
          return NextResponse.json(
            { ok: false, error: "Required: params.uri" },
            { status: 400 }
          );
        }
        if (taxon === undefined || typeof taxon !== "number" || taxon < 0) {
          return NextResponse.json(
            { ok: false, error: "Required: params.taxon (non-negative integer)" },
            { status: 400 }
          );
        }
        const mintParams: NftMintParams = {
          uri,
          taxon,
          transferFee: typeof params.transferFee === "number" ? params.transferFee : 0,
          flags:       typeof params.flags === "number" ? params.flags : 0x00000008, // tfTransferable
        };
        const result = await mintNFToken(mintParams);
        return NextResponse.json({ op, ...result });
      }

      case "mint-genesis-batch": {
        const uriBase = typeof params.uriBase === "string"
          ? params.uriBase
          : "https://troptions.org/nft-metadata/genesis/";
        const results = await mintGenesisBatch(uriBase);
        const allOk   = results.every(r => r.ok);
        return NextResponse.json({ op, ok: allOk, minted: results.length, results });
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

  const { searchParams } = new URL(request.url);
  const op = searchParams.get("op") ?? "nft-list";

  if (op === "nft-list") {
    const nftIssuerAddress = process.env.XRPL_NFT_ISSUER_ADDRESS ?? "";
    if (!nftIssuerAddress) {
      return NextResponse.json(
        { ok: false, error: "XRPL_NFT_ISSUER_ADDRESS not set in environment" },
        { status: 500 }
      );
    }
    try {
      const info = await getAccountInfo(nftIssuerAddress);
      return NextResponse.json({ op, ...info });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: message }, { status: 502 });
    }
  }

  return NextResponse.json(
    { ok: false, error: `Unknown GET op: ${op}` },
    { status: 400 }
  );
}
