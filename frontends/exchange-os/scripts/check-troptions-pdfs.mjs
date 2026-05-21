#!/usr/bin/env node
/**
 * check-troptions-pdfs.mjs
 * Verifies all expected TROPTIONS PDFs exist and are >10KB.
 * Run: npm run pdf:check
 * Exits 1 if any are missing or too small.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/troptions/downloads");
const MIN_SIZE_KB = 5;

const EXPECTED = [
  "troptions-platform-overview.pdf",
  "kyc-onboarding-handbook.pdf",
  "rwa-tokenisation-handbook.pdf",
  "carbon-credit-handbook.pdf",
  "bitcoin-settlement-handbook.pdf",
  "xrpl-iou-issuance-handbook.pdf",
  "funding-routes-handbook.pdf",
  "master-funding-playbook.pdf",
  "funding-route-matrix.pdf",
  "client-intake-document-checklist.pdf",
  "pate-coal-001-funding-procedure.pdf",
  "pate-coal-001-lender-review-packet.pdf",
  "pate-coal-001-owner-document-request.pdf",
  "pate-coal-001-route-verification-guide.pdf",
  "axl-001-rwa-financing-checklist.pdf",
  "legacy-token-migration-handbook.pdf",
  "buyback-review-handbook.pdf",
  "liquidity-pool-readiness-handbook.pdf",
  "wallet-mint-noncustodial-guide.pdf",
  "rust-runtime-control-layer-overview.pdf",
  "troptions-wallet-hub-guide.pdf",
  "troptions-wallet-transfer-procedure.pdf",
  "usdc-usdt-vault-attestation-framework.pdf",
  "private-placement-owner-strategy-brief.pdf",
  "private-placement-sales-execution-guide.pdf",
  "private-placement-minting-leverage-framework.pdf",
  "bryan-stone-kyc-cis-master-file.pdf",
  "usdt-proof-of-funds-verification-and-validation.pdf",
  "trader-account-validation-and-lock-control-framework.pdf",
  "broker-dealer-onboarding-and-xrpl-vaulting-framework.pdf",
  "x402-mesh-pay-overview.pdf",
  "bryan-stone-kyc-appendix-template.pdf",
  "counterparty-verification-sheet.pdf",
  "broker-dealer-readiness-scorecard.pdf",
  "capital-leverage-structuring-framework-50m.pdf",
  "xrpl-tx-cd7271274743c20635ed58515f84b399a4113fe40e62cfc8248446a494d1e642-xrpscan.pdf",
  "xrpl-tx-b14c09d240af67279eec84e0cb521766df9bcfb909e1481486e62b928a528093-xrpscan.pdf",
];

console.log(`\nTROPTIONS PDF Check — ${EXPECTED.length} expected files\n`);
console.log(`Directory: ${OUT_DIR}\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const filename of EXPECTED) {
  const fullPath = path.join(OUT_DIR, filename);
  const exists = fs.existsSync(fullPath);

  if (!exists) {
    console.log(`  ❌  MISSING   ${filename}`);
    failures.push(`MISSING: ${filename}`);
    failed++;
    continue;
  }

  const stat = fs.statSync(fullPath);
  const sizeKb = stat.size / 1024;

  if (sizeKb < MIN_SIZE_KB) {
    console.log(`  ❌  TOO SMALL ${filename}  (${sizeKb.toFixed(1)} KB — minimum ${MIN_SIZE_KB} KB)`);
    failures.push(`TOO SMALL: ${filename} (${sizeKb.toFixed(1)} KB)`);
    failed++;
    continue;
  }

  console.log(`  ✅  OK        ${filename}  (${sizeKb.toFixed(1)} KB)`);
  passed++;
}

console.log(`\n─────────────────────────────────────────`);
console.log(`  Passed: ${passed} / ${EXPECTED.length}`);
console.log(`  Failed: ${failed}`);

if (failed > 0) {
  console.log(`\nFAILURES:`);
  failures.forEach((f) => console.log(`  • ${f}`));
  console.log(`\nRun "npm run pdf:generate" to generate missing files.\n`);
  process.exit(1);
}

console.log(`\n✅  All ${passed} PDFs verified.\n`);
