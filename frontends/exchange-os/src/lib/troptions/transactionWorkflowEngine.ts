/**
 * TROPTIONS Transaction Workflow Engine
 *
 * Defines transaction categories, required due-diligence steps, document
 * checklists, and compliance gates for each transaction type.
 *
 * SIMULATION-ONLY — no live execution, signing, custody, or settlement.
 * All transactions remain blocked until required approvals are in place.
 */

import { randomUUID } from "crypto";

// ─── Transaction Categories ───────────────────────────────────────────────────

export type TransactionCategory =
  | "rwa_tokenisation"
  | "carbon_credit_sale"
  | "carbon_credit_retirement"
  | "btc_settlement"
  | "collateral_pledge"
  | "administrative_payment"
  | "equity_token_issuance"
  | "stablecoin_conversion";

export type TransactionStatus =
  | "draft"
  | "diligence_pending"
  | "kyc_pending"
  | "docs_pending"
  | "signature_pending"
  | "escrow_pending"
  | "oracle_pending"
  | "approval_pending"
  | "blocked"
  | "simulation_complete";

export type ApprovalGate =
  | "control_hub_approval"
  | "legal_review"
  | "compliance_review"
  | "custody_verification"
  | "kyc_cleared"
  | "sanctions_clear"
  | "travel_rule_submitted"
  | "board_approval"
  | "provider_approval"
  | "oracle_attestation"
  | "escrow_funded"
  | "signatures_collected";

// ─── Document Requirements ────────────────────────────────────────────────────

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  examples?: string[];
}

export interface DueDiligenceStep {
  stepId: string;
  title: string;
  description: string;
  approvalGate: ApprovalGate;
  blockingIfMissing: boolean;
}

export interface TransactionTypeDefinition {
  category: TransactionCategory;
  displayName: string;
  shortDescription: string;
  disclosureStatement: string;
  requiredDocuments: RequiredDocument[];
  dueDiligenceSteps: DueDiligenceStep[];
  requiredApprovals: ApprovalGate[];
  handbookId: string;
  simulationOnly: boolean;
}

// ─── Transaction Record ───────────────────────────────────────────────────────

export interface TransactionWorkflowRecord {
  transactionId: string;
  category: TransactionCategory;
  status: TransactionStatus;
  initiatorAddress: string;
  counterpartyAddress?: string;
  assetReference?: string;
  amountUsdCents?: number;
  blockedReasons: string[];
  completedGates: ApprovalGate[];
  pendingGates: ApprovalGate[];
  submittedDocumentHashes: string[];
  auditTrail: WorkflowAuditEntry[];
  simulationOnly: true;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowAuditEntry {
  entryId: string;
  action: string;
  actor: string;
  detail: string;
  timestamp: string;
}

// ─── Transaction Type Catalog ─────────────────────────────────────────────────

export const TRANSACTION_TYPE_CATALOG: Record<TransactionCategory, TransactionTypeDefinition> = {
  rwa_tokenisation: {
    category: "rwa_tokenisation",
    displayName: "RWA Tokenisation & Sale",
    shortDescription: "Package a real-world asset into tokenised units for sale or collateral",
    disclosureStatement:
      "TROPTIONS does not provide custody, exchange, brokerage, money transmission, investment advice, or any guarantee of asset value. All tokenisation workflows are subject to jurisdiction-specific legal, compliance, and custody review before activation.",
    handbookId: "rwa-tokenisation-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "appraisal_report", name: "Independent Appraisal Report", description: "Third-party valuation of the underlying asset", mandatory: true, examples: ["Gemstone grading certificate", "Real estate appraisal", "Equipment valuation"] },
      { id: "custody_statement", name: "Custody Statement", description: "Signed statement from a regulated custodian confirming physical custody", mandatory: true },
      { id: "spv_agreement", name: "SPV or Legal Wrapper Agreement", description: "Entity documents for the Special Purpose Vehicle holding the asset", mandatory: true },
      { id: "insurance_certificate", name: "Insurance Certificate", description: "Evidence of asset insurance coverage", mandatory: true },
      { id: "prospectus", name: "Offering Prospectus or Information Memorandum", description: "Investor-facing document describing terms, risks, and redemption", mandatory: true },
      { id: "legal_opinion", name: "Legal Opinion Letter", description: "Attorney opinion on regulatory status and transfer restrictions", mandatory: true },
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Government-issued ID for all beneficial owners >25%", mandatory: true },
      { id: "kyb_documents", name: "Business Registration & KYB Docs", description: "Incorporation docs, operating agreements, UBO declaration", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_issuer_verify", title: "Verify Issuer Registration", description: "Confirm issuer is registered with the relevant financial authority and has authority to issue tokens", approvalGate: "legal_review", blockingIfMissing: true },
      { stepId: "dd_asset_title", title: "Confirm Asset Title & Custody", description: "Verify clear title to the underlying asset and confirm custodian identity and regulation status", approvalGate: "custody_verification", blockingIfMissing: true },
      { stepId: "dd_kyc_aml", title: "KYC / AML Screening", description: "Screen all parties against OFAC, UN, and EU sanctions lists; collect and verify identity documents", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_compliance_wrapper", title: "Confirm Compliance Wrapper", description: "Ensure token standard enforces transfer restrictions to verified holders; reject unrestricted ERC-20 for regulated assets", approvalGate: "compliance_review", blockingIfMissing: true },
      { stepId: "dd_smart_contract_audit", title: "Smart Contract Security Review", description: "Confirm contract has been audited; verify PoR integration with independent oracle (Chainlink or Pyth)", approvalGate: "provider_approval", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Final governance approval from TROPTIONS Control Hub", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "legal_review", "compliance_review", "custody_verification", "kyc_cleared", "sanctions_clear", "provider_approval", "oracle_attestation"],
  },

  carbon_credit_sale: {
    category: "carbon_credit_sale",
    displayName: "Carbon Credit Sale",
    shortDescription: "Sell or transfer verified, unretired carbon credits",
    disclosureStatement:
      "TROPTIONS does not guarantee carbon neutrality, offset validity, registry acceptance, price, liquidity, or resale value. Credits must be independently verified and properly registered. TROPTIONS does not provide custody or exchange services.",
    handbookId: "carbon-credit-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "registry_certificate", name: "Carbon Registry Certificate", description: "Certificate from Verra, Gold Standard, ACR, or equivalent registry confirming credit registration and unretired status", mandatory: true },
      { id: "project_documentation", name: "Project Documentation", description: "Methodology, monitoring, reporting, and verification (MRV) plan for the underlying project", mandatory: true },
      { id: "verification_report", name: "Third-Party Verification Report", description: "Report from accredited verification body confirming credit validity", mandatory: true },
      { id: "custody_proof", name: "Proof of Custody / Ownership", description: "Evidence that the seller controls the credits in the registry account", mandatory: true },
      { id: "retirement_status", name: "Retirement Status Confirmation", description: "Registry-issued confirmation that credits are NOT yet retired", mandatory: true },
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Government-issued ID or business registration for seller and buyer", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_registry_verify", title: "Registry Verification", description: "Confirm credits exist in recognised registry (Verra, Gold Standard) and are in unretired status", approvalGate: "compliance_review", blockingIfMissing: true },
      { stepId: "dd_additionality", title: "Additionality & Permanence Check", description: "Review project for genuine emissions reduction, additionality claims, and permanence risk", approvalGate: "provider_approval", blockingIfMissing: true },
      { stepId: "dd_kyc_aml", title: "KYC / AML Screening", description: "Screen both parties; collect identity documents", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Final governance approval", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "compliance_review", "kyc_cleared", "sanctions_clear", "provider_approval"],
  },

  carbon_credit_retirement: {
    category: "carbon_credit_retirement",
    displayName: "Carbon Credit Retirement",
    shortDescription: "Permanently retire verified carbon credits on behalf of an entity",
    disclosureStatement:
      "Retirement is irreversible. Retired credits cannot be resold or transferred. TROPTIONS does not guarantee regulatory acceptance of retirements or any carbon-neutral claims.",
    handbookId: "carbon-credit-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "registry_certificate", name: "Carbon Registry Certificate", description: "Unretired credit certificate from recognised registry", mandatory: true },
      { id: "retirement_instruction", name: "Signed Retirement Instruction", description: "Written instruction from authorised party requesting permanent retirement", mandatory: true },
      { id: "beneficiary_declaration", name: "Beneficiary Declaration", description: "Entity on whose behalf credits are being retired", mandatory: true },
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Identity documentation for instructing party", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_registry_verify", title: "Registry Verification", description: "Confirm credits are unretired and held in correct registry account", approvalGate: "compliance_review", blockingIfMissing: true },
      { stepId: "dd_irreversibility_consent", title: "Irreversibility Confirmation", description: "Confirm instructing party understands retirement is permanent and credits cannot be resold", approvalGate: "legal_review", blockingIfMissing: true },
      { stepId: "dd_kyc_aml", title: "KYC / AML Screening", description: "Screen instructing party and beneficiary", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Final governance approval", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "legal_review", "compliance_review", "kyc_cleared"],
  },

  btc_settlement: {
    category: "btc_settlement",
    displayName: "Bitcoin Settlement",
    shortDescription: "Record a Bitcoin external settlement preference for a TROPTIONS transaction",
    disclosureStatement:
      "Bitcoin is supported only as an external settlement preference or transaction-record rail. TROPTIONS does not provide custody, exchange, brokerage, money transmission, investment advice, or guaranteed Bitcoin conversion. Any BTC movement must be executed through a licensed provider.",
    handbookId: "btc-settlement-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Government-issued ID for all parties; enhanced due diligence for amounts above $10,000 equivalent", mandatory: true },
      { id: "source_of_funds", name: "Source of Funds Declaration", description: "Written declaration of the lawful origin of BTC or fiat being used in settlement", mandatory: true },
      { id: "provider_instructions", name: "Licensed Provider Instructions", description: "Confirmation of the regulated provider that will execute the BTC movement", mandatory: true },
      { id: "aml_screening", name: "Wallet Screening Report", description: "Blockchain analytics screening of all BTC addresses (Chainalysis, Elliptic, or equivalent)", mandatory: true },
      { id: "travel_rule_data", name: "Travel Rule Package (≥$1,000)", description: "VASP-to-VASP Travel Rule data packet for transactions meeting the threshold", mandatory: false },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_wallet_screening", title: "Wallet Risk Screening", description: "Screen all BTC addresses against blockchain analytics tools; confirm no high-risk cluster exposure", approvalGate: "compliance_review", blockingIfMissing: true },
      { stepId: "dd_kyc_aml", title: "Enhanced KYC / AML", description: "Full identity verification; source-of-funds declaration; sanctions screening for all parties", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_travel_rule", title: "Travel Rule Compliance", description: "Submit Travel Rule data to counterpart VASP for transactions ≥ $1,000 equivalent", approvalGate: "travel_rule_submitted", blockingIfMissing: false },
      { stepId: "dd_provider_confirm", title: "Confirm Licensed Provider", description: "Ensure a regulated money transmitter or VASP will handle the actual BTC movement", approvalGate: "provider_approval", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Final governance approval", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "compliance_review", "kyc_cleared", "sanctions_clear", "provider_approval"],
  },

  collateral_pledge: {
    category: "collateral_pledge",
    displayName: "Collateral Pledge",
    shortDescription: "Pledge tokenised assets as collateral for financing",
    disclosureStatement:
      "TROPTIONS does not provide lending, credit, or financing services. Collateral pledges are records only. All financing must be arranged through licensed lenders.",
    handbookId: "rwa-tokenisation-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "appraisal_report", name: "Independent Appraisal Report", description: "Current third-party valuation", mandatory: true },
      { id: "custody_statement", name: "Custody Statement", description: "Custodian confirmation of asset control", mandatory: true },
      { id: "pledge_agreement", name: "Pledge and Security Agreement", description: "Legal agreement defining lender rights and pledgor obligations", mandatory: true },
      { id: "lender_kyb", name: "Lender KYB Documents", description: "Business registration and licensing documents for the lender", mandatory: true },
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Identity documentation for all parties", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_collateral_value", title: "Confirm Current Valuation", description: "Independent appraisal not older than 90 days", approvalGate: "custody_verification", blockingIfMissing: true },
      { stepId: "dd_kyc_aml", title: "KYC / AML Screening", description: "Screen pledgor and lender", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_legal_agreement", title: "Legal Agreement Review", description: "Legal counsel review of pledge and security agreement", approvalGate: "legal_review", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Final governance approval", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "legal_review", "custody_verification", "kyc_cleared", "sanctions_clear"],
  },

  administrative_payment: {
    category: "administrative_payment",
    displayName: "Administrative Payment",
    shortDescription: "Origination fee, diligence fee, custody fee, or subscription payment",
    disclosureStatement:
      "TROPTIONS does not process payments. All fee payments must be made to licensed service providers through their own billing systems.",
    handbookId: "btc-settlement-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "invoice", name: "Signed Invoice", description: "Invoice from the service provider specifying amount, purpose, and payment instructions", mandatory: true },
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Identity documentation for payer", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_kyc_aml", title: "KYC / AML Screening", description: "Basic KYC for payer", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Administrative approval", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "kyc_cleared"],
  },

  equity_token_issuance: {
    category: "equity_token_issuance",
    displayName: "Equity Token Issuance",
    shortDescription: "Issue a permissioned token representing equity in an entity",
    disclosureStatement:
      "Equity tokens may constitute securities subject to securities laws. TROPTIONS does not provide broker-dealer, underwriting, or investment-advisory services. All issuances require legal counsel review and securities-law compliance.",
    handbookId: "rwa-tokenisation-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "legal_opinion", name: "Securities Law Opinion", description: "Attorney opinion confirming regulatory status and required exemptions (Reg D, Reg S, etc.)", mandatory: true },
      { id: "cap_table", name: "Capitalisation Table", description: "Full cap table showing all equity holders and ownership percentages", mandatory: true },
      { id: "subscription_agreement", name: "Subscription Agreement", description: "Investor subscription agreement with representations and warranties", mandatory: true },
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Identity documentation for all investors and issuers", mandatory: true },
      { id: "kyb_documents", name: "Entity KYB Documents", description: "Issuing entity registration and authorised signatories", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_securities_review", title: "Securities Law Review", description: "Confirm applicable exemption and investor eligibility requirements (accredited status, etc.)", approvalGate: "legal_review", blockingIfMissing: true },
      { stepId: "dd_permissioned_standard", title: "Confirm Permissioned Standard", description: "Verify token standard enforces transfer restrictions to eligible holders only (ERC-3643 or equivalent)", approvalGate: "compliance_review", blockingIfMissing: true },
      { stepId: "dd_kyc_aml", title: "Investor KYC / AML", description: "Verify all investors meet eligibility requirements; sanctions screening", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Board-level governance approval required for equity issuance", approvalGate: "board_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["board_approval", "legal_review", "compliance_review", "kyc_cleared", "sanctions_clear", "control_hub_approval"],
  },

  stablecoin_conversion: {
    category: "stablecoin_conversion",
    displayName: "Stablecoin Conversion",
    shortDescription: "Convert between TROPTIONS-supported stablecoins using the settlement rail",
    disclosureStatement:
      "TROPTIONS does not operate a money exchange, payment processor, or stablecoin issuer. Conversion records are simulations only. Actual conversion must occur through a licensed provider and compliant stablecoin issuer under the GENIUS Act or applicable framework.",
    handbookId: "btc-settlement-handbook",
    simulationOnly: true,
    requiredDocuments: [
      { id: "identity_proof", name: "Identity Proof (KYC)", description: "Identity documentation for all parties", mandatory: true },
      { id: "source_of_funds", name: "Source of Funds Declaration", description: "Written declaration of lawful origin of funds", mandatory: true },
    ],
    dueDiligenceSteps: [
      { stepId: "dd_kyc_aml", title: "KYC / AML Screening", description: "Full identity and AML screening", approvalGate: "kyc_cleared", blockingIfMissing: true },
      { stepId: "dd_genius_act", title: "GENIUS Act Status Check", description: "Confirm stablecoin issuer has Permitted Issuer status under the GENIUS Act", approvalGate: "compliance_review", blockingIfMissing: true },
      { stepId: "dd_control_hub", title: "Control Hub Sign-off", description: "Administrative approval", approvalGate: "control_hub_approval", blockingIfMissing: true },
    ],
    requiredApprovals: ["control_hub_approval", "compliance_review", "kyc_cleared", "sanctions_clear"],
  },
};

// ─── In-memory workflow registry ──────────────────────────────────────────────

const _workflowRegistry: TransactionWorkflowRecord[] = [];

export function clearWorkflowRegistry(): void {
  _workflowRegistry.length = 0;
}

export function seedWorkflowRegistryIfEmpty(): void {
  if (_workflowRegistry.length > 0) return;
  _workflowRegistry.push(
    createWorkflowRecord({
      category: "rwa_tokenisation",
      initiatorAddress: "rDemo1TROPTIONS0000000000000000000",
      assetReference: "DEMO-GEM-001",
      amountUsdCents: 250_000_00,
    }),
    createWorkflowRecord({
      category: "carbon_credit_sale",
      initiatorAddress: "rDemo2TROPTIONS0000000000000000000",
      assetReference: "VERRA-VCS-DEMO-001",
      amountUsdCents: 15_000_00,
    })
  );
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createWorkflowRecord(input: {
  category: TransactionCategory;
  initiatorAddress: string;
  counterpartyAddress?: string;
  assetReference?: string;
  amountUsdCents?: number;
}): TransactionWorkflowRecord {
  const def = TRANSACTION_TYPE_CATALOG[input.category];
  const now = new Date().toISOString();

  const record: TransactionWorkflowRecord = {
    transactionId: `TXN-${randomUUID().toUpperCase().slice(0, 8)}`,
    category: input.category,
    status: "diligence_pending",
    initiatorAddress: input.initiatorAddress,
    counterpartyAddress: input.counterpartyAddress,
    assetReference: input.assetReference,
    amountUsdCents: input.amountUsdCents,
    blockedReasons: [
      "platform_simulation_gate_active",
      ...def.requiredApprovals.map((g) => `pending_gate_${g}`),
    ],
    completedGates: [],
    pendingGates: [...def.requiredApprovals],
    submittedDocumentHashes: [],
    auditTrail: [
      {
        entryId: randomUUID(),
        action: "workflow_created",
        actor: input.initiatorAddress,
        detail: `Transaction workflow created for ${def.displayName}`,
        timestamp: now,
      },
    ],
    simulationOnly: true,
    createdAt: now,
    updatedAt: now,
  };

  _workflowRegistry.push(record);
  return record;
}

export function getWorkflowRecord(transactionId: string): TransactionWorkflowRecord | undefined {
  return _workflowRegistry.find((r) => r.transactionId === transactionId);
}

export function listWorkflowRecords(category?: TransactionCategory): TransactionWorkflowRecord[] {
  if (category) return _workflowRegistry.filter((r) => r.category === category);
  return [..._workflowRegistry];
}

export function advanceGate(transactionId: string, gate: ApprovalGate, actor: string): TransactionWorkflowRecord | null {
  const record = _workflowRegistry.find((r) => r.transactionId === transactionId);
  if (!record) return null;

  if (!record.pendingGates.includes(gate)) return record;

  record.pendingGates = record.pendingGates.filter((g) => g !== gate);
  record.completedGates.push(gate);
  record.blockedReasons = record.blockedReasons.filter((r) => r !== `pending_gate_${gate}`);
  record.auditTrail.push({
    entryId: randomUUID(),
    action: "gate_advanced",
    actor,
    detail: `Gate ${gate} cleared`,
    timestamp: new Date().toISOString(),
  });

  if (record.pendingGates.length === 0 && record.blockedReasons.every((r) => r === "platform_simulation_gate_active")) {
    record.status = "simulation_complete";
  }

  record.updatedAt = new Date().toISOString();
  return record;
}

export function getTransactionTypeDef(category: TransactionCategory): TransactionTypeDefinition {
  return TRANSACTION_TYPE_CATALOG[category];
}

export function listTransactionCategories(): TransactionTypeDefinition[] {
  return Object.values(TRANSACTION_TYPE_CATALOG);
}
