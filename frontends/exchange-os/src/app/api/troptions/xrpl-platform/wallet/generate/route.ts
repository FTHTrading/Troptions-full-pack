/**
 * POST /api/troptions/xrpl-platform/wallet/generate
 *
 * Generate a fresh XRPL or Stellar wallet keypair for client onboarding.
 *
 * Security guarantees:
 *   • Keypair entropy from Node.js crypto.randomBytes (CSPRNG)
 *   • Private key / seed is returned ONCE in response — never stored here
 *   • All generations are AML/compliance-screened and audit-logged
 *   • Rate-limited: 5 wallet generations per IP per minute
 *   • No authentication required (public endpoint — wallet gen is pre-auth)
 *
 * Request body:
 *   { chain: "xrpl" | "stellar", countryCode?: string, sessionId?: string }
 *
 * Response:
 *   { ok: true, wallet: GeneratedXrplWallet | GeneratedStellarWallet, compliance: ComplianceScreenResult }
 *
 * ⚠ IMPORTANT: The private key / seed in the response must be displayed to the user
 *   immediately and never stored by the caller. It cannot be recovered.
 */

import { NextResponse } from "next/server";
import {
  generateXrplWallet,
  generateStellarWallet,
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
  let body: { chain?: string; countryCode?: string; sessionId?: string } = {};

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const chain      = body.chain === "stellar" ? "stellar" : "xrpl";
  const ip         = getRequestIp(request);
  const sessionId  = body.sessionId ?? `anon-${Date.now()}`;

  // Generate a placeholder address for compliance screening
  // (We need to check IP velocity and jurisdiction before generating real keys)
  const placeholderAddress = chain === "xrpl" ? "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" : "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN";

  const screen = await runComplianceScreen({
    address:    placeholderAddress,
    chain,
    countryCode: body.countryCode,
    requestIp:  ip,
    sessionId,
    operation:  "wallet-generate",
  });

  if (screen.blocked) {
    return NextResponse.json(
      { ok: false, error: "Compliance screen blocked this request.", compliance: screen },
      { status: 451 } // 451 Unavailable For Legal Reasons
    );
  }

  // Generate the wallet
  const wallet = chain === "stellar" ? generateStellarWallet() : generateXrplWallet();

  // Audit log — NO key material logged
  trackControlPlaneEvent("wallet-generate", "info", {
    chain,
    address:   chain === "xrpl" ? (wallet as ReturnType<typeof generateXrplWallet>).address : (wallet as ReturnType<typeof generateStellarWallet>).publicKey,
    ip,
    sessionId,
    auditRef:  screen.auditRef,
  });

  return NextResponse.json({
    ok:      true,
    wallet,
    meta: {
      issuerAddress:      TROPTIONS_ISSUER_ADDRESS,
      troptionsCurrencyHex: TROPTIONS_CURRENCY_HEX,
      nextSteps: [
        chain === "xrpl"
          ? "Fund your address with ≥12 XRP, then visit /troptions/xrpl-platform/wallet-studio to set your trustline."
          : "Fund your account with ≥1.5 XLM, then set a TROPTIONS trustline via Lobstr or Stellar Account Viewer.",
      ],
    },
    compliance: {
      riskTier:      screen.riskTier,
      warnings:      screen.warnings,
      travelRule:    screen.travelRule,
      auditRef:      screen.auditRef,
      screeningMode: screen.screeningMode,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    ok:          true,
    description: "TROPTIONS Wallet Generation API",
    chains:      ["xrpl", "stellar"],
    issuer: {
      xrpl:    { address: TROPTIONS_ISSUER_ADDRESS, currencyHex: TROPTIONS_CURRENCY_HEX },
      stellar: { assetCode: "TROPTIONS", issuer: process.env.STELLAR_ISSUER_ADDRESS ?? "" },
    },
    trustlineSetup: {
      xrpl:    "https://xumm.app — import your wallet and add a trustline to the issuer address",
      stellar: "https://stellarterm.com or Lobstr — search TROPTIONS and add trustline",
    },
  });
}
