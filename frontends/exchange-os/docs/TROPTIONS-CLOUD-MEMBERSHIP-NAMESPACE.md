# Troptions Cloud — Namespace & Membership Access Foundation

## Overview

Troptions Cloud is a multi-workspace platform that provides AI tools, media production, proof vault, healthcare administration, Web3 identity, and business management capabilities exclusively for Troptions community members.

All features operate within the **Troptions ecosystem only**. No outside branding, external ecosystem names, or non-Troptions entities appear anywhere in platform examples, mock data, routes, UI text, or sample records.

---

## Namespaces

A **namespace** is a dedicated workspace within Troptions Cloud. Each namespace has:

- A unique slug beginning with `troptions` (e.g., `troptions-tv`, `troptions-health`)
- A type: `broadcast`, `media`, `health`, `business`, `ai`, `news`, `studio`, `proof`, `enterprise`, or `general`
- An assigned plan (Starter through Enterprise)
- A set of enabled modules
- A status: `active`, `pending_review`, `suspended`, or `archived`
- Two immutable safety flags: `simulationOnly: true` and `liveExecutionEnabled: false`

### Built-in Namespaces

| Slug | Display Name | Type | Plan |
|------|-------------|------|------|
| `troptions` | Troptions Core | general | Professional |
| `troptions-tv` | Troptions TV (TTN) | broadcast | Business |
| `troptions-media` | Troptions Media | media | Creator |
| `troptions-health` | Troptions Health | health | Business |
| `troptions-business` | Troptions Business | business | Business |
| `troptions-ai` | Troptions AI Lab | ai | Professional |
| `troptions-news` | Troptions News | news | Creator |
| `troptions-studios` | Troptions Studios | studio | Business |
| `troptions-proof` | Troptions Proof | proof | Member |
| `troptions-enterprise` | Troptions Enterprise | enterprise | Enterprise |

### Namespace Modules

Each namespace may have any combination of the following 15 modules enabled:

- **AI Studio** — AI writing and content creation tools
- **AI System Builder** — Configurable AI agent system templates
- **Media Studio** — Video, podcast, and content production tools
- **Proof Vault** — Document fingerprinting and IPFS anchoring
- **Healthcare Workspace** — Administrative and education tools (see Healthcare Safety)
- **Business Workspace** — Proposals, documents, and business directory
- **Web3 Identity** — DID scaffolding and wallet address preview
- **Control Hub** — Namespace governance and system approval
- **Education Library** — Educational resources and learning content
- **DeFi Simulation** — Simulated DeFi interface (no real transactions)
- **Wallet Scaffold** — Wallet address formats and preview
- **Opportunity Room** — Business opportunity listings (legal eligibility required)
- **Smart Contract Templates** — Contract template library
- **Audit Log** — Immutable event log
- **Team Management** — Member roles and access control

---

## Membership Plans

Membership tiers define access levels and monthly dues within Troptions Cloud. Membership dues unlock **platform tool access only** — they are not an investment, financial product, or securities offering.

| Tier | Display Name | Monthly Dues |
|------|-------------|-------------|
| Visitor | Troptions Visitor | Free |
| Registered | Registered Member | Free |
| Member | Troptions Member | $49/mo |
| Creator | Troptions Creator | $99/mo |
| Business | Troptions Business | $249/mo |
| Professional | Troptions Professional | $499/mo |
| Enterprise | Troptions Enterprise | Contact |

### What Membership Unlocks

- Access to namespace module tools (AI Studio, Media Studio, Proof Vault, etc.)
- Namespace creation and management
- Team collaboration features
- AI system template access
- Educational library resources

### What Membership Does NOT Guarantee

- Investment returns, yield, or profit
- Access to the Opportunity Room (requires individual legal eligibility review)
- On-chain token issuance or trading
- Clinical healthcare services
- Financial product access

All membership plans carry these permanent safety flags:
```
simulationOnly: true
liveExecutionEnabled: false
liveTradingEnabled: false
liveInvestmentAccessEnabled: false
legalReviewRequiredForOpportunities: true
```

---

## Registration and Onboarding

The onboarding flow consists of three steps:

1. **Create Namespace** — Choose a namespace slug and type from available Troptions namespace templates
2. **Choose Plan** — Select a membership tier appropriate for your intended use
3. **Issue Access** — Review and confirm the access grants for your namespace and plan

All registration, login, and onboarding forms are scaffolded for simulation phase. No accounts are created and no payments are processed in the current release.

---

## AI Studio

The Troptions AI Studio provides 17 content creation tools:

- AI Writer, Blog Generator, Ad Copy Generator, SEO Page Builder
- Email Writer, Proposal Writer, Podcast Script Writer
- Short Film Script Writer, News Article Writer, Voiceover Script Writer
- Social Post Generator, Image Prompt Builder, Transcript Cleaner
- Content Repurposer, Sponsor Pitch Generator, Policy Document Helper
- AI System Planner

All tools are simulation-only and produce no live AI inference output in this phase.

---

## AI System Builder

The AI System Builder provides 11 configurable AI agent system templates for Troptions namespaces. All systems share these invariants:

```
simulationOnly: true
liveExecutionEnabled: false
externalApiCallsEnabled: false
requiresControlHubApproval: true
```

### Available System Templates

| Slug | Category |
|------|----------|
| `troptions-creator-assistant` | content_creation |
| `troptions-media-producer` | media |
| `troptions-podcast-producer` | media |
| `troptions-blog-seo-agent` | content_creation |
| `troptions-business-support-agent` | business |
| `troptions-healthcare-admin-assistant` | healthcare |
| `troptions-document-review-agent` | document |
| `troptions-compliance-checklist-agent` | compliance |
| `troptions-proof-vault-agent` | proof |
| `troptions-sponsor-sales-agent` | business |
| `troptions-control-hub-agent` | governance |

All AI System deployments require **Control Hub approval** before any production activation.

---

## Healthcare Workspace Safety

The Healthcare Workspace is an **administrative and educational resource only**.

### What This Workspace Does NOT Provide

- ✗ Medical diagnosis or clinical assessment
- ✗ Treatment recommendations or clinical guidance
- ✗ Emergency medical guidance (call 911 for emergencies)
- ✗ PHI (Protected Health Information) storage as defined by HIPAA
- ✗ EHR (Electronic Health Records) functionality
- ✗ Medical billing or claims processing
- ✗ Clinical decision support

### HIPAA / BAA Requirement

Any covered entity or business associate wishing to use Troptions Cloud for any purpose touching protected health information must have a signed **Business Associate Agreement (BAA)** on file before use. The platform does not currently accept or process BAAs — this is a future production requirement.

The Healthcare AI System (`troptions-healthcare-admin-assistant`) enforces three mandatory policies:

1. No diagnosis or treatment recommendations
2. No PHI processing or storage
3. No emergency guidance (redirect to emergency services)

---

## Proof Vault

The Proof Vault provides cryptographic document fingerprinting and verifiable proof records. Features include:

- **Document Fingerprinting** — SHA-256 hash generation for proof of existence
- **IPFS Anchoring** (Scaffold) — Hash pinning to IPFS for decentralized storage
- **Timestamp Certificates** — Verifiable timestamps for signed documents
- **Proof Audit Chain** — Immutable audit trail for proof records
- **Proof Verification** — Document-against-fingerprint verification

All Proof Vault operations are simulation-only in this phase.

---

## Web3 Identity

The Web3 Identity workspace provides decentralized identity scaffolding and wallet address preview tools.

### Limitations

- **No token issuance** — Token creation, minting, or any on-chain asset issuance is not enabled
- **Wallet addresses are simulated** — No real wallets are created
- **No live transactions** — No real blockchain operations occur

Supported address format previews: XRPL, EVM (Ethereum/Polygon), Solana

---

## Rust Layer-1 Foundation

Troptions Cloud namespace governance and settlement infrastructure is backed by the Troptions Rust Layer-1 blockchain (`troptions-rust-l1`). The L1 provides:

- On-chain namespace registry (planned)
- Settlement validation
- Audit log anchoring
- Governance and voting
- Quantum-resistant cryptography roadmap

See [architecture.md](architecture.md) and [xrpl-platform.md](xrpl-platform.md) for L1 technical details.

---

## Production Requirements

Before enabling live features in any Troptions Cloud namespace, the following are required:

1. **Control Hub approval** for all namespace activations
2. **Legal review** for any Opportunity Room listings
3. **BAA on file** before healthcare-adjacent features can process any covered data
4. **KYC/AML completion** as required by applicable regulations
5. **Ed25519 signing infrastructure** for on-chain settlement transactions
6. **Production IPFS integration** for Proof Vault live anchoring
7. All safety flags (`simulationOnly`, `liveExecutionEnabled`) must be explicitly unlocked by Control Hub — not editable by namespace owners

---

## Scope Statement

> Troptions Cloud is a Troptions-exclusive platform. All examples, mock data, routes, UI text, sample records, and documentation refer only to the Troptions ecosystem. No outside ecosystem names, brands, or entities appear in any platform content.
