/**
 * TROPTIONS PDF Handbook Registry
 *
 * Defines the catalog of downloadable transaction handbooks. Each handbook
 * contains structured content (title, sections, document checklists, workflow
 * steps, compliance disclosures) that is rendered to HTML and served as a
 * downloadable reference packet.
 *
 * Content is versioned and stored here as structured data. A /api/ route
 * serves the content; the UI renders it with a print/download option.
 *
 * SIMULATION-ONLY platform — all disclosures reflect this.
 */

export type HandbookId =
  | "rwa-tokenisation-handbook"
  | "carbon-credit-handbook"
  | "btc-settlement-handbook"
  | "platform-overview-handbook"
  | "onboarding-kyc-handbook";

export interface HandbookSection {
  sectionId: string;
  title: string;
  content: string; // Plain prose (no markdown)
  subsections?: HandbookSection[];
}

export interface HandbookChecklistItem {
  id: string;
  item: string;
  mandatory: boolean;
  notes?: string;
}

export interface HandbookWorkflowStep {
  step: number;
  title: string;
  description: string;
  approvalRequired: boolean;
  blockingIfIncomplete: boolean;
}

export interface HandbookRecord {
  handbookId: HandbookId;
  title: string;
  subtitle: string;
  version: string;
  lastUpdated: string;
  coverDisclosure: string;
  transactionTypes: string[];
  sections: HandbookSection[];
  documentChecklist: HandbookChecklistItem[];
  workflowSteps: HandbookWorkflowStep[];
  smartContractOverview: string;
  legalDisclosure: string;
  contactInfo: string;
}

// ─── Platform-wide Disclosure ─────────────────────────────────────────────────

const PLATFORM_DISCLOSURE =
  "TROPTIONS does not provide custody, exchange services, brokerage, money transmission, investment advice, or carbon offset guarantees. All platform functions are simulation-only until required approvals (provider, legal, compliance, signer, and board) are in place. This document is for informational purposes only and does not constitute an offer to sell or a solicitation to buy any security, commodity, or financial instrument.";

// ─── Handbook Catalog ─────────────────────────────────────────────────────────

export const HANDBOOK_CATALOG: Record<HandbookId, HandbookRecord> = {
  "rwa-tokenisation-handbook": {
    handbookId: "rwa-tokenisation-handbook",
    title: "Real World Asset Tokenisation Handbook",
    subtitle: "Workflow, Requirements, and Compliance Guide",
    version: "1.0.0",
    lastUpdated: "2026-04-28",
    coverDisclosure: PLATFORM_DISCLOSURE,
    transactionTypes: ["RWA Tokenisation & Sale", "Collateral Pledge", "Equity Token Issuance"],
    sections: [
      {
        sectionId: "overview",
        title: "Overview and Scope",
        content:
          "This handbook describes the process for tokenising real-world assets (RWAs) on the TROPTIONS platform. RWAs include gemstones, real estate, equipment, art, and other tangible assets. Tokenisation converts an asset into a digital token representing ownership or economic rights. TROPTIONS records tokenisation workflows and due-diligence evidence but does not provide custody, exchange, or investment services. All tokenisation remains blocked until legal, compliance, and custody approvals are satisfied.",
      },
      {
        sectionId: "legal_framework",
        title: "Legal Framework and Regulatory Considerations",
        content:
          "RWA tokens may constitute securities under applicable law. Issuers must obtain legal opinions confirming the regulatory status of the token and the applicable exemption (e.g., Regulation D, Regulation S, Regulation A+). Transfer restrictions must be embedded in the token standard (e.g., ERC-3643 or TROPTIONS permissioned IOU) to ensure that only verified, eligible holders can receive the token. Unrestricted ERC-20 tokens for regulated assets are a compliance red flag. Issuers must work with licensed securities attorneys and broker-dealers where required.",
      },
      {
        sectionId: "asset_verification",
        title: "Asset Verification and Custody",
        content:
          "Before tokenisation, the underlying asset must be independently appraised, physically verified, and placed with a regulated custodian. The custodian must provide a signed custody statement confirming (a) physical control of the asset, (b) the custodian's regulatory status, and (c) insurance coverage. An independent appraisal not older than 90 days is required for financial transactions. All appraisals, custody statements, and insurance certificates are hashed and stored on IPFS; only hashes and content identifiers (CIDs) are retained in the TROPTIONS registry.",
      },
      {
        sectionId: "smart_contract",
        title: "Smart Contract Overview",
        content:
          "The TROPTIONS escrow contract holds payment tokens from the buyer and asset tokens from the seller until all conditions are satisfied. Conditions include: both deposits received, KYC flags verified, agreements signed, oracle attestation of asset delivery, and Control Hub approval. When all conditions are met, the contract atomically releases payment to the seller and the asset token to the buyer. No release occurs if any condition fails. The escrow contract is simulation-only in the current phase; live deployment requires a formal audit.",
      },
    ],
    documentChecklist: [
      { id: "appraisal", item: "Independent Appraisal Report (≤90 days old)", mandatory: true, notes: "Must be from an accredited appraiser" },
      { id: "custody_stmt", item: "Custody Statement from Regulated Custodian", mandatory: true },
      { id: "spv_agreement", item: "SPV or Legal Wrapper Agreement", mandatory: true },
      { id: "insurance", item: "Insurance Certificate", mandatory: true },
      { id: "prospectus", item: "Offering Prospectus or Information Memorandum", mandatory: true },
      { id: "legal_opinion", item: "Securities Law Opinion Letter", mandatory: true },
      { id: "kyc_id", item: "Government-Issued ID for all UBOs >25%", mandatory: true },
      { id: "kyb_docs", item: "Entity KYB Documents (registration, operating agreement, UBO declaration)", mandatory: true },
      { id: "pledge_agreement", item: "Pledge and Security Agreement (collateral transactions only)", mandatory: false },
    ],
    workflowSteps: [
      { step: 1, title: "Submit Due Diligence Package", description: "Upload all required documents. System hashes each document and stores the hash + IPFS CID. Raw documents are not retained.", approvalRequired: false, blockingIfIncomplete: true },
      { step: 2, title: "KYC / AML Screening", description: "All parties are screened against OFAC, UN, and EU sanctions lists. Identity documents are verified by a licensed KYC provider. Oracle attestation records the compliance flag.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 3, title: "Legal and Compliance Review", description: "Legal counsel reviews the securities law opinion and custody statement. Compliance team reviews the KYC output, sanctions results, and permissioned token standard.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 4, title: "Smart Contract Audit", description: "The escrow and registry contracts are reviewed by an independent auditor. Proof-of-Reserve (PoR) integration with an oracle is confirmed before any live deployment.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 5, title: "Agreement Signatures", description: "All parties sign the subscription or purchase agreement using their wallet (ECDSA for EOAs, EIP-1271 for contract wallets). Signatures are recorded with document hash and timestamp.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 6, title: "Escrow Funding", description: "Buyer deposits payment tokens; seller deposits asset tokens into the escrow contract. All deposits are recorded in the TROPTIONS registry.", approvalRequired: false, blockingIfIncomplete: true },
      { step: 7, title: "Oracle Attestation", description: "An independent oracle (Chainlink or equivalent) attests to asset delivery and confirms the onchain KYC flag is set for both parties.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 8, title: "Control Hub Approval", description: "Final governance approval from the TROPTIONS Control Hub and board where required.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 9, title: "Escrow Release", description: "When all conditions are satisfied, the escrow contract atomically releases payment to the seller and the asset token to the buyer. An immutable audit record is created.", approvalRequired: false, blockingIfIncomplete: false },
    ],
    smartContractOverview:
      "Escrow Contract: holds both payment and asset tokens until all conditions are met; implements atomic release or safe fallback cancellation. Registry Contract: records tokenised asset metadata, ownership history, and evidence hashes. Compliance Gate: queries the onchain KYC flag before any transfer; rejects transfers from unverified addresses.",
    legalDisclosure:
      "This handbook is provided for informational purposes only. It does not constitute legal, financial, or investment advice. RWA tokens may be securities; consult a licensed attorney before proceeding. TROPTIONS does not provide broker-dealer, underwriting, or money-transmission services.",
    contactInfo:
      "For compliance inquiries: compliance@fthtrading.com. For legal questions, consult your own legal counsel.",
  },

  "carbon-credit-handbook": {
    handbookId: "carbon-credit-handbook",
    title: "Carbon Credit Transaction Handbook",
    subtitle: "Verification, Sale, and Retirement Workflows",
    version: "1.0.0",
    lastUpdated: "2026-04-28",
    coverDisclosure: PLATFORM_DISCLOSURE,
    transactionTypes: ["Carbon Credit Sale", "Carbon Credit Retirement"],
    sections: [
      {
        sectionId: "overview",
        title: "Overview and Scope",
        content:
          "This handbook covers the process for recording, verifying, selling, and retiring carbon credits on the TROPTIONS platform. TROPTIONS does not guarantee carbon neutrality, offset validity, registry acceptance, price, liquidity, or resale value. Credits must be independently verified and registered in a recognised registry (Verra VCS, Gold Standard, ACR, or equivalent) before any transaction.",
      },
      {
        sectionId: "registry_standards",
        title: "Registry Standards and Verification",
        content:
          "Accepted registries include Verra Verified Carbon Standard (VCS), Gold Standard, American Carbon Registry (ACR), and Climate Action Reserve (CAR). Credits must be in 'Issued' status in the registry, not yet retired. The seller must demonstrate control of the registry account holding the credits. Third-party verification (by a Verra-approved or equivalent verification body) is required before credits can be sold or pledged.",
      },
      {
        sectionId: "retirement",
        title: "Retirement Rules",
        content:
          "Retirement is permanent and irreversible. Retired credits cannot be resold, transferred, or re-used for any purpose. Before executing a retirement instruction, the instructing party must acknowledge in writing that they understand the irrevocability. The beneficiary entity on whose behalf credits are retired must be specified. TROPTIONS records a retirement event but does not issue carbon-neutral certificates; those are issued directly by the registry.",
      },
    ],
    documentChecklist: [
      { id: "registry_cert", item: "Carbon Registry Certificate (unretired status confirmed)", mandatory: true },
      { id: "project_docs", item: "Project Documentation (MRV plan, methodology)", mandatory: true },
      { id: "verification_report", item: "Third-Party Verification Report from accredited body", mandatory: true },
      { id: "custody_proof", item: "Proof of Registry Account Custody / Ownership", mandatory: true },
      { id: "retirement_status", item: "Registry-issued Confirmation: Credits NOT Yet Retired", mandatory: true },
      { id: "kyc_id", item: "Identity Proof (KYC) for seller and buyer", mandatory: true },
      { id: "retirement_instruction", item: "Signed Retirement Instruction (retirement transactions only)", mandatory: false },
      { id: "beneficiary_decl", item: "Beneficiary Declaration (retirement transactions only)", mandatory: false },
    ],
    workflowSteps: [
      { step: 1, title: "Registry Verification", description: "TROPTIONS confirms credits in the specified registry, verifies unretired status, and hashes registry certificate for evidence.", approvalRequired: false, blockingIfIncomplete: true },
      { step: 2, title: "Additionality Review", description: "Compliance team reviews project for genuine emissions reduction, additionality, and permanence. Flags any concerns for provider review.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 3, title: "KYC / AML Screening", description: "Both seller and buyer are screened. For retirement, the instructing party and beneficiary are screened.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 4, title: "Agreement Signatures", description: "Parties sign the carbon credit sale or retirement instruction using their wallet. Signatures are recorded with document hash and timestamp.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 5, title: "Escrow Funding (sale only)", description: "Buyer deposits payment; seller deposits credit token into escrow. For retirements, no escrow is required.", approvalRequired: false, blockingIfIncomplete: false },
      { step: 6, title: "Control Hub Approval", description: "Final governance approval from TROPTIONS Control Hub.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 7, title: "Transfer or Retirement", description: "Credits are transferred to buyer (sale) or retired in the registry (retirement). TROPTIONS records the outcome in the audit log.", approvalRequired: false, blockingIfIncomplete: false },
    ],
    smartContractOverview:
      "Carbon Registry Contract: records credit metadata, project ID, registry CID, and unretired/retired status. Escrow Contract (sale): holds payment until transfer is confirmed. Retirement Contract: records irreversible retirement instruction with beneficiary and timestamp.",
    legalDisclosure:
      "Carbon credits are environmental asset records. TROPTIONS does not guarantee offset quality, regulatory acceptance, or environmental benefit. Consult an environmental attorney and a carbon market specialist before transacting.",
    contactInfo:
      "For compliance inquiries: compliance@fthtrading.com.",
  },

  "btc-settlement-handbook": {
    handbookId: "btc-settlement-handbook",
    title: "Bitcoin Settlement Handbook",
    subtitle: "External Settlement Rail, AML Requirements, and Travel Rule Guide",
    version: "1.0.0",
    lastUpdated: "2026-04-28",
    coverDisclosure: PLATFORM_DISCLOSURE,
    transactionTypes: ["Bitcoin Settlement", "Stablecoin Conversion", "Administrative Payment"],
    sections: [
      {
        sectionId: "overview",
        title: "Overview and Scope",
        content:
          "Bitcoin is supported on TROPTIONS as an external settlement preference and transaction-record rail only. TROPTIONS does not provide custody, exchange, brokerage, money transmission, investment advice, or guaranteed Bitcoin conversion. Any actual BTC movement must be executed through a licensed money transmitter or virtual asset service provider (VASP).",
      },
      {
        sectionId: "aml_travel_rule",
        title: "AML Requirements and Travel Rule",
        content:
          "All Bitcoin transactions are subject to AML screening. All BTC addresses involved in a transaction must be screened using blockchain analytics tools (Chainalysis, Elliptic, or equivalent). Any address with a risk score above 70 (on a 0–100 scale) requires manual compliance review. Transactions of USD $1,000 or more equivalent trigger Travel Rule requirements: the sending and receiving VASPs must exchange VASP-to-VASP Travel Rule data before the transfer can proceed.",
      },
      {
        sectionId: "source_of_funds",
        title: "Source of Funds Requirements",
        content:
          "For all Bitcoin settlement requests, the initiating party must provide a signed source-of-funds declaration. For amounts above $10,000, enhanced due diligence is required: bank statements, business income documentation, or other evidence of the lawful origin of funds. TROPTIONS reserves the right to decline any settlement request where the source of funds cannot be satisfactorily verified.",
      },
    ],
    documentChecklist: [
      { id: "kyc_id", item: "Government-Issued ID (enhanced DD for >$10,000 equivalent)", mandatory: true },
      { id: "source_of_funds", item: "Source of Funds Declaration", mandatory: true },
      { id: "provider_instructions", item: "Licensed Provider Instructions (regulated money transmitter or VASP)", mandatory: true },
      { id: "wallet_screening", item: "Blockchain Analytics Wallet Screening Report (Chainalysis, Elliptic, or equivalent)", mandatory: true },
      { id: "travel_rule", item: "Travel Rule Data Package (VASP-to-VASP, required for ≥$1,000)", mandatory: false, notes: "Required when transaction meets Travel Rule threshold" },
    ],
    workflowSteps: [
      { step: 1, title: "KYC / AML Screening", description: "Full identity verification for all parties. Enhanced due diligence for large amounts.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 2, title: "Wallet Risk Screening", description: "All BTC addresses screened via blockchain analytics. High-risk addresses trigger manual review or blocking.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 3, title: "Travel Rule Submission", description: "For transactions ≥$1,000 equivalent, Travel Rule data package is submitted to the counterpart VASP.", approvalRequired: false, blockingIfIncomplete: false },
      { step: 4, title: "Source of Funds Review", description: "Compliance team reviews the source-of-funds declaration. Escalates for enhanced review if needed.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 5, title: "Licensed Provider Confirmation", description: "Initiating party provides name and contact of the licensed VASP or money transmitter who will execute the BTC movement.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 6, title: "Agreement Signature", description: "Settlement instruction is signed by the initiating party using their wallet.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 7, title: "Control Hub Approval", description: "Final governance approval.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 8, title: "Record Settlement", description: "TROPTIONS records the settlement preference with BTC address, expected amount, and provider reference. Actual BTC movement is handled externally.", approvalRequired: false, blockingIfIncomplete: false },
    ],
    smartContractOverview:
      "Settlement Record Contract: records settlement instruction with BTC address, amount, provider reference, and confirmations. Compliance Gate: verifies KYC flag and sanctions status before recording. Audit Log: emits events for every state change.",
    legalDisclosure:
      "Bitcoin transactions may be subject to money transmission laws, securities laws, and AML regulations in your jurisdiction. TROPTIONS does not provide money transmission, exchange, or custody services. Consult a licensed attorney and a regulated VASP before transacting.",
    contactInfo:
      "For compliance inquiries: compliance@fthtrading.com.",
  },

  "platform-overview-handbook": {
    handbookId: "platform-overview-handbook",
    title: "TROPTIONS Platform Overview",
    subtitle: "Architecture, Modules, Compliance Gates, and Simulation Status",
    version: "1.0.0",
    lastUpdated: "2026-04-28",
    coverDisclosure: PLATFORM_DISCLOSURE,
    transactionTypes: ["All"],
    sections: [
      {
        sectionId: "mission",
        title: "Platform Mission",
        content:
          "TROPTIONS is a professional RWA operating system built on the XRPL and the TROPTIONS Settlement Network (TSN) Rust L1. The platform provides structured, compliant workflows for tokenising real-world assets, recording carbon credit transactions, and facilitating external Bitcoin settlements. All execution is blocked until legal, compliance, and custody approvals are in place.",
      },
      {
        sectionId: "modules",
        title: "Platform Modules",
        content:
          "The TROPTIONS platform includes: Carbon Credit Registry (registry, state machine, proof summary); Bitcoin Settlement Rail (record, KYC/AML checks, approval gates); RWA Tokenisation Engine (registration, valuation, evidence hashing); Combined Carbon-Bitcoin Flow (guard chain, audit emit); Transaction Workflow Engine (category classification, due-diligence checklists, approval gates); KYC/Onboarding Engine (document hash submission, oracle attestation simulation); Contract Signature Engine (EIP-1271-style multi-party signatures); Escrow State Engine (atomic release simulation); PDF Handbook Registry (downloadable transaction handbooks); XRPL Integration (IOU, trust lines, AMM, DEX); Rust L1 Crates (compliance scoring, RWA registration, governance proposals, stablecoin, NFT, AMM, bridging).",
      },
      {
        sectionId: "rust_l1",
        title: "Rust L1 Architecture",
        content:
          "The TSN Rust L1 provides a simulation backbone with crates for: consensus (HotStuff-style BFT), runtime orchestration, state management, compliance scoring (TCSA), RWA registration, governance proposals, stablecoin management (GENIUS Act gated), NFT issuance, AMM liquidity, trustlines, XRPL/Stellar bridging, telemetry, and the smart contracts crate (escrow, permissioned token, KYC gate patterns). All crates operate in simulation mode. Formal verification harnesses (Certora Prover or equivalent) are planned for pre-production.",
      },
      {
        sectionId: "approval_gates",
        title: "Approval Gates",
        content:
          "All execution is blocked by the following gate stack: (1) Platform Simulation Gate — active until live deployment is approved. (2) Control Hub Approval — governance sign-off. (3) Legal Review — attorney opinion. (4) Compliance Review — AML, KYC, sanctions. (5) Custody Verification — custodian confirmation. (6) Provider Approval — licensed service provider. (7) Board Approval — required for equity issuance and major transactions. No transaction proceeds to live execution until all applicable gates are cleared.",
      },
    ],
    documentChecklist: [],
    workflowSteps: [],
    smartContractOverview:
      "See individual transaction handbooks for contract details. General contracts: Escrow, Registry, Compliance Gate, Signature Collector, Audit Log.",
    legalDisclosure: PLATFORM_DISCLOSURE,
    contactInfo:
      "General inquiries: info@fthtrading.com. Compliance: compliance@fthtrading.com.",
  },

  "onboarding-kyc-handbook": {
    handbookId: "onboarding-kyc-handbook",
    title: "Onboarding and KYC Handbook",
    subtitle: "Document Submission, Identity Verification, and Oracle Attestation Guide",
    version: "1.0.0",
    lastUpdated: "2026-04-28",
    coverDisclosure: PLATFORM_DISCLOSURE,
    transactionTypes: ["All"],
    sections: [
      {
        sectionId: "overview",
        title: "Overview",
        content:
          "This handbook describes the TROPTIONS onboarding and KYC process. All parties transacting on the platform must complete KYC before any workflow can advance beyond the screening stage. TROPTIONS does not store sensitive personal information; documents are hashed on submission and only the SHA-256 hash and IPFS CID are retained.",
      },
      {
        sectionId: "did_zkp",
        title: "Decentralised Identifiers and Zero-Knowledge Proofs",
        content:
          "TROPTIONS supports Decentralised Identifiers (DIDs) as identity anchors. A DID links a user's wallet address to a verifiable credential issued by a KYC provider, without exposing personal data onchain. Zero-knowledge proofs (ZKPs) allow a party to prove they meet an eligibility criterion (e.g., 'I am accredited') without revealing the underlying data. These privacy-preserving approaches are planned for implementation in the live phase.",
      },
      {
        sectionId: "oracle_model",
        title: "Oracle Attestation Model",
        content:
          "The Chainlink compliance model underpins TROPTIONS onchain KYC. The process is: (1) User submits documents offchain through the secure TROPTIONS portal. (2) Licensed KYC provider verifies documents. (3) Provider sends attestation to a Chainlink oracle network. (4) Oracle writes an onchain flag to the user's wallet address. (5) Smart contracts query the flag before executing any transfer or escrow release. Sensitive personal data is never stored onchain.",
      },
    ],
    documentChecklist: [
      { id: "gov_id", item: "Government-Issued Photo ID (passport or national ID preferred)", mandatory: true },
      { id: "proof_address", item: "Proof of Address (utility bill or bank statement, ≤3 months old)", mandatory: true },
      { id: "selfie", item: "Selfie with ID (live capture for enhanced KYC)", mandatory: false },
      { id: "business_reg", item: "Business Registration Documents (for entities)", mandatory: false },
      { id: "ubo_decl", item: "Ultimate Beneficial Owner Declaration (for entities)", mandatory: false },
    ],
    workflowSteps: [
      { step: 1, title: "Create Onboarding Record", description: "System creates a KYC record linked to your wallet address. No personal data is stored at this stage.", approvalRequired: false, blockingIfIncomplete: false },
      { step: 2, title: "Submit Documents", description: "Upload required identity documents. Each document is hashed (SHA-256) immediately on receipt; raw documents are not retained by TROPTIONS.", approvalRequired: false, blockingIfIncomplete: true },
      { step: 3, title: "Provider Verification", description: "Documents are sent to a licensed KYC provider for identity verification, liveness check, and PEP/sanctions screening.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 4, title: "Oracle Attestation", description: "Provider submits verification result to the oracle network. Oracle writes the onchain KYC flag to your wallet address.", approvalRequired: true, blockingIfIncomplete: true },
      { step: 5, title: "Wallet Signature", description: "You sign a KYC consent message using your wallet to confirm you control the address being attested.", approvalRequired: false, blockingIfIncomplete: true },
      { step: 6, title: "KYC Approved", description: "Your wallet address is marked as KYC-cleared. The onchain flag allows transaction workflows to advance past the screening stage.", approvalRequired: false, blockingIfIncomplete: false },
    ],
    smartContractOverview:
      "KYC Gate Contract: queries the oracle-written onchain flag before any transfer or escrow action. DID Registry: links wallet addresses to verifiable credentials. Soulbound Token (planned): non-transferable credential token representing KYC tier.",
    legalDisclosure:
      "TROPTIONS does not collect or store sensitive personal information. All KYC processing is performed by authorised third-party providers under applicable data protection and AML laws.",
    contactInfo:
      "KYC inquiries: kyc@fthtrading.com.",
  },
};

// ─── Query ────────────────────────────────────────────────────────────────────

export function getHandbook(handbookId: HandbookId): HandbookRecord | undefined {
  return HANDBOOK_CATALOG[handbookId];
}

export function listHandbooks(): HandbookRecord[] {
  return Object.values(HANDBOOK_CATALOG);
}

export function getHandbookSummaries(): Array<{
  handbookId: HandbookId;
  title: string;
  subtitle: string;
  version: string;
  transactionTypes: string[];
  lastUpdated: string;
}> {
  return Object.values(HANDBOOK_CATALOG).map((h) => ({
    handbookId: h.handbookId,
    title: h.title,
    subtitle: h.subtitle,
    version: h.version,
    transactionTypes: h.transactionTypes,
    lastUpdated: h.lastUpdated,
  }));
}
