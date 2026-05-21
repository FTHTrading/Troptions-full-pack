#!/usr/bin/env node
/**
 * Phase 20 Validator
 *
 * Verifies that the genesis lock artefacts are internally consistent:
 *   - The locked manifest hash matches a fresh recompute
 *   - The release record CID field is present and non-null
 *   - simulation_only is true in both artefacts
 *   - live_execution_enabled is false
 *   - local gateway URL uses 127.0.0.1:8080 (never a public host)
 *   - IPFS_RPC_URL is not a public host
 *
 * Run:  node scripts/validate-phase20.mjs
 * NPM:  npm run genesis:validate
 */

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT   = resolve(__dir, "..");

const GENESIS_LOCKED = resolve(ROOT, "public/troptions-genesis.locked.json");
const RELEASE_RECORD = resolve(ROOT, "public/troptions-genesis-release.json");

let passed = 0;
let failed = 0;

function pass(label) {
  console.log(`  ✅  ${label}`);
  passed++;
}

function fail(label, detail) {
  console.error(`  ❌  ${label}${detail ? ` — ${detail}` : ""}`);
  failed++;
}

function require_file(path, label) {
  if (!existsSync(path)) {
    fail(label, `File not found: ${path}. Run: npm run genesis:lock`);
    return false;
  }
  return true;
}

function canonicalize(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    sorted[key] = canonicalize(value[key]);
  }
  return sorted;
}

function sha256hex(str) {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

// ─── Main validation ──────────────────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════");
console.log("  Phase 20 — Release Validation");
console.log("═══════════════════════════════════════════════════════════\n");

// 1. Files exist
if (!require_file(GENESIS_LOCKED, "Locked genesis manifest exists")) {
  console.error("\nRun `npm run genesis:lock` first.\n");
  process.exit(1);
}
if (!require_file(RELEASE_RECORD, "Release record exists")) {
  console.error("\nRun `npm run genesis:lock` first.\n");
  process.exit(1);
}

const locked  = JSON.parse(readFileSync(GENESIS_LOCKED, "utf8"));
const release = JSON.parse(readFileSync(RELEASE_RECORD, "utf8"));

// 2. Recompute hash from locked manifest and compare
{
  const mutableFields = ["genesis_hash", "_note_genesis_hash", "ipfs_cid", "_note_ipfs_cid", "lock_timestamp"];
  const stripped = { ...locked };
  for (const f of mutableFields) delete stripped[f];
  const recomputed = sha256hex(JSON.stringify(canonicalize(stripped)));
  if (recomputed === locked.genesis_hash) {
    pass(`Locked hash matches recomputed hash (${recomputed.slice(0, 16)}...)`);
  } else {
    fail("Locked hash does NOT match recomputed hash",
      `locked=${locked.genesis_hash?.slice(0, 16)}... recomputed=${recomputed.slice(0, 16)}...`);
  }
}

// 3. Release record CID exists
{
  if (release.ipfs_cid && release.ipfs_cid.trim().length > 0) {
    pass(`Release record ipfs_cid is present (${release.ipfs_cid.slice(0, 20)}...)`);
  } else {
    fail("Release record ipfs_cid is missing or empty");
  }
}

// 4. simulation_only true in locked manifest
{
  if (locked.simulation_only === true) {
    pass("Locked manifest simulation_only === true");
  } else {
    fail("Locked manifest simulation_only is NOT true", JSON.stringify(locked.simulation_only));
  }
}

// 5. simulation_only true in release record
{
  if (release.simulation_only === true) {
    pass("Release record simulation_only === true");
  } else {
    fail("Release record simulation_only is NOT true", JSON.stringify(release.simulation_only));
  }
}

// 6. live_execution_enabled false in release record
{
  if (release.live_execution_enabled === false) {
    pass("Release record live_execution_enabled === false");
  } else {
    fail("Release record live_execution_enabled is NOT false", JSON.stringify(release.live_execution_enabled));
  }
}

// 7. local_gateway_url uses 127.0.0.1:8080 (not a public host)
{
  const gwUrl = release.local_gateway_url ?? "";
  let parsed;
  try { parsed = new URL(gwUrl); } catch { /* skip URL parse check */ }
  if (parsed && (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost")) {
    pass(`local_gateway_url uses localhost (${gwUrl.slice(0, 40)}...)`);
  } else {
    fail("local_gateway_url does not use a local hostname", gwUrl);
  }
}

// 8. IPFS_RPC_URL env var is not a public host (if set)
{
  const rpcUrl = process.env.IPFS_RPC_URL ?? "http://127.0.0.1:5001";
  let parsed;
  try { parsed = new URL(rpcUrl); } catch { parsed = null; }
  if (
    parsed &&
    (parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost" || parsed.hostname === "::1")
  ) {
    pass(`IPFS_RPC_URL is local-only (${rpcUrl})`);
  } else {
    fail("IPFS_RPC_URL is not a localhost address — NEVER expose port 5001 publicly", rpcUrl);
  }
}

// 9. Hash in release record matches hash in locked manifest
{
  if (release.genesis_hash === locked.genesis_hash) {
    pass("Release record genesis_hash matches locked manifest genesis_hash");
  } else {
    fail("Release record genesis_hash does not match locked manifest genesis_hash");
  }
}

// 10. safety_attestation fields
{
  const att = release.safety_attestation ?? {};
  const dangerous = [
    "live_execution_enabled",
    "live_minting_performed",
    "live_settlement_performed",
    "bridge_execution_performed",
    "private_keys_generated",
    "wallets_funded",
    "nfts_minted",
    "mpt_assets_created",
    "stablecoins_issued",
    "xrpl_transactions_submitted",
    "stellar_transactions_submitted",
  ];
  const live = dangerous.filter((k) => att[k] === true);
  if (live.length === 0) {
    pass("Safety attestation: all dangerous flags are false");
  } else {
    fail("Safety attestation has dangerous flags set to true", live.join(", "));
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n  ${passed + failed} checks — ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.error(`\n❌  Validation FAILED — see errors above.\n`);
  process.exit(1);
} else {
  console.log(`\n✅  All validation checks passed.\n`);
}
