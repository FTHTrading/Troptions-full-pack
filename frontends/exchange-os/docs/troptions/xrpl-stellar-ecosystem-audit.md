# XRPL + Stellar Ecosystem Audit

**Date:** 2026-04-27  
**Sprint:** feat(xrpl-stellar): persisted simulation-first cross-rail ecosystem layer  
**Status:** Pre-implementation audit

---

## 1. Existing XRPL Files

### Content Registries (`src/content/troptions/`)
| File | Purpose |
|------|---------|
| `xrplRegistry.ts` | Core XRPL account registry — account IDs, trustline counts, enabled status |
| `xrplTrustlineRegistry.ts` | Trustline records with holder/issuer/currency/risk fields |
| `xrplIssuedAssetRegistry.ts` | Issued assets: OPTKAS, SOVBND, IMPERIA, GEMVLT, TERRAVL, PETRO, ATTEST |
| `xrplAmmRegistry.ts` | AMM pool records with feeBps, slippageModel, enabledStatus: simulation-only |
| `xrplAmmPoolRegistry.ts` | Extended AMM pool records |
| `xrplDexRegistry.ts` | DEX route records |
| `xrplTradeReadinessRegistry.ts` | Mainnet readiness gate configuration |
| `xrplLivePlatformRegistry.ts` | Live-data platform configuration |
| `xrplMarketDataRegistry.ts` | Market data display records |
| `xrplOrderBookRegistry.ts` | Order book data |
| `xrplExternalLinksRegistry.ts` | External XRPL resource links |
| `xrplDependencySecurityRegistry.ts` | Dependency/security audit entries |

### Library Engines (`src/lib/troptions/`)
| File | Purpose |
|------|---------|
| `xrplTrustlineEngine.ts` | List trustline statuses from registry |
| `xrplAmmEngine.ts` | List AMM pools |
| `xrplAmmPoolEngine.ts` | Extended AMM pool operations |
| `xrplDexEngine.ts` | DEX route listing |
| `xrplLedgerEngine.ts` | Ledger data |
| `xrplLiveDataEngine.ts` | Live data fetch |
| `xrplMainnetReadinessGate.ts` | Mainnet gate — isLiveMainnetExecutionEnabled: false always |
| `xrplExternalSignerGate.ts` | External signer gate — no private key handling |
| `xrplTradeSimulationEngine.ts` | Trade simulation — simulation only, no tx submission |
| `xrplTestnetExecutionEngine.ts` | Unsigned testnet tx payload builder — no signing |
| `xrplPathfindingEngine.ts` | Quote simulation for pathfinding routes |
| `xrplOrderBookEngine.ts` | Order book data |
| `xrplPlatformApiUtils.ts` | `buildXrplApiEnvelope`, `assertNoSensitiveXrplInputs` |
| `xrplDependencySecurityGuard.ts` | Security dependency checks |

### API Routes (`src/app/api/troptions/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `xrpl/quote/route.ts` | POST | Quote simulation — audit only |
| `xrpl/amm/route.ts` | GET | AMM pool list |
| `xrpl/dex/route.ts` | GET | DEX routes |
| `xrpl-platform/trustlines/route.ts` | GET | Trustline registry read-only |
| `xrpl-platform/amm-pools/route.ts` | GET | AMM pool read-only |
| `jefe/xrpl-check/route.ts` | GET/POST | Jefe XRPL readiness check |

### Admin Pages (`src/app/admin/troptions/`)
| Path | Purpose |
|------|---------|
| `xrpl/` | XRPL admin section |
| `xrpl/amm/` | AMM admin |
| `xrpl/dex/` | DEX admin |
| `xrpl/trustlines/` | Trustlines admin |
| `xrpl-platform/` | XRPL Platform admin |
| `xrpl-platform/amm-pools/` | AMM pools admin |
| `xrpl-platform/trustlines/` | Trustlines admin |

### Portal Pages (`src/app/portal/troptions/`)
| Path | Purpose |
|------|---------|
| `xrpl/` | XRPL portal |
| `xrpl/amm/`, `xrpl/dex/`, `xrpl/trustlines/` | Subsections |
| `xrpl-platform/` | Platform portal |
| `xrpl-platform/amm/`, `xrpl-platform/dex/` | Subsections |

### Public Pages (`src/app/troptions/`)
| Path | Purpose |
|------|---------|
| `xrpl-platform/` | XRPL Platform public |
| `xrpl-platform/amm/`, `/dex/`, `/trustlines/` | Subsections |
| `chains/xrpl/` | XRPL chain page |

### Components (`src/components/xrpl-platform/`)
| Component | Purpose |
|-----------|---------|
| `XrplAmmPoolCard.tsx` | AMM pool display card |
| `XrplExternalLinksPanel.tsx` | External links |
| `XrplIssuedAssetCard.tsx` | Issued asset display |
| `XrplMarketDataCard.tsx` | Market data |
| `XrplOrderBookTable.tsx` | Order book |
| `XrplPlatformLayout.tsx` | Shared layout |
| `XrplQuoteSimulator.tsx` | Quote simulation UI |
| `XrplReadinessGatePanel.tsx` | Mainnet readiness gate display |
| `XrplSecurityBanner.tsx` | Security disclaimer |
| `XrplTrustlineTable.tsx` | Trustline table |

### Existing Tests (`src/__tests__/troptions/`)
| File | Tests |
|------|-------|
| `xrplLivePlatform.test.ts` | Live platform configuration tests |
| `xrplPlatformApi.test.ts` | API validation tests |

---

## 2. Existing Stellar Files

### Content Registries
| File | Purpose |
|------|---------|
| `stellarWalletInventoryRegistry.ts` | Untracked — wallet-forensics territory, must stay unstaged |

**Conclusion:** Stellar ecosystem is almost entirely greenfield. Only one registry exists and it is in the wallet-forensics work stream.

---

## 3. Existing Stablecoin / Payment Modules

- Stablecoin references exist in `institutionalFutureRegistry.ts` as future capabilities
- Payment simulation exists in `xrplTradeSimulationEngine.ts` / `xrplPathfindingEngine.ts`
- No Stellar stablecoin or payment layer exists yet

---

## 4. Existing Compliance / Approval Modules

- `xrplMainnetReadinessGate.ts` — hard block on mainnet execution
- `xrplExternalSignerGate.ts` — blocks private key ingestion
- `xrplDependencySecurityGuard.ts` — dependency security checks
- `xrplPlatformApiUtils.ts` — `assertNoSensitiveXrplInputs`
- `xrplTradeReadinessRegistry.ts` — approval requirements for mainnet

---

## 5. Existing Control Hub Persistence Integration Points

| File | Integration |
|------|-------------|
| `controlHubStateStore.ts` | `createTaskRecord`, `createSimulationRecord`, `createBlockedActionRecord`, `createAuditRecord`, `createApprovalRecord`, `createRecommendationRecord`, `getControlHubStateSnapshot` |
| `controlHubStateTypes.ts` | All type definitions for persistence records |
| `govern/route.ts` | Creates task+simulation+blocked+audit on every Clawd govern call |

**Gap:** XRPL/Stellar simulations currently do NOT write to the Control Hub persistence layer. This sprint adds the bridge.

---

## 6. Existing Tests

| Suite | Count |
|-------|-------|
| `xrplLivePlatform.test.ts` | Existing |
| `xrplPlatformApi.test.ts` | Existing |
| `controlHubPersistence.test.ts` | 43 (added prev sprint) |
| All suites | 357 / 357 passing baseline |

---

## 7. Risk Areas

1. **No Stellar engine at all** — full greenfield, must follow existing XRPL safety patterns
2. **XRPL ecosystem registry missing Troptions business unit profiles** — existing registries use generic symbols (OPTKAS, SOVBND, etc.) but don't name the 8 Troptions products
3. **Control Hub bridge missing** — simulations don't record to persistence yet
4. **No cross-rail (XRPL ↔ Stellar) abstraction** — needed for path-payment readiness reports
5. **AMM/LP risk disclosures must be enforced** — no guaranteed liquidity language must be blocked
6. **KYC/KYB/sanctions status checks missing from policy engines** — both XRPL and Stellar need explicit policy blockers

---

## 8. Recommended Implementation Order

1. `src/lib/troptions/xrpl-stellar/xrplStellarTypes.ts` — shared types first (everything depends on them)
2. `src/content/troptions/xrplEcosystemRegistry.ts` — XRPL business unit profiles
3. `src/content/troptions/stellarEcosystemRegistry.ts` — Stellar business unit profiles
4. `src/lib/troptions/xrpl-stellar/xrplPolicyEngine.ts` — XRPL policy evaluators
5. `src/lib/troptions/xrpl-stellar/stellarPolicyEngine.ts` — Stellar policy evaluators
6. `src/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge.ts` — bridge to persistence
7. API routes (xrpl-ecosystem, stellar-ecosystem, cross-rail)
8. Admin dashboard component + page
9. Public pages
10. Documentation
11. Tests
12. Validate + commit
