# TROPTIONS Next Build Tickets

**Created:** 2025-01-27  
**Source:** TROPTIONS_BUILD_REALITY_AUDIT.md  
**Priority:** P1 = blocks live operations / security risk | P2 = required for production | P3 = quality / completeness

These tickets represent the honest gap between current scaffold state and a production-ready system. Each ticket has a clear definition of done based on provable code behavior — not claims.

---

## Security (P1 — Fix Before Any Live Users)

### SEC-001 — Replace SHA-256 password hashing with bcrypt/argon2
**Priority:** P1  
**File:** `src/lib/auth/db.ts`  
**Problem:** Passwords are hashed with `crypto.createHash('sha256')`. SHA-256 is a fast general-purpose hash, not a password KDF. A stolen `data/auth.db` can be cracked trivially with GPU rainbow tables.  
**Definition of Done:**
- Install `bcryptjs` (pure JS, no native deps) or `argon2`
- `createUser()` stores `bcrypt.hash(password, 12)` or `argon2.hash(password)`
- `verifyPassword()` uses `bcrypt.compare()` or `argon2.verify()`
- Migration script hashes any existing plain/sha256 passwords on next login (force re-hash on successful old-format login)
- Zero SHA-256 password code remains

### SEC-002 — API token rotation and expiry
**Priority:** P1  
**File:** `src/proxy.ts`  
**Problem:** Bearer token comparison is static — no expiry, no rotation mechanism.  
**Definition of Done:**
- API tokens stored in `data/auth.db` with `issued_at` and `expires_at` columns
- `/api/troptions/auth/token` endpoint to issue + revoke tokens
- `proxy.ts` validates token against DB, rejects expired tokens
- Admin UI to list/revoke active API tokens

---

## Database & Persistence (P2)

### DB-001 — Persistent user account model
**Priority:** P2  
**Problem:** Users can register/login but there is no `accounts` table linking users to blockchain addresses, wallet balances, or namespace access. The portal shows wallet data from a static registry with no per-user personalization.  
**Definition of Done:**
- `data/auth.db` gains `accounts` table: `(id, user_id, namespace_id, xrpl_address, stellar_address, created_at)`
- Session → account binding: authenticated routes can call `getAccountForSession(sessionId)`
- Wallet dashboard reads from account record, not static registry
- At minimum: account creation on first login with null addresses (addresses provisioned in XRPL-001)

### DB-002 — Transaction and balance persistence
**Priority:** P2  
**Problem:** No transaction history is ever persisted. All balances are static mock data. There is no source of truth for what any user holds.  
**Definition of Done:**
- `transactions` table: `(id, account_id, chain, asset, amount, direction, status, chain_tx_id, created_at)`
- `balances` table: `(account_id, chain, asset, amount, last_updated_at)`
- Balance reads in `/api/troptions/wallet/balances` query this table (fall back to mock if no record)
- All confirmed inbound/outbound transactions write a row

### DB-003 — Auth database backup strategy
**Priority:** P2  
**Problem:** `data/auth.db` is local SQLite — lost on server wipe.  
**Definition of Done:**
- Daily `data/auth.db` backup script (copy to `data/backups/auth-YYYY-MM-DD.db`)
- Or: migration to Postgres (`DATABASE_URL` is already wired in `postgresAdapter.ts`)
- Backup retention: 30 days minimum

---

## XRPL / Stellar Live Operations (P2)

### XRPL-001 — Real account provisioning flow
**Priority:** P2  
**Problem:** The XRPL genesis engine can configure an issuer account and create IOUs, but there is no user-facing flow to provision a TROPTIONS wallet on XRPL for a new member.  
**Definition of Done:**
- `POST /api/troptions/xrpl/accounts/provision` — creates funded XRPL testnet account for authenticated user
- Writes xrpl_address to user's account record (DB-001)
- Trustline to TROPTIONS issuer automatically set
- Returns address + initial funding status
- Gated behind `GENESIS_ADMIN_KEY` (already in place)

### XRPL-002 — Live balance reads from XRPL
**Priority:** P2  
**Problem:** `walletLedgerEngine.ts` reads from a static registry. No live XRPL account queries are wired to the wallet dashboard.  
**Definition of Done:**
- `getAccountInfo()` in `xrplGenesisEngine.ts` is already implemented — wire it to wallet dashboard
- `GET /api/troptions/wallet/balances` calls `getAccountInfo(xrplAddress)` for authenticated user's address
- Falls back to cached balance in DB if XRPL RPC is unavailable
- Testnet first; mainnet behind separate env flag

### STELLAR-001 — Live Stellar account provisioning
**Priority:** P2 (same as XRPL-001 but for Stellar)  
**Definition of Done:**
- `POST /api/troptions/stellar/accounts/provision` — creates Stellar testnet account
- Sets TROPTIONS trustline automatically
- Writes stellar_address to user account record

---

## Financial Operations (P2)

### FIN-001 — Real transfer backend with ledger persistence
**Priority:** P2  
**Problem:** `POST /api/troptions/wallet/send` is currently a mock endpoint. No actual transfer is submitted to any chain.  
**Definition of Done:**
- When `TROPTIONS_XRPL_MINT_MODE=live` (or new `TROPTIONS_TRANSFER_MODE=live`), route constructs and submits real XRPL Payment transaction
- Requires sender to have a keypair on record (encrypted at rest, never logged)
- Writes transaction row to DB on success (DB-002)
- Returns `{ ok: true, txHash, explorerUrl }` on success
- Simulation mode (default) continues to work with no env var change

### FIN-002 — Escrow state persistence
**Priority:** P2  
**Problem:** Escrow state machine exists but state is in-memory only — escrow is lost on server restart.  
**Definition of Done:**
- `escrows` table: `(id, parties, asset, amount, status, created_at, completed_at)`
- All state transitions write to DB
- `GET /api/troptions/escrow/:id` reads from DB

### FIN-003 — Treasury live reads
**Priority:** P3  
**Problem:** Treasury data comes from `data/treasury-funding-log.json` (static file).  
**Definition of Done:**
- Treasury route optionally calls XRPL/Stellar account balance for the issuer address
- Static JSON used as fallback when live read is unavailable
- Adds `source: "live" | "cached"` to response

---

## Compliance & KYC (P2)

### COMP-001 — Wire live KYC provider
**Priority:** P2 (required before accepting real users)  
**Problem:** KYC engine is in shadow mode — all KYC checks pass without verification.  
**Definition of Done:**
- Choose a provider: Persona, Jumio, Onfido, or similar
- Set `KYC_PROVIDER_API_KEY` in env
- `kycOnboardingEngine.ts` calls provider API for document verification
- Failed KYC blocks account activation
- Results stored (status + provider reference ID, not raw PII)

### COMP-002 — OFAC / sanctions list screening
**Priority:** P2 (regulatory requirement for US-based financial operations)  
**Problem:** Compliance screen engine runs in shadow mode — OFAC screening does not actually block anyone.  
**Definition of Done:**
- Wire Chainalysis or Elliptic API (`CHAINALYSIS_API_KEY` env var already referenced in code)
- Block wallet funding/transfer for addresses on OFAC SDN list
- Log all screening results with wallet address, result, timestamp
- Admin dashboard to review flagged accounts

---

## Namespace & Membership (P3)

### NS-001 — On-chain namespace ownership anchoring
**Priority:** P3  
**Problem:** Namespace registry is a TypeScript content file. Namespace "ownership" is not cryptographically enforced — anyone with code access can add/remove namespaces.  
**Definition of Done:**
- Choose anchoring mechanism: XRPL NFT (one NFT per namespace, held by owner's address), or IPFS + hash commitment
- `namespaceRegistry.ts` gains an `anchorTxId` field per namespace
- `GET /api/troptions/namespace/:slug/verify` checks the anchor on-chain
- New namespace creation flow mints the anchor token

### NS-002 — Member-to-namespace access control
**Priority:** P2  
**Problem:** Any authenticated user can view any namespace. There is no per-namespace access gating.  
**Definition of Done:**
- `namespace_members` table: `(namespace_id, account_id, role, granted_at)`
- Namespace pages check membership before rendering sensitive data
- Admin namespace owner can invite/remove members

---

## Rust L1 (P3 — Long-term)

### RUST-001 — Consensus implementation milestone
**Priority:** P3  
**Problem:** All consensus functions return "Not implemented in scaffold phase." The Rust L1 is a scaffold.  
**Definition of Done (milestone 1):**
- Block proposal logic produces blocks from pending transactions
- Validator signature aggregation (even with a single validator for testnet)
- `GET /status` returns real block height that increments on transaction submission
- Node binary stays running and accepts transactions

### RUST-002 — Asset ledger state
**Priority:** P3  
**Problem:** Runtime marks all subsystems `simulation_only: true`. TROPTIONS token balances are not tracked in the Rust runtime.  
**Definition of Done:**
- `crates/assets` tracks account balances in a RocksDB or sled store
- `POST /tx` with a valid signed transfer mutates balances
- `GET /account/:address` returns real balance from store

---

## Production Readiness (P2 before launch)

### PROD-001 — Environment secrets management
**Priority:** P2**  
**Problem:** `GENESIS_ADMIN_KEY`, `STELLAR_ISSUER_SECRET`, etc. are expected as raw env vars. No secrets rotation, no audit trail for secret access.  
**Definition of Done:**
- All secrets loaded via a secrets manager (Vercel Environment Variables for Vercel, or Doppler/AWS Secrets Manager for self-hosted)
- Secrets never appear in logs or error messages
- `env-secrets.txt` file in repo root is removed or gitignored

### PROD-002 — Vercel / Cloudflare deployment validation
**Priority:** P2  
**Problem:** `vercel.json` and `open-next.config.ts` exist but have not been tested in a live deployment since major refactoring.  
**Definition of Done:**
- Successful `vercel deploy --prod` with no build errors
- All 870 pages served correctly
- Auth cookie and proxy middleware function correctly in Vercel Edge environment
- `workers/pdf-host.mjs` deployed and serving PDFs

### PROD-003 — Monitoring and alerting
**Priority:** P3  
**Problem:** No error monitoring, no uptime alerting, no performance tracking.  
**Definition of Done:**
- Sentry (or equivalent) integrated for server-side error capture
- Uptime check on `/api/troptions/readiness/summary`
- Alert on >1% 5xx error rate

---

## Summary Table

| Ticket | Area | Priority | Est. Effort |
|---|---|---|---|
| SEC-001 | Auth | P1 | Small (1 day) |
| SEC-002 | Auth | P1 | Medium (2 days) |
| DB-001 | Database | P2 | Medium (2 days) |
| DB-002 | Database | P2 | Medium (3 days) |
| DB-003 | Database | P2 | Small (1 day) |
| XRPL-001 | Blockchain | P2 | Medium (3 days) |
| XRPL-002 | Blockchain | P2 | Small (2 days) |
| STELLAR-001 | Blockchain | P2 | Medium (3 days) |
| FIN-001 | Finance | P2 | Large (5 days) |
| FIN-002 | Finance | P2 | Small (1 day) |
| FIN-003 | Finance | P3 | Small (1 day) |
| COMP-001 | Compliance | P2 | Large (5 days) |
| COMP-002 | Compliance | P2 | Medium (3 days) |
| NS-001 | Namespace | P3 | Medium (3 days) |
| NS-002 | Namespace | P2 | Medium (2 days) |
| RUST-001 | Rust L1 | P3 | XL (2+ weeks) |
| RUST-002 | Rust L1 | P3 | XL (2+ weeks) |
| PROD-001 | DevOps | P2 | Small (1 day) |
| PROD-002 | DevOps | P2 | Small (1 day) |
| PROD-003 | DevOps | P3 | Small (1 day) |

**P1 items (do before any real users):** SEC-001, SEC-002  
**P2 items (do before live financial operations):** DB-001, DB-002, DB-003, XRPL-001, XRPL-002, STELLAR-001, FIN-001, FIN-002, COMP-001, COMP-002, NS-002, PROD-001, PROD-002  
**P3 items (post-launch quality):** FIN-003, NS-001, RUST-001, RUST-002, PROD-003
