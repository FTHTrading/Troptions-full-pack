import { NextResponse } from "next/server";
import {
  createTransferIntent,
  generateWalletReceipt,
  type TroptionsTransferType,
} from "@/lib/troptions/troptionsWalletHubEngine";

function hasSecretFields(input: unknown): boolean {
  const text = JSON.stringify(input ?? {});
  return /(seed|privateKey|mnemonic|secretKey)/i.test(text);
}

export async function POST(request: Request) {
  let body: {
    transferIntent?: {
      fromWalletId?: string;
      toWalletId?: string;
      assetCode?: string;
      amount?: string;
      memo?: string;
      routeType?: TroptionsTransferType;
    };
    liveTxHash?: string;
  } = {};

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (hasSecretFields(body)) {
    return NextResponse.json(
      { ok: false, error: "Secret fields are not accepted by wallet-hub APIs." },
      { status: 400 },
    );
  }

  const ti = body.transferIntent;
  const intent = createTransferIntent({
    fromWalletId: ti?.fromWalletId ?? "",
    toWalletId: ti?.toWalletId ?? "",
    assetCode: ti?.assetCode ?? "",
    amount: ti?.amount ?? "0",
    memo: ti?.memo,
    routeType: ti?.routeType ?? "INTERNAL_LEDGER_TRANSFER",
    liveRequested: Boolean(body.liveTxHash),
  });

  const receipt = generateWalletReceipt({ intent, liveTxHash: body.liveTxHash });

  return NextResponse.json({
    ok: true,
    printableReceipt: receipt,
    note: receipt.liveTxHash
      ? "Receipt contains live transaction hash."
      : "Receipt is simulation-only until liveTxHash is supplied.",
  });
}
