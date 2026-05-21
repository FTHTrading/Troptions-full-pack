/**
 * Troptions Momentum Program Registry
 *
 * This registry defines the Momentum program as a documentation, AI workflow,
 * and compliance-readiness layer. It does NOT define a financial product,
 * securities offering, investment contract, or banking service.
 *
 * All financial/blockchain features are LOCKED until explicit compliance
 * gate clearance is obtained per the compliance modernization framework.
 *
 * @see docs/troptions/momentum/revamp/compliance-modernization-framework.md
 * @see docs/troptions/momentum/revamp/legacy-claim-audit.md
 */

// ─── Safety Constants ────────────────────────────────────────────────────────
// These are hardcoded. Do NOT change without written legal opinion and
// recorded operator board approval.

export const MOMENTUM_SAFETY = {
  legalReviewRequired: true,
  complianceReviewRequired: true,
  livePaymentsEnabled: false,
  blockchainExecutionEnabled: false,
  x402SimulationOnly: true,
  investmentClaimsAllowed: false,
  yieldClaimsAllowed: false,
  custodyClaimsAllowed: false,
  publicOfferingClaimsAllowed: false,
  jurisdictionReviewRequired: true,
} as const;

// ─── Program Definition ──────────────────────────────────────────────────────

export interface MomentumProgram {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly disclaimer: string;
  readonly isFinancialProduct: false;
  readonly isSecuritiesOffering: false;
  readonly isInvestmentAdvice: false;
  readonly isBankingService: false;
  readonly status: "documentation" | "simulation" | "partial" | "active";
  readonly safety: typeof MOMENTUM_SAFETY;
}

export const MOMENTUM_PROGRAM: MomentumProgram = {
  id: "TROP-MOMENTUM-001",
  name: "Troptions Momentum",
  version: "1.0.0",
  description:
    "A documentation, AI workflow, and verification-readiness layer for sports ecosystem participants. " +
    "Provides compliance-readiness documentation, ESG frameworks, sponsor documentation tools, and AI " +
    "analytics documentation. Does not provide financial services, banking, investment advice, or " +
    "token issuance.",
  disclaimer:
    "Troptions Momentum is NOT a bank, financial institution, broker-dealer, investment adviser, " +
    "money service business, or token issuer. Nothing in this program constitutes an offer or sale " +
    "of securities, an investment contract, financial advice, tax advice, or legal advice. " +
    "No yield, return, profit, or investment outcome is guaranteed or implied. " +
    "All blockchain and payment features are conceptual and require separate legal review.",
  isFinancialProduct: false,
  isSecuritiesOffering: false,
  isInvestmentAdvice: false,
  isBankingService: false,
  status: "documentation",
  safety: MOMENTUM_SAFETY,
};

// ─── Program Phases ──────────────────────────────────────────────────────────

export type MomentumPhaseStatus =
  | "active"
  | "simulation"
  | "locked"
  | "partial";

export interface MomentumPhase {
  readonly id: string;
  readonly phase: number;
  readonly name: string;
  readonly description: string;
  readonly status: MomentumPhaseStatus;
  readonly requiresLegalReview: boolean;
  readonly requiresComplianceReview: boolean;
  readonly liveExecutionEnabled: boolean;
}

export const MOMENTUM_PHASES: readonly MomentumPhase[] = [
  {
    id: "MOM-PHASE-01",
    phase: 1,
    name: "Documentation and Readiness Assessment",
    description:
      "Structured assessment of organizational compliance posture. Documents applicable " +
      "regulatory requirements, produces gap analysis for legal review, and creates readiness checklists.",
    status: "active",
    requiresLegalReview: false,
    requiresComplianceReview: false,
    liveExecutionEnabled: false,
  },
  {
    id: "MOM-PHASE-02",
    phase: 2,
    name: "ESG and Sustainability Documentation",
    description:
      "Documentation layer for ESG frameworks in sports operations. Covers carbon footprint " +
      "measurement, verified offset program overviews, green stadium design, and governance documentation.",
    status: "active",
    requiresLegalReview: false,
    requiresComplianceReview: false,
    liveExecutionEnabled: false,
  },
  {
    id: "MOM-PHASE-03",
    phase: 3,
    name: "Sponsor and Partnership Documentation Tools",
    description:
      "Templates and workflow tools for documenting sponsor relationships and brand integration frameworks. " +
      "Actual agreements require separate legal infrastructure.",
    status: "active",
    requiresLegalReview: true,
    requiresComplianceReview: false,
    liveExecutionEnabled: false,
  },
  {
    id: "MOM-PHASE-04",
    phase: 4,
    name: "AI Analytics Documentation Framework",
    description:
      "Informational documentation of AI use cases in sports operations. " +
      "No live trading, arbitrage, or investment recommendation systems included.",
    status: "active",
    requiresLegalReview: false,
    requiresComplianceReview: false,
    liveExecutionEnabled: false,
  },
  {
    id: "MOM-PHASE-05",
    phase: 5,
    name: "Blockchain and Technology Documentation",
    description:
      "Educational overview of blockchain applications in sports. Conceptual only. " +
      "No tokens issued, no blockchain transactions executed, no investment solicited.",
    status: "simulation",
    requiresLegalReview: true,
    requiresComplianceReview: true,
    liveExecutionEnabled: false,
  },
  {
    id: "MOM-PHASE-06",
    phase: 6,
    name: "NIL Integration",
    description:
      "Integration with Troptions NIL Layer-1 compliance framework for athlete NIL documentation. " +
      "Simulation only. No live payments or token issuance.",
    status: "simulation",
    requiresLegalReview: true,
    requiresComplianceReview: true,
    liveExecutionEnabled: false,
  },
  {
    id: "MOM-PHASE-07",
    phase: 7,
    name: "Compliance Gate Management",
    description:
      "Central gate-locking system ensuring no feature advances beyond documentation/simulation " +
      "without explicit compliance clearance.",
    status: "active",
    requiresLegalReview: false,
    requiresComplianceReview: false,
    liveExecutionEnabled: false,
  },
] as const;

// ─── Compliance Gates ─────────────────────────────────────────────────────────

export type MomentumGateStatus = "locked" | "simulation" | "partial" | "active";

export interface MomentumComplianceGate {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly status: MomentumGateStatus;
  readonly requiredForActivation: readonly string[];
  readonly currentBlock: string;
}

export const MOMENTUM_COMPLIANCE_GATES: readonly MomentumComplianceGate[] = [
  {
    id: "GATE-SEC",
    name: "Securities Law",
    domain: "SEC / State Securities Regulators",
    status: "locked",
    requiredForActivation: [
      "Written securities counsel legal opinion",
      "Securities registration or valid exemption filing",
      "Investor accreditation verification",
    ],
    currentBlock: "No securities offering active. No token issuance permitted.",
  },
  {
    id: "GATE-COMMODITY",
    name: "Commodity Law",
    domain: "CFTC / NFA",
    status: "locked",
    requiredForActivation: [
      "Legal opinion on commodity classification",
      "CPO/CTA registration if pooled trading occurs",
    ],
    currentBlock: "No commodity trading features active.",
  },
  {
    id: "GATE-AML",
    name: "AML / KYC / Sanctions",
    domain: "FinCEN / OFAC / BSA",
    status: "locked",
    requiredForActivation: [
      "Written AML/BSA compliance program",
      "KYC identity verification infrastructure",
      "OFAC sanctions screening",
      "SAR filing procedures",
    ],
    currentBlock: "No payment processing active. AML/KYC not applicable until payment features activated.",
  },
  {
    id: "GATE-MTL",
    name: "Money Transmission",
    domain: "State MTL Regulators / FinCEN",
    status: "locked",
    requiredForActivation: [
      "Money Transmitter License in each operating state",
      "Surety bonds per state requirements",
      "FinCEN MSB registration",
    ],
    currentBlock: "No money transmission features active.",
  },
  {
    id: "GATE-IA",
    name: "Investment Adviser",
    domain: "SEC Investment Advisers Act",
    status: "locked",
    requiredForActivation: [
      "RIA registration if providing investment advice for compensation",
      "Clear disclosure that no investment advice is provided",
    ],
    currentBlock: "No investment advice features active. All analytics are informational only.",
  },
  {
    id: "GATE-BANK",
    name: "Banking",
    domain: "Federal Reserve / OCC / FDIC / State Banking Regulators",
    status: "locked",
    requiredForActivation: [
      "Banking charter or FDIC-insured partner institution",
      "Remove all 'digital bank' representations",
    ],
    currentBlock: "Platform does not operate as a bank and makes no banking representations.",
  },
  {
    id: "GATE-CONSUMER",
    name: "Consumer Protection / Advertising",
    domain: "FTC / State AGs / CFPB",
    status: "partial",
    requiredForActivation: [
      "All capability claims verified before publication",
      "Forward-looking statements labeled as such",
    ],
    currentBlock: "All public-facing content must pass this gate before publication.",
  },
  {
    id: "GATE-PRIVACY",
    name: "Data Privacy",
    domain: "FTC / GDPR / CCPA",
    status: "partial",
    requiredForActivation: [
      "Privacy policy drafted and published",
      "DPAs with all data processors",
      "GDPR Article 30 records maintained",
    ],
    currentBlock: "Privacy policy required before any user data collection begins.",
  },
  {
    id: "GATE-NIL",
    name: "NIL / Sports-Specific",
    domain: "NCAA / State NIL Laws / League CBAs",
    status: "simulation",
    requiredForActivation: [
      "NIL legal counsel review for any student-athlete feature",
      "CBA compliance for professional athletes",
    ],
    currentBlock: "NIL integration in simulation mode only. Links to Troptions NIL Layer-1.",
  },
] as const;

// ─── Risk Disclosures ─────────────────────────────────────────────────────────

export interface MomentumRiskDisclosure {
  readonly id: string;
  readonly category: string;
  readonly disclosure: string;
  readonly mandatory: boolean;
}

export const MOMENTUM_RISK_DISCLOSURES: readonly MomentumRiskDisclosure[] = [
  {
    id: "RISK-001",
    category: "No Financial Returns",
    disclosure:
      "Troptions Momentum does not guarantee, imply, or represent any financial return, yield, profit, " +
      "passive income, or investment outcome. No past, projected, or hypothetical performance figures " +
      "should be construed as a guarantee of future results.",
    mandatory: true,
  },
  {
    id: "RISK-002",
    category: "Not a Securities Offering",
    disclosure:
      "Nothing in the Troptions Momentum program constitutes an offer or sale of securities, an offer " +
      "of investment contracts, or a solicitation of any investment. Any token, fractional interest, or " +
      "digital asset described in this documentation is conceptual and may not be offered without " +
      "applicable securities registration or valid exemption.",
    mandatory: true,
  },
  {
    id: "RISK-003",
    category: "Not a Bank or Financial Institution",
    disclosure:
      "Troptions Momentum is not a bank, credit union, savings institution, or any other type of " +
      "federally or state-chartered depository institution. Funds held in connection with Troptions " +
      "Momentum are not FDIC insured and are not protected by any federal or state deposit insurance program.",
    mandatory: true,
  },
  {
    id: "RISK-004",
    category: "Not Investment or Legal Advice",
    disclosure:
      "Nothing in this program constitutes investment advice, legal advice, tax advice, or financial " +
      "planning advice. Users should consult qualified professionals before making any financial, legal, " +
      "or investment decisions.",
    mandatory: true,
  },
  {
    id: "RISK-005",
    category: "Blockchain and Technology Risk",
    disclosure:
      "Blockchain technology, smart contracts, and digital assets involve significant technical and " +
      "regulatory risks including but not limited to: software bugs, security vulnerabilities, " +
      "regulatory changes, loss of private keys, market volatility, and lack of insurance. " +
      "All blockchain features described are conceptual until compliance gates are cleared.",
    mandatory: true,
  },
  {
    id: "RISK-006",
    category: "Jurisdiction Risk",
    disclosure:
      "The laws governing digital assets, tokens, blockchain technology, and financial services vary " +
      "significantly by jurisdiction and are rapidly evolving. Features available in one jurisdiction " +
      "may be prohibited in another. No feature is activated without jurisdiction-specific legal review.",
    mandatory: true,
  },
] as const;

// ─── Allowed Claims ───────────────────────────────────────────────────────────

export interface MomentumClaim {
  readonly id: string;
  readonly claim: string;
  readonly allowed: boolean;
  readonly reason: string;
}

export const MOMENTUM_ALLOWED_CLAIMS: readonly MomentumClaim[] = [
  {
    id: "CLAIM-A-001",
    claim: "Troptions Momentum provides documentation frameworks for sports ecosystem participants.",
    allowed: true,
    reason: "Accurate description of documentation service — no financial claims.",
  },
  {
    id: "CLAIM-A-002",
    claim: "Troptions Momentum includes compliance-readiness checklists and gate-based activation protocols.",
    allowed: true,
    reason: "Accurate description of compliance tooling — no financial claims.",
  },
  {
    id: "CLAIM-A-003",
    claim: "Troptions Momentum provides informational AI analytics documentation.",
    allowed: true,
    reason: "Informational, non-advisory description.",
  },
  {
    id: "CLAIM-A-004",
    claim: "Troptions Momentum provides ESG framework documentation.",
    allowed: true,
    reason: "Educational ESG documentation — no commodity trading claims.",
  },
  {
    id: "CLAIM-A-005",
    claim: "Blockchain and payment features require separate legal review before activation.",
    allowed: true,
    reason: "Accurate disclosure statement.",
  },
] as const;

// ─── Prohibited Claims ────────────────────────────────────────────────────────

export const MOMENTUM_PROHIBITED_CLAIMS: readonly MomentumClaim[] = [
  {
    id: "CLAIM-P-001",
    claim: "high-yield financial landscape",
    allowed: false,
    reason: "Implies guaranteed yield — prohibited under securities and consumer protection law.",
  },
  {
    id: "CLAIM-P-002",
    claim: "yield farming",
    allowed: false,
    reason: "DeFi activity regulated as financial service — not permitted without applicable licenses.",
  },
  {
    id: "CLAIM-P-003",
    claim: "fractional stadium ownership",
    allowed: false,
    reason: "Fractional ownership of revenue-generating assets is likely a security — requires SEC registration.",
  },
  {
    id: "CLAIM-P-004",
    claim: "fan micro-investments",
    allowed: false,
    reason: "Soliciting investments from fans without registration is a securities law violation.",
  },
  {
    id: "CLAIM-P-005",
    claim: "digital dividend",
    allowed: false,
    reason: "Revenue distribution to token holders is a securities offering requiring registration.",
  },
  {
    id: "CLAIM-P-006",
    claim: "democratize investment",
    allowed: false,
    reason: "Investment solicitation language without proper offering documents.",
  },
  {
    id: "CLAIM-P-007",
    claim: "real-time arbitrage",
    allowed: false,
    reason: "Automated arbitrage execution constitutes investment adviser or commodity trading activity.",
  },
  {
    id: "CLAIM-P-008",
    claim: "unlock new revenue streams",
    allowed: false,
    reason: "Revenue stream promises to participants imply financial returns — not permitted without proper disclosure.",
  },
  {
    id: "CLAIM-P-009",
    claim: "guaranteed access to high-value markets",
    allowed: false,
    reason: "No market access can be guaranteed — misleading under consumer protection law.",
  },
  {
    id: "CLAIM-P-010",
    claim: "tokenized revenue streams",
    allowed: false,
    reason: "Tokenized revenue participation is a securities offering requiring registration.",
  },
] as const;
