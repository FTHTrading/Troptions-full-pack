# TROPTIONS Exchange OS — Mainnet Readiness Checklist

**Purpose:** Everything required before enabling any mainnet feature flag.

---

## Infrastructure Prerequisites

- [ ] PostgreSQL production database provisioned (replace SQLite)
- [ ] Redis cache deployed (session, queue, rate limiting)
- [ ] BullMQ or equivalent queue system configured (async proof generation, monitoring)
- [ ] Helius primary RPC provisioned with API key
- [ ] Triton or QuickNode fallback RPC provisioned
- [ ] XRPL Clio node or XRPL.org Data API access confirmed
- [ ] Cloudflare R2 bucket provisioned for proof packet storage
- [ ] Sentry or equivalent observability configured (error tracking, alerts)
- [ ] Cloudflare WAF/DDoS rules reviewed and tuned
- [ ] Immutable audit log storage provisioned
- [ ] WebSocket market stream infrastructure deployed

## Security Prerequisites

- [ ] Incident response runbook reviewed and signed off by all committee members
- [ ] Key management policy documented (no private keys in code, env, or logs)
- [ ] Multisig policy documented for treasury/admin wallets
- [ ] Security audit of all Exchange OS admin routes completed
- [ ] Penetration test completed by third-party firm
- [ ] All critical/high audit findings resolved
- [ ] Cloudflare secrets validated (no secrets in wrangler.toml)

## Legal and Compliance Prerequisites

- [ ] Legal counsel review of TROPTIONS Exchange OS operating model completed
- [ ] Legal counsel sign-off on truth labels and non-custodial claims
- [ ] Regulatory position memo for each target jurisdiction
- [ ] Privacy policy updated for data handling
- [ ] Terms of Service reviewed and published
- [ ] AML policy documented

## Partner Prerequisites (per token)

- [ ] NDA executed with partner
- [ ] Entity verification complete (incorporation, authorized signers)
- [ ] KYC/AML screening complete for all beneficial owners
- [ ] Legal memo submitted and reviewed
- [ ] Smart contract / program audit complete (no critical/high findings)
- [ ] Full proof packet assembled and verified
- [ ] Partner agreement executed
- [ ] Launch committee GO issued (unanimous)
- [ ] Public claims reviewed and approved
- [ ] LP lock proof provided

## XRPL Mainnet Prerequisites

- [ ] XRPL_MAINNET_ENABLED=false → change to true ONLY after all above complete
- [ ] XRPL RPC WebSocket connection tested
- [ ] XRPL account_info and amm_info queries tested
- [ ] Issuer domain and xrpl.toml verified for all partner tokens
- [ ] All issuer flags documented in proof packet
- [ ] Unsigned transaction construction tested with XUMM testnet

## Solana Mainnet Prerequisites

- [ ] SOLANA_MAINNET_ENABLED=false → change to true ONLY after all above complete
- [ ] Helius DAS API tested for all partner token mint addresses
- [ ] Mint authority, freeze authority, update authority verified on-chain
- [ ] Token-2022 extensions documented if applicable
- [ ] Jupiter quote API tested for all target pairs
- [ ] Pool address verified on-chain for all partner tokens
- [ ] Unsigned transaction construction tested with Phantom devnet

## Operational Prerequisites

- [ ] On-call rotation defined (at least 2 operators)
- [ ] Monitoring dashboard configured (LP, authority, volume alerts active)
- [ ] Alert thresholds tested (fire and resolve end-to-end)
- [ ] Incident drill completed
- [ ] Rollback procedure documented and tested
- [ ] Partner operator contacts verified

---

## Mainnet Enablement Protocol

Only the Executive Sponsor, with sign-off from Legal Counsel, Compliance Officer, and Technical Lead, may change any mainnet feature flag from false to true.

Changes must be made via Cloudflare secrets — never in code or wrangler.toml.

All flag changes must be logged in the immutable audit log with timestamp, changer, and approval chain.
