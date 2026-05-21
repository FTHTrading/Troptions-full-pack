// TROPTIONS Launch Committee Controls
// Every token launch requires committee GO before any public claim is made.

export type CommitteeDecision = "GO" | "NO_GO" | "CONDITIONAL_GO" | "PENDING" | "ESCALATED";

export type ReviewerRole =
  | "legal_counsel"
  | "compliance_officer"
  | "technical_lead"
  | "security_auditor"
  | "kyc_aml_officer"
  | "executive_sponsor";

export type RequiredReviewer = {
  role: ReviewerRole;
  title: string;
  responsibilities: string[];
  vetoAuthority: boolean;
};

export const REQUIRED_REVIEWERS: RequiredReviewer[] = [
  {
    role: "legal_counsel",
    title: "Legal Counsel",
    responsibilities: [
      "Review legal memo and opinion letter",
      "Confirm Howey test analysis",
      "Verify jurisdiction compliance",
      "Review token utility claims for accuracy",
    ],
    vetoAuthority: true,
  },
  {
    role: "compliance_officer",
    title: "Compliance Officer",
    responsibilities: [
      "Review KYC/AML reports",
      "Confirm sanctions screening",
      "Verify beneficial ownership",
      "Approve compliance documentation",
    ],
    vetoAuthority: true,
  },
  {
    role: "technical_lead",
    title: "Technical Lead",
    responsibilities: [
      "Verify smart contract / program audit",
      "Confirm wallet authority chain",
      "Validate on-chain token parameters",
      "Review DEX integration proof",
    ],
    vetoAuthority: true,
  },
  {
    role: "security_auditor",
    title: "Security Auditor",
    responsibilities: [
      "Review audit firm credentials",
      "Confirm audit scope covers all in-scope programs",
      "Flag unresolved critical/high findings",
      "Approve or reject based on audit status",
    ],
    vetoAuthority: true,
  },
  {
    role: "kyc_aml_officer",
    title: "KYC/AML Officer",
    responsibilities: [
      "Sign off on KYC/AML vendor results",
      "Review PEP and adverse media screening",
      "Approve or reject based on risk score",
    ],
    vetoAuthority: true,
  },
  {
    role: "executive_sponsor",
    title: "Executive Sponsor",
    responsibilities: [
      "Final GO / NO-GO authority",
      "Escalation resolution",
      "Partner relationship oversight",
    ],
    vetoAuthority: true,
  },
];

export type RequiredDocument = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  vetoIfMissing: boolean;
};

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    id: "legal_memo",
    name: "Legal Memo / Opinion Letter",
    description: "Attorney opinion on token classification, utility claims, and regulatory status",
    required: true,
    vetoIfMissing: true,
  },
  {
    id: "kyc_aml_report",
    name: "KYC/AML Screening Report",
    description: "Completed KYC/AML for all beneficial owners and authorized signers",
    required: true,
    vetoIfMissing: true,
  },
  {
    id: "smart_contract_audit",
    name: "Smart Contract / Program Audit",
    description: "Third-party security audit with no unresolved critical or high findings",
    required: true,
    vetoIfMissing: true,
  },
  {
    id: "proof_packet",
    name: "Complete Proof Packet",
    description: "All required proof packet fields verified and signed off",
    required: true,
    vetoIfMissing: true,
  },
  {
    id: "partner_agreement",
    name: "Partner Agreement",
    description: "Signed agreement between partner and TROPTIONS covering scope, limitations, and no-hype commitments",
    required: true,
    vetoIfMissing: true,
  },
  {
    id: "lp_lock_proof",
    name: "LP Lock Proof",
    description: "Evidence of initial liquidity lock or time-lock",
    required: true,
    vetoIfMissing: false,
  },
  {
    id: "public_claim_review",
    name: "Public Claims Review",
    description: "All draft public statements reviewed for accuracy, no investment language, no fake-live claims",
    required: true,
    vetoIfMissing: true,
  },
];

export type CommitteeBlocker = {
  id: string;
  category: string;
  description: string;
  resolution: string;
  severity: "critical" | "high" | "medium";
};

export const COMMITTEE_BLOCKERS: CommitteeBlocker[] = [
  {
    id: "no_legal_memo",
    category: "Legal",
    description: "No legal memo or opinion letter submitted",
    resolution: "Obtain attorney opinion before committee review",
    severity: "critical",
  },
  {
    id: "kyc_aml_incomplete",
    category: "Compliance",
    description: "KYC/AML screening not completed for all beneficial owners",
    resolution: "Complete full KYC/AML screening through approved vendor",
    severity: "critical",
  },
  {
    id: "unresolved_audit_critical",
    category: "Security",
    description: "Unresolved critical severity findings in smart contract audit",
    resolution: "Remediate all critical findings and obtain re-audit sign-off",
    severity: "critical",
  },
  {
    id: "investment_language",
    category: "Legal",
    description: "Investment, returns, yield, or profit language detected in partner materials",
    resolution: "Remove all investment-adjacent language from all public materials",
    severity: "critical",
  },
  {
    id: "fake_volume_claim",
    category: "Compliance",
    description: "Partner materials imply or suggest volume guarantees or fabricated metrics",
    resolution: "Remove all volume, liquidity, or trading guarantees from all materials",
    severity: "critical",
  },
  {
    id: "mint_authority_undisclosed",
    category: "Technical",
    description: "Mint authority not disclosed or verified",
    resolution: "Document mint authority status on-chain and in proof packet",
    severity: "high",
  },
  {
    id: "no_partner_agreement",
    category: "Legal",
    description: "No signed partner agreement in place",
    resolution: "Execute partner agreement before proceeding",
    severity: "critical",
  },
];

export type EscalationTrigger = {
  id: string;
  description: string;
  escalateTo: string;
  timeLimit: string;
};

export const ESCALATION_TRIGGERS: EscalationTrigger[] = [
  {
    id: "regulatory_inquiry",
    description: "Any regulatory inquiry, subpoena, or contact from regulatory authority",
    escalateTo: "Legal Counsel + Executive Sponsor",
    timeLimit: "Immediate",
  },
  {
    id: "security_incident",
    description: "Any security incident, key compromise, or unauthorized access",
    escalateTo: "Security Auditor + Technical Lead + Executive Sponsor",
    timeLimit: "Immediate",
  },
  {
    id: "wash_trade_detected",
    description: "Wash-trade pattern detected in monitoring for an active partner token",
    escalateTo: "Compliance Officer + Executive Sponsor",
    timeLimit: "Within 1 hour",
  },
  {
    id: "mint_authority_change",
    description: "Unexpected mint authority change on a live partner token",
    escalateTo: "Technical Lead + Compliance Officer",
    timeLimit: "Within 1 hour",
  },
  {
    id: "committee_split",
    description: "Committee vote split — no consensus on GO / NO-GO",
    escalateTo: "Executive Sponsor",
    timeLimit: "Within 24 hours",
  },
];
