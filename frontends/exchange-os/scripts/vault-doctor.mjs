#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEPLOYMENT_FILE = path.join(ROOT, "data", "vault", "TroptionsGatewayVault.deployment.json");

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

function normalizePrivateKey(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^0x[0-9a-fA-F]{64}$/.test(trimmed)) return trimmed;
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return `0x${trimmed}`;
  return null;
}

function isAddress(value) {
  return /^0x[0-9a-fA-F]{40}$/.test(value || "");
}

function deriveAddress(privateKey) {
  const normalized = normalizePrivateKey(privateKey);
  if (!normalized) return null;
  try {
    return new ethers.Wallet(normalized).address;
  } catch {
    return null;
  }
}

function loadDeployment() {
  if (!fs.existsSync(DEPLOYMENT_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
  } catch {
    return null;
  }
}

function line(label, ok, detail) {
  console.log(`  [${ok ? "OK" : "NO"}] ${label}: ${detail}`);
}

loadEnv();

const argv = process.argv.slice(2);
const jsonMode = argv.includes("--json");

const deployerKey = process.env.VAULT_DEPLOYER_KEY || "";
const ownerKey = process.env.VAULT_OWNER_KEY || "";
const depositorKey = process.env.VAULT_DEPOSITOR_KEY || "";
const depositor = process.env.VAULT_DEPOSITOR || "";
const deployment = loadDeployment();

const deployerAddress = deriveAddress(deployerKey);
const ownerAddress = deriveAddress(ownerKey);
const depositorKeyAddress = deriveAddress(depositorKey);

const checks = {
  deployerKey: Boolean(deployerAddress),
  ownerKey: Boolean(ownerAddress),
  depositorKey: Boolean(depositorKeyAddress),
  depositorAddress: isAddress(depositor),
  depositorMatchesKey: Boolean(depositorKeyAddress && depositor && depositorKeyAddress.toLowerCase() === depositor.toLowerCase()),
  deploymentFile: Boolean(deployment?.address && isAddress(deployment.address)),
  deployedDepositorMatchesEnv: !deployment?.depositor || !depositor || deployment.depositor.toLowerCase() === depositor.toLowerCase(),
  deployedOwnerMatchesOwnerKey: !deployment?.deployer || !ownerAddress || deployment.deployer.toLowerCase() === ownerAddress.toLowerCase(),
};

const readyToDeploy = checks.deployerKey && checks.ownerKey && checks.depositorKey && checks.depositorAddress && checks.depositorMatchesKey;
const readyToOperate = readyToDeploy && checks.deploymentFile && checks.deployedDepositorMatchesEnv && checks.deployedOwnerMatchesOwnerKey;

const summary = {
  readyToDeploy,
  readyToOperate,
  env: {
    deployerKey: checks.deployerKey,
    ownerKey: checks.ownerKey,
    depositorKey: checks.depositorKey,
    depositorAddress: checks.depositorAddress,
    depositorMatchesKey: checks.depositorMatchesKey,
  },
  deployment: deployment
    ? {
        found: checks.deploymentFile,
        address: deployment.address,
        deployer: deployment.deployer,
        depositor: deployment.depositor,
        deployedDepositorMatchesEnv: checks.deployedDepositorMatchesEnv,
        deployedOwnerMatchesOwnerKey: checks.deployedOwnerMatchesOwnerKey,
      }
    : {
        found: false,
      },
  nextStep: readyToOperate
    ? "npm run vault:status"
    : readyToDeploy
      ? "npm run vault:deploy:confirm"
      : "Fill in .env.local and rerun npm run vault:doctor",
};

if (jsonMode) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(readyToDeploy ? 0 : 1);
}

console.log("========================================================================");
console.log("  TROPTIONS GATEWAY VAULT - DOCTOR");
console.log("========================================================================\n");

line("VAULT_DEPLOYER_KEY", checks.deployerKey, checks.deployerKey ? deployerAddress : "missing or invalid");
line("VAULT_OWNER_KEY", checks.ownerKey, checks.ownerKey ? ownerAddress : "missing or invalid");
line("VAULT_DEPOSITOR_KEY", checks.depositorKey, checks.depositorKey ? depositorKeyAddress : "missing or invalid");
line("VAULT_DEPOSITOR", checks.depositorAddress, checks.depositorAddress ? depositor : "missing or invalid");
line("DEPOSITOR KEY MATCH", checks.depositorMatchesKey, checks.depositorMatchesKey ? "env address matches depositor key" : "VAULT_DEPOSITOR must match VAULT_DEPOSITOR_KEY");

if (deployment) {
  console.log();
  line("DEPLOYMENT FILE", checks.deploymentFile, checks.deploymentFile ? deployment.address : "deployment file exists but address is invalid");
  line("DEPLOYED DEPOSITOR MATCH", checks.deployedDepositorMatchesEnv, checks.deployedDepositorMatchesEnv ? deployment.depositor : "deployment depositor differs from current env");
  line("DEPLOYED OWNER MATCH", checks.deployedOwnerMatchesOwnerKey, checks.deployedOwnerMatchesOwnerKey ? deployment.deployer : "VAULT_OWNER_KEY does not match deployed owner/deployer");
} else {
  console.log();
  line("DEPLOYMENT FILE", false, "not found - deploy the vault after env checks pass");
}

console.log();
console.log(`  Ready to deploy:  ${readyToDeploy ? "YES" : "NO"}`);
console.log(`  Ready to operate: ${readyToOperate ? "YES" : "NO"}`);
console.log(`  Next step:        ${summary.nextStep}`);
console.log("\n========================================================================");

process.exit(readyToDeploy ? 0 : 1);