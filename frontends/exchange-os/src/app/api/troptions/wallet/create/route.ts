import { NextResponse } from "next/server";
import { createWalletAccount } from "@/lib/troptions/walletAccountEngine";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userId?: string;
    handle?: string;
    displayName?: string;
    accountLabel?: string;
    accountType?: "personal" | "institutional" | "treasury" | "test";
  };

  if (!body.userId || !body.handle || !body.displayName) {
    return NextResponse.json(
      { ok: false, error: "userId, handle, and displayName are required" },
      { status: 400 }
    );
  }

  const result = createWalletAccount({
    userId: body.userId,
    handle: body.handle,
    displayName: body.displayName,
    accountLabel: body.accountLabel ?? `${body.displayName} Wallet`,
    accountType: body.accountType ?? "personal",
  });

  return NextResponse.json({ ok: true, simulationOnly: true, result });
}