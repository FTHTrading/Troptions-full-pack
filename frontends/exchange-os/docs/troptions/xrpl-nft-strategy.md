# XRPL NFT Strategy — Troptions

## Status: Simulation-Only | NFT Minting Blocked | No Live Mainnet

NFT minting is blocked by platform policy. `nftMintingAllowedNow: false` on all asset profiles.

---

## XLS-20 NFTs on XRPL

XRPL supports non-fungible tokens natively through the XLS-20 standard. NFTs on XRPL are
minted using the `NFTokenMint` transaction and can represent ownership of real-world assets,
digital collectibles, event tickets, royalty rights, and more.

## Troptions NFT Assets

The following Troptions assets are candidates for XRPL NFT representation (all simulation-only):

| Asset  | Display Name | Primitive | Issuer Status |
|--------|-------------|-----------|--------------|
| TUNI   | Troptions Uni | nft | pending_legal_review |
| REC    | Record Token | nft | pending_legal_review |
| MMU    | Music Media Unit | nft | pending_kyb |
| MEDIA  | Media Token | nft | pending_legal_review |

## Compliance Requirements for NFT Minting

NFT minting carries higher regulatory scrutiny than fungible token issuance:

1. **KYB (issuer)** — The minting entity must complete business verification.
2. **Metadata standard compliance** — NFT metadata must meet the platform's `compliant` standard.
3. **Legal review** — NFT terms, royalty structures, and underlying rights must be reviewed by counsel.
4. **No "investment" framing** — NFTs must not be marketed as investment vehicles with expected returns.
5. **Platform gate removal** — `nftMintingAllowedNow` must be explicitly enabled per-asset.

## Simulation Flow

1. Submit `POST /api/troptions/xrpl-ecosystem/simulate/nft` with:
   - `assetId` — XRPL registry ID (e.g., `"TUNI"`)
   - `kybStatus` — issuer KYB status
   - `metadataStandard` — `"compliant"` | `"missing"`
   - `legalReviewCompleted` — `boolean`
2. The XRPL Policy Engine evaluates. NFT minting is always blocked while `nftMintingAllowedNow: false`.
3. A Control Hub record set is created with all blocked reasons documented.
4. Response includes `CrossRailGovernanceDecision` with `simulationOnly: true`, `allowed: false`.

## NFT Metadata Requirements

- Must follow a documented, consistent schema
- Must not contain promises of financial return
- Must identify the underlying asset or right being represented
- Must identify the issuing entity

## Next Steps

1. Define NFT metadata schema per asset class
2. Complete KYB for minting entities
3. Legal review of underlying rights and NFT terms
4. Conduct testnet NFT minting trials
5. Submit for operator approval to enable `nftMintingAllowedNow` per-asset
