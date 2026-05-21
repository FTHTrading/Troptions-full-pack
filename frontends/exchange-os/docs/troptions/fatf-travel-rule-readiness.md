# FATF / Travel Rule Readiness — XRPL/Stellar

**Status:** Pending Evidence | Simulation Only  
**Legal review required before production implementation.**

---

## Background

The Financial Action Task Force (FATF) Recommendation 16 (Travel Rule) requires Virtual Asset Service Providers (VASPs) to collect and transmit originator and beneficiary information for virtual asset transfers above specified thresholds.

---

## Applicability to TROPTIONS

TROPTIONS is evaluating FATF Travel Rule compliance obligations for:

1. **XRPL payment operations** — transfers using the XRPL Payment transaction type
2. **Stellar payment operations** — transfers using Stellar payment operations
3. **Institutional distribution** — asset distribution from issuer to counterparty VASPs

---

## Travel Rule Requirements

### Originator Information (to collect and transmit)

- Full legal name
- Account/address identifier (XRPL address or Stellar public key)
- Physical address OR national identity number OR date of birth + place of birth
- Jurisdiction of originator

### Beneficiary Information (to collect and verify)

- Full legal name
- Account/address identifier

### Thresholds (by jurisdiction)

| Jurisdiction | Threshold | Rule |
|-------------|-----------|------|
| US (FinCEN) | $3,000 USD | FBAR Travel Rule |
| EU (TFR) | €0 (all amounts) | EU Transfer of Funds Regulation |
| UK | £0 (all amounts) | UK Money Transfer Regulations |
| FATF Standard | $1,000 USD equivalent | FATF Recommendation 16 |
| Singapore (MAS) | S$1,500 | MAS Travel Rule Notice |

---

## Technical Implementation Options

TROPTIONS is evaluating Travel Rule solutions:

| Solution | Status |
|----------|--------|
| TRISA (Travel Rule Information Sharing Architecture) | Evaluation pending |
| OpenVASP | Evaluation pending |
| VerifyVASP | Evaluation pending |
| Notabene | Evaluation pending |
| In-house VASP-to-VASP messaging | Not recommended without legal review |

---

## Required Evidence Before Production

1. VASP registration/licensing in applicable jurisdictions
2. Qualified compliance counsel engagement for Travel Rule implementation
3. Travel Rule solution provider selection and integration
4. Counterparty VASP identification and matching solution
5. Originator/beneficiary data retention policy (minimum 5 years in most jurisdictions)
6. Control Hub approval gate clearance

---

## Current Status

| Control | Status |
|---------|--------|
| FATF legal counsel engaged | Not met |
| VASP identification completed | Not met |
| Travel Rule solution selected | Not met |
| Originator data collection implemented | Not met |
| Beneficiary verification implemented | Not met |
| Data retention policy established | Not met |

---

*This document is for internal readiness tracking only and does not constitute legal advice.*
