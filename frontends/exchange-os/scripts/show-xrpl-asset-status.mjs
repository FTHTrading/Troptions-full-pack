#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowlistPath = path.join(__dirname, "config", "xrpl-asset-allowlist.json");

function parseArgs(argv) {
  const args = { asset: "USDC", allowlist: allowlistPath, json: false };
  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--asset" && argv[i + 1]) args.asset = argv[++i].toUpperCase();
    else if (cur === "--allowlist" && argv[i + 1]) args.allowlist = argv[++i];
    else if (cur === "--json") args.json = true;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = JSON.parse(fs.readFileSync(args.allowlist, "utf8"));
  const item = cfg.assets.find((a) => a.symbol === args.asset);

  if (!item) {
    console.error(`Asset ${args.asset} not found in ${args.allowlist}`);
    process.exit(1);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    version: cfg.version,
    asset: item.symbol,
    currencyHex: item.currencyHex,
    status: item.status || "active",
    approvedIssuers: item.approvedIssuers || [],
    sources: item.sources || [],
  };

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log("\nXRPL Asset Allowlist Status");
  console.log("=".repeat(72));
  console.log(`Asset: ${payload.asset}`);
  console.log(`CurrencyHex: ${payload.currencyHex}`);
  console.log(`Status: ${payload.status}`);
  console.log("Approved issuers:");
  for (const issuer of payload.approvedIssuers) {
    console.log(`  - [${issuer.class}] ${issuer.label}: ${issuer.address}`);
  }
  if (payload.approvedIssuers.length === 0) console.log("  - none configured");
}

main();
