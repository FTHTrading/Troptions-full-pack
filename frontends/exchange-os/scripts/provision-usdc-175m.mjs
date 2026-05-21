#!/usr/bin/env node
/* eslint-disable no-console */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseScript = path.join(__dirname, "provision-stablecoin-ious.mjs");

function parseArgs(argv) {
  return {
    execute: argv.includes("--execute"),
    network: argv.find((a) => a.startsWith("--network="))?.split("=")[1] || "testnet",
    supply: argv.find((a) => a.startsWith("--supply="))?.split("=")[1] || "175000000",
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const childArgs = [
    baseScript,
    `--network=${args.network}`,
    "--xrpl-only",
    "--skip-usdt",
    "--skip-dai",
    "--skip-eurc",
    `--usdc-supply=${args.supply}`,
  ];

  if (args.execute) childArgs.push("--execute");

  console.log("\nTROPTIONS Dedicated USDC Provisioning");
  console.log("=".repeat(72));
  console.log(`Mode: ${args.execute ? "EXECUTE" : "DRY-RUN"}`);
  console.log(`Network: ${args.network}`);
  console.log(`USDC Supply: ${args.supply}`);
  console.log("=".repeat(72));

  const result = spawnSync(process.execPath, childArgs, {
    stdio: "inherit",
    env: process.env,
  });

  process.exit(result.status ?? 1);
}

main();
