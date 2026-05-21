#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/vault-deploy.mjs
 *
 * TROPTIONS GATEWAY VAULT — COMPILE & DEPLOY
 * ─────────────────────────────────────────────────────────────────
 * Compiles contracts/TroptionsGatewayVault.sol using the local solc
 * package, then deploys to Ethereum mainnet using your private key.
 *
 * NO REMIX. NO THIRD PARTIES. Everything runs here.
 *
 * Required env (add to .env.local):
 *   VAULT_DEPLOYER_KEY=0x...    Private key of deployer/owner wallet
 *   VAULT_DEPOSITOR=0x...       Address allowed to call lockUsdc/lockUsdt
 *   ETHEREUM_RPC_URL=https://...  (optional — public RPCs used as fallback)
 *
 * Usage:
 *   node scripts/vault-deploy.mjs --dry-run
 *   node scripts/vault-deploy.mjs --confirm
 *
 * Saves deployed address + ABI to:
 *   data/vault/TroptionsGatewayVault.deployment.json
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ethers } from "ethers";
import solc from "solc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── Config ───────────────────────────────────────────────────────────────────

const SOL_FILE  = path.join(ROOT, "contracts", "TroptionsGatewayVault.sol");
const OUT_DIR   = path.join(ROOT, "data", "vault");
const OUT_FILE  = path.join(OUT_DIR, "TroptionsGatewayVault.deployment.json");

const RPC_FALLBACKS = [
  "https://cloudflare-eth.com",
  "https://eth.llamarpc.com",
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
];

// ─── Env ──────────────────────────────────────────────────────────────────────

function loadEnv() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

// ─── Compile ──────────────────────────────────────────────────────────────────

function compileSolidity() {
  const source = fs.readFileSync(SOL_FILE, "utf8");
  const contractName = "TroptionsGatewayVault";

  const input = {
    language: "Solidity",
    sources: { [contractName + ".sol"]: { content: source } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter((e) => e.severity === "error");
    if (errors.length) {
      console.error("  Solidity compilation errors:");
      errors.forEach((e) => console.error("  ", e.formattedMessage));
      process.exit(1);
    }
    const warnings = output.errors.filter((e) => e.severity === "warning");
    if (warnings.length) {
      console.log(`  WARNING: ${warnings.length} warning(s) - continuing`);
    }
  }

  const contract = output.contracts[contractName + ".sol"][contractName];
  return {
    abi:      contract.abi,
    bytecode: "0x" + contract.evm.bytecode.object,
  };
}

// ─── Deploy ───────────────────────────────────────────────────────────────────

async function deploy(dryRun) {
  loadEnv();

  const deployerKey = process.env.VAULT_DEPLOYER_KEY;
  const depositor   = process.env.VAULT_DEPOSITOR;

  console.log("  Compiling contracts/TroptionsGatewayVault.sol ...");
  const { abi, bytecode } = compileSolidity();
  console.log(`  OK: compiled - ABI ${abi.length} functions/events, bytecode ${bytecode.length} chars`);

  if (dryRun) {
    console.log("\n  DRY RUN - no transaction sent.");
    console.log(`  Depositor would be: ${depositor || "(not set - add VAULT_DEPOSITOR to .env.local)"}`);
    console.log("  To deploy for real: npm run vault:deploy:confirm");
    return;
  }

  if (!deployerKey) {
    console.error("  ERROR: VAULT_DEPLOYER_KEY not set in .env.local");
    process.exit(1);
  }
  if (!depositor || !/^0x[0-9a-fA-F]{40}$/.test(depositor)) {
    console.error("  ERROR: VAULT_DEPOSITOR not set or invalid in .env.local");
    process.exit(1);
  }

  // Connect
  const rpcUrl = process.env.ETHEREUM_RPC_URL || RPC_FALLBACKS[0];
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet   = new ethers.Wallet(deployerKey, provider);

  const network = await provider.getNetwork();
  if (network.chainId !== 1n) {
    console.error(`  ERROR: Connected to chain ${network.chainId} - must be Ethereum mainnet (chain 1)`);
    process.exit(1);
  }

  const balance = await provider.getBalance(wallet.address);
  console.log(`  Deployer:   ${wallet.address}`);
  console.log(`  ETH Balance: ${ethers.formatEther(balance)} ETH`);
  console.log(`  Depositor:   ${depositor}`);
  console.log(`  Network:     Ethereum mainnet (chain 1)`);

  if (balance < ethers.parseEther("0.01")) {
    console.error("  ERROR: Deployer needs at least 0.01 ETH for gas.");
    process.exit(1);
  }

  console.log("\n  Deploying vault...");
  const factory  = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(depositor);
  console.log(`  Tx hash:      ${contract.deploymentTransaction().hash}`);
  console.log("  Waiting for confirmation...");

  const receipt = await contract.deploymentTransaction().wait(1);
  const address = await contract.getAddress();

  console.log("\n  OK: vault deployed");
  console.log(`  Contract:     ${address}`);
  console.log(`  Block:        ${receipt.blockNumber}`);
  console.log(`  Gas used:     ${receipt.gasUsed.toString()}`);
  console.log(`  Etherscan:    https://etherscan.io/address/${address}`);

  // Persist deployment
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const deployment = {
    contract:    "TroptionsGatewayVault",
    address,
    network:     "mainnet",
    chainId:     1,
    deployer:    wallet.address,
    depositor,
    block:       receipt.blockNumber,
    txHash:      receipt.hash,
    deployedAt:  new Date().toISOString(),
    abi,
    etherscan:   `https://etherscan.io/address/${address}`,
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(deployment, null, 2) + "\n");
  console.log(`\n  Deployment saved: data/vault/TroptionsGatewayVault.deployment.json`);

  return deployment;
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const dryRun  = !process.argv.includes("--confirm");
const confirm = process.argv.includes("--confirm");

console.log("════════════════════════════════════════════════════════════════");
console.log("  TROPTIONS GATEWAY VAULT — DEPLOY");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  Mode: ${confirm ? "LIVE MAINNET DEPLOY" : "DRY RUN (add --confirm to deploy)"}`);
console.log("════════════════════════════════════════════════════════════════\n");

await deploy(dryRun);
