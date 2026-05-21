/**
 * Prepare/mint country namespace Genesis memory NFTs.
 *
 * Default mode is DRY RUN. To mint on mainnet, deploy the current API first, then run:
 *   $env:APPLY_COUNTRY_NAMESPACE_MINTS="YES"
 *   $env:COUNTRY_MINT_LIMIT="3"
 *   node scripts/mint-country-namespace-genesis.mjs
 *
 * Required env when applying:
 * - MINT_API_URL, defaults to http://localhost:3000/api/mint/nft
 * - LAUNCHER_INTERNAL_KEY, if the API has it configured
 * - COUNTRY_MINT_RECIPIENT, defaults to NEXT_PUBLIC_TRUST_WALLET
 *
 * These are "soulbound-style" by metadata covenant, not Token-2022 non-transferable
 * assets. Do not market them as cryptographically non-transferable until Token-2022
 * SBT minting is implemented.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'country-namespace-genesis.json');
const APPLY = process.env.APPLY_COUNTRY_NAMESPACE_MINTS === 'YES';
const LIMIT = Number(process.env.COUNTRY_MINT_LIMIT ?? (APPLY ? 3 : 20));
const MINT_API_URL = process.env.MINT_API_URL ?? 'http://localhost:3000/api/mint/nft';
const RECIPIENT =
  process.env.COUNTRY_MINT_RECIPIENT ??
  process.env.NEXT_PUBLIC_TRUST_WALLET ??
  'AYkhV7iCM9rYW2b9iVREEn7BCWyLnRV2jUuVf6TSbjie';
const IMAGE_URL = process.env.COUNTRY_MINT_IMAGE_URL ?? 'https://launch.unykorn.org/images/brand/logo-primary.png';
const EXTERNAL_URL = process.env.COUNTRY_MINT_EXTERNAL_URL ?? 'https://launch.unykorn.org';
const INTERNAL_KEY = process.env.LAUNCHER_INTERNAL_KEY;

function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function buildPayload(item, edition) {
  const rootNamespace = String(item.namespace ?? '').replace(/^\./, '');
  if (!/^[a-z0-9-]+\.26wc$/.test(rootNamespace)) {
    throw new Error(`Country Genesis mints must be root namespaces only: ${item.namespace}`);
  }

  const name = `${item.flag} ${item.code} 26WC Root #${String(edition).padStart(2, '0')}`;
  return {
    name,
    symbol: `${item.code}ROOT`,
    description:
      `${item.country} ${item.flag} country-root namespace Genesis memory for independent 2026 international fan engagement. ` +
      `This root protects ${rootNamespace} for future fan and merchant subname memories. ` +
      'It is a commemorative utility proof only and does not promise resale value, liquidity, returns, event affiliation, or organizer endorsement.',
    imageUrl: IMAGE_URL,
    externalUrl: EXTERNAL_URL,
    recipientAddress: RECIPIENT,
    royaltyBasisPoints: 0,
    campaignType: 'country_badge',
    attributes: [
      { trait_type: 'Country', value: item.country },
      { trait_type: 'Flag', value: item.flag },
      { trait_type: 'Country Code', value: item.code },
      { trait_type: 'Namespace Root', value: rootNamespace },
      { trait_type: 'Series', value: 'Country Root Namespace Genesis' },
      { trait_type: 'Root Scope', value: 'Country root only' },
      { trait_type: 'Subname Policy', value: 'Fan and merchant names reserved for later user-created mints' },
      { trait_type: 'Memory Covenant', value: 'Soulbound-style commemorative proof' },
      { trait_type: 'Transfer Policy', value: 'No resale value or liquidity promise' },
      { trait_type: 'Affiliation', value: 'Independent fan and merchant technology' },
    ],
  };
}

async function mint(payload) {
  const headers = { 'Content-Type': 'application/json' };
  if (INTERNAL_KEY) headers['x-internal-key'] = INTERNAL_KEY;

  const res = await fetch(MINT_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  const items = readManifest().slice(0, LIMIT);
  console.log(`[country-genesis] mode=${APPLY ? 'APPLY' : 'DRY_RUN'} limit=${items.length}`);
  console.log(`[country-genesis] recipient=${RECIPIENT}`);
  console.log(`[country-genesis] api=${MINT_API_URL}`);
  console.log('');

  let edition = 1;
  for (const item of items) {
    const payload = buildPayload(item, edition);
    if (!APPLY) {
      console.log(`[dry-run] ${payload.name} ${payload.symbol} ${item.namespace}`);
      console.log(`          ${payload.description}`);
    } else {
      console.log(`[mint] ${payload.name} ${item.namespace}`);
      const result = await mint(payload);
      console.log(`       mint=${result.mint}`);
      console.log(`       metadata=${result.metadataUri}`);
      console.log(`       explorer=${result.explorerUrl}`);
    }
    edition += 1;
  }

  if (!APPLY) {
    console.log('');
    console.log('[country-genesis] Dry run only. Set APPLY_COUNTRY_NAMESPACE_MINTS=YES to spend SOL.');
  }
}

main().catch((err) => {
  console.error('[country-genesis][fatal]', err);
  process.exit(1);
});
