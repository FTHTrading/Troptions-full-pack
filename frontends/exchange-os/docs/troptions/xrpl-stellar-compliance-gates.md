# XRPL & Stellar Compliance Gates — Troptions

## Overview

This document catalogues all compliance gates enforced by the Troptions XRPL and Stellar
ecosystem layer. Gates are hard-coded platform-level controls that prevent operations
from advancing past simulation without explicit authorisation.

---

## Platform-Level Gates (Cannot be bypassed)

| Gate | Value | Scope | Description |
|------|-------|-------|-------------|
| `isLiveMainnetExecutionEnabled` | `false` | XRPL (platform) | Prevents any XRPL mainnet execution |
| `isLivePublicNetworkEnabled` | `false` | Stellar (platform) | Prevents any Stellar public network execution |
| `liveMainnetAllowedNow` | `false` | XRPL (per-asset) | Per-asset XRPL mainnet execution gate |
| `nftMintingAllowedNow` | `false` | XRPL (per-asset) | Per-asset NFT minting gate |
| `publicNetworkAllowedNow` | `false` | Stellar (per-asset) | Per-asset Stellar public network gate |

## Operation-Level Gates

### XRPL Trustline

| Gate | Trigger | Message |
|------|---------|---------|
| Platform mainnet gate | Always | isLiveMainnetExecutionEnabled is false |
| Holder KYC | KYC not `approved` | Holder KYC must be approved |
| Issuer KYB | KYB not `approved` | Issuer KYB must be approved |
| Legal review | `liveMainnetAllowedNow: false` | Legal review required before mainnet |

### XRPL NFT Mint

| Gate | Trigger | Message |
|------|---------|---------|
| NFT minting gate | Always | nftMintingAllowedNow is false for this asset |
| Platform mainnet gate | Always | isLiveMainnetExecutionEnabled is false |
| Issuer KYB | KYB not `approved` | Issuer KYB must be completed |
| Metadata standard | Not `compliant` | NFT metadata must meet compliant standard |
| Legal review | `legalReviewCompleted: false` | Legal review required for NFT issuance |

### XRPL AMM Pool

| Gate | Trigger | Message |
|------|---------|---------|
| Platform mainnet gate | Always | isLiveMainnetExecutionEnabled is false |
| LP KYC | KYC not `approved` | LP KYC required |
| Risk disclosure | `riskDisclosureAcknowledged: false` | Risk disclosure must be acknowledged |
| Yield disclaimer | `noGuaranteedYieldAcknowledged: false` | **No guaranteed yield or return** |

### Stellar Trustline

| Gate | Trigger | Message |
|------|---------|---------|
| Platform public network gate | Always | publicNetworkAllowedNow is false |
| Holder KYC | KYC not `approved` | Holder KYC must be approved |
| Issuer KYB | KYB not `approved` | Issuer KYB must be approved |

### Stellar Liquidity Pool

| Gate | Trigger | Message |
|------|---------|---------|
| **Yield disclaimer** | **Always** | **No guaranteed yield or return on Stellar LP** |
| Platform public network gate | Always | publicNetworkAllowedNow is false |
| LP KYC | KYC not `approved` | LP KYC required |
| Risk disclosure | `riskDisclosureAcknowledged: false` | Risk disclosure must be acknowledged |
| Yield acknowledgment | `noGuaranteedYieldAcknowledged: false` | No guaranteed yield acknowledgment required |

### Stellar Path Payment

| Gate | Trigger | Message |
|------|---------|---------|
| Platform public network gate | Always | publicNetworkAllowedNow is false |
| Sender KYC | KYC not `approved` | Sender KYC must be approved |
| Receiver KYC | KYC not `approved` | Receiver KYC must be approved |
| **Anchor/SEP legal review** | `anchorInvolved: true` | **Anchor/SEP legal review required** |

## Gate Removal Process

To remove a platform-level gate:

1. Complete all pre-requisites (KYB, KYC, legal review, testnet validation)
2. Obtain explicit operator sign-off
3. Create a Control Hub approval record with full audit trail
4. Update the relevant configuration with change tracked in version control
5. Conduct smoke tests before enabling production traffic

**No gate should be removed without completing all steps above.**

## Audit Trail

Every simulation that hits a gate creates a Control Hub record set documenting:
- Which gates were triggered
- The input values that triggered them
- The recommended remediation steps
- The audit token for the session

This ensures a complete history of all compliance evaluations is available for regulatory review.
