# XRPL Platform

## Overview

Troptions includes an XRPL platform layer for institutional market data, AMM and DEX monitoring, route simulation, issued-asset review, trustline visibility, and approval-gated execution readiness.

This layer is split into two operational modes:

- Layer 1: live XRPL market data, AMM/DEX monitoring, quotes, charts, and route simulation.
- Layer 2: future live trading and execution readiness, blocked behind legal, custody, provider, compliance, signer, and board approvals.

## What The XRPL Platform Does

- Read-only market-data terminal for XRPL DEX, AMM, and pathfinding views.
- Order-book monitoring using XRPL Offers and `book_offers` concepts.
- AMM pool visibility for documented XRPL liquidity pairs.
- Issued asset registry and trustline review.
- Pathfinding quote simulation with spread, slippage, fee, route risk, liquidity risk, issuer risk, freeze risk, and trustline risk.
- Testnet lab for unsigned OfferCreate and Payment payloads only.
- Mainnet readiness gates and external-signer requirements.
- Dependency security controls for xrpl.js.

## Read-Only Now

- XRPL live market data
- XRPL DEX order-book monitoring
- XRPL AMM pool monitoring
- Issued asset review
- Trustline review
- Dependency inspection
- Official docs and GitHub links

## Testnet-Only Now

- Unsigned OfferCreate payload generation
- Unsigned Payment payload generation
- Route quote simulation
- Testnet execution lab workflows

## Blocked On Mainnet

- OfferCreate submission
- Payment submission
- AMMCreate submission
- AMMDeposit submission
- AMMWithdraw submission
- Any mainnet wallet signing inside the app
- Private-key import
- Seed import
- Family-seed import
- Mnemonic import
- Automated live trading

## AMM / DEX Feature List

- XRPL Offers
- `book_offers` order-book monitoring
- AMM pool monitoring
- LP token visibility
- Issued asset registry
- Trustline registry
- Pathfinding quote simulation
- Cross-currency route analysis
- Testnet unsigned payload generation
- Mainnet readiness gating

## Dependency Security Note

Troptions includes an xrpl.js dependency security guard. The following compromised versions are blocked if detected:

- 4.2.1
- 4.2.2
- 4.2.3
- 4.2.4
- 2.14.2

If `xrpl` is not installed, Troptions stays in adapter and registry mode without adding the package automatically.

## External Signer Requirement

Troptions does not sign XRPL transactions inside the app. Production execution requires an external signer and explicit approval gates for legal, custody, provider, compliance, signer, and board workflows.

## Official Links

- XRPL Docs: https://xrpl.org/
- XRPL DEX Docs: https://xrpl.org/docs/concepts/tokens/decentralized-exchange/offers
- XRPL AMM Docs: https://xrpl.org/docs/concepts/tokens/decentralized-exchange/automated-market-makers
- `book_offers` Docs: https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/book_offers
- XRPL Faucets / Testnet: https://xrpl.org/resources/dev-tools/xrp-faucets
- xrpl.js GitHub: https://github.com/XRPLF/xrpl.js
- xrpl.js Security Note: https://xrpl.org/blog/2025/vulnerabilitydisclosurereport-bug-apr2025
- Troptions GitHub: https://github.com/FTHTrading/Troptions