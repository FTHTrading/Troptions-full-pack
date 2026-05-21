# TypeScript Cleanup Report

Scope: Fix pre-existing TypeScript errors unrelated to commit `331aa86`
(asset-provisioning lockdown), without weakening any guardrail.

## Files fixed

1. `src/app/api/troptions/stellar/genesis/route.ts`
   — Fixed wrong import: `verifyGenesisAdminKey` now imported from
   `@/lib/troptions/xrplGenesisEngine` (its true module).
2. `src/app/api/troptions/stellar/lp/route.ts`
   — Same import-path fix for `verifyGenesisAdminKey`.
   — Removed `maxPrice` / `minPrice` from `createTroptionsXlmPool` and
   `createTroptionsUsdcPool` call sites; the engine functions don't accept
   them (they use hard-coded canonical pool ratios). No behavior change.
   — Replaced `status.find(w => w.role === "LP_MANAGER")` with the correct
   `status.lpManager` (the engine returns an object, not an array).
3. `src/app/api/troptions/xrpl/nft/route.ts`
   — Removed `metadata` from `NftMintParams` payload (not part of the
   public type — XRPL NFTokenMint only exposes URI/taxon/transferFee/flags).
   — Removed duplicate `ok: true` key in GET response (the spread `...info`
   already carries `ok`).
4. `src/lib/troptions/xrplGenesisEngine.ts`
   — Wrapped `dropsToXrp(...)` in `String(...)` for the `xrpBalance` field
   (xrpl v4.6.0 `dropsToXrp` returns `number`; interface declares `string`).
5. `src/lib/troptions/clientWalletEngine.ts`
   — `Wallet.generate("ed25519")` → `Wallet.generate(ECDSA.ed25519)`
   (xrpl v4.6.0 expects the `ECDSA` enum, not a positional string).
   Added `ECDSA` to the `xrpl` import.
6. `src/app/troptions/exchange-readiness/page.tsx`
   — Cast `item.status` to `string` for the `=== "ready"` comparison;
   the literal union currently only contains `"pending" | "in-progress"`,
   but the UI is intentionally future-proof for `"ready"` entries.
7. `src/app/troptions-cloud/[namespace]/sovereign-ai/page.tsx`
   — Replaced two server-component `<Link onClick={...}>` disabled stubs
   with `<span role="link" aria-disabled>`. Next.js 16 forbids passing
   function props from a Server Component to a Client Component during
   prerender. Visual styling and a11y semantics preserved; both links were
   already non-functional simulation placeholders, so no behavior change.

## Validation results

| Check                                                          | Result          |
| -------------------------------------------------------------- | --------------- |
| `npx tsc --noEmit`                                             | clean (exit 0)  |
| `node scripts/validate-troptions-asset-metadata.mjs`           | all checks pass |
| `node node_modules/jest/bin/jest.js --passWithNoTests`         | 561/561 pass    |
| `assetProvisioning.test.ts` (lockdown)                         | 19/19 pass      |
| `npm run build` (NODE_OPTIONS=--max-old-space-size=8192)       | clean (exit 0)  |

## Asset-provisioning safety unchanged

- `scripts/plan-troptions-asset-provisioning.mjs` still planning-only.
- `scripts/provision-troptions-assets.mjs` still requires
  `--execute`, `TROPTIONS_PROVISIONING_EXECUTE=YES_I_UNDERSTAND`,
  `TROPTIONS_CONTROL_HUB_APPROVAL_ID`, `TROPTIONS_LEGAL_REVIEW_ID`,
  `TROPTIONS_CUSTODY_REVIEW_ID`, defaults to `--network=testnet`,
  and gates mainnet behind `--i-understand-mainnet` plus a policy-engine
  block.
- Policy engine (`assetProvisioningPolicyEngine.ts`) untouched.
- No live XRPL/Stellar issuance, minting, trustline, offer, or payment
  execution enabled.

## Remaining issues

None observed. `tsc`, jest, and `npm run build` are all clean.
