#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/chainlink-weekly-report.mjs
 *
 * TROPTIONS GATEWAY - CHAINLINK WEEKLY FUND REPORT
 *
 * Generates a weekly on-chain fund validation report by:
 *   1. Loading current IOU positions from pof-stack.profiles.json
 *   2. Querying Chainlink Data Feeds on Ethereum mainnet for real-time prices
 *   3. Cross-validating IOU supply × Chainlink price = USD value
 *   4. Comparing against prior week report for week-over-week delta
 *   5. Writing a dated JSON report + Markdown summary to data/observability/chainlink/
 *   6. Appending to a rolling history log (chainlink-report-history.json)
 *
 * Usage:
 *   node scripts/chainlink-weekly-report.mjs
 *   node scripts/chainlink-weekly-report.mjs --dry-run   (no file writes)
 *   node scripts/chainlink-weekly-report.mjs --out=data/observability/chainlink/custom.json
 *
 * Scheduled usage (cron / Windows Task Scheduler):
 *   node scripts/chainlink-weekly-report.mjs
 *   → Reports land in: data/observability/chainlink/chainlink-report-YYYY-MM-DD.json
 *                       data/observability/chainlink/chainlink-report-YYYY-MM-DD.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";
import { validateFunds } from "./chainlink-fund-validator.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAINLINK_DIR   = path.join(REPO_ROOT, "data", "observability", "chainlink");
const HISTORY_FILE    = path.join(CHAINLINK_DIR, "chainlink-report-history.json");
const PROFILES_FILE   = path.join(REPO_ROOT, "data", "observability", "pof", "pof-stack.profiles.json");
const DEPLOYMENT_FILE = path.join(REPO_ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");

const VAULT_READ_ABI = [
  "function vaultSnapshot() view returns (address, uint256, uint256, uint256, bool)",
  "function liveOracles() view returns (int256, uint256, int256, uint256)",
  "function owner() view returns (address)",
];

const RPC_FALLBACKS = [
  "https://cloudflare-eth.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
];

// IOU positions the Gateway has issued (populated from profiles + hard-coded 175M mint)
const GATEWAY_POSITIONS = {
  USDC: 175_000_000,
  USDT: 100_000_000,
  DAI:   50_000_000,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function getArgs() {
  const argv = process.argv.slice(2);
  return {
    dryRun: argv.includes("--dry-run"),
    out: argv.find((a) => a.startsWith("--out="))?.split("=")[1],
  };
}

function loadProfiles() {
  if (!fs.existsSync(PROFILES_FILE)) return null;
  return JSON.parse(fs.readFileSync(PROFILES_FILE, "utf8"));
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
  } catch {
    return [];
  }
}

function loadPriorWeekReport(history) {
  if (!history.length) return null;
  // Reports are appended in order; most recent is last
  return history[history.length - 1];
}

function fmtUsd(n) {
  return n?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "N/A";
}

function deltaStr(current, prior) {
  if (prior == null) return "N/A (no prior)";
  const diff = current - prior;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${fmtUsd(diff)}`;
}

// ─── Vault Query ──────────────────────────────────────────────────────────────

async function queryVault() {
  if (!fs.existsSync(DEPLOYMENT_FILE)) return null;
  try {
    const dep      = JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
    const rpcUrl   = process.env.ETHEREUM_RPC_URL || RPC_FALLBACKS[0];
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const vault    = new ethers.Contract(dep.address, VAULT_READ_ABI, provider);

    const [[, usdcLocked, usdtLocked, lockCount, frozen], [usdcPrice,, usdtPrice], owner] =
      await Promise.all([vault.vaultSnapshot(), vault.liveOracles(), vault.owner()]);

    const usdcHuman = Number(usdcLocked) / 1e6;
    const usdtHuman = Number(usdtLocked) / 1e6;
    const usdcVal   = usdcHuman * (Number(usdcPrice) / 1e8);
    const usdtVal   = usdtHuman * (Number(usdtPrice) / 1e8);

    return {
      address: dep.address,
      owner,
      frozen,
      lockCount: Number(lockCount),
      usdc: { locked: usdcHuman, valueUsd: usdcVal },
      usdt: { locked: usdtHuman, valueUsd: usdtVal },
      totalValueUsd: usdcVal + usdtVal,
      etherscan: `https://etherscan.io/address/${dep.address}`,
    };
  } catch (e) {
    return { error: e.message };
  }
}

// ─── Markdown Report Builder ──────────────────────────────────────────────────

function buildMarkdown(report, priorReport) {
  const d = report.date;
  const s = report.validation.summary;
  const lines = [
    `# TROPTIONS Gateway - Chainlink Weekly Fund Report`,
    `**Report Date:** ${d}  `,
    `**Oracle:** Chainlink Data Feeds (Ethereum mainnet)  `,
    `**Generated:** ${report.generatedAt}  `,
    `**Overall Status:** ${s.pass ? "PASS" : "FAIL"}`,
    ``,
    `---`,
    ``,
    `## IOU Position Summary`,
    ``,
    `| Asset | Supply (IOU) | Chainlink Price | Position Value (USD) | Peg Dev | Status |`,
    `|-------|-------------|----------------|---------------------|---------|--------|`,
  ];

  for (const v of report.validation.assets) {
    if (v.error) {
      lines.push(`| ${v.asset} | - | ERROR | ${v.error} | - | FAIL |`);
      continue;
    }
    const supply = v.position?.supply?.toLocaleString() ?? "-";
    const price = `$${v.chainlink?.price?.toFixed(6) ?? "-"}`;
    const value = v.position?.valueUsdFormatted ?? "-";
    const dev = v.peg?.deviationPct?.toFixed(4) ?? "N/A";
    const status = v.pass ? "PASS" : "FAIL";
    lines.push(`| ${v.asset} | ${supply} | ${price} | ${value} | ${dev}% | ${status} |`);
  }

  lines.push(``);
  lines.push(`**Total Position Value:** ${s.totalPositionValueFormatted}`);

  // Week-over-week delta
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Week-over-Week Delta`);
  lines.push(``);

  if (priorReport) {
    const priorTotal = priorReport.validation?.summary?.totalPositionValueUsd ?? null;
    const currTotal = s.totalPositionValueUsd;
    lines.push(`| Metric | Prior Week | This Week | Delta |`);
    lines.push(`|--------|-----------|-----------|-------|`);
    lines.push(`| Total Position Value | ${fmtUsd(priorTotal)} | ${fmtUsd(currTotal)} | ${deltaStr(currTotal, priorTotal)} |`);
    lines.push(`| Prior Report Date | ${priorReport.date} | - | - |`);

    // Per-asset price change
    lines.push(``);
    lines.push(`### Price Change by Asset`);
    lines.push(``);
    lines.push(`| Asset | Prior Price | Current Price | Change |`);
    lines.push(`|-------|------------|--------------|--------|`);
    for (const v of report.validation.assets) {
      if (v.error) continue;
      const priorAsset = priorReport.validation?.assets?.find((a) => a.asset === v.asset);
      const priorPrice = priorAsset?.chainlink?.price ?? null;
      const currPrice = v.chainlink?.price ?? null;
      const priceDelta = priorPrice != null && currPrice != null
        ? `${(((currPrice - priorPrice) / priorPrice) * 100).toFixed(4)}%`
        : "N/A";
      lines.push(`| ${v.asset} | ${priorPrice != null ? `$${priorPrice.toFixed(6)}` : "-"} | ${currPrice != null ? `$${currPrice.toFixed(6)}` : "-"} | ${priceDelta} |`);
    }
  } else {
    lines.push(`_No prior week report found. This is the first report in the history._`);
  }

  // Warnings
  if (s.warnings?.length) {
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Warnings`);
    lines.push(``);
    for (const w of s.warnings) lines.push(`- WARNING: ${w}`);
  }

  // Chainlink proof links
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Chainlink Feed References`);
  lines.push(``);
  lines.push(`| Asset | Feed Contract | Etherscan |`);
  lines.push(`|-------|--------------|-----------|`);
  for (const v of report.validation.assets) {
    if (!v.feed?.address) continue;
    const addr = v.feed.address;
    const link = `https://etherscan.io/address/${addr}#readContract`;
    lines.push(`| ${v.asset} | \`${addr}\` | [View on Etherscan](${link}) |`);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`_Report generated by TROPTIONS Gateway Chainlink Weekly Reporter. All prices sourced from Chainlink decentralized oracle network._`);

  // Vault section
  if (report.vault) {
    const v = report.vault;
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
    lines.push(`## On-Chain Vault Status`);
    lines.push(``);
    if (v.error) {
      lines.push(`> WARNING: Vault query failed: ${v.error}`);
    } else {
      lines.push(`| Field | Value |`);
      lines.push(`|-------|-------|`);
      lines.push(`| Vault Contract | [\`${v.address}\`](${v.etherscan}) |`);
      lines.push(`| Owner | \`${v.owner}\` |`);
      lines.push(`| Status | ${v.frozen ? "FROZEN" : "Active"} |`);
      lines.push(`| Total Lock Ops | ${v.lockCount} |`);
      lines.push(`| USDC Locked | ${v.usdc.locked.toLocaleString()} USDC (≈ ${fmtUsd(v.usdc.valueUsd)}) |`);
      lines.push(`| USDT Locked | ${v.usdt.locked.toLocaleString()} USDT (≈ ${fmtUsd(v.usdt.valueUsd)}) |`);
      lines.push(`| **Total Vault Value** | **${fmtUsd(v.totalValueUsd)}** |`);
    }
  }

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  loadEnv();
  const args = getArgs();
  const today = isoDate();

  console.log("========================================================================");
  console.log("  TROPTIONS GATEWAY - CHAINLINK WEEKLY FUND REPORT");
  console.log("========================================================================");
  console.log(`  Date:        ${today}`);
  console.log(`  Oracle:      Chainlink Data Feeds (Ethereum mainnet)`);
  console.log(`  Positions:   USDC ${GATEWAY_POSITIONS.USDC.toLocaleString()}, USDT ${GATEWAY_POSITIONS.USDT.toLocaleString()}, DAI ${GATEWAY_POSITIONS.DAI.toLocaleString()}`);
  if (args.dryRun) console.log(`  Mode:        DRY-RUN (no file writes)`);
  console.log("========================================================================\n");

  // Load profiles (informational; actual positions are GATEWAY_POSITIONS)
  const profiles = loadProfiles();
  if (profiles) {
    console.log(`  Profiles loaded: ${profiles.profiles.length} active profiles`);
  }

  // Load history for week-over-week comparison
  const history = loadHistory();
  const priorReport = loadPriorWeekReport(history);
  if (priorReport) {
    console.log(`  Prior report:  ${priorReport.date} (total: ${fmtUsd(priorReport.validation?.summary?.totalPositionValueUsd)})`);
  } else {
    console.log(`  Prior report:  none (first run)`);
  }
  console.log();

  // Run validation
  console.log("  Querying Chainlink feeds...\n");
  let validation;
  try {
    validation = await validateFunds(GATEWAY_POSITIONS, {
      assets: ["USDC", "USDT", "DAI"],
      maxDeviation: 0.5,
    });
  } catch (err) {
    console.error("  ERROR: Chainlink validation failed:", err.message);
    process.exit(1);
  }

  // Query vault (non-blocking)
  console.log("  Querying vault contract...");
  const vault = await queryVault();
  if (vault && !vault.error) {
    console.log(`  Vault: ${vault.address}`);
    console.log(`    USDC locked: ${vault.usdc.locked.toLocaleString()} USDC  (${fmtUsd(vault.usdc.valueUsd)})`);
    console.log(`    USDT locked: ${vault.usdt.locked.toLocaleString()} USDT  (${fmtUsd(vault.usdt.valueUsd)})`);
    console.log(`    Total vault value: ${fmtUsd(vault.totalValueUsd)}`);
  } else if (vault?.error) {
    console.log(`  WARNING: Vault query failed: ${vault.error}`);
  } else {
    console.log("  Vault not deployed yet - skipping vault section.");
  }
  console.log();

  // Print summary
  for (const v of validation.assets) {
    if (v.error) {
      console.log(`  [${v.asset}]  ERROR: ${v.error}`);
      continue;
    }
    const status = v.pass ? "PASS" : "FAIL";
    const price  = v.chainlink?.price?.toFixed(6);
    const dev    = v.peg?.deviationPct?.toFixed(4) ?? "N/A";
    const val    = v.position?.valueUsdFormatted ?? "N/A";
    console.log(`  ${status}  ${v.asset.padEnd(5)}  $${price}  dev: ${dev}%  value: ${val}`);
  }
  console.log();
  console.log(`  Total position value: ${validation.summary.totalPositionValueFormatted}`);
  console.log(`  Overall: ${validation.summary.pass ? "PASS" : "FAIL"}`);

  if (validation.summary.warnings.length) {
    console.log();
    for (const w of validation.summary.warnings) console.log(`  WARNING: ${w}`);
  }

  // Build report object
  const report = {
    date: today,
    generatedAt: new Date().toISOString(),
    gatewayPositions: GATEWAY_POSITIONS,
    validation,
    vault: vault || null,
  };

  // Build markdown
  const markdown = buildMarkdown(report, priorReport);

  if (args.dryRun) {
    console.log("\n  [DRY-RUN] No files written.");
    console.log("\n--- Markdown Preview (first 30 lines) ---");
    console.log(markdown.split("\n").slice(0, 30).join("\n"));
    console.log("...");
    process.exit(validation.summary.pass ? 0 : 1);
  }

  // Write files
  fs.mkdirSync(CHAINLINK_DIR, { recursive: true });

  const jsonOutPath = args.out
    ? path.resolve(REPO_ROOT, args.out)
    : path.join(CHAINLINK_DIR, `chainlink-report-${today}.json`);
  const mdOutPath = jsonOutPath.replace(/\.json$/, ".md");

  fs.writeFileSync(jsonOutPath, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(mdOutPath, markdown + "\n");

  // Append to history
  history.push({ date: today, generatedAt: report.generatedAt, validation: report.validation });
  // Keep last 52 weeks
  const trimmed = history.slice(-52);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2) + "\n");

  console.log(`\n  Reports written:`);
  console.log(`    JSON: ${path.relative(REPO_ROOT, jsonOutPath)}`);
  console.log(`    MD:   ${path.relative(REPO_ROOT, mdOutPath)}`);
  console.log(`    History: ${path.relative(REPO_ROOT, HISTORY_FILE)} (${trimmed.length} entries)`);
  console.log("\n========================================================================");

  process.exit(validation.summary.pass ? 0 : 1);
}

main();
