import { NextResponse } from "next/server";
import { Client } from "xrpl";

interface TrustLine {
  currency: unknown;
  balance: unknown;
  limit: unknown;
  account: unknown;
}

export async function POST(req: Request) {
  let body: { address?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { address } = body;
  if (!address || typeof address !== "string" || !address.startsWith("r")) {
    return NextResponse.json({ ok: false, error: "Valid XRPL address required (starts with r)" }, { status: 400 });
  }

  const client = new Client(process.env.XRPL_NODE || "wss://xrplcluster.com");
  try {
    await client.connect();

    const [accountResp, linesResp] = await Promise.all([
      client.request({ command: "account_info", account: address, ledger_index: "validated" }),
      client.request({ command: "account_lines", account: address, ledger_index: "validated" }),
    ]);

    const acct = accountResp.result.account_data;
    const lines = (linesResp.result.lines ?? []) as TrustLine[];

    return NextResponse.json({
      ok: true,
      address,
      xrpBalance: (Number(acct.Balance) / 1_000_000).toFixed(6),
      sequence: acct.Sequence,
      ownerCount: acct.OwnerCount,
      trustLines: lines.map((l) => ({
        currency: l.currency,
        balance: l.balance,
        limit: l.limit,
        issuer: l.account,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // Account not found on ledger is a normal 404-level outcome
    const status = message.includes("actNotFound") ? 404 : 422;
    return NextResponse.json({ ok: false, error: message, address }, { status });
  } finally {
    await client.disconnect().catch(() => {});
  }
}
