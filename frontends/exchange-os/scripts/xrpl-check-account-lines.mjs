#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {
    account: "",
    asset: "USDC",
    issuerClass: "official",
    rpc: "https://s1.ripple.com:51234/",
    allowlist: path.join(__dirname, "config", "xrpl-asset-allowlist.json"),
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--account" && argv[i + 1]) args.account = argv[++i];
    else if (cur === "--asset" && argv[i + 1]) args.asset = argv[++i].toUpperCase();
    else if (cur === "--issuer-class" && argv[i + 1]) args.issuerClass = argv[++i].toLowerCase();
    else if (cur === "--rpc" && argv[i + 1]) args.rpc = argv[++i];
    else if (cur === "--allowlist" && argv[i + 1]) args.allowlist = argv[++i];
    else if (cur === "--json") args.json = true;
  }

  return args;
}

function decodeCurrency(currency) {
  if (!currency) return "";
  if (/^[A-Z0-9]{3}$/.test(currency)) return currency;
  if (!/^[0-9A-Fa-f]{40}$/.test(currency)) return currency;
  const bytes = currency.match(/.{2}/g)?.map((h) => Number.parseInt(h, 16)) ?? [];
  return bytes.filter((b) => b !== 0).map((b) => String.fromCharCode(b)).join("") || currency;
}

async function callRpc(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (data?.result?.error) throw new Error(`RPC ${data.result.error}: ${data.result.error_message || ""}`.trim());
  return data.result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.account) {
    console.error("Usage: node scripts/xrpl-check-account-lines.mjs --account <XRPL_ADDRESS> [--asset USDC] [--issuer-class official|internal|any] [--json]");
    process.exit(1);
  }

  const allowlist = JSON.parse(fs.readFileSync(args.allowlist, "utf8"));
  const assetCfg = allowlist.assets.find((a) => a.symbol === args.asset);
  if (!assetCfg) {
    console.error(`Asset ${args.asset} not found in allowlist ${args.allowlist}`);
    process.exit(1);
  }

  const approvedIssuers = (assetCfg.approvedIssuers || []).filter((i) => args.issuerClass === "any" || i.class === args.issuerClass);
  const issuerSet = new Set(approvedIssuers.map((i) => i.address));

  const result = await callRpc(args.rpc, {
    method: "account_lines",
    params: [{ account: args.account, ledger_index: "validated", limit: 400 }],
  });

  const lines = result.lines || [];
  const matches = lines.filter((line) => {
    const cur = decodeCurrency(line.currency);
    return cur === args.asset && issuerSet.has(line.account);
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    account: args.account,
    asset: args.asset,
    issuerClass: args.issuerClass,
    approvedIssuers: [...issuerSet],
    ledgerIndex: result.ledger_index || result.ledger_current_index,
    trustlineMatches: matches.map((m) => ({
      issuer: m.account,
      currency: m.currency,
      currencyDecoded: decodeCurrency(m.currency),
      balance: m.balance,
      limit: m.limit,
      limitPeer: m.limit_peer,
      noRipple: m.no_ripple,
      noRipplePeer: m.no_ripple_peer,
      freeze: m.freeze,
      freezePeer: m.freeze_peer,
    })),
    pass: matches.length > 0,
  };

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log("\nXRPL account_lines issuer check");
    console.log("=".repeat(72));
    console.log(`Account: ${payload.account}`);
    console.log(`Asset: ${payload.asset}`);
    console.log(`Issuer class: ${payload.issuerClass}`);
    console.log(`Ledger: ${payload.ledgerIndex}`);
    console.log(`Status: ${payload.pass ? "PASS" : "FAIL"}`);
    for (const m of payload.trustlineMatches) {
      console.log(`  - issuer=${m.issuer} currency=${m.currencyDecoded} balance=${m.balance} limit=${m.limit}`);
    }
  }

  process.exit(payload.pass ? 0 : 2);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
