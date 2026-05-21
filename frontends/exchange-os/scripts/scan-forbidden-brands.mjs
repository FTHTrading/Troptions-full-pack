#!/usr/bin/env node
/**
 * scan-forbidden-brands.mjs
 *
 * Scans src/, docs/, public/, and extensions/ for forbidden third-party brand
 * references that must not appear in TROPTIONS public-facing materials.
 *
 * Usage:
 *   node scripts/scan-forbidden-brands.mjs
 *   npm run scan:forbidden-brands
 *
 * Exit codes:
 *   0  — clean, no violations found
 *   1  — violations found (list printed to stderr)
 */

import { readFileSync, statSync } from "fs";
import { resolve, relative, extname } from "path";
import { readdirSync } from "fs";

// ── Forbidden brand terms (split to avoid self-flagging) ──────────────────────
const FORBIDDEN_TERMS = [
  "OPT" + "KAS",
  "Opt" + "kas",
  "opt" + "kas",
  "OPK" + "TAS",
  "opk" + "tas",
];

// ── Directories to scan ───────────────────────────────────────────────────────
const SCAN_ROOTS = ["src", "docs", "public", "extensions"];

// ── File extensions to check ──────────────────────────────────────────────────
const SCAN_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".md", ".mdx", ".json", ".html", ".txt", ".toml",
]);

// ── Paths to exclude ──────────────────────────────────────────────────────────
const EXCLUDE_DIRS = new Set([
  "node_modules", ".next", ".git", "dist", "build", "out", ".turbo", ".cache",
]);

// ── Historical/archive paths — allow OPTKAS in commit-message records ─────────
const EXEMPT_PATH_PATTERNS = [
  // git state audit file (contains historical commit messages)
  "docs/troptions/master-audit/00-git-state.md",
  // final launch readiness report (references historical commit)
  "docs/troptions/final-live-launch-readiness-report.md",
  // TROPTIONS genesis build — historical wallet provisioning records
  "docs/TROPTIONS-GENESIS-BUILD.md",
  // XRPL/Stellar ecosystem audit — documents historical asset registry state
  "docs/troptions/xrpl-stellar-ecosystem-audit.md",
  // Cleanup report itself (documents what was removed)
  "docs/troptions/optkas-removal-cleanup-report.md",
  // Brand policy document (defines the forbidden terms by listing them)
  "docs/troptions/brand-control-and-third-party-reference-policy.md",
  // Cryptographically locked genesis records — cannot alter without breaking hash proofs
  "public/troptions-genesis.locked.json",
  "public/troptions-genesis.json",
  // This script itself
  "scripts/scan-forbidden-brands.mjs",
];

const ROOT = resolve(process.cwd());

/**
 * Recursively walk a directory and yield file paths.
 * @param {string} dir
 * @returns {Generator<string>}
 */
function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && SCAN_EXTENSIONS.has(extname(entry.name))) {
      yield full;
    }
  }
}

/**
 * Check whether a file path matches any exempt pattern.
 * @param {string} filePath - absolute path
 * @returns {boolean}
 */
function isExempt(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, "/");
  return EXEMPT_PATH_PATTERNS.some((p) => rel.includes(p));
}

// ── Main scan ─────────────────────────────────────────────────────────────────
let totalFiles = 0;
let violations = 0;
const violationLines = [];

for (const root of SCAN_ROOTS) {
  const absRoot = resolve(ROOT, root);
  let stat;
  try {
    stat = statSync(absRoot);
  } catch {
    continue; // directory doesn't exist
  }
  if (!stat.isDirectory()) continue;

  for (const filePath of walk(absRoot)) {
    if (isExempt(filePath)) continue;
    totalFiles++;

    let content;
    try {
      content = readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    const relPath = relative(ROOT, filePath).replace(/\\/g, "/");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const term of FORBIDDEN_TERMS) {
        if (line.includes(term)) {
          violations++;
          violationLines.push(`  ${relPath}:${i + 1}  →  ${line.trim().slice(0, 120)}`);
        }
      }
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
console.log(`\nTROPTIONS Brand Compliance Scan`);
console.log(`Scanned ${totalFiles} files in ${SCAN_ROOTS.join(", ")}/\n`);

if (violations === 0) {
  console.log("✓ CLEAN — No forbidden brand references found.");
  process.exit(0);
} else {
  console.error(`✗ VIOLATIONS FOUND: ${violations} occurrence(s)\n`);
  for (const v of violationLines) {
    console.error(v);
  }
  console.error("\nFix all occurrences before committing. See docs/troptions/brand-control-and-third-party-reference-policy.md");
  process.exit(1);
}
