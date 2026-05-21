#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_RPCS = ["https://s1.ripple.com:51234/", "https://xrplcluster.com/"];

function parseArgs(argv) {
  const args = {
    hashes: [],
    asset: "USDC",
    issuerClass: "official",
    allowlist: path.join(__dirname, "config", "xrpl-asset-allowlist.json"),
    rpcs: [...DEFAULT_RPCS],
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--hash" && argv[i + 1]) args.hashes.push(argv[++i].toUpperCase());
    else if (cur === "--asset" && argv[i + 1]) args.asset = argv[++i].toUpperCase();
    else if (cur === "--issuer-class" && argv[i + 1]) args.issuerClass = argv[++i].toLowerCase();
    else if (cur === "--allowlist" && argv[i + 1]) args.allowlist = argv[++i];
    else if (cur === "--rpc" && argv[i + 1]) args.rpcs = argv[++i].split(",").map((v) => v.trim()).filter(Boolean);
    else if (cur === "--json") args.json = true;
  }

  return args;
}

function decodeCurrency(currency) {
  if (!currency) return "";
  if (/^[A-Z0-9]{3}$/.test(currency)) return currency;
  if (!/^[0-9A-Fa-f]{40}$/.test(currency)) return currency;
  const bytes = currency.match(/.{2}/g)?.map((h) => Number.parseInt(h, 16)) ?? [];
  const ascii = bytes.filter((b) => b !== 0).map((b) => String.fromCharCode(b)).join("");
  return ascii || currency;
}

async function callRpc(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (data?.result?.error) throw new Error(`RPC ${data.result.error}: ${data.result.error_message || ""}`.trim());
  return data;
}

async function getTx(hash, rpcs) {
  let lastErr = "";
  for (const rpc of rpcs) {
    try {
      const data = await callRpc(rpc, { method: "tx", params: [{ transaction: hash }] });
      return { rpc, result: data.result };
    } catch (err) {
      lastErr = `${rpc} -> ${err.message}`;
    }
  }
  throw new Error(`All RPC calls failed. Last error: ${lastErr}`);
}

function extractObserved(result) {
  const tx = result.tx_json || result;
  const observed = {
    transactionType: tx.TransactionType,
    hash: tx.hash || result.hash,
    account: tx.Account,
    destination: tx.Destination,
    validated: result.validated,
    transactionResult: result.meta?.TransactionResult,
    amount: tx.Amount || null,
    deliverMax: tx.DeliverMax || null,
    deliveredAmount: result.meta?.delivered_amount || null,
    limitAmount: tx.LimitAmount || null,
  };

  const candidates = [];
  const pushCandidate = (node, field) => {
    if (node && typeof node === "object" && node.issuer && node.currency) {
      candidates.push({
        field,
        issuer: node.issuer,
        currency: node.currency,
        currencyDecoded: decodeCurrency(node.currency),
        value: node.value ?? null,
      });
    }
  };

  pushCandidate(observed.amount, "Amount");
  pushCandidate(observed.deliverMax, "DeliverMax");
  pushCandidate(observed.deliveredAmount, "meta.delivered_amount");
  pushCandidate(observed.limitAmount, "LimitAmount");

  return { observed, candidates };
}

function evaluate(candidates, asset, issuerList, issuerClass) {
  const activeIssuers = issuerClass === "any"
    ? issuerList
    : issuerList.filter((i) => i.class === issuerClass);

  const allowed = new Set(activeIssuers.map((i) => i.address));
  const assetCandidates = candidates.filter((c) => c.currencyDecoded === asset || c.currency === asset);
  const matching = assetCandidates.filter((c) => allowed.has(c.issuer));

  return {
    asset,
    issuerClass,
    allowedIssuers: [...allowed],
    assetCandidates,
    matching,
    pass: matching.length > 0,
  };
}

function printHuman(summary) {
  console.log("\nXRPL Issuer Proof Report");
  console.log("=".repeat(72));
  console.log(`Asset: ${summary.asset}`);
  console.log(`Issuer class check: ${summary.issuerClass}`);
  console.log(`Hash: ${summary.hash}`);
  console.log(`RPC Source: ${summary.rpc}`);
  console.log(`Tx Type: ${summary.transactionType}`);
  console.log(`Validated: ${summary.validated}`);
  console.log(`Result: ${summary.transactionResult}`);
  console.log(`Status: ${summary.pass ? "PASS" : "FAIL"}`);
  console.log("Allowed issuers:");
  for (const issuer of summary.allowedIssuers) console.log(`  - ${issuer}`);
  if (summary.assetCandidates.length === 0) {
    console.log("Observed asset fields: none matched requested asset symbol/currency.");
  } else {
    console.log("Observed asset fields:");
    for (const c of summary.assetCandidates) {
      console.log(`  - ${c.field}: ${c.currencyDecoded} issuer=${c.issuer} value=${c.value}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.hashes.length === 0) {
    console.error("Usage: node scripts/xrpl-verify-issuer-proof.mjs --hash <TX_HASH> [--hash <TX_HASH2>] [--asset USDC] [--issuer-class official|internal|any] [--json]");
    process.exit(1);
  }

  const allowlist = JSON.parse(fs.readFileSync(args.allowlist, "utf8"));
  const assetCfg = allowlist.assets.find((a) => a.symbol === args.asset);
  if (!assetCfg) {
    console.error(`Asset ${args.asset} not found in allowlist ${args.allowlist}`);
    process.exit(1);
  }

  const reports = [];
  let hadFailure = false;

  for (const hash of args.hashes) {
    const { rpc, result } = await getTx(hash, args.rpcs);
    const { observed, candidates } = extractObserved(result);
    const evalResult = evaluate(candidates, args.asset, assetCfg.approvedIssuers || [], args.issuerClass);

    const report = {
      hash,
      rpc,
      transactionType: observed.transactionType,
      validated: Boolean(observed.validated),
      transactionResult: observed.transactionResult,
      ...evalResult,
    };

    reports.push(report);
    if (!report.pass) hadFailure = true;

    if (!args.json) printHuman(report);
  }

  if (args.json) {
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2));
  }

  process.exit(hadFailure ? 2 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
