/**
 * TROPTIONS Media Rights & Signature Engine
 *
 * Manages media rights agreements, releases, signatures, and compliance gates.
 * Integrates with contractSignatureEngine for signature collection.
 * Simulation-only: no live signatures or document execution.
 */

import { v4 as uuidv4 } from 'uuid';

export type RightsAgreementType =
  | 'NIL_RIGHTS_AGREEMENT'
  | 'MEDIA_RELEASE'
  | 'SPONSOR_AGREEMENT'
  | 'CHARITY_RELEASE'
  | 'MERCHANT_FEATURE_RELEASE'
  | 'GUARDIAN_CONSENT';

export type RightsStatus =
  | 'DRAFT'
  | 'PENDING_SIGNATURE'
  | 'SIGNED'
  | 'EXECUTED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'BLOCKED';

export interface Signature {
  signatoryId: string;
  signatoryName: string;
  signatoryRole: 'CREATOR' | 'SPONSOR' | 'GUARDIAN' | 'MERCHANT' | 'CHARITY' | 'WITNESS';
  signatureHash: string;
  signedAt: Date;
  publicKey?: string;
}

export interface RightsAgreementRecord {
  id: string;
  agreementType: RightsAgreementType;
  agreementHash: string;
  agreementTitle: string;
  documentUrl?: string;
  relatedEntityId: string; // creator/sponsor/merchant/charity ID
  relatedEntityName: string;
  status: RightsStatus;
  requiredSignatures: string[]; // Signer roles required
  signatures: Signature[];
  governorConsentRequired: boolean;
  governorConsentHash?: string;
  governorName?: string;
  riskFlags: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
}

export interface MediaRightsEngineSummary {
  totalAgreements: number;
  signedCount: number;
  executedCount: number;
  pendingCount: number;
  blockedCount: number;
  engineHash: string;
  disclaimer: string;
  simulationOnly: boolean;
}

const DISCLAIMER = `
TROPTIONS Media Rights & Signature Engine is agreement documentation and signature
collection simulation only. No live document execution, media rights sale, or token
transfer is enabled. All live media rights transactions require full legal review,
media agency approval, and Control Hub authorization.
This is simulation-only and for planning purposes.
`;

export class MediaRightsSignatureEngine {
  private agreements: Map<string, RightsAgreementRecord> = new Map();
  private engineHash: string = '';

  constructor() {
    this.engineHash = this.computeEngineHash();
  }

  /**
   * Create new media rights agreement
   */
  createRightsAgreement(
    agreementType: RightsAgreementType,
    agreementTitle: string,
    relatedEntityId: string,
    relatedEntityName: string,
    requiredSignatures: string[],
    governorConsentRequired: boolean = false
  ): RightsAgreementRecord {
    const agreementHash = this.generateAgreementHash(agreementType, agreementTitle);

    const agreement: RightsAgreementRecord = {
      id: uuidv4(),
      agreementType,
      agreementHash,
      agreementTitle,
      relatedEntityId,
      relatedEntityName,
      status: 'DRAFT',
      requiredSignatures,
      signatures: [],
      governorConsentRequired,
      riskFlags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add risk flags for special cases
    if (governorConsentRequired) {
      agreement.riskFlags.push("GUARDIAN_REQUIRED: Minor's guardian must consent");
    }

    this.agreements.set(agreement.id, agreement);
    this.engineHash = this.computeEngineHash();
    return agreement;
  }

  /**
   * Collect signature from signatory
   */
  collectSignature(
    agreementId: string,
    signatoryId: string,
    signatoryName: string,
    signatoryRole: 'CREATOR' | 'SPONSOR' | 'GUARDIAN' | 'MERCHANT' | 'CHARITY' | 'WITNESS',
    signatureHash: string,
    publicKey?: string
  ): { success: boolean; error?: string } {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return { success: false, error: 'Agreement not found' };

    if (agreement.status === 'REVOKED' || agreement.status === 'BLOCKED') {
      return { success: false, error: `Cannot sign: agreement is ${agreement.status}` };
    }

    // Check if this role is required
    if (!agreement.requiredSignatures.includes(signatoryRole)) {
      return { success: false, error: `Signature from ${signatoryRole} not required for this agreement` };
    }

    // Check for duplicate signature from same signer
    if (agreement.signatures.some((s) => s.signatoryId === signatoryId)) {
      return { success: false, error: `${signatoryName} has already signed this agreement` };
    }

    const signature: Signature = {
      signatoryId,
      signatoryName,
      signatoryRole,
      signatureHash,
      signedAt: new Date(),
      publicKey,
    };

    agreement.signatures.push(signature);
    agreement.status = 'PENDING_SIGNATURE'; // Will be SIGNED when all collected

    // Check if all signatures collected
    if (this.allSignaturesCollected(agreement)) {
      agreement.status = 'SIGNED';
    }

    agreement.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Record guardian consent for minor-related agreements
   */
  recordGuardianConsent(
    agreementId: string,
    guardianName: string,
    consentHash: string
  ): { success: boolean; error?: string } {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return { success: false, error: 'Agreement not found' };

    if (!agreement.governorConsentRequired) {
      return { success: false, error: 'Guardian consent not required for this agreement' };
    }

    agreement.governorConsentHash = consentHash;
    agreement.governorName = guardianName;
    agreement.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Execute agreement (mark as executed, can be used for transactions)
   */
  executeAgreement(agreementId: string): { success: boolean; error?: string } {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return { success: false, error: 'Agreement not found' };

    // Must have all signatures
    if (!this.allSignaturesCollected(agreement)) {
      return { success: false, error: 'Not all signatures collected' };
    }

    // If guardian required, must have consent
    if (agreement.governorConsentRequired && !agreement.governorConsentHash) {
      return { success: false, error: 'Guardian consent required before execution' };
    }

    agreement.status = 'EXECUTED';
    agreement.executedAt = new Date();
    agreement.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Revoke agreement
   */
  revokeAgreement(agreementId: string, reason: string): { success: boolean; error?: string } {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return { success: false, error: 'Agreement not found' };

    agreement.status = 'REVOKED';
    agreement.riskFlags.push(`REVOKED: ${reason}`);
    agreement.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Block agreement
   */
  blockAgreement(agreementId: string, reason: string): { success: boolean; error?: string } {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return { success: false, error: 'Agreement not found' };

    agreement.status = 'BLOCKED';
    agreement.riskFlags.push(`BLOCKED: ${reason}`);
    agreement.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Generate media release packet
   */
  generateMediaReleasePacket(agreementId: string): Record<string, unknown> | null {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return null;

    return {
      agreementId: agreement.id,
      agreementType: agreement.agreementType,
      title: agreement.agreementTitle,
      relatedEntity: agreement.relatedEntityName,
      status: agreement.status,
      requiresGuardianConsent: agreement.governorConsentRequired,
      hasGuardianConsent: !!agreement.governorConsentHash,
      signaturesCollected: agreement.signatures.length,
      signaturesRequired: agreement.requiredSignatures.length,
      signers: agreement.signatures.map((s) => ({
        name: s.signatoryName,
        role: s.signatoryRole,
        signedAt: s.signedAt,
      })),
      allSignaturesCollected: this.allSignaturesCollected(agreement),
      riskFlags: agreement.riskFlags,
      executedAt: agreement.executedAt,
      expiresAt: agreement.expiresAt,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * List agreements by type
   */
  listByType(agreementType: RightsAgreementType): RightsAgreementRecord[] {
    return Array.from(this.agreements.values()).filter((a) => a.agreementType === agreementType);
  }

  /**
   * List agreements by status
   */
  listByStatus(status: RightsStatus): RightsAgreementRecord[] {
    return Array.from(this.agreements.values()).filter((a) => a.status === status);
  }

  /**
   * Get agreement by ID
   */
  getAgreement(agreementId: string): RightsAgreementRecord | undefined {
    return this.agreements.get(agreementId);
  }

  /**
   * Generate engine summary
   */
  generateSummary(): MediaRightsEngineSummary {
    const signed = this.listByStatus('SIGNED').length;
    const executed = this.listByStatus('EXECUTED').length;
    const pending = this.listByStatus('PENDING_SIGNATURE').length;
    const blocked = this.listByStatus('BLOCKED').length;

    return {
      totalAgreements: this.agreements.size,
      signedCount: signed,
      executedCount: executed,
      pendingCount: pending,
      blockedCount: blocked,
      engineHash: this.engineHash,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * Check if all required signatures collected
   */
  private allSignaturesCollected(agreement: RightsAgreementRecord): boolean {
    const signedRoles = new Set(agreement.signatures.map((s) => s.signatoryRole));
    return agreement.requiredSignatures.every((role) => signedRoles.has(role as any));
  }

  /**
   * Generate deterministic agreement hash
   */
  private generateAgreementHash(agreementType: RightsAgreementType, title: string): string {
    const content = `${agreementType}:${title}`;
    return Buffer.from(content).toString('base64').substring(0, 64);
  }

  /**
   * Compute deterministic engine hash
   */
  private computeEngineHash(): string {
    const agreementArray = Array.from(this.agreements.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((a) => `${a.id}:${a.status}:${a.signatures.length}/${a.requiredSignatures.length}`)
      .join('|');

    return Buffer.from(agreementArray).toString('base64').substring(0, 64);
  }
}
