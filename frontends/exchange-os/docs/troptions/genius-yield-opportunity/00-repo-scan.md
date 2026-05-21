# Troptions GENIUS Yield Opportunity Repo Scan

## Repo State

- Branch: `main`
- Working tree: dirty before this implementation
- Safe mode: research only, no live issuance, no live yield, no live redemption, no evasion tooling

## Detected Stack

- Package manager: `npm`
- Frontend: Next.js App Router with React 19
- API: Next App Router route handlers under `src/app/api/**/route.ts`
- Tests: Jest with `ts-jest`
- Rust workspace: `troptions-rust-l1`
- Docs root: `docs/`
- Existing namespace and settlement modules: present under `src/content/troptions-cloud`, `src/content/troptions`, and `src/lib/troptions`

## Implementation Plan

1. Add pure TypeScript opportunity-classification modules under `src/lib/troptions-genius-yield/`.
2. Add API routes under `src/app/api/genius-yield/**`.
3. Add dashboard route under `src/app/troptions/genius-yield-opportunity/page.tsx`.
4. Add export packets and documentation under `docs/troptions/genius-yield-opportunity/`.
5. Add Jest tests covering the major classification rules and timing windows.

## Validation Commands

- `npm test -- --runInBand src/__tests__/troptions/geniusYieldEngine.test.ts`
- `npm test -- --runInBand src/__tests__/troptions/geniusApi.test.ts src/__tests__/troptions/geniusControlTower.test.ts`
- `npm run typecheck`
- `npm run lint -- src/lib/troptions-genius-yield src/app/api/genius-yield src/app/troptions/genius-yield-opportunity src/components/troptions-evolution/GeniusYieldOpportunityClient.tsx src/__tests__/troptions/geniusYieldEngine.test.ts`

## Safe-Mode Statement

This engine classifies opportunity and blocks high-risk or prohibited structures. It is not a live issuance, reward, or redemption system.