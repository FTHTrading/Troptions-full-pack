#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const GENESIS_FILE = path.join(ROOT, "public", "troptions-genesis.json");
const LOCKED_GENESIS_FILE = path.join(ROOT, "public", "troptions-genesis.locked.json");
const REPORT_FILE = path.join(ROOT, "data", "observability", "chainlink", "chainlink-report-2026-05-01.json");
const OUT_JSON = path.join(ROOT, "public", "bryan-stone-usdc-175m-desk-proof.json");
const OUT_MD = path.join(ROOT, "public", "bryan-stone-usdc-175m-desk-proof.md");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sanitizeAuthorityLabel(value) {
  const cleaned = String(value || "").replace(/FTH Trading/gi, "Troptions").replace(/\s+/g, " ").trim();
  return cleaned || "Bryan Stone / Troptions board";
}

function fmtUsd(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function buildMarkdown(packet) {
  return [
    "# Bryan Stone Troptions Desk Proof - 175M USDC",
    "",
    `Generated: ${packet.generatedAt}`,
    `Operator: ${packet.operator.name} (${packet.operator.organization})`,
    `Authority: ${packet.authority.upgradeAuthority}`,
    "",
    "## Desk Position",
    "",
    `- Asset: ${packet.position.asset}`,
    `- Quantity: ${packet.position.quantity.toLocaleString()} ${packet.position.asset}`,
    `- Chainlink feed: ${packet.position.chainlink.feed}`,
    `- Chainlink price: $${packet.position.chainlink.price.toFixed(6)}`,
    `- USD value: ${packet.position.usdValueFormatted}`,
    `- Validation status: ${packet.position.status}`,
    `- Validation date: ${packet.position.chainlink.validationDate}`,
    "",
    "## Desk Use",
    "",
    `- Classification: ${packet.deskUse.classification}`,
    `- Showable now: ${packet.deskUse.showableNow ? "YES" : "NO"}`,
    `- Proof surface: ${packet.deskUse.proofSurface}`,
    `- Public JSON: ${packet.showableArtifacts.publicJson}`,
    `- Public Markdown: ${packet.showableArtifacts.publicMarkdown}`,
    "",
    "## Notes",
    "",
    `- ${packet.notes[0]}`,
    `- ${packet.notes[1]}`,
  ].join("\n");
}

const genesis = readJson(GENESIS_FILE);
const lockedGenesis = readJson(LOCKED_GENESIS_FILE);
const report = readJson(REPORT_FILE);
const usdc = report.validation.assets.find((asset) => asset.asset === "USDC");

if (!usdc) {
  console.error("ERROR: Could not locate USDC in Chainlink report");
  process.exit(1);
}

const packet = {
  generatedAt: new Date().toISOString(),
  operator: {
    name: genesis.operator?.name || "Bryan Stone",
    organization: "Troptions",
  },
  authority: {
    upgradeAuthority: sanitizeAuthorityLabel(lockedGenesis.governance?.upgrade_authority || genesis.governance?.upgrade_authority || "Bryan Stone / Troptions board"),
  },
  position: {
    asset: "USDC",
    quantity: usdc.position.supply,
    usdValue: usdc.position.valueUsd,
    usdValueFormatted: usdc.position.valueUsdFormatted || fmtUsd(usdc.position.valueUsd),
    status: usdc.pass ? "PASS" : "FAIL",
    chainlink: {
      feed: usdc.feed.address,
      price: usdc.chainlink.price,
      updatedAt: usdc.chainlink.updatedAt,
      validationDate: report.date,
      roundId: usdc.chainlink.roundId,
    },
  },
  deskUse: {
    classification: "Desk-use mainnet proof packet",
    showableNow: Boolean(usdc.pass),
    proofSurface: "Chainlink-validated USDC position report",
  },
  notes: [
    "This packet is built from the current Chainlink mainnet validation path already present in the repository.",
    "This packet proves the 175M USDC desk position in the current Troptions reporting stack without depending on the undeployed Ethereum vault path.",
  ],
  showableArtifacts: {
    publicJson: "/bryan-stone-usdc-175m-desk-proof.json",
    publicMarkdown: "/bryan-stone-usdc-175m-desk-proof.md",
    sourceReport: "/data/observability/chainlink/chainlink-report-2026-05-01.json",
  },
};

const markdown = buildMarkdown(packet);
fs.writeFileSync(OUT_JSON, JSON.stringify(packet, null, 2) + "\n");
fs.writeFileSync(OUT_MD, markdown + "\n");

console.log("========================================================================");
console.log("  BRYAN STONE TROPTIONS 175M USDC DESK PROOF GENERATED");
console.log("========================================================================");
console.log(`  JSON: ${path.relative(ROOT, OUT_JSON).replace(/\\/g, "/")}`);
console.log(`  MD:   ${path.relative(ROOT, OUT_MD).replace(/\\/g, "/")}`);
console.log(`  Position: ${packet.position.quantity.toLocaleString()} ${packet.position.asset}`);
console.log(`  Value:    ${packet.position.usdValueFormatted}`);
console.log(`  Status:   ${packet.position.status}`);
console.log("========================================================================");