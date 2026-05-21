# Legacy Bitcoin Holder Audit — Overview

**Status**: RESEARCH_ONLY — No live redemption claims enabled  
**Last Updated**: 2026-04-26  
**Scope**: Historical asset provenance + compliance documentation  

## Executive Summary

This audit examines historic TROPTIONS.GOLD and XTROPTIONS.GOLD assets issued on XRPL and Stellar networks to reconstruct provenance, identify legacy holders, and document market cap claims for compliance purposes.

**CRITICAL**: This is research-only documentation. No BTC custody claims. No redemption guarantees. All valuations are UNVERIFIED REFERENCE ONLY.

## Assets Under Review

| Asset Name | Chain | Supply | Issuer | Status |
|------------|-------|--------|--------|--------|
| XTROPTIONS.GOLD | XRPL | 10,000,000,000 | 1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6 | UNVERIFIED_VALUATION |
| TROPTIONS.GOLD | Stellar | 180,000,000 | 1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6 | UNVERIFIED_VALUATION |

**Combined Supply**: 10.18B units  
**Reference Market Cap (UNVERIFIED)**: ~0.118 BTC equivalent  
**Common Issuer**: 1LSqksKgmUh1TDMoAxLAQSNcwnfgkzCRP6

## Key Disclaimers

1. **RESEARCH ONLY** — This audit is for historical documentation and compliance trails
2. **NO REDEMPTION CLAIMS** — Legacy assets are records only; no live redemption enabled
3. **NO BTC CUSTODY CLAIMS** — No Bitcoin backing or custody guarantees
4. **UNVERIFIED VALUATION** — All market cap figures require external audit
5. **PROVENANCE TRACKING** — Asset creation and early distributions require verification

## Holder Analysis

**Status**: PENDING external TokenScan API integration

Current scope:
- Identify addresses holding XTROPTIONS.GOLD or TROPTIONS.GOLD
- Trace transaction history and distributions
- Document holder types (personal, institutional, lost, etc.)
- Cross-reference with Kevan wallet analysis (pending authorization)

## Next Steps

1. **Phase 1**: Obtain TokenScan API credentials; implement scripts/troptions/fetch-legacy-btc-holder-audit.mjs
2. **Phase 2**: Query XRPL ledger history for XTROPTIONS.GOLD trustlines + balances
3. **Phase 3**: Query Stellar Horizon API for TROPTIONS.GOLD trustlines + balances
4. **Phase 4**: Cross-reference Kevan wallet addresses (pending explicit authorization)
5. **Phase 5**: Validate pricing against historical CoinGecko/CoinMarketCap data
6. **Phase 6**: Legal review of research-only framing + disclaimers

## Files in This Audit

```
docs/troptions/legacy-btc-holder-audit/
├── 00-overview.md                    (this file)
├── 01-audit-authorization.md         (Kevan consent + scope)
├── 02-holder-registry.md             (discovered holders + holdings)
├── 03-valuation-analysis.md          (market cap verification)
├── 04-provenance-chain.md            (asset creation history)
├── 05-kevan-wallet-analysis.md       (BTC address holdings, pending auth)
└── final-audit-report.md             (summary + recommendations)

src/lib/troptions/legacy-btc-audit/
├── types.ts                          (TypeScript domain)
├── engine.ts                         (audit functions + disclaimer generation)
└── index.ts                          (barrel export)

src/app/api/troptions/legacy-btc-holders/
└── route.ts                          (GET endpoint: audit summary + holder data)

src/app/troptions/legacy-btc-holders/
└── page.tsx                          (UI: audit dashboard + holder registry)

scripts/troptions/
└── fetch-legacy-btc-holder-audit.mjs (TokenScan API integration; TBD)
```

## Integration Timeline

- **Now**: Type definitions + engine functions + documentation scaffold
- **Week 1**: TokenScan API integration + scripts
- **Week 2**: XRPL/Stellar holder queries
- **Week 3**: Kevan wallet analysis (pending authorization)
- **Week 4**: Valuation audit + provenance documentation
- **Final**: Legal review + publish audit report

---

**DISCLAIMER**: This audit is research and documentation only. No financial claims. No redemption guarantees. No BTC custody claims.
