# TROPTIONS RWA Provider Adapter Registry

## What Are RWA Adapters?

The TROPTIONS RWA Provider Adapter Registry is a provider-neutral architecture for real-world asset
(RWA), tokenized treasury, onchain credit, and institutional asset infrastructure. It documents
which provider categories TROPTIONS is designed to interface with, and exactly what is required
before any live integration can occur.

**These are NOT official partnerships.** An adapter record means TROPTIONS has designed
provider-neutral integration readiness for that category — not that a contract, credential, or
relationship exists with any named provider.

---

## Registry Structure

Each adapter record contains:

- `providerId` — unique identifier (`rwa-ondo`, `rwa-maple`, etc.)
- `displayName` — human-readable provider name
- `category` — one of 11 `RwaProviderCategory` values
- `currentTroptionsStatus` — one of 10 `RwaAdapterStatus` values
- `capabilityStatus` — one of 9 `RwaCapabilityStatus` values
- `executionEnabled: false` — literal type, always false for all adapters
- `hasProviderContract`, `hasCredentials`, `hasLegalReview`, `hasComplianceApproval` — all false
- `allowedPublicLanguage` — approved safe public language
- `blockedPublicLanguage` — phrases that MUST NOT appear in public copy
- `riskNotes` — internal risk notes
- `officialReferenceUrl` — link to the third-party's own public documentation

---

## All 12 Provider Adapter Records

| Provider | Category | Status |
|---|---|---|
| Ondo Finance | Tokenized Treasury | reference_only |
| Maple Finance | Institutional Credit | reference_only |
| Centrifuge | RWA Tokenization Platform | reference_only |
| Securitize | Compliance / Transfer Agent | reference_only |
| BlackRock BUIDL (via Securitize) | Tokenized Money Market | reference_only |
| Franklin Templeton BENJI | Tokenized Money Market | reference_only |
| Figure Markets | RWA Tokenization Platform | reference_only |
| Provenance Blockchain | RWA Tokenization Platform | reference_only |
| RWA.xyz | Marketplace Reference | reference_only |
| Chainlink | Oracle / Proof Reference | design_ready |
| Manual Evidence | Manual Evidence | design_ready |
| Internal Reference | Internal Reference | design_ready |

---

## Status Levels

| Status | Meaning |
|---|---|
| `reference_only` | Industry reference adapter only. No integration. |
| `research_only` | Active research but no design work started. |
| `design_ready` | Integration designed. All gates still required before live. |
| `legal_review_required` | Legal review must complete before proceeding. |
| `provider_contract_required` | Provider contract must be signed before proceeding. |
| `credentials_required` | API credentials must be obtained before proceeding. |
| `sandbox_ready` | Provider sandbox access obtained. Not production. |
| `production_ready` | All gates passed. Live execution possible. (0 adapters) |
| `disabled` | Temporarily disabled. |
| `blocked` | Cannot proceed — regulatory, legal, or policy block. |

---

## Path to Production Readiness

To move an adapter from `reference_only` to `production_ready`, ALL of the following must be completed:

1. **Provider Contract** — Signed agreement with the third-party provider
2. **Legal Review** — Legal opinion covering securities law, custody requirements, and regulatory compliance
3. **API Credentials** — Officially obtained API access and credentials from the provider
4. **Compliance Approval** — Internal TROPTIONS compliance team review and approval
5. **Evidence Documentation** — All of the above documented as evidence records

No adapter may claim `production_ready` status without all 5 steps complete.
No adapter may claim `execution_confirmed` capability without real provider confirmation.

---

## Category Descriptions

| Category | Description |
|---|---|
| `tokenized_treasury` | Tokenized US Treasury bills, bonds, and government securities |
| `tokenized_money_market` | Tokenized money market fund shares |
| `institutional_credit` | Institutional lending and credit pools |
| `private_credit` | Private credit and alternative credit pools |
| `rwa_tokenization_platform` | Real-world asset tokenization and servicing |
| `asset_servicing` | Asset lifecycle management and servicing |
| `compliance_transfer_agent` | Regulated compliance and transfer agent services |
| `oracle_proof_reference` | Onchain oracle and proof-of-reserve infrastructure |
| `marketplace_reference` | RWA market data and analytics reference |
| `manual_evidence` | Manual evidence tracking for TROPTIONS operations |
| `internal_reference` | Internal reference and knowledge base records |

---

## Files

| File | Purpose |
|---|---|
| `src/lib/troptions/rwa-adapters/types.ts` | TypeScript types and interfaces |
| `src/lib/troptions/rwa-adapters/providers.ts` | 12 provider adapter records |
| `src/lib/troptions/rwa-adapters/readiness.ts` | Readiness scoring engine |
| `src/lib/troptions/rwa-adapters/compliance.ts` | Compliance records |
| `src/lib/troptions/rwa-adapters/evidence.ts` | Evidence gap tracking |
| `src/lib/troptions/rwa-adapters/claimGuards.ts` | Claim safety enforcement |
