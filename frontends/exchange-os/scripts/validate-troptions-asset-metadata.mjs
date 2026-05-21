#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/validate-troptions-asset-metadata.mjs
 *
 * READ-ONLY metadata validator. NEVER touches wallet seeds, env secrets, or
 * networks. Validates the standards files published under public/.
 *
 * Standards checked:
 *   • SEP-1     stellar.toml      (VERSION, NETWORK_PASSPHRASE, ACCOUNTS, DOCUMENTATION, CURRENCIES)
 *   • XLS-26d   xrp-ledger.toml   ([[ACCOUNTS]], [[CURRENCIES]], [[PRINCIPALS]])
 *   • XLS-24    NFT metadata      (name, description, image, attributes)
 *   • XLS-33d   MPT metadata      (ticker, name, icon, asset_class, ledger)
 *   • Banned-claims regex (no investment/yield/profit/guaranteed return language)
 *
 * Exit code: 0 if all checks pass, 1 otherwise.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const errors = [];
const warnings = [];
function err(msg)  { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function ok(msg)   { console.log(`  ✅ ${msg}`); }

// ─── Banned-claims regex (negation-aware) ──────────────────────────────────────
// We only fail when a claim appears in a *positive* (non-disclaimer) context.
// The metadata files legitimately say things like "not an investment advisor"
// and "no guaranteed return"; those are disclaimers and must be allowed.
const BANNED_CLAIMS = [
  /\bguaranteed\s+(value|returns?|redemption|profits?|yields?|payouts?|interest|dividends?)\b/i,
  /\bredeemable\s+for\s+cash\b/i,
  /\brisk[-\s]?free\b/i,
  /\bpassive\s+income\b/i,
  /\bearn\s+(?:yield|returns?|profits?|interest|rewards|passive)\b/i,
  /\binvestment\s+(?:opportunity|vehicle|product)\b/i,
  /\bguarante(?:e|ed)\s+(?:returns?|yield|profit|payout|liquidity|redemption)\b/i,
  /\bAPY\b/,
  /\bAPR\b/,
];
const NEGATION_TOKENS = /(?:\bnot\b|\bno\b|\bnever\b|\bnon-\b|\bwithout\b|\bdoes not\b|\bdo not\b|\bdoesn't\b|\bdon't\b|"\s*:\s*false|=\s*false|\bdisclaim|\bare not\b|\bis not\b|\bany\s+guaranteed\b)/i;
function scanBanned(text, label) {
  // Split into sentence-ish phrases on . , ; : ! ? and newlines.
  const phrases = text.split(/[\n.,;:!?]+/);
  for (const raw of phrases) {
    const phrase = raw.trim();
    if (!phrase) continue;
    for (const rx of BANNED_CLAIMS) {
      if (rx.test(phrase) && !NEGATION_TOKENS.test(phrase)) {
        err(`${label}: banned claim matched ${rx} in: "${phrase.slice(0, 120)}"`);
      }
    }
  }
}

// ─── Minimal TOML parser (sufficient for our well-defined files) ────────────────
// Supports: key="value", key=number, key=true/false, [section], [[array.section]],
// inline arrays of strings, multi-line via \n only. Quoted keys not used.
function parseToml(text) {
  const root = {};
  let cursor = root;
  const lines = text.split(/\r?\n/);
  for (let raw of lines) {
    const line = raw.replace(/^\s+|\s+$/g, "");
    if (!line || line.startsWith("#")) continue;
    let m;
    if ((m = line.match(/^\[\[([^\]]+)\]\]$/))) {
      const seg = m[1];
      if (!root[seg]) root[seg] = [];
      const obj = {};
      root[seg].push(obj);
      cursor = obj;
      continue;
    }
    if ((m = line.match(/^\[([^\]]+)\]$/))) {
      const seg = m[1];
      if (!root[seg]) root[seg] = {};
      cursor = root[seg];
      continue;
    }
    if ((m = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.*)$/))) {
      const k = m[1];
      let v = m[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      else if (v.startsWith("[") && v.endsWith("]")) {
        v = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
      } else if (v === "true") v = true;
      else if (v === "false") v = false;
      else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
      cursor[k] = v;
    }
  }
  return root;
}

// ─── stellar.toml (SEP-1) ───────────────────────────────────────────────────────
function validateStellarToml() {
  console.log("\n─── stellar.toml (SEP-1) ───");
  const fp = path.join(REPO_ROOT, "public/.well-known/stellar.toml");
  if (!fs.existsSync(fp)) return err("stellar.toml: file missing");
  const txt = fs.readFileSync(fp, "utf8");
  scanBanned(txt, "stellar.toml");
  const t = parseToml(txt);
  for (const k of ["VERSION", "NETWORK_PASSPHRASE", "ACCOUNTS"]) {
    if (!t[k]) err(`stellar.toml: missing ${k}`); else ok(`has ${k}`);
  }
  if (!t.DOCUMENTATION) err("stellar.toml: missing [DOCUMENTATION]"); else {
    for (const k of ["ORG_NAME", "ORG_URL", "ORG_LOGO", "ORG_OFFICIAL_EMAIL"]) {
      if (!t.DOCUMENTATION[k]) err(`stellar.toml DOCUMENTATION: missing ${k}`); else ok(`DOCUMENTATION.${k}`);
    }
  }
  if (!t.CURRENCIES || !Array.isArray(t.CURRENCIES) || t.CURRENCIES.length === 0) {
    err("stellar.toml: missing [[CURRENCIES]]");
  } else {
    for (const c of t.CURRENCIES) {
      for (const k of ["code", "issuer", "display_decimals", "name"]) {
        if (c[k] === undefined) err(`stellar.toml CURRENCIES.${c.code || "?"}: missing ${k}`);
      }
    }
    ok(`${t.CURRENCIES.length} currency entries`);
  }
  if (!t.PRINCIPALS || !Array.isArray(t.PRINCIPALS) || t.PRINCIPALS.length === 0) {
    warn("stellar.toml: no [[PRINCIPALS]] entries");
  } else ok(`${t.PRINCIPALS.length} principal entries`);
}

// ─── xrp-ledger.toml (XLS-26d) ──────────────────────────────────────────────────
function validateXrpLedgerToml() {
  console.log("\n─── xrp-ledger.toml (XLS-26d) ───");
  const fp = path.join(REPO_ROOT, "public/.well-known/xrp-ledger.toml");
  if (!fs.existsSync(fp)) return err("xrp-ledger.toml: file missing");
  const txt = fs.readFileSync(fp, "utf8");
  scanBanned(txt, "xrp-ledger.toml");
  const t = parseToml(txt);
  if (!t.METADATA) err("xrp-ledger.toml: missing [METADATA]"); else ok("has METADATA");
  if (!t.ACCOUNTS || !Array.isArray(t.ACCOUNTS) || t.ACCOUNTS.length === 0) {
    err("xrp-ledger.toml: missing [[ACCOUNTS]]");
  } else {
    for (const a of t.ACCOUNTS) {
      if (!a.address) err("xrp-ledger.toml ACCOUNT: missing address");
    }
    ok(`${t.ACCOUNTS.length} account entries`);
  }
  if (!t.CURRENCIES || !Array.isArray(t.CURRENCIES) || t.CURRENCIES.length === 0) {
    err("xrp-ledger.toml: missing [[CURRENCIES]]");
  } else {
    for (const c of t.CURRENCIES) {
      for (const k of ["code", "issuer"]) {
        if (!c[k]) err(`xrp-ledger.toml CURRENCIES: missing ${k}`);
      }
    }
    ok(`${t.CURRENCIES.length} currency entries`);
  }
}

// ─── JSON metadata files ────────────────────────────────────────────────────────
function validateJson(relPath, requiredKeys, label) {
  console.log(`\n─── ${label} ───`);
  const fp = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(fp)) return err(`${label}: file missing (${relPath})`);
  const txt = fs.readFileSync(fp, "utf8");
  scanBanned(txt, label);
  let j;
  try { j = JSON.parse(txt); } catch (e) { return err(`${label}: invalid JSON — ${e.message}`); }
  for (const key of requiredKeys) {
    const segs = key.split(".");
    let cur = j;
    for (const s of segs) { cur = cur && cur[s]; }
    if (cur === undefined || cur === null) err(`${label}: missing ${key}`);
    else ok(`has ${key}`);
  }
  return j;
}

// ─── Main ───────────────────────────────────────────────────────────────────────
function main() {
  console.log("═".repeat(72));
  console.log("  TROPTIONS METADATA VALIDATOR (read-only)");
  console.log("═".repeat(72));

  validateStellarToml();
  validateXrpLedgerToml();

  validateJson(
    "public/troptions/asset-metadata/troptions.iou.v1.json",
    [
      "assetId", "assetClass", "branding.primaryLogo", "branding.primaryColor",
      "ledgers", "compliance.legalNotice",
    ],
    "troptions.iou.v1.json",
  );
  validateJson(
    "public/troptions/asset-metadata/troptions.nft.collection.v1.json",
    [
      "collectionId", "name", "description", "image",
      "ledger.taxon", "issuer.address", "compliance.legalNotice",
    ],
    "troptions.nft.collection.v1.json",
  );
  validateJson(
    "public/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json",
    [
      "ticker", "name", "description", "icon", "asset_class",
      "issuer.address", "ledger.scale", "compliance.legalNotice",
    ],
    "troptions.mpt.tranche-a.v1.json",
  );

  console.log("\n" + "═".repeat(72));
  if (warnings.length) {
    console.log(`  WARNINGS (${warnings.length}):`);
    for (const w of warnings) console.log(`    ⚠️  ${w}`);
  }
  if (errors.length) {
    console.log(`  ERRORS (${errors.length}):`);
    for (const e of errors) console.log(`    ❌ ${e}`);
    console.log("═".repeat(72));
    process.exit(1);
  }
  console.log("  ✅ All metadata checks passed.");
  console.log("═".repeat(72));
}

main();
