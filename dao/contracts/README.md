# DAO On-Chain Contracts (Polygon)

## L1-native path (recommended)

Governance canonical state lives on TROPTIONS L1 (`governance` crate). Soulbound credentials from genesis brand issuers provide vote weight. No EVM gas required for proposals/votes.

## Polygon stubs (optional)

For KENNY/EVL treasury escrow on Polygon, deploy:

- `GovernorBravo` — proposal threshold, voting period
- `TimelockController` — execution delay

ABIs after compile: `contracts/polygon/abis/GovernorBravo.json`, `TimelockController.json`

Existing treasury module: `contracts/polygon/modules/TreasuryManager.sol`

Phase 2: wire passed L1 proposals to Timelock `queue()` via relayer.
