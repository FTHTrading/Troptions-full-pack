#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/vault-lock.mjs
 *
 * TROPTIONS GATEWAY VAULT — LOCK FUNDS
 * ─────────────────────────────────────────────────────────────────
 * Locks USDC and/or USDT into the deployed TroptionsGatewayVault.
 * Chainlink price is validated on-chain at the moment of locking.
 * Only the depositor wallet can call this.
 *
 * Required env in .env.local:
 *   VAULT_DEPOSITOR_KEY=0x...   Private key of the depositor wallet
 *   ETHEREUM_RPC_URL=https://... (optional)
 *
 * Required file (created by vault-deploy.mjs):
 *   data/vault/TroptionsGatewayVault.deployment.json
 *
 * Usage:
 *   node scripts/vault-lock.mjs --usdc=175000000            (lock 175M USDC)
 *   node scripts/vault-lock.mjs --usdt=100000000            (lock 100M USDT)
 *   node scripts/vault-lock.mjs --usdc=175000000 --usdt=100000000  (both)
 *   node scripts/vault-lock.mjs --usdc=175000000 --dry-run  (preview only)
 *
 * Amounts are in human-readable units (not base units).
 * Receipts saved to: data/vault/locks/
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEPLOYMENT_FILE = path.join(ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");
const LOCKS_DIR       = path.join(ROOT, "data", "vault", "locks");
const RPC_FALLBACKS   = [
  "https://cloudflare-eth.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
];

// ─── Mainnet addresses ────────────────────────────────────────────────────────
const USDC = { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6,  symbol: "USDC" };
const USDT = { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6,  symbol: "USDT" };

// Minimal ERC-20 ABI (approve + balanceOf)
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

// Vault lock ABI
const VAULT_LOCK_ABI = [
  "function lockUsdc(uint256 amount) returns (uint256)",
  "function lockUsdt(uint256 amount) returns (uint256)",
  "function vaultSnapshot() view returns (address, uint256, uint256, uint256, bool)",
  "function liveOracles() view returns (int256, uint256, int256, uint256)",
  "event Locked(uint256 indexed lockId, address indexed by, address token, uint256 amount, uint256 valueUsd, int256 chainlinkPrice, uint80 roundId, uint256 timestamp)",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

function loadDeployment() {
  if (!fs.existsSync(DEPLOYMENT_FILE)) {
    console.error("  ERROR: Vault not deployed yet. Run: npm run vault:deploy:confirm");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
}

function humanToBase(human, decimals) {
  // Avoid floating point: split on decimal point
  const [whole, frac = ""] = String(human).split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded);
}

// ─── Core lock logic ──────────────────────────────────────────────────────────

async function lockAsset(wallet, provider, vaultAddress, asset, humanAmount, dryRun) {
  const baseAmount = humanToBase(humanAmount, asset.decimals);
  const token      = new ethers.Contract(asset.address, ERC20_ABI, wallet);
  const vault      = new ethers.Contract(vaultAddress, VAULT_LOCK_ABI, wallet);

  // Check wallet balance
  const balance = await token.balanceOf(wallet.address);
  console.log(`  ${asset.symbol} wallet balance: ${Number(balance) / 10 ** asset.decimals} ${asset.symbol}`);
  if (balance < baseAmount) {
    console.error(`  ERROR: Insufficient ${asset.symbol} balance. Have ${Number(balance) / 10 ** asset.decimals}, need ${humanAmount}`);
    process.exit(1);
  }

  // Check current allowance
  const allowance = await token.allowance(wallet.address, vaultAddress);
  console.log(`  ${asset.symbol} current allowance: ${Number(allowance) / 10 ** asset.decimals}`);

  if (dryRun) {
    console.log(`  DRY RUN — would lock ${humanAmount} ${asset.symbol} (${baseAmount} base units)`);
    return null;
  }

  // Approve if needed
  if (allowance < baseAmount) {
    console.log(`  Approving ${humanAmount} ${asset.symbol} for vault...`);
    const approveTx = await token.approve(vaultAddress, baseAmount);
    await approveTx.wait(1);
    console.log(`  OK: approved - tx: ${approveTx.hash}`);
  }

  // Execute lock
  console.log(`  Locking ${humanAmount} ${asset.symbol}...`);
  const lockFn = asset.symbol === "USDC" ? "lockUsdc" : "lockUsdt";
  const lockTx = await vault[lockFn](baseAmount);
  console.log(`  Tx sent: ${lockTx.hash}`);
  const receipt = await lockTx.wait(1);
  console.log(`  OK: locked - block ${receipt.blockNumber}`);

  // Parse Locked event
  const lockedEvent = receipt.logs
    .map((log) => { try { return vault.interface.parseLog(log); } catch { return null; } })
    .find((l) => l?.name === "Locked");

  return {
    lockId:    lockedEvent ? Number(lockedEvent.args.lockId) : null,
    txHash:    receipt.hash,
    block:     receipt.blockNumber,
    token:     asset.address,
    symbol:    asset.symbol,
    amount:    humanAmount,
    baseUnits: baseAmount.toString(),
    chainlinkPrice: lockedEvent ? (Number(lockedEvent.args.chainlinkPrice) / 1e8).toFixed(6) : null,
    valueUsd:  lockedEvent ? Number(lockedEvent.args.valueUsd).toString() : null,
    timestamp: new Date().toISOString(),
    etherscan: `https://etherscan.io/tx/${receipt.hash}`,
  };
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

loadEnv();

const argv     = process.argv.slice(2);
const get      = (p) => argv.find((a) => a.startsWith(p + "="))?.split("=").slice(1).join("=");
const dryRun   = argv.includes("--dry-run");
const usdcAmt  = get("--usdc");
const usdtAmt  = get("--usdt");

if (!usdcAmt && !usdtAmt) {
  console.error("Usage: node scripts/vault-lock.mjs --usdc=175000000 [--usdt=100000000] [--dry-run]");
  process.exit(1);
}

const depositorKey = process.env.VAULT_DEPOSITOR_KEY;
if (!depositorKey && !dryRun) {
  console.error("  ERROR: VAULT_DEPOSITOR_KEY not set in .env.local");
  process.exit(1);
}

const deployment = loadDeployment();
const rpcUrl     = process.env.ETHEREUM_RPC_URL || RPC_FALLBACKS[0];
const provider   = new ethers.JsonRpcProvider(rpcUrl);
const wallet     = depositorKey
  ? new ethers.Wallet(depositorKey, provider)
  : ethers.Wallet.createRandom(); // dummy for dry-run

console.log("════════════════════════════════════════════════════════════════════════");
console.log("  TROPTIONS GATEWAY VAULT — LOCK FUNDS");
console.log("════════════════════════════════════════════════════════════════════════");
console.log(`  Vault:    ${deployment.address}`);
console.log(`  Mode:     ${dryRun ? "DRY RUN" : "LIVE LOCK"}`);
if (!dryRun) console.log(`  Depositor: ${wallet.address}`);
console.log("════════════════════════════════════════════════════════════════════════\n");

// Show live oracle prices
const vaultRead = new ethers.Contract(deployment.address, VAULT_LOCK_ABI, provider);
try {
  const [up,, tp] = await vaultRead.liveOracles();
  console.log(`  Chainlink USDC/USD: $${(Number(up) / 1e8).toFixed(6)}`);
  console.log(`  Chainlink USDT/USD: $${(Number(tp) / 1e8).toFixed(6)}`);
  console.log();
} catch {
  console.log("  (could not fetch live oracles — continuing)\n");
}

const results = [];
fs.mkdirSync(LOCKS_DIR, { recursive: true });

if (usdcAmt) {
  console.log(`  ── USDC Lock ─────────────────────────────`);
  const r = await lockAsset(wallet, provider, deployment.address, USDC, usdcAmt, dryRun);
  if (r) results.push(r);
}

if (usdtAmt) {
  console.log(`  ── USDT Lock ─────────────────────────────`);
  const r = await lockAsset(wallet, provider, deployment.address, USDT, usdtAmt, dryRun);
  if (r) results.push(r);
}

if (results.length) {
  const ts      = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outFile = path.join(LOCKS_DIR, `lock-${ts}.json`);
  const summary = {
    vault:    deployment.address,
    lockedAt: new Date().toISOString(),
    network:  "mainnet",
    locks:    results,
  };
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2) + "\n");
  console.log(`\n  Receipt: data/vault/locks/lock-${ts}.json`);
  results.forEach((r) => console.log(`  Etherscan: ${r.etherscan}`));
}

// Final vault snapshot
try {
  const [addr, usdcLocked, usdtLocked, count] = await vaultRead.vaultSnapshot();
  console.log(`\n  Vault snapshot after lock:`);
  console.log(`    USDC locked: ${Number(usdcLocked) / 1e6} USDC`);
  console.log(`    USDT locked: ${Number(usdtLocked) / 1e6} USDT`);
  console.log(`    Total locks: ${count}`);
} catch {
  // not critical
}

console.log("\n════════════════════════════════════════════════════════════════════════");
