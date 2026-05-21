# TROPTIONS Brand Control and Third-Party Reference Policy

**Version:** 1.0  
**Effective Date:** April 28, 2026  
**Owner:** TROPTIONS Compliance Team  
**Classification:** Internal Compliance — Public Facing  

---

## 1. Purpose

This policy establishes the rules governing how TROPTIONS public materials, source code, documentation, compliance notices, wallet registries, and institutional communications may reference third-party brands, infrastructure providers, or external technology systems.

TROPTIONS is a sovereign digital asset ecosystem. All branding, ownership, and system identity must accurately reflect TROPTIONS-controlled infrastructure. No third party may be credited, implied, or named as operating, owning, powering, controlling, licensing, or participating in TROPTIONS infrastructure without documented legal authorization and written board approval.

---

## 2. Scope

This policy applies to:

- All files in `src/` (TypeScript, TSX, JS, JSX, MJS)
- All files in `docs/` (Markdown, MDX, text)
- All files in `public/` (JSON, HTML, text)
- All files in `extensions/` (any format)
- Build outputs, deploy artifacts, and any material distributed publicly

---

## 3. Forbidden Third-Party Brand References

The following brand names, identifiers, and derivatives **must not appear** in any in-scope file unless explicitly exempted under Section 5:

| Forbidden Term | Reason |
|---|---|
| `OPTKAS` | Former internal label; not authorized for public brand credit |
| `Optkas` | Case variant — same restriction |
| `optkas` | Lowercase variant — same restriction |
| `OPKTAS` | Typographical variant — same restriction |

These terms must not appear in:

- Compliance disclaimers or legal notices
- Glossary definitions
- System identity or infrastructure attribution
- Revenue model descriptions
- Wallet display names or role descriptions
- Forensic investigation pages
- Advertising audit records
- AMM pool names, market data pair labels, or order book pairs
- IOU and issued-asset registries
- Stellar TOML asset definitions

---

## 4. Approved Replacement Language

When replacing forbidden brand references, use the following approved substitutions:

| Context | Approved Replacement |
|---|---|
| Infrastructure attribution | `TROPTIONS compliance-controlled technology infrastructure` |
| System engine identity | `TROPTIONS Compliance-Controlled Operating System — Proof, Treasury, KYC/KYB, Asset, Settlement` |
| Legacy wallet issuers | `Legacy Token Issuer` or `Platform Token Issuer` |
| Legacy treasury wallets | `Legacy Treasury` or `Platform Treasury Reserve` |
| Forensic investigation references | `legacy backup wallets` or `platform backup wallets` |
| Revenue model licensing | `TROPTIONS platform infrastructure` |
| Asset codes (formerly OPTKAS) | `LEGACY-TOKEN` or `LEGACY` |
| Advertising source citations | `TROPTIONS institutional materials` |

---

## 5. Exemptions

The following file paths are **exempt** from the forbidden-brand scan because they contain historical records, archived commit messages, or audit documentation that cannot be retroactively altered:

| File | Reason for Exemption |
|---|---|
| `docs/troptions/master-audit/00-git-state.md` | Historical git log — references a prior commit message |
| `docs/troptions/final-live-launch-readiness-report.md` | References the same historical commit hash |
| `docs/TROPTIONS-GENESIS-BUILD.md` | Genesis wallet provisioning record — historical mainnet record |
| `docs/troptions/xrpl-stellar-ecosystem-audit.md` | Historical audit of asset registry state at a point in time |
| `docs/troptions/optkas-removal-cleanup-report.md` | Cleanup report — documents what was removed |
| `scripts/scan-forbidden-brands.mjs` | The scan script itself (contains terms to detect) |

Exempted files must **not** be updated to add new forward-looking OPTKAS references. Exemptions cover only existing historical content.

---

## 6. Automated Enforcement

A scan script enforces this policy at development time:

```bash
npm run scan:forbidden-brands
```

**Script location:** `scripts/scan-forbidden-brands.mjs`

**Behavior:**
- Scans `src/`, `docs/`, `public/`, `extensions/`
- Checks `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.md`, `.mdx`, `.json`, `.html`, `.txt`, `.toml`
- Skips `node_modules/`, `.next/`, `.git/`, `dist/`, `build/`, `out/`
- Skips exempted file paths listed above
- Exits with code `1` and prints all violations if any forbidden term is found
- Exits with code `0` if clean

This script **must** pass before any production commit or deployment.

---

## 7. Review and Authorization Process

Any request to add a third-party brand name to TROPTIONS materials must:

1. Be submitted to the TROPTIONS Compliance Team in writing
2. Include documented legal basis (license, partnership agreement, regulatory filing)
3. Receive written board authorization
4. Be reviewed by outside counsel if the brand involves infrastructure attribution
5. Result in a written amendment to this policy before the reference is added

**No exceptions may be granted verbally or via informal communication.**

---

## 8. Violation Handling

| Severity | Example | Response |
|---|---|---|
| **Critical** | Forbidden brand in public disclaimer, compliance notice, or legal filing | Immediate removal + incident report + legal review |
| **High** | Forbidden brand in wallet registry, revenue model, or asset description | Remove before next deploy + document in cleanup report |
| **Medium** | Forbidden brand in internal admin page | Remove in next sprint |
| **Low** | Forbidden brand in test fixture or comment | Remove at earliest convenience |

All violations discovered by the automated scan are treated as **High** severity minimum.

---

## 9. Policy History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-04-28 | Initial policy — established after OPTKAS brand cleanup (see cleanup report) |
