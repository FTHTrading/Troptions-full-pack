#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scripts/plan-troptions-asset-provisioning.mjs
 *
 * UNSIGNED PLAN GENERATOR. Builds an ordered list of XRPL/Stellar operations
 * with all parameters resolved, but NEVER signs, NEVER submits, NEVER opens a
 * network connection, and NEVER reads wallet secrets.
 *
 * Output:
 *   data/observability/troptions-provisioning-plan-<timestamp>.json
 *
 * Use this output for compliance, custody, and Control Hub review.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// Public addresses ONLY (not seeds). Seeds are never read by this script.
const XRPL_ISSUER_ADDR      = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
const XRPL_DISTRIBUTOR_ADDR = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
const STELLAR_ISSUER_ADDR      = "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4";
const STELLAR_DISTRIBUTOR_ADDR = "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC";

const DOMAIN = "troptions.org";
const TROPTIONS_HEX = "54524F5054494F4E530000000000000000000000";
const NFT_METADATA_URL = `https://${DOMAIN}/troptions/asset-metadata/troptions.nft.collection.v1.json`;
const MPT_METADATA_URL = `https://${DOMAIN}/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json`;

function buildPlan() {
  return {
    schemaVersion: "troptions.provisioning-plan.v1",
    generatedAt: new Date().toISOString(),
    network: { default: "testnet", note: "Mainnet requires explicit --network=mainnet AND all approval IDs." },
    domain: DOMAIN,
    asset: { code: "TROPTIONS", currencyHex: TROPTIONS_HEX, displayDecimals: { xrpl: 6, stellar: 7 } },
    operations: [
      { id: "xrpl.01.issuer-accountset", chain: "xrpl", account: XRPL_ISSUER_ADDR, type: "AccountSet",
        params: { SetFlag: "asfDefaultRipple (8)", Domain: "hex(troptions.org)" } },
      { id: "xrpl.02.distributor-trustset", chain: "xrpl", account: XRPL_DISTRIBUTOR_ADDR, type: "TrustSet",
        params: { LimitAmount: { currency: TROPTIONS_HEX, issuer: XRPL_ISSUER_ADDR, value: "1000000000" } } },
      { id: "xrpl.03.issue-supply", chain: "xrpl", account: XRPL_ISSUER_ADDR, type: "Payment",
        params: { Destination: XRPL_DISTRIBUTOR_ADDR, Amount: { currency: TROPTIONS_HEX, issuer: XRPL_ISSUER_ADDR, value: "100000000" } } },
      { id: "xrpl.04.nft-mint", chain: "xrpl", account: XRPL_DISTRIBUTOR_ADDR, type: "NFTokenMint",
        params: { NFTokenTaxon: 1, TransferFee: 0, URI: NFT_METADATA_URL, Flags: "tfBurnable" },
        requires: ["NFToken amendment enabled"] },
      { id: "xrpl.05.mpt-create", chain: "xrpl", account: XRPL_DISTRIBUTOR_ADDR, type: "MPTokenIssuanceCreate",
        params: { AssetScale: 6, MaximumAmount: "1000000000", TransferFee: 0,
                  Flags: "tfMPTCanLock|tfMPTRequireAuth|tfMPTCanEscrow|tfMPTCanTrade|tfMPTCanTransfer|tfMPTCanClawback",
                  MPTokenMetadata: MPT_METADATA_URL },
        requires: ["MPTokensV1 amendment enabled on connected rippled"] },
      { id: "xrpl.06a.dex-sell", chain: "xrpl", account: XRPL_DISTRIBUTOR_ADDR, type: "OfferCreate",
        params: { TakerGets: { currency: TROPTIONS_HEX, issuer: XRPL_ISSUER_ADDR, value: "10000" }, TakerPays: "1 XRP" } },
      { id: "xrpl.06b.dex-buy", chain: "xrpl", account: XRPL_DISTRIBUTOR_ADDR, type: "OfferCreate",
        params: { TakerGets: "1 XRP", TakerPays: { currency: TROPTIONS_HEX, issuer: XRPL_ISSUER_ADDR, value: "10000" } } },
      { id: "stellar.01.issuer-setoptions", chain: "stellar", account: STELLAR_ISSUER_ADDR, type: "SetOptions",
        params: { homeDomain: DOMAIN, setFlags: "AUTH_REQUIRED|AUTH_REVOCABLE|AUTH_CLAWBACK_ENABLED" } },
      { id: "stellar.02.distributor-changetrust", chain: "stellar", account: STELLAR_DISTRIBUTOR_ADDR, type: "ChangeTrust",
        params: { asset: "TROPTIONS:" + STELLAR_ISSUER_ADDR, limit: "1000000000" } },
      { id: "stellar.03.authorize", chain: "stellar", account: STELLAR_ISSUER_ADDR, type: "SetTrustLineFlags",
        params: { trustor: STELLAR_DISTRIBUTOR_ADDR, asset: "TROPTIONS:" + STELLAR_ISSUER_ADDR, authorized: true } },
      { id: "stellar.04.issue-supply", chain: "stellar", account: STELLAR_ISSUER_ADDR, type: "Payment",
        params: { destination: STELLAR_DISTRIBUTOR_ADDR, asset: "TROPTIONS:" + STELLAR_ISSUER_ADDR, amount: "100000000" } },
      { id: "stellar.05a.dex-sell", chain: "stellar", account: STELLAR_DISTRIBUTOR_ADDR, type: "ManageSellOffer",
        params: { selling: "TROPTIONS:" + STELLAR_ISSUER_ADDR, buying: "XLM", amount: "10000", price: "1/10000" } },
      { id: "stellar.05b.dex-buy", chain: "stellar", account: STELLAR_DISTRIBUTOR_ADDR, type: "ManageBuyOffer",
        params: { selling: "XLM", buying: "TROPTIONS:" + STELLAR_ISSUER_ADDR, buyAmount: "10000", price: "1/10000" } },
    ],
    approvalGates: {
      executeFlag: "--execute",
      defaultNetwork: "testnet",
    },
  };
}

function main() {
  console.log("═".repeat(72));
  console.log("  TROPTIONS PROVISIONING PLAN (unsigned, read-only)");
  console.log("═".repeat(72));

  const plan = buildPlan();

  const outDir = path.join(REPO_ROOT, "data/observability");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const stamp = plan.generatedAt.replace(/[:.]/g, "-");
  const outPath = path.join(outDir, `troptions-provisioning-plan-${stamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(plan, null, 2));

  console.log(`\n  network:    ${plan.network.default}`);
  console.log(`  domain:     ${plan.domain}`);
  console.log(`  asset:      ${plan.asset.code} (XRPL hex ${plan.asset.currencyHex})`);
  console.log(`  operations: ${plan.operations.length}`);
  console.log("\n  Steps:");
  for (const op of plan.operations) {
    console.log(`    • [${op.id}] ${op.chain.padEnd(8)} ${op.type.padEnd(28)} from ${op.account.slice(0, 10)}…`);
  }
  console.log(`\n  📄 Plan written to: ${path.relative(REPO_ROOT, outPath)}`);
  console.log("\n  This plan is UNSIGNED and was NOT submitted.");
  console.log("  Approval IDs required before any execution:");
  for (const [k, v] of Object.entries(plan.approvalGates)) console.log(`    - ${k}: ${v}`);
  console.log("═".repeat(72));
}

main();
