#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/chainlink-fund-validator.mjs
 *
 * TROPTIONS GATEWAY — CHAINLINK FUND VALIDATOR
 *
 * Queries Chainlink Data Feed contracts on Ethereum mainnet to verify
 * real-time USD prices for USDC, USDT, DAI, and EURC, then cross-validates
 * those prices against the Gateway's IOU positions.
 *
 * Chainlink feeds used (Ethereum mainnet, 8 decimals each):
 *   USDC/USD  0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6
 *   USDT/USD  0x3E7d1eAB13ad0104d2750B8863b489D65364e32D
 *   DAI/USD   0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9
 *   ETH/USD   0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419  (context only)
 *
 * Required env:
 *   ETHEREUM_RPC_URL  (optional — defaults to Cloudflare/LlamaRPC public node)
 *
 * Usage:
 *   node scripts/chainlink-fund-validator.mjs
 *   node scripts/chainlink-fund-validator.mjs --asset=USDC --supply=175000000
 *   node scripts/chainlink-fund-validator.mjs --json
 *   node scripts/chainlink-fund-validator.mjs --asset=USDC --supply=175000000 --deviation=0.5
 *
 * Can also be imported as a module:
 *   import { validateFunds } from "./chainlink-fund-validator.mjs";
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ─── Chainlink Feed Registry ──────────────────────────────────────────────────

const FEEDS = {
  USDC: {
    address: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    decimals: 8,
    description: "USDC / USD",
    expectedPeg: 1.0,
    heartbeatMinutes: 1440, // Chainlink USDC/USD: 24-hour heartbeat
  },
  USDT: {
    address: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
    decimals: 8,
    description: "USDT / USD",
    expectedPeg: 1.0,
    heartbeatMinutes: 1440, // Chainlink USDT/USD: 24-hour heartbeat
  },
  DAI: {
    address: "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
    decimals: 8,
    description: "DAI / USD",
    expectedPeg: 1.0,
    heartbeatMinutes: 60, // Chainlink DAI/USD: 1-hour heartbeat
  },
  ETH: {
    address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    decimals: 8,
    description: "ETH / USD",
    expectedPeg: null, // not a stablecoin, no peg check
    heartbeatMinutes: 60, // Chainlink ETH/USD: 1-hour heartbeat
  },
};

// latestRoundData() selector = keccak256("latestRoundData()")[0:4]
const LATEST_ROUND_DATA_SELECTOR = "0xfeaf968c";

// Default public RPC fallback chain (no API key required)
const RPC_FALLBACKS = [
  "https://cloudflare-eth.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
  "https://mainnet.gateway.tenderly.co",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getArgs() {
  const argv = process.argv.slice(2);
  const get = (prefix) => argv.find((a) => a.startsWith(prefix))?.split("=")[1];
  return {
    asset: get("--asset="),
    supply: get("--supply="),
    deviation: parseFloat(get("--deviation=") ?? "0.5"),
    json: argv.includes("--json"),
    out: get("--out="),
  };
}

function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

function getRpcUrl() {
  return process.env.ETHEREUM_RPC_URL || null;
}

/**
 * Encodes an eth_call payload for latestRoundData() and decodes the response.
 * No external ABI library required — pure hex encoding.
 */
async function callLatestRoundData(feedAddress, rpcUrl) {
  const payload = {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{ to: feedAddress, data: LATEST_ROUND_DATA_SELECTOR }, "latest"],
    id: 1,
  };

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} from RPC`);
  const json = await res.json();
  if (json.error) throw new Error(`RPC error: ${json.error.message}`);

  // Decode 5 × 32-byte (160 bytes) return value
  // (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
  const hex = json.result.replace("0x", "");
  if (hex.length < 320) throw new Error(`Unexpected response length: ${hex.length}`);

  const roundId      = BigInt("0x" + hex.slice(0,   64));
  const answer       = BigInt("0x" + hex.slice(64,  128));
  const startedAt    = BigInt("0x" + hex.slice(128, 192));
  const updatedAt    = BigInt("0x" + hex.slice(192, 256));
  const answeredIn   = BigInt("0x" + hex.slice(256, 320));

  return { roundId, answer, startedAt, updatedAt, answeredIn };
}

async function fetchFeedWithFallback(feedAddress) {
  const urls = getRpcUrl() ? [getRpcUrl(), ...RPC_FALLBACKS] : RPC_FALLBACKS;
  let lastErr;
  for (const url of urls) {
    try {
      return await callLatestRoundData(feedAddress, url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`All RPC endpoints failed for ${feedAddress}: ${lastErr?.message}`);
}

// ─── Core Validator ───────────────────────────────────────────────────────────

/**
 * Validate a single feed.
 * @param {string} assetId  - e.g. "USDC"
 * @param {number} supply   - IOU supply units (raw, e.g. 175000000)
 * @param {number} maxDeviation - max acceptable peg deviation % (e.g. 0.5)
 */
export async function validateAsset(assetId, supply, maxDeviation = 0.5) {
  const feed = FEEDS[assetId];
  if (!feed) throw new Error(`No Chainlink feed registered for asset: ${assetId}`);

  const now = Date.now();
  const raw = await fetchFeedWithFallback(feed.address);

  const priceFull = Number(raw.answer) / 10 ** feed.decimals;
  const updatedAt = Number(raw.updatedAt) * 1000; // ms
  const ageMinutes = Math.floor((now - updatedAt) / 60_000);

  // Staleness check using per-feed Chainlink heartbeat (with 20% grace margin)
  const heartbeat = feed.heartbeatMinutes ?? 120;
  const staleThreshold = Math.ceil(heartbeat * 1.2);
  const stale = ageMinutes > staleThreshold;

  // Peg deviation check (only for pegged assets)
  let pegDeviationPct = null;
  let pegPass = true;
  if (feed.expectedPeg !== null) {
    pegDeviationPct = Math.abs((priceFull - feed.expectedPeg) / feed.expectedPeg) * 100;
    pegPass = pegDeviationPct <= maxDeviation;
  }

  // USD value of IOU position at Chainlink price
  const positionUsd = supply != null ? supply * priceFull : null;

  return {
    asset: assetId,
    feed: {
      address: feed.address,
      description: feed.description,
    },
    chainlink: {
      roundId: raw.roundId.toString(),
      price: priceFull,
      updatedAt: new Date(updatedAt).toISOString(),
      ageMinutes,
      stale,
    },
    position: supply != null ? {
      supply,
      priceUsd: priceFull,
      valueUsd: positionUsd,
      valueUsdFormatted: positionUsd?.toLocaleString("en-US", { style: "currency", currency: "USD" }),
    } : null,
    peg: feed.expectedPeg !== null ? {
      expected: feed.expectedPeg,
      deviationPct: pegDeviationPct,
      maxDeviationPct: maxDeviation,
      pass: pegPass,
    } : null,
    pass: pegPass && !stale,
    warnings: [
      ...(stale ? [`Price data is ${ageMinutes} minutes old (heartbeat threshold: ${staleThreshold} min)`] : []),
      ...(!pegPass ? [`Peg deviation ${pegDeviationPct?.toFixed(4)}% exceeds ${maxDeviation}% threshold`] : []),
    ],
  };
}

/**
 * Validate all registered feeds (or a filtered subset) against supplied IOU positions.
 * @param {Object} positions  - { USDC: 175000000, USDT: 100000000, DAI: 50000000 }
 * @param {Object} opts       - { assets?: string[], maxDeviation?: number }
 */
export async function validateFunds(positions = {}, opts = {}) {
  const { assets = Object.keys(FEEDS), maxDeviation = 0.5 } = opts;
  const timestamp = new Date().toISOString();

  const results = await Promise.allSettled(
    assets.map((assetId) =>
      validateAsset(assetId, positions[assetId] ?? null, maxDeviation)
    )
  );

  const validated = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return {
      asset: assets[i],
      error: r.reason?.message ?? String(r.reason),
      pass: false,
    };
  });

  const totalValueUsd = validated
    .filter((v) => v.position?.valueUsd != null)
    .reduce((sum, v) => sum + v.position.valueUsd, 0);

  const allPass = validated.every((v) => v.pass);
  const warnings = validated.flatMap((v) => v.warnings ?? []);

  return {
    timestamp,
    network: "ethereum-mainnet",
    oracle: "Chainlink Data Feeds",
    summary: {
      assetsValidated: validated.length,
      pass: allPass,
      totalPositionValueUsd: totalValueUsd,
      totalPositionValueFormatted: totalValueUsd.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      warnings,
    },
    assets: validated,
  };
}

// ─── CLI Entrypoint ───────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  loadEnv();
  const args = getArgs();

  const assets = args.asset ? [args.asset.toUpperCase()] : Object.keys(FEEDS);
  const positions = {};
  if (args.asset && args.supply) {
    positions[args.asset.toUpperCase()] = parseFloat(args.supply);
  }

  console.log("════════════════════════════════════════════════════════════════════════");
  console.log("  TROPTIONS GATEWAY — CHAINLINK FUND VALIDATOR");
  console.log("════════════════════════════════════════════════════════════════════════");
  console.log(`  Oracle:   Chainlink Data Feeds (Ethereum mainnet)`);
  console.log(`  Assets:   ${assets.join(", ")}`);
  console.log(`  Max deviation: ${args.deviation}%`);
  console.log("════════════════════════════════════════════════════════════════════════\n");

  let result;
  try {
    result = await validateFunds(positions, { assets, maxDeviation: args.deviation });
  } catch (err) {
    console.error("Validation failed:", err.message);
    process.exit(1);
  }

  if (args.json) {
    const output = JSON.stringify(result, null, 2);
    if (args.out) {
      const outDir = path.dirname(path.resolve(REPO_ROOT, args.out));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.resolve(REPO_ROOT, args.out), output + "\n");
      console.log(`Report saved: ${args.out}`);
    } else {
      console.log(output);
    }
    process.exit(result.summary.pass ? 0 : 1);
  }

  // Human-readable output
  for (const v of result.assets) {
    if (v.error) {
      console.log(`  [${v.asset}]  ERROR: ${v.error}`);
      continue;
    }
    const status = v.pass ? "✅ PASS" : "❌ FAIL";
    const price = v.chainlink?.price?.toFixed(6);
    const age = v.chainlink?.ageMinutes;
    const dev = v.peg?.deviationPct?.toFixed(4) ?? "N/A";
    const value = v.position?.valueUsdFormatted ?? "N/A";
    console.log(`  ${status}  ${v.asset.padEnd(5)}  Price: $${price}  Age: ${age}min  Dev: ${dev}%  Position: ${value}`);
    for (const w of v.warnings ?? []) console.log(`         ⚠️  ${w}`);
  }

  console.log();
  console.log(`  Total position value: ${result.summary.totalPositionValueFormatted}`);
  console.log(`  Overall: ${result.summary.pass ? "✅ PASS" : "❌ FAIL"}`);
  console.log("\n════════════════════════════════════════════════════════════════════════");

  process.exit(result.summary.pass ? 0 : 1);
}
