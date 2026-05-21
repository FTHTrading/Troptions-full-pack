import { MIN_ISSUER_XRP_FOR_BATCH, TROPTIONS_ISSUER } from "./walletRegistry";

export async function fetchIssuerBalanceXrp(
  address: string = TROPTIONS_ISSUER
): Promise<number | null> {
  try {
    const res = await fetch("https://xrplcluster.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_info",
        params: [{ account: address, ledger_index: "validated" }],
      }),
    });
    const data = (await res.json()) as {
      result?: { account_data?: { Balance?: string } };
    };
    const drops = data.result?.account_data?.Balance;
    if (!drops) return null;
    return parseInt(drops, 10) / 1_000_000;
  } catch {
    return null;
  }
}

export async function batchSafeToSubmit(opts: {
  mainnetEnabled: boolean;
  killSwitch: boolean;
}): Promise<{
  safeToSubmit: boolean;
  issuerBalanceXrp: number | null;
  reasons: string[];
}> {
  const reasons: string[] = [];
  if (opts.killSwitch) reasons.push("Kill switch armed");
  if (!opts.mainnetEnabled) reasons.push("XRPL mainnet writes disabled in Exchange OS");
  const bal = await fetchIssuerBalanceXrp();
  if (bal === null) reasons.push("Could not read issuer balance");
  else if (bal < MIN_ISSUER_XRP_FOR_BATCH) {
    reasons.push(`Issuer ${TROPTIONS_ISSUER} has ${bal.toFixed(2)} XRP (need ≥${MIN_ISSUER_XRP_FOR_BATCH})`);
  }
  const safeToSubmit =
    opts.mainnetEnabled &&
    !opts.killSwitch &&
    bal !== null &&
    bal >= MIN_ISSUER_XRP_FOR_BATCH;
  if (!safeToSubmit) {
    reasons.push("Enable mainnet + fund issuer before live batch submit");
  }
  return {
    safeToSubmit,
    issuerBalanceXrp: bal,
    reasons,
  };
}
