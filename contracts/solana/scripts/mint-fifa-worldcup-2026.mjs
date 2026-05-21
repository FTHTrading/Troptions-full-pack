#!/usr/bin/env node
/**
 * LEGACY DISABLED: mint-fifa-worldcup-2026.mjs
 *
 * This old script predates the current fan/merchant utility strategy and
 * contains unsafe brand, official-event, and prediction-market language.
 * It is intentionally blocked so it cannot mint risky assets by accident.
 *
 * Use a new reviewed `.wc2026` fan/merchant utility mint script instead.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey,
} from '@solana/web3.js';
import {
  createMint, getOrCreateAssociatedTokenAccount, mintTo,
} from '@solana/spl-token';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';

// ── Setup ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const APPLY     = process.argv.includes('--apply');
const MAINNET   = process.argv.includes('--mainnet');
const NETWORK   = MAINNET ? 'mainnet-beta' : 'devnet';

console.error('[blocked] scripts/mint-fifa-worldcup-2026.mjs is disabled.');
console.error('[blocked] Reason: legacy brand/trademark and prediction-market language.');
console.error('[blocked] Use a reviewed .wc2026 fan/merchant utility mint flow instead.');
process.exit(1);

const WALLET_DIR  = path.join(os.homedir(), '.solana-launcher-wallets');
const WALLET_FILE = path.join(WALLET_DIR, 'house-mint-wallet.json');
const MANIFEST    = path.join(ROOT, 'data', 'fifa-wc2026-mint-manifest.json');

// Load .env.local for PINATA_JWT
function loadEnv() {
  const p = path.join(ROOT, '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^"(.*)"$/, '$1');
  }
}
loadEnv();

const RPC = MAINNET
  ? (process.env.HELIUS_RPC_URL
      ? process.env.HELIUS_RPC_URL
      : (process.env.HELIUS_API_KEY
          ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
          : 'https://api.mainnet-beta.solana.com'))
  : clusterApiUrl('devnet');

const PINATA_JWT = process.env.PINATA_JWT || '';

const log  = (...a) => console.log('[wc2026]', ...a);
const warn = (...a) => console.warn('[wc2026][warn]', ...a);

// ── Wallet management ────────────────────────────────────────────────────────
function loadOrCreateHouseWallet() {
  if (!fs.existsSync(WALLET_DIR)) fs.mkdirSync(WALLET_DIR, { recursive: true });
  if (fs.existsSync(WALLET_FILE)) {
    log(`Loading house mint wallet → ${WALLET_FILE}`);
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'))));
  }
  const kp = Keypair.generate();
  fs.writeFileSync(WALLET_FILE, JSON.stringify(Array.from(kp.secretKey)));
  fs.chmodSync(WALLET_FILE, 0o600);
  log(`✔ Generated NEW house mint wallet → ${WALLET_FILE}`);
  log(`  Public key: ${kp.publicKey.toBase58()}`);
  return kp;
}

async function ensureFunded(conn, kp, minSol = 0.5) {
  const bal = await conn.getBalance(kp.publicKey);
  log(`Balance: ${(bal / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
  if (bal >= minSol * LAMPORTS_PER_SOL) return true;
  if (MAINNET) {
    warn(`Need ${minSol} SOL on mainnet. Send to: ${kp.publicKey.toBase58()}`);
    return false;
  }
  log(`Requesting devnet airdrop of 2 SOL...`);
  try {
    const sig = await conn.requestAirdrop(kp.publicKey, 2 * LAMPORTS_PER_SOL);
    await conn.confirmTransaction(sig, 'confirmed');
    log(`✔ Airdrop confirmed.`);
    return true;
  } catch (e) {
    warn(`Airdrop failed (${e.message}). Get devnet SOL from https://faucet.solana.com → ${kp.publicKey.toBase58()}`);
    return false;
  }
}

// ── Pinata IPFS upload ───────────────────────────────────────────────────────
async function pinJsonToIpfs(name, json) {
  if (!PINATA_JWT) {
    warn(`No PINATA_JWT — skipping pin for ${name}; using launch.unykorn.org URL`);
    return `https://launch.unykorn.org/api/wc2026/${name}.json`;
  }
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PINATA_JWT}` },
    body: JSON.stringify({ pinataMetadata: { name }, pinataContent: json }),
  });
  if (!res.ok) {
    warn(`Pinata pin failed for ${name}: ${res.status}`);
    return `https://launch.unykorn.org/api/wc2026/${name}.json`;
  }
  const { IpfsHash } = await res.json();
  log(`  ↳ pinned ${name} → ipfs://${IpfsHash}`);
  return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
}

// ── FIFA WC2026 asset definitions ────────────────────────────────────────────
const FIFA_NATIONS = [
  // Hosts
  ['USA','United States','🇺🇸'], ['CAN','Canada','🇨🇦'], ['MEX','Mexico','🇲🇽'],
  // Auto-qualified / top FIFA-ranked (illustrative — first 32 confirmed)
  ['ARG','Argentina','🇦🇷'], ['BRA','Brazil','🇧🇷'], ['FRA','France','🇫🇷'],
  ['ENG','England','🏴󠁧󠁢󠁥󠁮󠁧󠁿'], ['ESP','Spain','🇪🇸'], ['GER','Germany','🇩🇪'],
  ['POR','Portugal','🇵🇹'], ['NED','Netherlands','🇳🇱'], ['ITA','Italy','🇮🇹'],
  ['BEL','Belgium','🇧🇪'], ['CRO','Croatia','🇭🇷'], ['URU','Uruguay','🇺🇾'],
  ['COL','Colombia','🇨🇴'], ['JPN','Japan','🇯🇵'], ['KOR','South Korea','🇰🇷'],
  ['MAR','Morocco','🇲🇦'], ['SEN','Senegal','🇸🇳'], ['SUI','Switzerland','🇨🇭'],
  ['DEN','Denmark','🇩🇰'], ['POL','Poland','🇵🇱'], ['SRB','Serbia','🇷🇸'],
  ['AUS','Australia','🇦🇺'], ['IRN','Iran','🇮🇷'], ['ECU','Ecuador','🇪🇨'],
  ['QAT','Qatar','🇶🇦'], ['CRC','Costa Rica','🇨🇷'], ['GHA','Ghana','🇬🇭'],
  ['TUN','Tunisia','🇹🇳'], ['CMR','Cameroon','🇨🇲'],
];

function buildAssets() {
  return [
    {
      kind:     'nft-master',
      slug:     'wc2026-trophy',
      name:     'World Cup 2026 — Golden Trophy',
      symbol:   'WC26GT',
      description:
        'Legacy disabled WC2026 fan-memory planning asset. Do not mint without legal and launch-committee review. ' +
        'Use independent fan, merchant, loyalty, access, coupon, and proof-of-attendance utility language only.',
      image:    'https://launch.unykorn.org/images/wc2026/trophy.png',
      external_url: 'https://launch.unykorn.org/world-cup',
      attributes: [
        { trait_type: 'Edition',  value: '1 of 1' },
        { trait_type: 'Tier',     value: 'Master Trophy' },
        { trait_type: 'Tournament', value: 'FIFA World Cup 2026' },
        { trait_type: 'Host',     value: 'USA · Canada · Mexico' },
        { trait_type: 'Kickoff',  value: 'June 11, 2026' },
        { trait_type: 'Royalty',  value: '5%' },
      ],
      sellerFeeBasisPoints: 500,
    },
    ...FIFA_NATIONS.map(([code, name, flag], i) => ({
      kind:     'nft-edition',
      slug:     `wc2026-nation-${code.toLowerCase()}`,
      name:     `WC2026 — ${name}`,
      symbol:   `WC${code}`,
      description:
        `Legacy disabled WC2026 ${name} ${flag} fan-memory planning card. Do not mint without legal and ` +
        `launch-committee review. Use non-wagering fan engagement and merchant utility language only.`,
      image:    `https://launch.unykorn.org/images/wc2026/nation-${code.toLowerCase()}.png`,
      external_url: `https://launch.unykorn.org/world-cup/${code.toLowerCase()}`,
      attributes: [
        { trait_type: 'Nation', value: name },
        { trait_type: 'Code',   value: code },
        { trait_type: 'Flag',   value: flag },
        { trait_type: 'Group',  value: ['A','B','C','D','E','F','G','H'][Math.floor(i / 4)] },
        { trait_type: 'Edition', value: 'Open · 1000 max' },
      ],
      sellerFeeBasisPoints: 500,
    })),
    {
      kind:     'spl',
      slug:     'wc2026-match-pass',
      name:     'WC2026 Match Pass',
      symbol:   'MATCH26',
      description: 'Legacy disabled match-pass planning token. Use non-wagering access and sponsor-drop utility language only.',
      decimals: 0,
      supply:   100_000,
      image:    'https://launch.unykorn.org/images/wc2026/match-pass.png',
    },
    {
      kind:     'spl',
      slug:     'wc2026-pick',
      name:     'WC2026 PICK — Non-Wagering Fan Poll Unit',
      symbol:   'PICK',
      description:
        'Legacy disabled non-wagering fan poll planning token. Do not use for betting, staking, odds, payouts, ' +
        'prediction markets, investment returns, or financial products.',
      decimals: 6,
      supply:   1_000_000,
      image:    'https://launch.unykorn.org/images/wc2026/pick.png',
    },
  ];
}

// ── Mint loop ────────────────────────────────────────────────────────────────
async function mintAsset(metaplex, conn, signer, asset, metaUri) {
  if (asset.kind === 'nft-master' || asset.kind === 'nft-edition') {
    const isMaster = asset.kind === 'nft-master';
    const { nft } = await metaplex.nfts().create({
      uri:    metaUri,
      name:   asset.name,
      symbol: asset.symbol,
      sellerFeeBasisPoints: asset.sellerFeeBasisPoints || 500,
      isMutable: true,
      maxSupply: isMaster ? 0 : 1000,        // 0 = limited 1/1, otherwise editions
    });
    return {
      slug:    asset.slug,
      kind:    asset.kind,
      mint:    nft.address.toBase58(),
      metadata: nft.metadataAddress.toBase58(),
      uri:     metaUri,
      explorer: `https://explorer.solana.com/address/${nft.address.toBase58()}?cluster=${NETWORK}`,
    };
  }

  if (asset.kind === 'spl') {
    const mintPk = await createMint(
      conn, signer, signer.publicKey, signer.publicKey, asset.decimals,
    );
    const ata = await getOrCreateAssociatedTokenAccount(conn, signer, mintPk, signer.publicKey);
    const supplyBigInt = BigInt(asset.supply) * BigInt(10 ** asset.decimals);
    await mintTo(conn, signer, mintPk, ata.address, signer, supplyBigInt);

    // Attach Metaplex metadata to fungible
    try {
      await metaplex.nfts().createSft({
        useNewMint: { publicKey: mintPk } /* unused but signature varies */,
      }).catch(() => {});
    } catch { /* ignore — fungible metadata is optional via separate call */ }

    return {
      slug:    asset.slug,
      kind:    asset.kind,
      mint:    mintPk.toBase58(),
      ata:     ata.address.toBase58(),
      supply:  asset.supply,
      decimals: asset.decimals,
      uri:     metaUri,
      explorer: `https://explorer.solana.com/address/${mintPk.toBase58()}?cluster=${NETWORK}`,
    };
  }
  throw new Error(`Unknown asset kind: ${asset.kind}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  log(`Network: ${NETWORK}`);
  log(`RPC    : ${RPC}`);
  log(`Mode   : ${APPLY ? 'APPLY (real mints)' : 'DRY-PLAN'}`);

  const wallet = loadOrCreateHouseWallet();
  log(`House wallet: ${wallet.publicKey.toBase58()}`);

  const conn = new Connection(RPC, 'confirmed');
  const funded = APPLY ? await ensureFunded(conn, wallet) : false;

  const assets = buildAssets();
  log(`Planned assets: ${assets.length}`);
  log(` · 1 Trophy NFT (1/1)`);
  log(` · ${FIFA_NATIONS.length} Nation cards (1000 editions each)`);
  log(` · 2 SPL tokens (Match Pass, PICK)`);

  if (!APPLY) {
    log('');
    log('Sample asset:');
    console.log(JSON.stringify(assets[0], null, 2));
    log('');
    log(`Re-run with --apply to mint. Treasury wallet receives no funds — this is the HOUSE wallet at ${WALLET_FILE}`);
    writeManifest({
      network: NETWORK,
      houseWallet: wallet.publicKey.toBase58(),
      planned: assets.length,
      results: [],
      ts: new Date().toISOString(),
      mode: 'dry',
    });
    return;
  }

  if (!funded) {
    warn('Wallet not funded — aborting --apply.');
    return;
  }

  const metaplex = Metaplex.make(conn).use(keypairIdentity(wallet));
  const results  = [];

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    log(`[${i + 1}/${assets.length}] ${asset.kind} · ${asset.name}`);
    try {
      // Pin metadata JSON
      const metaJson = {
        name:        asset.name,
        symbol:      asset.symbol,
        description: asset.description,
        image:       asset.image,
        external_url: asset.external_url || 'https://launch.unykorn.org/world-cup',
        attributes:  asset.attributes || [],
        properties: {
          category: asset.kind.startsWith('nft') ? 'image' : 'fungible',
          creators: [{ address: wallet.publicKey.toBase58(), share: 100 }],
        },
      };
      const uri = await pinJsonToIpfs(asset.slug, metaJson);

      const result = await mintAsset(metaplex, conn, wallet, asset, uri);
      results.push(result);
      log(`  ✔ minted: ${result.mint}`);
    } catch (e) {
      warn(`  ✗ failed: ${e.message}`);
      results.push({ slug: asset.slug, kind: asset.kind, error: e.message });
    }
  }

  writeManifest({
    network: NETWORK,
    houseWallet: wallet.publicKey.toBase58(),
    planned: assets.length,
    minted:  results.filter((r) => r.mint).length,
    results,
    ts: new Date().toISOString(),
    mode: 'live',
  });

  log('');
  log(`✔ Manifest written → ${MANIFEST}`);
  log(`✔ Minted ${results.filter((r) => r.mint).length}/${assets.length} assets`);
}

function writeManifest(obj) {
  if (!fs.existsSync(path.dirname(MANIFEST))) fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(obj, null, 2));
}

main().catch((e) => { console.error('[wc2026][FATAL]', e); process.exit(1); });
