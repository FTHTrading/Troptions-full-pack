# RLN, Project Agorá, and mBridge Compatibility

**Document**: TSN Cross-Rail Series
**Status**: Architecture design — simulation adapters only. No live banking, CBDC, or cross-border settlement execution.

---

## Overview

TSN is designed for compatibility with three major institutional settlement models emerging from central banks and the BIS:

1. **RLN** (Regulated Liability Network) — Tokenized regulated money on shared infrastructure
2. **Project Agorá** — Tokenized commercial bank deposits + wholesale central bank money
3. **mBridge** — Multi-CBDC cross-border settlement

TSN does not claim to be any of these systems, to be integrated with them, or to be approved by any central bank. TSN models compatibility at the architecture and data-structure level so that future integration can be designed for rather than bolted on.

---

## 1. Regulated Liability Network (RLN)

### What It Is
The RLN concept explores placing regulated money — central bank money, commercial bank deposits, and e-money — on shared tokenized infrastructure. The New York Fed facilitated a wholesale digital asset settlement experiment simulating commercial bank deposit tokens and a theoretical wholesale CBDC.

### RLN Core Concept
```
Regulated Liability = a tokenized claim on a regulated institution
  - Central bank money  (ultimate settlement asset)
  - Commercial bank deposit token  (bank liability, customer claim)
  - E-money  (institution liability, customer claim)
  - Payment stablecoin  (issuer liability, reserve-backed)
```

### TSN `tsn-rln` Crate

```rust
pub enum RegulatedLiabilityType {
    CentralBankMoney,         // Wholesale CBDC
    CommercialBankDeposit,    // Tokenized bank deposit
    EMoney,                   // Electronic money token
    PaymentStablecoin,        // GENIUS Act stablecoin
}

pub struct RegulatedLiability {
    pub issuer_type: LiabilityIssuerType,
    pub currency: String,
    pub liability_type: RegulatedLiabilityType,
    pub redemption_rights: String,
    pub settlement_finality: SettlementFinalityType,
    pub legal_claim_reference: String,
    pub simulation_only: bool,
}
```

### RLN Integration Model

```
TSN ←──── RLN Adapter ─────→ Future RLN Infrastructure
        simulation only
```

TSN's `tsn-rln` adapter:
- Produces `CrossRailRoute` records for simulated RLN settlement
- Validates compliance requirements (KYC, sanctions, jurisdiction)
- Generates audit events for all simulated RLN operations
- Does NOT connect to any real RLN infrastructure
- Marks all outputs `simulation_only: true`

---

## 2. Project Agorá

### What It Is
Project Agorá is a BIS Innovation Hub project exploring how tokenized commercial bank deposits and tokenized wholesale central bank money can be combined in a programmable public-private platform for cross-border payments. Participating central banks include the Bank of France, Bank of Japan, Bank of Korea, Bank of Mexico, Swiss National Bank, Bank of England, and the Federal Reserve Bank of New York.

### Agorá Core Concept
```
Unified Ledger Hypothesis:
  Tokenized CBDC (wholesale) + Tokenized commercial bank deposits
  on a programmable shared platform
  → instant, programmable cross-border settlement
```

### TSN `tsn-agora` Crate

```rust
pub struct AgoraStyleSettlement {
    pub settlement_id: Uuid,
    pub wholesale_cbdc_reference: String,    // Placeholder
    pub commercial_bank_deposit_token: String,
    pub sending_bank: String,
    pub receiving_bank: String,
    pub currency_pair: (String, String),
    pub amount_string: String,
    pub programmable_compliance_check: bool,
    pub central_bank_money_compat: bool,
    pub commercial_bank_money_compat: bool,
    pub simulation_only: bool,
}
```

### Agorá Integration Model

```
TSN ←──── Agorá Adapter ─────→ Future Agorá Infrastructure
         simulation only
```

TSN's `tsn-agora` adapter:
- Models tokenized bank deposit representations
- Models wholesale settlement accounts
- Produces multi-currency settlement instruction simulations
- Validates all programmatic compliance checks
- Does NOT connect to any Agorá platform or central bank system
- Marks all outputs `simulation_only: true`

---

## 3. Project mBridge

### What It Is
mBridge reached MVP stage in 2024 as a multi-CBDC platform using DLT for instant, low-cost cross-border payments and settlement. Participating institutions include the central banks of China, Hong Kong, Thailand, UAE, and the BIS Innovation Hub.

### mBridge Core Concept
```
Multi-CBDC bridge platform:
  Each jurisdiction issues domestic CBDC
  mBridge platform provides:
  - real-time gross settlement
  - currency-to-currency atomic swaps
  - compliant cross-border transfer
```

### TSN `tsn-mbridge` Crate

```rust
pub struct MbridgeStyleInstruction {
    pub instruction_id: Uuid,
    pub sending_jurisdiction: JurisdictionCode,
    pub receiving_jurisdiction: JurisdictionCode,
    pub sending_currency: String,
    pub receiving_currency: String,
    pub amount_string: String,
    pub fx_quote_record: Option<FxQuoteRecord>,
    pub participant_sending_bank: String,
    pub participant_receiving_bank: String,
    pub central_bank_route_status: CentralBankRouteStatus,
    pub sanctions_check_passed: bool,
    pub simulation_only: bool,
}

pub struct FxQuoteRecord {
    pub quote_id: Uuid,
    pub rate: String,
    pub valid_until: DateTime<Utc>,
    pub rate_source: String,
}

pub enum CentralBankRouteStatus {
    SimulationOnly,
    PendingCbRoute,
    Approved,
    Blocked,
}
```

### mBridge Integration Model

```
TSN ←──── mBridge Adapter ─────→ Future mBridge Infrastructure
          simulation only
```

TSN's `tsn-mbridge` adapter:
- Models multi-currency settlement instruction records
- Models FX quote records (historical reference only)
- Validates sanctions checks for both sending and receiving parties
- Produces jurisdiction gate decisions
- Does NOT connect to any mBridge or central bank infrastructure
- Marks all outputs `simulation_only: true`

---

## Cross-Rail Compatibility Matrix

| Target | TSN Adapter | Data Compatibility | Compliance Checks | Live Execution |
|---|---|---|---|---|
| XRPL | `tsn-bridge-xrpl` | Trustlines, issued assets, AMM | KYC, sanctions, jurisdiction | ❌ Simulation only |
| Stellar | `tsn-bridge-stellar` | Trustlines, anchors, path payments | KYC, sanctions, anchor gate | ❌ Simulation only |
| RLN | `tsn-rln` | Regulated liability tokens | KYC, BSA, settlement finality | ❌ Simulation only |
| Agorá | `tsn-agora` | Bank deposit tokens, wholesale CBDC | Programmable compliance | ❌ Simulation only |
| mBridge | `tsn-mbridge` | Multi-currency cross-border | Sanctions, jurisdiction, FX | ❌ Simulation only |

---

## Engineering Next Steps

1. Implement simulation route evaluation for each adapter
2. Wire all adapters through TCSA compliance checks
3. Emit `CrossRailRoute` and `AuditEvent` records for every simulation
4. Build cross-rail readiness dashboard (port to TypeScript Control Hub panel)
5. Legal review before any claims about compatibility with actual central bank systems
