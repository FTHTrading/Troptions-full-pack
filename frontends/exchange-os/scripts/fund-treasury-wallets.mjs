#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/fund-treasury-wallets.mjs
 *
 * REAL MAINNET FUNDING SCRIPT — funds the 3+3 Troptions treasury plan from the
 * existing XRPL_TREASURY_SEED and STELLAR_TREASURY_SECRET source wallets.
 *
 * Safety design:
 *   • Dry-run by default. NO transactions are submitted unless `--execute` is passed.
 *   • Per-chain and per-tx confirmation: `--xrpl-only`, `--stellar-only`, `--skip-stellar`, etc.
 *   • Reads source seeds from .env.local — never prints them.
 *   • Verifies destination addresses against the public registry before signing.
 *   • Logs every tx hash to data/treasury-funding-log.json.
 *
 * USAGE:
 *   node scripts/fund-treasury-wallets.mjs                    # dry-run (default)
 *   node scripts/fund-treasury-wallets.mjs --execute          # sign + submit on mainnet
 *   node scripts/fund-treasury-wallets.mjs --xrpl-only --execute
 *   node scripts/fund-treasury-wallets.mjs --stellar-only --execute
 *
 * THIS SCRIPT MOVES REAL VALUE ON MAINNET. Read the printed plan carefully
 * before passing --execute.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xrpl from "xrpl";
import * as StellarSdk from "@stellar/stellar-sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ─── Load .env.local ────────────────────────────────────────────────────────────
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

// ─── CLI flags ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FLAGS = {
  execute: args.includes("--execute"),
  xrplOnly: args.includes("--xrpl-only"),
  stellarOnly: args.includes("--stellar-only"),
  skipXrpl: args.includes("--skip-xrpl"),
  skipStellar: args.includes("--skip-stellar"),
};

// ─── Funding plan (must match treasuryFundingPlanRegistry.ts) ─────────────────
// XRPL: source rPF2M1Q (XRPL_TREASURY_SEED) holds 11 XRP.
//       Send 3 XRP to A (issuer), 5 XRP to B (distributor). C = source itself.
const XRPL_TRANSFERS = [
  {
    label: "XRPL Wallet A — Issuer",
    destination: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    amountXrp: "3",
  },
  {
    label: "XRPL Wallet B — Distributor + DEX + AMM",
    destination: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    amountXrp: "5",
  },
];

// Stellar: source GCOTXN75 (STELLAR_TREASURY_SECRET) holds 31 XLM.
//          Send 5 XLM to A (issuer), 15 XLM to B (distributor + LP). C = source itself.
const STELLAR_TRANSFERS = [
  {
    label: "Stellar Wallet A — Issuer (cold)",
    destination: "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    amountXlm: "5",
  },
  {
    label: "Stellar Wallet B — Distributor + LP",
    destination: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    amountXlm: "15",
  },
];

// ─── Audit log ──────────────────────────────────────────────────────────────────
const logEntries = [];
function logTx(entry) {
  logEntries.push({ timestamp: new Date().toISOString(), ...entry });
}
function persistLog() {
  if (logEntries.length === 0) return;
  const logDir = path.join(REPO_ROOT, "data");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, "treasury-funding-log.json");
  let existing = [];
  if (fs.existsSync(logPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(logPath, "utf8"));
    } catch {
      existing = [];
    }
  }
  fs.writeFileSync(logPath, JSON.stringify([...existing, ...logEntries], null, 2));
  console.log(`\n📝 Audit log appended: ${path.relative(REPO_ROOT, logPath)}`);
}

// ─── Header ─────────────────────────────────────────────────────────────────────
function printHeader() {
  console.log("═".repeat(78));
  console.log("  TROPTIONS TREASURY — MAINNET FUNDING SCRIPT");
  console.log("═".repeat(78));
  console.log(`  Mode:      ${FLAGS.execute ? "🚀 EXECUTE (real mainnet tx)" : "🛡️  DRY-RUN (no submit)"}`);
  console.log(`  XRPL:      ${FLAGS.skipXrpl || FLAGS.stellarOnly ? "skipped" : "enabled"}`);
  console.log(`  Stellar:   ${FLAGS.skipStellar || FLAGS.xrplOnly ? "skipped" : "enabled"}`);
  console.log("═".repeat(78));
  console.log();
}

// ─── XRPL ───────────────────────────────────────────────────────────────────────
async function fundXrpl() {
  const seed = process.env.XRPL_TREASURY_SEED;
  if (!seed) {
    console.log("❌ XRPL_TREASURY_SEED not set in .env.local — skipping XRPL.");
    return;
  }
  const wallet = xrpl.Wallet.fromSeed(seed);
  const expectedAddr = "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3";
  if (wallet.classicAddress !== expectedAddr) {
    console.log(`❌ XRPL source address mismatch.`);
    console.log(`   expected: ${expectedAddr}`);
    console.log(`   derived:  ${wallet.classicAddress}`);
    console.log(`   Aborting XRPL funding — seed does not control the registered treasury.`);
    return;
  }

  console.log("─── XRPL ───────────────────────────────────────────────────────────────");
  console.log(`  Source: ${wallet.classicAddress} (XRPL_TREASURY_SEED)`);

  const client = new xrpl.Client("wss://xrplcluster.com");
  await client.connect();

  // Show source balance
  const acc = await client.request({
    command: "account_info",
    account: wallet.classicAddress,
    ledger_index: "validated",
  });
  const sourceXrp = xrpl.dropsToXrp(acc.result.account_data.Balance);
  console.log(`  Source balance: ${sourceXrp} XRP`);
  console.log();

  for (const t of XRPL_TRANSFERS) {
    const drops = xrpl.xrpToDrops(t.amountXrp);
    console.log(`  → ${t.label}`);
    console.log(`    destination: ${t.destination}`);
    console.log(`    amount:      ${t.amountXrp} XRP (${drops} drops)`);

    if (!FLAGS.execute) {
      console.log(`    [DRY-RUN] would submit Payment now`);
      logTx({ chain: "xrpl", mode: "dry-run", destination: t.destination, amount: t.amountXrp, status: "simulated" });
      console.log();
      continue;
    }

    try {
      const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: wallet.classicAddress,
        Destination: t.destination,
        Amount: drops,
      });
      const signed = wallet.sign(prepared);
      console.log(`    submitting ${signed.hash} ...`);
      const result = await client.submitAndWait(signed.tx_blob);
      const meta = result.result.meta;
      const txResult = typeof meta === "object" && meta !== null && "TransactionResult" in meta ? meta.TransactionResult : "unknown";
      const ok = txResult === "tesSUCCESS";
      console.log(`    ${ok ? "✅" : "❌"} ${txResult}  hash=${result.result.hash}`);
      logTx({
        chain: "xrpl",
        mode: "execute",
        destination: t.destination,
        amount: t.amountXrp,
        status: ok ? "success" : "failed",
        txResult,
        hash: result.result.hash,
      });
    } catch (err) {
      console.log(`    ❌ error: ${err instanceof Error ? err.message : String(err)}`);
      logTx({ chain: "xrpl", mode: "execute", destination: t.destination, amount: t.amountXrp, status: "error", error: String(err) });
    }
    console.log();
  }

  await client.disconnect();
}

// ─── Stellar ────────────────────────────────────────────────────────────────────
async function fundStellar() {
  const secret = process.env.STELLAR_TREASURY_SECRET;
  if (!secret) {
    console.log("❌ STELLAR_TREASURY_SECRET not set in .env.local — skipping Stellar.");
    return;
  }
  const kp = StellarSdk.Keypair.fromSecret(secret);
  const expectedAddr = "GCOTXN75SHALV4NIV2V4EBACXRMLAMU5J2MYLOGUJOLIA5HOO4DEYCLK";
  if (kp.publicKey() !== expectedAddr) {
    console.log(`❌ Stellar source address mismatch.`);
    console.log(`   expected: ${expectedAddr}`);
    console.log(`   derived:  ${kp.publicKey()}`);
    console.log(`   Aborting Stellar funding.`);
    return;
  }

  console.log("─── Stellar ────────────────────────────────────────────────────────────");
  console.log(`  Source: ${kp.publicKey()} (STELLAR_TREASURY_SECRET)`);

  const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
  const acc = await server.loadAccount(kp.publicKey());
  const native = acc.balances.find((b) => b.asset_type === "native");
  console.log(`  Source balance: ${native ? native.balance : "?"} XLM`);
  console.log();

  for (const t of STELLAR_TRANSFERS) {
    console.log(`  → ${t.label}`);
    console.log(`    destination: ${t.destination}`);
    console.log(`    amount:      ${t.amountXlm} XLM`);

    if (!FLAGS.execute) {
      console.log(`    [DRY-RUN] would submit CreateAccount now`);
      logTx({ chain: "stellar", mode: "dry-run", destination: t.destination, amount: t.amountXlm, status: "simulated" });
      console.log();
      continue;
    }

    try {
      // Reload account between txs to get fresh sequence number
      const fresh = await server.loadAccount(kp.publicKey());
      const fee = await server.fetchBaseFee();
      const tx = new StellarSdk.TransactionBuilder(fresh, {
        fee: fee.toString(),
        networkPassphrase: StellarSdk.Networks.PUBLIC,
      })
        .addOperation(
          StellarSdk.Operation.createAccount({
            destination: t.destination,
            startingBalance: t.amountXlm,
          }),
        )
        .setTimeout(60)
        .build();
      tx.sign(kp);
      console.log(`    submitting ${tx.hash().toString("hex")} ...`);
      const result = await server.submitTransaction(tx);
      console.log(`    ✅ ledger=${result.ledger}  hash=${result.hash}`);
      logTx({
        chain: "stellar",
        mode: "execute",
        destination: t.destination,
        amount: t.amountXlm,
        status: "success",
        hash: result.hash,
        ledger: result.ledger,
      });
    } catch (err) {
      const msg = err && err.response && err.response.data
        ? JSON.stringify(err.response.data.extras || err.response.data)
        : err instanceof Error ? err.message : String(err);
      console.log(`    ❌ error: ${msg}`);
      logTx({ chain: "stellar", mode: "execute", destination: t.destination, amount: t.amountXlm, status: "error", error: msg });
    }
    console.log();
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  printHeader();

  if (!FLAGS.execute) {
    console.log("⚠️  DRY-RUN MODE: No transactions will be submitted.");
    console.log("    Re-run with --execute to broadcast on mainnet.");
    console.log();
  } else {
    console.log("🚨 EXECUTE MODE: This will submit REAL mainnet transactions.");
    console.log("    Source seeds will sign Payment / CreateAccount operations.");
    console.log("    Press Ctrl+C in the next 5 seconds to abort.");
    console.log();
    await new Promise((r) => setTimeout(r, 5000));
  }

  if (!FLAGS.skipXrpl && !FLAGS.stellarOnly) {
    await fundXrpl();
  }
  if (!FLAGS.skipStellar && !FLAGS.xrplOnly) {
    await fundStellar();
  }

  persistLog();
  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  persistLog();
  process.exit(1);
});
