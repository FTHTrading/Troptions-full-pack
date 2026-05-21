# Troptions GENIUS Stablecoin Implementation Scan

## Repo Branch / State

- Branch: `main`
- Upstream: `main...origin/main`
- Working tree: dirty before this task. Existing user changes are present in PDFs, scripts, portal pages, wallet-hub routes, and `troptions-rust-l1` workspace files.
- This implementation will avoid reverting unrelated changes.

## Detected Package Manager

- Package manager: `npm`
- Evidence: root `package-lock.json`

## Detected Rust Workspace

- Rust workspace: present at `troptions-rust-l1/Cargo.toml`
- Current workspace already contains simulation-first crates including `stablecoin`, `compliance`, `state`, and `namespaces`.
- Safe plan: add a new optional workspace crate under `troptions-rust-l1/crates/troptions-genius-core` and register it in the existing workspace members list.

## Detected Web / API Structure

- Frontend framework: Next.js App Router (`next@16.2.4`)
- UI runtime: React `19.2.4`
- App root: `src/app`
- API route style: `src/app/api/**/route.ts` using `NextResponse.json(...)`
- TypeScript alias: `@/* -> src/*`
- Test framework: Jest with `ts-jest`
- Existing portal page pattern: lightweight portal scaffolds under `src/app/portal/troptions/**/page.tsx`
- Existing Troptions content/domain pattern: shared logic in `src/lib/troptions/**` and registries in `src/content/troptions/**`

## Safe Implementation Plan

1. Create a shared TypeScript GENIUS domain layer under `src/lib/troptions/genius` for state models, gates, readiness scoring, partner mocks, namespace rules, evidence packet generation, and simulation-only actions.
2. Create mock registries under `src/content/troptions` so the dashboard and API consume the same read-only source of truth.
3. Add Next App Router API routes under `src/app/api/genius/**` that expose readiness, partner data, regulator packets, and sandbox-only simulation endpoints.
4. Add a new dashboard page under `src/app/troptions/genius-control-tower/page.tsx` with explicit blocked-live messaging and export packet visibility.
5. Add a new Rust crate under `troptions-rust-l1/crates/troptions-genius-core` with pure decision/readiness functions and unit tests only.
6. Generate markdown export packets in `docs/troptions/genius-stablecoin/exports/` as static evidence artifacts derived from the mock readiness state.
7. Add Jest tests for the TypeScript domain/API surface and cargo tests for the Rust core.

## Files To Be Created

- `docs/troptions/genius-stablecoin/README.md`
- `docs/troptions/genius-stablecoin/01-architecture.md`
- `docs/troptions/genius-stablecoin/02-credit-union-cuso-strategy.md`
- `docs/troptions/genius-stablecoin/03-stablecoin-vs-tokenized-deposits.md`
- `docs/troptions/genius-stablecoin/04-compliance-gates.md`
- `docs/troptions/genius-stablecoin/05-rwa-private-market-guardrails.md`
- `docs/troptions/genius-stablecoin/06-merchant-settlement-playbook.md`
- `docs/troptions/genius-stablecoin/07-implementation-checklist.md`
- `docs/troptions/genius-stablecoin/99-final-implementation-report.md`
- `docs/troptions/genius-stablecoin/exports/partner-readiness-packet.md`
- `docs/troptions/genius-stablecoin/exports/regulator-readiness-packet.md`
- `docs/troptions/genius-stablecoin/exports/board-approval-packet.md`
- `docs/troptions/genius-stablecoin/exports/merchant-settlement-packet.md`
- `docs/troptions/genius-stablecoin/exports/rwa-guardrail-packet.md`
- `src/lib/troptions/genius/types.ts`
- `src/lib/troptions/genius/gates.ts`
- `src/lib/troptions/genius/readiness.ts`
- `src/lib/troptions/genius/namespace.ts`
- `src/lib/troptions/genius/mockData.ts`
- `src/lib/troptions/genius/evidence.ts`
- `src/lib/troptions/genius/index.ts`
- `src/content/troptions/geniusControlTowerRegistry.ts`
- `src/app/api/genius/overview/route.ts`
- `src/app/api/genius/gates/route.ts`
- `src/app/api/genius/evaluate-action/route.ts`
- `src/app/api/genius/partners/route.ts`
- `src/app/api/genius/evidence/route.ts`
- `src/app/api/genius/simulate-mint/route.ts`
- `src/app/api/genius/simulate-redemption/route.ts`
- `src/app/api/genius/regulator-packet/route.ts`
- `src/app/api/genius/merchant-settlement-map/route.ts`
- `src/app/troptions/genius-control-tower/page.tsx`
- `src/__tests__/troptions/geniusControlTower.test.ts`
- `src/__tests__/troptions/geniusApi.test.ts`
- `troptions-rust-l1/crates/troptions-genius-core/Cargo.toml`
- `troptions-rust-l1/crates/troptions-genius-core/src/lib.rs`
- `troptions-rust-l1/crates/troptions-genius-core/src/models.rs`
- `troptions-rust-l1/crates/troptions-genius-core/src/gates.rs`
- `troptions-rust-l1/crates/troptions-genius-core/src/readiness.rs`
- `troptions-rust-l1/crates/troptions-genius-core/src/risk.rs`
- `troptions-rust-l1/crates/troptions-genius-core/tests/genius_core_tests.rs`

## Files To Be Modified

- `troptions-rust-l1/Cargo.toml` to register the new crate

## Validation Commands

- `npm run typecheck`
- `npm test -- --runInBand genius`
- `npm run lint -- src/app/api/genius src/app/troptions/genius-control-tower src/lib/troptions/genius src/content/troptions/geniusControlTowerRegistry.ts src/__tests__/troptions/genius*.ts`
- `npm run build`
- `cargo test -p troptions-genius-core` from `troptions-rust-l1`
- `cargo fmt --check --manifest-path troptions-rust-l1/Cargo.toml`

## Safety Constraints

- Default mode remains `research_only` or `sandbox_simulation`.
- No live mint, burn, redemption, custody, or money movement paths will be added.
- All simulations must return explicit `simulated_only` / `live blocked` messaging.
- Tokenized deposits remain modeled as a separate lane from payment stablecoins.