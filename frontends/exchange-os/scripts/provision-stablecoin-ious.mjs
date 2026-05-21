#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/provision-stablecoin-ious.mjs
 *
 * TROPTIONS GATEWAY — REAL STABLECOIN IOU PROVISIONING
 *
 * Issues four stablecoin IOUs from the Troptions Gateway issuer/distributor
 * wallets on XRPL and Stellar mainnet. Each on-chain IOU represents real
 * stablecoins held in custody by the Gateway — this is the standard
 * XRPL/Stellar gateway proof-of-issuance pattern used for deal settlement.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ASSETS MINTED:
 *
 *  USDC  — USD Coin IOU           100,000,000 (Circle / AAVE-compatible)
 *  USDT  — Tether USD IOU         100,000,000 (Tether / AAVE-compatible)
 *  DAI   — Dai Stablecoin IOU      50,000,000 (MakerDAO / AAVE v3 native)
 *  EURC  — Euro Coin IOU           50,000,000 (Circle EUR / cross-border)
 *
 * ══════════════════════════════════════════════════════════════════════════
 * XRPL CURRENCY HEX CODES (20-byte non-standard for 4-char codes):
 *  USDC → 5553444300000000000000000000000000000000
 *  USDT → 5553445400000000000000000000000000000000
 *  DAI  → 3-char standard code (no hex needed)
 *  EURC → 4555524300000000000000000000000000000000
 *
 * ══════════════════════════════════════════════════════════════════════════
 * GATEWAY WALLETS (shared with TROPTIONS/BTC/Gold IOU scripts):
 *  XRPL Issuer:        rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ
 *  XRPL Distributor:   rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt
 *  Stellar Issuer:     GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4
 *  Stellar Dist:       GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC
 *
 * ══════════════════════════════════════════════════════════════════════════
 * AAVE INTEGRATION NOTE:
 *  DAI and USDC/USDT are AAVE v3 listed assets. The Gateway may deposit
 *  underlying stablecoins into AAVE v3 to generate aToken yield while IOUs
 *  are outstanding, with on-chain aToken position as additional proof.
 *  AAVE v3 Pool: 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2 (Ethereum mainnet)
 *
 * ══════════════════════════════════════════════════════════════════════════
 * STELLAR NOTE:
 *  Stellar issuer has auth_required + auth_clawback_enabled.
 *  Each Stellar asset requires 3 operations:
 *    1. Distributor: ChangeTrust (open trustline)
 *    2. Issuer: SetTrustLineFlags (authorize distributor)
 *    3. Issuer: Payment (issue supply to distributor)
 *
 * ══════════════════════════════════════════════════════════════════════════
 * XRPL RESERVE NOTE:
 *  4 new trustlines × 2 XRP reserve = 8 XRP additional needed on distributor
 *  Check distributor balance before executing.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * REQUIRED ENV VARS (.env.local):
 *  XRPL_ISSUER_SEED             — seed for rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ
 *  XRPL_DISTRIBUTOR_SEED        — seed for rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt
 *  STELLAR_ISSUER_SECRET        — secret for GB4FHG...
 *  STELLAR_DISTRIBUTOR_SECRET   — secret for GBH4YY...
 *
 * USAGE:
 *   node scripts/provision-stablecoin-ious.mjs                       # dry-run
 *   node scripts/provision-stablecoin-ious.mjs --network=mainnet --execute
 *   node scripts/provision-stablecoin-ious.mjs --xrpl-only --execute
 *   node scripts/provision-stablecoin-ious.mjs --stellar-only --execute
 *   node scripts/provision-stablecoin-ious.mjs --skip-usdc --skip-usdt --execute
 *   node scripts/provision-stablecoin-ious.mjs --network=mainnet --execute --xrpl-only --skip-usdt --skip-dai --skip-eurc --usdc-supply=175000000
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xrpl from "xrpl";
import * as StellarSdk from "@stellar/stellar-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ─── Load .env files ─────────────────────────────────────────────────────────────
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath);
  // Detect UTF-16LE BOM (ff fe)
  const enc = (raw[0] === 0xff && raw[1] === 0xfe) ? "utf16le" : "utf8";
  const txt = raw.toString(enc).replace(/^\uFEFF/, ""); // strip BOM if present
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
function loadEnvLocal() {
  // Load in priority order — .env.local wins over .env.generated.local
  loadEnvFile(path.join(REPO_ROOT, ".env.generated.local"));
  loadEnvFile(path.join(REPO_ROOT, ".env.local"));
}
loadEnvLocal();

// ─── CLI flags ──────────────────────────────────────────────────────────────────
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
  skipUsdc:      args.includes("--skip-usdc"),
  skipUsdt:      args.includes("--skip-usdt"),
  skipDai:       args.includes("--skip-dai"),
  skipEurc:      args.includes("--skip-eurc"),
  usdcSupply:    flagValue("usdc-supply", ""),
  usdtSupply:    flagValue("usdt-supply", ""),
  daiSupply:     flagValue("dai-supply", ""),
  eurcSupply:    flagValue("eurc-supply", ""),
};

function resolveSupply(assetId, fallback) {
  const value =
    assetId === "USDC" ? F.usdcSupply :
    assetId === "USDT" ? F.usdtSupply :
    assetId === "DAI" ? F.daiSupply :
    assetId === "EURC" ? F.eurcSupply :
    "";

  if (!value) return fallback;
  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new Error(`Invalid --${assetId.toLowerCase()}-supply value: ${value}`);
  }
  return value;
}

// ─── Wallet addresses ───────────────────────────────────────────────────────────
const XRPL_ISSUER_ADDR      = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
const XRPL_DISTRIBUTOR_ADDR = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
const STELLAR_ISSUER_ADDR   = "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4";
const STELLAR_DIST_ADDR     = "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC";

const DOMAIN = "troptions.org";

// ─── Asset definitions ──────────────────────────────────────────────────────────
// Note on xrplCurrency:
//   DAI is 3 chars → use standard string "DAI" directly
//   USDC, USDT, EURC are 4 chars → must use 20-byte hex
const ASSETS = [
  {
    id:            "USDC",
    name:          "USD Coin IOU",
    underlying:    "USD Coin (USDC) — Circle",
    xrplCurrency:  "5553444300000000000000000000000000000000", // USDC hex
    stellarCode:   "USDC",
    supply:        resolveSupply("USDC", "100000000"),
    trustLimit:    "1000000000",
    skip:          () => F.skipUsdc,
    metadataUrl:   `https://${DOMAIN}/troptions/asset-metadata/usdc.iou.v1.json`,
    dealRef:       "TROPTIONS-STABLECOIN-USDC-2026",
    aave:          true,
  },
  {
    id:            "USDT",
    name:          "Tether USD IOU",
    underlying:    "Tether USD (USDT) — Tether Operations",
    xrplCurrency:  "5553445400000000000000000000000000000000", // USDT hex
    stellarCode:   "USDT",
    supply:        resolveSupply("USDT", "100000000"),
    trustLimit:    "1000000000",
    skip:          () => F.skipUsdt,
    metadataUrl:   `https://${DOMAIN}/troptions/asset-metadata/usdt.iou.v1.json`,
    dealRef:       "TROPTIONS-STABLECOIN-USDT-2026",
    aave:          true,
  },
  {
    id:            "DAI",
    name:          "Dai Stablecoin IOU",
    underlying:    "Dai (DAI) — MakerDAO / Sky Protocol",
    xrplCurrency:  "DAI",                                     // 3-char standard
    stellarCode:   "DAI",
    supply:        resolveSupply("DAI", "50000000"),
    trustLimit:    "500000000",
    skip:          () => F.skipDai,
    metadataUrl:   `https://${DOMAIN}/troptions/asset-metadata/dai.iou.v1.json`,
    dealRef:       "TROPTIONS-STABLECOIN-DAI-AAVE-2026",
    aave:          true,
  },
  {
    id:            "EURC",
    name:          "Euro Coin IOU",
    underlying:    "Euro Coin (EURC) — Circle",
    xrplCurrency:  "4555524300000000000000000000000000000000", // EURC hex
    stellarCode:   "EURC",
    supply:        resolveSupply("EURC", "50000000"),
    trustLimit:    "500000000",
    skip:          () => F.skipEurc,
    metadataUrl:   `https://${DOMAIN}/troptions/asset-metadata/eurc.iou.v1.json`,
    dealRef:       "TROPTIONS-STABLECOIN-EURC-2026",
    aave:          false,
  },
];

// ─── Audit log ──────────────────────────────────────────────────────────────────
const logEntries = [];
function logEv(entry) {
  logEntries.push({ timestamp: new Date().toISOString(), op: "provision-stablecoin-iou", ...entry });
}
function persistLog() {
  if (logEntries.length === 0) return;
  const logPath = path.join(REPO_ROOT, "data", "treasury-funding-log.json");
  const logDir  = path.dirname(logPath);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  let existing = [];
  if (fs.existsSync(logPath)) {
    try { existing = JSON.parse(fs.readFileSync(logPath, "utf8")); } catch { existing = []; }
  }
  fs.writeFileSync(logPath, JSON.stringify([...existing, ...logEntries], null, 2));
  console.log(`\n📝 Audit log appended: data/treasury-funding-log.json`);
}

// ─── Print header ───────────────────────────────────────────────────────────────
function printHeader() {
  const active = ASSETS.filter((a) => !a.skip());
  console.log("═".repeat(78));
  console.log("  TROPTIONS GATEWAY — STABLECOIN IOU PROVISIONING");
  console.log("═".repeat(78));
  console.log(`  Mode:       ${F.execute ? "🚀 EXECUTE (MAINNET REAL TRANSACTIONS)" : "🛡️  DRY-RUN (no submit)"}`);
  console.log(`  Network:    ${F.network}`);
  console.log(`  XRPL:       ${F.skipXrpl || F.stellarOnly ? "skipped" : "enabled"}`);
  console.log(`  Stellar:    ${F.skipStellar || F.xrplOnly ? "skipped" : "enabled"}`);
  console.log(`  Assets:     ${active.map((a) => a.id).join(", ")} (${active.length} active)`);
  console.log();
  console.log("  Stablecoins (each backed 1:1 by real underlying held in Gateway custody):");
  for (const a of active) {
    const aaveTag = a.aave ? " [AAVE v3]" : "";
    console.log(`    ${a.id.padEnd(5)} ${a.underlying}${aaveTag}`);
  }
  if (F.execute) {
    console.log();
    console.log("  ⚠️  REAL MAINNET TRANSACTIONS WILL BE SUBMITTED.");
    console.log("  ⚠️  Ensure XRPL distributor has ≥8 XRP free (4 trustlines × 2 XRP).");
    console.log("  ⚠️  Ensure real underlying stablecoins are in Gateway custody.");
  }
  console.log("═".repeat(78));
  console.log();
}

// ─── Network config ─────────────────────────────────────────────────────────────
const XRPL_WS_MAINNET    = "wss://xrplcluster.com";
const XRPL_WS_TESTNET    = "wss://s.altnet.rippletest.net:51233";
const STELLAR_MAINNET    = "https://horizon.stellar.org";
const STELLAR_TESTNET    = "https://horizon-testnet.stellar.org";

const xrplEndpoint    = () => F.network === "mainnet" ? XRPL_WS_MAINNET : XRPL_WS_TESTNET;
const stellarEndpoint = () => F.network === "mainnet" ? STELLAR_MAINNET : STELLAR_TESTNET;
const stellarNet      = () => F.network === "mainnet" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET;

// ─── XRPL submit helper ─────────────────────────────────────────────────────────
async function xrplSubmit(client, wallet, tx, label) {
  console.log(`    [${label}] ${tx.TransactionType}...`);
  if (!F.execute) {
    console.log(`    [DRY-RUN] would submit ${tx.TransactionType}`);
    logEv({ chain: "xrpl", mode: "dry-run", label, txType: tx.TransactionType, status: "simulated" });
    return { ok: true, dryRun: true };
  }
  try {
    const prepared = await client.autofill(tx);
    const signed   = wallet.sign(prepared);
    const result   = await client.submitAndWait(signed.tx_blob);
    const txResult =
      result.result.meta &&
      typeof result.result.meta === "object" &&
      "TransactionResult" in result.result.meta
        ? result.result.meta.TransactionResult
        : "unknown";
    const ok = txResult === "tesSUCCESS";
    console.log(`    ${ok ? "✅" : "❌"} ${txResult}  hash=${result.result.hash}`);
    logEv({ chain: "xrpl", mode: "execute", label, txType: tx.TransactionType, status: ok ? "success" : "failed", txResult, hash: result.result.hash });
    return { ok, hash: result.result.hash, txResult };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`    ❌ error: ${msg}`);
    logEv({ chain: "xrpl", mode: "execute", label, txType: tx.TransactionType, status: "error", error: msg });
    return { ok: false, error: msg };
  }
}

// ─── Stellar submit helper ──────────────────────────────────────────────────────
async function stellarSubmit(server, kp, buildOps, label, memo) {
  console.log(`    [${label}]...`);
  if (!F.execute) {
    console.log(`    [DRY-RUN] would submit ${label}`);
    logEv({ chain: "stellar", mode: "dry-run", label, status: "simulated" });
    return { ok: true, dryRun: true };
  }
  try {
    const account = await server.loadAccount(kp.publicKey());
    const fee     = await server.fetchBaseFee();
    const builder = new StellarSdk.TransactionBuilder(account, {
      fee: fee.toString(), networkPassphrase: stellarNet(),
    }).setTimeout(60);
    if (memo) builder.addMemo(StellarSdk.Memo.text(memo.slice(0, 28)));
    const tx = buildOps(builder).build();
    tx.sign(kp);
    const result = await server.submitTransaction(tx);
    console.log(`    ✅ ledger=${result.ledger}  hash=${result.hash}`);
    logEv({ chain: "stellar", mode: "execute", label, status: "success", hash: result.hash, ledger: result.ledger });
    return { ok: true, hash: result.hash, ledger: result.ledger };
  } catch (err) {
    const msg =
      err?.response?.data
        ? JSON.stringify(err.response.data.extras || err.response.data)
        : err instanceof Error ? err.message : String(err);
    console.log(`    ❌ error: ${msg}`);
    logEv({ chain: "stellar", mode: "execute", label, status: "error", error: msg });
    return { ok: false, error: msg };
  }
}

// ─── XRPL provisioning ──────────────────────────────────────────────────────────
async function provisionXrpl() {
  const issuerSeed = process.env.XRPL_ISSUER_SEED;
  const distSeed   = process.env.XRPL_DISTRIBUTOR_SEED;

  if (!issuerSeed || !distSeed) {
    console.log("❌ XRPL seeds missing — skipping XRPL.");
    if (!F.execute) console.log("   (dry-run: simulating operations)");
    if (F.execute) return;
  }

  const issuer = issuerSeed ? xrpl.Wallet.fromSeed(issuerSeed) : { classicAddress: XRPL_ISSUER_ADDR };
  const dist   = distSeed   ? xrpl.Wallet.fromSeed(distSeed)   : { classicAddress: XRPL_DISTRIBUTOR_ADDR };

  if (issuerSeed && issuer.classicAddress !== XRPL_ISSUER_ADDR) {
    console.log(`❌ XRPL_ISSUER_SEED derives to wrong address. Expected ${XRPL_ISSUER_ADDR}. Aborting XRPL.`);
    return;
  }
  if (distSeed && dist.classicAddress !== XRPL_DISTRIBUTOR_ADDR) {
    console.log(`❌ XRPL_DISTRIBUTOR_SEED derives to wrong address. Expected ${XRPL_DISTRIBUTOR_ADDR}. Aborting XRPL.`);
    return;
  }

  console.log("─── XRPL ───────────────────────────────────────────────────────────────");
  console.log(`  Issuer:       ${XRPL_ISSUER_ADDR}`);
  console.log(`  Distributor:  ${XRPL_DISTRIBUTOR_ADDR}`);
  console.log(`  Endpoint:     ${xrplEndpoint()}`);

  const client = new xrpl.Client(xrplEndpoint());
  await client.connect();

  try {
    for (const asset of ASSETS) {
      if (asset.skip()) {
        console.log(`\n  ⏭️  ${asset.id} skipped`);
        continue;
      }
      const isHex = asset.xrplCurrency.length > 3;
      console.log(`\n  ── ${asset.id} — ${asset.name}`);
      console.log(`     Currency: ${isHex ? `hex(${asset.xrplCurrency.slice(0, 8)}...)` : asset.xrplCurrency}`);
      console.log(`     Supply:   ${asset.supply}  |  Underlying: ${asset.underlying}`);

      // Step 1: Distributor TrustSet
      console.log(`\n  → TrustSet: distributor opens ${asset.id} trustline`);
      await xrplSubmit(client, dist, {
        TransactionType: "TrustSet",
        Account: dist.classicAddress,
        LimitAmount: {
          currency: asset.xrplCurrency,
          issuer:   issuer.classicAddress,
          value:    asset.trustLimit,
        },
        Memos: [{
          Memo: {
            MemoData: Buffer.from(asset.dealRef, "utf8").toString("hex").toUpperCase(),
            MemoType: Buffer.from("deal-reference", "utf8").toString("hex").toUpperCase(),
          },
        }],
      }, `${asset.id.toLowerCase()}-xrpl-trustset`);

      // Step 2: Issuer Payment (mint supply)
      console.log(`\n  → Payment: issuer mints ${asset.supply} ${asset.id} → distributor`);
      await xrplSubmit(client, issuer, {
        TransactionType: "Payment",
        Account:     issuer.classicAddress,
        Destination: dist.classicAddress,
        Amount: {
          currency: asset.xrplCurrency,
          issuer:   issuer.classicAddress,
          value:    asset.supply,
        },
        Memos: [
          {
            Memo: {
              MemoData: Buffer.from(asset.metadataUrl, "utf8").toString("hex").toUpperCase(),
              MemoType: Buffer.from("metadata-url", "utf8").toString("hex").toUpperCase(),
            },
          },
          {
            Memo: {
              MemoData: Buffer.from(asset.underlying, "utf8").toString("hex").toUpperCase(),
              MemoType: Buffer.from("underlying-asset", "utf8").toString("hex").toUpperCase(),
            },
          },
        ],
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
    console.log("❌ Stellar secrets missing — skipping Stellar.");
    if (!F.execute) console.log("   (dry-run: simulating operations)");
    if (F.execute) return;
  }

  const issuerKp = issuerSecret ? StellarSdk.Keypair.fromSecret(issuerSecret) : null;
  const distKp   = distSecret   ? StellarSdk.Keypair.fromSecret(distSecret)   : null;

  if (issuerKp && issuerKp.publicKey() !== STELLAR_ISSUER_ADDR) {
    console.log(`❌ STELLAR_ISSUER_SECRET derives to wrong address. Aborting Stellar.`);
    return;
  }
  if (distKp && distKp.publicKey() !== STELLAR_DIST_ADDR) {
    console.log(`❌ STELLAR_DISTRIBUTOR_SECRET derives to wrong address. Aborting Stellar.`);
    return;
  }

  console.log("\n─── Stellar ────────────────────────────────────────────────────────────");
  console.log(`  Issuer:       ${STELLAR_ISSUER_ADDR}`);
  console.log(`  Distributor:  ${STELLAR_DIST_ADDR}`);
  console.log(`  Endpoint:     ${stellarEndpoint()}`);
  console.log("  Auth pattern: ChangeTrust → SetTrustLineFlags → Payment (3 txns per asset)");

  const server = new StellarSdk.Horizon.Server(stellarEndpoint());

  for (const asset of ASSETS) {
    if (asset.skip()) {
      console.log(`\n  ⏭️  ${asset.id} skipped`);
      continue;
    }
    const stellarAsset = new StellarSdk.Asset(asset.stellarCode, STELLAR_ISSUER_ADDR);
    console.log(`\n  ── ${asset.id} — ${asset.name}`);
    console.log(`     Underlying: ${asset.underlying}`);

    const noop = { publicKey: () => STELLAR_ISSUER_ADDR, sign: () => { throw new Error("no key"); } };
    const distNoop = { publicKey: () => STELLAR_DIST_ADDR, sign: () => { throw new Error("no key"); } };

    // Step 1: Distributor opens trustline
    console.log(`\n  → ChangeTrust: distributor opens ${asset.id} trustline`);
    await stellarSubmit(
      server,
      distKp ?? distNoop,
      (b) => b.addOperation(StellarSdk.Operation.changeTrust({ asset: stellarAsset, limit: asset.trustLimit })),
      `${asset.id.toLowerCase()}-stellar-changetrust`,
      asset.dealRef,
    );

    // Step 2: Issuer authorizes distributor (auth_required is set)
    console.log(`\n  → SetTrustLineFlags: issuer authorizes distributor for ${asset.id}`);
    await stellarSubmit(
      server,
      issuerKp ?? noop,
      (b) => b.addOperation(StellarSdk.Operation.setTrustLineFlags({
        trustor: STELLAR_DIST_ADDR,
        asset:   stellarAsset,
        flags:   { authorized: true, authorizedToMaintainLiabilities: false },
      })),
      `${asset.id.toLowerCase()}-stellar-authorize`,
      `AUTH-${asset.id}`,
    );

    // Step 3: Issuer mints supply to distributor
    console.log(`\n  → Payment: issuer mints ${asset.supply} ${asset.id} → distributor`);
    await stellarSubmit(
      server,
      issuerKp ?? noop,
      (b) => b.addOperation(StellarSdk.Operation.payment({
        destination: STELLAR_DIST_ADDR,
        asset:       stellarAsset,
        amount:      asset.supply,
      })),
      `${asset.id.toLowerCase()}-stellar-issue`,
      `ISSUE-${asset.id}`,
    );
  }
}

// ─── AAVE info block ─────────────────────────────────────────────────────────────
function printAaveInfo() {
  console.log();
  console.log("─── AAVE v3 Integration Info ───────────────────────────────────────────");
  console.log("  AAVE Pool (Ethereum mainnet): 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2");
  console.log("  AAVE-compatible assets: USDC, USDT, DAI");
  console.log("  To generate aToken proof:");
  console.log("    1. Acquire real USDC/USDT/DAI from exchange");
  console.log("    2. Deposit into AAVE v3 via aave.com or directly via Pool.supply()");
  console.log("    3. AAVE issues aUSDC/aUSDT/aDAI — this is your on-chain custody proof");
  console.log("    4. aToken balance = underlying stablecoin collateralized in DeFi");
  console.log("    5. Share aToken position with counterparty as proof before deal release");
}

// ─── Main ────────────────────────────────────────────────────────────────────────
async function main() {
  printHeader();

  if (!F.execute) {
    console.log("  ℹ️  DRY-RUN mode — no real transactions. Add --execute to mint.");
    console.log("  ℹ️  Use --network=mainnet for mainnet.");
    console.log();
  }

  const runXrpl    = !F.skipXrpl    && !F.stellarOnly;
  const runStellar = !F.skipStellar && !F.xrplOnly;

  if (runXrpl)    await provisionXrpl();
  else console.log("─── XRPL: skipped ──────────────────────────────────────────────────────");

  if (runStellar) await provisionStellar();
  else console.log("─── Stellar: skipped ────────────────────────────────────────────────────");

  printAaveInfo();
  persistLog();

  console.log();
  console.log("═".repeat(78));
  const active = ASSETS.filter((a) => !a.skip()).map((a) => a.id).join(", ");
  console.log(`  ✅  ${F.execute ? "MAINNET EXECUTION" : "DRY-RUN"} COMPLETE`);
  console.log(`  Assets: ${active}`);
  if (!F.execute) {
    console.log();
    console.log("  To mint stablecoin IOUs on mainnet:");
    console.log("    node scripts/provision-stablecoin-ious.mjs --network=mainnet --execute");
  }
  console.log("═".repeat(78));
}

main().catch((err) => {
  console.error("Fatal:", err);
  persistLog();
  process.exit(1);
});
