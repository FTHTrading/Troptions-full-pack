# XRPL / Stellar Provisioning Runbook

> ⚠️ **Mainnet execution is blocked by default.** Dry-run and metadata
> validation are the only modes available without explicit approval IDs and
> a documented Control Hub authorization.

## Scripts

| Script | Mode | Touches network? | Touches seeds? |
| --- | --- | --- | --- |
| `scripts/validate-troptions-asset-metadata.mjs` | read-only | no | no |
| `scripts/plan-troptions-asset-provisioning.mjs` | read-only | no | no |
| `scripts/provision-troptions-assets.mjs` | dry-run by default | only when fully gated | only when `--execute` + all approvals |

## Standard workflow

1. **Edit metadata** under `public/.well-known/` and `public/troptions/asset-metadata/`.
2. **Validate**:
   ```powershell
   node scripts/validate-troptions-asset-metadata.mjs
   ```
3. **Generate plan**:
   ```powershell
   node scripts/plan-troptions-asset-provisioning.mjs
   ```
   Output is written to `data/observability/troptions-provisioning-plan-*.json`
   for compliance/custody/Control-Hub review.
4. **Dry-run** the orchestrator:
   ```powershell
   node scripts/provision-troptions-assets.mjs
   ```
   No transactions are submitted. Stellar/XRPL endpoints are not contacted.
5. **(Future) Approval-gated testnet execution**:
   ```powershell
   $env:TROPTIONS_PROVISIONING_EXECUTE="YES_I_UNDERSTAND"
   $env:TROPTIONS_CONTROL_HUB_APPROVAL_ID="<approval id>"
   $env:TROPTIONS_LEGAL_REVIEW_ID="<legal id>"
   $env:TROPTIONS_CUSTODY_REVIEW_ID="<custody id>"
   node scripts/provision-troptions-assets.mjs --execute --network=testnet
   ```
6. **Mainnet execution is currently blocked** by `assetProvisioningPolicyEngine.ts`
   even when all approvals are present. See
   [`asset-provisioning-approval-policy.md`](asset-provisioning-approval-policy.md).

## Operation set

XRPL:

1. `AccountSet` on issuer — `asfDefaultRipple` + `Domain=hex(troptions.org)`
2. `TrustSet` on distributor — TROPTIONS limit 1,000,000,000
3. `Payment` issuer→distributor — issue 100,000,000 TROPTIONS
4. `NFTokenMint` on distributor — Genesis Member #1 (taxon 1, non-transferable)
5. `MPTokenIssuanceCreate` on distributor — Tranche A *(requires `--enable-mpt` and
   the **MPTokensV1** amendment to be enabled on the rippled server)*
6. `OfferCreate` × 2 on distributor — TROPTIONS/XRP bid + ask

Stellar:

1. `SetOptions` on issuer — `home_domain=troptions.org`, auth flags
2. `ChangeTrust` on distributor — TROPTIONS limit 1,000,000,000
3. `SetTrustLineFlags` on issuer — authorize distributor (KYC handshake)
4. `Payment` issuer→distributor — issue 100,000,000 TROPTIONS
5. `ManageSellOffer`/`ManageBuyOffer` on distributor — TROPTIONS/XLM bid + ask

## Key facts

- **Dry-run does not equal an issued asset.** No on-chain state is created.
- **Metadata does not equal legal approval.** SEP-1 / XLS-26d files are
  identity descriptions, not regulatory filings.
- **Default network is `testnet`.** Mainnet requires an extra
  `--i-understand-mainnet` flag in addition to all approval IDs.
- **Seeds are never printed.** The script verifies wallet derivations and
  shows only the public address.

## Rolling back

Many of these operations are **irreversible** at the protocol level once
broadcast (issued tokens cannot be uncreated; trustlines persist; account
flags require explicit clearing transactions). Before any `--execute` run,
the Control Hub approval record must include a written rollback assessment.
