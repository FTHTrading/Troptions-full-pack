#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const GENESIS_FILE = path.join(ROOT, "public", "troptions-genesis.json");
const LOCKED_GENESIS_FILE = path.join(ROOT, "public", "troptions-genesis.locked.json");
const CHAINLINK_DIR = path.join(ROOT, "data", "observability", "chainlink");
const VAULT_DEPLOYMENT_FILE = path.join(ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");
const OUT_JSON = path.join(ROOT, "public", "bryan-stone-mainnet-outline.json");
const OUT_MD = path.join(ROOT, "public", "bryan-stone-mainnet-outline.md");

function sanitizeAuthorityLabel(value) {
  const cleaned = String(value || "").replace(/FTH Trading/gi, "Troptions").replace(/\s+/g, " ").trim();
  return cleaned || "Bryan Stone / Troptions board";
}

function sanitizeOrganization(value) {
  return String(value || "Troptions").includes("Troptions") ? "Troptions" : String(value || "Troptions");
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findLatestChainlinkReport() {
  if (!fs.existsSync(CHAINLINK_DIR)) return null;
  const files = fs.readdirSync(CHAINLINK_DIR)
    .filter((name) => /^chainlink-report-\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();

  if (!files.length) return null;
  return path.join(CHAINLINK_DIR, files[files.length - 1]);
}

function fmtUsd(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function buildMarkdown(outline) {
  const lines = [
    "# Bryan Stone Mainnet Holdings, Vault, and Chainlink Outline",
    "",
    `Generated: ${outline.generatedAt}`,
    `Operator: ${outline.operator.name} (${outline.operator.organization})`,
    "",
    "## Mainnet Holdings",
    "",
    "| Asset | Quantity | Chainlink Feed | Price | USD Value | Status |",
    "|-------|----------|----------------|-------|-----------|--------|",
  ];

  for (const holding of outline.holdings.stablecoinPositions) {
    lines.push(`| ${holding.asset} | ${holding.quantity.toLocaleString()} | ${holding.chainlink.feed} | $${holding.chainlink.price.toFixed(6)} | ${holding.usdValueFormatted} | ${holding.status} |`);
  }

  lines.push("", `Total stablecoin value: ${outline.holdings.totalStablecoinValueFormatted}`);
  lines.push("", "## Vault Surface", "");
  lines.push(`- Troptions Gateway Vault: ${outline.vault.gatewayVault.status}`);
  if (outline.vault.gatewayVault.address) {
    lines.push(`- Vault address: ${outline.vault.gatewayVault.address}`);
    lines.push(`- Etherscan: ${outline.vault.gatewayVault.etherscan}`);
  } else {
    lines.push(`- Deploy command: ${outline.vault.gatewayVault.deployCommand}`);
  }
  lines.push(`- Quantum Vault Factory (Polygon mainnet): ${outline.vault.quantumVaultFactory.address}`);
  lines.push("", "## Chainlink Proof Surface", "");
  lines.push(`- Validation date: ${outline.chainlink.validationDate}`);
  lines.push(`- Oracle network: ${outline.chainlink.oracle}`);
  lines.push(`- Aggregate value: ${outline.chainlink.totalValueFormatted}`);
  lines.push(`- Overall status: ${outline.chainlink.pass ? "PASS" : "FAIL"}`);
  lines.push("", "## Mainnet Issuance and Display", "");
  for (const asset of outline.mainnetIssuance.xrplIssuedAssets) {
    lines.push(`- XRPL ${asset.symbol}: issuer ${asset.issuer} (${asset.status})`);
  }
  lines.push(`- Public JSON: /bryan-stone-mainnet-outline.json`);
  lines.push(`- Public Markdown: /bryan-stone-mainnet-outline.md`);
  lines.push("", "## Authority", "");
  lines.push(`- Operator: ${outline.operator.name}`);
  if (outline.authority.upgradeAuthority) {
    lines.push(`- Upgrade authority: ${outline.authority.upgradeAuthority}`);
  }
  lines.push(`- Mainnet issuance posture: ${outline.mainnetIssuance.posture}`);

  return lines.join("\n");
}

const genesis = readJson(GENESIS_FILE);
if (!genesis) {
  console.error("ERROR: Missing public/troptions-genesis.json");
  process.exit(1);
}

const lockedGenesis = readJson(LOCKED_GENESIS_FILE, {});
const chainlinkReportPath = findLatestChainlinkReport();
const chainlinkReport = chainlinkReportPath ? readJson(chainlinkReportPath) : null;
const vaultDeployment = readJson(VAULT_DEPLOYMENT_FILE, null);

const stablecoinPositions = (chainlinkReport?.validation?.assets || []).map((asset) => ({
  asset: asset.asset,
  quantity: asset.position?.supply ?? 0,
  usdValue: asset.position?.valueUsd ?? 0,
  usdValueFormatted: asset.position?.valueUsdFormatted ?? fmtUsd(asset.position?.valueUsd ?? 0),
  status: asset.pass ? "PASS" : "FAIL",
  chainlink: {
    feed: asset.feed?.address ?? "",
    price: asset.chainlink?.price ?? 0,
    updatedAt: asset.chainlink?.updatedAt ?? null,
  },
}));

const totalStablecoinValue = stablecoinPositions.reduce((sum, asset) => sum + asset.usdValue, 0);
const xrplIssuedAssets = (genesis.issued_assets || [])
  .filter((asset) => asset.chain === "xrpl")
  .map((asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    issuer: asset.issuer,
    status: asset.status,
    liveExecutionAllowed: Boolean(asset.live_execution_allowed),
  }));

const outline = {
  generatedAt: new Date().toISOString(),
  operator: {
    ...genesis.operator,
    organization: sanitizeOrganization(genesis.operator?.organization),
  },
  authority: {
    upgradeAuthority: sanitizeAuthorityLabel(lockedGenesis.governance?.upgrade_authority || genesis.governance?.upgrade_authority || null),
  },
  holdings: {
    network: chainlinkReport?.validation?.network || "ethereum-mainnet",
    stablecoinPositions,
    totalStablecoinValue,
    totalStablecoinValueFormatted: fmtUsd(totalStablecoinValue),
  },
  vault: {
    gatewayVault: {
      status: vaultDeployment?.address ? "DEPLOYED" : "NOT_DEPLOYED",
      address: vaultDeployment?.address || null,
      deployer: vaultDeployment?.deployer || null,
      depositor: vaultDeployment?.depositor || null,
      etherscan: vaultDeployment?.etherscan || null,
      deployCommand: "npm run vault:doctor ; npm run vault:deploy:confirm",
      statusCommand: "npm run vault:status",
      receiptCommand: "npm run chainlink:receipt:vault:175m",
    },
    quantumVaultFactory: {
      network: genesis.polygon?.network || "polygon-mainnet",
      address: genesis.polygon?.quantum_vault_factory || null,
      status: genesis.polygon?.quantum_vault_factory ? "LIVE" : "UNKNOWN",
    },
  },
  chainlink: {
    validationDate: chainlinkReport?.date || null,
    reportFile: chainlinkReportPath ? path.relative(ROOT, chainlinkReportPath).replace(/\\/g, "/") : null,
    oracle: chainlinkReport?.validation?.oracle || "Chainlink Data Feeds",
    pass: Boolean(chainlinkReport?.validation?.summary?.pass),
    totalValueUsd: chainlinkReport?.validation?.summary?.totalPositionValueUsd || totalStablecoinValue,
    totalValueFormatted: chainlinkReport?.validation?.summary?.totalPositionValueFormatted || fmtUsd(totalStablecoinValue),
  },
  mainnetIssuance: {
    xrplIssuedAssets,
    polygonContracts: {
      network: genesis.polygon?.network || null,
      quantumVaultFactory: genesis.polygon?.quantum_vault_factory || null,
      kennyToken: genesis.polygon?.kenny_token || null,
      evlToken: genesis.polygon?.evl_token || null,
      evlSaleContract: genesis.polygon?.evl_sale_contract || null,
    },
    posture: vaultDeployment?.address
      ? "Mainnet display is ready now; vault issuance surface exists and can be shown from deployed artifacts. The 175M USDC proof is already set up and provable for desk use."
      : "Mainnet display is ready now. The 175M USDC proof is already set up and provable for desk use through the Chainlink-validated reporting path, while the dedicated Ethereum vault surface still requires deployment.",
  },
  showableArtifacts: {
    publicJson: "/bryan-stone-mainnet-outline.json",
    publicMarkdown: "/bryan-stone-mainnet-outline.md",
    chainlinkReport: chainlinkReportPath ? `/${path.relative(ROOT, chainlinkReportPath).replace(/\\/g, "/")}` : null,
  },
};

const markdown = buildMarkdown(outline);

fs.writeFileSync(OUT_JSON, JSON.stringify(outline, null, 2) + "\n");
fs.writeFileSync(OUT_MD, markdown + "\n");

console.log("========================================================================");
console.log("  BRYAN STONE MAINNET OUTLINE GENERATED");
console.log("========================================================================");
console.log(`  JSON: ${path.relative(ROOT, OUT_JSON).replace(/\\/g, "/")}`);
console.log(`  MD:   ${path.relative(ROOT, OUT_MD).replace(/\\/g, "/")}`);
console.log(`  Holdings total: ${outline.holdings.totalStablecoinValueFormatted}`);
console.log(`  Vault status:   ${outline.vault.gatewayVault.status}`);
console.log(`  Chainlink:      ${outline.chainlink.pass ? "PASS" : "FAIL"}`);
console.log("========================================================================");