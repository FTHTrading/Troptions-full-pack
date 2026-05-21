#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/vault-status.mjs
 *
 * TROPTIONS GATEWAY VAULT - STATUS & RECEIPT
 * ─────────────────────────────────────────────────────────────────
 * Reads the deployed vault, queries live Chainlink prices,
 * and produces a full custodial status receipt with USD values.
 *
 * Usage:
 *   node scripts/vault-status.mjs
 *   node scripts/vault-status.mjs --json
 *   node scripts/vault-status.mjs --out=data/vault/status.json
 *
 * Reads deployment from: data/vault/TroptionsGatewayVault.deployment.json
 * Saves receipts to:     data/vault/receipts/
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DEPLOYMENT_FILE = path.join(ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");
const RECEIPTS_DIR    = path.join(ROOT, "data", "vault", "receipts");
const RPC_FALLBACKS   = [
  "https://cloudflare-eth.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
];

const VAULT_ABI = [
  "function vaultSnapshot() view returns (address, uint256, uint256, uint256, bool)",
  "function liveOracles() view returns (int256, uint256, int256, uint256)",
  "function owner() view returns (address)",
  "function depositor() view returns (address)",
  "function USDC_TOKEN() view returns (address)",
  "function USDT_TOKEN() view returns (address)",
  "function USDC_FEED() view returns (address)",
  "function USDT_FEED() view returns (address)",
];

function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

loadEnv();

const argv  = process.argv.slice(2);
const get   = (p) => argv.find((a) => a.startsWith(p + "="))?.split("=").slice(1).join("=");
const jsonMode = argv.includes("--json");
const out      = get("--out");

if (!fs.existsSync(DEPLOYMENT_FILE)) {
  console.error("  ERROR: Vault not deployed yet. Run: npm run vault:deploy:confirm");
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
const rpcUrl     = process.env.ETHEREUM_RPC_URL || RPC_FALLBACKS[0];
const provider   = new ethers.JsonRpcProvider(rpcUrl);
const vault      = new ethers.Contract(deployment.address, VAULT_ABI, provider);

console.log("========================================================================");
console.log("  TROPTIONS GATEWAY VAULT - STATUS");
console.log("========================================================================\n");

const [
  [vaultAddr, usdcLocked, usdtLocked, lockCount, isFrozen],
  [usdcPrice, usdcUpdated, usdtPrice, usdtUpdated],
  owner,
  depositor,
] = await Promise.all([
  vault.vaultSnapshot(),
  vault.liveOracles(),
  vault.owner(),
  vault.depositor(),
]);

const now          = new Date();
const usdcPriceNum = Number(usdcPrice) / 1e8;
const usdtPriceNum = Number(usdtPrice) / 1e8;
const usdcHuman    = Number(usdcLocked) / 1e6;
const usdtHuman    = Number(usdtLocked) / 1e6;
const usdcValue    = usdcHuman * usdcPriceNum;
const usdtValue    = usdtHuman * usdtPriceNum;
const totalValue   = usdcValue + usdtValue;

const usdcUpdatedAt  = new Date(Number(usdcUpdated) * 1000);
const usdtUpdatedAt  = new Date(Number(usdtUpdated) * 1000);
const usdcAgeMin     = Math.floor((now - usdcUpdatedAt) / 60_000);
const usdtAgeMin     = Math.floor((now - usdtUpdatedAt) / 60_000);
const usdcPegDev     = Math.abs((usdcPriceNum - 1.0) / 1.0) * 100;
const usdtPegDev     = Math.abs((usdtPriceNum - 1.0) / 1.0) * 100;
const usdcPass       = usdcPegDev <= 0.5 && usdcAgeMin <= 1728; // 24h × 1.2
const usdtPass       = usdtPegDev <= 0.5 && usdtAgeMin <= 1728;
const overallPass    = usdcPass && usdtPass && !isFrozen;

console.log(`  Vault:      ${deployment.address}`);
console.log(`  Owner:      ${owner}`);
console.log(`  Depositor:  ${depositor}`);
console.log(`  Status:     ${isFrozen ? "FROZEN" : overallPass ? "ACTIVE" : "WARNING"}`);
console.log(`  Lock ops:   ${lockCount.toString()}`);
console.log();
console.log(`  Locked assets:`);
console.log(`    USDC: ${usdcHuman.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDC  |  $${usdcValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
console.log(`    USDT: ${usdtHuman.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT  |  $${usdtValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
console.log(`    TOTAL LOCKED VALUE: $${totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
console.log();
console.log(`  Chainlink USDC/USD: $${usdcPriceNum.toFixed(6)}  (${usdcAgeMin}m ago, dev ${usdcPegDev.toFixed(4)}%) ${usdcPass ? "PASS" : "FAIL"}`);
console.log(`  Chainlink USDT/USD: $${usdtPriceNum.toFixed(6)}  (${usdtAgeMin}m ago, dev ${usdtPegDev.toFixed(4)}%) ${usdtPass ? "PASS" : "FAIL"}`);
console.log(`  Etherscan: https://etherscan.io/address/${deployment.address}`);

const receipt = {
  receiptId:   `vault-${Date.now().toString(36)}`,
  generatedAt: now.toISOString(),
  pass:        overallPass,
  vault: {
    address:    deployment.address,
    owner,
    depositor,
    frozen:     isFrozen,
    lockCount:  Number(lockCount),
    etherscan:  `https://etherscan.io/address/${deployment.address}`,
  },
  locked: {
    usdc: { human: usdcHuman, baseUnits: usdcLocked.toString(), valueUsd: usdcValue },
    usdt: { human: usdtHuman, baseUnits: usdtLocked.toString(), valueUsd: usdtValue },
    totalValueUsd: totalValue,
  },
  oracles: {
    usdc: {
      feed: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      price: usdcPriceNum,
      updatedAt: usdcUpdatedAt.toISOString(),
      ageMinutes: usdcAgeMin,
      pegDeviation: usdcPegDev,
      pass: usdcPass,
    },
    usdt: {
      feed: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
      price: usdtPriceNum,
      updatedAt: usdtUpdatedAt.toISOString(),
      ageMinutes: usdtAgeMin,
      pegDeviation: usdtPegDev,
      pass: usdtPass,
    },
  },
};

if (jsonMode || out) {
  const jsonStr = JSON.stringify(receipt, null, 2);
  if (out) {
    const outAbs = path.resolve(ROOT, out);
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    fs.writeFileSync(outAbs, jsonStr + "\n");
    console.log(`\n  Receipt saved: ${out}`);
  } else {
    console.log("\n" + jsonStr);
  }
}

// Auto-save to receipts dir
fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
fs.writeFileSync(path.join(RECEIPTS_DIR, `status-${ts}.json`), JSON.stringify(receipt, null, 2) + "\n");

console.log("\n========================================================================");
process.exit(overallPass ? 0 : 1);
