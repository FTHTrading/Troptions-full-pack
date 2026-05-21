# Solana Best-in-Class Architecture Recommendations
## TROPTIONS Campaign Launcher — Path to #1

> Last updated: May 2026  
> Status: **MAINNET READY** — implement in priority order

---

## 1. Compressed NFTs (cNFTs) via Bubblegum — 1000× Cost Reduction

**Why it matters:** Regular NFTs cost ~0.012 SOL each. Compressed NFTs via Bubblegum cost ~0.000005 SOL each — enabling **mass distribution at scale**.

### When to use cNFTs
| Campaign Type | Use cNFT | Reason |
|---|---|---|
| QR Coupons | ✅ YES | High volume, low cost, auto-redeemable |
| Fan Tributes | ✅ YES | Mass distribution, viral potential |
| Local Giveaways | ✅ YES | Community scale, economics make sense |
| Loyalty Rewards | ✅ YES | Volume rewards need cost efficiency |
| VIP Passes | ❌ NO | Use regular NFT — cost signals exclusivity |
| Brand Namespaces | ❌ NO | Use regular NFT — permanence and weight required |
| Sponsor Offers | ⚠️ DEPENDS | cNFT if >500 recipients, regular if premium sponsor |

### Implementation
```bash
npm install @metaplex-foundation/mpl-bubblegum \
            @metaplex-foundation/umi \
            @metaplex-foundation/umi-bundle-defaults
```

```typescript
import { createTree, mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

// Create a Merkle tree (one-time, reusable for up to 1M NFTs)
const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
const merkleTree = await createTree(umi, {
  maxDepth: 14,        // 2^14 = 16,384 max NFTs
  maxBufferSize: 64,   // concurrent mint buffer
  canopyDepth: 10,
});

// Mint a compressed NFT
await mintToCollectionV1(umi, {
  leafOwner: recipientAddress,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'DONK AI QR Coupon',
    uri: metadataUri,  // Arweave or Pinata URI
    sellerFeeBasisPoints: 500, // 5% royalties
    collection: { key: collectionMint, verified: false },
  },
});
```

**Cost estimate for 10,000 QR coupons:**
- Regular NFTs: ~120 SOL (~$18,000 at $150/SOL)
- cNFTs: ~0.05 SOL (~$7.50)
- **Savings: 99.96%**

---

## 2. Metaplex Core — New Standard for All New Mints

**Why it matters:** Metaplex Core replaces the legacy Token Metadata program. It's lighter, cheaper, and more extensible.

### Advantages over Token Metadata v1
- Single account per NFT (vs. 3–4 accounts in legacy)
- Built-in plugins: freeze authority, transfer delegate, burn delegate
- Native royalty enforcement (no marketplace workaround needed)
- ~50% cheaper per mint than legacy standard

### Implementation
```bash
npm install @metaplex-foundation/mpl-core
```

```typescript
import { create } from '@metaplex-foundation/mpl-core';

await create(umi, {
  asset: generateSigner(umi),
  name: 'TROPTIONS VIP Pass — Atlanta WC2026',
  uri: 'https://arweave.net/YOUR_METADATA_URI',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [{ address: trustWallet, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
    // Soul-bound VIP passes: add NonTransferable plugin
    // { type: 'NonTransferable' }
  ],
});
```

**Recommendation:** Use Metaplex Core for all new VIP passes and brand namespaces. Use cNFTs (Bubblegum) for mass-distribution types.

---

## 3. DAS API via Helius — Required for Reading cNFT Data

**Why it matters:** Standard Solana RPC cannot read compressed NFT data. DAS (Digital Asset Standard) API is required.

### Setup
Already have `NEXT_PUBLIC_HELIUS_RPC_URL` in env — use it for DAS queries.

```typescript
// Get all campaign NFTs owned by a wallet
const response = await fetch(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'campaign-query',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: walletAddress,
      page: 1,
      limit: 100,
      displayOptions: { showCollectionMetadata: true },
    },
  }),
});

// Get a specific campaign NFT
const assetResponse = await fetch(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'get-asset',
    method: 'getAsset',
    params: { id: mintAddress },
  }),
});
```

**Helius plan recommendation:** Shared plan ($0/month) for launch. Upgrade to Dedicated ($100/month) at 1M+ monthly requests.

---

## 4. Namespace Registry — On-Chain vs. D1 Decision

### Current: D1 (SQLite, Cloudflare)
- ✅ Fast to build, zero cost
- ✅ Sufficient for launch and growth to ~100K campaigns
- ❌ Centralized — registry can be altered
- ❌ Not trustless — TROPTIONS controls the database

### Best-in-Class: Anchor Program (On-Chain Registry)

```rust
// Short-term Anchor program sketch
#[account]
pub struct NamespaceRecord {
    pub namespace: [u8; 64],   // namespace slug
    pub owner: Pubkey,          // campaign owner wallet
    pub mint: Pubkey,           // associated NFT mint
    pub created_at: i64,        // Unix timestamp
    pub locked: bool,           // true for brand namespaces
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(namespace: String)]
pub struct RegisterNamespace<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + NamespaceRecord::INIT_SPACE,
        seeds = [b"namespace", namespace.as_bytes()],
        bump,
    )]
    pub record: Account<'info, NamespaceRecord>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

**Recommendation:**
- **Now:** Use D1 — ship fast, great UX
- **Q3 2026:** Deploy Anchor program, migrate namespace registry on-chain
- **Benefit:** Trustless, permanent, composable by third-party apps

---

## 5. Solana Pay for QR Redemption — The Right Way to Do QR

**Why it matters:** Our current QR codes are URL links. Solana Pay QR codes trigger **on-chain transactions** — scan → sign → redeemed. No centralized backend needed for redemption.

### Implementation
```bash
npm install @solana/pay
```

```typescript
import { encodeURL, createTransfer } from '@solana/pay';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import QRCode from 'qrcode';

// Create a Solana Pay claim URL
const recipient = new PublicKey(process.env.TRUST_WALLET_PUBLIC_KEY!);
const reference = new Keypair().publicKey; // unique reference per QR
const label = 'DONK AI Coupon Claim';
const message = '10% off at My Coffee Shop — Atlanta WC2026';
const memo = `campaign:${namespace}`;

const url = encodeURL({
  recipient,
  amount: new BigNumber(0), // free claim (0 SOL)
  reference,
  label,
  message,
  memo,
});

// Generate QR code from the Solana Pay URL
const qrDataUrl = await QRCode.toDataURL(url.toString());
```

**Redemption verification (server-side):**
```typescript
import { findTransactionSignature, validateTransactionSignature } from '@solana/pay';

// Check if reference pubkey appears in any transaction = redeemed
const signature = await findTransactionSignature(connection, reference);
await validateTransactionSignature(connection, signature, recipient, new BigNumber(0), undefined, reference);
// → Campaign redeemed!
```

**UX improvement:** Customer scans QR → Phantom/Solflare opens → one tap to claim → on-chain confirmation. No app download, no website visit, no backend required.

---

## 6. Dynamic NFT Metadata — Live Campaign State in Any Wallet

**Why it matters:** Campaign progress, loyalty points, redemption count — all visible in the NFT as it's updated.

### How it works
- Metadata URI points to a Vercel/CF Workers endpoint (not static IPFS)
- Endpoint reads from D1/database, returns current campaign state as JSON
- NFT attributes update dynamically as campaigns evolve
- Wallet displays: "47 / 100 coupons remaining" in real-time

```typescript
// Dynamic metadata endpoint — already partially implemented at /api/solana/campaign/metadata
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ns = searchParams.get('ns')!;
  const campaign = await getCampaign(ns);

  return Response.json({
    name: campaign.name,
    symbol: 'DONK',
    description: campaign.description,
    image: campaign.imageUrl,
    attributes: [
      { trait_type: 'Campaign Type', value: campaign.campaignType },
      { trait_type: 'Remaining', value: campaign.quantity - campaign.redeemed },
      { trait_type: 'Total Supply', value: campaign.quantity },
      { trait_type: 'Status', value: campaign.active ? 'Active' : 'Expired' },
      { trait_type: 'Powered By', value: 'TROPTIONS · DONK AI' },
    ],
    // Helius/Magic Eden will poll this URL and refresh wallet display
    refresh_token: Date.now().toString(),
  });
}
```

**Recommendation:** Update metadata URI to use dynamic endpoint (already exists), not static IPFS. Keep IPFS backup for archival.

---

## 7. Blinks / Solana Actions — Shareable On-Chain Links

**Why it matters:** Turn any campaign into a URL that executes on-chain in one click. Works natively in Twitter/X, Discord, SMS, email, Telegram.

### Solana Actions API
```typescript
// app/api/actions/claim/route.ts
import { ActionGetResponse, ActionPostResponse, ACTIONS_CORS_HEADERS } from '@solana/actions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ns = searchParams.get('ns')!;
  const campaign = await getCampaign(ns);

  const payload: ActionGetResponse = {
    title: campaign.name,
    icon: campaign.imageUrl,
    description: `${campaign.offer} — Powered by DONK AI / TROPTIONS`,
    label: 'Claim Campaign',
    links: {
      actions: [
        {
          label: 'Claim Now',
          href: `/api/actions/claim?ns=${ns}`,
        },
      ],
    },
  };
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const ns = searchParams.get('ns')!;
  const body = await req.json() as { account: string };

  // Build and return a transaction for the user to sign
  const transaction = await buildClaimTransaction(ns, body.account);

  const payload: ActionPostResponse = {
    transaction: Buffer.from(transaction.serialize()).toString('base64'),
    message: 'Campaign claimed! Check your wallet.',
  };
  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
}
```

**Deployment:** Register at `https://launch.unykorn.org/.well-known/solana-actions.json`:
```json
{
  "rules": [
    { "pathPattern": "/api/actions/**", "apiPath": "/api/actions/**" }
  ]
}
```

**Share URL:** `https://launch.unykorn.org/api/actions/claim?ns=my-coffee-shop`  
→ Twitter/X renders as interactive Blink card. User clicks "Claim Now" → Phantom signs → done.

---

## 8. Multi-Sig for Brand Namespace Wallets (Squads Protocol)

**Why it matters:** Core brand namespaces (TROPTIONS, DONK, UNYKORN) should not depend on a single private key. Key loss = permanent loss of brand namespace authority.

### Squads v4 Setup
```bash
npm install @sqds/multisig
```

```typescript
import * as multisig from '@sqds/multisig';

// Create a 2-of-3 multisig for TROPTIONS brand wallet
const { multisigPda } = multisig.getMultisigPda({ createKey: creator.publicKey });
await multisig.rpc.multisigCreateV2({
  connection,
  creator,
  multisigPda,
  configAuthority: null, // immutable config
  threshold: 2,
  members: [
    { key: member1.publicKey, permissions: multisig.types.Permissions.all() },
    { key: member2.publicKey, permissions: multisig.types.Permissions.all() },
    { key: member3.publicKey, permissions: multisig.types.Permissions.all() },
  ],
  timeLock: 0,
});
```

**Recommendation:**
| Brand | Multisig Threshold | Signers |
|---|---|---|
| TROPTIONS | 2-of-3 | FTH key, DONK key, cold storage |
| DONK AI | 2-of-2 | FTH key, cold storage |
| UNYKORN | 2-of-3 | FTH key, DONK key, cold storage |

---

## 9. Token Extensions (Token-2022) — Advanced Token Mechanics

**Why it matters:** Token-2022 extensions enable revenue streams and unique mechanics impossible in the base SPL token standard.

### Recommended Extensions by Campaign Type

| Campaign Type | Extension | Business Value |
|---|---|---|
| Loyalty Tokens | Transfer Fee | Platform earns % on secondary trades |
| VIP Passes | Non-Transferable | Soul-bound — can't be sold/gifted |
| NFT Coupons | Interest-Bearing | Value accrues as incentive to hold |
| Sponsor Tokens | Permanent Delegate | Platform can burn expired offers |
| Brand Namespaces | Metadata Pointer | On-chain metadata, no IPFS needed |

```typescript
import {
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  createInitializeNonTransferableMintInstruction,
  ExtensionType,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

// Loyalty token with 2% transfer fee (platform revenue)
const extensions = [ExtensionType.TransferFeeConfig];
const mintLen = getMintLen(extensions);
const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

// ...create mint account, then:
await createInitializeTransferFeeConfigInstruction(
  mint.publicKey,
  feeAuthority,
  withdrawAuthority,
  200,    // 2% transfer fee in basis points
  BigInt(1_000_000), // max fee: 1 token
  TOKEN_2022_PROGRAM_ID,
);
```

---

## 10. Cross-Chain Proof — Solana + Apostle Chain

**Why it matters:** Each campaign mint can be proven immutably across chains. Solana mint hash + Apostle Chain ATP record = undeniable campaign provenance.

### Implementation Flow
1. Mint campaign NFT on Solana → get `mintSignature`
2. POST to Apostle Chain API: `POST /v1/tx` with campaign proof payload
3. Store both hashes in campaign record (D1 + on-chain metadata)
4. Campaign page shows cross-chain verification badge

```typescript
// After successful Solana mint:
async function anchorToApostleChain(mintSignature: string, namespace: string) {
  const body = {
    amount: '1',   // 1 ATP proof record
    memo: `TROPTIONS:campaign:${namespace}:solana:${mintSignature}`,
    to: process.env.APOSTLE_TRUST_WALLET,
  };
  const res = await fetch(`${process.env.APOSTLE_URL}/v1/tx`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.APOSTLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const { txId } = await res.json() as { txId: string };
  return txId; // Store alongside Solana mintSignature
}
```

**Verification URL:** `https://apostle.chain/tx/{apostleTxId}` shows the Solana mint hash embedded in the proof record.

---

## Priority Implementation Roadmap

| Priority | Feature | Impact | Effort | Timeline |
|---|---|---|---|---|
| 🔴 P0 | Solana Pay QR redemption | UX breakthrough | Medium | Week 1 |
| 🔴 P0 | Mainnet env var flip | Required for launch | Low | Done ✅ |
| 🟠 P1 | cNFTs via Bubblegum | 1000× cost reduction | Medium | Week 2 |
| 🟠 P1 | Solana Actions (Blinks) | Viral sharing | Medium | Week 2-3 |
| 🟡 P2 | Metaplex Core migration | Future-proof minting | Low | Week 3 |
| 🟡 P2 | Token-2022 extensions | Revenue + mechanics | Medium | Week 4 |
| 🟢 P3 | Multi-sig brand wallets | Security | Low | Week 4 |
| 🟢 P3 | On-chain namespace registry | Trustless | High | Q3 2026 |
| 🟢 P3 | Apostle Chain cross-proof | Differentiator | Low | Q3 2026 |

---

## What Makes This the Best Solana Campaign Launcher

1. **Only launcher with brand namespace locking** — TROPTIONS, DONK, UNYKORN are reserved first-class brands
2. **Cheapest at scale** — cNFTs at $0.0007 per mint vs $1.80 for competitors
3. **Most shareable** — Blinks work in any platform, no app download needed
4. **Dynamic metadata** — Campaign state lives in the NFT, visible in any wallet
5. **Cross-chain proof** — Solana + Apostle Chain creates unique, verifiable campaign records
6. **AI-generated visuals** — CF Workers AI generates campaign images at zero marginal cost
7. **QR redemption is on-chain** — Not a URL, an actual blockchain transaction
8. **Multi-campaign types** — 9 types vs. 1-2 for most competitors
9. **Mainnet-ready infrastructure** — Full env-var control, no hardcoded restrictions

---

*Built on FTHTrading/solana-launcher · Powered by TROPTIONS · Campaign intelligence by DONK AI*
