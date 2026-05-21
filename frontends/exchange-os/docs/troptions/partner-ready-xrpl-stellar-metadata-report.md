# TROPTIONS — Partner-Ready XRPL/Stellar Metadata Report

**Status:** Standards-ready, dry-run only. No live token issuance, NFT minting,
trustline, DEX offer, AMM deposit, or payment execution is enabled on any
ledger.

**Latest commits on `main`:**

| Commit    | Title                                                                            |
| --------- | -------------------------------------------------------------------------------- |
| `d5a19be` | fix(types): clean XRPL Stellar genesis and route type errors                     |
| `331aa86` | feat(assets): add XRPL Stellar asset metadata and dry-run provisioning guardrails |
| `8c8424a` | feat(troptions-ai): sovereign AI system builder and client knowledge vault       |
| `241189c` | feat(troptions-cloud): Phase 23 — namespace and membership access foundation     |
| `6827657` | feat(genesis): Phase 20 — genesis hash lock, IPFS pin, release verification      |

**Local validation (commit `d5a19be`):**

| Check                                                | Result          |
| ---------------------------------------------------- | --------------- |
| `npx tsc --noEmit`                                   | clean (exit 0)  |
| `node node_modules/jest/bin/jest.js`                 | 561/561 pass    |
| `assetProvisioning.test.ts` lockdown suite           | 19/19 pass      |
| `node scripts/validate-troptions-asset-metadata.mjs` | all pass        |
| `npm run build` (NODE_OPTIONS=--max-old-space-size=8192) | clean (exit 0) |

---

## 1. What is **live** today

The following is live in the codebase and will be live on
`troptions.unykorn.org` once `main` is pushed and Vercel re-deploys:

- Public marketing surfaces under `/troptions`, `/troptions-portal`,
  `/troptions-cloud`, `/troptions-ai`, `/ttn`, and the `/admin/troptions`
  dashboards (admin pages remain auth-gated).
- Phase 20 genesis hash lock and IPFS-pinned release proof
  (`/api/troptions/genesis/release`).
- Static informational dashboards for XRPL and Stellar readiness.
- 561-test Jest suite enforcing the lockdown rules in CI.

> Note: "Live" here means deployed and reachable. It does **not** mean any
> on-ledger token state has been created. See section 2.

## 2. What is **metadata-only** (published, not on-ledger)

Public asset identity files served from the Next.js app:

- `/.well-known/stellar.toml` — SEP-1 organization + asset declaration
  (placeholder `ACCOUNTS` / `currencies[].issuer` until issuer wallets are
  provisioned).
- `/.well-known/xrp-ledger.toml` — XLS-26d organization + accounts +
  currencies declaration.
- `/troptions/asset-metadata/troptions.iou.v1.json` — XRPL IOU asset card.
- `/troptions/asset-metadata/troptions.nft.collection.v1.json` — XLS-24
  NFT collection card.
- `/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json` — XLS-33d
  multi-purpose token card.

These files describe the asset *identity* and branding for explorer and
wallet recognition. They do **not** prove issuance, custody, supply, or
reserves.

## 3. What is **dry-run only**

- `scripts/validate-troptions-asset-metadata.mjs` — read-only validator;
  no network, no seeds, no signing.
- `scripts/plan-troptions-asset-provisioning.mjs` — read-only planner;
  emits an **unsigned** operation list to `data/observability/`.
- `scripts/provision-troptions-assets.mjs` — defaults to dry-run.
  Without `--execute` it never connects to a network and never signs.

## 4. What is **blocked**

Hard-blocked at the policy + script layer (`331aa86`, unchanged by `d5a19be`):

- `--execute` requires **all four** environment values:
  - `TROPTIONS_PROVISIONING_EXECUTE=YES_I_UNDERSTAND`
  - `TROPTIONS_CONTROL_HUB_APPROVAL_ID`
  - `TROPTIONS_LEGAL_REVIEW_ID`
  - `TROPTIONS_CUSTODY_REVIEW_ID`
- Missing any one → exit code 2, no network call.
- `--network=mainnet` requires the additional flag `--i-understand-mainnet`
  **and** is independently rejected by
  `src/lib/troptions/asset-provisioning/assetProvisioningPolicyEngine.ts`
  by default. Mainnet is off until the policy engine is explicitly opened.
- Live API routes for XRPL/Stellar genesis, NFT mint, and LP creation
  require `Authorization: Bearer <GENESIS_ADMIN_KEY>` and do not run
  unless that key is configured server-side.

## 5. What requires **legal review**

Before any live issuance or public claim of value:

- Non-securities legal opinion (US — Howey).
- Non-securities legal opinion (EU — MiCA classification).
- AML / CFT policy documentation.
- VASP registration where applicable.
- Disclosures and risk language for any sale, offer, or distribution.

Tracked in `src/content/troptions/exchangeListingRegistry.ts`
(`COMPLIANCE_CHECKLIST`) — current statuses are `pending` or
`in-progress`, never `ready`.

## 6. What requires **custody review**

- Issuer wallet generation, sealing, and offline backup procedure.
- Master-key disabling on issuer accounts after distribution setup.
- Multi-sig or hardware-custody design for the LP and treasury wallets.
- Documented seed-recovery and incident-response runbooks.
- Approval signature: `TROPTIONS_CUSTODY_REVIEW_ID`.

## 7. What requires **Control Hub approval**

Every live-write provisioning kind passes through the policy engine and
requires a non-empty `TROPTIONS_CONTROL_HUB_APPROVAL_ID`. The 19-test
lockdown suite (`src/__tests__/troptions/assetProvisioning.test.ts`)
asserts that:

- testnet writes are gated on all approvals,
- mainnet writes are blocked by default,
- `--execute` without approvals exits with code `2`,
- the metadata files contain no positively-framed banned claims.

## 8. What Troptions **can** safely demonstrate now

- Public organization identity and asset branding via `stellar.toml` and
  `xrp-ledger.toml`.
- Asset metadata cards for IOU, NFT collection, and MPT tranche A.
- Standards-ready posture (SEP-1, XLS-20, XLS-24, XLS-26d, XLS-33d).
- Dry-run provisioning *plan* output (unsigned, human-readable).
- Compliance and exchange-readiness checklist UI at
  `/troptions/exchange-readiness`.
- Read-only XRPL/Stellar status endpoints (account info, no signing).
- Phase 20 genesis hash + IPFS-pinned release proof.

## 9. What Troptions **must not claim** yet

- Do not claim TROPTIONS is "issued", "live on XRPL/Stellar", "trading",
  "listed", or "available for sale".
- Do not claim a circulating supply, a market price, or a reserve ratio.
- Do not claim AML/MiCA/Howey compliance — those reviews are pending.
- Do not claim exchange listings — none of the listings in
  `EXCHANGE_LISTING_REGISTRY` are confirmed.
- Do not promise NFT delivery, AMM liquidity, or yield.
- Do not represent dry-run plans or simulation outputs as on-ledger facts.

---

## Post-deploy verification checklist

The following must be re-verified **after** `git push origin main` and
`vercel deploy --prod --yes` complete. Local artifacts confirm the files
exist and parse, but production URLs are not reachable until then.

### Public metadata (expect HTTP 200, content-type as noted)

- [ ] `https://troptions.unykorn.org/.well-known/stellar.toml` → `text/plain` or `application/toml`
- [ ] `https://troptions.unykorn.org/.well-known/xrp-ledger.toml` → `text/plain` or `application/toml`
- [ ] `https://troptions.unykorn.org/troptions/asset-metadata/troptions.iou.v1.json` → `application/json`
- [ ] `https://troptions.unykorn.org/troptions/asset-metadata/troptions.nft.collection.v1.json` → `application/json`
- [ ] `https://troptions.unykorn.org/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json` → `application/json`

### Public pages (expect HTTP 200)

- [ ] `/troptions`
- [ ] `/troptions-portal`
- [ ] `/troptions-cloud`
- [ ] `/troptions/xrpl`
- [ ] `/troptions/stellar`
- [ ] `/troptions/exchange-readiness`

### Admin / protected (expect 200 when authenticated; 401/403 — **not** 404 — when unauthenticated)

- [ ] `/admin/troptions/control-hub`
- [ ] `/api/troptions/xrpl/genesis` (POST without bearer → 403)
- [ ] `/api/troptions/stellar/genesis` (POST without bearer → 403)
- [ ] `/api/troptions/xrpl/nft` (POST without bearer → 403)
- [ ] `/api/troptions/stellar/lp` (POST without bearer → 403)

If any admin route returns `404`, the route file is missing from the
deployed bundle (likely an unstaged file). If any returns `200` without a
bearer token, that is a security regression — do not proceed.

---

## Summary statement (safe to share with partners)

> Troptions has reached a standards-ready, dry-run posture for XRPL and
> Stellar. Public asset identity files (SEP-1, XLS-26d), metadata cards
> (IOU, XLS-24 NFT, XLS-33d MPT), and a tested dry-run provisioning
> pipeline are in place. No tokens, NFTs, trustlines, offers, or payments
> have been executed on either ledger. Live execution is gated behind
> Control Hub approval, legal review, and custody review, and mainnet is
> policy-blocked by default.
