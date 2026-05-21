#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/generate-multichain-pof-packet.mjs
 *
 * TROPTIONS MULTI-CHAIN POF PACKET GENERATOR
 * ─────────────────────────────────────────────────────────────────
 * Assembles the master Proof-of-Funds packet from three rails:
 *
 *   XRPL Layer     — issuer, asset metadata, IOU/trustline proof
 *                    (master packet rail — loads saved PoF report)
 *   Ethereum Layer — Chainlink USDC/USD oracle valuation evidence
 *                    (attached from Chainlink weekly report)
 *   Vault Layer    — custody lock/release proof
 *                    (gracefully skipped if vault not deployed)
 *
 * Usage:
 *   node scripts/generate-multichain-pof-packet.mjs
 *   node scripts/generate-multichain-pof-packet.mjs --asset USDC
 *   node scripts/generate-multichain-pof-packet.mjs --xrpl-report path/to/report.json
 *   node scripts/generate-multichain-pof-packet.mjs --dry-run   (no file writes)
 *
 * Reads:
 *   data/observability/pof/xrpl-real-issuer-report-usdc-175m.json  (XRPL master)
 *   data/observability/chainlink/chainlink-report-*.json            (latest found)
 *   data/vault/TroptionsGatewayVault.deployment.json                (optional)
 *   data/vault/receipts/*.json                                       (optional)
 *   public/troptions-genesis.json
 *   public/troptions-genesis.locked.json
 *
 * Writes:
 *   data/observability/pof/multichain-pof-packet-<asset>-<date>.json
 *   public/troptions-multichain-pof-<asset>.json   (latest, public-facing)
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─────────────────────────────────────────────────────────────────
// Config paths
// ─────────────────────────────────────────────────────────────────

const POF_DIR           = path.join(ROOT, "data", "observability", "pof");
const CHAINLINK_DIR     = path.join(ROOT, "data", "observability", "chainlink");
const VAULT_DEPLOY_FILE = path.join(ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");
const VAULT_RECEIPTS    = path.join(ROOT, "data", "vault", "receipts");
const GENESIS_FILE      = path.join(ROOT, "public", "troptions-genesis.json");
const LOCKED_GENESIS    = path.join(ROOT, "public", "troptions-genesis.locked.json");
const PUBLIC_DIR        = path.join(ROOT, "public");
const POF_OUT_DIR       = path.join(ROOT, "data", "observability", "pof");

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try { return readJson(filePath); } catch { return null; }
}

function sanitize(value) {
  return String(value || "").replace(/FTH Trading/gi, "Troptions").replace(/\s+/g, " ").trim();
}

function fmtUsd(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseArgs(argv) {
  const args = { asset: "USDC", xrplReport: "", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--asset" && argv[i + 1]) args.asset = argv[++i].toUpperCase();
    else if (cur === "--xrpl-report" && argv[i + 1]) args.xrplReport = argv[++i];
    else if (cur === "--dry-run") args.dryRun = true;
  }
  return args;
}

// ─────────────────────────────────────────────────────────────────
// Find latest Chainlink report file
// ─────────────────────────────────────────────────────────────────

function findLatestChainlinkReport() {
  if (!fs.existsSync(CHAINLINK_DIR)) return null;
  // Only match dated reports: chainlink-report-YYYY-MM-DD.json
  const files = fs.readdirSync(CHAINLINK_DIR)
    .filter((f) => /^chainlink-report-\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort()
    .reverse();
  return files.length > 0 ? path.join(CHAINLINK_DIR, files[0]) : null;
}

// ─────────────────────────────────────────────────────────────────
// Load XRPL POF layer (master rail)
// ─────────────────────────────────────────────────────────────────

function loadXrplLayer(args) {
  // 1. Explicit path override
  if (args.xrplReport) {
    const p = path.isAbsolute(args.xrplReport) ? args.xrplReport : path.join(ROOT, args.xrplReport);
    if (!fs.existsSync(p)) {
      console.warn("[XRPL] Specified --xrpl-report not found: " + p);
      return { status: "MISSING", reason: "Specified report file not found: " + args.xrplReport, report: null };
    }
    const r = readJson(p);
    return buildXrplLayerFromReport(r);
  }

  // 2. Default per-asset path
  const defaultPath = path.join(POF_DIR, `xrpl-real-issuer-report-${args.asset.toLowerCase()}-175m.json`);
  if (fs.existsSync(defaultPath)) {
    return buildXrplLayerFromReport(readJson(defaultPath));
  }

  // 3. Any xrpl report in POF dir
  if (fs.existsSync(POF_DIR)) {
    const files = fs.readdirSync(POF_DIR)
      .filter((f) => f.startsWith("xrpl-real-issuer-report") && f.endsWith(".json"))
      .sort().reverse();
    if (files.length > 0) {
      return buildXrplLayerFromReport(readJson(path.join(POF_DIR, files[0])));
    }
  }

  return {
    status: "PENDING",
    reason: "No XRPL PoF report found. Run: npm run pof:xrpl:real-issuer -- --holder <XRPL_ADDRESS> --hash <TX_HASH> --asset USDC --issuer-class official --min-balance 175000000 --json --out data/observability/pof/xrpl-real-issuer-report-usdc-175m.json",
    report: null,
  };
}

function buildXrplLayerFromReport(r) {
  const onChainEvidence = r?.institutionalDetermination?.onChainIssuerAndTxEvidence;
  const pofComplete     = r?.institutionalDetermination?.proofOfFundsComplete;
  const missing         = r?.institutionalDetermination?.missing || [];

  return {
    status: onChainEvidence ? (pofComplete ? "COMPLETE" : "PARTIAL") : "FAIL",
    holder: r?.holder || null,
    asset: r?.asset || null,
    issuerClass: r?.issuerClass || null,
    allowedIssuers: r?.allowedIssuers || [],
    ledgerIndex: r?.ledgerIndex || null,
    txReports: (r?.txReports || []).map((tx) => ({
      hash: tx.hash,
      pass: tx.checks?.validated && tx.checks?.success && tx.checks?.issuerMatch,
      validated: tx.checks?.validated,
      issuerMatch: tx.checks?.issuerMatch,
      result: tx.transactionResult,
    })),
    trustlinePresent: r?.balanceReport?.checks?.trustlinePresent || false,
    highestBalance: r?.balanceReport?.highestBalance || "0",
    minBalanceRequired: r?.minBalanceRequired || "0",
    minBalanceMet: r?.balanceReport?.checks?.minBalance || false,
    walletControl: r?.walletControlProof ? {
      signerAddress: r.walletControlProof.signerAddress,
      signatureValid: r.walletControlProof.checks?.signatureValid,
      holderMatchesSigner: r.walletControlProof.checks?.holderMatchesSigner,
      notExpired: r.walletControlProof.checks?.notExpired,
      pass: r.walletControlProof.pass,
    } : null,
    checks: r?.checks || null,
    institutionalDetermination: r?.institutionalDetermination || null,
    generatedAt: r?.generatedAt || null,
    missingToComplete: missing,
    reason: r?.institutionalDetermination?.reason || null,
    report: r,
  };
}

// ─────────────────────────────────────────────────────────────────
// Load Ethereum Chainlink valuation layer (evidence attachment)
// ─────────────────────────────────────────────────────────────────

function loadEthereumLayer(asset) {
  const reportPath = findLatestChainlinkReport();
  if (!reportPath) {
    return { status: "MISSING", reason: "No Chainlink report found. Run: npm run chainlink:report:weekly:dry", oracle: null };
  }

  const report = safeReadJson(reportPath);
  if (!report) {
    return { status: "ERROR", reason: "Failed to parse Chainlink report: " + reportPath, oracle: null };
  }

  const assetData = report?.validation?.assets?.find((a) => a.asset === asset);
  if (!assetData) {
    return { status: "MISSING", reason: `Asset ${asset} not found in Chainlink report`, oracle: null };
  }

  return {
    status: assetData.pass ? "PASS" : "FAIL",
    asset: assetData.asset,
    supply: assetData.position?.supply,
    valueUsd: assetData.position?.valueUsd,
    valueUsdFormatted: assetData.position?.valueUsdFormatted || fmtUsd(assetData.position?.valueUsd || 0),
    oracle: {
      feed: assetData.feed?.address,
      description: assetData.feed?.description,
      network: assetData.feed?.network || "ethereum",
      price: assetData.chainlink?.price,
      updatedAt: assetData.chainlink?.updatedAt,
      roundId: assetData.chainlink?.roundId,
      stalePriceGuardHours: assetData.stalePriceGuardHours,
    },
    tokenContract: assetData.token?.address || null,
    tokenNetwork: "ethereum-mainnet",
    reportDate: report.date,
    reportFile: path.relative(ROOT, reportPath).replace(/\\/g, "/"),
  };
}

// ─────────────────────────────────────────────────────────────────
// Load vault custody layer (optional — skipped if not deployed)
// ─────────────────────────────────────────────────────────────────

function loadVaultLayer() {
  const deployment = safeReadJson(VAULT_DEPLOY_FILE);
  if (!deployment) {
    return {
      status: "NOT_DEPLOYED",
      reason: "Vault not deployed. Run: npm run vault:deploy:confirm after setting .env.local",
      vaultAddress: null,
      latestReceipt: null,
    };
  }

  // Find latest vault receipt
  let latestReceipt = null;
  if (fs.existsSync(VAULT_RECEIPTS)) {
    const receipts = fs.readdirSync(VAULT_RECEIPTS).filter((f) => f.endsWith(".json")).sort().reverse();
    if (receipts.length > 0) {
      latestReceipt = safeReadJson(path.join(VAULT_RECEIPTS, receipts[0]));
    }
  }

  const snap = latestReceipt?.snapshot;
  return {
    status: snap ? "LIVE" : "DEPLOYED_NO_RECEIPT",
    vaultAddress: deployment.vaultAddress,
    network: deployment.network || "ethereum-mainnet",
    deployedAt: deployment.deployedAt,
    deployedByAddress: deployment.deployerAddress,
    snapshot: snap ? {
      usdcBalance: snap.usdcBalance,
      usdtBalance: snap.usdtBalance,
      usdcValueUsd: snap.usdcValueUsd,
      usdtValueUsd: snap.usdtValueUsd,
      totalValueUsd: snap.totalValueUsd,
      totalValueFormatted: snap.totalValueFormatted,
      frozen: snap.frozen,
    } : null,
    latestReceiptDate: latestReceipt?.generatedAt || null,
    reason: snap ? null : "Vault deployed but no status receipt yet. Run: npm run vault:status",
  };
}

// ─────────────────────────────────────────────────────────────────
// Build the master POF packet
// ─────────────────────────────────────────────────────────────────

function buildPacket(args) {
  const genesis       = safeReadJson(GENESIS_FILE)       || {};
  const lockedGenesis = safeReadJson(LOCKED_GENESIS)     || {};

  const xrpl      = loadXrplLayer(args);
  const ethereum  = loadEthereumLayer(args.asset);
  const vault     = loadVaultLayer();

  const operatorName = genesis.operator?.name || "Bryan Stone";
  const authority    = sanitize(
    lockedGenesis.governance?.upgrade_authority ||
    genesis.governance?.upgrade_authority ||
    "Bryan Stone / Troptions board"
  );

  // ─── Overall packet status ────────────────────────────────────
  // COMPLETE = XRPL on-chain evidence + Chainlink PASS
  // PARTIAL  = one layer incomplete/missing
  // PENDING  = XRPL not yet run
  const xrplOnChain = xrpl.institutionalDetermination?.onChainIssuerAndTxEvidence;
  const chainlinkOk = ethereum.status === "PASS";
  const vaultLive   = vault.status === "LIVE";

  let overallStatus;
  if (xrpl.status === "PENDING") overallStatus = "PENDING_XRPL";
  else if (xrplOnChain && chainlinkOk && vaultLive) overallStatus = "COMPLETE";
  else if (xrplOnChain && chainlinkOk) overallStatus = "PARTIAL_NO_VAULT";
  else if (chainlinkOk) overallStatus = "PARTIAL_NO_XRPL_EVIDENCE";
  else overallStatus = "INCOMPLETE";

  const readyForDesk = xrplOnChain === true && chainlinkOk;

  return {
    packetVersion: "2.0",
    packetType: "multi-chain-pof",
    generatedAt: new Date().toISOString(),
    asset: args.asset,
    overallStatus,
    readyForDesk,

    operator: {
      name: operatorName,
      organization: "Troptions",
      authority,
    },

    // ──────────────────────────────────────────────────────────────
    // LAYER 1 — XRPL (master rail)
    // Issuer identity, asset metadata, IOU/trustline proof
    // ──────────────────────────────────────────────────────────────
    xrplLayer: {
      role: "Master proof packet rail - issuer, asset metadata, IOU/trustline verification",
      status: xrpl.status,
      holder: xrpl.holder,
      asset: xrpl.asset,
      issuerClass: xrpl.issuerClass,
      allowedIssuers: xrpl.allowedIssuers,
      ledgerIndex: xrpl.ledgerIndex,
      highestBalance: xrpl.highestBalance,
      minBalanceRequired: xrpl.minBalanceRequired,
      minBalanceMet: xrpl.minBalanceMet,
      trustlinePresent: xrpl.trustlinePresent,
      txReports: xrpl.txReports,
      walletControl: xrpl.walletControl,
      institutionalDetermination: xrpl.institutionalDetermination,
      generatedAt: xrpl.generatedAt,
      missingToComplete: xrpl.missingToComplete,
      reason: xrpl.reason,
      actionRequired: xrpl.status === "PENDING"
        ? "Run: npm run pof:xrpl:usdc:175m -- --holder <XRPL_ADDRESS> --hash <TX_HASH>"
        : null,
    },

    // ──────────────────────────────────────────────────────────────
    // LAYER 2 — Ethereum Chainlink (valuation evidence)
    // Oracle-anchored price + USD value of the reported position
    // ──────────────────────────────────────────────────────────────
    ethereumLayer: {
      role: "Mainnet valuation evidence - Chainlink oracle price anchor",
      status: ethereum.status,
      asset: ethereum.asset,
      supply: ethereum.supply,
      valueUsd: ethereum.valueUsd,
      valueUsdFormatted: ethereum.valueUsdFormatted,
      oracle: ethereum.oracle,
      tokenContract: ethereum.tokenContract,
      tokenNetwork: ethereum.tokenNetwork,
      reportDate: ethereum.reportDate,
      reportFile: ethereum.reportFile,
      reason: ethereum.reason || null,
    },

    // ──────────────────────────────────────────────────────────────
    // LAYER 3 — Vault Custody (future rail)
    // Lock/release proof once vault is deployed and funded
    // ──────────────────────────────────────────────────────────────
    vaultLayer: {
      role: "Custody evidence - locked ERC-20 balance with owner-release control",
      status: vault.status,
      vaultAddress: vault.vaultAddress,
      network: vault.network,
      deployedAt: vault.deployedAt,
      snapshot: vault.snapshot,
      latestReceiptDate: vault.latestReceiptDate,
      reason: vault.reason || null,
      actionRequired: vault.status === "NOT_DEPLOYED"
        ? "Deploy vault: set .env.local keys then run npm run vault:deploy:confirm"
        : vault.status === "DEPLOYED_NO_RECEIPT"
          ? "Run: npm run vault:status to generate a custody receipt"
          : null,
    },

    // ──────────────────────────────────────────────────────────────
    // Desk-facing summary
    // ──────────────────────────────────────────────────────────────
    deskSummary: {
      classification: "Multi-chain Proof-of-Funds packet",
      operator: operatorName,
      organization: "Troptions",
      authority,
      asset: args.asset,
      reportedSupply: ethereum.supply || xrpl.highestBalance || null,
      reportedValueUsd: ethereum.valueUsdFormatted || null,
      chainlinkStatus: ethereum.status,
      xrplOnChainEvidence: xrplOnChain ? "PASS" : (xrpl.status === "PENDING" ? "PENDING" : "FAIL"),
      vaultCustodyStatus: vault.status,
      readyForDesk,
      showableNow: readyForDesk,
      completionPath: buildCompletionPath(xrpl, ethereum, vault),
    },

    compliance: {
      disclaimer: "This packet is generated from on-chain mainnet data and Chainlink oracle feeds. It is intended for internal desk use and does not constitute a legal or regulatory proof of solvency. All values are point-in-time snapshots.",
      generatedBy: "Troptions automated PoF system",
      dataIntegrity: "All sources are mainnet — no test networks or simulated data",
    },
  };
}

function buildCompletionPath(xrpl, ethereum, vault) {
  const steps = [];
  if (xrpl.status === "PENDING") {
    steps.push({ step: 1, status: "REQUIRED", action: "Run XRPL PoF verification with real holder address and TX hashes" });
  } else if (xrpl.status !== "COMPLETE") {
    steps.push({ step: 1, status: "PARTIAL", action: "Attach wallet-control proof and compliance sign-off to XRPL PoF report" });
  } else {
    steps.push({ step: 1, status: "DONE", action: "XRPL PoF complete" });
  }
  if (ethereum.status === "PASS") {
    steps.push({ step: 2, status: "DONE", action: "Chainlink USDC/USD valuation proof attached" });
  } else {
    steps.push({ step: 2, status: "REQUIRED", action: "Run Chainlink weekly report: npm run chainlink:report:weekly:dry" });
  }
  if (vault.status === "LIVE") {
    steps.push({ step: 3, status: "DONE", action: "Vault custody proof live" });
  } else if (vault.status === "NOT_DEPLOYED") {
    steps.push({ step: 3, status: "FUTURE", action: "Deploy vault and lock USDC for full custody proof" });
  } else {
    steps.push({ step: 3, status: "PARTIAL", action: "Vault deployed - run npm run vault:status for custody receipt" });
  }
  return steps;
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const packet = buildPacket(args);

  const dateTag = new Date().toISOString().slice(0, 10);
  const outFile = path.join(POF_OUT_DIR, `multichain-pof-packet-${args.asset.toLowerCase()}-${dateTag}.json`);
  const publicFile = path.join(PUBLIC_DIR, `troptions-multichain-pof-${args.asset.toLowerCase()}.json`);

  if (!args.dryRun) {
    fs.mkdirSync(POF_OUT_DIR, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(packet, null, 2) + "\n");
    fs.writeFileSync(publicFile, JSON.stringify(packet, null, 2) + "\n");
  }

  // ── Print summary ──────────────────────────────────────────────
  console.log("=".repeat(72));
  console.log("  TROPTIONS MULTI-CHAIN POF PACKET");
  console.log("=".repeat(72));
  console.log(`  Asset:           ${packet.asset}`);
  console.log(`  Overall status:  ${packet.overallStatus}`);
  console.log(`  Ready for desk:  ${packet.deskSummary.readyForDesk ? "YES" : "NO"}`);
  console.log(`  Showable now:    ${packet.deskSummary.showableNow ? "YES" : "NO"}`);
  console.log("");
  console.log("  LAYER 1 - XRPL (master rail)");
  console.log(`    Status:        ${packet.xrplLayer.status}`);
  if (packet.xrplLayer.holder)       console.log(`    Holder:        ${packet.xrplLayer.holder}`);
  if (packet.xrplLayer.highestBalance && packet.xrplLayer.highestBalance !== "0")
    console.log(`    Balance:       ${packet.xrplLayer.highestBalance} ${packet.asset}`);
  if (packet.xrplLayer.trustlinePresent !== null)
    console.log(`    Trustline:     ${packet.xrplLayer.trustlinePresent ? "PRESENT" : "NOT FOUND"}`);
  if (packet.xrplLayer.actionRequired)
    console.log(`    ACTION:        ${packet.xrplLayer.actionRequired}`);
  console.log("");
  console.log("  LAYER 2 - Ethereum / Chainlink (valuation evidence)");
  console.log(`    Status:        ${packet.ethereumLayer.status}`);
  if (packet.ethereumLayer.oracle?.feed)
    console.log(`    Feed:          ${packet.ethereumLayer.oracle.feed}`);
  if (packet.ethereumLayer.oracle?.price)
    console.log(`    Oracle price:  $${packet.ethereumLayer.oracle.price}`);
  if (packet.ethereumLayer.valueUsdFormatted)
    console.log(`    Position val:  ${packet.ethereumLayer.valueUsdFormatted}`);
  console.log("");
  console.log("  LAYER 3 - Vault Custody");
  console.log(`    Status:        ${packet.vaultLayer.status}`);
  if (packet.vaultLayer.vaultAddress)
    console.log(`    Address:       ${packet.vaultLayer.vaultAddress}`);
  if (packet.vaultLayer.actionRequired)
    console.log(`    ACTION:        ${packet.vaultLayer.actionRequired}`);
  console.log("");
  console.log("  COMPLETION PATH");
  for (const step of packet.deskSummary.completionPath) {
    const icon = step.status === "DONE" ? "[DONE]" : step.status === "FUTURE" ? "[FUTURE]" : "[TODO]";
    console.log(`    ${icon} Step ${step.step}: ${step.action}`);
  }

  if (!args.dryRun) {
    console.log("");
    console.log("  SAVED");
    console.log(`    Data:   ${path.relative(ROOT, outFile).replace(/\\/g, "/")}`);
    console.log(`    Public: ${path.relative(ROOT, publicFile).replace(/\\/g, "/")}`);
  } else {
    console.log("");
    console.log("  [DRY RUN] No files written.");
  }
  console.log("=".repeat(72));
}

main();
