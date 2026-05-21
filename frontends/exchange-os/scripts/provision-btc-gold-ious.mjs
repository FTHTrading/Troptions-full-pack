#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/provision-btc-gold-ious.mjs
 *
 * REAL MAINNET IOU PROVISIONING — issues Bitcoin and Gold proof IOUs
 * from the existing Troptions Gateway issuer/distributor wallets on
 * both XRPL and Stellar mainnet.
 *
 * Mints 4 assets (2 BTC IOUs + 2 Gold IOUs = 2 per chain per underlying):
 *   BTCA  — Bitcoin IOU Tranche A  ($100M Deal Series A)
 *   BTCB  — Bitcoin IOU Tranche B  (Second project / Deal Series B)
 *   XAUA  — Gold IOU Tranche A     ($100M Deal Series A, gold component)
 *   XAUB  — Gold IOU Tranche B     (Second project, gold component)
 *
 * XRPL currency hex codes (20-byte non-standard):
 *   BTCA → 4254434100000000000000000000000000000000
 *   BTCB → 4254434200000000000000000000000000000000
 *   XAUA → 5841554100000000000000000000000000000000
 *   XAUB → 5841554200000000000000000000000000000000
 *
 * Uses the SAME issuer / distributor wallets as TROPTIONS:
 *   XRPL Issuer:       rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ
 *   XRPL Distributor:  rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt
 *   Stellar Issuer:    GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4
 *   Stellar Dist:      GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC
 *
 * NOTE: Stellar issuer has auth_required + auth_clawback_enabled.
 * Each Stellar asset requires:
 *   1. Distributor opens ChangeTrust
 *   2. Issuer calls SetTrustLineFlags (authorize) on distributor
 *   3. Issuer sends Payment to distributor
 *
 * XRPL reserve note:
 *   Each new trustline on XRPL requires 2 XRP reserve on the distributor.
 *   4 new assets × 2 XRP = 8 XRP additional reserve needed.
 *   Ensure the distributor account holds sufficient XRP before executing.
 *
 * Safety design:
 *   • Dry-run by default — NO transactions until --execute flag.
 *   • Per-chain: --xrpl-only, --stellar-only, --skip-xrpl, --skip-stellar.
 *   • Per-asset: --skip-btca, --skip-btcb, --skip-xaua, --skip-xaub.
 *   • Audit log appended to data/treasury-funding-log.json.
 *
 * REQUIRED ENV VARS (in .env.local):
 *   XRPL_ISSUER_SEED         — seed for rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ
 *   XRPL_DISTRIBUTOR_SEED    — seed for rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt
 *   STELLAR_ISSUER_SECRET    — secret for GB4FHG...
 *   STELLAR_DISTRIBUTOR_SECRET — secret for GBH4YY...
 *
 * USAGE:
 *   node scripts/provision-btc-gold-ious.mjs                        # dry-run (safe)
 *   node scripts/provision-btc-gold-ious.mjs --network=mainnet --execute
 *   node scripts/provision-btc-gold-ious.mjs --xrpl-only --execute
 *   node scripts/provision-btc-gold-ious.mjs --stellar-only --execute
 *   node scripts/provision-btc-gold-ious.mjs --skip-btca --skip-btcb --execute
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xrpl from "xrpl";
import * as StellarSdk from "@stellar/stellar-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ─── Load .env.local ─────────────────────────────────────────────────────────────
function loadEnvLocal() {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const txt = fs.readFileSync(envPath, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

// ─── CLI flags ───────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function flagValue(name, fallback) {
  const pref = `--${name}=`;
  const hit = args.find((a) => a.startsWith(pref));
  return hit ? hit.slice(pref.length) : fallback;
}
const F = {
  execute:       args.includes("--execute"),
  network:       flagValue("network", "testnet"),
  xrplOnly:      args.includes("--xrpl-only"),
  stellarOnly:   args.includes("--stellar-only"),
  skipXrpl:      args.includes("--skip-xrpl"),
  skipStellar:   args.includes("--skip-stellar"),
  skipBtca:      args.includes("--skip-btca"),
  skipBtcb:      args.includes("--skip-btcb"),
  skipXaua:      args.includes("--skip-xaua"),
  skipXaub:      args.includes("--skip-xaub"),
};

// ─── Account addresses (canonical — verified against seeds before any submit) ───
const XRPL_ISSUER_ADDR      = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
const XRPL_DISTRIBUTOR_ADDR = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
const STELLAR_ISSUER_ADDR   = "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4";
const STELLAR_DIST_ADDR     = "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC";

const DOMAIN = "troptions.org";

// ─── Asset definitions ───────────────────────────────────────────────────────────
const ASSETS = [
  {
    id:           "BTCA",
    name:         "Bitcoin IOU — Tranche A",
    xrplHex:      "4254434100000000000000000000000000000000",
    stellarCode:  "BTCA",
    supply:       "100000000",
    trustLimit:   "1000000000",
    skip:         () => F.skipBtca,
    metadataUrl:  `https://${DOMAIN}/troptions/asset-metadata/btca.iou.v1.json`,
    dealRef:      "TROPTIONS-BTC-DEAL-100M-2026",
  },
  {
    id:           "BTCB",
    name:         "Bitcoin IOU — Tranche B",
    xrplHex:      "4254434200000000000000000000000000000000",
    stellarCode:  "BTCB",
    supply:       "100000000",
    trustLimit:   "1000000000",
    skip:         () => F.skipBtcb,
    metadataUrl:  `https://${DOMAIN}/troptions/asset-metadata/btcb.iou.v1.json`,
    dealRef:      "TROPTIONS-BTC-DEAL-SERIES-B-2026",
  },
  {
    id:           "XAUA",
    name:         "Gold IOU — Tranche A",
    xrplHex:      "5841554100000000000000000000000000000000",
    stellarCode:  "XAUA",
    supply:       "100000000",
    trustLimit:   "1000000000",
    skip:         () => F.skipXaua,
    metadataUrl:  `https://${DOMAIN}/troptions/asset-metadata/xaua.iou.v1.json`,
    dealRef:      "TROPTIONS-XAU-DEAL-100M-2026",
  },
  {
    id:           "XAUB",
    name:         "Gold IOU — Tranche B",
    xrplHex:      "5841554200000000000000000000000000000000",
    stellarCode:  "XAUB",
    supply:       "100000000",
    trustLimit:   "1000000000",
    skip:         () => F.skipXaub,
    metadataUrl:  `https://${DOMAIN}/troptions/asset-metadata/xaub.iou.v1.json`,
    dealRef:      "TROPTIONS-XAU-DEAL-SERIES-B-2026",
  },
];

// ─── Audit log ───────────────────────────────────────────────────────────────────
const logEntries = [];
function logEv(entry) {
  logEntries.push({ timestamp: new Date().toISOString(), op: "provision-iou", ...entry });
}
function persistLog() {
  if (logEntries.length === 0) return;
  const logDir = path.join(REPO_ROOT, "data");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, "treasury-funding-log.json");
  let existing = [];
  if (fs.existsSync(logPath)) {
    try { existing = JSON.parse(fs.readFileSync(logPath, "utf8")); } catch { existing = []; }
  }
  fs.writeFileSync(logPath, JSON.stringify([...existing, ...logEntries], null, 2));
  console.log(`\n📝 Audit log appended: ${path.relative(REPO_ROOT, logPath)}`);
}

// ─── Header ──────────────────────────────────────────────────────────────────────
function printHeader() {
  const assetsActive = ASSETS.filter((a) => !a.skip()).map((a) => a.id);
  console.log("═".repeat(78));
  console.log("  TROPTIONS BTC + GOLD IOU PROVISIONING");
  console.log("═".repeat(78));
  console.log(`  Mode:       ${F.execute ? "🚀 EXECUTE (MAINNET REAL TRANSACTIONS)" : "🛡️  DRY-RUN (no submit)"}`);
  console.log(`  Network:    ${F.network}`);
  console.log(`  XRPL:       ${F.skipXrpl || F.stellarOnly ? "skipped" : "enabled"}`);
  console.log(`  Stellar:    ${F.skipStellar || F.xrplOnly ? "skipped" : "enabled"}`);
  console.log(`  Assets:     ${assetsActive.join(", ")} (${assetsActive.length} active)`);
  console.log(`  Domain:     ${DOMAIN}`);
  if (F.execute) {
    console.log();
    console.log("  ⚠️  REAL MAINNET TRANSACTIONS WILL BE SUBMITTED.");
    console.log("  ⚠️  Ensure XRPL distributor has ≥8 XRP free (4 new trustlines × 2 XRP each).");
  }
  console.log("═".repeat(78));
  console.log();
}

// ─── Network endpoints ───────────────────────────────────────────────────────────
const XRPL_ENDPOINT_MAINNET    = "wss://xrplcluster.com";
const XRPL_ENDPOINT_TESTNET    = "wss://s.altnet.rippletest.net:51233";
const STELLAR_ENDPOINT_MAINNET = "https://horizon.stellar.org";
const STELLAR_ENDPOINT_TESTNET = "https://horizon-testnet.stellar.org";

function xrplEndpoint()       { return F.network === "mainnet" ? XRPL_ENDPOINT_MAINNET : XRPL_ENDPOINT_TESTNET; }
function stellarEndpoint()    { return F.network === "mainnet" ? STELLAR_ENDPOINT_MAINNET : STELLAR_ENDPOINT_TESTNET; }
function stellarPassphrase()  { return F.network === "mainnet" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET; }

// ─── XRPL submit helper ──────────────────────────────────────────────────────────
async function xrplSubmit(client, wallet, tx, label) {
  console.log(`    [${label}] preparing ${tx.TransactionType}...`);
  if (!F.execute) {
    console.log(`    [DRY-RUN] would submit ${tx.TransactionType}`);
    logEv({ chain: "xrpl", mode: "dry-run", label, tx: tx.TransactionType, status: "simulated" });
    return { ok: true, dryRun: true };
  }
  try {
    const prepared = await client.autofill(tx);
    const signed   = wallet.sign(prepared);
    const result   = await client.submitAndWait(signed.tx_blob);
    const meta     = result.result.meta;
    const txResult =
      typeof meta === "object" && meta !== null && "TransactionResult" in meta
        ? meta.TransactionResult
        : "unknown";
    const ok = txResult === "tesSUCCESS";
    console.log(`    ${ok ? "✅" : "❌"} ${txResult}  hash=${result.result.hash}`);
    logEv({
      chain: "xrpl", mode: "execute", label,
      tx: tx.TransactionType, status: ok ? "success" : "failed",
      txResult, hash: result.result.hash,
    });
    return { ok, hash: result.result.hash, txResult };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`    ❌ error: ${msg}`);
    logEv({ chain: "xrpl", mode: "execute", label, tx: tx.TransactionType, status: "error", error: msg });
    return { ok: false, error: msg };
  }
}

// ─── Stellar submit helper ───────────────────────────────────────────────────────
async function stellarSubmit(server, kp, opBuilder, label, memo) {
  console.log(`    [${label}] preparing transaction...`);
  if (!F.execute) {
    console.log(`    [DRY-RUN] would submit ${label}`);
    logEv({ chain: "stellar", mode: "dry-run", label, status: "simulated" });
    return { ok: true, dryRun: true };
  }
  try {
    const fresh = await server.loadAccount(kp.publicKey());
    const fee   = await server.fetchBaseFee();
    const builder = new StellarSdk.TransactionBuilder(fresh, {
      fee:              fee.toString(),
      networkPassphrase: stellarPassphrase(),
    }).setTimeout(60);
    if (memo) builder.addMemo(StellarSdk.Memo.text(memo));
    const tx = opBuilder(builder).build();
    tx.sign(kp);
    const result = await server.submitTransaction(tx);
    console.log(`    ✅ ledger=${result.ledger}  hash=${result.hash}`);
    logEv({ chain: "stellar", mode: "execute", label, status: "success", hash: result.hash, ledger: result.ledger });
    return { ok: true, hash: result.hash, ledger: result.ledger };
  } catch (err) {
    const msg =
      err && err.response && err.response.data
        ? JSON.stringify(err.response.data.extras || err.response.data)
        : err instanceof Error ? err.message : String(err);
    console.log(`    ❌ error: ${msg}`);
    logEv({ chain: "stellar", mode: "execute", label, status: "error", error: msg });
    return { ok: false, error: msg };
  }
}

// ─── XRPL provisioning ───────────────────────────────────────────────────────────
async function provisionXrpl() {
  const issuerSeed = process.env.XRPL_ISSUER_SEED;
  const distSeed   = process.env.XRPL_DISTRIBUTOR_SEED;

  if (!issuerSeed || !distSeed) {
    console.log("❌ XRPL_ISSUER_SEED or XRPL_DISTRIBUTOR_SEED not set — skipping XRPL.");
    if (!F.execute) console.log("   (dry-run: proceeding with simulated operations)");
    if (F.execute) return;
  }

  const issuer = issuerSeed ? xrpl.Wallet.fromSeed(issuerSeed) : { classicAddress: XRPL_ISSUER_ADDR };
  const dist   = distSeed   ? xrpl.Wallet.fromSeed(distSeed)   : { classicAddress: XRPL_DISTRIBUTOR_ADDR };

  if (issuerSeed && issuer.classicAddress !== XRPL_ISSUER_ADDR) {
    console.log(`❌ XRPL_ISSUER_SEED derives to ${issuer.classicAddress}, expected ${XRPL_ISSUER_ADDR}. Aborting XRPL.`);
    return;
  }
  if (distSeed && dist.classicAddress !== XRPL_DISTRIBUTOR_ADDR) {
    console.log(`❌ XRPL_DISTRIBUTOR_SEED derives to ${dist.classicAddress}, expected ${XRPL_DISTRIBUTOR_ADDR}. Aborting XRPL.`);
    return;
  }

  console.log("─── XRPL ───────────────────────────────────────────────────────────────");
  console.log(`  Issuer:      ${XRPL_ISSUER_ADDR}`);
  console.log(`  Distributor: ${XRPL_DISTRIBUTOR_ADDR}`);
  console.log(`  Endpoint:    ${xrplEndpoint()}`);

  const client = new xrpl.Client(xrplEndpoint());
  await client.connect();

  try {
    for (const asset of ASSETS) {
      if (asset.skip()) {
        console.log(`\n  ⏭️  Skipping ${asset.id} (--skip-${asset.id.toLowerCase()})`);
        continue;
      }

      console.log(`\n  ── Asset: ${asset.id} — ${asset.name}`);
      console.log(`     Hex:   ${asset.xrplHex}`);

      // Step 1: Distributor opens trustline
      console.log(`\n  → TrustSet: distributor opens ${asset.id} trustline`);
      await xrplSubmit(client, dist, {
        TransactionType: "TrustSet",
        Account: dist.classicAddress,
        LimitAmount: {
          currency: asset.xrplHex,
          issuer: issuer.classicAddress,
          value: asset.trustLimit,
        },
        Memos: [{
          Memo: {
            MemoData: Buffer.from(asset.dealRef, "utf8").toString("hex").toUpperCase(),
            MemoType: Buffer.from("deal-reference", "utf8").toString("hex").toUpperCase(),
          },
        }],
      }, `${asset.id.toLowerCase()}-xrpl-trustset`);

      // Step 2: Issuer sends supply to distributor
      console.log(`\n  → Payment: issuer issues ${asset.supply} ${asset.id} → distributor`);
      await xrplSubmit(client, issuer, {
        TransactionType: "Payment",
        Account: issuer.classicAddress,
        Destination: dist.classicAddress,
        Amount: {
          currency: asset.xrplHex,
          issuer: issuer.classicAddress,
          value: asset.supply,
        },
        Memos: [{
          Memo: {
            MemoData: Buffer.from(asset.metadataUrl, "utf8").toString("hex").toUpperCase(),
            MemoType: Buffer.from("metadata-url", "utf8").toString("hex").toUpperCase(),
          },
        }],
      }, `${asset.id.toLowerCase()}-xrpl-issue`);
    }
  } finally {
    await client.disconnect();
  }
}

// ─── Stellar provisioning ────────────────────────────────────────────────────────
async function provisionStellar() {
  const issuerSecret = process.env.STELLAR_ISSUER_SECRET;
  const distSecret   = process.env.STELLAR_DISTRIBUTOR_SECRET;

  if (!issuerSecret || !distSecret) {
    console.log("❌ STELLAR_ISSUER_SECRET or STELLAR_DISTRIBUTOR_SECRET not set — skipping Stellar.");
    if (!F.execute) console.log("   (dry-run: proceeding with simulated operations)");
    if (F.execute) return;
  }

  const issuerKp = issuerSecret ? StellarSdk.Keypair.fromSecret(issuerSecret) : null;
  const distKp   = distSecret   ? StellarSdk.Keypair.fromSecret(distSecret)   : null;

  if (issuerKp && issuerKp.publicKey() !== STELLAR_ISSUER_ADDR) {
    console.log(`❌ STELLAR_ISSUER_SECRET derives to ${issuerKp.publicKey()}, expected ${STELLAR_ISSUER_ADDR}. Aborting Stellar.`);
    return;
  }
  if (distKp && distKp.publicKey() !== STELLAR_DIST_ADDR) {
    console.log(`❌ STELLAR_DISTRIBUTOR_SECRET derives to ${distKp.publicKey()}, expected ${STELLAR_DIST_ADDR}. Aborting Stellar.`);
    return;
  }

  console.log("\n─── Stellar ────────────────────────────────────────────────────────────");
  console.log(`  Issuer:      ${STELLAR_ISSUER_ADDR}`);
  console.log(`  Distributor: ${STELLAR_DIST_ADDR}`);
  console.log(`  Endpoint:    ${stellarEndpoint()}`);
  console.log("  Note: issuer has auth_required — each asset requires 3 operations");

  const server = new StellarSdk.Horizon.Server(stellarEndpoint());

  for (const asset of ASSETS) {
    if (asset.skip()) {
      console.log(`\n  ⏭️  Skipping ${asset.id} (--skip-${asset.id.toLowerCase()})`);
      continue;
    }

    const stellarAsset = new StellarSdk.Asset(asset.stellarCode, STELLAR_ISSUER_ADDR);
    console.log(`\n  ── Asset: ${asset.id} — ${asset.name}`);
    console.log(`     Code:  ${asset.stellarCode}`);

    // Step 1: Distributor opens ChangeTrust (opens trustline)
    console.log(`\n  → ChangeTrust: distributor opens ${asset.id} trustline`);
    await stellarSubmit(
      server,
      distKp ?? { publicKey: () => STELLAR_DIST_ADDR, sign: () => { throw new Error("no key"); } },
      (builder) =>
        builder.addOperation(
          StellarSdk.Operation.changeTrust({
            asset:  stellarAsset,
            limit:  asset.trustLimit,
          })
        ),
      `${asset.id.toLowerCase()}-stellar-changetrust`,
      asset.dealRef.slice(0, 28),
    );

    // Step 2: Issuer authorizes the distributor's trustline (auth_required is set)
    console.log(`\n  → SetTrustLineFlags: issuer authorizes distributor for ${asset.id}`);
    await stellarSubmit(
      server,
      issuerKp ?? { publicKey: () => STELLAR_ISSUER_ADDR, sign: () => { throw new Error("no key"); } },
      (builder) =>
        builder.addOperation(
          StellarSdk.Operation.setTrustLineFlags({
            trustor:    STELLAR_DIST_ADDR,
            asset:      stellarAsset,
            flags: {
              authorized:                      true,
              authorizedToMaintainLiabilities: false,
            },
          })
        ),
      `${asset.id.toLowerCase()}-stellar-authorize`,
      `AUTH-${asset.id}`,
    );

    // Step 3: Issuer sends supply payment to distributor
    console.log(`\n  → Payment: issuer issues ${asset.supply} ${asset.id} → distributor`);
    await stellarSubmit(
      server,
      issuerKp ?? { publicKey: () => STELLAR_ISSUER_ADDR, sign: () => { throw new Error("no key"); } },
      (builder) =>
        builder.addOperation(
          StellarSdk.Operation.payment({
            destination: STELLAR_DIST_ADDR,
            asset:       stellarAsset,
            amount:      asset.supply,
          })
        ),
      `${asset.id.toLowerCase()}-stellar-issue`,
      `ISSUE-${asset.id}`,
    );
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────────
async function main() {
  printHeader();

  if (!F.execute) {
    console.log("  ℹ️  DRY-RUN mode. Add --execute to submit real transactions.");
    console.log("  ℹ️  Add --network=mainnet for mainnet.");
    console.log();
  }

  const runXrpl    = !F.skipXrpl    && !F.stellarOnly;
  const runStellar = !F.skipStellar && !F.xrplOnly;

  if (runXrpl) {
    await provisionXrpl();
  } else {
    console.log("─── XRPL: skipped ──────────────────────────────────────────────────────");
  }

  if (runStellar) {
    await provisionStellar();
  } else {
    console.log("─── Stellar: skipped ────────────────────────────────────────────────────");
  }

  persistLog();

  console.log();
  console.log("═".repeat(78));
  const dryLabel = F.execute ? "MAINNET EXECUTION" : "DRY-RUN";
  const activeAssets = ASSETS.filter((a) => !a.skip()).map((a) => a.id).join(", ");
  console.log(`  ✅  ${dryLabel} COMPLETE`);
  console.log(`  Assets: ${activeAssets}`);
  if (!F.execute) {
    console.log();
    console.log("  To mint on mainnet:");
    console.log("    node scripts/provision-btc-gold-ious.mjs --network=mainnet --execute");
  }
  console.log("═".repeat(78));
}

main().catch((err) => {
  console.error("Fatal:", err);
  persistLog();
  process.exit(1);
});
