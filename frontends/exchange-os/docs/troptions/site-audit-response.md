# TROPTIONS Site Audit Response — 2026-04-27

**Prepared by:** Troptions Institutional OS — Compliance Team  
**Audit date:** 2026-04-27  
**Response date:** 2026-04-27  
**Status:** Open — pending items tracked below

---

## Executive Summary

A site audit of three legacy Troptions web properties was conducted on 2026-04-27. The audit identified brand inconsistencies, unverified promotional language, token-sale framing, and exchange-readiness claims across all three domains. This document records the audit findings, the compliance actions taken, and the outstanding items requiring legal or operational resolution.

All three legacy domains are classified as **HIGH RISK** until migration and content review are complete.

---

## Audit Scope

| Legacy Domain | Canonical Successor | Source Record | Risk Level |
|---|---|---|---|
| `troptions.org` | `troptions.com` | `SRC-TROPTIONS-ORG-FULL-AUDIT` | High |
| `troptionsxchange.io` | `troptionsxchange.com` | `SRC-TROPTIONSXCHANGE-IO` | High |
| `troptions-unitytoken.com` | `unitytoken.io` | `SRC-TROPTIONS-UNITYTOKEN-COM` | High |

---

## Findings by Domain

### 1. troptions.org

**Findings:**
- Merchant-count and "accepted everywhere" claims (blocked: unverified aggregate)
- Balance-sheet impact language presented as fact
- "World's reserve currency of barter" presented without qualification
- Multi-token presentation (TROPTIONS GOLD, TROPTIONS SILVER, etc.) without current legal status clarification
- Exchange-ready language without licensing context

**Status:** Content flagged. Migration notice active. Source record `SRC-TROPTIONS-ORG-FULL-AUDIT` blocks institutional use.

**Claims logged:**
- `LCLM-TROPTIONS-ORG-MULTITOKEN` — needs evidence
- `LCLM-TROPTIONS-ORG-BARTER-ECOSYSTEM` — blocked

---

### 2. troptionsxchange.io

**Findings:**
- "Exchange-ready platform" and "live trading" language without active exchange operations
- "Instant liquidity" claims without documented liquidity sources
- Dark-background brand treatment inconsistent with canonical identity

**Status:** No live exchange operates on this domain. Content flagged. Migration notice active. Source record `SRC-TROPTIONSXCHANGE-IO` blocks institutional use until exchange license confirmed.

**Claims logged:**
- `LCLM-XCHANGE-EXCHANGE-READY` — blocked (no active license)
- `LCLM-XCHANGE-INSTANT-LIQUIDITY` — blocked (no documented source)

---

### 3. troptions-unitytoken.com

**Findings:**
- Token sale / ICO framing without securities classification or investor eligibility gating
- "Asset-backed" claims without reserve audit or custody evidence
- Social-impact narratives presented as current operating reality
- No qualifying disclosure for token classification under applicable securities law

**Status:** No public token offering is currently active. Content flagged. Migration notice active. Source record `SRC-TROPTIONS-UNITYTOKEN-COM` blocks institutional use until legal classification complete.

**Claims logged:**
- `LCLM-UNITY-TOKEN-SALE` — blocked (securities law: requires classification + investor eligibility)
- `LCLM-UNITY-ASSET-BACKED` — needs evidence (requires custody/reserve audit)

---

## Actions Taken — 2026-04-27

All actions completed on the same day as audit.

| Action | File(s) Modified | Status |
|---|---|---|
| Logged legacy sources with risk classification | `src/content/troptions/legacySourceRegistry.ts` | ✅ Complete |
| Logged specific claims with compliance status | `src/content/troptions/legacyClaimRegistry.ts` | ✅ Complete |
| Updated brand guidance (master logo, trademark, legacy alignment) | `docs/brand-system.md` | ✅ Complete |
| Updated domain map with legacy domain section and blocked language | `docs/troptions/troptions-domain-map.md` | ✅ Complete |
| Created migration notice registry (3 approved notices) | `src/content/troptions/migrationNoticeRegistry.ts` | ✅ Complete |
| Built `/troptions/migration` compliance page | `src/app/troptions/migration/page.tsx` | ✅ Complete |

---

## Outstanding Items

The following items require legal, operational, or third-party resolution before legacy domains can be cleared.

| ID | Item | Owner | Priority |
|---|---|---|---|
| C1 | Unity Token legal classification memo (securities law analysis) | Legal counsel | Critical |
| C2 | Unity Token reserve / custody audit (required before asset-backed claims) | Accounting / Custody | Critical |
| C3 | Troptionsxchange.com exchange license analysis | Legal counsel | Critical |
| A1 | Merchant-count source documentation (troptions.org claims) | Business development | High |
| A2 | Multi-token current legal status (TROPTIONS GOLD, SILVER, etc.) | Legal counsel | High |
| A3 | Content revision of all three legacy domains | Brand / Legal | High |
| A4 | DNS redirect legacy → canonical domain (troptions.org → troptions.com) | Infrastructure | Medium |
| A5 | DNS redirect legacy → canonical (troptionsxchange.io → troptionsxchange.com) | Infrastructure | Medium |
| A6 | DNS redirect legacy → canonical (troptions-unitytoken.com → unitytoken.io) | Infrastructure | Medium |

---

## Compliance Controls Deployed

The following controls are active in the Troptions Institutional OS following this audit:

### Source Registry — blocked flags
All three legacy domains are logged in `legacySourceRegistry.ts` with:
- `institutionalUse: "blocked-until-evidence"` or `"needs-verification"`
- Specific `blockedLanguage` arrays and `approvedRewrites` arrays
- `dateObserved: "2026-04-27"` and `riskLevel: "high"`

### Claim Registry — blocked flags
Six specific claims from these domains are logged in `legacyClaimRegistry.ts`:
- 4 claims with `status: "blocked"`
- 2 claims with `status: "needs-evidence"`
- Each claim has `reviewRequired: true` and `legalNote` explaining the compliance issue

### Migration Notice Registry
Three migration notices are active in `migrationNoticeRegistry.ts`:
- `migrationComplete: false` for all three domains
- Approved `bannerHeadline`, `bannerSummary`, and `pageBody` text per domain
- Approved `complianceNote` per domain
- CTA routing to canonical domain portal

### Migration Page
`/troptions/migration` is live and renders all three notices. This page:
- Is marked `robots: { index: false, follow: false }` (no search indexing)
- Displays the master disclaimer (`DISCLAIMERS.MASTER`)
- Renders `DISCLAIMERS.FORWARD_LOOKING` and `DISCLAIMERS.JURISDICTION`
- Shows migration status (all three: pending) with high-risk badges

### Brand Documentation
`docs/brand-system.md` now includes:
- Master logo definition (double-T serif, gold on white/ivory)
- Logo variant guide (6 variants, use restrictions)
- Trademark status section (™ mark, sub-licensing restriction)
- Legacy domain brand alignment table

---

## Quarterly Review Schedule

| Date | Review Type | Trigger |
|---|---|---|
| 2026-07-27 | Q3 Legacy Domain Review | 90-day post-audit review |
| 2026-10-27 | Q4 Legacy Domain Review | 180-day check-in |
| On completion of C1 | Unity Token compliance gate | Legal memo received |
| On completion of C3 | Xchange compliance gate | License analysis received |
| On completion of A1–A3 | Full content refresh | All evidence items resolved |

---

## References

- Site audit scope: 3 legacy domains (troptions.org, troptionsxchange.io, troptions-unitytoken.com)
- Legacy source registry: [`src/content/troptions/legacySourceRegistry.ts`](../../src/content/troptions/legacySourceRegistry.ts)
- Legacy claim registry: [`src/content/troptions/legacyClaimRegistry.ts`](../../src/content/troptions/legacyClaimRegistry.ts)
- Migration notice registry: [`src/content/troptions/migrationNoticeRegistry.ts`](../../src/content/troptions/migrationNoticeRegistry.ts)
- Migration page: [`src/app/troptions/migration/page.tsx`](../../src/app/troptions/migration/page.tsx)
- Brand guidance: [`docs/brand-system.md`](../brand-system.md)
- Domain map: [`docs/troptions/troptions-domain-map.md`](troptions-domain-map.md)
- Next actions: [`docs/troptions/troptions-next-actions.md`](troptions-next-actions.md)
