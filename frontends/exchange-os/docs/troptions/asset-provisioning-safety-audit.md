# Troptions Asset Provisioning — Safety Audit

**Status:** 🛡️ **DRY-RUN / SIMULATION-ONLY**
**Date:** 2026-04-28
**Auditor:** senior XRPL/Stellar release engineer + token metadata auditor + compliance engineer

---

## 1. Scope

Files under audit:

| File | Type | Purpose |
| --- | --- | --- |
| `scripts/provision-troptions-assets.mjs` | broadcast-capable script | Original orchestrator (now hardened) |
| `scripts/validate-troptions-asset-metadata.mjs` | read-only | Metadata + TOML validator (no wallet access) |
| `scripts/plan-troptions-asset-provisioning.mjs` | read-only | Unsigned operation planner (no signing) |
| `public/.well-known/stellar.toml` | SEP-1 | Stellar issuer/domain identity |
| `public/.well-known/xrp-ledger.toml` | XLS-26d | XRPL issuer/domain identity |
| `public/troptions/asset-metadata/troptions.iou.v1.json` | universal | Cross-chain canonical asset descriptor |
| `public/troptions/asset-metadata/troptions.nft.collection.v1.json` | XLS-24 / OpenSea | NFT collection metadata |
| `public/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json` | XLS-33d | MPT issuance metadata |

Environment variables are referenced **only by name** in this audit.
No secret values, seeds, or private keys are reproduced.

---

## 2. Capability matrix

| Operation | Chain | Original script | Hardened script |
| --- | --- | --- | --- |
| AccountSet (DefaultRipple, Domain) | XRPL | could submit | gated |
| TrustSet (TROPTIONS) | XRPL | could submit | gated |
| Payment (issue supply) | XRPL | could submit | gated |
| NFTokenMint | XRPL | could submit | gated |
| MPTokenIssuanceCreate | XRPL | could submit | gated |
| OfferCreate (DEX bid+ask) | XRPL | could submit | gated |
| SetOptions (auth flags + home_domain) | Stellar | could submit | gated |
| ChangeTrust | Stellar | could submit | gated |
| SetTrustLineFlags (authorize) | Stellar | could submit | gated |
| Payment (issue supply) | Stellar | could submit | gated |
| ManageSellOffer / ManageBuyOffer | Stellar | could submit | gated |

**"Gated"** means broadcast requires *all* of:

1. CLI flag `--execute`
2. Env `TROPTIONS_PROVISIONING_EXECUTE=YES_I_UNDERSTAND`
3. Env `TROPTIONS_CONTROL_HUB_APPROVAL_ID` (non-empty)
4. Env `TROPTIONS_LEGAL_REVIEW_ID` (non-empty)
5. Env `TROPTIONS_CUSTODY_REVIEW_ID` (non-empty)
6. Network selector explicitly set to `mainnet` (default is `testnet`)

If any gate is missing, the script aborts **before** building or signing transactions.

---

## 3. Secret-handling review

| Risk | Mitigation in hardened script |
| --- | --- |
| Seeds printed to stdout | Wallet derivation results print only the public address; seeds are never logged |
| Seeds written to log file | Audit log records public addresses + tx hashes only |
| Env values echoed | Env vars are read but never printed; only their *presence* is reported |
| `.env.local` committed | `.gitignore` already excludes; Phase 9 verifies via `git status` |
| Secret leakage on error | All `catch` blocks log `err.message` only — wallet objects are not interpolated |

---

## 4. Metadata correctness

| File | Standard | Required fields present | Notes |
| --- | --- | --- | --- |
| `stellar.toml` | SEP-1 | VERSION, NETWORK_PASSPHRASE, ACCOUNTS, DOCUMENTATION, CURRENCIES, PRINCIPALS | ✅ |
| `xrp-ledger.toml` | XLS-26d | METADATA, ACCOUNTS, CURRENCIES, PRINCIPALS | ✅ |
| `troptions.iou.v1.json` | custom | assetId, branding, ledgers, compliance, legalNotice | ✅ |
| `troptions.nft.collection.v1.json` | XLS-24 / OpenSea | name, description, image, attributes, ledger.xrpl, compliance | ✅ |
| `troptions.mpt.tranche-a.v1.json` | XLS-33d | ticker, name, icon, asset_class, issuer, ledger, flags, compliance | ✅ |

All metadata URLs point to `https://troptions.org/...` (canonical domain per `troptionsEcosystemRegistry.ts`).

---

## 5. Compliance language review

Banned phrasing (investment, profit, yield, guaranteed value, return, redeemable) is **absent** in:

- `stellar.toml` `redemption_instructions` and `desc`
- `xrp-ledger.toml` `description`
- all `*.json` `description` and `compliance.legalNotice` fields

Each metadata file carries an explicit disclaimer:

> *"Not a security, not a stablecoin, not a redeemable instrument, not a payment instrument. No guarantees of redemption, liquidity, or return."*

Phase 4 / Phase 7 add automated regex checks to keep this property invariant.

---

## 6. XRPL amendment dependency

`MPTokenIssuanceCreate` requires the **MPTokensV1** amendment to be enabled on the connected rippled server.
The hardened script:

- defaults the network to `testnet` (where MPTokensV1 may be enabled selectively)
- skips MPT steps unless `--enable-mpt` is passed
- prints the connected server's amendment list (read-only) before any MPT step

---

## 7. Live execution blocked by default

| Default | Hardened script |
| --- | --- |
| Submit txs | ❌ blocked |
| Network | testnet (mainnet requires explicit flag *and* approval IDs) |
| MPT | skipped (requires `--enable-mpt`) |
| Print seeds | ❌ never |
| Read env without approval | only `--plan-only` and `--metadata-only` modes are available |

---

## 8. Control Hub approval

A future broadcast must be tied to an approval record managed by the existing Control Hub bridge.
Phase 5 introduces:

- `src/lib/troptions/asset-provisioning/assetProvisioningTypes.ts` — type definitions
- `src/lib/troptions/asset-provisioning/assetProvisioningPolicyEngine.ts` — policy evaluation

Policy currently returns `{ decision: "blocked" }` for every live operation.
Unblocking requires changes reviewed under the `troptions-control-plane/approvals.json` workflow.

---

## 9. Findings summary

| Severity | Finding | Status |
| --- | --- | --- |
| HIGH | Original script could broadcast without independent approval | **fixed** in Phase 2 |
| HIGH | MPT step would attempt broadcast on a non-amended server | **fixed** in Phase 2 |
| MEDIUM | Mainnet was the default network | **fixed** — testnet is default |
| LOW | No metadata validator existed | **fixed** in Phase 3 |
| LOW | No automated banned-claims test | **fixed** in Phase 7 |

---

## 10. Sign-off requirements before any future broadcast

1. Legal review ID issued and recorded in `troptions-control-plane/approvals.json`.
2. Custody review ID issued (multi-sig / cold-key controls verified).
3. Compliance review ID issued (KYC framework, sanctions screening, jurisdiction analysis).
4. Control Hub approval ID issued, tied to a specific operation set.
5. `troptions-control-plane/release-gates.json` updated to allow the specific operations.
6. Independent peer review of the planned operation set (output of `plan-troptions-asset-provisioning.mjs`).

Until all six items are recorded, this stack remains **dry-run / simulation-only**.
