# XRPL & Stellar — Next Phase Roadmap

## Current Status: Simulation-Only Foundation Complete

The simulation-first cross-rail ecosystem layer is now built and tested. The following roadmap
outlines the steps required to advance from simulation-only to testnet, and eventually mainnet.

---

## Phase A — Legal & Compliance Foundation (Pre-requisite for everything)

- [ ] Retain legal counsel with blockchain token offering expertise
- [ ] Legal review of all XRPL and Stellar asset definitions
- [ ] Legal review of NFT issuance terms for TUNI, REC, MMU, MEDIA
- [ ] Legal review of LP participation terms (risk disclosure framework)
- [ ] Anchor/SEP legal review for path payment routes
- [ ] Determine regulatory classification for each asset type per jurisdiction

## Phase B — KYC/KYB Infrastructure

- [ ] Implement holder KYC flow (integrate KYC provider)
- [ ] Implement issuer KYB flow (entity verification)
- [ ] Connect KYC/KYB status to policy engine inputs
- [ ] Build KYC status update webhook handler
- [ ] Audit KYC record storage and access controls

## Phase C — Testnet Operations

- [ ] Provision XRPL testnet issuer accounts
- [ ] Provision Stellar testnet issuer accounts
- [ ] Issue TSU and TXC as test tokens on XRPL testnet
- [ ] Establish test trustlines for GNGS, HOTRCW
- [ ] Create HOTRCW AMM pool on XRPL testnet
- [ ] Issue TSU and TXC on Stellar testnet
- [ ] Create GNGS/HOTRCW liquidity pools on Stellar testnet
- [ ] Test path payment routes between TSU ↔ TXC

## Phase D — NFT Infrastructure

- [ ] Define NFT metadata schema (JSON-LD or XRPL-compatible)
- [ ] Build metadata hosting (IPFS or permissioned storage)
- [ ] Testnet NFT mint for TUNI
- [ ] Testnet NFT mint for REC, MMU, MEDIA
- [ ] Legal sign-off on NFT metadata and underlying rights

## Phase E — Gate Removal (Mainnet Readiness)

For each asset, the following must be completed before `liveMainnetAllowedNow` or
`publicNetworkAllowedNow` can be set to `true`:

- [ ] KYB approved for issuing entity
- [ ] Legal review signed off
- [ ] Testnet operations validated
- [ ] Risk disclosures published
- [ ] Operator approval recorded in Control Hub
- [ ] Security audit of signing key management
- [ ] `isLiveMainnetExecutionEnabled` / `isLivePublicNetworkEnabled` enabled by authorised operator

## Phase F — Cross-Rail Bridge

- [ ] Design XRPL ↔ Stellar asset bridge (locked-issue model)
- [ ] Legal review of bridge mechanism and cross-border transfer implications
- [ ] Security audit of bridge logic
- [ ] Testnet bridge operation
- [ ] Mainnet bridge gate removal

## Timeline

No timeline is committed. All phases depend on legal review completion and regulatory clarity.
The platform will not advance past simulation without completing Phase A.

## Non-Goals

The following will NOT be built under this roadmap:

- Algorithmic stablecoins or yield-bearing tokens
- Guaranteed return products
- Leverage or margin products
- Anonymous or pseudonymous-only operations (all require KYC)
