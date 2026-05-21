# Audit Phase 05 — Route & API Map

**Audit Date:** 2026-04-28  
**Auditor:** GitHub Copilot (Read-Only Audit Mode)

---

## 1. Public Pages (src/app/)

### Core Troptions
| Route | File | Description |
|---|---|---|
| `/troptions/live` | `src/app/troptions/live/page.tsx` | Live chain dashboard |
| `/troptions/momentum` | `src/app/troptions/momentum/page.tsx` | Momentum program public page |
| `/troptions/xrpl-stellar-compliance` | `src/app/troptions/xrpl-stellar-compliance/page.tsx` | XRPL/Stellar compliance view |
| `/troptions/institutional/audit-room` | (dynamic) | Institutional audit room |
| `/troptions/institutional/diligence-room` | (dynamic) | Institutional due diligence room |
| `/troptions-live` | `src/app/troptions-live/page.tsx` | Alternate live chain view |
| `/troptions-portal` | `src/app/troptions-portal/page.tsx` | Client portal |
| `/troptions-ai` | `src/app/troptions-ai/page.tsx` | Sovereign AI gateway |

### NIL Platform
| Route | File | Description |
|---|---|---|
| `/troptions-nil/layer1` | `src/app/troptions-nil/layer1/page.tsx` | NIL L1 public dashboard |

### Troptions Cloud
| Route | File | Description |
|---|---|---|
| `/troptions-cloud/[namespace]` | `src/app/troptions-cloud/[namespace]/page.tsx` | Namespace home |
| `/troptions-cloud/[namespace]/ai-infrastructure` | `src/app/troptions-cloud/[namespace]/ai-infrastructure/page.tsx` | AI infrastructure |
| `/troptions-cloud/[namespace]/x402` | `src/app/troptions-cloud/[namespace]/x402/page.tsx` | x402 payments |
| `/troptions-cloud/[namespace]/usage` | `src/app/troptions-cloud/[namespace]/usage/page.tsx` | Usage metering |
| `/troptions-cloud/[namespace]/knowledge-vault` | `src/app/troptions-cloud/[namespace]/knowledge-vault/page.tsx` | Knowledge vault |
| `/troptions-cloud/[namespace]/model-router` | (dynamic) | Model router (3 pre-rendered namespaces) |

### TTN Creator/Media Platform
| Route | Description |
|---|---|
| `/ttn` | TTN platform home |
| `/ttn/creator/*` | Creator submission workflows |
| `/ttn/media/*` | Media content routes |

### Old Money / Legacy
| Route | Description |
|---|---|
| `/troptions-old-money` | Old Money module home |
| `/troptions-old-money/*` | Sub-routes |

---

## 2. Admin Pages (src/app/admin/)

| Route | Description |
|---|---|
| `/admin/troptions` | Master admin dashboard |
| `/admin/troptions/momentum` | Momentum admin |
| `/admin/troptions/control-hub` | Control Hub admin |
| `/admin/troptions/xrpl` | XRPL admin |
| `/admin/troptions/xrpl/amm` | AMM pool admin |
| `/admin/troptions/xrpl/dex` | DEX admin |
| `/admin/troptions/xrpl/trustlines` | Trustlines admin |
| `/admin/troptions/xrpl/accounts` | XRPL accounts admin |
| `/admin/troptions/xrpl-platform` | XRPL platform admin |
| `/admin/troptions/xrpl-platform/*` | XRPL platform sub-routes |
| `/admin/troptions/wallets` | Wallets admin |
| `/admin/troptions/wallets/accounts` | Wallet accounts |
| `/admin/troptions/wallets/balances` | Wallet balances |
| `/admin/troptions/wallets/x402` | Wallet x402 |
| `/admin/troptions/wallets/risk` | Wallet risk |
| `/admin/troptions/chains` | Chains admin |
| `/admin/troptions/chains/evm-trex` | EVM / T-REX admin |
| `/admin/troptions/chains/solana` | Solana admin |
| `/admin/troptions/chains/tron` | Tron USDT admin |
| `/admin/troptions/openclaw` | OpenClaw AI admin |
| `/admin/troptions/openclaw/jefe` | JEFE command admin |
| `/admin/troptions/openclaw/agents` | Agents admin |
| `/admin/troptions/openclaw/rag` | RAG admin |
| `/admin/troptions/openclaw/x402` | OpenClaw x402 admin |
| `/admin/troptions/workflows` | Workflows admin |
| `/admin/troptions/workflows/custody` | Custody workflows |
| `/admin/troptions/workflows/legal` | Legal review workflows |
| `/admin/troptions/workflows/issuance` | Issuance workflows |
| `/admin/troptions/workflows/settlement` | Settlement workflows |
| `/admin/troptions/wallet-forensics` | Wallet forensics |
| `/admin/troptions/wallet-forensics/investigation` | Forensic investigation |
| `/admin/troptions/wallet-forensics/risk` | Forensic risk scoring |
| `/admin/troptions/wallet-forensics/transactions` | Transaction analysis |
| `/admin/troptions-nil/layer1` | NIL L1 admin |

---

## 3. API Routes (src/app/api/)

### Health
| Route | Method | Description |
|---|---|---|
| `/api/health/live` | GET | Liveness probe |
| `/api/health/ready` | GET | Readiness probe |

### IPFS
| Route | Method | Description |
|---|---|---|
| `/api/ipfs/add` | POST | Add content to IPFS |
| `/api/ipfs/health` | GET | IPFS service health |
| `/api/ipfs/pin` | POST | Pin IPFS content |

### Insights / Feed
| Route | Method | Description |
|---|---|---|
| `/api/insights/feed.json` | GET | Insights feed (JSON) |
| `/api/insights/rss.xml` | GET | Insights RSS feed |
| `/api/insights/sitemap.xml` | GET | Insights sitemap |

### Troptions AI
| Route | Method | Description |
|---|---|---|
| `/api/troptions/ai/capabilities` | GET | AI capabilities |
| `/api/troptions/ai/entities` | GET | AI entity list |
| `/api/troptions/ai/knowledge-graph` | GET | Knowledge graph |
| `/api/troptions/ai/llms` | GET | LLM endpoint |
| `/api/troptions/ai/proof-index` | GET | Proof index |
| `/api/troptions/ai/summary` | GET | AI summary |

### Control Hub
| Route | Method | Description |
|---|---|---|
| `/api/troptions/control-hub/audit` | GET | Audit log |
| `/api/troptions/control-hub/recommendations` | GET/POST | Recommendations |
| `/api/troptions/control-hub/state` | GET | Hub state |
| `/api/troptions/control-hub/tasks` | GET/POST | Task queue |

### Alerts & Approvals
| Route | Method | Description |
|---|---|---|
| `/api/troptions/alerts/acknowledge` | POST | Acknowledge alert |
| `/api/troptions/approvals/approve` | POST | Approve task |
| `/api/troptions/approvals/reject` | POST | Reject task |
| `/api/troptions/approvals/request` | POST | Request approval |

### Audit Log
| Route | Method | Description |
|---|---|---|
| `/api/troptions/audit-log/append` | POST | Append audit entry |
| `/api/troptions/audit-log/export` | GET | Export audit log |

### Momentum
| Route | Method | Description |
|---|---|---|
| `/api/troptions/momentum/readiness` | GET | Momentum readiness report |
| `/api/troptions/momentum/claims/evaluate` | POST | Evaluate a momentum claim |
| `/api/troptions/momentum/snapshot` | GET | Momentum snapshot |

### XRPL Ecosystem
| Route | Method | Description |
|---|---|---|
| `/api/troptions/chain/live` | GET | Live chain data |
| `/api/troptions/chains/summary` | GET | Multi-chain summary |
| `/api/troptions/chain-risk/summary` | GET | Chain risk summary |
| `/api/troptions/mint/lp-token` | POST | LP token mint (simulation) |
| `/api/troptions/mint/mpt` | POST | MPT issuance (simulation) |
| `/api/troptions/mint/nft` | POST | NFT mint (simulation) |
| `/api/troptions/mint/tradeline` | POST | Tradeline mint (simulation) |
| `/api/troptions/fund/amm` | POST | AMM fund (simulation) |
| `/api/troptions/fund/wallet` | POST | Wallet fund (simulation) |

### Stellar Ecosystem
| Route | Method | Description |
|---|---|---|
| `/api/troptions/stellar/genesis` | GET/POST | Stellar genesis (simulation) |
| `/api/troptions/stellar/lp` | GET/POST | Stellar LP (simulation) |
| `/api/troptions/stellar-ecosystem/assets` | GET | Stellar asset list |
| `/api/troptions/stellar-ecosystem/simulate/liquidity-pool` | POST | LP simulation |
| `/api/troptions/stellar-ecosystem/simulate/path-payment` | POST | Path payment simulation |
| `/api/troptions/stellar-ecosystem/simulate/trustline` | POST | Trustline simulation |
| `/api/troptions/stellar-ecosystem/status` | GET | Stellar ecosystem status |

### XRPL/Stellar Compliance
| Route | Method | Description |
|---|---|---|
| `/api/troptions/xrpl-stellar-compliance/claim-review` | POST | Claim review |
| `/api/troptions/xrpl-stellar-compliance/controls` | GET | Controls list |
| `/api/troptions/xrpl-stellar-compliance/evaluate` | POST | Evaluate compliance |
| `/api/troptions/xrpl-stellar-compliance/genius/report` | GET | Genius Act readiness |
| `/api/troptions/xrpl-stellar-compliance/iso20022/report` | GET | ISO 20022 readiness |
| `/api/troptions/xrpl-stellar-compliance/jurisdictions` | GET | Jurisdiction matrix |
| `/api/troptions/xrpl-stellar-compliance/snapshot` | GET | Compliance snapshot |

### RWA (Real-World Assets)
| Route | Method | Description |
|---|---|---|
| `/api/troptions/rwa/assets` | GET | RWA asset list |
| `/api/troptions/rwa/intake` | POST | RWA intake (simulation) |

### Stablecoins
| Route | Method | Description |
|---|---|---|
| `/api/troptions/stablecoins/routes` | GET | Stablecoin routes |
| `/api/troptions/stablecoins/summary` | GET | Stablecoin summary |

### JEFE AI
| Route | Method | Description |
|---|---|---|
| `/api/troptions/jefe/command` | POST | Execute JEFE command |
| `/api/troptions/jefe/commands` | GET | List commands |
| `/api/troptions/jefe/route-agent` | GET | Route agent status |
| `/api/troptions/jefe/site-check` | GET | Site health check |
| `/api/troptions/jefe/status` | GET | JEFE status |
| `/api/troptions/jefe/summary` | GET | JEFE summary |
| `/api/troptions/jefe/task-plan` | POST | Task planning |
| `/api/troptions/jefe/wallet-check` | GET | Wallet health |
| `/api/troptions/jefe/x402-check` | GET | x402 readiness check |
| `/api/troptions/jefe/xrpl-check` | GET | XRPL health check |

### OpenClaw AI
| Route | Method | Description |
|---|---|---|
| `/api/troptions/openclaw/agents` | GET | Agent list |
| `/api/troptions/openclaw/audit` | GET | OpenClaw audit |
| `/api/troptions/openclaw/chat` | POST | OpenClaw chat |
| `/api/troptions/openclaw/rag/query` | POST | RAG query |
| `/api/troptions/openclaw/site/check` | GET | Site check |
| `/api/troptions/openclaw/site/draft-fix` | POST | Draft site fix |
| `/api/troptions/openclaw/status` | GET | OpenClaw status |
| `/api/troptions/openclaw/task/approve-request` | POST | Approve task request |
| `/api/troptions/openclaw/task/create` | POST | Create task |
| `/api/troptions/openclaw/task/simulate` | POST | Simulate task |
| `/api/troptions/openclaw/tasks` | GET | Task list |
| `/api/troptions/openclaw/tools` | GET | Tool list |
| `/api/troptions/openclaw/x402/simulate` | POST | x402 simulation |

### Wallets & Finance
| Route | Method | Description |
|---|---|---|
| `/api/troptions/banking/rails` | GET | Banking rails |
| `/api/troptions/conversions/simulate` | POST | Conversion simulation |
| `/api/troptions/cross-rail/readiness` | GET | Cross-rail readiness |
| `/api/troptions/exchange-routes` | GET | Exchange routes |
| `/api/troptions/price` | GET | Asset price |
| `/api/troptions/settlement/simulate` | POST | Settlement simulation |

### Compliance & Risk
| Route | Method | Description |
|---|---|---|
| `/api/troptions/anti-illicit-finance/wallet-risk/simulate` | POST | AML risk simulation |
| `/api/troptions/evm-trex/eligibility/simulate` | POST | EVM T-REX eligibility |
| `/api/troptions/exceptions/resolve` | POST | Resolve exception |
| `/api/troptions/release-gates/status` | GET | Release gate status |
| `/api/troptions/readiness/summary` | GET | Platform readiness |

### SBLC & POF
| Route | Method | Description |
|---|---|---|
| `/api/troptions/sblc/status` | GET | SBLC status |
| `/api/troptions/sblc/submit-package` | POST | SBLC package submission |
| `/api/troptions/pof/status` | GET | Proof of funds status |
| `/api/troptions/pof/submit-evidence` | POST | POF evidence submission |

### Payments
| Route | Method | Description |
|---|---|---|
| `/api/troptions/paxos/rail/simulate` | POST | Paxos rail simulation |
| `/api/troptions/solana/payment-intent/simulate` | POST | Solana payment simulation |

### Other
| Route | Method | Description |
|---|---|---|
| `/api/troptions/clawd/govern` | POST | CLAWD governance |
| `/api/troptions/clawd/plan` | POST | CLAWD planning |
| `/api/troptions/client-portal/access-request` | POST | Portal access request |
| `/api/troptions/client-portal/summary` | GET | Portal summary |
| `/api/troptions/impact/report/simulate` | POST | Impact report |
| `/api/troptions/mcp/tools` | GET | MCP tool list |
| `/api/troptions/narration/synthesize` | POST | Voice narration |
| `/api/troptions/observability/export` | GET | Observability export |
| `/api/troptions/observability/snapshot` | GET | Observability snapshot |
| `/api/troptions/public-benefit/intake` | POST | Public benefit intake |
| `/api/troptions/rag/query` | POST | RAG query |
| `/api/troptions/telecom/send-sms` | POST | SMS send (gated) |

### Troptions Cloud Namespace APIs
| Route | Method | Description |
|---|---|---|
| `/api/troptions-cloud/namespaces/[namespace]/ai-infrastructure` | GET | AI infra by namespace |
| `/api/troptions-cloud/namespaces/[namespace]/ai/simulate-access` | POST | AI access simulation |
| `/api/troptions-cloud/namespaces/[namespace]/ai/simulate-route` | POST | AI routing simulation |
| `/api/troptions-cloud/namespaces/[namespace]/ai/simulate-tool` | POST | AI tool simulation |
| `/api/troptions-cloud/namespaces/[namespace]/ai-x402/snapshot` | GET | AI x402 snapshot |
| `/api/troptions-cloud/namespaces/[namespace]/x402` | GET | x402 status |
| `/api/troptions-cloud/namespaces/[namespace]/x402/simulate-charge` | POST | x402 charge simulation |
| `/api/troptions-cloud/namespaces/[namespace]/x402/usage` | GET | x402 usage |

---

## 4. Route Statistics

| Category | Count |
|---|---|
| Public pages | ~80 |
| Admin pages | ~35 |
| API routes (health/system) | 2 |
| API routes (core Troptions) | ~90 |
| API routes (Cloud namespace) | 8 |
| **Total API routes** | **~100** |
| **Total pages** | **~115** |

---

## 5. Auth Patterns

API routes use the following guard functions (from `src/lib/troptions/requestGuards.ts`):

| Guard | Used On | Protection |
|---|---|---|
| `guardControlPlaneRequest` | Most POST routes | JWT/token auth + rate limiting |
| `guardPortalApiRequest` | Portal routes | Portal-specific auth |
| `guardWalletForensicsApiRequest` | Forensics routes | Forensics auth |
| None (public) | Health checks, GET read endpoints | Open — read-only, no sensitive data |
