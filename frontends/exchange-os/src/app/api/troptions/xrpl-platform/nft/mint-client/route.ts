/**
 * POST /api/troptions/xrpl-platform/nft/mint-client
 *
 * Mint an NFToken to a client's XRPL address from the TROPTIONS NFT issuer wallet.
 *
 * Authorization: Bearer <GENESIS_ADMIN_KEY>
 *
 * Operations:
 *   "mint-single"   — mint one NFT from a specified collection (taxon)
 *   "mint-deed"     — mint an RWA property deed NFT (taxon 2)
 *   "mint-member"   — mint an Exchange Member credential NFT (taxon 1)
 *   "mint-impact"   — mint an Impact Certificate NFT (taxon 4)
 *   "mint-heritage" — mint a Legacy Heritage NFT (taxon 6)
 *
 * Request body:
 *   {
 *     op:           "mint-single" | "mint-deed" | "mint-member" | "mint-impact" | "mint-heritage",
 *     toAddress:    string,    // recipient XRPL address
 *     metadataUri:  string,    // IPFS URI (ipfs://Qm...) or HTTPS URI
 *     taxon?:       number,    // for mint-single only
 *     transferFee?: number,    // basis points 0–50000 (for transferable NFTs)
 *     transferable?: boolean,  // default: true
 *     countryCode?: string,    // for compliance
 *   }
 *
 * GET returns collection catalog and mint status.
 */

import { NextResponse } from "next/server";
import { mintNFToken } from "@/lib/troptions/xrplGenesisEngine";
import { runComplianceScreen } from "@/lib/troptions/complianceScreenEngine";
import { trackControlPlaneEvent } from "@/lib/troptions/monitoring";

function verifyAdminKey(authHeader: string): boolean {
  const key = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const expected = process.env.GENESIS_ADMIN_KEY;
  if (!expected) return false;
  // Constant-time comparison to prevent timing attacks
  if (key.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < key.length; i++) {
    mismatch |= key.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

// NFT collection definitions
const NFT_COLLECTIONS = {
  "mint-deed":     { taxon: 2, name: "RWA Property Deed",       fee: 250,  transferable: true  },
  "mint-member":   { taxon: 1, name: "Exchange Member NFT",     fee: 0,    transferable: false },
  "mint-impact":   { taxon: 4, name: "Impact Certificate",      fee: 0,    transferable: true  },
  "mint-heritage": { taxon: 6, name: "Legacy Heritage NFT",     fee: 500,  transferable: true  },
  "mint-credential": { taxon: 0, name: "Institutional Credential", fee: 0,  transferable: false },
} as const;

export async function POST(request: Request) {
  // Auth check
  if (!verifyAdminKey(request.headers.get("Authorization") ?? "")) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing GENESIS_ADMIN_KEY." },
      { status: 403 }
    );
  }

  let body: {
    op?:          string;
    toAddress?:   string;
    metadataUri?: string;
    taxon?:       number;
    transferFee?: number;
    transferable?: boolean;
    countryCode?: string;
  } = {};

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const { op = "mint-single", toAddress, metadataUri } = body;

  if (!toAddress) {
    return NextResponse.json({ ok: false, error: "toAddress is required." }, { status: 400 });
  }
  if (!metadataUri) {
    return NextResponse.json({ ok: false, error: "metadataUri is required." }, { status: 400 });
  }
  if (!metadataUri.startsWith("ipfs://") && !metadataUri.startsWith("https://")) {
    return NextResponse.json(
      { ok: false, error: "metadataUri must be an ipfs:// or https:// URI." },
      { status: 400 }
    );
  }

  // Compliance screen on recipient address
  const screen = await runComplianceScreen({
    address:     toAddress,
    chain:       "xrpl",
    countryCode: body.countryCode,
    requestIp:   request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    operation:   "nft-mint",
  });

  if (screen.blocked) {
    return NextResponse.json(
      { ok: false, error: "Compliance screen blocked NFT mint.", compliance: screen },
      { status: 451 }
    );
  }

  // Resolve collection params
  let taxon:       number;
  let transferFee: number;
  let flags:       number;

  if (op === "mint-single") {
    taxon       = body.taxon ?? 0;
    transferFee = body.transferFee ?? 0;
    flags       = (body.transferable ?? true) ? 0x00000008 : 0;
  } else if (op in NFT_COLLECTIONS) {
    const col = NFT_COLLECTIONS[op as keyof typeof NFT_COLLECTIONS];
    taxon       = col.taxon;
    transferFee = body.transferFee ?? col.fee;
    flags       = col.transferable ? 0x00000008 : 0;
  } else {
    return NextResponse.json({ ok: false, error: `Unknown op: ${op}` }, { status: 400 });
  }

  const result = await mintNFToken({ uri: metadataUri, transferFee, flags, taxon });

  if (result.ok) {
    trackControlPlaneEvent("nft-mint-client", "info", {
      op,
      toAddress,
      taxon,
      txHash:   result.txHash,
      auditRef: screen.auditRef,
    });
  }

  return NextResponse.json({
    ...result,
    collection: { taxon, transferFee, flags },
    compliance: { riskTier: screen.riskTier, warnings: screen.warnings, auditRef: screen.auditRef },
  }, { status: result.ok ? 200 : 422 });
}

export async function GET() {
  return NextResponse.json({
    ok:          true,
    description: "TROPTIONS NFT Mint — Client Recipient API",
    requiresAuth: true,
    authHeader:   "Authorization: Bearer <GENESIS_ADMIN_KEY>",
    collections: [
      { op: "mint-deed",       taxon: 2, name: "RWA Property Deed",            transferable: true,  transferFee: "250 bps (2.5%)" },
      { op: "mint-member",     taxon: 1, name: "Exchange Member NFT",          transferable: false, transferFee: "0" },
      { op: "mint-impact",     taxon: 4, name: "Impact Funding Certificate",   transferable: true,  transferFee: "0" },
      { op: "mint-heritage",   taxon: 6, name: "Legacy Heritage NFT",          transferable: true,  transferFee: "500 bps (5%)" },
      { op: "mint-credential", taxon: 0, name: "Institutional Credential NFT", transferable: false, transferFee: "0" },
      { op: "mint-single",     taxon: "custom (body.taxon)", name: "Custom collection", transferable: "body.transferable", transferFee: "body.transferFee" },
    ],
    metadataStandard: "XLS-24 (compatible with XRPL NFT marketplaces)",
    ipfsRecommended: true,
  });
}
