/**
 * POST /api/troptions/xrpl-platform/tradeline/provision
 *
 * Submit a client's pre-signed TrustSet (XRPL) or changeTrust (Stellar) to the network.
 *
 * Security model:
 *   • This server NEVER receives or stores private keys
 *   • Client signs the transaction locally via Xumm, xrpl.js, or Stellar SDK
 *   • Server submits the pre-signed blob and returns the result
 *   • All submissions are AML/OFAC screened before relay
 *
 * Request body (XRPL):
 *   {
 *     chain: "xrpl",
 *     signedTxBlob: string,   // hex-encoded signed TrustSet tx_blob
 *     address: string,        // submitting address (for compliance audit)
 *     countryCode?: string,
 *   }
 *
 * Request body (Stellar):
 *   {
 *     chain: "stellar",
 *     signedXdr: string,      // base64-encoded signed XDR
 *     address: string,        // stellar public key
 *     countryCode?: string,
 *   }
 *
 * GET returns provisionining requirements and instructions.
 */

import { NextResponse } from "next/server";
import {
  submitXrplTradelineBlob,
  submitStellarTradelineXdr,
  TROPTIONS_ISSUER_ADDRESS,
  TROPTIONS_CURRENCY_HEX,
} from "@/lib/troptions/clientWalletEngine";
import { runComplianceScreen } from "@/lib/troptions/complianceScreenEngine";
import { trackControlPlaneEvent } from "@/lib/troptions/monitoring";

function getRequestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: Request) {
  let body: {
    chain?: string;
    signedTxBlob?: string;
    signedXdr?: string;
    address?: string;
    countryCode?: string;
    sessionId?: string;
  } = {};

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const chain   = body.chain === "stellar" ? "stellar" : "xrpl";
  const address = body.address ?? "";

  if (!address) {
    return NextResponse.json({ ok: false, error: "address is required for compliance screening." }, { status: 400 });
  }

  // Compliance pre-flight
  const screen = await runComplianceScreen({
    address,
    chain,
    countryCode: body.countryCode,
    requestIp:  getRequestIp(request),
    sessionId:  body.sessionId,
    operation:  "trustline",
  });

  if (screen.blocked) {
    return NextResponse.json(
      { ok: false, error: "Compliance screen blocked tradeline submission.", compliance: screen },
      { status: 451 }
    );
  }

  let result: { ok: boolean; txHash?: string; ledger?: number; validated?: boolean; error?: string };

  if (chain === "stellar") {
    if (!body.signedXdr) {
      return NextResponse.json({ ok: false, error: "signedXdr is required for Stellar tradeline provision." }, { status: 400 });
    }
    result = await submitStellarTradelineXdr(body.signedXdr);
  } else {
    if (!body.signedTxBlob) {
      return NextResponse.json({ ok: false, error: "signedTxBlob is required for XRPL tradeline provision." }, { status: 400 });
    }
    result = await submitXrplTradelineBlob(body.signedTxBlob);
  }

  if (result.ok) {
    trackControlPlaneEvent("tradeline-provision", "info", {
      chain,
      address,
      txHash:   result.txHash,
      auditRef: screen.auditRef,
    });
  }

  return NextResponse.json({
    ...result,
    compliance: {
      riskTier:  screen.riskTier,
      warnings:  screen.warnings,
      auditRef:  screen.auditRef,
    },
  }, { status: result.ok ? 200 : 422 });
}

export async function GET() {
  return NextResponse.json({
    ok:          true,
    description: "TROPTIONS Tradeline Provision API",
    xrpl: {
      issuer:      TROPTIONS_ISSUER_ADDRESS,
      currency:    TROPTIONS_CURRENCY_HEX,
      minXrpReserve: "12 XRP",
      trustSetFlags: "0",
      xummDeepLink: `https://xumm.app/detect/payload__${TROPTIONS_ISSUER_ADDRESS}`,
      instructions: [
        "1. In Xumm or xrpl.js, build a TrustSet transaction: Account=<your address>, LimitAmount.issuer=issuer, LimitAmount.currency=hex above, LimitAmount.value='1000000000'",
        "2. Sign the transaction locally — never send your seed to this server.",
        "3. POST the signed tx_blob to this endpoint with chain='xrpl'.",
      ],
    },
    stellar: {
      assetCode: "TROPTIONS",
      issuer:    process.env.STELLAR_ISSUER_ADDRESS ?? "",
      instructions: [
        "1. Build a changeTrust operation in @stellar/stellar-sdk with the TROPTIONS asset.",
        "2. Sign the transaction with your secret key locally.",
        "3. Encode as base64 XDR and POST to this endpoint with chain='stellar'.",
      ],
    },
  });
}
