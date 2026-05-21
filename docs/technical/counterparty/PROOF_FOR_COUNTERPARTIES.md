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

## Explicitly PENDING (say out loud)

- **XRPL gateway** `rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3` — documented in repo; **balances/trust lines not verified** in this package → [Bithomp explorer](https://bithomp.com/explorer/rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3)
- **Exchange desk $175M** — operator attestation / PDF only; **do not cite as on-chain fact**
- **Stellar issuer wallets** — listed in registry; horizon proof PENDING
- **Some Cloudflare origins** (`twin.unykorn.org`, `x402api`) — re-probe before demo; 522/timeouts observed
- **L1 BFT** — single-node sovereign sequencer today; not multi-validator mainnet

---

## Engineering maturity (honest)

**9.2 / 10** — Polygon contracts and genesis-world mainnet proofs lift on-chain score; XRPL/Stellar and partial live HTTP keep the gap. Breakdown: `FINAL_ECOSYSTEM_AUDIT.md` § Honest Scorecard (9.2).

---

## Attach with BUILD_AVID email

1. This file  
2. `BUILD_AVID_ON_TROPTIONS.md`  
3. `ON_CHAIN_PROOF.md`  
4. Optional: `docs/technical/investor/ONE_PAGER.md`
