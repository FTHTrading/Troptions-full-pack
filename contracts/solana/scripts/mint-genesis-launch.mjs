#!/usr/bin/env node
/**
 * mint-genesis-launch.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * TROPTIONS WC2026 Genesis Vault — mainnet mint
 *
 * Mints:
 *   [1] TROPTIONS Logo Mark — Sovereign (1/1, founder wallet)
 *   [2] Donk Mascot — WC2026 Genesis (1/1, founder wallet)
 *   [3] WC2026 Genesis Crown (1/1, founder wallet)
 *   [4] 99x Donk Founder Pass (series, public sale)
 *
 * Usage:
 *   node scripts/mint-genesis-launch.mjs              # dry plan
 *   node scripts/mint-genesis-launch.mjs --apply      # mainnet
 *   node scripts/mint-genesis-launch.mjs --apply --devnet  # devnet test
 *
 * Requires:
 *   - PINATA_JWT in .env.local
 *   - GENESIS_MINT_SECRET in .env.local  (for mint-count API updates)
 *   - House wallet funded: C:\Users\Kevan\.solana-launcher-wallets\house-mint-wallet.json
 *     Mainnet needs: ~3 SOL (royalties + minting fees + 99 NFT storage)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const root  = path.resolve(__dir, '..');

// ── Args ────────────────────────────────────────────────────────────────────
const APPLY   = process.argv.includes('--apply');
const DEVNET  = process.argv.includes('--devnet');
const NETWORK = (!APPLY || DEVNET) ? 'devnet' : 'mainnet-beta';
const RPC     = NETWORK === 'mainnet-beta'
  ? 'https://api.mainnet-beta.solana.com'
  : 'https://api.devnet.solana.com';

// ── Env ─────────────────────────────────────────────────────────────────────
function loadEnv() {
  const envFile = path.join(root, '.env.local');
  if (!fs.existsSync(envFile)) return {};
  const raw = fs.readFileSync(envFile, 'utf8');
  const out = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    out[k] = v;
  }
  return out;
}
const ENV = loadEnv();
const PINATA_JWT         = ENV.PINATA_JWT         || process.env.PINATA_JWT;
const GENESIS_MINT_SECRET= ENV.GENESIS_MINT_SECRET|| process.env.GENESIS_MINT_SECRET || 'dev-secret';

if (!PINATA_JWT) {
  console.error('[FATAL] PINATA_JWT not found in .env.local');
  process.exit(1);
}

// ── Wallet ──────────────────────────────────────────────────────────────────
const WALLET_PATH = 'C:\\Users\\Kevan\\.solana-launcher-wallets\\house-mint-wallet.json';

function loadWallet() {
  if (!fs.existsSync(WALLET_PATH)) {
    console.error(`[FATAL] House mint wallet not found: ${WALLET_PATH}`);
    console.error('Create and fund a reviewed house mint wallet before running production mint flows.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(WALLET_PATH, 'utf8'));
}

// ── IPFS ─────────────────────────────────────────────────────────────────────
async function pinImage(imagePath, name) {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }
  log(`  [IPFS] Uploading image: ${path.basename(imagePath)}`);
  const blob    = new Blob([fs.readFileSync(imagePath)]);
  const fd      = new FormData();
  fd.append('file', blob, path.basename(imagePath));
  fd.append('pinataMetadata', JSON.stringify({ name }));
  fd.append('pinataOptions',  JSON.stringify({ cidVersion: 1 }));

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method:  'POST',
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body:    fd,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata upload failed (${res.status}): ${err}`);
  }
  const { IpfsHash } = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}

async function pinJSON(obj, name) {
  log(`  [IPFS] Pinning metadata: ${name}`);
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pinataMetadata: { name },
      pinataContent:  obj,
    }),
  });
  if (!res.ok) throw new Error(`Pinata JSON pin failed (${res.status}): ${await res.text()}`);
  const { IpfsHash } = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}

// ── Logging ──────────────────────────────────────────────────────────────────
const MANIFEST_PATH = path.join(root, 'data', 'genesis-mint-manifest.json');
const LOG_PATH      = path.join(root, 'data', 'genesis-mint-log.jsonl');
const manifest      = { network: NETWORK, startedAt: new Date().toISOString(), assets: [] };

function log(msg) { console.log(msg); }

function save() {
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function appendLog(entry) {
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.appendFileSync(LOG_PATH, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n');
}

// ── Solana mint (Metaplex JS SDK) ─────────────────────────────────────────────
async function mintNFT({ name, symbol, description, imageUrl, metadataUrl, sellerFeeBasis, isFounderPass, edition, totalEditions, walletKeypair }) {
  if (!APPLY) {
    log(`    [DRY] Would mint: ${name} (${NETWORK})`);
    return { mint: `DRY_RUN_MINT_${Date.now()}`, tx: 'DRY_RUN_TX', metadataUrl };
  }

  // Dynamic import Metaplex (so dry runs don't need the SDK loaded)
  const { Metaplex, keypairIdentity, bundlrStorage } = await import('@metaplex-foundation/js');
  const { Connection, Keypair }                       = await import('@solana/web3.js');

  const secretKey  = Uint8Array.from(walletKeypair);
  const keypair    = Keypair.fromSecretKey(secretKey);
  const connection = new Connection(RPC, 'confirmed');
  const mx         = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage());

  log(`    [MINT] Creating NFT on ${NETWORK}...`);

  const { nft } = await mx.nfts().create({
    uri:            metadataUrl,
    name,
    sellerFeeBasisPoints: sellerFeeBasis,
    symbol,
    isMutable:      false,
    maxSupply:      isFounderPass ? BigInt(totalEditions ?? 99) : BigInt(1),
  });

  log(`    [OK]   Mint: ${nft.address.toBase58()}`);
  return { mint: nft.address.toBase58(), tx: nft.token?.address?.toBase58() ?? 'ok', metadataUrl };
}

// ── Assets to mint ───────────────────────────────────────────────────────────
const FOUNDER_WALLET = '2emT8ZfQXH9Nip1HP7Jw653GCpxwVjnNqUcmQgcZaXFj';

const SOVEREIGN_NFTS = [
  {
    id:          'troptions-logo-sovereign',
    name:        'TROPTIONS Logo Mark — Sovereign',
    symbol:      'TRP-LOGO',
    description: 'The TROPTIONS brand mark. Minted once on Solana mainnet as a 1/1 sovereign NFT. This token is the cryptographic title deed to the TROPTIONS logo. One exists. One ever will.',
    imagePath:   path.join(root, 'public', 'images', 'brand', 'logo-primary.png'),
    imageAlt:    'TROPTIONS Logo Mark',
    sellerFee:   0,     // brand asset — no royalty, founder keeps
    attributes:  [
      { trait_type: 'Asset Type',  value: 'Brand IP'   },
      { trait_type: 'Edition',     value: '1 of 1'     },
      { trait_type: 'Rights',      value: 'Sovereign'  },
      { trait_type: 'Network',     value: 'Solana'     },
    ],
  },
  {
    id:          'donk-mascot-genesis',
    name:        'Donk Mascot — WC2026 Genesis',
    symbol:      'DONK-GEN',
    description: 'The original Donk. AI mascot of the TROPTIONS WC2026 prediction market. Minted as a sovereign 1/1 to the founder wallet. Open-source design, immutable on-chain provenance.',
    imagePath:   path.join(root, 'public', 'images', 'donk', 'donk.png'),
    imageAlt:    'Donk — WC2026 Genesis Mascot',
    sellerFee:   500,   // 5% royalty on secondary
    attributes:  [
      { trait_type: 'Asset Type',  value: 'Mascot IP'       },
      { trait_type: 'Edition',     value: '1 of 1'          },
      { trait_type: 'Character',   value: 'Donk'            },
      { trait_type: 'Event',       value: 'WC2026'          },
      { trait_type: 'Minted',      value: new Date().toISOString().slice(0, 10) },
    ],
  },
  {
    id:          'wc2026-genesis-crown',
    name:        'WC2026 Genesis Crown',
    symbol:      'WC26-CROWN',
    description: `The genesis block NFT. Immutably records the timestamp, Solana block height, and founder pubkey of the TROPTIONS WC2026 prediction market launch. Minted ${new Date().toISOString()}.`,
    imagePath:   path.join(root, 'public', 'images', 'brand', 'logo-mark.png'),
    imageAlt:    'WC2026 Genesis Crown',
    sellerFee:   1000,  // 10% royalty
    attributes:  [
      { trait_type: 'Asset Type',    value: 'Genesis Certificate' },
      { trait_type: 'Edition',       value: '1 of 1'              },
      { trait_type: 'Launch Date',   value: new Date().toISOString().slice(0, 10) },
      { trait_type: 'Network',       value: 'Solana'              },
      { trait_type: 'Founder',       value: FOUNDER_WALLET        },
    ],
  },
];

const FOUNDER_PASS = {
  id:           'donk-founder-pass',
  name:         'Donk Founder Pass',
  symbol:       'DONK-FP',
  description:  'One of 99 Donk Founder Passes. Holders receive founder access to TROPTIONS tools, campaign templates, namespace previews, and private product updates. No revenue, yield, investment return, or automatic distribution is promised.',
  imagePath:    path.join(root, 'public', 'images', 'donk', 'donk.png'),
  imageAlt:     'Donk Founder Pass',
  totalEditions: 99,
  sellerFee:    500,   // 5%
  attributes:  [
    { trait_type: 'Asset Type',     value: 'Founder Pass'     },
    { trait_type: 'Total Editions', value: '99'               },
    { trait_type: 'Access',         value: 'Founder'          },
    { trait_type: 'Yield Promise',  value: 'None'             },
    { trait_type: 'Collection',     value: 'WC2026 Genesis'   },
    { trait_type: 'Network',        value: 'Solana'           },
  ],
};

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  log('');
  log('=============================================================');
  log('  TROPTIONS WC2026 Genesis Vault — Mint Script');
  log(`  Network : ${NETWORK.toUpperCase()}`);
  log(`  Mode    : ${APPLY ? '[LIVE]' : '[DRY PLAN]'}`);
  log('=============================================================');
  log('');

  const walletData = loadWallet();
  const walletPubkey = walletData._pubkey || FOUNDER_WALLET;
  log(`[WALLET] House mint wallet: ${walletPubkey}`);

  if (APPLY) {
    // Confirm
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise((resolve) =>
      rl.question(`\n[CONFIRM] About to mint LIVE on ${NETWORK}.\nType YES to continue: `, resolve)
    );
    rl.close();
    if (answer.trim() !== 'YES') { log('[ABORT] Cancelled.'); process.exit(0); }
  }

  log('');
  log('[STEP 1] Minting sovereign 1/1 NFTs...');

  for (const asset of SOVEREIGN_NFTS) {
    log(`\n  >> ${asset.name}`);
    try {
      // Upload image
      const imageUrl = APPLY ? await pinImage(asset.imagePath, asset.id) : `DRY_IMAGE_${asset.id}`;

      // Build metadata
      const metadata = {
        name:        asset.name,
        symbol:      asset.symbol,
        description: asset.description,
        image:       imageUrl,
        external_url:'https://launch.unykorn.org/genesis',
        attributes:  asset.attributes,
        properties: {
          files:    [{ uri: imageUrl, type: 'image/png' }],
          category: 'image',
          creators: [{ address: walletPubkey, share: 100 }],
        },
        seller_fee_basis_points: asset.sellerFee,
      };

      const metadataUrl = APPLY ? await pinJSON(metadata, `${asset.id}-metadata`) : `DRY_META_${asset.id}`;

      // Mint
      const result = await mintNFT({
        name:         asset.name,
        symbol:       asset.symbol,
        description:  asset.description,
        imageUrl,
        metadataUrl,
        sellerFeeBasis: asset.sellerFee,
        isFounderPass:  false,
        walletKeypair:  walletData._keypair || walletData,
      });

      const entry = { ...asset.attributes.reduce((a, t) => ({ ...a, [t.trait_type]: t.value }), {}), id: asset.id, name: asset.name, mint: result.mint, metadataUrl, imageUrl, minted: APPLY };
      manifest.assets.push(entry);
      appendLog({ type: 'sovereign-nft', ...entry });
      log(`  [OK] ${asset.name} => ${result.mint}`);
    } catch (err) {
      log(`  [FAIL] ${asset.name}: ${err.message}`);
      appendLog({ type: 'error', asset: asset.id, error: err.message });
    }
    save();
  }

  log('');
  log('[STEP 2] Preparing Founder Pass collection (99 editions)...');

  try {
    const imageUrl = APPLY
      ? await pinImage(FOUNDER_PASS.imagePath, FOUNDER_PASS.id)
      : `DRY_IMAGE_${FOUNDER_PASS.id}`;

    // Build collection metadata
    const collectionMeta = {
      name:        FOUNDER_PASS.name,
      symbol:      FOUNDER_PASS.symbol,
      description: FOUNDER_PASS.description,
      image:       imageUrl,
      external_url:'https://launch.unykorn.org/genesis',
      attributes:  FOUNDER_PASS.attributes,
      properties: {
        files:    [{ uri: imageUrl, type: 'image/png' }],
        category: 'image',
        creators: [{ address: walletPubkey, share: 100 }],
      },
      seller_fee_basis_points: FOUNDER_PASS.sellerFee,
    };

    const metadataUrl = APPLY
      ? await pinJSON(collectionMeta, `${FOUNDER_PASS.id}-collection-metadata`)
      : `DRY_META_${FOUNDER_PASS.id}`;

    log(`  [OK] Founder Pass metadata pinned: ${metadataUrl}`);

    // For the actual mint, we record the template — individual passes are minted
    // on-demand via the /api/genesis/mint endpoint (buy flow)
    const entry = {
      id:            FOUNDER_PASS.id,
      name:          FOUNDER_PASS.name,
      totalEditions: FOUNDER_PASS.totalEditions,
      mintPriceSol:  0.5,
      imageUrl,
      metadataUrl,
      mintedCount:   0,
      status:        APPLY ? 'collection-ready' : 'dry-plan',
      pickPerPass:   10_000,
      revenueSharePct: 10,
    };
    manifest.assets.push(entry);
    appendLog({ type: 'founder-pass-collection', ...entry });
    log(`  [OK] Collection manifest ready. Mints happen on-demand at /api/genesis/mint`);
  } catch (err) {
    log(`  [FAIL] Founder Pass setup: ${err.message}`);
    appendLog({ type: 'error', asset: FOUNDER_PASS.id, error: err.message });
  }

  // Finalize
  manifest.completedAt = new Date().toISOString();
  manifest.network     = NETWORK;
  save();

  log('');
  log('=============================================================');
  log('[COMPLETE] Genesis Vault manifest written:');
  log(`           ${MANIFEST_PATH}`);
  log('');
  log('NEXT STEPS:');
  if (!APPLY) {
    log('  1. Fund house wallet:');
    log(`     https://faucet.solana.com  =>  ${FOUNDER_WALLET}  (devnet)`);
    log('     OR send 3 SOL mainnet to the same address');
    log('');
    log('  2. Run live mint:');
    log('     node scripts/mint-genesis-launch.mjs --apply');
    log('     node scripts/mint-genesis-launch.mjs --apply --devnet  (devnet test)');
  } else {
    log('  1. Verify on Solscan / Magic Eden');
    log('  2. Update .env.local with mint addresses');
    log('  3. Deploy to production: npx vercel --prod --yes');
    log('  4. Submit Solana grant: https://solana.org/grants');
    log('  5. Announce on X/Twitter/Discord');
  }
  log('=============================================================');
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
