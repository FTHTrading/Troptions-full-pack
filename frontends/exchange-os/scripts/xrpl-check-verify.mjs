#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/xrpl-check-verify.mjs
 *
 * Queries XRPL mainnet for existing Check objects on a wallet.
 * Used to verify that a CheckCreate was submitted and remains uncashed.
 *
 * USAGE:
 *   node scripts/xrpl-check-verify.mjs --account rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt
 *   node scripts/xrpl-check-verify.mjs --account rNX4... --json
 *   node scripts/xrpl-check-verify.mjs --account rNX4... --check-id <ledgerIndex>
 *
 * OUTPUT shows: check ID, SendMax (asset + amount), destination, expiration, status.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT  = path.resolve(__dirname, "..");

const DEFAULT_RPC = "https://s1.ripple.com:51234/";
const RIPPLE_EPOCH = 946684800;

// ─── Currency hex → ticker ────────────────────────────────────────────────────
const CURRENCY_TICKERS = {
  "5553444300000000000000000000000000000000": "USDC",
  "5553445400000000000000000000000000000000": "USDT",
  "4555524300000000000000000000000000000000": "EURC",
};

function decodeCurrency(hex) {
  if (!hex) return "";
  if (/^[A-Z0-9]{3}$/.test(hex)) return hex;
  return CURRENCY_TICKERS[hex.toUpperCase()] ?? hex;
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const cfg = {
    account:  "",
    checkId:  "",
    rpc:      DEFAULT_RPC,
    json:     false,
    out:      "",
  };
  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--account"  && argv[i + 1]) cfg.account  = argv[++i];
    else if (cur === "--check-id" && argv[i + 1]) cfg.checkId = argv[++i];
    else if (cur === "--rpc"  && argv[i + 1]) cfg.rpc     = argv[++i];
    else if (cur === "--out"  && argv[i + 1]) cfg.out     = argv[++i];
    else if (cur === "--json") cfg.json = true;
  }
  return cfg;
}

// ─── HTTP JSON-RPC helper ─────────────────────────────────────────────────────
async function rpcPost(url, body) {
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const json = await res.json();
  if (json.result?.error) throw new Error(`XRPL error: ${json.result.error} — ${json.result.error_message ?? ""}`);
  return json.result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const cfg = parseArgs(process.argv.slice(2));

  if (!cfg.account) {
    console.error("ERROR: --account <rXXXX> is required.");
    process.exit(1);
  }

  if (!cfg.json) {
    console.log("\nXRPL Check Object Verification");
    console.log("=".repeat(72));
    console.log(`Account : ${cfg.account}`);
    console.log(`RPC     : ${cfg.rpc}`);
    console.log("=".repeat(72));
  }

  // Fetch check objects
  const result = await rpcPost(cfg.rpc, {
    method: "account_objects",
    params: [{
      account:      cfg.account,
      type:         "check",
      ledger_index: "validated",
    }],
  });

  const nowRipple  = Math.floor(Date.now() / 1000) - RIPPLE_EPOCH;
  const objects    = result.account_objects ?? [];
  const ledger     = result.ledger_index ?? result.ledger_current_index;

  const checks = objects.map((obj) => {
    const sendMax    = obj.SendMax;
    const currency   = typeof sendMax === "object" ? decodeCurrency(sendMax.currency) : "XRP";
    const amount     = typeof sendMax === "object" ? sendMax.value : sendMax;
    const issuer     = typeof sendMax === "object" ? sendMax.issuer : null;
    const expRipple  = obj.Expiration ?? null;
    const expUnix    = expRipple ? expRipple + RIPPLE_EPOCH : null;
    const expISO     = expUnix ? new Date(expUnix * 1000).toISOString() : null;
    const expired    = expRipple ? nowRipple > expRipple : false;

    return {
      checkID:     obj.index,
      account:     obj.Account,
      destination: obj.Destination,
      currency,
      amount,
      issuer,
      expirationISO: expISO,
      expired,
      cashable:    !expired,
      xrplScanUrl: `https://xrpscan.com/ledger-entry/${obj.index}`,
    };
  });

  // Filter by check-id if provided
  const filtered = cfg.checkId
    ? checks.filter((c) => c.checkID?.toLowerCase() === cfg.checkId.toLowerCase())
    : checks;

  const output = {
    ok:          true,
    account:     cfg.account,
    ledgerIndex: ledger,
    timestamp:   new Date().toISOString(),
    checkCount:  filtered.length,
    checks:      filtered,
  };

  if (cfg.json) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(`\nLedger index : ${ledger}`);
    console.log(`Check objects: ${filtered.length}`);

    if (filtered.length === 0) {
      console.log("  (none — wallet has no pending Check objects)");
    } else {
      for (const c of filtered) {
        const status = c.expired ? "EXPIRED" : "CASHABLE ✅";
        console.log(`\n  Check ID    : ${c.checkID}`);
        console.log(`  Destination : ${c.destination}`);
        console.log(`  Amount      : ${Number(c.amount).toLocaleString()} ${c.currency}`);
        console.log(`  Issuer      : ${c.issuer ?? "XRP (native)"}`);
        console.log(`  Expiry      : ${c.expirationISO ?? "none"}`);
        console.log(`  Status      : ${status}`);
        console.log(`  XRPL Scan   : ${c.xrplScanUrl}`);
      }
    }
    console.log();
  }

  if (cfg.out) {
    const outDir = path.dirname(path.resolve(cfg.out));
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(cfg.out, JSON.stringify(output, null, 2));
    if (!cfg.json) console.log(`Saved to: ${cfg.out}`);
  }
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
