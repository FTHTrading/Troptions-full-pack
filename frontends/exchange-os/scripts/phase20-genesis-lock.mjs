#!/usr/bin/env node
/**
 * Phase 20 — Genesis Hash Lock + IPFS Pin + Release Verification
 *
 * Computes the canonical SHA-256 hash of the genesis manifest, writes a
 * locked copy, pins it to local Kubo, and writes a release record.
 *
 * ⚠ SAFETY GUARDRAILS ⚠
 * ─────────────────────
 * This script is INFORMATIONAL AND ARCHIVAL ONLY.
 * It does NOT:
 *   - fund any wallets
 *   - mint NFTs or MPTs
 *   - issue stablecoins
 *   - execute XRPL, Stellar, Polygon, or Apostle Chain transactions
 *   - generate or store private keys or seed phrases
 *   - enable any live settlement or bridge execution
 *   - expose the IPFS RPC port publicly
 *
 * The script hard-aborts if any of those safety conditions are violated.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

// ─── Paths ────────────────────────────────────────────────────────────────────
const GENESIS_SRC     = resolve(ROOT, "public/troptions-genesis.json");
const GENESIS_LOCKED  = resolve(ROOT, "public/troptions-genesis.locked.json");
const RELEASE_RECORD  = resolve(ROOT, "public/troptions-genesis-release.json");

// ─── IPFS config (strictly local) ────────────────────────────────────────────
const IPFS_RPC_URL     = process.env.IPFS_RPC_URL     ?? "http://127.0.0.1:5001";
const IPFS_GATEWAY_URL = process.env.IPFS_GATEWAY_URL ?? "http://127.0.0.1:8080";

// ─── Hardcoded release metadata ──────────────────────────────────────────────
const COMMIT = "d9888a7";

// ─── Utilities ────────────────────────────────────────────────────────────────

function abort(msg) {
  console.error(`\n❌  ABORT: ${msg}\n`);
  process.exit(1);
}

/** Recursively sort all object keys for deterministic JSON serialisation */
function canonicalize(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    sorted[key] = canonicalize(value[key]);
  }
  return sorted;
}

/** SHA-256 of a UTF-8 string, returns lowercase hex */
function sha256hex(str) {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

/** Assert the IPFS RPC URL targets only localhost — never a public host */
function assertIpfsLocal(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    abort(`IPFS_RPC_URL is not a valid URL: ${url}`);
  }
  const h = parsed.hostname;
  if (h !== "127.0.0.1" && h !== "localhost" && h !== "::1") {
    abort(
      `SECURITY: IPFS_RPC_URL "${url}" targets a non-localhost host "${h}". ` +
      `The Kubo RPC API must NEVER be exposed publicly. Refusing to continue.`
    );
  }
}

// ─── Safety guard: scan manifest for dangerous flags ─────────────────────────
function runSafetyChecks(manifest) {
  if (manifest.simulation_only !== true) {
    abort("simulation_only is not true in genesis manifest. Cannot proceed.");
  }

  const forbidden = [
    "live_execution_enabled",
    "live_execution_allowed",
    "live_minting_enabled",
    "live_settlement_enabled",
    "bridge_execution_enabled",
  ];
  for (const field of forbidden) {
    if (manifest[field] === true) {
      abort(`Field "${field}" is true in genesis manifest. Aborting safety check.`);
    }
  }

  // Scan for any occurrence of private key indicators in the raw JSON string
  const raw = JSON.stringify(manifest);
  const keywordsDangerous = [
    "private_key",
    "privateKey",
    "seed_phrase",
    "seedPhrase",
    "secret_key",
    "secretKey",
    "mnemonic",
    "wallet_secret",
    "master_seed",
  ];
  for (const kw of keywordsDangerous) {
    if (raw.toLowerCase().includes(kw.toLowerCase())) {
      abort(
        `Dangerous field keyword "${kw}" detected in genesis manifest. ` +
        `Remove all private key / seed phrase material before locking.`
      );
    }
  }

  console.log("✅  Safety checks passed — simulation_only:true, no live flags, no key material.");
}

// ─── IPFS helpers ─────────────────────────────────────────────────────────────

async function ipfsAdd(content, filename) {
  const form = new FormData();
  form.append(
    "file",
    new Blob([content], { type: "application/json" }),
    filename
  );

  const res = await fetch(`${IPFS_RPC_URL}/api/v0/add?pin=false`, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    abort(`Kubo /api/v0/add returned HTTP ${res.status}: ${await res.text()}`);
  }

  // Response is NDJSON — last line is the root object
  const text = await res.text();
  const lines = text.trim().split("\n").filter(Boolean);
  const last = JSON.parse(lines[lines.length - 1]);

  if (!last?.Hash) {
    abort(`Kubo /api/v0/add response missing Hash field. Got: ${JSON.stringify(last)}`);
  }
  return last.Hash;
}

async function ipfsPin(cid) {
  const res = await fetch(
    `${IPFS_RPC_URL}/api/v0/pin/add?arg=${encodeURIComponent(cid)}&progress=false`,
    {
      method: "POST",
      signal: AbortSignal.timeout(30_000),
    }
  );

  if (!res.ok) {
    abort(`Kubo /api/v0/pin/add returned HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  // Response: { Pins: ["<CID>"] }
  if (!json?.Pins?.includes(cid)) {
    abort(`Pin response did not confirm CID ${cid}. Got: ${JSON.stringify(json)}`);
  }
}

async function ipfsNodeCheck() {
  const res = await fetch(`${IPFS_RPC_URL}/api/v0/id`, {
    method: "POST",
    signal: AbortSignal.timeout(5_000),
  }).catch((e) => { abort(`Kubo node unreachable at ${IPFS_RPC_URL}: ${e.message}`); });

  if (!res.ok) {
    abort(`Kubo /api/v0/id returned HTTP ${res.status}`);
  }

  const json = await res.json();
  console.log(`✅  Kubo node online — peer: ${json.ID}`);
  return json.ID;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  Phase 20 — TSN Genesis Hash Lock + IPFS Pin");
  console.log("═══════════════════════════════════════════════════════════\n");

  // 1. Assert IPFS RPC is local-only
  assertIpfsLocal(IPFS_RPC_URL);

  // 2. Confirm Kubo is reachable
  const peerId = await ipfsNodeCheck();

  // 3. Load genesis manifest
  console.log(`\n📂  Loading ${GENESIS_SRC}`);
  const raw = readFileSync(GENESIS_SRC, "utf8");
  const genesis = JSON.parse(raw);

  // 4. Run safety checks
  runSafetyChecks(genesis);

  // 5. Strip mutable fields before hashing
  const mutableFields = [
    "genesis_hash",
    "_note_genesis_hash",
    "ipfs_cid",
    "_note_ipfs_cid",
    "lock_timestamp",
  ];
  const stripped = { ...genesis };
  for (const f of mutableFields) delete stripped[f];

  // 6. Canonicalize + compute hash
  const canonical = canonicalize(stripped);
  const canonicalJson = JSON.stringify(canonical);
  const genesisHash = sha256hex(canonicalJson);

  console.log(`\n🔐  Canonical hash (SHA-256):`);
  console.log(`    ${genesisHash}`);

  // 7. Build locked manifest (canonical order + hash re-inserted)
  const lockTimestamp = new Date().toISOString();
  const lockedDoc = canonicalize({
    ...stripped,
    genesis_hash: genesisHash,
    lock_timestamp: lockTimestamp,
  });
  const lockedJson = JSON.stringify(lockedDoc, null, 2);

  // 8. Save locked manifest
  writeFileSync(GENESIS_LOCKED, lockedJson, "utf8");
  console.log(`\n💾  Locked manifest saved to:`);
  console.log(`    ${GENESIS_LOCKED}`);

  // 9. Add locked manifest to IPFS
  console.log(`\n📡  Adding to local IPFS...`);
  const cid = await ipfsAdd(lockedJson, "troptions-genesis.locked.json");
  console.log(`✅  CID: ${cid}`);

  // 10. Pin locally
  console.log(`\n📌  Pinning ${cid}...`);
  await ipfsPin(cid);
  console.log(`✅  Pinned.`);

  const ipfsUri          = `ipfs://${cid}`;
  const localGatewayUrl  = `${IPFS_GATEWAY_URL}/ipfs/${cid}`;

  // 11. Build release record
  const releaseRecord = {
    release_phase: "Phase 20 — Genesis Hash Lock + IPFS Pin",
    commit: COMMIT,
    genesis_hash: genesisHash,
    ipfs_cid: cid,
    ipfs_uri: ipfsUri,
    local_gateway_url: localGatewayUrl,
    ipfs_peer_id: peerId,
    pinned: true,
    created_at: lockTimestamp,
    simulation_only: true,
    live_execution_enabled: false,
    notes: [
      "This release record is informational and archival.",
      "The genesis_hash is a SHA-256 of the canonical (key-sorted) genesis manifest with all mutable fields removed.",
      "The ipfs_cid is the CID of the locked manifest pinned to the local Kubo node.",
      "No live execution, minting, settlement, bridge action, wallet funding, or token issuance has occurred.",
      "No private keys or seed phrases were generated or stored by this script.",
      "The IPFS RPC API (port 5001) remains strictly local (127.0.0.1).",
      "All wallet addresses in the manifest with status PENDING_FRESH_GENERATION are placeholders — not real keys.",
      "This record must be reviewed by legal counsel before any live transition.",
    ],
    safety_attestation: {
      simulation_only: true,
      live_execution_enabled: false,
      live_minting_performed: false,
      live_settlement_performed: false,
      bridge_execution_performed: false,
      private_keys_generated: false,
      wallets_funded: false,
      nfts_minted: false,
      mpt_assets_created: false,
      stablecoins_issued: false,
      xrpl_transactions_submitted: false,
      stellar_transactions_submitted: false,
    },
  };

  // Final safety assert on release record before writing
  if (releaseRecord.simulation_only !== true) {
    abort("BUG: release record has simulation_only !== true. This should never happen.");
  }
  if (releaseRecord.live_execution_enabled !== false) {
    abort("BUG: release record has live_execution_enabled !== false. This should never happen.");
  }

  writeFileSync(RELEASE_RECORD, JSON.stringify(releaseRecord, null, 2), "utf8");
  console.log(`\n📄  Release record saved to:`);
  console.log(`    ${RELEASE_RECORD}`);

  // 12. Update genesis source with final hash + CID
  const updatedGenesis = {
    ...genesis,
    genesis_hash: genesisHash,
    ipfs_cid: cid,
  };
  writeFileSync(GENESIS_SRC, JSON.stringify(updatedGenesis, null, 2), "utf8");
  console.log(`\n✏️   Updated ${GENESIS_SRC} with genesis_hash and ipfs_cid.`);

  // 13. Summary
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  ✅  Phase 20 Complete");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`\n  Genesis hash:   ${genesisHash}`);
  console.log(`  IPFS CID:       ${cid}`);
  console.log(`  IPFS URI:       ${ipfsUri}`);
  console.log(`  Local gateway:  ${localGatewayUrl}`);
  console.log(`\n  Verify in browser:  ${localGatewayUrl}`);
  console.log(`  Check pin:          ipfs pin ls --type=recursive\n`);
}

main().catch((err) => {
  console.error("\n❌  Unexpected error:", err);
  process.exit(1);
});
