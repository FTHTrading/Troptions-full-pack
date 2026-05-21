# Current State Audit — CIS/POF Trade Desk Readiness

## Scope
This audit reviews current repository materials relevant to Client/Customer Information Sheet (CIS) and Proof of Funds (POF) readiness for trade desk and lender diligence.

## Files Found

| File | Current Coverage | Gaps | Usable for Bryan/Trade Desk | Remediation Needed |
|---|---|---|---|---|
| docs/troptions/proof-of-funds-request-checklist.md | High-level POF cover letter fields, evidence list, compliance controls, delivery format | No fillable template fields, no pass/fail reviewer workflow, no beneficial ownership section, no source-of-wealth structure, no machine-readable schema | Partial | Add formal POF template, evidence status matrix, source-of-funds/source-of-wealth guidance, schema validation |
| docs/troptions/smart-contract-doc-onboarding-flow.md | Generic onboarding phases and approval gates | No CIS structure, no KYC/KYB data model, no OFAC/sanctions placeholders, no trade desk-specific settlement fields | No | Create dedicated CIS template with required legal/compliance fields and attachment requirements |
| docs/troptions/xrpl-iou-funding-model.md | Route model, XRPL IOU posture, simulation-only legal guardrails, funding route context | Not a CIS/POF intake artifact, lacks client identity/ownership and verifiable funds evidence format | No | Keep as strategy reference only; separate into trade-desk evidence artifacts |
| docs/troptions/pate-coal-rwa-funding-package.md | Detailed asset-readiness package and hard blockers for one asset class | Asset-specific and not reusable as universal trade desk CIS/POF packet | Partial | Add generic trade desk CIS/POF templates and checklists |
| scripts/generate-troptions-pdfs.mjs | Institutional PDF generation (CIS/POF themes present in generated outputs) | Source content not structured as reusable markdown templates for docs team intake; no schema-level validation | Partial | Add explicit markdown templates and schema validation pipeline |
| scripts/xrpl-verify-issuer-proof.mjs / scripts/xrpl-check-account-lines.mjs | Deterministic issuer and trustline verification utilities | Evidence workflow not mapped to CIS/POF doc requirements and reviewer statuses | Partial | Add evidence checklist and map script outputs into review artifacts |

## Missing Sections (Critical)
1. Formal CIS template with all legal entity, ownership/control, signer, compliance, and expected activity fields.
2. Formal POF template with account-owner matching, restrictions/lien checks, institution verification, and reviewer decision.
3. Source of Funds vs Source of Wealth policy with acceptable and unacceptable evidence examples.
4. Evidence checklist status model for operational tracking and reviewer signoff.
5. Machine-readable schemas for CIS/POF/checklist artifacts.
6. Validation script to enforce required docs and headings for repeatable readiness checks.

## Trade Desk Readiness Verdict
Current state: NOT READY for strict Bryan/trade-desk review as a complete CIS/POF package.

Reason: Existing docs contain useful policy fragments, but the repository lacked standardized trade-desk templates, schema-validated structures, and a deterministic validation command for packet completeness.

## Exact Remediation Applied in This Pass
1. Create dedicated trade desk CIS/POF docs under docs/trade-desk/cis-pof/.
2. Create JSON schemas under schemas/trade-desk/.
3. Add validator script scripts/validate-trade-desk-docs.mjs with pass/fail exit codes.
4. Add package.json command validate:trade-desk-docs.
5. Add Docker/WSL recovery runbooks and safe automation scripts under docs/runbooks/ and scripts/windows/.
