#!/usr/bin/env node
/**
 * launch-goatx-spl.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * GoatX ($GOATX) — Solana SPL token mainnet launch
 *
 * Mints:
 *   - SPL token: GoatX (GOATX), 9 decimals, 1,000,000,000 supply
 *   - Metaplex on-chain metadata pointing at Pinata IPFS metadata JSON
 *   - Image: goat-site logo-400x400.png pinned to IPFS
 *
 * Usage:
 *   node scripts/launch-goatx-spl.mjs                       # dry plan (devnet preview)
 *   node scripts/launch-goatx-spl.mjs --apply --devnet      # devnet end-to-end
 *   node scripts/launch-goatx-spl.mjs --apply               # MAINNET (requires YES + funded wallet)
 *   node scripts/launch-goatx-spl.mjs --apply --revoke-mint --revoke-freeze   # post-mint, lock supply
 *
 * Requires:
 *   - PINATA_JWT in .env.local
 *   - C:\Users\Kevan\.solana-launcher-wallets\house-mint-wallet.json funded
 *     - devnet: free via faucet
 *     - mainnet: ~0.05 SOL minimum (mint + ATA rent + metadata + tx fees)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dir, "..");

// ── Args ────────────────────────────────────────────────────────────────────
const APPLY = process.argv.includes("--apply");
const DEVNET = process.argv.includes("--devnet");
const REVOKE_MINT = process.argv.includes("--revoke-mint");
const REVOKE_FREEZE = process.argv.includes("--revoke-freeze");
const SKIP_CONFIRM = process.argv.includes("--yes");
const walletArg = process.argv.find((a) => a.startsWith("--wallet="));
const WALLET_PATH_OVERRIDE = walletArg ? walletArg.slice("--wallet=".length) : null;
const NETWORK = !APPLY || DEVNET ? "devnet" : "mainnet-beta";
const RPC = NETWORK === "mainnet-beta" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com";

// ── Token config ────────────────────────────────────────────────────────────
const TOKEN = {
  name: "GoatX",
  symbol: "GOATX",
  decimals: 9,
  supply: 1_000_000_000n, // 1 B
  description:
    "GoatX — Gen-2 community digital collectible & token brand. Bot-proof launch, 2/3 multisig, NFT reward vault on Polygon, now bridged to Solana via the Donk X launcher. https://goat.unykorn.org",
  imagePath: path.join("C:\\Users\\Kevan\\goat-site\\images", "logo-400x400.png"),
  externalUrl: "https://goat.unykorn.org",
  links: {
    website: "https://goat.unykorn.org",
    twitter: "https://twitter.com/turbogoatbot",
    telegram: "https://t.me/turbogoatbot",
  },
};

// ── Env ─────────────────────────────────────────────────────────────────────
function loadEnv() {
  const f = path.join(root, ".env.local");
  if (!fs.existsSync(f)) return {};
  const out = {};
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}
const ENV = loadEnv();
const PINATA_JWT = ENV.PINATA_JWT || process.env.PINATA_JWT;
if (APPLY && !PINATA_JWT) {
  console.error("[FATAL] PINATA_JWT missing in .env.local — required for --apply");
  process.exit(1);
}

// ── Wallet ──────────────────────────────────────────────────────────────────
const WALLET_PATH = WALLET_PATH_OVERRIDE || "C:\\Users\\Kevan\\.solana-launcher-wallets\\house-mint-wallet.json";
function loadKeypair() {
  if (!fs.existsSync(WALLET_PATH)) {
    console.error(`[FATAL] Wallet not found: ${WALLET_PATH}`);
    process.exit(1);
  }
  const j = JSON.parse(fs.readFileSync(WALLET_PATH, "utf8"));
  const arr = Array.isArray(j) ? j : j.secretKey;
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

// ── Pinata helpers (only called when --apply) ───────────────────────────────
async function pinFile(filePath, name) {
  const blob = new Blob([fs.readFileSync(filePath)]);
  const fd = new FormData();
  fd.append("file", blob, path.basename(filePath));
  fd.append("pinataMetadata", JSON.stringify({ name }));
  fd.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
  const r = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: fd,
  });
  if (!r.ok) throw new Error(`Pinata file pin ${r.status}: ${await r.text()}`);
  const { IpfsHash } = await r.json();
  return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}
async function pinJSON(obj, name) {
  const r = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { Authorization: `Bearer ${PINATA_JWT}`, "Content-Type": "application/json" },
    body: JSON.stringify({ pinataMetadata: { name }, pinataContent: obj }),
  });
  if (!r.ok) throw new Error(`Pinata JSON pin ${r.status}: ${await r.text()}`);
  const { IpfsHash } = await r.json();
  return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}

// ── Devnet airdrop ──────────────────────────────────────────────────────────
async function ensureDevnetFunds(connection, pubkey) {
  const bal = await connection.getBalance(pubkey);
  if (bal >= 0.5 * LAMPORTS_PER_SOL) return;
  console.log(`  [airdrop] balance=${bal / LAMPORTS_PER_SOL} SOL — requesting 2 SOL via web faucet`);
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch("https://faucet.solana.com/api/request-airdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: pubkey.toBase58(), network: "devnet", amount: 2 }),
      });
      if (r.ok) {
        console.log(`  [airdrop] OK`);
        break;
      }
    } catch {}
    try {
      const sig = await connection.requestAirdrop(pubkey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, "confirmed");
      console.log(`  [airdrop] RPC airdrop ok`);
      break;
    } catch {}
    await new Promise((r) => setTimeout(r, 4000 * (i + 1)));
  }
  for (let i = 0; i < 20; i++) {
    const b = await connection.getBalance(pubkey);
    if (b > 0) {
      console.log(`  [airdrop] confirmed balance=${b / LAMPORTS_PER_SOL} SOL`);
      return;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n=============================================================");
  console.log("  GoatX SPL Launch — Donk X Solana Launcher");
  console.log(`  Network : ${NETWORK.toUpperCase()}`);
  console.log(`  Mode    : ${APPLY ? "[LIVE]" : "[DRY]"}`);
  console.log("=============================================================\n");

  const payer = loadKeypair();
  const payerPubkey = payer.publicKey;
  console.log(`[wallet] payer / mint authority: ${payerPubkey.toBase58()}`);

  const connection = new Connection(RPC, "confirmed");

  if (NETWORK === "devnet" && APPLY) {
    await ensureDevnetFunds(connection, payerPubkey);
  } else if (NETWORK === "mainnet-beta" && APPLY) {
    const bal = await connection.getBalance(payerPubkey);
    console.log(`[balance] mainnet wallet has ${bal / LAMPORTS_PER_SOL} SOL`);
    if (bal < 0.05 * LAMPORTS_PER_SOL) {
      console.error("[FATAL] Mainnet wallet needs ≥0.05 SOL. Fund it then re-run.");
      process.exit(1);
    }
  }

  if (APPLY && !SKIP_CONFIRM) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const question = `\n[CONFIRM] About to launch ${TOKEN.symbol} on ${NETWORK.toUpperCase()}.\n  supply : ${TOKEN.supply.toLocaleString()} (${TOKEN.decimals} decimals)\n  payer  : ${payerPubkey.toBase58()}\n  revoke mint authority?   ${REVOKE_MINT}\n  revoke freeze authority? ${REVOKE_FREEZE}\nType YES to continue: `;
    const a = await new Promise((r) => rl.question(question, r));
    rl.close();
    if (a.trim() !== "YES") {
      console.log("[ABORT]");
      process.exit(0);
    }
  } else if (APPLY && SKIP_CONFIRM) {
    console.log(`[--yes] skipping interactive confirm. Launching ${TOKEN.symbol} on ${NETWORK.toUpperCase()} from ${payerPubkey.toBase58()}.`);
  }

  // ── 1. Pin image + metadata ───────────────────────────────────────────────
  let imageUri = `dry://image/${path.basename(TOKEN.imagePath)}`;
  let metadataUri = `dry://metadata/${TOKEN.symbol}`;
  if (APPLY) {
    console.log("\n[step 1] pinning image to IPFS...");
    imageUri = await pinFile(TOKEN.imagePath, `${TOKEN.symbol}-image`);
    console.log(`         image: ${imageUri}`);

    console.log("[step 2] pinning metadata JSON to IPFS...");
    const metadata = {
      name: TOKEN.name,
      symbol: TOKEN.symbol,
      description: TOKEN.description,
      image: imageUri,
      external_url: TOKEN.externalUrl,
      properties: {
        files: [{ uri: imageUri, type: "image/png" }],
        category: "image",
        creators: [{ address: payerPubkey.toBase58(), share: 100 }],
        links: TOKEN.links,
      },
    };
    metadataUri = await pinJSON(metadata, `${TOKEN.symbol}-metadata`);
    console.log(`         metadata: ${metadataUri}`);
  }

  // ── 3. Build mint tx ──────────────────────────────────────────────────────
  console.log("\n[step 3] building mint + ATA + supply transaction...");
  const mintKeypair = Keypair.generate();
  const mintPubkey = mintKeypair.publicKey;
  const ata = getAssociatedTokenAddressSync(mintPubkey, payerPubkey);
  const rawSupply = TOKEN.supply * 10n ** BigInt(TOKEN.decimals);
  const mintRent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  const tx1 = new Transaction();
  tx1.add(
    SystemProgram.createAccount({
      fromPubkey: payerPubkey,
      newAccountPubkey: mintPubkey,
      space: MINT_SIZE,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(mintPubkey, TOKEN.decimals, payerPubkey, payerPubkey, TOKEN_PROGRAM_ID),
    createAssociatedTokenAccountInstruction(payerPubkey, ata, payerPubkey, mintPubkey),
    createMintToInstruction(mintPubkey, ata, payerPubkey, rawSupply),
  );

  console.log(`         mint  : ${mintPubkey.toBase58()}`);
  console.log(`         ATA   : ${ata.toBase58()}`);
  console.log(`         supply (raw): ${rawSupply.toString()}`);

  if (!APPLY) {
    console.log("\n[DRY] stopping before sending. Re-run with --apply (and --devnet for test).");
    return;
  }

  console.log("\n[step 4] sending mint tx...");
  const sig1 = await sendAndConfirmTransaction(connection, tx1, [payer, mintKeypair], { commitment: "confirmed" });
  console.log(`         tx: ${sig1}`);

  // ── 4. Metaplex metadata ──────────────────────────────────────────────────
  console.log("\n[step 5] writing Metaplex metadata...");
  const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    METADATA_PROGRAM_ID,
  );
  const metaIx = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mintPubkey,
      mintAuthority: payerPubkey,
      payer: payerPubkey,
      updateAuthority: payerPubkey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: TOKEN.name,
          symbol: TOKEN.symbol,
          uri: metadataUri,
          sellerFeeBasisPoints: 0,
          creators: [{ address: payerPubkey, verified: true, share: 100 }],
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    },
  );
  const tx2 = new Transaction().add(metaIx);
  const sig2 = await sendAndConfirmTransaction(connection, tx2, [payer], { commitment: "confirmed" });
  console.log(`         tx: ${sig2}`);

  // ── 5. Optional authority revocation ──────────────────────────────────────
  let revokeMintSig = null;
  let revokeFreezeSig = null;
  if (REVOKE_MINT) {
    console.log("\n[step 6a] revoking mint authority (supply locked forever)...");
    const ix = createSetAuthorityInstruction(mintPubkey, payerPubkey, AuthorityType.MintTokens, null);
    revokeMintSig = await sendAndConfirmTransaction(connection, new Transaction().add(ix), [payer], { commitment: "confirmed" });
    console.log(`         tx: ${revokeMintSig}`);
  }
  if (REVOKE_FREEZE) {
    console.log("[step 6b] revoking freeze authority...");
    const ix = createSetAuthorityInstruction(mintPubkey, payerPubkey, AuthorityType.FreezeAccount, null);
    revokeFreezeSig = await sendAndConfirmTransaction(connection, new Transaction().add(ix), [payer], { commitment: "confirmed" });
    console.log(`         tx: ${revokeFreezeSig}`);
  }

  // ── 6. Persist manifest ───────────────────────────────────────────────────
  const cluster = NETWORK === "mainnet-beta" ? "" : `?cluster=${NETWORK}`;
  const manifest = {
    network: NETWORK,
    minted_at: new Date().toISOString(),
    mint: mintPubkey.toBase58(),
    ata: ata.toBase58(),
    payer: payerPubkey.toBase58(),
    tx_create: sig1,
    tx_metadata: sig2,
    tx_revoke_mint: revokeMintSig,
    tx_revoke_freeze: revokeFreezeSig,
    image_uri: imageUri,
    metadata_uri: metadataUri,
    token: { ...TOKEN, supply: TOKEN.supply.toString(), imagePath: TOKEN.imagePath },
    explorer: {
      mint: `https://explorer.solana.com/address/${mintPubkey.toBase58()}${cluster}`,
      tx_create: `https://explorer.solana.com/tx/${sig1}${cluster}`,
      tx_metadata: `https://explorer.solana.com/tx/${sig2}${cluster}`,
      solscan: `https://solscan.io/token/${mintPubkey.toBase58()}${NETWORK === "mainnet-beta" ? "" : "?cluster=devnet"}`,
    },
  };
  const dataDir = path.join(root, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, `goatx-launch-${NETWORK}.json`);
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2));
  console.log(`\n[manifest] ${file}`);

  console.log("\n=============================================================");
  console.log("  ✅ GoatX SPL launched");
  console.log("=============================================================");
  console.log(`  Mint        : ${mintPubkey.toBase58()}`);
  console.log(`  Explorer    : ${manifest.explorer.mint}`);
  console.log(`  Solscan     : ${manifest.explorer.solscan}`);
  console.log(`  Metadata    : ${metadataUri}`);
  console.log(`  Image       : ${imageUri}`);
  console.log("\nNEXT:");
  if (NETWORK === "devnet") {
    console.log("  1. Verify on Solscan devnet, refresh metadata in Phantom.");
    console.log("  2. When ready, fund the same wallet w/ ≥0.05 SOL on mainnet then run:");
    console.log("       node scripts/launch-goatx-spl.mjs --apply --revoke-mint --revoke-freeze");
  } else {
    console.log("  1. Submit token to Solscan + Jupiter token list.");
    console.log("  2. Seed initial Raydium / Orca pool.");
    console.log("  3. UNCX-lock the LP.");
    console.log("  4. Update goat.unykorn.org with the Solana mint address.");
  }
}

main().catch((e) => {
  console.error("\n[FATAL]", e);
  process.exit(1);
});
