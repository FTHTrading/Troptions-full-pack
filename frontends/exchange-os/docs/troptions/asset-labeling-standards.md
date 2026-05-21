# Troptions Asset Labeling Standards

This document maps every label/identity surface for Troptions tokens to the
public standard that produces it.

| Surface | Standard | File |
| --- | --- | --- |
| Stellar issuer/domain identity | SEP-1 | [`public/.well-known/stellar.toml`](../../public/.well-known/stellar.toml) |
| XRPL issuer/domain identity | XLS-26d | [`public/.well-known/xrp-ledger.toml`](../../public/.well-known/xrp-ledger.toml) |
| Universal asset descriptor | custom v1 | [`public/troptions/asset-metadata/troptions.iou.v1.json`](../../public/troptions/asset-metadata/troptions.iou.v1.json) |
| NFT collection metadata | XLS-24 + OpenSea | [`public/troptions/asset-metadata/troptions.nft.collection.v1.json`](../../public/troptions/asset-metadata/troptions.nft.collection.v1.json) |
| MPT issuance metadata | XLS-33d | [`public/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json`](../../public/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json) |

## Why these files exist

These files allow third-party wallets, explorers, and exchanges (XUMM,
Sologenic, Bithomp, GateHub, StellarX, Lobstr, StellarTerm) to display the
Troptions brand, logo, issuer accounts, and compliance disclaimers correctly.

They are **identity files only**. They do **not**:

- imply legal approval of Troptions assets,
- imply registration with any regulator,
- imply that any token has been issued,
- imply that any liquidity, redemption, or return is guaranteed.

## Brand assets used

| Slot | File |
| --- | --- |
| Primary logo | `public/assets/troptions/logos/troptions-tt-gold.jpg` |
| Wordmark | `public/assets/troptions/logos/troptions-classic-white.jpg` |
| Dark icon | `public/assets/troptions/logos/troptions-tt-black.jpg` |
| Banner / hero | `public/assets/troptions/logos/troptions-xchange-fire.jpg` |

Brand colors: Institutional Gold `#C9A24A`, Deep Navy `#071426`, Ivory `#F7F2E8`.

## Validation

Run the read-only validator any time these files change:

```powershell
node scripts/validate-troptions-asset-metadata.mjs
```

The validator checks required fields per standard and scans every file for
banned compliance language (investment, profit, yield, guaranteed return,
APY, APR, risk-free, redeemable for cash, passive income).
