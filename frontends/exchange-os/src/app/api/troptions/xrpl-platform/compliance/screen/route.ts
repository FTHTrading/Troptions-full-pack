/**
 * POST /api/troptions/xrpl-platform/compliance/screen
 *
 * Pre-flight AML/KYC/OFAC compliance screen for any wallet address.
 * Call this before any significant operation (wallet setup, LP deposit, transfer).
 *
 * Request body:
 *   {
 *     address:      string,   // XRPL (r…) or Stellar (G…) address
 *     chain:        "xrpl" | "stellar",
 *     operation:    "wallet-generate" | "trustline" | "lp-deposit" | "nft-mint" | "token-transfer",
 *     usdAmount?:   number,   // USD equivalent of the intended transaction (for Travel Rule)
 *     countryCode?: string,   // ISO 3166-1 alpha-2 country code
 *     sessionId?:   string,
 *   }
 *
 * Response:
 *   {
 *     ok:           boolean,
 *     riskTier:     "low" | "medium" | "high" | "sanctioned",
 *     blocked:      boolean,       // true = operation should be denied
 *     blockReasons: string[],
 *     warnings:     string[],
 *     travelRule:   boolean,       // true = FinCEN Travel Rule threshold exceeded
 *     auditRef:     string,        // unique compliance reference
 *     screeningMode: string,
 *   }
 *
 * No authentication required — screening is a public utility.
 * Audit trail is maintained server-side regardless of result.
 *
 * GET returns current screening configuration and threshold documentation.
 */

import { NextResponse } from "next/server";
import { runComplianceScreen } from "@/lib/troptions/complianceScreenEngine";

const VALID_OPERATIONS = [
  "wallet-generate",
  "trustline",
  "lp-deposit",
  "nft-mint",
  "token-transfer",
] as const;

type ValidOperation = (typeof VALID_OPERATIONS)[number];

export async function POST(request: Request) {
  let body: {
    address?:     string;
    chain?:       string;
    operation?:   string;
    usdAmount?:   number;
    countryCode?: string;
    sessionId?:   string;
  } = {};

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const address   = body.address ?? "";
  const chain     = body.chain === "stellar" ? "stellar" : "xrpl";
  const operation = VALID_OPERATIONS.includes(body.operation as ValidOperation)
    ? (body.operation as ValidOperation)
    : "trustline";

  if (!address) {
    return NextResponse.json({ ok: false, error: "address is required." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const result = await runComplianceScreen({
    address,
    chain,
    operation,
    usdAmount:   body.usdAmount,
    countryCode: body.countryCode,
    requestIp:   ip,
    sessionId:   body.sessionId,
  });

  return NextResponse.json(result, { status: result.blocked ? 451 : 200 });
}

export async function GET() {
  return NextResponse.json({
    ok:          true,
    description: "TROPTIONS Compliance Screen API",
    screeningLayers: [
      { layer: 1, name: "Address Format Validation",       action: "block on invalid format" },
      { layer: 2, name: "OFAC SDN Jurisdiction Check",     action: "block on sanctioned country" },
      { layer: 3, name: "FATF High-Risk Jurisdiction",     action: "warn on grey/black list country" },
      { layer: 4, name: "FinCEN Travel Rule Threshold",    action: "flag if ≥ $3,000 USD" },
      { layer: 5, name: "Currency Transaction Report",     action: "warn if ≥ $10,000 USD" },
      { layer: 6, name: "IP Velocity Check",               action: "block on > 5 wallet generates per minute per IP" },
      { layer: 7, name: "External Risk Score (Chainalysis/Elliptic)", action: "block/warn based on CHAINALYSIS_API_KEY or ELLIPTIC_API_KEY" },
    ],
    thresholds: {
      travelRule: "$3,000 USD",
      ctr:        "$10,000 USD",
    },
    screeningModes: {
      live:     "High-risk addresses are blocked. Set SCREENING_MODE=live in production.",
      shadow:   "All addresses pass but high-risk results are logged for audit review (default).",
      disabled: "Screening skipped entirely. Only for development/testing.",
    },
    complianceReferences: [
      "Bank Secrecy Act (BSA) 31 U.S.C. § 5311–5336",
      "FinCEN CVC Guidance 2019, 2020, 2021",
      "FATF Recommendation 16 (Travel Rule)",
      "OFAC SDN enforcement 31 C.F.R. parts 500–599",
    ],
  });
}
