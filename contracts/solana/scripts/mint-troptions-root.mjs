/**
 * Mint the parent TROPTIONS namespace root.
 *
 * Default mode is DRY RUN. To mint on mainnet:
 *   $env:APPLY_TROPTIONS_ROOT_MINT="YES"
 *   $env:MINT_API_URL="http://localhost:3002/api/mint/nft"
 *   $env:LAUNCHER_INTERNAL_KEY="troptions-root-local"
 *   node scripts/mint-troptions-root.mjs
 */

const APPLY = process.env.APPLY_TROPTIONS_ROOT_MINT === 'YES';
const MINT_API_URL = process.env.MINT_API_URL ?? 'http://localhost:3000/api/mint/nft';
const RECIPIENT =
  process.env.TROPTIONS_ROOT_RECIPIENT ??
  process.env.NEXT_PUBLIC_TRUST_WALLET ??
  'AYkhV7iCM9rYW2b9iVREEn7BCWyLnRV2jUuVf6TSbjie';
const IMAGE_URL = process.env.TROPTIONS_ROOT_IMAGE_URL ?? 'https://launch.unykorn.org/images/brand/logo-primary.png';
const EXTERNAL_URL = process.env.TROPTIONS_ROOT_EXTERNAL_URL ?? 'https://launch.unykorn.org';
const INTERNAL_KEY = process.env.LAUNCHER_INTERNAL_KEY;

const payload = {
  name: 'TROPTIONS Root #00',
  symbol: 'TROOT',
  description:
    'TROPTIONS parent namespace root for the .troptions memory and marketing layer. ' +
    'This Genesis root anchors future country, fan, merchant, and campaign subnames. ' +
    'It is an independent commemorative utility proof with no resale-value promise, financial-upside claim, event affiliation, or organizer endorsement.',
  imageUrl: IMAGE_URL,
  externalUrl: EXTERNAL_URL,
  recipientAddress: RECIPIENT,
  royaltyBasisPoints: 0,
  campaignType: 'proof_of_attendance',
  attributes: [
    { trait_type: 'Namespace Root', value: '.troptions' },
    { trait_type: 'Series', value: 'TROPTIONS Parent Namespace Genesis' },
    { trait_type: 'Root Scope', value: 'Parent brand root' },
    { trait_type: 'Subname Policy', value: 'Country, fan, merchant, and campaign subnames open later' },
    { trait_type: 'Memory Covenant', value: 'Soulbound-style commemorative proof' },
    { trait_type: 'Transfer Policy', value: 'No resale value or liquidity promise' },
    { trait_type: 'Affiliation', value: 'Independent fan and merchant technology' },
  ],
};

async function main() {
  console.log(`[troptions-root] mode=${APPLY ? 'APPLY' : 'DRY_RUN'}`);
  console.log(`[troptions-root] recipient=${RECIPIENT}`);
  console.log(`[troptions-root] api=${MINT_API_URL}`);
  console.log(`[troptions-root] name=${payload.name} symbol=${payload.symbol} root=.troptions`);
  console.log(`                 ${payload.description}`);

  if (!APPLY) {
    console.log('');
    console.log('[troptions-root] Dry run only. Set APPLY_TROPTIONS_ROOT_MINT=YES to spend SOL.');
    return;
  }

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

  console.log(`mint=${data.mint}`);
  console.log(`metadata=${data.metadataUri}`);
  console.log(`explorer=${data.explorerUrl}`);
}

main().catch((err) => {
  console.error('[troptions-root][fatal]', err);
  process.exit(1);
});
