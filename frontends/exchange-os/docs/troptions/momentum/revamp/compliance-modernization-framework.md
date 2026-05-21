# Momentum Compliance Modernization Framework

**Document:** Troptions Momentum Compliance Modernization Framework  
**Status:** Internal — Draft v1.0  
**Purpose:** Define the legal/regulatory compliance gates that must be passed before any Momentum feature moves from simulation/documentation mode to live execution.

> This document does not constitute legal advice. All sections require review by licensed legal counsel with expertise in the applicable regulatory domains.

---

## 1. Foundational Principles

Troptions Momentum is rebuilt on these non-negotiable foundations:

1. **Documentation-first**: Every feature begins as documentation and workflow tooling — not a financial product.
2. **Simulation-only by default**: All blockchain, payment, and investment features are disabled until each applicable compliance gate is cleared.
3. **Gate-locked activation**: No live functionality is enabled without written legal opinion, regulatory clearance, and recorded board/operator approval.
4. **Zero implied returns**: The platform makes no representation of profit, yield, token appreciation, passive income, or financial return of any kind.
5. **Jurisdiction-gated**: Features are only enabled in jurisdictions where explicit legal clearance has been obtained.

---

## 2. Compliance Domain Registry

### 2.1 Securities Law (Federal + State)

**Governing Authority:** U.S. Securities and Exchange Commission (SEC), state securities regulators (Blue Sky laws), and equivalent authorities in applicable foreign jurisdictions.

**Applicable Howey Test Analysis:**
Any token, fractional interest, or investment program that involves:
- An investment of money
- In a common enterprise
- With an expectation of profits
- Primarily from the efforts of others

…is likely a security requiring registration under the Securities Act of 1933 or a valid exemption (Reg D, Reg A+, Reg S, etc.).

**Momentum Gate Requirements:**
- [ ] Written legal opinion from securities counsel on each token type before issuance
- [ ] Securities registration or valid exemption filing before any token sale
- [ ] Investor accreditation verification before any non-public offering
- [ ] Form D filing within 15 days of first sale under Reg D (if applicable)
- [ ] No public advertising of any unregistered offering
- [ ] No "digital dividend," revenue-share, or profit-distribution features until registration is complete

**Current Status:** `LOCKED — No securities offering is active or permitted`

---

### 2.2 Commodity Law

**Governing Authority:** U.S. Commodity Futures Trading Commission (CFTC), National Futures Association (NFA).

**Applicable Triggers:**
- Carbon credit trading (potential commodity futures)
- Crypto token derivatives or futures contracts
- Any trading platform providing leveraged or margined positions in tokenized assets
- AI arbitrage systems executing trades in commodity markets

**Momentum Gate Requirements:**
- [ ] Legal opinion on commodity classification of any carbon credit or token product
- [ ] CPO/CTA registration (Commodity Pool Operator / Commodity Trading Adviser) if any pooled trading activity occurs
- [ ] No automated arbitrage or trading execution without CFTC authorization
- [ ] ESG/offset token design reviewed for commodity futures classification

**Current Status:** `LOCKED — No commodity trading features are active or permitted`

---

### 2.3 Anti-Money Laundering (AML), Know Your Customer (KYC), and Sanctions

**Governing Authority:** FinCEN (Financial Crimes Enforcement Network), OFAC (Office of Foreign Assets Control), Bank Secrecy Act (BSA).

**Applicable Triggers:**
- Any payment processing (fiat or crypto)
- Any token purchase or transfer
- Any custody or wallet-holding service

**Momentum Gate Requirements:**
- [ ] Written AML/BSA compliance program in place before any transaction processing
- [ ] KYC identity verification for all users before any token purchase or financial transaction
- [ ] OFAC sanctions screening on all counterparties
- [ ] Suspicious Activity Report (SAR) filing procedures established
- [ ] Third-party AML audit completed before any payment feature goes live
- [ ] Transaction monitoring system operational

**Current Status:** `LOCKED — No payment processing. KYC/AML not applicable until payment features are activated`

---

### 2.4 Money Transmission

**Governing Authority:** State money transmitter regulators (all 50 states have different requirements), FinCEN (at federal level), and equivalent foreign regulators.

**Applicable Triggers:**
- Accepting fiat currency from users and transmitting to others
- Facilitating crypto-to-fiat or crypto-to-crypto exchanges
- Holding user funds or digital assets in custody
- Processing athlete payroll

**Momentum Gate Requirements:**
- [ ] Money Transmitter License (MTL) obtained in each state where services are offered
- [ ] Surety bonds filed as required by each state
- [ ] Net worth requirements met per state regulations
- [ ] FinCEN Money Services Business (MSB) registration complete
- [ ] Compliance officer appointed
- [ ] Payment processing is NOT offered without full MTL coverage

**Current Status:** `LOCKED — No money transmission features active or permitted`

---

### 2.5 Investment Adviser

**Governing Authority:** SEC Investment Advisers Act of 1940, state investment adviser regulations.

**Applicable Triggers:**
- Providing personalized investment recommendations
- Managing portfolios of securities or tokens for compensation
- AI systems that make or recommend specific trades or investments
- Real-time arbitrage or "yield aggregator" tools that execute on behalf of users

**Momentum Gate Requirements:**
- [ ] RIA registration (Registered Investment Adviser) if providing investment advice for compensation
- [ ] Clear disclosure that no investment advice is provided in informational analytics tools
- [ ] AI analytics tools must not make specific buy/sell recommendations without RIA license
- [ ] No "yield aggregator returns" features without investment adviser registration

**Current Status:** `LOCKED — No investment advice features active. All analytics are informational only`

---

### 2.6 Banking and Deposit-Taking

**Governing Authority:** Federal Reserve, OCC (Office of the Comptroller of the Currency), FDIC, state banking regulators.

**Applicable Triggers:**
- Accepting deposits from the public
- Representing the platform as a "bank" or "digital bank"
- Offering FDIC-insured accounts
- Lending activities

**Momentum Gate Requirements:**
- [ ] Remove all references to "digital bank" or "banking" as a service offered by Momentum
- [ ] Obtain banking charter or partner with FDIC-insured institution before any deposit-taking
- [ ] Clearly disclose that Momentum is NOT a bank and deposits are NOT FDIC insured
- [ ] All banking functionality must be provided by a separately licensed third-party institution

**Current Status:** `LOCKED — Platform does not operate as a bank and makes no banking representations`

---

### 2.7 Consumer Protection and Advertising

**Governing Authority:** FTC (Federal Trade Commission), state attorneys general, CFPB (Consumer Financial Protection Bureau).

**Applicable Triggers:**
- Any public marketing of Momentum features
- Claims about platform capabilities that are not yet built or tested
- NFT marketing with promised experiences or perks
- Deceptive urgency ("limited time," "exclusive access")

**Momentum Gate Requirements:**
- [ ] All capability claims must be verified/substantiated before publication
- [ ] Forward-looking statements must be clearly labeled as such
- [ ] NFT experience claims must be deliverable and legally binding before sale
- [ ] No deceptive urgency or scarcity claims without genuine constraints
- [ ] Material connections (sponsorships, endorsements) must be disclosed
- [ ] AI-generated content disclosed where required by FTC guidance

**Current Status:** `ACTIVE — All public-facing content must pass this gate before publication`

---

### 2.8 Data Privacy

**Governing Authority:** FTC, GDPR (EU), CCPA/CPRA (California), state privacy laws, sector-specific laws (FERPA for student-athletes, COPPA for minors).

**Applicable Triggers:**
- Collecting personal data from fans, athletes, or sponsors
- Using AI analytics on user behavior
- Sharing data with third-party sponsors
- Processing data of EU residents

**Momentum Gate Requirements:**
- [ ] Privacy policy drafted, reviewed by counsel, and published
- [ ] Data Processing Agreement (DPA) with all data processors
- [ ] GDPR Article 30 Record of Processing Activities maintained
- [ ] CCPA consumer rights mechanisms implemented
- [ ] No sale or sharing of personal data without consent
- [ ] Data retention and deletion procedures documented
- [ ] DPIA (Data Protection Impact Assessment) for high-risk AI analytics

**Current Status:** `PARTIAL — Privacy policy required before any user data collection begins`

---

### 2.9 Tax Compliance

**Governing Authority:** IRS, state revenue departments, OECD guidelines for international tax.

**Applicable Triggers:**
- Token issuance (potential taxable event)
- Token trading or transfer
- NFT sales
- Revenue-sharing distributions
- Athlete compensation

**Momentum Gate Requirements:**
- [ ] Tax counsel opinion on treatment of all token types before issuance
- [ ] 1099 reporting infrastructure before any payments to US persons
- [ ] W-8BEN / W-9 collection for all payees
- [ ] Cost basis tracking for all token transactions
- [ ] Transfer pricing documentation for cross-border transactions

**Current Status:** `LOCKED — No taxable events occur in simulation mode`

---

### 2.10 Sports-Specific Regulations (NIL, NCAA, League Rules)

**Governing Authority:** NCAA, state NIL laws, professional league CBAs, athlete agent regulations.

**Applicable Triggers:**
- Token-based NIL (Name, Image, Likeness) programs for student-athletes
- Athlete compensation features
- Sports betting integrations
- Fantasy sports compliance

**Momentum Gate Requirements:**
- [ ] NIL legal counsel review for any student-athlete token or payment feature
- [ ] Compliance with applicable CBA terms for professional athletes
- [ ] Athlete agent regulations reviewed per state
- [ ] Fantasy sports licensing in states requiring it
- [ ] Integration with NIL Layer-1 Troptions compliance framework

**Current Status:** `SIMULATION ONLY — NIL integration links to Troptions NIL Layer-1 (simulation mode only)`

---

## 3. Feature Gate Matrix

| Feature | Gate Requirements | Current Status |
|---------|------------------|---------------|
| Live payment processing | §2.4 Money Transmission, §2.3 AML/KYC | `LOCKED` |
| Token issuance/sale | §2.1 Securities, §2.9 Tax | `LOCKED` |
| Revenue-sharing tokens | §2.1 Securities — registration required | `LOCKED (PROHIBITED without registration)` |
| Carbon credit trading | §2.2 Commodity, §2.3 AML | `LOCKED` |
| AI arbitrage/yield tools | §2.5 Investment Adviser | `LOCKED` |
| Digital banking features | §2.6 Banking | `LOCKED` |
| NFT issuance | §2.1 (if securities), §2.7 Consumer | `LOCKED — legal review required` |
| Fan data analytics | §2.8 Data Privacy | `PARTIAL — privacy policy required` |
| Athlete NIL tokens | §2.10 NIL, §2.1 Securities | `SIMULATION ONLY` |
| ESG documentation tools | None (documentation only) | `ACTIVE` |
| Historical research/educational content | None | `ACTIVE` |
| Compliance readiness dashboard | None (simulation) | `ACTIVE` |
| AI workflow documentation | None (documentation only) | `ACTIVE` |

---

## 4. Integration with Troptions NIL Layer-1

The Momentum compliance framework is architecturally linked to the Troptions NIL Layer-1 (`src/lib/troptions-nil/l1NilBridge.ts`):

- `MOMENTUM_COMPLIANCE_GATES` reference the NIL compliance gate structure
- Admin review pages link to `/admin/troptions-nil/layer1/` for unified governance review
- Public-facing pages link to `/troptions-nil/layer1/` for ecosystem transparency

Shared safety constants across both systems:
```typescript
livePaymentsEnabled: false
blockchainExecutionEnabled: false
x402SimulationOnly: true
investmentClaimsAllowed: false
yieldClaimsAllowed: false
custodyClaimsAllowed: false
publicOfferingClaimsAllowed: false
legalReviewRequired: true
complianceReviewRequired: true
jurisdictionReviewRequired: true
```

---

## 5. Activation Protocol

When a team seeks to activate any locked feature:

1. **Legal Opinion Request** — Submit feature description to securities/regulatory counsel
2. **Counsel Review** — Written legal opinion received addressing all applicable regulations
3. **Operator Board Approval** — Recorded vote by authorized decision-makers
4. **Regulatory Filing** (if required) — SEC registration, MTL application, etc.
5. **Technical Implementation** — Feature built with compliance controls
6. **Third-Party Audit** — Independent review before launch
7. **Jurisdiction Gate** — Feature enabled only in jurisdictions with clearance
8. **Monitoring Plan** — Ongoing compliance monitoring established

No shortcut steps are permitted. Features remain `LOCKED` until all applicable steps are completed and documented.

---

*This framework is an internal compliance planning document. It does not constitute legal advice and must be reviewed by qualified legal counsel before any features are activated.*
