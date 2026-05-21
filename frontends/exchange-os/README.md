# Troptions

Institutional Operating System for Digital Assets, Real-World Asset Evidence, Settlement Readiness, and Governance-Controlled Infrastructure.

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Institutional Infrastructure](https://img.shields.io/badge/Institutional-Infrastructure-071426)
![Proof-Gated](https://img.shields.io/badge/Proof-Gated-2f5f4f)
![Control Plane](https://img.shields.io/badge/Control-Plane-233044)
![CI Policy Gates](https://img.shields.io/badge/CI-Policy%20Gates-C9A24A)

## 🏛 Executive Overview

Troptions is an institutional operating system for digital assets, real-world asset evidence, custody coordination, settlement readiness, and proof-gated financial infrastructure.

Troptions does not ask institutions to believe a story. Troptions gives them a ledger, a proof room, a custody map, a control plane, and a board-approved release process.

## 🧭 System Map

Claims & Advertising Control
→ Proof Room
→ Asset Intake
→ Workflow Readiness
→ Operational Control Plane
→ Authenticated API Actions
→ Persistent Audit Trail
→ Key Rotation & Operator Security
→ Deployment Readiness
→ Observability & Incident Response
→ Postgres Cutover Tooling

## 🎨 Brand System

| Token | Hex | Use |
|---|---|---|
| Deep Navy | #071426 | headers, hero sections |
| Ink Black | #0B0B0D | body text, dark panels |
| Institutional Gold | #C9A24A | dividers, icons, premium accents |
| Muted Gold | #A8873D | secondary accents |
| Ivory | #F7F2E8 | background |
| Paper White | #FFFDF8 | report-style cards |
| Slate | #233044 | borders, subtext |

## 🧱 Infrastructure Layers

🟦 L1 — Institutional Website  
🟨 L2 — Claim Registry  
🟩 L3 — Proof Room  
🟧 L4 — RWA Intake  
🟥 L5 — Compliance & Legal Gates  
🟪 L6 — Workflow Readiness  
⬛ L7 — Operational Control Plane  
🟫 L8 — Audit Logs & Signed Exports  
🟦 L9 — Observability  
🟨 L10 — Postgres Cutover

## 🔐 Control Plane

- Role-based permissions
- Approvals
- Workflow transitions
- Exceptions
- Release gates
- Audit hash chain
- Signed audit exports
- Operator security
- MFA-aware actions
- Deployment gates

## 📊 Observability

- Structured logs
- Metrics
- Escalation policies
- Incident drills
- Retention policies
- Smoke checks
- Postgres durable observability

## 🧪 Validation Status

- TypeScript passing
- Jest passing (109 tests)
- Build passing
- Lint warnings only
- Policy gates passing
- Env validation passing

## XRPL Platform

- Public XRPL platform: /troptions/xrpl-platform
- XRPL links and docs: /troptions/xrpl-platform/links
- Portal XRPL platform: /portal/troptions/xrpl-platform
- Admin XRPL control: /admin/troptions/xrpl-platform
- Detailed docs: docs/xrpl-platform.md

The XRPL platform is market-data, AMM/DEX monitoring, route-simulation, and execution-readiness infrastructure only. Mainnet execution is blocked by default, testnet payloads remain unsigned, and production flows require external signer plus legal, custody, compliance, provider, signer, and board approvals.

## 🚀 Local Development

```bash
npm install
npm run typecheck
npm test
npm run lint
npm run build
```

## 🩺 Health Checks

- GET /api/health/live
- GET /api/health/ready

## 🛡 Security Notice

This repository must never contain secrets, private keys, API tokens, seed phrases, bank credentials, custody credentials, or production .env files.

## ⚖ Legal / Compliance Notice

Troptions is informational and operational infrastructure only. Nothing in this repository is legal advice, tax advice, investment advice, banking activity, custody service, broker-dealer activity, exchange activity, or an offer to sell securities. All asset, funding, custody, stable unit, settlement, and investor workflows are subject to legal review, licensing review, KYC/KYB, AML, sanctions screening, provider approval, jurisdiction restrictions, and board approval.

