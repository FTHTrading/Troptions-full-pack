#!/usr/bin/env node
/**
 * seed-raydium-lp.mjs — Seed a Raydium CPMM pool for $GOATX (or any SPL token)
 *
 * Usage:
 *   node scripts/seed-raydium-lp.mjs                                  # dry-run preview
 *   node scripts/seed-raydium-lp.mjs --apply                          # LIVE: create pool on mainnet
 *   node scripts/seed-raydium-lp.mjs --apply --sol=5 --tokens=200_000_000
 *   node scripts/seed-raydium-lp.mjs --apply --wallet=PATH
 *
 * Defaults (the "Recommended" 5-SOL tier from goat.unykorn.org plan):
 *   SOL side    : 5 SOL
 *   GOATX side  : 200,000,000 (20 % of total supply)
 *   Fee tier    : 0.25 %  (Raydium CPMM standard "Pump-style")
 *
 * After pool creation, LP tokens land in the payer wallet. Lock them via
 * UNCX (https://app.uncx.network/lockers/solana) or Streamflow before tweeting.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getMint, getAssociatedTokenAddressSync, NATIVE_MINT, TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import { Raydium, TxVersion, CREATE_CPMM_POOL_PROGRAM, CREATE_CPMM_POOL_FEE_ACC, getCpmmPdaAmmConfigId } from "@raydium-io/raydium-sdk-v2";
import BN from "bn.js";

// ── Args ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const SKIP_CONFIRM = argv.includes("--yes");
const arg = (k, def) => {
  const a = argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : def;
};
const SOL_AMOUNT = parseFloat(arg("sol", "5"));
const TOKEN_AMOUNT = String(arg("tokens", "200000000")).replace(/_/g, "");
const TOKEN_MINT = arg("mint", "9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv");
const WALLET_PATH = arg("wallet", "C:\\Users\\Kevan\\.solana-launcher-wallets\\trust-wallet.json");
const RPC = arg("rpc", "https://api.mainnet-beta.solana.com");

const __dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dir, "..");

function loadKeypair() {
  if (!fs.existsSync(WALLET_PATH)) {
    console.error(`[FATAL] wallet not found: ${WALLET_PATH}`);
    process.exit(1);
  }
  const j = JSON.parse(fs.readFileSync(WALLET_PATH, "utf8"));
  const arr = Array.isArray(j) ? j : j.secretKey;
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

const fmt = (n) => Number(n).toLocaleString();

async function main() {
  const conn = new Connection(RPC, "confirmed");
  const owner = loadKeypair();

  console.log(`\n${"═".repeat(64)}`);
  console.log(`  Raydium CPMM Pool Seeder — Donk X / GoatX`);
  console.log(`  RPC      : ${RPC}`);
  console.log(`  Mode     : ${APPLY ? "[LIVE]" : "[DRY-RUN]"}`);
  console.log(`${"═".repeat(64)}\n`);

  console.log(`[wallet] payer: ${owner.publicKey.toBase58()}`);
  const solBal = await conn.getBalance(owner.publicKey);
  console.log(`[wallet] mainnet balance: ${(solBal / LAMPORTS_PER_SOL).toFixed(6)} SOL`);

  // ── Token side ────────────────────────────────────────────────────────────
  const mintPk = new PublicKey(TOKEN_MINT);
  const mintInfo = await getMint(conn, mintPk);
  const decimals = mintInfo.decimals;
  const tokenRaw = new BN(TOKEN_AMOUNT).mul(new BN(10).pow(new BN(decimals)));

  const ata = getAssociatedTokenAddressSync(mintPk, owner.publicKey, false, TOKEN_PROGRAM_ID);
  let tokenBal = "0";
  try {
    const acc = await getAccount(conn, ata);
    tokenBal = acc.amount.toString();
  } catch {
    /* ata missing */
  }

  console.log(`\n[token] mint     : ${mintPk.toBase58()}`);
  console.log(`[token] decimals : ${decimals}`);
  console.log(`[token] payer ATA: ${ata.toBase58()}`);
  console.log(`[token] payer bal: ${fmt(BigInt(tokenBal) / 10n ** BigInt(decimals))} ($GOATX whole units)`);

  // ── Quote side: WSOL ─────────────────────────────────────────────────────
  const solRaw = new BN(Math.floor(SOL_AMOUNT * LAMPORTS_PER_SOL));

  console.log(`\n[plan] base : ${fmt(TOKEN_AMOUNT)} $GOATX`);
  console.log(`[plan] quote: ${SOL_AMOUNT} SOL`);
  console.log(`[plan] init price: 1 SOL = ${fmt((Number(TOKEN_AMOUNT) / SOL_AMOUNT).toFixed(2))} GOATX`);
  console.log(`[plan]            1 GOATX = ${(SOL_AMOUNT / Number(TOKEN_AMOUNT)).toExponential(4)} SOL`);

  // Pre-flight balance checks
  const requiredSolLamports = solRaw.toNumber() + 0.05 * LAMPORTS_PER_SOL; // pool init ~0.03 SOL + fee buffer
  if (solBal < requiredSolLamports) {
    console.error(`\n[FATAL] insufficient SOL. need ≥ ${(requiredSolLamports / LAMPORTS_PER_SOL).toFixed(3)} SOL, have ${(solBal / LAMPORTS_PER_SOL).toFixed(6)}`);
    if (APPLY) process.exit(2);
  }
  if (BigInt(tokenBal) < BigInt(tokenRaw.toString())) {
    console.error(`\n[FATAL] insufficient $GOATX. need ${fmt(TOKEN_AMOUNT)}, have ${fmt(BigInt(tokenBal) / 10n ** BigInt(decimals))}`);
    if (APPLY) process.exit(2);
  }

  if (!APPLY) {
    console.log(`\n[DRY-RUN] no transaction sent. Re-run with --apply to create the pool.`);
    return;
  }

  if (!SKIP_CONFIRM) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const a = await new Promise((r) =>
      rl.question(
        `\n[CONFIRM] Create Raydium CPMM pool with ${fmt(TOKEN_AMOUNT)} GOATX + ${SOL_AMOUNT} SOL on MAINNET?\nType YES to continue: `,
        r
      )
    );
    rl.close();
    if (a.trim() !== "YES") {
      console.log("[ABORT]");
      process.exit(0);
    }
  }

  // ── Raydium SDK init ─────────────────────────────────────────────────────
  console.log(`\n[raydium] loading SDK …`);
  const raydium = await Raydium.load({
    owner,
    connection: conn,
    cluster: "mainnet",
    disableFeatureCheck: true,
    blockhashCommitment: "finalized",
  });

  // CPMM fee config (0.25 %  ⇒ index 0 on mainnet)
  const feeConfigs = await raydium.api.getCpmmConfigs();
  const feeConfig = feeConfigs.find((c) => c.tradeFeeRate === 2500) || feeConfigs[0];
  console.log(`[raydium] fee tier: ${(feeConfig.tradeFeeRate / 1e6 * 100).toFixed(3)} %`);

  // Sort mints (Raydium CPMM requires base < quote by pubkey)
  const mintA_info = await raydium.token.getTokenInfo(mintPk.toBase58());
  const mintB_info = await raydium.token.getTokenInfo(NATIVE_MINT.toBase58());

  console.log(`\n[raydium] creating pool …`);
  const { execute, extInfo } = await raydium.cpmm.createPool({
    programId: CREATE_CPMM_POOL_PROGRAM,
    poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC,
    mintA: mintA_info,
    mintB: mintB_info,
    mintAAmount: tokenRaw,
    mintBAmount: solRaw,
    startTime: new BN(0),
    feeConfig,
    associatedOnly: false,
    ownerInfo: { useSOLBalance: true },
    txVersion: TxVersion.V0,
  });

  const { txId } = await execute({ sendAndConfirm: true });

  const manifest = {
    network: "mainnet-beta",
    created_at: new Date().toISOString(),
    payer: owner.publicKey.toBase58(),
    pool_id: extInfo?.address?.poolId?.toBase58?.() || null,
    lp_mint: extInfo?.address?.lpMint?.toBase58?.() || null,
    base_mint: mintPk.toBase58(),
    quote_mint: NATIVE_MINT.toBase58(),
    base_amount: TOKEN_AMOUNT,
    quote_amount_sol: SOL_AMOUNT,
    fee_bps: feeConfig.tradeFeeRate,
    tx: txId,
    explorer: `https://explorer.solana.com/tx/${txId}`,
    raydium_url: `https://raydium.io/swap/?inputMint=sol&outputMint=${mintPk.toBase58()}`,
    next_step: "Lock LP tokens via https://app.uncx.network/lockers/solana or Streamflow",
  };

  const outDir = path.join(root, "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `goatx-raydium-lp-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

  console.log(`\n${"═".repeat(64)}`);
  console.log(`  ✓ POOL CREATED`);
  console.log(`${"═".repeat(64)}`);
  console.log(`  pool id : ${manifest.pool_id || "(check tx)"}`);
  console.log(`  lp mint : ${manifest.lp_mint || "(check tx)"}`);
  console.log(`  tx      : ${txId}`);
  console.log(`  explorer: ${manifest.explorer}`);
  console.log(`  raydium : ${manifest.raydium_url}`);
  console.log(`  manifest: ${outPath}`);
  console.log(`\n  NEXT: lock LP tokens before tweeting.`);
  console.log(`        UNCX: https://app.uncx.network/lockers/solana`);
}

main().catch((e) => {
  console.error("\n[FATAL]", e);
  process.exit(1);
});
