# Proof for Counterparties (Bijan / Avid package)

**Tone:** Links and verifiable facts only — no hype.  
**Configure guide:** [`BUILD_AVID_ON_TROPTIONS.md`](BUILD_AVID_ON_TROPTIONS.md)

---

## Polygon — verified mainnet (2026-05-21)

- **KENNY** `0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7` — [PolygonScan](https://polygonscan.com/token/0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7) — 100M supply; repo: `contracts/polygon/KennyToken.sol`
- **EVL** `0xAFe185415D21671704EFaa5696dD219ACEB9fdA3` — [PolygonScan](https://polygonscan.com/token/0xAFe185415D21671704EFaa5696dD219ACEB9fdA3) — 250M supply; repo: `contracts/polygon/EvolveToken.sol`
- **FTH token pages** — live on `https://fthedu.unykorn.org` (operator-verified UI shows contracts above)
- **Genesis World (9 contracts)** — table + links: [`../GENESIS_POLYGON_CONTRACTS.md`](../GENESIS_POLYGON_CONTRACTS.md) · repo: https://github.com/FTHTrading/genesis-world
- **drunks.app** — https://drunks.app (Genesis X402 app on Polygon)
- **Canonical proof table** — [`../ON_CHAIN_PROOF.md`](../ON_CHAIN_PROOF.md)

---

## Monorepo — code and local stack

- **Troptions-full-pack** — https://github.com/FTHTrading/Troptions-full-pack
- **Quickstart** — `scripts/quickstart.ps1` · **8 PM2 services** documented in `FINAL_ECOSYSTEM_AUDIT.md`
- **Rust L1** — `l1/` · `cargo test --workspace` passes (audit 2026-05-21)
- **Investor / docs site** — https://fthtrading.github.io/Troptions-full-pack/

---

## x402 / Apostle (live health — separate from Avid core path)

- **x402 health** — https://x402.unykorn.org/health (truth label CONFIRMED)
- **UnyKorn-X402-aws** — https://github.com/FTHTrading/UnyKorn-X402-aws
- Optional branch `feature/x402-full-integration` — see BUILD_AVID § limitations; not required for Avid go-live

---

## XRPL & Stellar — verified issued supply (2026-05-21)

- **Production issuer** `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` · **distribution** `rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt` · **AMM** `rBU6exSQHkrTog6n1F5RX8gzcUrXoniGcp` — live on XRPL mainnet
- **Stellar issuer** `GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4` · **distribution** `GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC`
- **Cross-chain issued supply (ledger, not market cap):** TROPTIONS ~200M, USDC **274M**, USDT 200M, EURC 100M, DAI 100M (~874M total)
- Full tables: [`../XRPL_STELLAR_VERIFICATION.md`](../XRPL_STELLAR_VERIFICATION.html)

## Explicitly PENDING or deprecated (say out loud)

- **Legacy gateway** `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` — README/.env only; **superseded** by production issuer `rJLMST…`
- **Bootstrap** `rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3` — deprecated genesis wallet
- **Exchange desk $175M** — operator attestation only; **do not cite as on-chain fact** — use **274M USDC issued on ledger**
- **Some Cloudflare origins** (`twin.unykorn.org`, `x402api`) — re-probe before demo; 522/timeouts observed
- **L1 BFT** — single-node sovereign sequencer today; not multi-validator mainnet

---

## Engineering maturity (honest)

**9.5 / 10** — Polygon, genesis-world, and XRPL/Stellar issued-supply proofs verified; intermittent Cloudflare origins (`twin`, `x402api`) keep the gap. Breakdown: `FINAL_ECOSYSTEM_AUDIT.md` § Honest Scorecard.

---

## Attach with BUILD_AVID email

1. This file  
2. `BUILD_AVID_ON_TROPTIONS.md`  
3. `ON_CHAIN_PROOF.md`  
4. Optional: `docs/technical/investor/ONE_PAGER.md`
