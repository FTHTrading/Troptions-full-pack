/**
 * TROPTIONS KYC / Onboarding Engine
 *
 * Manages onboarding document submission (hash-based), KYC state tracking,
 * DID reference records, and oracle attestation stubs.
 *
 * Architecture:
 *  1. User submits documents off-chain through a secure portal.
 *  2. System hashes each document (SHA-256) and stores the hash + IPFS CID.
 *  3. A KYC provider verifies documents and sends an attestation.
 *  4. An oracle stub records the onchain flag (simulated here).
 *  5. Smart-contract transactions check the flag before proceeding.
 *
 * SIMULATION-ONLY — no live KYC, no PII stored, no live oracle writes.
 * Sensitive documents are NEVER stored; only SHA-256 hashes + CIDs are kept.
 */

import { createHash, randomUUID } from "crypto";

// ─── KYC Tier & Status ────────────────────────────────────────────────────────

export type KycTier = "unknown" | "pending" | "basic" | "enhanced" | "institutional" | "failed";

export type KybTier = "unknown" | "pending" | "registered" | "enhanced" | "institutional" | "failed";

export type KycStatus =
  | "not_started"
  | "documents_submitted"
  | "under_review"
  | "information_requested"
  | "oracle_attested"
  | "approved"
  | "rejected"
  | "expired";

export type DocumentType =
  | "government_id"
  | "proof_of_address"
  | "selfie_with_id"
  | "business_registration"
  | "operating_agreement"
  | "ubo_declaration"
  | "appraisal_report"
  | "custody_statement"
  | "spv_agreement"
  | "insurance_certificate"
  | "source_of_funds"
  | "subscription_agreement"
  | "other";

export type SanctionsStatus = "unscreened" | "clear" | "potential_match" | "blocked";

// ─── Submitted Document Record ────────────────────────────────────────────────

export interface SubmittedDocumentRecord {
  documentId: string;
  documentType: DocumentType;
  documentName: string;
  /** SHA-256 hash of the document content. Raw content is NEVER stored. */
  sha256Hash: string;
  /** IPFS CID if the hash has been pinned (optional at submission time) */
  ipfsCid?: string;
  submittedAt: string;
  verifiedAt?: string;
  verificationStatus: "pending" | "verified" | "rejected" | "expired";
  verifiedBy?: string;
}

// ─── KYC Record ───────────────────────────────────────────────────────────────

export interface KycOnboardingRecord {
  kycId: string;
  /** Wallet address or DID of the subject */
  subjectAddress: string;
  /** Decentralised Identifier (DID) if provided */
  subjectDid?: string;
  entityType: "individual" | "entity";
  kycTier: KycTier;
  kybTier: KybTier;
  status: KycStatus;
  sanctionsStatus: SanctionsStatus;
  walletRiskScore: number; // 0–100
  submittedDocuments: SubmittedDocumentRecord[];
  /** Oracle attestation stub — records simulated onchain flag */
  oracleAttestation?: OracleAttestationRecord;
  /** Zero-knowledge proof reference (planned — not implemented in simulation) */
  zkProofReference?: string;
  blockedReasons: string[];
  auditTrail: KycAuditEntry[];
  simulationOnly: true;
  createdAt: string;
  updatedAt: string;
}

export interface OracleAttestationRecord {
  attestationId: string;
  providerName: string;
  attestedKycTier: KycTier;
  /** Simulated onchain flag — true when KYC is sufficient for transactions */
  onchainFlagSet: boolean;
  /** Simulated transaction hash of the oracle write (not a real tx) */
  simulatedTxHash: string;
  attestedAt: string;
  expiresAt: string;
  simulationOnly: true;
}

export interface KycAuditEntry {
  entryId: string;
  action: string;
  actor: string;
  detail: string;
  timestamp: string;
}

// ─── KYC DISCLOSURE ───────────────────────────────────────────────────────────

export const KYC_ONBOARDING_DISCLOSURE =
  "TROPTIONS does not store sensitive personal information. Documents are hashed on submission; only the cryptographic hash and IPFS content identifier are retained. All KYC verification is performed by authorised third-party providers. No onchain attestation is written without explicit review and approval. This is a simulation — no real verification has occurred.";

// ─── In-memory registry ───────────────────────────────────────────────────────

const _kycRegistry: KycOnboardingRecord[] = [];

export function clearKycRegistry(): void {
  _kycRegistry.length = 0;
}

export function seedKycRegistryIfEmpty(): void {
  if (_kycRegistry.length > 0) return;
  _kycRegistry.push(
    createKycRecord({ subjectAddress: "rDemo1TROPTIONS0000000000000000000", entityType: "individual" }),
    createKycRecord({ subjectAddress: "rDemo2TROPTIONS0000000000000000000", entityType: "entity", subjectDid: "did:troptions:demo-entity-001" })
  );
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createKycRecord(input: {
  subjectAddress: string;
  entityType: "individual" | "entity";
  subjectDid?: string;
}): KycOnboardingRecord {
  const now = new Date().toISOString();
  const record: KycOnboardingRecord = {
    kycId: `KYC-${randomUUID().toUpperCase().slice(0, 8)}`,
    subjectAddress: input.subjectAddress,
    subjectDid: input.subjectDid,
    entityType: input.entityType,
    kycTier: "unknown",
    kybTier: "unknown",
    status: "not_started",
    sanctionsStatus: "unscreened",
    walletRiskScore: 50,
    submittedDocuments: [],
    blockedReasons: ["platform_simulation_gate_active", "kyc_not_started"],
    auditTrail: [
      {
        entryId: randomUUID(),
        action: "kyc_record_created",
        actor: "system",
        detail: `KYC record created for ${input.entityType}`,
        timestamp: now,
      },
    ],
    simulationOnly: true,
    createdAt: now,
    updatedAt: now,
  };
  _kycRegistry.push(record);
  return record;
}

// ─── Document submission ──────────────────────────────────────────────────────

export interface DocumentSubmissionInput {
  kycId: string;
  documentType: DocumentType;
  documentName: string;
  /** Raw document content to hash. Content is NOT stored — only the hash is retained. */
  documentContent: string;
  ipfsCid?: string;
}

export interface DocumentSubmissionResult {
  success: boolean;
  documentId?: string;
  sha256Hash?: string;
  disclosure: string;
  error?: string;
  simulationOnly: true;
}

export function submitDocument(input: DocumentSubmissionInput): DocumentSubmissionResult {
  const record = _kycRegistry.find((r) => r.kycId === input.kycId);
  if (!record) {
    return { success: false, error: "KYC record not found", disclosure: KYC_ONBOARDING_DISCLOSURE, simulationOnly: true };
  }

  // Hash the document — raw content is discarded here
  const sha256Hash = createHash("sha256").update(input.documentContent).digest("hex");
  const documentId = randomUUID();
  const now = new Date().toISOString();

  const doc: SubmittedDocumentRecord = {
    documentId,
    documentType: input.documentType,
    documentName: input.documentName,
    sha256Hash,
    ipfsCid: input.ipfsCid,
    submittedAt: now,
    verificationStatus: "pending",
  };

  record.submittedDocuments.push(doc);

  if (record.status === "not_started") {
    record.status = "documents_submitted";
    record.blockedReasons = record.blockedReasons.filter((r) => r !== "kyc_not_started");
  }

  record.auditTrail.push({
    entryId: randomUUID(),
    action: "document_submitted",
    actor: record.subjectAddress,
    detail: `Document submitted: ${input.documentType} — hash: ${sha256Hash.slice(0, 16)}…`,
    timestamp: now,
  });
  record.updatedAt = now;

  return { success: true, documentId, sha256Hash, disclosure: KYC_ONBOARDING_DISCLOSURE, simulationOnly: true };
}

// ─── Oracle attestation (simulation) ─────────────────────────────────────────

export interface OracleAttestationInput {
  kycId: string;
  providerName: string;
  attestedKycTier: KycTier;
  actor: string;
}

export function recordOracleAttestation(input: OracleAttestationInput): KycOnboardingRecord | null {
  const record = _kycRegistry.find((r) => r.kycId === input.kycId);
  if (!record) return null;

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  record.oracleAttestation = {
    attestationId: randomUUID(),
    providerName: input.providerName,
    attestedKycTier: input.attestedKycTier,
    onchainFlagSet: ["basic", "enhanced", "institutional"].includes(input.attestedKycTier),
    simulatedTxHash: `0x${createHash("sha256").update(`${input.kycId}-${now}`).digest("hex").slice(0, 64)}`,
    attestedAt: now,
    expiresAt,
    simulationOnly: true,
  };

  record.kycTier = input.attestedKycTier;
  record.status = "oracle_attested";
  record.blockedReasons = record.blockedReasons.filter((r) => r !== "kyc_not_started");

  record.auditTrail.push({
    entryId: randomUUID(),
    action: "oracle_attestation_recorded",
    actor: input.actor,
    detail: `Oracle attestation from ${input.providerName} — tier: ${input.attestedKycTier} — onchain_flag: ${record.oracleAttestation.onchainFlagSet}`,
    timestamp: now,
  });
  record.updatedAt = now;
  return record;
}

// ─── Query ────────────────────────────────────────────────────────────────────

export function getKycRecord(kycId: string): KycOnboardingRecord | undefined {
  return _kycRegistry.find((r) => r.kycId === kycId);
}

export function findKycByAddress(address: string): KycOnboardingRecord | undefined {
  return _kycRegistry.find((r) => r.subjectAddress === address);
}

export function listKycRecords(): KycOnboardingRecord[] {
  return [..._kycRegistry];
}

export function isKycCleared(address: string): boolean {
  const record = findKycByAddress(address);
  if (!record) return false;
  return (
    record.oracleAttestation?.onchainFlagSet === true &&
    record.sanctionsStatus === "clear" &&
    ["basic", "enhanced", "institutional"].includes(record.kycTier)
  );
}

export function generateKycSummary(kycId: string): {
  kycId: string;
  status: KycStatus;
  kycTier: KycTier;
  onchainFlagSet: boolean;
  documentCount: number;
  verifiedDocumentCount: number;
  sanctionsStatus: SanctionsStatus;
  disclosure: string;
  simulationOnly: true;
} | null {
  const record = _kycRegistry.find((r) => r.kycId === kycId);
  if (!record) return null;
  return {
    kycId: record.kycId,
    status: record.status,
    kycTier: record.kycTier,
    onchainFlagSet: record.oracleAttestation?.onchainFlagSet ?? false,
    documentCount: record.submittedDocuments.length,
    verifiedDocumentCount: record.submittedDocuments.filter((d) => d.verificationStatus === "verified").length,
    sanctionsStatus: record.sanctionsStatus,
    disclosure: KYC_ONBOARDING_DISCLOSURE,
    simulationOnly: true,
  };
}
