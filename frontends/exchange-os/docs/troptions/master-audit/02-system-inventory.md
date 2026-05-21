# Audit Phase 02 — Full System Inventory

**Audit Date:** 2026-04-28  
**Auditor:** GitHub Copilot (Read-Only Audit Mode)

> **Safety Notice:** This report does not provide legal, tax, investment, or compliance advice. All system components described are readiness scaffolding. Live payment activation, token sale activity, public offering activity, custody claims, banking claims, and investment claims require separate legal/compliance approval.

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database | SQLite (better-sqlite3) / PostgreSQL (configurable via `TROPTIONS_DB_ADAPTER`) |
| Runtime | Node.js 22 |
| Deploy target | Netlify (`@netlify/plugin-nextjs`) |
| Rust workspace | Cargo workspace (28 crates) |
| Test runner | Jest (TypeScript) + Cargo test (Rust) |
| CI/CD | GitHub Actions (`netlify.yml`) |
| Path alias | `@/` → `src/` |

---

## 2. Core Application Modules

### 2.1 Troptions Core (src/lib/troptions/)
The main business logic library. ~130 TypeScript engine files.

| Engine | Purpose | Safety Status |
|---|---|---|
| `chainLiveData.ts` | Read-only XRPL/Stellar public API fetch | No private keys — public RPC only |
| `controlHubStateStore.ts` | In-memory + persisted Control Hub state | Write-gated by env flag |
| `controlPlanePersistence.ts` | SQLite/Postgres control plane persistence | Adapter-configurable |
| `db.ts` / `databaseAdapter.ts` | Database abstraction layer | `getControlPlaneDb()` is synchronous |
| `deploymentGates.ts` | Release gate enforcement | Production lockdown controls |
| `mintingEngine.ts` | Minting templates (unsigned) | Simulation-only, no signing |
| `xrplGenesisEngine.ts` | XRPL genesis setup templates | Unsigned transaction templates |
| `stellarGenesisEngine.ts` | Stellar genesis setup templates | Unsigned transaction templates |
| `xrplMainnetReadinessGate.ts` | XRPL mainnet activation gate | Live execution blocked |
| `x402ReadinessEngine.ts` | x402 payment protocol readiness | `simulationOnly: true` |
| `jefeEngine.ts` | JEFE AI command orchestration | Simulation / task planning |
| `openClawBridge.ts` | OpenClaw AI agent bridge | Simulation / read-only |
| `walletForensicsEngine.ts` | Wallet forensics analysis | Read-only analysis |
| `auditLogEngine.ts` | Immutable audit log | Append-only |
| `releaseGateEngine.ts` | Release gate state machine | Blocks live execution |
| `antiIllicitFinanceEngine.ts` | AML / risk screening | Simulation-only |
| `complianceScreenEngine.ts` | Compliance screening | Simulation-only |
| `treasuryEngine.ts` | Treasury operation templates | Simulation-only |
| `settlementOpsEngine.ts` | Settlement operations | Simulation-only |
| `rwaOperationsEngine.ts` | Real-world asset operations | Simulation-only |
| `sblcEngine.ts` | SBLC/standby letter of credit | Requires approval gates |
| `pofEngine.ts` | Proof of funds handling | Requires approval gates |
| `workflowEngine.ts` | Multi-step workflow orchestration | Governed by approval engine |

### 2.2 Momentum Compliance System (src/lib/troptions/momentum/)

| Component | Description |
|---|---|
| `momentumComplianceEngine.ts` | 6 evaluation functions — claim evaluation, readiness, snapshot |
| `src/content/troptions/momentum/momentumRegistry.ts` | 7 program phases, 9 compliance gates, 6 disclosures, 10 prohibited claims, 5 allowed claims |
| `MOMENTUM_SAFETY` constants | `livePaymentsEnabled: false`, `blockchainExecutionEnabled: false`, `x402SimulationOnly: true` |

### 2.3 NIL (Name, Image, Likeness) System

| Component | Description |
|---|---|
| `src/lib/troptions-nil/l1NilBridge.ts` | TypeScript representation of Rust NIL protocol |
| `src/lib/troptions-nil/nilControlHubBridge.ts` | NIL Control Hub integration |
| `SIMULATION_ONLY: true` | Hardcoded — no live payments, no NFT mints, no Web3 anchoring |
| Rust crate `tsn-nil` | 10 modules: agent, compliance, errors, governance, identity, proof, receipt, signals, types, valuation |

### 2.4 XRPL/Stellar Compliance System

| Component | Description |
|---|---|
| `src/lib/troptions/xrpl-stellar/xrplPolicyEngine.ts` | XRPL policy evaluation |
| `src/lib/troptions/xrpl-stellar/stellarPolicyEngine.ts` | Stellar policy evaluation |
| `src/lib/troptions/xrpl-stellar/xrplStellarControlHubBridge.ts` | Cross-chain Control Hub bridge |
| `src/lib/troptions/xrpl-stellar-compliance/` | 5 compliance modules (Genius Act, global policy, ISO 20022, Stellar issuer, compliance bridge) |
| Cross-rail governance | All operations return `CrossRailGovernanceDecision` with `simulationOnly: true` |

### 2.5 Troptions Cloud (src/lib/troptions-cloud/)

| Component | Description |
|---|---|
| `namespaceX402PolicyEngine.ts` | Namespace x402 payment policy evaluation |
| `namespaceAiAccessPolicyEngine.ts` | AI access control per namespace |
| `namespaceAiX402ControlHubBridge.ts` | x402 metering bridge |
| `namespaceAiX402Types.ts` | Shared cloud types |
| Safety | `simulationOnly: true`, `livePaymentsEnabled: false` — always |

### 2.6 Troptions AI (src/lib/troptions-ai/)

| Component | Description |
|---|---|
| `modelRouter.ts` | AI model routing logic |
| `sovereignAiPolicyEngine.ts` | Sovereign AI policy enforcement |

---

## 3. Content Registry System (src/content/troptions/)

~100 TypeScript registry files. All are static, typed, compiled data — no runtime side effects.

Key registries:

| Registry | Description |
|---|---|
| `actionRegistry.ts` | Platform actions catalog |
| `alertRegistry.ts` | Alert definitions |
| `assetRegistry.ts` | Asset definitions |
| `claimRegistry.ts` | Platform claims and validations |
| `controlHubRegistry.ts` | Control Hub task/recommendation templates |
| `disclaimerRegistry.ts` | Required legal disclaimers |
| `entityRegistry.ts` | Entity (person/org) registry |
| `exchangeRouteRegistry.ts` | Exchange routing definitions |
| `fundingReadiness.ts` | Funding readiness gates |
| `glossary.ts` | Platform terminology |
| `investorReadiness.ts` | Investor readiness status |
| `issuanceReadiness.ts` | Issuance readiness gates |
| `jefeCommandRegistry.ts` | JEFE AI command catalog |
| `jurisdictionRegistry.ts` | Multi-jurisdiction rule set |
| `legacyClaimRegistry.ts` | Deprecated claim catalog (for migration) |
| `legalReviewQueue.ts` | Pending legal review items |
| `momentumRegistry.ts` | Momentum program definition |
| `proofRegistry.ts` | Proof-of-funds registry |
| `readinessScoring.ts` | System readiness scoring |
| `releaseGateRegistry.ts` | Release gate definitions |
| `riskMatrix.ts` | Risk assessment matrix |
| `riskLanguageRules.ts` | Prohibited risk language rules |
| `roleRegistry.ts` | RBAC role definitions |
| `rwaRegistry.ts` | Real-world asset registry |
| `sblcRegistry.ts` | SBLC product definitions |
| `settlementReadiness.ts` | Settlement readiness status |
| `stablecoinIssuerRegistry.ts` | Stablecoin issuer definitions |
| `stellarEcosystemRegistry.ts` | Stellar ecosystem parameters |
| `stellarIssuerControlRegistry.ts` | Stellar issuer control settings |
| `tradingRiskRegistry.ts` | Trading risk classification |
| `walletInventoryRegistry.ts` | Wallet inventory (public addresses only) |
| `xrpl*Registry.ts` | Multiple XRPL ecosystem registries |

---

## 4. Test Suite Summary

| Test File | Suite | Status |
|---|---|---|
| `momentumComplianceEngine.test.ts` | Momentum program compliance | ✅ 63/63 passing |
| `l1NilBridge.test.ts` | NIL L1 TypeScript bridge | ✅ 52/52 passing |
| `xrplStellarInstitutionalCompliance.test.ts` | XRPL/Stellar compliance controls | ✅ 48/48 passing |
| `controlHub.test.ts` | Control Hub state | Not run this session |
| `controlHubPersistence.test.ts` | Control Hub persistence | Not run this session |
| `controlPlane.test.ts` | Control plane operations | Not run this session |
| `controlPlaneApi.integration.test.ts` | Control plane API integration | Not run this session |
| `envValidation.test.ts` | Environment variable validation | Not run this session |
| `executionReadiness.test.ts` | Execution readiness gates | Not run this session |
| `ipfsIntegration.test.ts` | IPFS integration | Not run this session |
| `jefeApi.test.ts` | JEFE API | Not run this session |
| `jefeDashboard.test.ts` | JEFE dashboard | Not run this session |
| `jefePolicyGuard.test.ts` | JEFE policy guard | Not run this session |
| `openClawApi.test.ts` | OpenClaw API | Not run this session |
| `openClawIntegration.test.ts` | OpenClaw integration | Not run this session |
| `openClawPolicyGuard.test.ts` | OpenClaw policy guard | Not run this session |
| `phase11PortalApi.integration.test.ts` | Portal API phase 11 | Not run this session |
| `phase11PortalSafety.test.ts` | Portal safety phase 11 | Not run this session |
| `phase12AiSearchAgentic.test.ts` | AI search / agentic | Not run this session |
| `phase12McpRag.test.ts` | MCP RAG | Not run this session |
| `phase12TradingX402Telecom.test.ts` | Trading / x402 / telecom | Not run this session |
| `phase13MultichainRwaStablecoin.test.ts` | Multi-chain / RWA / stablecoin | Not run this session |
| `phase13PublicBenefitAntiIllicit.test.ts` | Public benefit / AML | Not run this session |
| `phase7Security.test.ts` | Security phase 7 | Not run this session |
| `phase9DataObservability.test.ts` | Data / observability phase 9 | Not run this session |
| `termGuards.test.ts` | Term guard validation | Not run this session |
| `ttnSubmissions.test.ts` | TTN creator submissions | Not run this session |
| `walletForensics.test.ts` | Wallet forensics | Not run this session |
| `walletForensicsApi.test.ts` | Wallet forensics API | Not run this session |
| `xrplFundsFlowAnalyzer.test.ts` | XRPL funds flow analysis | Not run this session |
| `xrplLivePlatform.test.ts` | XRPL live platform | Not run this session |
| `xrplPlatformApi.test.ts` | XRPL platform API | Not run this session |
| `xrplStellarEcosystem.test.ts` | XRPL/Stellar ecosystem | Not run this session |
| `assetProvisioning.test.ts` | Asset provisioning | Not run this session |
| `claimGuards.test.ts` | Claim guard validation | Not run this session |
| `sovereignAi.test.ts` | Sovereign AI | Not run this session |
| `namespaceAiX402.test.ts` | Namespace AI/x402 | Not run this session |
| `namespaceMembership.test.ts` | Namespace membership | Not run this session |
| Rust NIL (`tsn-nil`) | Rust NIL protocol | ✅ 39+12=51 passing |

**Focused test total (this session): 163 tests passing, 0 failures**

---

## 5. Public Asset Files (public/)

| File | Description |
|---|---|
| `ai.txt` | AI capability declaration for discovery |
| `llms.txt` | LLM discovery endpoint |
| `troptions-capabilities.json` | Platform capabilities manifest |
| `troptions-entity-map.json` | Entity map (public) |
| `troptions-genesis.json` | Genesis document |
| `troptions-genesis.locked.json` | Locked genesis (IPFS pinned) |
| `troptions-genesis-release.json` | Genesis release verification |
| `troptions-knowledge.json` | Knowledge vault (public) |
| `troptions-proof-index.json` | Proof index (public) |
