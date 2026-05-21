import { NextResponse } from "next/server";
import {
  createTransferIntent,
  simulateTransfer,
  validateTransferIntent,
  type TroptionsTransferType,
} from "@/lib/troptions/troptionsWalletHubEngine";

type SimulateRequest = {
  fromWalletId?: string;
  toWalletId?: string;
  assetCode?: string;
  amount?: string;
  memo?: string;
  routeType?: TroptionsTransferType;
  liveRequested?: boolean;
};

function hasSecretFields(input: unknown): boolean {
  const text = JSON.stringify(input ?? {});
  return /(seed|privateKey|mnemonic|secretKey)/i.test(text);
}

export async function POST(request: Request) {
  let body: SimulateRequest = {};
  try {
    body = (await request.json()) as SimulateRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (hasSecretFields(body)) {
    return NextResponse.json(
      { ok: false, error: "Secret fields are not accepted by wallet-hub APIs." },
      { status: 400 },
    );
  }

  const intent = createTransferIntent({
    fromWalletId: body.fromWalletId ?? "",
    toWalletId: body.toWalletId ?? "",
    assetCode: body.assetCode ?? "",
    amount: body.amount ?? "0",
    memo: body.memo,
    routeType: body.routeType ?? "INTERNAL_LEDGER_TRANSFER",
    liveRequested: body.liveRequested ?? false,
  });

  const validation = validateTransferIntent(intent);
  const simulated = simulateTransfer(intent);

  return NextResponse.json({
    ok: true,
    transferIntent: simulated,
    validation,
    simulatedDebitCredit: simulated.simulatedDelta ?? null,
    blockedReasons: simulated.blockedReasons,
    requiredApprovals: simulated.requiredApprovals,
    liveTransaction: null,
  });
}
