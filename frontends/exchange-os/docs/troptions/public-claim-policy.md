# Public Claim Policy — TROPTIONS XRPL/Stellar

**Status:** Active  
**Purpose:** Prevent prohibited language in public marketing and communications about TROPTIONS' XRPL/Stellar compliance capabilities.

---

## Policy Rationale

Certain marketing claims related to regulatory compliance, financial guarantees, and certification status are prohibited because they:

1. **Misrepresent regulatory status** — claiming approval or certification that has not been granted
2. **Create legal liability** — regulatory bodies may treat false compliance claims as fraud
3. **Mislead investors** — suggesting guaranteed returns or risk-free status violates securities/consumer protection law
4. **Violate accurate representation** — GENIUS Act, ISO 20022, and securities laws prohibit deceptive public statements

---

## Prohibited Phrases

The following phrases (and variations) are blocked in public claims:

| Prohibited Phrase | Reason |
|-------------------|--------|
| "fully compliant globally" | No asset is fully compliant in all jurisdictions simultaneously |
| "ISO 20022 coin" | ISO 20022 is a message standard; it does not certify coins |
| "ISO 20022 certified" | No certification process for blockchain tokens exists under ISO 20022 |
| "GENIUS Act approved" | GENIUS Act is proposed legislation; approval is not granted to individual projects |
| "GENIUS Act compliant" | Cannot claim compliance with proposed/enacted legislation without legal verification |
| "guaranteed liquidity" | Liquidity guarantees are regulated representations |
| "guaranteed yield" | Yield guarantees are securities fraud risk |
| "guaranteed profit" | Profit guarantees violate securities law |
| "guaranteed returns" | Returns guarantees violate securities law |
| "risk free" / "risk-free" | No investment is risk-free; false statement |
| "government approved" | Unless specific approval order exists, false |
| "SEC approved" | SEC does not approve cryptocurrency projects as a general matter |
| "CFTC approved" | CFTC does not approve cryptocurrency projects as a general matter |
| "legal in all jurisdictions" | No asset is legal in all jurisdictions simultaneously |
| "fully AML compliant" | AML compliance is jurisdiction-specific and operationally ongoing |
| "no KYC required" | False where KYC is legally mandated |
| "anonymous and compliant" | Anonymity and compliance are contradictory in FATF-aligned jurisdictions |

---

## Allowed Alternative Phrasings

| Instead of... | Use... |
|---------------|--------|
| "ISO 20022 coin" | "ISO 20022 message compatibility readiness" |
| "GENIUS Act compliant" | "GENIUS Act readiness evaluation in progress" |
| "fully compliant globally" | "Jurisdiction-aware compliance readiness — legal review required" |
| "guaranteed liquidity" | "Liquidity subject to market conditions and operational parameters" |
| "risk free" | "Risk disclosures available — see [disclosure document]" |
| "SEC approved" | "Not approved or endorsed by the SEC" (affirmative disclosure) |
| "legal in all jurisdictions" | "Availability varies by jurisdiction — consult qualified local counsel" |

---

## Enforcement

The `reviewPublicClaim()` function in `globalCompliancePolicyEngine.ts` automatically reviews text for prohibited phrases. All claim reviews are persisted to the Control Hub audit log.

API endpoint: `POST /api/troptions/xrpl-stellar-compliance/claim-review`

---

## Disclaimer

This policy is for internal compliance risk management only. It does not constitute legal advice. TROPTIONS recommends all public communications be reviewed by qualified legal counsel.
