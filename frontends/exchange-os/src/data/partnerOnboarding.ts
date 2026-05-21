// TROPTIONS Partner Onboarding Pipeline
// All partner tokens must complete this pipeline before any public launch claim.

export type OnboardingStageStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_partner"
  | "awaiting_committee"
  | "approved"
  | "blocked"
  | "rejected";

export type OnboardingStage = {
  id: string;
  step: number;
  title: string;
  description: string;
  requiredInputs: string[];
  deliverables: string[];
  status: OnboardingStageStatus;
  ownerParty: "partner" | "troptions" | "committee" | "legal" | "technical";
  estimatedDuration: string;
  notes: string;
};

export const PARTNER_ONBOARDING_PIPELINE: OnboardingStage[] = [
  {
    id: "initial_inquiry",
    step: 1,
    title: "Initial Inquiry",
    description: "Partner submits initial inquiry with project overview, chain preference, and token objectives.",
    requiredInputs: [
      "Project name and description",
      "Token utility summary",
      "Chain preference (Solana / XRPL / EVM)",
      "Point of contact",
    ],
    deliverables: ["Inquiry acknowledgment", "Preliminary fit assessment"],
    status: "not_started",
    ownerParty: "partner",
    estimatedDuration: "1-3 business days",
    notes: "No commitment made at this stage. TROPTIONS evaluates fit.",
  },
  {
    id: "nda_signing",
    step: 2,
    title: "NDA / Confidentiality Agreement",
    description: "Mutual NDA executed before any sensitive information is shared in either direction.",
    requiredInputs: ["Signed NDA from authorized representative"],
    deliverables: ["Countersigned NDA", "Onboarding intake form"],
    status: "not_started",
    ownerParty: "legal",
    estimatedDuration: "1-5 business days",
    notes: "No due diligence begins until NDA is signed.",
  },
  {
    id: "entity_verification",
    step: 3,
    title: "Entity Verification",
    description: "TROPTIONS verifies the legal entity: incorporation documents, registered agents, and authorized signers.",
    requiredInputs: [
      "Certificate of incorporation",
      "Registered agent information",
      "List of all beneficial owners >25%",
      "Government IDs for authorized signers",
    ],
    deliverables: ["Entity verification memo"],
    status: "not_started",
    ownerParty: "partner",
    estimatedDuration: "3-7 business days",
    notes: "All documents must be certified copies or notarized.",
  },
  {
    id: "kyc_aml_screening",
    step: 4,
    title: "KYC/AML Screening",
    description: "Full KYC/AML screening for all beneficial owners and authorized signers through approved vendor.",
    requiredInputs: [
      "Consent forms from all screened individuals",
      "IDs for all beneficial owners",
      "Source of funds documentation",
    ],
    deliverables: ["KYC/AML screening report", "Sanctions clearance", "Risk score"],
    status: "not_started",
    ownerParty: "troptions",
    estimatedDuration: "3-10 business days",
    notes: "Any OFAC/UN/EU/HMT matches are automatic blockers.",
  },
  {
    id: "legal_memo_review",
    step: 5,
    title: "Legal Memo / Opinion Letter",
    description: "Partner submits attorney opinion letter on token classification. TROPTIONS legal reviews.",
    requiredInputs: [
      "Attorney opinion letter from licensed attorney",
      "Howey test analysis",
      "Token utility documentation",
      "Any prior regulatory correspondence",
    ],
    deliverables: ["Legal review memo", "Classification decision", "Required disclaimers"],
    status: "not_started",
    ownerParty: "legal",
    estimatedDuration: "5-15 business days",
    notes: "TROPTIONS legal may request additional analysis before approving.",
  },
  {
    id: "technical_review",
    step: 6,
    title: "Technical Review",
    description: "TROPTIONS technical team reviews token program, wallet authority chain, and DEX integration plan.",
    requiredInputs: [
      "Smart contract / program audit report",
      "Wallet authority chain documentation",
      "Token parameters (supply, mint/freeze authority)",
      "Target DEX venues and pool plan",
    ],
    deliverables: ["Technical review memo", "Authority chain diagram", "Integration readiness score"],
    status: "not_started",
    ownerParty: "technical",
    estimatedDuration: "5-10 business days",
    notes: "Any critical audit findings are automatic blockers.",
  },
  {
    id: "proof_packet_assembly",
    step: 7,
    title: "Proof Packet Assembly",
    description: "Full proof packet assembled from all completed diligence documents.",
    requiredInputs: [
      "All prior stage deliverables",
      "On-chain token verification",
      "LP lock proof",
      "Final token parameters",
    ],
    deliverables: ["Draft proof packet", "Proof packet completeness score"],
    status: "not_started",
    ownerParty: "troptions",
    estimatedDuration: "2-5 business days",
    notes: "No proof packet is issued until all required fields are verified.",
  },
  {
    id: "partner_agreement",
    step: 8,
    title: "Partner Agreement Execution",
    description: "Formal partner agreement covering scope, fees, no-hype commitments, monitoring requirements, and termination rights.",
    requiredInputs: ["Signed partner agreement from authorized representative"],
    deliverables: ["Countersigned partner agreement"],
    status: "not_started",
    ownerParty: "legal",
    estimatedDuration: "3-7 business days",
    notes: "No launch committee review begins without executed agreement.",
  },
  {
    id: "launch_committee_review",
    step: 9,
    title: "Launch Committee Review",
    description: "Full launch committee review of proof packet, legal memo, KYC/AML, audit, and partner agreement.",
    requiredInputs: [
      "Complete proof packet",
      "All diligence documents",
      "Partner agreement",
      "All committee members available",
    ],
    deliverables: ["GO / NO-GO / CONDITIONAL-GO decision", "Committee sign-off document"],
    status: "not_started",
    ownerParty: "committee",
    estimatedDuration: "5-10 business days",
    notes: "Any committee member with veto authority can block a GO decision.",
  },
  {
    id: "public_claims_review",
    step: 10,
    title: "Public Claims Review",
    description: "All draft public statements reviewed for accuracy, truth labels, no investment language, and no fake claims.",
    requiredInputs: [
      "All draft press releases",
      "Website copy",
      "Social media messaging",
      "Partner marketing materials",
    ],
    deliverables: ["Approved public claims document", "Required disclaimers"],
    status: "not_started",
    ownerParty: "legal",
    estimatedDuration: "2-5 business days",
    notes: "Any investment-adjacent language is a blocker.",
  },
  {
    id: "pilot_launch",
    step: 11,
    title: "Pilot / Gated Launch",
    description: "Limited launch with enhanced monitoring, gated access, and defined rollback criteria.",
    requiredInputs: ["Committee GO decision", "Monitoring setup confirmed", "Rollback plan defined"],
    deliverables: ["Pilot launch memo", "Monitoring dashboard active"],
    status: "not_started",
    ownerParty: "troptions",
    estimatedDuration: "Ongoing — minimum 30 days pilot",
    notes: "Full mainnet launch only after successful pilot with no incidents.",
  },
  {
    id: "ongoing_monitoring",
    step: 12,
    title: "Ongoing Monitoring",
    description: "Continuous monitoring of token authority, LP activity, volume patterns, and compliance status.",
    requiredInputs: ["Monitoring parameters defined", "Alert thresholds set", "Incident response plan active"],
    deliverables: ["Weekly monitoring report", "Incident alerts (if any)"],
    status: "not_started",
    ownerParty: "troptions",
    estimatedDuration: "Ongoing",
    notes: "Monitoring continues for the full lifecycle of the partner relationship.",
  },
];

export const PARTNER_ONBOARDING_WHAT_TROPTIONS_PROVIDES = [
  "Exchange OS infrastructure — launch control, proof, compliance, route intelligence",
  "Proof packet generation and verification tooling",
  "Non-custodial trading interface layer",
  "Institutional due diligence guidance and document templates",
  "Launch committee review process",
  "Market monitoring and alerting infrastructure",
  "XRPL and Solana integration intelligence",
] as const;

export const PARTNER_ONBOARDING_WHAT_TROPTIONS_REFUSES = [
  "Custody or control of partner or user assets",
  "Guarantee of listings on any exchange or DEX",
  "Investment advice or yield projections",
  "Volume simulation or fake liquidity",
  "Token promotion or endorsement",
  "Acting as broker/dealer, underwriter, or market maker",
  "Legal advice (TROPTIONS legal review is due diligence, not legal counsel to the partner)",
] as const;
