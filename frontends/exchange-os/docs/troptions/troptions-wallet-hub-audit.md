# TROPTIONS Wallet Hub Audit

Date: 2026-04-28
Scope: Existing wallet, rail, treasury, and ledger assets relevant to a TROPTIONS Wallet Hub implementation.

## Existing Wallet Pages
- Current public wallet surface exists at `src/app/troptions/wallets/page.tsx`.
- Existing wallet UI already uses TROPTIONS branding and shows XRPL + Stellar wallet cards.
- Existing wallet mint path requested for review (`src/app/troptions/wallet-mint/page.tsx`) is not present in current repo.
- Existing verification content exists at `src/app/troptions/verification/page.tsx` with issuance proof and escrow patterns.

## Existing Registries and Data Sources
- XRPL wallet inventory: `src/content/troptions/xrplWalletInventoryRegistry.ts`.
- Stellar wallet inventory: `src/content/troptions/stellarWalletInventoryRegistry.ts`.
- Wallet showcase source used by current wallets page: `src/content/troptions/demoWalletShowcaseRegistry.ts`.
- XRPL issued assets and issuance transaction references in notes: `src/content/troptions/xrplIouRegistry.ts`.
- x402 registries exist: `src/content/troptions/x402Registry.ts`, `src/content/troptions/walletX402Registry.ts`, `src/content/troptions/openClawX402Registry.ts`.
- Treasury registries exist: `src/content/troptions/treasuryRegistry.ts`, `src/content/troptions/treasuryTopologyRegistry.ts`.

## Existing Engines and Capabilities
- Client wallet generation exists in `src/lib/troptions/clientWalletEngine.ts`.
- Important risk note: `clientWalletEngine` currently returns generated wallet seed/secret in responses (one-time display model) for onboarding flow.
- Existing wallet and ledger abstractions exist in multiple engines (`walletLedgerEngine`, `walletSendEngine`, `walletX402Engine`, `x402ReadinessEngine`).
- Existing x402 readiness stack already marks live x402 as gated/blocked unless approval controls are passed.

## Live vs Read-Only Capability Baseline
- Existing site messaging and engines already emphasize simulation-only and approval-gated execution for sensitive actions.
- Existing wallet pages are informational/read-only and do not expose direct live send actions.
- Existing API patterns support metadata snapshots and controlled command-style POST actions with legal/compliance checks.

## Missing Pieces for Wallet Hub Goal
- No consolidated TROPTIONS Wallet Hub registry that separates:
  1. XRPL issued-asset rail
  2. Stellar mirror/distribution rail
  3. x402 rails
  4. internal ledger balances
  5. pending/simulated transfers
- No dedicated wallet-hub engine that models transfer intents, validation states, approval stages, and receipt/statement generation in one place.
- No dedicated `/troptions/wallet-hub` page with Genesis/Treasury/Wallet/Card/x402/Mesh/Pay/Sign sections and simulation-first transfer UX.
- No dedicated wallet-hub API routes for snapshot, simulation, approval request, and receipt generation.
- No dedicated gated transfer script for explicit env-controlled live XRPL send workflow.

## Security Risks and Controls
- Risk: accidental enabling of live transfers without full legal/compliance/operator gates.
  - Control: enforce simulation default, explicit env flag gates, and operator confirmation.
- Risk: key/seed leakage in logs or API payloads.
  - Control: reject and sanitize seed/privateKey/mnemonic/secretKey in request/response paths; never persist secrets.
- Risk: ambiguous UX between simulated and live transfer states.
  - Control: mandatory transfer status model, blocked reasons, and explicit disabled live-sign actions until all gates pass.
- Risk: unsupported public claims about issuer backing or official issuer status.
  - Control: preserve existing safety disclaimers and avoid unsupported "official issuer" claims.

## Blocked / Deferred Items
- True live transfer execution remains blocked by policy until legal/compliance/runtime signer controls are approved.
- Stellar live asset send requires secure signer integration and additional operational controls not currently provisioned.
- Any custodial workflow remains out of scope; wallet hub must remain non-custodial metadata/simulation-first by default.
