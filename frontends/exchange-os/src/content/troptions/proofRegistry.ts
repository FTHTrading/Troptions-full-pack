/**
 * Troptions Proof Registry
 * All proof types, workflows, and status tracking for the Troptions Proof Center.
 *
 * Proof workflow:
 * document-uploaded → hash-generated → metadata-classified → evidence-type-assigned
 * → proof-manifest-created → reviewer-assigned → exception-check
 * → board-package-generated → anchor-prepared → report-published
 */

export type ProofType =
  | "proof-of-funds"
  | "proof-of-reserves"
  | "proof-of-control"
  | "proof-of-use"
  | "proof-of-custody"
  | "proof-of-merchant-acceptance"
  | "proof-of-partnership"
  | "proof-of-audit"
  | "proof-of-supply"
  | "proof-of-transaction-history";

export type ProofWorkflowStage =
  | "document-uploaded"
  | "hash-generated"
  | "metadata-classified"
  | "evidence-type-assigned"
  | "proof-manifest-created"
  | "reviewer-assigned"
  | "exception-check"
  | "board-package-generated"
  | "anchor-prepared"
  | "report-published";

export interface ProofItem {
  proofId: string;
  proofType: ProofType;
  label: string;
  description: string;
  evidenceTypes: string[];
  requiredDocuments: string[];
  anchorChain: string;
  hashAlgorithm: string;
  currentStage: ProofWorkflowStage;
  exceptions: string[];
  reserveRatio?: number;
  lastUpdated: string | null;
  publishedReport: string | null;
}

export const PROOF_REGISTRY: ProofItem[] = [
  // ─── Proof of Funds ───────────────────────────────────────────────────────
  {
    proofId: "POF-001",
    proofType: "proof-of-funds",
    label: "Bank Letter / Escrow Confirmation",
    description: "Troptions Proof of Funds package: bank letter, escrow confirmation, wire receipts, custodian cash balances, stablecoin wallet balances, treasury account proofs.",
    evidenceTypes: [
      "bank-letter",
      "escrow-confirmation",
      "wire-receipt",
      "custodian-cash-balance",
      "stablecoin-wallet-balance",
      "treasury-account-proof",
    ],
    requiredDocuments: [
      "Bank letterhead statement with date and amount",
      "Escrow agreement and confirmation",
      "Wire receipt with reference number",
      "Custodian statement",
      "Wallet balance screenshot with on-chain verification",
    ],
    anchorChain: "XRPL / Polygon",
    hashAlgorithm: "SHA-256",
    currentStage: "document-uploaded",
    exceptions: [],
    lastUpdated: null,
    publishedReport: null,
  },

  // ─── Proof of Reserves ────────────────────────────────────────────────────
  {
    proofId: "POR-001",
    proofType: "proof-of-reserves",
    label: "Troptions Reserve Schedule",
    description: "Monthly reserve report: reserve schedule, vault receipts, custodian attestations, reserve ratio, token supply comparison.",
    evidenceTypes: [
      "reserve-schedule",
      "vault-receipt",
      "custodian-attestation",
      "reserve-ratio",
      "token-supply-comparison",
      "monthly-reserve-report",
    ],
    requiredDocuments: [
      "Reserve schedule with each asset line item",
      "Vault receipt from custodian",
      "Signed custodian attestation",
      "Reserve ratio calculation (reserves ÷ issued supply)",
      "Token supply snapshot from chain",
    ],
    anchorChain: "Bitcoin / XRPL",
    hashAlgorithm: "SHA-256 + Merkle root",
    currentStage: "document-uploaded",
    exceptions: [],
    reserveRatio: undefined,
    lastUpdated: null,
    publishedReport: null,
  },

  // ─── Proof of Control ─────────────────────────────────────────────────────
  {
    proofId: "POC-001",
    proofType: "proof-of-control",
    label: "Wallet & Custody Control Verification",
    description: "Wallet challenge, multi-sig signer verification, board consent, custody authorization, admin approval chain.",
    evidenceTypes: [
      "wallet-challenge",
      "multisig-signer-verification",
      "board-consent",
      "custody-authorization",
      "admin-approval-chain",
    ],
    requiredDocuments: [
      "Signed wallet challenge transaction",
      "Multi-sig configuration with signer roles",
      "Board resolution authorizing key holders",
      "Custody agreement with authorized signers",
      "Admin approval audit log",
    ],
    anchorChain: "XRPL / Ethereum",
    hashAlgorithm: "SHA-256",
    currentStage: "document-uploaded",
    exceptions: [],
    lastUpdated: null,
    publishedReport: null,
  },

  // ─── Proof of Audit ───────────────────────────────────────────────────────
  {
    proofId: "POA-001",
    proofType: "proof-of-audit",
    label: "Troptions Gold Audit Package",
    description: "Complete audit package: auditor identity, scope, date, methodology, assets reviewed, exclusions, exceptions, remediation status, reserve schedule.",
    evidenceTypes: [
      "audit-report",
      "auditor-identity",
      "audit-scope",
      "audit-methodology",
      "exception-log",
      "remediation-evidence",
      "reserve-schedule",
    ],
    requiredDocuments: [
      "Full audit report (not summary)",
      "Auditor firm identity and credentials",
      "Audit date and coverage period",
      "Methodology description",
      "List of assets reviewed",
      "Exclusions and limitations",
      "Exception log with status",
      "Remediation evidence for each exception",
    ],
    anchorChain: "Bitcoin",
    hashAlgorithm: "SHA-256",
    currentStage: "document-uploaded",
    exceptions: ["Audit report not yet provided for institutional review"],
    lastUpdated: null,
    publishedReport: null,
  },

  // ─── Proof of Merchant Acceptance ─────────────────────────────────────────
  {
    proofId: "POMA-001",
    proofType: "proof-of-merchant-acceptance",
    label: "Troptions Pay Merchant Network Verification",
    description: "Verified merchant count, source, rail provider agreement, acceptance test receipts, geographic coverage, excluded categories.",
    evidenceTypes: [
      "givbux-agreement",
      "merchant-network-documentation",
      "acceptance-test-receipts",
      "merchant-count-source",
      "geographic-limitations",
      "excluded-categories",
    ],
    requiredDocuments: [
      "GivBux or rail-provider agreement",
      "Merchant network documentation with source and date",
      "Acceptance test receipts (sample transactions)",
      "Current verified merchant count with date-stamp",
      "Geographic coverage map",
      "Excluded merchant categories list",
    ],
    anchorChain: "XRPL",
    hashAlgorithm: "SHA-256",
    currentStage: "document-uploaded",
    exceptions: [
      "Merchant count inconsistency: 480,000 vs 580,000 across Troptions pages — must be reconciled",
      "No GivBux agreement provided",
      "No date-stamped verification provided",
    ],
    lastUpdated: null,
    publishedReport: null,
  },
];

export type ProofWorkflowResult = {
  proofId: string;
  currentStage: ProofWorkflowStage;
  nextStage: ProofWorkflowStage | "complete";
  blockers: string[];
};

const WORKFLOW_STAGES: ProofWorkflowStage[] = [
  "document-uploaded",
  "hash-generated",
  "metadata-classified",
  "evidence-type-assigned",
  "proof-manifest-created",
  "reviewer-assigned",
  "exception-check",
  "board-package-generated",
  "anchor-prepared",
  "report-published",
];

export function getProofWorkflowStatus(proof: ProofItem): ProofWorkflowResult {
  const idx = WORKFLOW_STAGES.indexOf(proof.currentStage);
  const nextStage =
    idx < WORKFLOW_STAGES.length - 1 ? WORKFLOW_STAGES[idx + 1] : "complete";
  return {
    proofId: proof.proofId,
    currentStage: proof.currentStage,
    nextStage,
    blockers: proof.exceptions,
  };
}

export function getProofByType(type: ProofType): ProofItem | undefined {
  return PROOF_REGISTRY.find((p) => p.proofType === type);
}
