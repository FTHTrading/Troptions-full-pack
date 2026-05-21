# Troptions Cloud — Namespace AI + x402 Readiness Audit

**Date:** 2026-04-28  
**Status:** Simulation-only. No live payments, no live AI calls, no PHI.

---

## 1. Existing Namespace Features

| Feature | File | Status |
|---|---|---|
| Namespace registry (10 slugs: troptions, troptions-tv, troptions-media, troptions-health, troptions-business, troptions-ai, troptions-news, troptions-studios, troptions-proof, troptions-enterprise) | `src/content/troptions-cloud/namespaceRegistry.ts` | ✅ |
| Namespace layout + sidebar nav | `src/app/troptions-cloud/[namespace]/layout.tsx` | ✅ |
| Namespace switcher component | `src/components/troptions-cloud/TroptionsNamespaceSwitcher.tsx` | ✅ |
| Membership registry (tiers: visitor → enterprise) | `src/content/troptions-cloud/membershipRegistry.ts` | ✅ |
| Namespace-level pages: ai, ai/systems, ai-policy, knowledge-vault, model-router, sovereign-ai, healthcare, business, proof, audit, team, settings | `src/app/troptions-cloud/[namespace]/*/page.tsx` | ✅ |

## 2. Existing AI Infrastructure Features

| Feature | File | Status |
|---|---|---|
| AI System Registry (templates: Creator, Compliance, Healthcare, Business) | `src/content/troptions-cloud/aiSystemRegistry.ts` | ✅ |
| Safety invariants: simulationOnly, liveExecutionEnabled=false, externalApiCallsEnabled=false | aiSystemRegistry.ts | ✅ |
| Sovereign AI system builder pages | `src/app/troptions-cloud/[namespace]/sovereign-ai/` | ✅ |
| Model router page (UI shell) | `src/app/troptions-cloud/[namespace]/model-router/page.tsx` | ✅ |
| AI policy page (UI shell) | `src/app/troptions-cloud/[namespace]/ai-policy/page.tsx` | ✅ |

## 3. Existing Knowledge Vault Features

| Feature | File | Status |
|---|---|---|
| Knowledge vault pages (list + item view) | `src/app/troptions-cloud/[namespace]/knowledge-vault/` | ✅ |
| Knowledge source type in AI system registry | aiSystemRegistry.ts → `TroptionsKnowledgeSource` | ✅ (type only) |
| No live vault query engine | — | ❌ Missing |

## 4. Existing x402 / Payment / Usage Features

| Feature | File | Status |
|---|---|---|
| x402 readiness engine (report + dry-run intent) | `src/lib/troptions/x402ReadinessEngine.ts` | ✅ |
| x402 content registry (capabilities, blocked actions) | `src/content/troptions/x402Registry.ts` | ✅ |
| OpenClaw x402 engine | `src/lib/troptions/openClawX402Engine.ts` | ✅ |
| Wallet x402 engine | `src/lib/troptions/walletX402Engine.ts` | ✅ |
| **No per-namespace x402 configuration** | — | ❌ Missing |
| **No usage metering / credit ledger per namespace** | — | ❌ Missing |
| **No membership-plan-to-action mapping** | — | ❌ Missing |

## 5. Existing Control Hub Persistence Integration Points

| Feature | File | Status |
|---|---|---|
| Control Hub task records | `src/lib/troptions/controlHubStateStore.ts` | ✅ |
| Control Hub simulation records | controlHubStateStore.ts | ✅ |
| Control Hub blocked action records | controlHubStateStore.ts | ✅ |
| Control Hub audit records | controlHubStateStore.ts | ✅ |
| Control Hub recommendation records | controlHubStateStore.ts | ✅ |
| SQLite persistence via `getControlPlaneDb()` | `src/lib/troptions/db.ts` | ✅ |
| Postgres durable store adapter | `src/lib/troptions/databaseAdapter.ts` | ✅ |
| XRPL/Stellar Control Hub bridge | `src/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge.ts` | ✅ |
| **No AI + x402 Control Hub bridge** | — | ❌ Missing |

## 6. Missing Pieces

| Missing | Priority |
|---|---|
| Per-namespace AI infrastructure profile (workspace enabled, model providers, tool access, data residency) | HIGH |
| Per-namespace x402 readiness config (simulation mode, credit ledger, usage metering, membership mapping) | HIGH |
| AI access policy engine (evaluates model routes, tool access, healthcare safety, external call blocks) | HIGH |
| x402 policy engine (evaluates actions against membership plan, records simulated charges) | HIGH |
| Control Hub bridge for AI + x402 simulations | HIGH |
| API routes: ai-infrastructure, x402, usage, simulate-charge, simulate-access, simulate-route, simulate-tool, snapshot | HIGH |
| UI: NamespaceAiX402Panel, AI Infrastructure Card, x402 Usage Panel, Model Routing Panel, Knowledge Vault Access Panel | MEDIUM |
| Pages: ai-infrastructure, x402, usage per namespace | MEDIUM |
| Admin panel: all-namespace AI/x402 status overview | MEDIUM |
| Tests: all safety invariants | HIGH |
| Docs: architecture, policy, safety, integration report | MEDIUM |

## 7. Safety Risks

| Risk | Mitigation |
|---|---|
| External AI API calls | `externalApiCallsEnabled: false` hardcoded in all profiles |
| Live x402 payments | `livePaymentsEnabled: false`, `simulationOnly: true` hardcoded |
| Healthcare diagnosis / PHI | Healthcare namespace explicitly blocks diagnosis, treatment, PHI intake, emergency guidance |
| Private key / seed intake | No input fields for secrets; types exclude them |
| Live wallet movement | No settlement calls in any new code |
| Membership plan bypass | Policy engine checks plan before any AI or usage action |
| Audit trail gaps | Every decision routes through Control Hub bridge |

## 8. Recommended Implementation Order

1. Types (`namespaceAiX402Types.ts`) — foundation for everything
2. AI infrastructure registry — defines per-namespace AI config
3. x402 registry — defines per-namespace payment/usage config
4. AI access policy engine — evaluation logic
5. x402 policy engine — evaluation logic
6. Control Hub bridge — persistence layer
7. API routes — expose simulation endpoints
8. UI components + pages
9. Admin panel
10. Navigation updates
11. Documentation
12. Tests
13. Validation (tsc + jest + build)
