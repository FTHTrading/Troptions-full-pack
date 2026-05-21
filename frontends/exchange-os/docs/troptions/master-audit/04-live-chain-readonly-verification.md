# Audit Phase 04 — Live Chain Read-Only Verification

**Audit Date:** 2026-04-28  
**Auditor:** GitHub Copilot (Read-Only Audit Mode)

> **Safety Notice:** No blockchain execution was performed during this audit. All chain interactions in this section are passive reads from public APIs. This section documents the platform's read-only chain monitoring architecture. Live payment activation, token sale activity, and public offering activity require separate legal/compliance approval before enablement.

---

## 1. Chain Data Architecture

The platform's live chain data layer is implemented in `src/lib/troptions/chainLiveData.ts`.

### Design Principles

- **Public-only endpoints** — XRPL cluster RPC (`https://xrplcluster.com`) and Stellar Horizon (`https://horizon.stellar.org`) — no API keys required
- **Read-only RPC calls only** — `account_info`, `account_lines`, `account_nfts`, `account_offers`, `amm_info`, etc.
- **No private key access** — addresses are embedded as string constants; no signing material present
- **Next.js cache-revalidated** — all fetch calls use `next: { revalidate: 60 }` for 60-second staleness
- **Graceful degradation** — all fetch functions return `null` on error; UI handles offline state

---

## 2. XRPL Read Operations (Supported)

| RPC Method | Description |
|---|---|
| `account_info` | Account balance, flags, sequence number |
| `account_lines` | Trustline balances (IOU holdings) |
| `account_nfts` | NFT holdings on account |
| `account_offers` | Open DEX offers |
| `amm_info` | AMM pool state (asset balances, LP tokens) |
| `gateway_balances` | Issuer gateway balance summary |

All above are **read-only ledger queries**. No submit/sign methods are used.

---

## 3. Stellar Read Operations (Supported)

| Horizon Endpoint | Description |
|---|---|
| `/accounts/{id}` | Account balances and flags |
| `/accounts/{id}/offers` | Open DEX offers |
| `/liquidity_pools` | Stellar AMM (liquidity pool) data |

All above are **read-only Horizon API queries**. No transaction submission is used.

---

## 4. Live State at Audit Time

The following reflects the architecture's state, not necessarily the live chain state (which would require a live API call).

### Transaction Activity This Session
- **Zero live mainnet transactions** submitted in this session
- All provisioning runs in `data/treasury-funding-log.json` are `mode: "dry-run"`, `status: "simulated"`
- The `scripts/provision-troptions-assets.mjs` and `scripts/fund-treasury-wallets.mjs` scripts were run in dry-run/simulation mode only

### Account State (Architecture-Level)
| Account | Expected Live State | Source |
|---|---|---|
| XRPL Issuer `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` | Exists — genesis-era account | Public docs confirm activation |
| XRPL Distributor `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` | Exists — genesis-era account | Public docs confirm activation |
| Stellar Issuer `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` | Exists | Public docs confirm activation |
| Stellar Distributor `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC` | Exists | Public docs confirm activation |

> **Readiness Note:** The actual live account state (reserves, trustlines, offers, AMM pools) can only be verified via a live chain API call and should be confirmed by the operator before any live operations.

---

## 5. Execution Gates — What is Blocked

The following operations are **actively blocked** at compile-time constants and runtime guards:

| Operation | Blocked By | Gate Value |
|---|---|---|
| Live XRP payment submission | `LIVE_EXECUTION_ENABLED = false` | `chainLiveData.ts` |
| Live Stellar transaction submission | `LIVE_EXECUTION_ENABLED = false` | Stellar genesis engine |
| NFT minting | `LIVE_NFT_MINT_ENABLED = false` | NIL bridge + mint engine |
| MPT issuance | Release gate | `releaseGateEngine.ts` |
| AMM pool creation | Release gate + approval | `xrplAmmEngine.ts` |
| DEX offer submission | External signer gate | `xrplExternalSignerGate.ts` |
| x402 live payment | `livePaymentsEnabled = false` | `x402ReadinessEngine.ts` |
| x402 namespace charges | `livePaymentsEnabled = false` | `namespaceX402PolicyEngine.ts` |
| NIL deal settlement | `LIVE_PAYMENT_ENABLED = false` | `l1NilBridge.ts` |
| NIL Web3 anchoring | `LIVE_WEB3_ANCHOR_ENABLED = false` | `l1NilBridge.ts` |
| SBLC issuance | Approval gate required | `sblcEngine.ts` |
| Proof-of-funds submission | Approval gate required | `pofEngine.ts` |

---

## 6. Live Dashboard Route

The chain live dashboard is accessible at:
- Frontend: `/troptions/live` and `/troptions-live` 
- API: `/api/troptions/chain/live` (GET, public read)

The `/api/troptions/chain/live` route fetches from XRPL RPC and Stellar Horizon in real-time, returning account states and AMM data. No auth required for read.

---

## 7. Readiness Assessment

| Item | Status | Action Required |
|---|---|---|
| XRPL read-only dashboard | Architecture complete | Verify accounts active on live chain |
| Stellar read-only dashboard | Architecture complete | Verify accounts active on live chain |
| AMM pool read | Architecture complete | AMM pool not yet seeded |
| Live execution gates | All gates CLOSED | Legal/compliance review before opening |
| x402 live payments | Simulation-only | Legal/compliance review before enabling |
| Mainnet provisioning | Requires operator action | External signer + legal approval needed |
