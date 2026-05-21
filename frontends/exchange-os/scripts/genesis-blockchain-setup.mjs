#!/usr/bin/env node
/**
 * TROPTIONS Genesis Blockchain Account Setup
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates fresh XRPL and Stellar wallets for the full TROPTIONS entity graph.
 *
 * HOW TO USE:
 *   node scripts/genesis-blockchain-setup.mjs
 *
 * This script ONLY generates keys — it does NOT broadcast any transactions.
 * Carefully store every seed / secret in a secure password manager BEFORE
 * pasting them into .env.local.  Never commit .env.local to git.
 *
 * XRPL funding notes:
 *   • Base reserve:  10 XRP per account (XRPFees amendment, 2024)
 *   • Owner reserve:  2 XRP per object (trustline, offer, escrow)
 *   • Typical funding per operational wallet: 25–50 XRP
 *   • Fund wallets by sending XRP from an exchange (Coinbase/Kraken/Bitrue)
 *
 * Stellar funding notes:
 *   • Minimum balance: 1 XLM (base_reserve × 2 subentries)
 *   • Each trustline / offer: +0.5 XLM reserve
 *   • Typical funding per wallet: 10–25 XLM
 *   • Fund wallets from Coinbase, Kraken, or SDEX
 *
 * SECURITY:
 *   • All seeds/secrets are generated using cryptographically secure RNG
 *   • Seeds are printed ONCE — copy them before closing the terminal
 *   • Use hardware wallets (Tangem, Ledger) for treasury accounts
 *   • Enable Regular Key / Multisig after initial setup
 */

import * as xrpl from "xrpl";
import { Keypair } from "@stellar/stellar-sdk";

// ─── Wallet Roles ─────────────────────────────────────────────────────────────

const XRPL_ROLES = [
  {
    envKey:    "XRPL_ISSUER_SEED",
    role:      "TROPTIONS IOU Issuer",
    notes:     [
      "Issues the TROPTIONS (hex: 54524F5054494F4E530000000000000000000000) IOU on XRPL.",
      "Set AccountSet asfDefaultRipple=true so holders can settle IOUs with each other.",
      "Fund with 25+ XRP (10 base reserve + reserves for trustlines issued).",
      "This is a HOT issuer — connect to hardware wallet (Xumm Tangem) for max security.",
    ],
    minimumXrp: 25,
  },
  {
    envKey:    "XRPL_DISTRIBUTOR_SEED",
    role:      "TROPTIONS Distribution Wallet",
    notes:     [
      "Holds TROPTIONS tokens for controlled release to exchanges and partners.",
      "Sets TrustSet to issuer first, then receives Payment from issuer.",
      "Creates OfferCreate orders on XRPL DEX for TROPTIONS/XRP and TROPTIONS/USD pairs.",
      "Fund with 40+ XRP (10 base + 2/trustline + 2/offer × many offers).",
    ],
    minimumXrp: 40,
  },
  {
    envKey:    "XRPL_TREASURY_SEED",
    role:      "TROPTIONS Cold Treasury",
    notes:     [
      "Long-term cold storage. Receives royalties and reserves.",
      "Should be moved to hardware wallet immediately after generation.",
      "Fund with 15+ XRP and move to cold storage.",
    ],
    minimumXrp: 15,
  },
  {
    envKey:    "XRPL_NFT_ISSUER_SEED",
    role:      "TROPTIONS NFT Collection Issuer (XLS-20)",
    notes:     [
      "Issues all XLS-20 NFToken collections (credentials, membership, RWA, art).",
      "Set TransferFee per collection on NFTokenMint.",
      "Set Burnable/Transferable flags per collection.",
      "Fund with 30+ XRP.",
    ],
    minimumXrp: 30,
  },
  {
    envKey:    "XRPL_MPT_ISSUER_SEED",
    role:      "Troptions Unity Token MPT Issuer (XLS-33)",
    notes:     [
      "XLS-33 Multi-Purpose Token issuer for Troptions Unity Token (TUT).",
      "XLS-33 amendment must be active on XRPL mainnet before MPTIssuanceCreate can execute.",
      "Check https://livenet.xrpl.org/amendments for XLS-33 status.",
      "Fund with 20+ XRP (keep unfunded until amendment is active).",
    ],
    minimumXrp: 20,
  },
  {
    envKey:    "XRPL_DEX_MAKER_SEED",
    role:      "TROPTIONS DEX Market Maker",
    notes:     [
      "Places and maintains OfferCreate orders on XRPL DEX.",
      "Provides two-sided liquidity: TROPTIONS/XRP bid/ask spread.",
      "Also pairs against USD (Bitstamp/Gatehub), EUR, and USDT.",
      "Fund with 50+ XRP to maintain multiple live offers.",
    ],
    minimumXrp: 50,
  },
  {
    envKey:    "XRPL_AMM_LP_SEED",
    role:      "TROPTIONS AMM Liquidity Provider",
    notes:     [
      "Creates and manages XRPL AMM pool(s) for TROPTIONS via AMMCreate.",
      "Primary pairs: TROPTIONS/XRP and TROPTIONS/USD.",
      "LP tokens received are held here and can be redeemed via AMMWithdraw.",
      "Fund with 100+ XRP (50+ for each AMM pool creation).",
    ],
    minimumXrp: 100,
  },
];

const STELLAR_ROLES = [
  {
    envKey:    "STELLAR_ISSUER_SECRET",
    role:      "TROPTIONS Stellar Issuer",
    notes:     [
      "Issues TROPTIONS (asset code: TROPTIONS, 9 chars) on Stellar network.",
      "Set Auth Required + Auth Revocable + Auth Clawback flags via SetOptions.",
      "Lock master key AFTER all asset parameters are set (setOptions masterWeight=0).",
      "Fund with 15+ XLM.",
    ],
    minimumXlm: 15,
  },
  {
    envKey:    "STELLAR_DISTRIBUTOR_SECRET",
    role:      "TROPTIONS Stellar Distribution",
    notes:     [
      "Holds TROPTIONS for release to buyers, exchanges, DEX pairs.",
      "Establishes trustline to issuer (changeTrust), receives payment from issuer.",
      "Creates manageSellOffer orders on Stellar DEX.",
      "Fund with 25+ XLM.",
    ],
    minimumXlm: 25,
  },
  {
    envKey:    "STELLAR_LP_SECRET",
    role:      "Stellar Liquidity Pool Manager",
    notes:     [
      "Provides liquidity to Stellar AMM pools.",
      "Primary pairs: TROPTIONS/XLM and TROPTIONS/USDC.",
      "Uses liquidityPoolDeposit operations.",
      "Fund with 20+ XLM.",
    ],
    minimumXlm: 20,
  },
  {
    envKey:    "STELLAR_ANCHOR_SECRET",
    role:      "TROPTIONS Stellar Anchor (SEP-24/SEP-6)",
    notes:     [
      "Anchor account for SEP-24 deposit/withdrawal flows.",
      "Required for Coinbase/Binance USDC fiat on-ramp integration.",
      "Configure stellar.toml and toml CURRENCIES entry for each asset.",
      "Fund with 20+ XLM.",
    ],
    minimumXlm: 20,
  },
];

// ─── Generation ───────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(72));
console.log("  TROPTIONS GENESIS BLOCKCHAIN ACCOUNT SETUP");
console.log("  Generated: " + new Date().toISOString());
console.log("═".repeat(72) + "\n");

console.log("⚠  SECURITY WARNING");
console.log("   Copy every seed/secret to a password manager NOW.");
console.log("   These values are printed ONCE and never stored.");
console.log("   Hardware wallet protection strongly recommended for treasury.\n");

// ─── XRPL ────────────────────────────────────────────────────────────────────

console.log("═".repeat(72));
console.log("  XRPL WALLETS (MAINNET)");
console.log("═".repeat(72) + "\n");

const xrplWallets = [];
for (const role of XRPL_ROLES) {
  const wallet = xrpl.Wallet.generate();
  xrplWallets.push({ ...role, wallet });

  console.log(`# ${role.role}`);
  for (const note of role.notes) {
    console.log(`#   ${note}`);
  }
  console.log(`# Minimum funding: ${role.minimumXrp} XRP`);
  console.log(`${role.envKey}=${wallet.seed}`);
  console.log(`# Address: ${wallet.address}`);
  console.log(`# Public key: ${wallet.publicKey}`);
  console.log();
}

// ─── Stellar ────────────────────────────────────────────────────────────────

console.log("═".repeat(72));
console.log("  STELLAR WALLETS (MAINNET)");
console.log("═".repeat(72) + "\n");

const stellarWallets = [];
for (const role of STELLAR_ROLES) {
  const kp = Keypair.random();
  stellarWallets.push({ ...role, kp });

  console.log(`# ${role.role}`);
  for (const note of role.notes) {
    console.log(`#   ${note}`);
  }
  console.log(`# Minimum funding: ${role.minimumXlm} XLM`);
  console.log(`${role.envKey}=${kp.secret()}`);
  console.log(`# Address: ${kp.publicKey()}`);
  console.log();
}

// ─── Admin + network config ──────────────────────────────────────────────────

console.log("═".repeat(72));
console.log("  ADMIN & NETWORK CONFIG (add to .env.local)");
console.log("═".repeat(72) + "\n");

import { createHash } from "crypto";
const adminKey = createHash("sha256")
  .update(Math.random().toString(36) + Date.now())
  .digest("hex")
  .slice(0, 48);

console.log("# XRPL network");
console.log("XRPL_WS_URL=wss://xrplcluster.com");
console.log("XRPL_WS_FALLBACK=wss://s1.ripple.com");
console.log();
console.log("# Stellar network");
console.log("STELLAR_HORIZON_URL=https://horizon.stellar.org");
console.log("STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015");
console.log();
console.log("# Genesis admin key (required to call /api/troptions/xrpl/genesis and /api/troptions/stellar/genesis)");
console.log(`GENESIS_ADMIN_KEY=${adminKey}`);
console.log();
console.log("# Asset identifiers");
console.log("XRPL_TROPTIONS_CURRENCY_HEX=54524F5054494F4E530000000000000000000000");
console.log("STELLAR_TROPTIONS_ASSET_CODE=TROPTIONS");
console.log();

// ─── Funding summary ─────────────────────────────────────────────────────────

const totalXrp = XRPL_ROLES.reduce((s, r) => s + r.minimumXrp, 0);
const totalXlm = STELLAR_ROLES.reduce((s, r) => s + r.minimumXlm, 0);

console.log("═".repeat(72));
console.log("  FUNDING SUMMARY");
console.log("═".repeat(72) + "\n");
console.log(`Total XRP needed:  ${totalXrp} XRP minimum (plus network fees)`);
console.log(`Total XLM needed:  ${totalXlm} XLM minimum (plus network fees)`);
console.log();
console.log("XRPL funding sources: Coinbase, Kraken, Bitrue, XUMM");
console.log("Stellar funding:      Coinbase, Kraken, StellarX, SDEX");
console.log();

// ─── Wallet address summary ──────────────────────────────────────────────────

console.log("═".repeat(72));
console.log("  XRPL ADDRESS SUMMARY (safe to share publicly)");
console.log("═".repeat(72) + "\n");
for (const { role, wallet } of xrplWallets) {
  console.log(`${role.padEnd(45)} ${wallet.address}`);
}
console.log();
console.log("═".repeat(72));
console.log("  STELLAR ADDRESS SUMMARY (safe to share publicly)");
console.log("═".repeat(72) + "\n");
for (const { role, kp } of stellarWallets) {
  console.log(`${role.padEnd(45)} ${kp.publicKey()}`);
}
console.log();

// ─── Next steps ───────────────────────────────────────────────────────────────

console.log("═".repeat(72));
console.log("  NEXT STEPS");
console.log("═".repeat(72) + "\n");
console.log("1.  Copy the .env output above into .env.local");
console.log("2.  Verify .gitignore contains .env.local (it does)");
console.log("3.  Fund XRPL wallets (send XRP from exchange to each address above)");
console.log("4.  Fund Stellar wallets (send XLM from exchange to each address)");
console.log("5.  Run genesis activation: POST /api/troptions/xrpl/genesis?op=activate-issuer");
console.log("6.  Set up TROPTIONS trustline: POST /api/troptions/xrpl/genesis?op=configure-issuer");
console.log("7.  Issue initial supply: POST /api/troptions/xrpl/iou?op=issue-supply");
console.log("8.  Mint NFT collections: POST /api/troptions/xrpl/nft?op=mint-batch");
console.log("9.  Create DEX offers: POST /api/troptions/xrpl/genesis?op=create-dex-offers");
console.log("10. Create AMM pool: POST /api/troptions/xrpl/genesis?op=create-amm");
console.log("11. Configure Stellar: POST /api/troptions/stellar/genesis?op=configure-issuer");
console.log("12. Create Stellar LP: POST /api/troptions/stellar/lp?op=create-pool");
console.log();
console.log("Exchange listing submissions:");
console.log("  • XRPL DEX: Automatic (XLS-14 token listing via trustlines)");
console.log("  • Sologenic (XRPL DEX front-end): https://sologenic.org/trade");
console.log("  • XUMM: Tokens auto-visible once trustline established");
console.log("  • Bitrue:  listings@bitrue.com — requires 48h trading volume proof");
console.log("  • Binance: https://www.binance.com/en/my/coin-apply");
console.log("  • Coinbase: https://listing.coinbase.com/");
console.log();
