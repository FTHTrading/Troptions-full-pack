/**
 * XRPL / Stellar Institutional Compliance Registry
 *
 * Defines all compliance control domains for institutional XRPL and Stellar operations.
 *
 * SAFETY RULES:
 * - liveExecutionAllowed: false on every control
 * - productionActivationStatus: "disabled" until legal review completes
 * - No claim of global legal approval, ISO certification, or GENIUS Act approval
 * - All controls require evidence and approval before production
 */

// ─── Execution Mode ────────────────────────────────────────────────────────────

export type InstitutionalExecutionMode =
  | "read_only"
  | "simulation_only"
  | "unsigned_template_only"
  | "testnet_only"
  | "approval_required"
  | "disabled";

export type ComplianceChain = "XRPL" | "Stellar" | "Both";

export type ComplianceControlStatus =
  | "not_started"
  | "in_progress"
  | "pending_legal_review"
  | "pending_evidence"
  | "approved_not_executed"
  | "blocked";

export type ProductionActivationStatus =
  | "disabled"
  | "pending_legal_review"
  | "pending_evidence"
  | "approved_staging_only"
  | "blocked";

// ─── Compliance Control ────────────────────────────────────────────────────────

export interface InstitutionalComplianceControl {
  readonly id: string;
  readonly displayName: string;
  readonly appliesTo: ComplianceChain;
  readonly purpose: string;
  readonly currentStatus: ComplianceControlStatus;
  readonly executionMode: InstitutionalExecutionMode;
  readonly requiredEvidence: readonly string[];
  readonly requiredApprovals: readonly string[];
  readonly jurisdictionNotes: string;
  readonly riskIfMissing: string;
  readonly recommendedNextAction: string;
  readonly liveExecutionAllowed: false;
  readonly productionActivationStatus: ProductionActivationStatus;
  readonly legalReviewRequired: true;
}

// ─── Control Domain Registry ───────────────────────────────────────────────────

export const INSTITUTIONAL_COMPLIANCE_CONTROLS: readonly InstitutionalComplianceControl[] = [
  {
    id: "ISO_20022_MESSAGE_COMPATIBILITY",
    displayName: "ISO 20022 Message Compatibility",
    appliesTo: "Both",
    purpose: "Map XRPL/Stellar operations to ISO 20022 message-concept equivalents for integration gateway readiness. ISO 20022 is a financial messaging standard — not a token certification.",
    currentStatus: "in_progress",
    executionMode: "simulation_only",
    requiredEvidence: [
      "ISO 20022 message mapping documentation",
      "Integration gateway technical specification",
      "Legal review of messaging representation",
    ],
    requiredApprovals: ["Compliance Counsel", "Technical Architecture Review"],
    jurisdictionNotes: "ISO 20022 readiness applies globally as a message format standard. Actual financial institution integration requires jurisdiction-specific licensing.",
    riskIfMissing: "Cannot represent XRPL/Stellar operations in standardized financial messaging formats for institutional integration gateways.",
    recommendedNextAction: "Complete iso20022Mapping.ts with message-readiness mappings only. Do not claim chain is ISO-certified.",
    liveExecutionAllowed: false,
    productionActivationStatus: "pending_legal_review",
    legalReviewRequired: true,
  },
  {
    id: "GENIUS_ACT_STABLECOIN_READINESS",
    displayName: "GENIUS Act Stablecoin Readiness",
    appliesTo: "Both",
    purpose: "Evaluate readiness for compliance with the GENIUS Act framework for permitted payment stablecoin issuers, including AML/BSA, reserve, redemption, and disclosure requirements.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Permitted issuer legal opinion",
      "1:1 reserve policy documentation",
      "Redemption-at-par policy",
      "AML/BSA program documentation",
      "Sanctions compliance program documentation",
      "Monthly attestation/disclosure process documentation",
      "Federal or state chartering pathway evidence",
    ],
    requiredApprovals: ["Compliance Counsel", "Board Authorization", "Regulatory Approval"],
    jurisdictionNotes: "GENIUS Act applies to US-regulated payment stablecoin issuers. Non-US operations require separate jurisdiction analysis.",
    riskIfMissing: "Stablecoin issuance without GENIUS Act compliance framework creates significant regulatory risk under US law.",
    recommendedNextAction: "Build geniusActReadinessEngine.ts with simulation-only evaluation. Stablecoin issuance remains disabled until all evidence gates pass.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "FATF_TRAVEL_RULE_READINESS",
    displayName: "FATF Travel Rule Readiness",
    appliesTo: "Both",
    purpose: "Evaluate readiness to comply with FATF Recommendation 16 (Travel Rule) — transmitting originator and beneficiary information for qualifying virtual asset transfers.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Travel Rule policy documentation",
      "VASP identification process",
      "Originator/beneficiary data collection process",
      "Counterparty VASP screening process",
      "Travel Rule threshold configuration per jurisdiction",
    ],
    requiredApprovals: ["Compliance Counsel", "VASP Registration Authority"],
    jurisdictionNotes: "FATF Travel Rule thresholds vary by jurisdiction (commonly USD/EUR 1,000). Cross-border transfers require VASP-to-VASP information exchange.",
    riskIfMissing: "Qualifying virtual asset transfers without Travel Rule compliance create FATF non-compliance risk and potential correspondent banking restrictions.",
    recommendedNextAction: "Document Travel Rule readiness posture. All qualifying transfers remain simulation-only until compliance framework is complete.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "AML_PROGRAM_READINESS",
    displayName: "AML Program Readiness",
    appliesTo: "Both",
    purpose: "Evaluate readiness of the AML program including transaction monitoring, suspicious activity reporting, and recordkeeping requirements.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "AML policy and procedures documentation",
      "Transaction monitoring system specification",
      "Suspicious activity reporting process",
      "Recordkeeping policy",
      "AML officer appointment",
      "Staff training program",
    ],
    requiredApprovals: ["Compliance Counsel", "Board AML Officer", "Regulatory Registration"],
    jurisdictionNotes: "AML requirements vary by jurisdiction but generally require BSA compliance in the US, AMLD compliance in the EU, and equivalent frameworks globally.",
    riskIfMissing: "Operating without an AML program creates severe regulatory risk including civil and criminal penalties.",
    recommendedNextAction: "Document AML readiness gaps. No live transactions until AML program is established and approved.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "SANCTIONS_SCREENING_READINESS",
    displayName: "Sanctions Screening Readiness",
    appliesTo: "Both",
    purpose: "Evaluate readiness to screen all parties against OFAC SDN list, EU consolidated sanctions list, UN sanctions list, and other applicable lists.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Sanctions screening policy documentation",
      "Screening system vendor selection",
      "Screening frequency policy",
      "False positive handling process",
      "Sanctions hit escalation process",
    ],
    requiredApprovals: ["Compliance Counsel", "OFAC Compliance Officer"],
    jurisdictionNotes: "US OFAC sanctions apply extraterritorially. EU, UK, and UN sanctions require separate screening. Jurisdiction-specific lists may apply.",
    riskIfMissing: "Transacting with sanctioned parties creates severe legal exposure including civil monetary penalties and criminal liability.",
    recommendedNextAction: "All wallet interactions remain blocked for unknown sanctions status. Implement screening before any production activation.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "KYC_KYB_READINESS",
    displayName: "KYC / KYB Readiness",
    appliesTo: "Both",
    purpose: "Evaluate readiness to collect and verify customer identity (KYC) and business entity identity (KYB) before onboarding.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "KYC/KYB policy documentation",
      "Identity verification system specification",
      "Beneficial ownership collection process",
      "Ongoing monitoring policy",
      "Data retention policy",
    ],
    requiredApprovals: ["Compliance Counsel", "Data Privacy Counsel"],
    jurisdictionNotes: "KYC/KYB requirements vary by jurisdiction. Enhanced due diligence required for high-risk jurisdictions, PEPs, and high-value transactions.",
    riskIfMissing: "Onboarding without KYC/KYB creates AML, BSA, and regulatory risk. Unknown KYC status blocks all operations by default.",
    recommendedNextAction: "All user/entity operations require verified KYC/KYB. Maintain unknown-blocks as default.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "JURISDICTION_RULES",
    displayName: "Jurisdiction Rules",
    appliesTo: "Both",
    purpose: "Per-jurisdiction rules controlling which operations, products, and services are permitted, restricted, or prohibited in each regulatory environment.",
    currentStatus: "in_progress",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Jurisdiction-by-jurisdiction legal analysis",
      "Local counsel opinion per operating jurisdiction",
      "Regulatory registration/licensing per jurisdiction",
    ],
    requiredApprovals: ["Compliance Counsel per jurisdiction", "Local Counsel per jurisdiction"],
    jurisdictionNotes: "No jurisdiction is approved for production operations without legal review. Global availability claims are blocked.",
    riskIfMissing: "Operating without jurisdiction-specific controls creates unlicensed money transmission, securities, and VASP registration risk.",
    recommendedNextAction: "Expand jurisdiction matrix with per-jurisdiction production gates. Default all jurisdictions to legal-review-required.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "ISSUER_AUTHORIZATION",
    displayName: "Issuer Authorization",
    appliesTo: "Both",
    purpose: "Controls governing who may issue assets, under what legal authority, with what reserve backing, and subject to which regulatory framework.",
    currentStatus: "not_started",
    executionMode: "approval_required",
    requiredEvidence: [
      "Issuer legal entity formation documents",
      "Regulatory approval or exemption documentation",
      "Board resolution authorizing issuance",
      "Reserve auditor appointment",
    ],
    requiredApprovals: ["Board Authorization", "Compliance Counsel", "Regulatory Approval"],
    jurisdictionNotes: "Issuer authorization requirements vary significantly by jurisdiction. US requires federal or state charter for payment stablecoin issuers under GENIUS Act.",
    riskIfMissing: "Unauthorized asset issuance creates regulatory, securities, and money transmission violations.",
    recommendedNextAction: "No assets may be issued until issuer authorization evidence gates pass and Control Hub approval is granted.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "TRUSTLINE_PERMISSIONING",
    displayName: "Trustline Permissioning",
    appliesTo: "XRPL",
    purpose: "Controls governing trustline creation — RequireAuth flag, holder verification, and permissioned distribution policies.",
    currentStatus: "pending_legal_review",
    executionMode: "unsigned_template_only",
    requiredEvidence: [
      "Trustline policy documentation",
      "RequireAuth configuration decision",
      "Holder verification process",
    ],
    requiredApprovals: ["Compliance Counsel", "Technical Lead"],
    jurisdictionNotes: "Trustline templates are unsigned only. Live TrustSet transactions require approved issuer authorization.",
    riskIfMissing: "Open trustlines without RequireAuth allow unverified holders to hold issued assets.",
    recommendedNextAction: "All trustline outputs remain unsigned templates only. RequireAuth is recommended for permissioned assets.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "CUSTODY_CONTROL",
    displayName: "Custody Control",
    appliesTo: "Both",
    purpose: "Controls governing treasury key custody, multi-signature requirements, hardware security module (HSM) usage, and key ceremony policies.",
    currentStatus: "not_started",
    executionMode: "approval_required",
    requiredEvidence: [
      "Key custody policy documentation",
      "Multi-signature configuration",
      "HSM specification or equivalent",
      "Key ceremony documentation",
      "Disaster recovery key policy",
    ],
    requiredApprovals: ["Board Authorization", "Security Officer", "Compliance Counsel"],
    jurisdictionNotes: "Custody requirements vary by jurisdiction and asset type. Qualified custodian requirements may apply in the US for certain asset classes.",
    riskIfMissing: "Inadequate custody controls create key loss, theft, and unauthorized transaction risk.",
    recommendedNextAction: "No treasury operations until custody policy is documented and approved. No seeds or private keys in codebase.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "RESERVE_ATTESTATION",
    displayName: "Reserve Attestation",
    appliesTo: "Both",
    purpose: "Controls governing reserve backing verification for stablecoin and asset-backed token issuance, including attestation frequency and auditor independence.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Reserve policy documentation",
      "Auditor appointment and independence documentation",
      "Attestation frequency schedule",
      "Reserve composition policy",
      "Eligible asset definition",
    ],
    requiredApprovals: ["Board Authorization", "External Auditor", "Compliance Counsel"],
    jurisdictionNotes: "GENIUS Act requires monthly attestation for US permitted payment stablecoin issuers. Other jurisdictions may require quarterly or annual attestation.",
    riskIfMissing: "Stablecoin issuance without reserve attestation creates severe consumer harm and regulatory violation risk.",
    recommendedNextAction: "No stablecoin issuance until reserve attestation process is established. Maintain simulation-only posture.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "REDEMPTION_POLICY",
    displayName: "Redemption Policy",
    appliesTo: "Both",
    purpose: "Controls governing stablecoin and asset-backed token redemption at par, including redemption process, timing, fees, and prohibited conditions.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Redemption policy documentation",
      "At-par redemption commitment",
      "Redemption process specification",
      "Prohibited condition list",
    ],
    requiredApprovals: ["Board Authorization", "Compliance Counsel"],
    jurisdictionNotes: "GENIUS Act requires redemption at par on demand for US permitted payment stablecoin issuers.",
    riskIfMissing: "Stablecoin without clear redemption policy creates consumer harm and regulatory violation risk.",
    recommendedNextAction: "Document redemption policy before any stablecoin issuance. Maintain simulation-only posture.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "WALLET_RISK_SCORING",
    displayName: "Wallet Risk Scoring",
    appliesTo: "Both",
    purpose: "Risk scoring of wallet addresses using blockchain analytics data to identify high-risk counterparties, mixing services, darknet market exposure, and sanctions-adjacent activity.",
    currentStatus: "in_progress",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Blockchain analytics vendor selection",
      "Risk scoring policy",
      "Score threshold policy",
      "High-risk wallet escalation process",
    ],
    requiredApprovals: ["Compliance Counsel"],
    jurisdictionNotes: "Wallet risk scoring is a component of AML/KYC programs and is expected by regulators globally.",
    riskIfMissing: "Interacting with high-risk wallets without scoring creates AML and sanctions exposure.",
    recommendedNextAction: "Wallet risk scoring engine exists. Validate policy thresholds and escalation process.",
    liveExecutionAllowed: false,
    productionActivationStatus: "pending_legal_review",
    legalReviewRequired: true,
  },
  {
    id: "TRANSACTION_MONITORING",
    displayName: "Transaction Monitoring",
    appliesTo: "Both",
    purpose: "Ongoing monitoring of transaction patterns for suspicious activity, structuring, layering, and integration consistent with money laundering typologies.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Transaction monitoring policy",
      "Alert rule documentation",
      "SAR filing process",
      "Case management process",
    ],
    requiredApprovals: ["AML Officer", "Compliance Counsel"],
    jurisdictionNotes: "Transaction monitoring is required for BSA-regulated entities in the US and AML-regulated entities globally.",
    riskIfMissing: "Without transaction monitoring, suspicious activity will go undetected creating regulatory and legal exposure.",
    recommendedNextAction: "No live transactions until transaction monitoring system is established.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
  {
    id: "AUDIT_EXPORT",
    displayName: "Audit Export",
    appliesTo: "Both",
    purpose: "Machine-readable audit trail export for regulatory examination, internal audit, and compliance review purposes.",
    currentStatus: "in_progress",
    executionMode: "read_only",
    requiredEvidence: [
      "Audit export format specification",
      "Data retention policy",
      "Audit access control policy",
    ],
    requiredApprovals: ["Compliance Counsel", "Security Officer"],
    jurisdictionNotes: "Audit recordkeeping requirements vary by jurisdiction. BSA requires 5-year retention in the US.",
    riskIfMissing: "Without audit export, regulatory examination readiness is impaired.",
    recommendedNextAction: "Audit export engine exists. Validate retention and access control policies.",
    liveExecutionAllowed: false,
    productionActivationStatus: "pending_legal_review",
    legalReviewRequired: true,
  },
  {
    id: "DISCLOSURE_AND_RISK_LANGUAGE",
    displayName: "Disclosure and Risk Language",
    appliesTo: "Both",
    purpose: "Controls ensuring all public-facing representations include accurate risk disclosures, no guaranteed return/liquidity claims, and jurisdiction-appropriate disclaimers.",
    currentStatus: "in_progress",
    executionMode: "read_only",
    requiredEvidence: [
      "Risk language review by counsel",
      "Prohibited claims list",
      "Disclosure review process",
    ],
    requiredApprovals: ["Compliance Counsel", "Legal Counsel"],
    jurisdictionNotes: "Misleading financial product representations create regulatory and securities law risk globally.",
    riskIfMissing: "Inaccurate risk language creates consumer harm, regulatory, and litigation risk.",
    recommendedNextAction: "Enforce prohibited claims list programmatically via globalCompliancePolicyEngine.ts.",
    liveExecutionAllowed: false,
    productionActivationStatus: "pending_legal_review",
    legalReviewRequired: true,
  },
  {
    id: "CONTROL_HUB_APPROVAL_GATES",
    displayName: "Control Hub Approval Gates",
    appliesTo: "Both",
    purpose: "Every compliance evaluation, simulation, and readiness report must be persisted to the Control Hub with task, simulation, blocked action, audit, and recommendation records.",
    currentStatus: "in_progress",
    executionMode: "approval_required",
    requiredEvidence: [
      "Control Hub governance policy",
      "Approval workflow documentation",
    ],
    requiredApprovals: ["Control Hub Governance Board"],
    jurisdictionNotes: "Control Hub approval gates apply globally across all jurisdictions.",
    riskIfMissing: "Without Control Hub persistence, compliance decisions are not auditable and governance is impaired.",
    recommendedNextAction: "All new compliance engines must connect to Control Hub bridge. Existing bridge covers XRPL/Stellar.",
    liveExecutionAllowed: false,
    productionActivationStatus: "pending_evidence",
    legalReviewRequired: true,
  },
  {
    id: "QUANTUM_RESISTANCE_ROADMAP",
    displayName: "Quantum Resistance Roadmap",
    appliesTo: "Both",
    purpose: "Roadmap for migrating signing keys, cryptographic primitives, and protocol dependencies to quantum-resistant algorithms as standards mature.",
    currentStatus: "not_started",
    executionMode: "simulation_only",
    requiredEvidence: [
      "Post-quantum cryptography readiness assessment",
      "Key migration plan",
      "Protocol dependency analysis",
    ],
    requiredApprovals: ["Security Officer", "Technical Architecture Review"],
    jurisdictionNotes: "NIST post-quantum cryptography standards published. Migration timelines vary by regulator.",
    riskIfMissing: "Long-lived cryptographic keys and data may be vulnerable to future quantum decryption.",
    recommendedNextAction: "Document quantum resistance roadmap. No immediate operational change required.",
    liveExecutionAllowed: false,
    productionActivationStatus: "disabled",
    legalReviewRequired: true,
  },
] as const;

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function getAllComplianceControls(): readonly InstitutionalComplianceControl[] {
  return INSTITUTIONAL_COMPLIANCE_CONTROLS;
}

export function getComplianceControl(id: string): InstitutionalComplianceControl | undefined {
  return INSTITUTIONAL_COMPLIANCE_CONTROLS.find((c) => c.id === id);
}

export function getControlsByChain(chain: ComplianceChain): readonly InstitutionalComplianceControl[] {
  return INSTITUTIONAL_COMPLIANCE_CONTROLS.filter(
    (c) => c.appliesTo === chain || c.appliesTo === "Both"
  );
}

export function getBlockedControls(): readonly InstitutionalComplianceControl[] {
  return INSTITUTIONAL_COMPLIANCE_CONTROLS.filter(
    (c) => c.productionActivationStatus === "disabled" || c.productionActivationStatus === "blocked"
  );
}

/** Safety assertion: no control may have liveExecutionAllowed: true */
export function assertNoLiveExecution(): void {
  for (const c of INSTITUTIONAL_COMPLIANCE_CONTROLS) {
    if ((c.liveExecutionAllowed as boolean) !== false) {
      throw new Error(`SAFETY VIOLATION: control ${c.id} has liveExecutionAllowed !== false`);
    }
  }
}
