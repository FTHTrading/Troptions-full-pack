#!/usr/bin/env node
/**
 * mint-devnet-token.mjs
 * ---------------------
 * Creates a REAL SPL token on Solana devnet with Metaplex metadata.
 *
 * Prerequisites:
 *   1. Get devnet SOL → https://faucet.solana.com  (need ~0.05 SOL)
 *   2. Run:  node scripts/mint-devnet-token.mjs [--keypair path/to/keypair.json]
 *
 * If no keypair is provided, a new one is generated, an airdrop is attempted,
 * and the keypair is saved to scripts/.devnet-keypair.json for reuse.
 *
 * After minting, the script prints the new mint address and which files to update.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';

/* ── Config ───────────────────────────────────────────────────────── */
const TOKEN_NAME     = 'Solana Launcher Sample';
const TOKEN_SYMBOL   = 'LAUNCH';
const TOKEN_DECIMALS = 6;
const INITIAL_SUPPLY = 1_000_000_000; // 1 billion tokens
const METADATA_URI   = 'https://launch.unykorn.org/api/sample-token-metadata.json';
const RPC            = clusterApiUrl('devnet');

/* ── Helpers ──────────────────────────────────────────────────────── */
const KEYPAIR_FILE = new URL('.devnet-keypair.json', import.meta.url).pathname
  .replace(/^\/([A-Z]:)/, '$1'); // fix Windows paths

function loadOrCreateKeypair(customPath) {
  if (customPath && existsSync(customPath)) {
    console.log(`🔑  Loading keypair from ${customPath}`);
    const raw = JSON.parse(readFileSync(customPath, 'utf-8'));
    return Keypair.fromSecretKey(Uint8Array.from(raw));
  }
  if (existsSync(KEYPAIR_FILE)) {
    console.log(`🔑  Reusing saved keypair from ${KEYPAIR_FILE}`);
    const raw = JSON.parse(readFileSync(KEYPAIR_FILE, 'utf-8'));
    return Keypair.fromSecretKey(Uint8Array.from(raw));
  }
  const kp = Keypair.generate();
  writeFileSync(KEYPAIR_FILE, JSON.stringify(Array.from(kp.secretKey)));
  console.log(`🔑  Generated new keypair → ${KEYPAIR_FILE}`);
  return kp;
}

async function ensureFunded(conn, kp) {
  const balance = await conn.getBalance(kp.publicKey);
  const needed = 0.05 * LAMPORTS_PER_SOL;
  if (balance >= needed) {
    console.log(`💰  Balance: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL — sufficient`);
    return;
  }
  console.log(`💰  Balance: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL — attempting airdrop…`);
  try {
    const sig = await conn.requestAirdrop(kp.publicKey, LAMPORTS_PER_SOL);
    await conn.confirmTransaction(sig, 'confirmed');
    const newBal = await conn.getBalance(kp.publicKey);
    console.log(`✅  Airdrop success! New balance: ${(newBal / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
  } catch (err) {
    console.error('\n❌  Airdrop failed:', err.message);
    console.error('\n📋  Manual steps:');
    console.error(`    1. Go to https://faucet.solana.com`);
    console.error(`    2. Select "Devnet"`);
    console.error(`    3. Paste this address: ${kp.publicKey.toBase58()}`);
    console.error(`    4. Request at least 1 SOL`);
    console.error(`    5. Re-run this script\n`);
    process.exit(1);
  }
}

/* ── Main ─────────────────────────────────────────────────────────── */
async function main() {
  const customKp = process.argv.find((a) => a === '--keypair')
    ? process.argv[process.argv.indexOf('--keypair') + 1]
    : null;

  const conn = new Connection(RPC, 'confirmed');
  const payer = loadOrCreateKeypair(customKp);
  console.log(`👛  Payer: ${payer.publicKey.toBase58()}`);

  await ensureFunded(conn, payer);

  /* 1. Create SPL token mint */
  console.log('\n⚙️   Creating SPL token mint…');
  const mint = await createMint(
    conn,
    payer,
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority (revocable later)
    TOKEN_DECIMALS,
  );
  console.log(`✅  Mint created: ${mint.toBase58()}`);

  /* 2. Create token account & mint initial supply */
  console.log('⚙️   Minting initial supply…');
  const ata = await getOrCreateAssociatedTokenAccount(conn, payer, mint, payer.publicKey);
  const rawSupply = BigInt(INITIAL_SUPPLY) * BigInt(10 ** TOKEN_DECIMALS);
  await mintTo(conn, payer, mint, ata.address, payer, rawSupply);
  console.log(`✅  Minted ${INITIAL_SUPPLY.toLocaleString()} ${TOKEN_SYMBOL} to ${ata.address.toBase58()}`);

  /* 3. Attach Metaplex metadata */
  console.log('⚙️   Attaching Metaplex metadata…');
  const metaplex = Metaplex.make(conn).use(keypairIdentity(payer));
  const { nft } = await metaplex.nfts().create({
    uri: METADATA_URI,
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    sellerFeeBasisPoints: 0,
    useExistingMint: mint,
    tokenOwner: payer.publicKey,
  });
  console.log(`✅  Metadata attached: ${nft.address.toBase58()}`);

  /* 4. Revoke mint authority (immutable supply) */
  // Uncomment the line below to make supply immutable:
  // await setAuthority(conn, payer, mint, payer, AuthorityType.MintTokens, null);

  /* ── Summary ────────────────────────────────────────────── */
  const mintAddr = mint.toBase58();
  console.log('\n' + '═'.repeat(60));
  console.log('🎉  DEVNET TOKEN CREATED SUCCESSFULLY');
  console.log('═'.repeat(60));
  console.log(`   Mint:      ${mintAddr}`);
  console.log(`   Supply:    ${INITIAL_SUPPLY.toLocaleString()} ${TOKEN_SYMBOL}`);
  console.log(`   Decimals:  ${TOKEN_DECIMALS}`);
  console.log(`   Metadata:  ${METADATA_URI}`);
  console.log(`   Solscan:   https://solscan.io/token/${mintAddr}?cluster=devnet`);
  console.log(`   Explorer:  https://launch.unykorn.org/token/${mintAddr}`);
  console.log('═'.repeat(60));

  console.log('\n📝  Update these files with the new mint address:\n');
  console.log(`   1. app/(marketing)/page.tsx`);
  console.log(`      → DEVNET_SAMPLE.mint = '${mintAddr}'`);
  console.log(`   2. components/token/TokenPageClient.tsx`);
  console.log(`      → SAMPLE_MINT = '${mintAddr}'`);
  console.log(`   3. public/api/sample-token-metadata.json`);
  console.log(`      (no change needed unless you want to update the address field)`);
  console.log(`   4. FREELANCER_BID.md`);
  console.log(`      → Update sample token URL\n`);

  console.log('Then run:  npm run verify && npx vercel --prod\n');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
