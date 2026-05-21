#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/vault-release.mjs
 *
 * TROPTIONS GATEWAY VAULT — RELEASE FUNDS
 * ─────────────────────────────────────────────────────────────────
 * Releases USDC or USDT from the vault to a destination address.
 * ONLY the vault owner wallet can execute this.
 * Requires explicit --confirm flag — no accidental releases.
 *
 * Required env in .env.local:
 *   VAULT_OWNER_KEY=0x...     Private key of the vault owner
 *   ETHEREUM_RPC_URL=https://... (optional)
 *
 * Usage:
 *   node scripts/vault-release.mjs --token=USDC --amount=1000000 --to=0xRECIPIENT --confirm
 *   node scripts/vault-release.mjs --token=USDT --amount=500000  --to=0xRECIPIENT --confirm
 *   node scripts/vault-release.mjs --token=USDC --amount=1000000 --to=0xRECIPIENT --dry-run
 *
 * Amounts in human-readable units (USDC: 6 decimals).
 * Release receipts saved to: data/vault/releases/
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEPLOYMENT_FILE = path.join(ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");
const RELEASES_DIR    = path.join(ROOT, "data", "vault", "releases");
const RPC_FALLBACKS   = [
  "https://cloudflare-eth.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
];

const VAULT_RELEASE_ABI = [
  "function releaseUsdc(address to, uint256 amount)",
  "function releaseUsdt(address to, uint256 amount)",
  "function vaultSnapshot() view returns (address, uint256, uint256, uint256, bool)",
  "function owner() view returns (address)",
  "event Released(uint256 indexed releaseId, address indexed to, address token, uint256 amount, uint256 timestamp)",
];

const TOKEN_INFO = {
  USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
  USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
};

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
  const [whole, frac = ""] = String(human).split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded);
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

loadEnv();

const argv    = process.argv.slice(2);
const get     = (p) => argv.find((a) => a.startsWith(p + "="))?.split("=").slice(1).join("=");
const dryRun  = argv.includes("--dry-run");
const confirm = argv.includes("--confirm");
const token   = (get("--token") || "").toUpperCase();
const amount  = get("--amount");
const to      = get("--to");

console.log("════════════════════════════════════════════════════════════════════════");
console.log("  TROPTIONS GATEWAY VAULT — RELEASE FUNDS");
console.log("════════════════════════════════════════════════════════════════════════");

if (!token || !TOKEN_INFO[token]) {
  console.error("  ERROR: --token must be USDC or USDT");
  process.exit(1);
}
if (!amount || isNaN(parseFloat(amount))) {
  console.error("  ERROR: --amount required (human units e.g. 1000000 = 1M)");
  process.exit(1);
}
if (!to || !/^0x[0-9a-fA-F]{40}$/.test(to)) {
  console.error("  ERROR: --to must be a valid Ethereum address");
  process.exit(1);
}
if (!dryRun && !confirm) {
  console.error("  ERROR: Add --confirm to execute, or --dry-run to preview.");
  console.error("  Example: node scripts/vault-release.mjs --token=USDC --amount=1000000 --to=0x... --confirm");
  process.exit(1);
}

const ownerKey = process.env.VAULT_OWNER_KEY;
if (!ownerKey && !dryRun) {
  console.error("  ERROR: VAULT_OWNER_KEY not set in .env.local");
  process.exit(1);
}

const deployment  = loadDeployment();
const tokenInfo   = TOKEN_INFO[token];
const baseAmount  = humanToBase(amount, tokenInfo.decimals);
const rpcUrl      = process.env.ETHEREUM_RPC_URL || RPC_FALLBACKS[0];
const provider    = new ethers.JsonRpcProvider(rpcUrl);
const wallet      = ownerKey ? new ethers.Wallet(ownerKey, provider) : null;

console.log(`  Vault:    ${deployment.address}`);
console.log(`  Mode:     ${dryRun ? "DRY RUN" : "LIVE RELEASE - FUNDS WILL MOVE"}`);
console.log(`  Token:    ${token} (${tokenInfo.address})`);
console.log(`  Amount:   ${parseFloat(amount).toLocaleString()} ${token}`);
console.log(`  To:       ${to}`);
console.log("════════════════════════════════════════════════════════════════════════\n");

// Current vault state
const vaultRead = new ethers.Contract(deployment.address, VAULT_RELEASE_ABI, provider);
const [, usdcLocked, usdtLocked, lockCount] = await vaultRead.vaultSnapshot();
console.log(`  Current vault state:`);
console.log(`    USDC locked: ${Number(usdcLocked) / 1e6} USDC`);
console.log(`    USDT locked: ${Number(usdtLocked) / 1e6} USDT`);
console.log(`    Total lock ops: ${lockCount}`);
console.log();

// Check sufficient locked balance
const locked = token === "USDC" ? usdcLocked : usdtLocked;
if (baseAmount > locked) {
  console.error(`  ERROR: Cannot release ${amount} ${token} - only ${Number(locked) / 1e6} ${token} is locked`);
  process.exit(1);
}

// Verify owner
const onChainOwner = await vaultRead.owner();
if (wallet && wallet.address.toLowerCase() !== onChainOwner.toLowerCase()) {
  console.error(`  ERROR: VAULT_OWNER_KEY address ${wallet.address} does not match vault owner ${onChainOwner}`);
  process.exit(1);
}

if (dryRun) {
  console.log(`  DRY RUN — would release ${amount} ${token} to ${to}`);
  console.log(`  Base units: ${baseAmount.toString()}`);
  process.exit(0);
}

// Execute
const vault = new ethers.Contract(deployment.address, VAULT_RELEASE_ABI, wallet);
const releaseFn = token === "USDC" ? "releaseUsdc" : "releaseUsdt";
console.log(`  Sending release tx...`);
const tx = await vault[releaseFn](to, baseAmount);
console.log(`  Tx: ${tx.hash}`);
const receipt = await tx.wait(1);
console.log(`  OK: released - block ${receipt.blockNumber}`);

// Parse Released event
const releasedEvent = receipt.logs
  .map((log) => { try { return vault.interface.parseLog(log); } catch { return null; } })
  .find((l) => l?.name === "Released");

const releaseRecord = {
  releaseId:   releasedEvent ? Number(releasedEvent.args.releaseId) : null,
  vault:       deployment.address,
  token:       tokenInfo.address,
  symbol:      token,
  amount,
  baseUnits:   baseAmount.toString(),
  to,
  txHash:      receipt.hash,
  block:       receipt.blockNumber,
  releasedAt:  new Date().toISOString(),
  etherscan:   `https://etherscan.io/tx/${receipt.hash}`,
};

fs.mkdirSync(RELEASES_DIR, { recursive: true });
const ts      = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outFile = path.join(RELEASES_DIR, `release-${ts}.json`);
fs.writeFileSync(outFile, JSON.stringify(releaseRecord, null, 2) + "\n");
console.log(`  Release receipt: data/vault/releases/release-${ts}.json`);
console.log(`  Etherscan: ${releaseRecord.etherscan}`);

// Final snapshot
const [, usdcAfter, usdtAfter] = await vaultRead.vaultSnapshot();
console.log(`\n  Vault after release:`);
console.log(`    USDC locked: ${Number(usdcAfter) / 1e6} USDC`);
console.log(`    USDT locked: ${Number(usdtAfter) / 1e6} USDT`);

console.log("\n════════════════════════════════════════════════════════════════════════");
