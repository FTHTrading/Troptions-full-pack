# Architecture

## System Architecture

The implementation is split into five layers:

1. Shared TypeScript domain layer in `src/lib/troptions/genius`.
2. Content registry in `src/content/troptions/geniusControlTowerRegistry.ts`.
3. Next App Router API routes in `src/app/api/genius/**`.
4. Dashboard route in `src/app/troptions/genius-control-tower/page.tsx` with a sandbox-only simulator client component.
5. Rust core crate in `troptions-rust-l1/crates/troptions-genius-core` for pure gate and readiness logic.

## Data Flow

1. Mock profile, gates, partners, and namespaces are defined in the shared TypeScript layer.
2. Registry aggregates overview, readiness scores, merchant-settlement map, and export packet content.
3. API routes expose overview, gates, partners, action evaluation, evidence, regulator packet, merchant-settlement map, and simulation-only mint/redemption.
4. Dashboard reads registry data and calls the simulation endpoints for interactive sandbox output.
5. Rust crate mirrors the live gate logic with pure functions and unit tests.

## Compliance Gates

The system requires explicit gates for legal counsel, board approval, regulator approval, reserve policy, reserve custody, reserve attestation, redemption policy, AML/BSA, sanctions, KYC/KYB, chain analytics, smart contract audit, cybersecurity, incident response, disclosures, marketing, RWA review, and tax/accounting review.

## API Routes

- `GET /api/genius/overview`
- `GET /api/genius/gates`
- `POST /api/genius/evaluate-action`
- `GET /api/genius/partners`
- `GET /api/genius/evidence`
- `POST /api/genius/simulate-mint`
- `POST /api/genius/simulate-redemption`
- `GET /api/genius/regulator-packet`
- `GET /api/genius/merchant-settlement-map`

## Dashboard Modules

- Executive overview
- Credit union/CUSO advantage map
- Stablecoin vs tokenized deposit comparison
- Compliance gate matrix
- Sandbox stablecoin simulator
- Partner registry
- Merchant settlement map
- RWA/private-market guardrail section
- Export packet section

## Partner Registry

Mock partner categories include credit union partner, CUSO partner, PPSI partner, reserve custodian, KYC/KYB provider, AML/sanctions provider, chain analytics provider, legal counsel, audit/attestation provider, and cybersecurity provider.