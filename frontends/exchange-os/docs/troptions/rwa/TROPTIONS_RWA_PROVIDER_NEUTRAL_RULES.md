# TROPTIONS RWA Provider-Neutral Rules

## The 6 Critical Rules (Absolute — Never Override)

### Rule 1: No Partnership Claims Without Signed Contract
TROPTIONS MUST NOT claim to be partnered with, affiliated with, or officially integrated with
any named RWA provider unless a signed provider contract evidence record exists.

Blocked language: "partnered with", "official partner", "in partnership with", "strategic partner",
"integrated with", "powered by", "affiliated with"

### Rule 2: No Asset Backing Claims Without Evidence
TROPTIONS MUST NOT claim any form of asset backing, custody, or collateralization without title,
custody documents, appraisal, audit records, and legal opinion evidence.

Blocked language: "backed by", "asset-backed", "collateralized by", "secured by real assets",
"holds assets", "custody of", "custodian for", "title holder"

### Rule 3: No Live Execution Claims (executionEnabled: false always)
All RWA adapters have `executionEnabled: false` as a literal type. This cannot be overridden in
code. Any claim of live execution, real-time settlement, or payment processing via a named
provider is blocked.

Blocked language: "live execution", "real-time settlement", "instant transfer", "moves money",
"sends payments via", "processes transactions with"

### Rule 4: No False Regulatory Status Claims
TROPTIONS is NOT a registered investment adviser, broker-dealer, bank, licensed money transmitter,
FINRA member, or SEC-registered entity.

Blocked language: "SEC registered", "SEC approved", "licensed bank", "FDIC insured",
"FINRA member", "money transmitter", "registered transfer agent"

### Rule 5: No FTH / FTHX / FTHG References in RWA Copy
No RWA adapter record, public page, or API response may reference FTH, FTHX, FTHG, or
Future Tech Holdings in any form.

### Rule 6: production_ready Requires All Four Gates
An adapter may only reach `production_ready` status when ALL of the following exist:
- Signed provider contract evidence record (`hasProviderContract: true`)
- API credentials obtained (`hasCredentials: true`)
- Legal review completed (`hasLegalReview: true`)
- Compliance approval granted (`hasComplianceApproval: true`)

---

## Approved Public Wording

Use this exact statement on all public-facing content about TROPTIONS RWA:

> TROPTIONS is building provider-neutral readiness for real-world asset, tokenized treasury,
> onchain credit, and institutional asset infrastructure. Third-party products, custody,
> execution, and settlement require approved provider relationships, credentials, compliance
> review, and legal approval.

---

## Safe Language Patterns

These patterns are safe to use in public copy:

- "TROPTIONS is designed with provider-neutral adapter readiness for [category]"
- "TROPTIONS maintains research into [category] infrastructure"
- "TROPTIONS is building readiness to interface with [category] systems when all requirements are met"
- "[Provider] is a leading provider in the [category] space. TROPTIONS tracks readiness to interface with this category."
- Use only the `allowedPublicLanguage` field from each adapter record for provider-specific copy

---

## Partnership Claim Requirements

To make any public partnership claim about a provider, ALL of the following must exist:

1. `hasProviderContract: true` — signed contract evidence record
2. `hasLegalReview: true` — legal review completed
3. `hasComplianceApproval: true` — compliance team approval
4. `canClaimPartnership: true` — computed flag in readiness engine

No adapter currently meets these requirements. `canClaimPartnership` is false for all 12 adapters.

---

## Evidence Requirements Before ANY Public Mention

Even for reference-only adapters, public mention must:

- Use only `allowedPublicLanguage` from the adapter record
- Not appear in any phrase from `blockedPublicLanguage`
- Pass `blockUnsafeRwaClaim()` evaluation (must return `isSafe: true`)
- Not use provider logos without explicit written permission
- Include the standard disclaimer on public-facing pages

---

## Standard Public Disclaimer

Include on all public-facing RWA pages:

> TROPTIONS is not a registered investment adviser, broker-dealer, bank, licensed money transmitter,
> or transfer agent. Third-party providers referenced here are industry-reference examples of their
> respective categories. No partnership with any named provider is implied or claimed. All live
> integrations require signed provider agreements, legal review, regulatory compliance, and credentials.
