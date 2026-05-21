// TROPTIONS Exchange OS — On-the-Spot XRPL IOU Mint API
// POST /exchange-os/api/xrpl/mint
// Builds an unsigned XRPL Payment transaction for IOU issuance.
// The issuer signs with Xaman/XRPL Toolkit — NO private keys here.

import { NextRequest, NextResponse } from "next/server";
import { xrplReadQuery } from "@/lib/exchange-os/xrpl/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const XRPL_ADDR_RE = /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/;

/** Encode a currency ticker to XRPL 40-char hex if > 3 chars */
function encodeCurrency(currency: string): string {
  const trimmed = currency.trim().toUpperCase();
  if (trimmed.length <= 3) return trimmed;
  // If already 40-char hex, return as-is
  if (trimmed.length === 40 && /^[0-9A-F]+$/.test(trimmed)) return trimmed;
  // ASCII encode padded to 20 bytes (40 hex chars)
  const buf = Buffer.alloc(20, 0);
  Buffer.from(trimmed, "ascii").copy(buf);
  return buf.toString("hex").toUpperCase();
}

function toHexString(str: string): string {
  return Buffer.from(str, "utf8").toString("hex").toUpperCase();
}

interface RawTrustLine {
  account: string;
  currency: string;
  balance: string;
  limit: string;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { issuer, currency, amount, recipient, memo } = body as {
    issuer?: string;
    currency?: string;
    amount?: string | number;
    recipient?: string;
    memo?: string;
  };

  // Validate required fields
  if (!issuer || !XRPL_ADDR_RE.test(issuer))
    return NextResponse.json({ error: "Invalid issuer address" }, { status: 400 });
  if (!recipient || !XRPL_ADDR_RE.test(recipient))
    return NextResponse.json({ error: "Invalid recipient address" }, { status: 400 });
  if (!currency || typeof currency !== "string" || currency.trim().length === 0)
    return NextResponse.json({ error: "currency required" }, { status: 400 });
  const numAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount ?? 0);
  if (!amount || isNaN(numAmount) || numAmount <= 0)
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });

  const encodedCurrency = encodeCurrency(currency);

  try {
    // Fetch issuer account info (for Sequence) + recipient trustlines in parallel
    const [accountInfo, linesResult, ledgerResult] = await Promise.all([
      xrplReadQuery("account_info", { account: issuer, ledger_index: "current" }),
      xrplReadQuery("account_lines", { account: recipient, peer: issuer, ledger_index: "current" }),
      xrplReadQuery("ledger_current", {}),
    ]);

    const sequence = (accountInfo as { account_data?: { Sequence?: number } })
      ?.account_data?.Sequence ?? null;
    const currentLedger = (ledgerResult as { ledger_current_index?: number })
      ?.ledger_current_index ?? null;

    const lines: RawTrustLine[] = (linesResult as { lines?: RawTrustLine[] })?.lines ?? [];
    const hasTrustline = lines.some(
      (l) =>
        l.currency.toUpperCase() === encodedCurrency.toUpperCase() &&
        l.account === issuer
    );

    // Build unsigned XRPL Payment transaction (IOU issuance)
    const txJson: Record<string, unknown> = {
      TransactionType: "Payment",
      Account: issuer,
      Destination: recipient,
      Amount: {
        currency: encodedCurrency,
        issuer,
        value: numAmount.toString(),
      },
      Fee: "12",
      Flags: 0,
      Sequence: sequence,
      LastLedgerSequence: currentLedger ? currentLedger + 50 : undefined,
    };

    if (memo) {
      txJson.Memos = [
        {
          Memo: {
            MemoData: toHexString(memo),
            MemoType: toHexString("text/plain"),
          },
        },
      ];
    }

    // Trust-set template for recipient (if they need to set up trustline first)
    const trustSetTemplate = {
      TransactionType: "TrustSet",
      Account: recipient,
      LimitAmount: {
        currency: encodedCurrency,
        issuer,
        value: "1000000000",
      },
      Flags: 0x00020000, // tfSetNoRipple
    };

    return NextResponse.json({
      tx: txJson,
      hasTrustline,
      trustlineWarning: !hasTrustline
        ? `Recipient has not set a trustline for ${currency.trim().toUpperCase()} (issuer: ${issuer}). Share the TrustSet template below — they must sign it first.`
        : null,
      trustSetTemplate: hasTrustline ? undefined : trustSetTemplate,
      encodedCurrency,
      hint: "Sign txJson with Xaman / XRPL Toolkit / xrpl-dev-tools. This is an IOU Payment — the amount is minted from the issuer account.",
      steps: [
        "1. Recipient: Sign trustSetTemplate (TrustSet) if trustline not yet set",
        "2. Issuer: Sign txJson (Payment) to mint tokens to recipient",
        "3. Both transactions broadcast automatically on signing",
      ],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
