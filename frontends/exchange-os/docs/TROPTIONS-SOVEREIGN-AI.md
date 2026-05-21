# Troptions Sovereign AI — System Builder

**Phase 25 | Simulation Only | Control Hub Approval Required**

---

## Overview

Troptions Sovereign AI is the client-specific AI system layer of the Troptions platform. Instead of a shared, generic AI chatbot, each client gets a dedicated AI system built around:

- Their **private namespace** on the Troptions platform
- Their **custom knowledge vault** (documents, policies, FAQs, procedures)
- Their **specific rules** (what the AI can and cannot do)
- Their **workflow tools** (content generation, Q&A, summarization, etc.)
- Their **branded identity** (namespace-scoped, not generic)
- A **proof and audit trail** for every AI action
- **Control Hub approval gates** before any production activation

---

## Architecture

```
Troptions Client Namespace
├── Knowledge Vault          (client documents + sensitivity classification)
├── AI System                (configured from a template, namespace-scoped)
│   ├── Enabled Tools        (what the AI can do)
│   ├── Blocked Tools        (what the AI cannot do)
│   ├── Capabilities         (output types, reasoning modes)
│   └── Knowledge Sources    (linked vault items)
├── Model Router             (provider selection, routing policies)
├── Policy Engine            (pre-execution policy evaluation)
└── Proof + Audit Trail      (Control Hub integration)
```

---

## Data Model

### `TroptionsSovereignAiSystem`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique system identifier |
| `namespaceId` | `string` | Owning Troptions namespace |
| `templateId` | `string` | Template the system was built from |
| `vertical` | `TroptionsSovereignAiVertical` | Industry vertical |
| `status` | `TroptionsSovereignAiStatus` | Current lifecycle status |
| `deploymentMode` | `TroptionsSovereignAiDeploymentMode` | Where/how the model runs |
| `riskLevel` | `TroptionsSovereignAiRiskLevel` | low / medium / high / restricted |
| `enabledTools` | `string[]` | Tools this system is allowed to use |
| `knowledgeSources` | `TroptionsSovereignAiKnowledgeSource[]` | Attached knowledge items |
| `simulationOnly` | `true` | Always true — no live execution |
| `liveExecutionEnabled` | `false` | Always false — blocked platform-wide |
| `externalApiCallsEnabled` | `false` | Always false — no external calls |
| `requiresControlHubApproval` | `true` | Always true |

### `TroptionsSovereignAiTemplate`

Templates define the defaults for a client AI system. Each template specifies:
- Vertical (industry)
- Default enabled tools
- Blocked tools (some blocked permanently by regulation)
- Safety notes (human-readable policy explanations)
- Default deployment mode
- Risk level

### `TroptionsKnowledgeVault`

A namespace-scoped container for all knowledge items. Tracks:
- Allowed sensitivity levels
- Total item count
- Last indexed timestamp
- Which AI systems are permitted to access the vault

### `TroptionsKnowledgeItem`

| Sensitivity Level | Routing Restrictions |
|---|---|
| `public` | External routing allowed |
| `internal` | External routing blocked |
| `confidential` | External routing blocked, requires review |
| `regulated` | No external routing, requires compliance review |
| `healthcare_restricted` | No external routing, no live routing, requires legal + compliance review |
| `financial_restricted` | No external routing, requires compliance review |
| `legal_restricted` | No external routing, requires legal review |

---

## Verticals

| Key | Label |
|---|---|
| `media_production` | Media Production |
| `healthcare_admin` | Healthcare Administration |
| `real_estate_diligence` | Real Estate Diligence |
| `business_growth` | Business Growth |
| `legal_compliance` | Legal & Compliance |
| `entertainment_talent` | Entertainment & Talent |
| `news_publishing` | News & Publishing |
| `enterprise_operations` | Enterprise Operations |
| `education_training` | Education & Training |
| `faith_community` | Faith & Community |
| `nonprofit_advocacy` | Nonprofit & Advocacy |
| `financial_general_info` | Financial (General Info Only) |

---

## Policy Engine

Located at `src/lib/troptions-ai/sovereignAiPolicyEngine.ts`.

The policy engine evaluates every AI system operation request before it is permitted. The `evaluateAiSystemPolicy` function takes a `TroptionsPolicyCheckInput` and returns a `TroptionsPolicyDecision`.

### Always-blocked conditions

- `liveExecutionEnabled: false` — live execution is globally disabled in simulation phase
- `externalApiCallsEnabled: false` — no external API calls
- All decisions include `blockedForLive: true`

### Evaluated conditions (in order)

1. Namespace active check
2. Membership active check
3. AI system status check (must be `approved` or `active`)
4. Control Hub approval check
5. Legal review check (for sensitive operations)
6. Data review check (healthcare + financial verticals always require data review)
7. Model route evaluation (external providers blocked for regulated data)
8. Tool block evaluation (healthcare + financial blocked tools)
9. Vertical-specific restrictions (healthcare always adds extra blockers)
10. Live automation block
11. External API call block
12. Live execution block

---

## Model Router

Located at `src/lib/troptions-ai/modelRouter.ts`.

The model router selects and validates which AI model provider handles a request. All providers are currently `isAvailable: false` — no live model inference occurs.

### Providers (all simulation)

| Provider ID | Label | Type |
|---|---|---|
| `troptions_placeholder` | Troptions AI (Placeholder) | Hosted |
| `openai_placeholder` | OpenAI (Placeholder) | External |
| `anthropic_placeholder` | Anthropic (Placeholder) | External |
| `google_placeholder` | Google AI (Placeholder) | External |
| `ollama_local_placeholder` | Ollama Local (Placeholder) | Local |
| `custom_private_model_placeholder` | Custom Private Model (Placeholder) | Private |

### Routing rules

- Sensitive data (`confidential`, `regulated`, `healthcare_restricted`, `financial_restricted`, `legal_restricted`) is **never routed to external providers**
- Unknown providers are blocked and return `provider: "blocked"`
- `externalApiCallsEnabled: false` blocks all external providers

---

## Global Policies

Eight global policies enforced across all namespaces (from `SOVEREIGN_AI_GLOBAL_POLICIES`):

1. **No Live Execution Without Approval** — Control Hub approval required before any live AI
2. **No External API Calls in Simulation** — External model APIs blocked in simulation phase
3. **Healthcare Data Isolation** — PHI/healthcare data cannot route to external models
4. **Financial Data Isolation** — Financial data cannot route to external models
5. **No Diagnosis or Medical Advice** — Medical diagnosis and treatment planning blocked
6. **No Investment or Securities Advice** — Financial returns and investment tools blocked
7. **Proof Layer for All AI Actions** — Every AI action must log to Troptions proof layer
8. **Legal Review for High-Risk Verticals** — Healthcare and legal verticals require legal review

---

## Routes

### Troptions AI (public section)

| Route | Page |
|---|---|
| `/troptions-ai/sovereign` | Sovereign AI sales / overview page |
| `/troptions-ai/templates` | Browse all 12 templates |
| `/troptions-ai/templates/[templateId]` | Template detail page |

### Troptions Cloud (namespace section)

| Route | Page |
|---|---|
| `/troptions-cloud/[namespace]/sovereign-ai` | Namespace AI systems list |
| `/troptions-cloud/[namespace]/sovereign-ai/new` | New AI system onboarding form |
| `/troptions-cloud/[namespace]/sovereign-ai/[systemId]` | AI system detail + policy gate |
| `/troptions-cloud/[namespace]/knowledge-vault` | Knowledge vault + items table |
| `/troptions-cloud/[namespace]/knowledge-vault/[itemId]` | Knowledge item detail + sensitivity rules |
| `/troptions-cloud/[namespace]/model-router` | Model router overview |
| `/troptions-cloud/[namespace]/ai-policy` | Policy overview |

---

## File Structure

```
src/
├── content/troptions-ai/
│   ├── sovereignAiRegistry.ts       12 templates, 3 systems, 8 global policies
│   └── knowledgeVaultRegistry.ts    8 items, 4 vaults, 7 sensitivity rules
├── lib/troptions-ai/
│   ├── modelRouter.ts               6 providers, 5 routing policies
│   └── sovereignAiPolicyEngine.ts   Pre-execution policy evaluation
├── components/troptions-ai/
│   ├── SovereignAiSystemCard.tsx
│   ├── SovereignAiTemplateCard.tsx
│   ├── KnowledgeVaultTable.tsx
│   ├── ModelRouteBadge.tsx
│   ├── AiPolicyGatePanel.tsx
│   └── ClientAiOnboardingChecklist.tsx
└── app/
    ├── troptions-ai/
    │   ├── sovereign/page.tsx
    │   ├── templates/page.tsx
    │   └── templates/[templateId]/page.tsx
    └── troptions-cloud/[namespace]/
        ├── sovereign-ai/page.tsx
        ├── sovereign-ai/new/page.tsx
        ├── sovereign-ai/[systemId]/page.tsx
        ├── knowledge-vault/page.tsx
        ├── knowledge-vault/[itemId]/page.tsx
        ├── model-router/page.tsx
        └── ai-policy/page.tsx
```

---

## Safety Invariants

The following invariants are enforced in code and tested:

1. All AI systems: `simulationOnly === true`
2. All AI systems: `liveExecutionEnabled === false`
3. All AI systems: `externalApiCallsEnabled === false`
4. All AI systems: `requiresControlHubApproval === true`
5. All knowledge sensitivity rules: `allowLiveAiRouting === false`
6. Healthcare templates: no `medical_diagnosis`, `treatment_planner`, `phi_reader`, `clinical_decision_support` in `defaultEnabledTools`
7. Financial templates: no `investment_advisor`, `financial_returns_calculator`, `securities_router` in `defaultEnabledTools`
8. Policy engine: `liveAutomationRequested: true` always produces a blocker
9. Policy engine: `liveExecutionRequested: true` always produces a blocker
10. Unknown model provider is blocked
11. No template names reference outside ecosystems (no Unykorn, FTH, Jefe, etc.)
12. No private keys, seed phrases, passwords, SSNs, or credentials in mock data

---

## Control Hub Integration

All Troptions Sovereign AI activations, configuration changes, and knowledge vault reviews flow through the Troptions Control Hub (`data/troptions-control-plane/`). No AI system can be activated without an approved Control Hub entry.

See: `docs/runbooks/` for Control Hub operational procedures.

---

*Phase 25 | Troptions Platform | All systems simulation-only*
