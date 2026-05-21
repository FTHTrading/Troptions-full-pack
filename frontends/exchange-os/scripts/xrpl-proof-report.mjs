#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {
    asset: process.env.XRPL_PROOF_ASSET || "USDC",
    hash: process.env.XRPL_PROOF_HASH || "",
    account: process.env.XRPL_PROOF_ACCOUNT || "",
    out: process.env.XRPL_PROOF_REPORT || path.join("data", "tmp", `xrpl-proof-report-${Date.now()}.json`),
  };

  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--asset" && argv[i + 1]) args.asset = argv[++i].toUpperCase();
    else if (cur === "--hash" && argv[i + 1]) args.hash = argv[++i].toUpperCase();
    else if (cur === "--account" && argv[i + 1]) args.account = argv[++i];
    else if (cur === "--out" && argv[i + 1]) args.out = argv[++i];
  }

  return args;
}

function runNodeScript(scriptName, scriptArgs) {
  const fullPath = path.join(__dirname, scriptName);
  const proc = spawnSync(process.execPath, [fullPath, ...scriptArgs], { encoding: "utf8" });
  return {
    exitCode: proc.status ?? 1,
    stdout: proc.stdout || "",
    stderr: proc.stderr || "",
  };
}

function parseJsonMaybe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function ensureDir(fp) {
  const dir = path.dirname(fp);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.hash && !args.account) {
    console.error("Provide at least one of --hash or --account (or XRPL_PROOF_HASH / XRPL_PROOF_ACCOUNT env vars).");
    process.exit(1);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    asset: args.asset,
    hash: args.hash || null,
    account: args.account || null,
    checks: {},
    overallPass: true,
  };

  if (args.hash) {
    const official = runNodeScript("xrpl-verify-issuer-proof.mjs", ["--asset", args.asset, "--issuer-class", "official", "--hash", args.hash, "--json"]);
    const internal = runNodeScript("xrpl-verify-issuer-proof.mjs", ["--asset", args.asset, "--issuer-class", "internal", "--hash", args.hash, "--json"]);

    report.checks.hashOfficial = {
      exitCode: official.exitCode,
      output: parseJsonMaybe(official.stdout),
      stderr: official.stderr,
      pass: official.exitCode === 0,
    };
    report.checks.hashInternal = {
      exitCode: internal.exitCode,
      output: parseJsonMaybe(internal.stdout),
      stderr: internal.stderr,
      pass: internal.exitCode === 0,
    };

    if (!report.checks.hashOfficial.pass && !report.checks.hashInternal.pass) {
      report.overallPass = false;
    }
  }

  if (args.account) {
    const trustInternal = runNodeScript("xrpl-check-account-lines.mjs", ["--account", args.account, "--asset", args.asset, "--issuer-class", "internal", "--json"]);
    report.checks.trustlineInternal = {
      exitCode: trustInternal.exitCode,
      output: parseJsonMaybe(trustInternal.stdout),
      stderr: trustInternal.stderr,
      pass: trustInternal.exitCode === 0,
    };

    if (!report.checks.trustlineInternal.pass) {
      report.overallPass = false;
    }
  }

  ensureDir(args.out);
  fs.writeFileSync(args.out, JSON.stringify(report, null, 2));

  console.log(`XRPL proof report written: ${args.out}`);
  console.log(`overallPass=${report.overallPass}`);

  process.exit(report.overallPass ? 0 : 2);
}

main();
