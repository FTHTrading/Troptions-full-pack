# Global Jurisdiction Matrix — XRPL/Stellar

**Status:** All Jurisdictions Disabled | Legal Review Required  
**Production Activation:** `disabled` for all jurisdictions until legal review is complete.

---

## Overview

TROPTIONS operates a jurisdiction-aware compliance gate that evaluates operations against the applicable regulatory framework for each target jurisdiction. No operation is enabled in any jurisdiction without explicit legal review and production gate approval.

---

## Jurisdiction Profiles

### United States (US)

| Property | Value |
|----------|-------|
| Regulatory Bodies | SEC, CFTC, FinCEN, OCC, CFPB, State MSB |
| Applicable Frameworks | Howey Test, Bank Secrecy Act, GENIUS Act (proposed) |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes ($3,000+ threshold) |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### European Union (EU)

| Property | Value |
|----------|-------|
| Regulatory Bodies | EBA, ESMA, National Competent Authorities |
| Applicable Frameworks | MiCA, AMLD5/AMLD6, TFR (Transfer of Funds Regulation) |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes (all amounts) |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### United Kingdom (UK)

| Property | Value |
|----------|-------|
| Regulatory Bodies | FCA |
| Applicable Frameworks | UK MLRs, FCA Crypto Asset Registration, Travel Rule |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### Singapore (SG)

| Property | Value |
|----------|-------|
| Regulatory Bodies | MAS |
| Applicable Frameworks | Payment Services Act, MAS Travel Rule Notice |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### Hong Kong (HK)

| Property | Value |
|----------|-------|
| Regulatory Bodies | SFC, HKMA |
| Applicable Frameworks | VASP Licensing, AML/CFT Ordinance, Stablecoin Bill |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### United Arab Emirates (UAE)

| Property | Value |
|----------|-------|
| Regulatory Bodies | VARA, CBUAE, ADGM, DIFC |
| Applicable Frameworks | VARA Regulations, AML/CFT Rules |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### Canada (CA)

| Property | Value |
|----------|-------|
| Regulatory Bodies | FINTRAC, CSA, OSFI |
| Applicable Frameworks | PCMLTFA, CSA Crypto Guidance, MSB Registration |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

### Latin America (LATAM)

| Property | Value |
|----------|-------|
| Notes | Highly fragmented — Brazil (BCB, CVM), Mexico (CNBV, Banxico), Argentina (BCRA), Colombia (SFC), others |
| KYC/AML Required | Yes (varies) |
| Travel Rule Required | Varies by country |
| Legal Review Required | Yes (per country) |
| Production Status | **Disabled** |

### FATF Global Standard

| Property | Value |
|----------|-------|
| Applicable To | All FATF member jurisdictions (39+ countries) |
| Applicable Frameworks | FATF Recommendations 15/16, Travel Rule, VASP standards |
| KYC/AML Required | Yes |
| Travel Rule Required | Yes (Recommendation 16) |
| Legal Review Required | Yes |
| Production Status | **Disabled** |

---

## Compliance Properties (All Jurisdictions)

All jurisdiction profiles share these invariant properties:

```typescript
allowedWithoutLegalReview: false
legalReviewRequired: true
productionActivationStatus: "disabled"
```

No operation may proceed to production in any jurisdiction without:
1. Jurisdiction-specific legal counsel engagement
2. Regulatory licensing assessment
3. AML/KYC implementation review
4. Travel Rule implementation where applicable
5. Control Hub approval gate clearance

---

*This matrix is for internal readiness planning only and does not constitute legal advice.*
