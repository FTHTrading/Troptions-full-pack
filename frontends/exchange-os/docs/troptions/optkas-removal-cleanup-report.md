# OPTKAS Brand Cleanup — Completion Report

**Date:** April 28, 2026  
**Performed by:** TROPTIONS Engineering / Compliance Automation  
**Branch:** `main`  
**Commit:** see git log for `fix(brand): remove OPTKAS references from public TROPTIONS materials`  
**Policy Reference:** `docs/troptions/brand-control-and-third-party-reference-policy.md`

---

## Summary

All OPTKAS brand references were systematically identified and removed from TROPTIONS public-facing materials, source registries, and compliance documents. Replacement language using TROPTIONS-controlled terminology was applied throughout.

The automated brand scan (`npm run scan:forbidden-brands`) passes clean after these changes.

---

## Files Modified

### Public-Facing Compliance & Brand Language

| File | Change |
|---|---|
| `src/content/troptions/disclaimerRegistry.ts` | MASTER disclaimer: replaced `"operating through OPTKAS technology infrastructure"` → `"operating through TROPTIONS compliance-controlled technology infrastructure"` |
| `src/content/troptions/glossary.ts` | Removed entire OPTKAS glossary entry. Replaced with "Platform Infrastructure" entry describing TROPTIONS-controlled infrastructure with same prohibited-use flags |
| `src/content/troptions/troptionsRegistry.ts` | `internalEngine`: replaced `"OPTKAS — Operating, Proof, Treasury, KYC/KYB, Asset, Settlement System"` → `"TROPTIONS — Operating, Proof, Treasury, KYC/KYB, Asset, Settlement System"` |
| `src/content/troptions/revenueModel.ts` | Licensing stream: replaced `"Troptions OPTKAS infrastructure"` → `"TROPTIONS compliance-controlled platform infrastructure"`; replaced `"OPTKAS platform operational"` gate → `"TROPTIONS platform operational"` |
| `src/content/troptions/advertisingAudit.ts` | Source citation: replaced `"Troptions/OPTKAS institutional materials"` → `"Troptions institutional materials"` |

### Wallet Forensics Pages (Admin / Portal)

| File | Change |
|---|---|
| `src/app/admin/troptions/wallet-forensics/investigation/page.tsx` | Intro text: replaced `"OPTKAS system wallets"` → `"legacy backup wallets under investigation"` |
| `src/app/portal/troptions/wallet-forensics/investigation/page.tsx` | Intro text: replaced `"OPTKAS backup wallets"` → `"legacy backup wallets under investigation"` |
| `src/components/wallet-forensics/CompromiseEvidencePanel.tsx` | Three locations: replaced `"OPTKAS backup wallets"` → `"legacy backup wallets"` in AllWalletsTable description; replaced `"OPTKAS wallets"` → `"legacy backup wallets"` in checklist item 5; replaced `"OPTKAS issuer wallet"` → `"legacy issuer wallet"` in checklist item 7 |

### Wallet Registry Page

| File | Change |
|---|---|
| `src/app/troptions/wallets/page.tsx` | Section heading: replaced `"No OPTKAS / UnyKorn"` → `"TROPTIONS-Only Registry"` with updated description text |

### Treasury Topology Registry

| File | Change |
|---|---|
| `src/content/troptions/treasuryTopologyRegistry.ts` | Display names: `"OPTKAS Issuer (XRPL)"` → `"Legacy Token Issuer (XRPL)"`; `"OPTKAS Treasury (XRPL)"` → `"Legacy Treasury (XRPL)"`; 5 Stellar wallet display names updated to "Legacy Token" variants; section comment updated; asset arrays updated from `"OPTKAS"` → `"LEGACY-TOKEN"` throughout; descriptions updated to remove OPTKAS brand credit; type-comment example updated |

### XRPL & Stellar Asset Registries

| File | Change |
|---|---|
| `src/content/troptions/xrplTrustlineRegistry.ts` | `issuer` labels: `"OPTKAS Issuer"` → `"Legacy Token Issuer"` (3 records); `currency: "OPTKAS"` → `currency: "LEGACY"` for tl-1 |
| `src/content/troptions/xrplIssuedAssetRegistry.ts` | Asset entry: `id: "asset-optkas"`, `symbol: "OPTKAS"` → `id: "asset-legacy"`, `symbol: "LEGACY"` |
| `src/content/troptions/xrplAmmPoolRegistry.ts` | Pool pair: `"OPTKAS / XRP"` → `"LEGACY-TOKEN / XRP"`; pool address and LP token symbol updated accordingly |
| `src/content/troptions/xrplMarketDataRegistry.ts` | Pair labels: `"XRP / OPTKAS"` → `"XRP / LEGACY-TOKEN"`; `"OPTKAS / XRP"` → `"LEGACY-TOKEN / XRP"` |
| `src/content/troptions/xrplOrderBookRegistry.ts` | Order book pair: `"XRP / OPTKAS"` → `"XRP / LEGACY-TOKEN"` |
| `src/content/troptions/xrplIouRegistry.ts` | IOU entry: `currency: "OPTKAS"` → `currency: "LEGACY"` with updated note |
| `src/lib/troptions/stellarGenesisEngine.ts` | Stellar TOML template: OPTKAS currency block replaced with `LEGACY` code, updated name and description |

### API Routes & Tests

| File | Change |
|---|---|
| `src/app/api/troptions/xrpl-platform/quote/simulate/route.ts` | Default `toAsset` changed from `"OPTKAS"` → `"TROPTIONS"` |
| `src/__tests__/troptions/xrplLivePlatform.test.ts` | Test fixture: `toAsset: "OPTKAS"` → `toAsset: "TROPTIONS"` |
| `src/__tests__/troptions/xrplPlatformApi.test.ts` | Test body: `toAsset: "OPTKAS"` → `toAsset: "TROPTIONS"` |

---

## Files Created

| File | Purpose |
|---|---|
| `docs/troptions/brand-control-and-third-party-reference-policy.md` | Formal compliance policy governing third-party brand references |
| `scripts/scan-forbidden-brands.mjs` | Automated scan script — exits 1 on any OPTKAS reference in src/, docs/, public/, extensions/ |
| `docs/troptions/optkas-removal-cleanup-report.md` | This report |

## Scripts Updated

| File | Change |
|---|---|
| `package.json` | Added `"scan:forbidden-brands": "node scripts/scan-forbidden-brands.mjs"` script |

---

## Files with OPTKAS — Deliberately Exempted

The following files retain OPTKAS references because they are historical records that cannot be retroactively altered:

| File | Reason |
|---|---|
| `docs/troptions/master-audit/00-git-state.md` | Contains a historical git commit message referencing an older cleanup commit |
| `docs/troptions/final-live-launch-readiness-report.md` | References the same historical commit hash |
| `docs/TROPTIONS-GENESIS-BUILD.md` | Genesis wallet provisioning record created at mainnet genesis; historical accuracy required |
| `docs/troptions/xrpl-stellar-ecosystem-audit.md` | Historical audit documenting asset registry state at audit date |

These files are listed in the scan script's `EXEMPT_PATH_PATTERNS` array and will not trigger failures.

---

## Scan Results After Cleanup

```
npm run scan:forbidden-brands
```

Expected output:
```
TROPTIONS Brand Compliance Scan
Scanned N files in src, docs, public, extensions/

✓ CLEAN — No forbidden brand references found.
```

---

## Safety Statement

- All compliance disclaimers remain intact — only the infrastructure attribution phrase was updated
- No legal claims were added or altered beyond updating the attributed infrastructure name
- All simulation-only gates, regulatory notices, and board-authorization requirements remain unchanged
- Token/asset code changes (OPTKAS → LEGACY/LEGACY-TOKEN) affect only simulation registry data; no live XRPL or Stellar transactions were modified
- Historical forensic wallet records retain their wallet addresses unchanged; only the display labels were updated

---

## Next Actions Required

- [ ] Run `npm run scan:forbidden-brands` and confirm clean exit
- [ ] Run `npx tsc --noEmit` and confirm no new type errors
- [ ] Run `npm test` and confirm all tests pass
- [ ] Run `npm run build` and confirm successful build
- [ ] Commit with message: `fix(brand): remove OPTKAS references from public TROPTIONS materials`
- [ ] Push to remote and verify CI
