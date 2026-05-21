#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/xrpl-check-create.mjs
 *
 * Creates an XRPL CheckCreate transaction for an IOU trust-line asset (e.g. USDC).
 * NOTE: XRPL native EscrowCreate only supports XRP. For issued currencies (IOUs),
 *       CheckCreate is the correct atomic-lock mechanism — it creates an on-chain
 *       redeemable check object that the destination can cash or that the sender
 *       can cancel after expiry.
 *
 * USAGE (dry-run default):
 *   node scripts/xrpl-check-create.mjs \
 *     --destination <rXXX> \
 *     --amount 175000000 \
 *     --asset USDC \
 *     --expiry-days 7
 *
 *   Add --execute to submit to mainnet.
 *   Add --json to emit machine-readable output.
 *   Add --out <file> to save JSON result.
 *
 * ENVIRONMENT (reads .env.local or .env.generated.local):
 *   XRPL_DISTRIBUTOR_SEED  — seed for rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt (holder wallet)
 *
 * XRPL CHECKCREATE MECHANICS:
 *   - Creates an immutable Check ledger object owned by the sender wallet
 *   - Destination can call CheckCash at any time before expiry to receive funds
 *   - Sender can call CheckCancel after Expiration to reclaim
 *   - Visible via account_objects?type=check on both sender and destination
 *   - Equivalent to: Aave flash loan proof + Ripple ODL atomic settlement
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xrpl from "xrpl";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT  = path.resolve(__dirname, "..");

// ─── XRPL mainnet endpoints ──────────────────────────────────────────────────
const RPCS = ["wss://xrplcluster.com", "wss://s1.ripple.com"];

// ─── Holder (distributor) wallet holding the 175M USDC ──────────────────────
const HOLDER_ADDRESS = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";

// ─── Asset config ────────────────────────────────────────────────────────────
const ASSET_MAP = {
  USDC: {
    currency: "5553444300000000000000000000000000000000",
    issuer:   "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  },
  USDT: {
    currency: "5553445400000000000000000000000000000000",
    issuer:   "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  },
  EURC: {
    currency: "4555524300000000000000000000000000000000",
    issuer:   "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
  },
};

// ─── Load env files ──────────────────────────────────────────────────────────
function loadEnv() {
  const candidates = [
    path.join(REPO_ROOT, ".env.generated.local"),
    path.join(REPO_ROOT, ".env.local"),
  ];
  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    const txt = fs.readFileSync(envPath, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

// ─── CLI parsing ─────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const cfg = {
    destination: "",
    amount:      "175000000",
    asset:       "USDC",
    expiryDays:  7,
    execute:     false,
    json:        false,
    out:         "",
    rpcs:        [...RPCS],
  };
  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--destination"  && argv[i + 1]) cfg.destination  = argv[++i];
    else if (cur === "--amount"  && argv[i + 1]) cfg.amount       = argv[++i];
    else if (cur === "--asset"   && argv[i + 1]) cfg.asset        = argv[++i].toUpperCase();
    else if (cur === "--expiry-days" && argv[i + 1]) cfg.expiryDays = Number(argv[++i]);
    else if (cur === "--rpc"     && argv[i + 1]) cfg.rpcs         = argv[++i].split(",").map(v => v.trim());
    else if (cur === "--out"     && argv[i + 1]) cfg.out          = argv[++i];
    else if (cur === "--execute") cfg.execute = true;
    else if (cur === "--json")    cfg.json    = true;
  }
  return cfg;
}

// ─── Connect with fallback ────────────────────────────────────────────────────
async function connectClient(rpcs) {
  for (const rpc of rpcs) {
    const client = new xrpl.Client(rpc);
    try {
      await client.connect();
      return client;
    } catch {
      // try next
    }
  }
  throw new Error("All XRPL RPC endpoints unreachable");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const cfg = parseArgs(process.argv.slice(2));

  if (!cfg.json) {
    console.log("\nXRPL CheckCreate — IOU Atomic Lock");
    console.log("=".repeat(72));
    console.log(`Asset      : ${cfg.asset}`);
    console.log(`Amount     : ${Number(cfg.amount).toLocaleString()} ${cfg.asset}`);
    console.log(`Destination: ${cfg.destination || "(NOT SET — use --destination <rXXX>)"}`);
    console.log(`Expiry     : ${cfg.expiryDays} days`);
    console.log(`Mode       : ${cfg.execute ? "EXECUTE (MAINNET)" : "DRY-RUN"}`);
    console.log("=".repeat(72));
  }

  // Validate
  if (!cfg.destination) {
    const err = "ERROR: --destination <rXXXX> is required. Provide the counterparty's XRPL address.";
    if (cfg.json) { console.log(JSON.stringify({ ok: false, error: err })); }
    else { console.error(err); }
    process.exit(1);
  }

  const assetDef = ASSET_MAP[cfg.asset];
  if (!assetDef) {
    const err = `ERROR: Unknown asset '${cfg.asset}'. Valid: ${Object.keys(ASSET_MAP).join(", ")}`;
    if (cfg.json) { console.log(JSON.stringify({ ok: false, error: err })); }
    else { console.error(err); }
    process.exit(1);
  }

  const seed = process.env.XRPL_DISTRIBUTOR_SEED;
  if (!seed) {
    const err = "ERROR: XRPL_DISTRIBUTOR_SEED not found in .env.generated.local / .env.local";
    if (cfg.json) { console.log(JSON.stringify({ ok: false, error: err })); }
    else { console.error(err); }
    process.exit(1);
  }

  // Build expiry (Ripple epoch = Unix - 946684800)
  const RIPPLE_EPOCH = 946684800;
  const expiryUnix   = Math.floor(Date.now() / 1000) + cfg.expiryDays * 86400;
  const expiryRipple = expiryUnix - RIPPLE_EPOCH;

  // CheckCreate tx template
  const wallet   = xrpl.Wallet.fromSeed(seed);
  const checkTx  = {
    TransactionType: "CheckCreate",
    Account:         wallet.address,
    Destination:     cfg.destination,
    SendMax: {
      currency: assetDef.currency,
      issuer:   assetDef.issuer,
      value:    cfg.amount,
    },
    Expiration: expiryRipple,
  };

  if (!cfg.json) {
    console.log("\nTransaction template:");
    console.log(JSON.stringify(checkTx, null, 2));
  }

  if (!cfg.execute) {
    const dryResult = {
      ok: true,
      mode: "dry-run",
      account: wallet.address,
      destination: cfg.destination,
      sendMax: checkTx.SendMax,
      expirationUnix: expiryUnix,
      expirationISO: new Date(expiryUnix * 1000).toISOString(),
      note: "Pass --execute to submit this transaction to XRPL mainnet.",
    };
    if (cfg.json) {
      console.log(JSON.stringify(dryResult, null, 2));
    } else {
      console.log("\n[DRY-RUN] Transaction NOT submitted. Pass --execute to go live.");
      console.log(`Wallet     : ${wallet.address}`);
      console.log(`Send Max   : ${cfg.amount} ${cfg.asset}`);
      console.log(`Expiry     : ${new Date(expiryUnix * 1000).toISOString()}`);
    }
    return;
  }

  // Execute on mainnet
  if (!cfg.json) console.log("\nConnecting to XRPL mainnet...");
  const client = await connectClient(cfg.rpcs);

  let result;
  try {
    const prepared = await client.autofill(checkTx);
    const signed   = wallet.sign(prepared);

    if (!cfg.json) {
      console.log(`\nSigned TX hash : ${signed.hash}`);
      console.log("Submitting...");
    }

    const response = await client.submitAndWait(signed.tx_blob);
    const meta     = response.result?.meta;
    const txResult = typeof meta === "object" && meta !== null
      ? meta.TransactionResult
      : response.result?.engine_result ?? "UNKNOWN";

    const checkID = (() => {
      if (typeof meta === "object" && meta !== null && Array.isArray(meta.AffectedNodes)) {
        for (const node of meta.AffectedNodes) {
          const created = node.CreatedNode;
          if (created?.LedgerEntryType === "Check") {
            return created.LedgerIndex ?? null;
          }
        }
      }
      return null;
    })();

    result = {
      ok:             txResult === "tesSUCCESS",
      txResult,
      txHash:         signed.hash,
      checkID,
      account:        wallet.address,
      destination:    cfg.destination,
      asset:          cfg.asset,
      sendMax:        cfg.amount,
      expirationISO:  new Date(expiryUnix * 1000).toISOString(),
      ledger:         response.result?.ledger_index ?? null,
      timestamp:      new Date().toISOString(),
      xrplScanUrl:    `https://xrpscan.com/tx/${signed.hash}`,
    };

    if (!cfg.json) {
      const status = result.ok ? "✅ tesSUCCESS" : `❌ ${txResult}`;
      console.log(`\nResult     : ${status}`);
      console.log(`TX Hash    : ${signed.hash}`);
      console.log(`Check ID   : ${checkID ?? "(parse from meta)"}`);
      console.log(`Expiry     : ${result.expirationISO}`);
      console.log(`XRPL Scan  : ${result.xrplScanUrl}`);
      console.log(`\nCounterparty can verify at:`);
      console.log(`  https://xrpscan.com/account/${cfg.destination}`);
      console.log(`  POST https://s1.ripple.com:51234/ method:account_objects type:check account:${cfg.destination}`);
    }

  } finally {
    await client.disconnect();
  }

  if (cfg.json) {
    console.log(JSON.stringify(result, null, 2));
  }

  if (cfg.out && result) {
    const outDir = path.dirname(path.resolve(cfg.out));
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(cfg.out, JSON.stringify(result, null, 2));
    if (!cfg.json) console.log(`\nSaved to: ${cfg.out}`);
  }

  if (result && !result.ok) process.exit(1);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
