/**
 * TROPTIONS NIL Creator Engine
 *
 * Tracks creator profiles, identity verification, media rights,
 * guardian consent, and sponsorship eligibility.
 * Simulation-only: no live payments or NFT minting.
 */

import { v4 as uuidv4 } from 'uuid';

export type CreatorType = 'ATHLETE' | 'MUSICIAN' | 'INFLUENCER' | 'EDUCATOR' | 'ENTREPRENEUR';
export type AgeGroup = 'ADULT' | 'MINOR_WITH_GUARDIAN';
export type CreatorStatus =
  | 'DRAFT'
  | 'ONBOARDING'
  | 'RIGHTS_PENDING'
  | 'MEDIA_RELEASE_PENDING'
  | 'CAMPAIGN_READY'
  | 'PUBLISHED'
  | 'BLOCKED';

export interface GuardianConsent {
  guardianName: string;
  consentHash: string;
  consentedAt: Date;
  relationship: string;
}

export interface CreatorEvidence {
  type: 'kyc' | 'media_release' | 'rights_agreement' | 'guardian_consent' | 'identity_proof' | 'risk_flag';
  hash: string;
  attachedAt: Date;
  source?: string;
}

export interface NilCreatorRecord {
  id: string;
  name: string;
  creatorType: CreatorType;
  ageGroup: AgeGroup;
  guardianRequired: boolean;
  guardianConsentHash?: string;
  guardianConsent?: GuardianConsent;
  kycStatus: 'PENDING' | 'VERIFIED' | 'BLOCKED';
  mediaReleaseHash?: string;
  rightsAgreementHash?: string;
  sponsorEligibilityStatus: 'PENDING' | 'ELIGIBLE' | 'INELIGIBLE';
  profileStatus: CreatorStatus;
  evidence: CreatorEvidence[];
  riskFlags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface NilCreatorSummary {
  totalCreators: number;
  publishedCount: number;
  campaignReadyCount: number;
  blockedCount: number;
  minorCount: number;
  engineHash: string;
  disclaimer: string;
  simulationOnly: boolean;
}

const DISCLAIMER = `
TROPTIONS NIL Creator Engine is profile and eligibility documentation only.
No live athlete payments, NIL deal settlement, income guarantees, or token minting is enabled.
All production NIL activity requires legal review, school/institution rule review,
guardian/minor review where applicable, and Control Hub approval.
This is simulation-only and for planning purposes.
`;

export class NilCreatorEngine {
  private creators: Map<string, NilCreatorRecord> = new Map();
  private engineHash: string = '';

  constructor() {
    this.engineHash = this.computeEngineHash();
  }

  /**
   * Create new creator profile
   */
  createCreatorProfile(
    name: string,
    creatorType: CreatorType,
    ageGroup: AgeGroup
  ): NilCreatorRecord {
    const guardianRequired = ageGroup === 'MINOR_WITH_GUARDIAN';

    const creator: NilCreatorRecord = {
      id: uuidv4(),
      name,
      creatorType,
      ageGroup,
      guardianRequired,
      kycStatus: 'PENDING',
      sponsorEligibilityStatus: 'PENDING',
      profileStatus: 'DRAFT',
      evidence: [],
      riskFlags: guardianRequired ? ['MINOR: Guardian consent required before campaign activation'] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.creators.set(creator.id, creator);
    this.engineHash = this.computeEngineHash();
    return creator;
  }

  /**
   * Attach creator evidence (KYC, releases, consent, etc)
   */
  attachCreatorEvidence(
    creatorId: string,
    evidenceType:
      | 'kyc'
      | 'media_release'
      | 'rights_agreement'
      | 'guardian_consent'
      | 'identity_proof'
      | 'risk_flag',
    hash: string,
    source?: string
  ): boolean {
    const creator = this.creators.get(creatorId);
    if (!creator) return false;

    if (evidenceType === 'kyc') {
      creator.kycStatus = 'VERIFIED';
    } else if (evidenceType === 'media_release') {
      creator.mediaReleaseHash = hash;
    } else if (evidenceType === 'rights_agreement') {
      creator.rightsAgreementHash = hash;
    } else if (evidenceType === 'guardian_consent') {
      creator.guardianConsentHash = hash;
    }

    creator.evidence.push({
      type: evidenceType,
      hash,
      attachedAt: new Date(),
      source,
    });

    creator.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return true;
  }

  /**
   * Record guardian consent for minor creators
   */
  recordGuardianConsent(
    creatorId: string,
    guardianName: string,
    relationship: string,
    consentHash: string
  ): { success: boolean; error?: string } {
    const creator = this.creators.get(creatorId);
    if (!creator) return { success: false, error: 'Creator not found' };

    if (!creator.guardianRequired) {
      return { success: false, error: 'This creator does not require guardian consent' };
    }

    creator.guardianConsent = {
      guardianName,
      consentHash,
      consentedAt: new Date(),
      relationship,
    };
    creator.guardianConsentHash = consentHash;
    creator.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Verify creator is campaign-ready
   */
  verifyCreatorReadiness(creatorId: string): { ready: boolean; blockers: string[] } {
    const creator = this.creators.get(creatorId);
    if (!creator) return { ready: false, blockers: ['Creator not found'] };

    const blockers: string[] = [];

    // KYC must be verified
    if (creator.kycStatus !== 'VERIFIED') {
      blockers.push('KYC verification required');
    }

    // Media release required for publication
    if (!creator.mediaReleaseHash) {
      blockers.push('Media release/rights agreement required');
    }

    // Guardian consent required for minors before campaign
    if (creator.guardianRequired && !creator.guardianConsentHash) {
      blockers.push('Guardian consent required for minor creator');
    }

    // Check for risk flags
    if (creator.riskFlags.length > 0) {
      blockers.push(`Risk flags present: ${creator.riskFlags.join(', ')}`);
    }

    return {
      ready: blockers.length === 0,
      blockers,
    };
  }

  /**
   * Update creator profile status
   */
  updateCreatorStatus(creatorId: string, newStatus: CreatorStatus): { success: boolean; error?: string } {
    const creator = this.creators.get(creatorId);
    if (!creator) return { success: false, error: 'Creator not found' };

    if (newStatus === 'PUBLISHED') {
      // Must have media release
      if (!creator.mediaReleaseHash) {
        return { success: false, error: 'Cannot publish: missing media release' };
      }
      // Minor must have guardian consent
      if (creator.guardianRequired && !creator.guardianConsentHash) {
        return { success: false, error: 'Cannot publish: minor requires guardian consent' };
      }
    }

    if (newStatus === 'CAMPAIGN_READY') {
      const { ready, blockers } = this.verifyCreatorReadiness(creatorId);
      if (!ready) {
        return { success: false, error: `Campaign blocked: ${blockers.join('; ')}` };
      }
    }

    creator.profileStatus = newStatus;
    creator.updatedAt = new Date();

    if (newStatus === 'PUBLISHED') {
      creator.publishedAt = new Date();
    }

    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Generate creator media kit summary
   */
  generateCreatorMediaKitSummary(creatorId: string): Record<string, unknown> | null {
    const creator = this.creators.get(creatorId);
    if (!creator) return null;

    const { ready, blockers } = this.verifyCreatorReadiness(creatorId);

    return {
      creatorId: creator.id,
      name: creator.name,
      creatorType: creator.creatorType,
      ageGroup: creator.ageGroup,
      guardianRequired: creator.guardianRequired,
      kycStatus: creator.kycStatus,
      profileStatus: creator.profileStatus,
      campaignReady: ready,
      readinessBlockers: blockers,
      hasMediaRelease: !!creator.mediaReleaseHash,
      hasRightsAgreement: !!creator.rightsAgreementHash,
      hasGuardianConsent: !!creator.guardianConsentHash,
      riskFlags: creator.riskFlags,
      publishedAt: creator.publishedAt,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * List creators by status
   */
  listByStatus(status: CreatorStatus): NilCreatorRecord[] {
    return Array.from(this.creators.values()).filter((c) => c.profileStatus === status);
  }

  /**
   * Get creator by ID
   */
  getCreator(creatorId: string): NilCreatorRecord | undefined {
    return this.creators.get(creatorId);
  }

  /**
   * Generate engine summary
   */
  generateSummary(): NilCreatorSummary {
    const published = this.listByStatus('PUBLISHED').length;
    const campaignReady = this.listByStatus('CAMPAIGN_READY').length;
    const blocked = this.listByStatus('BLOCKED').length;
    const minors = Array.from(this.creators.values()).filter((c) => c.ageGroup === 'MINOR_WITH_GUARDIAN')
      .length;

    return {
      totalCreators: this.creators.size,
      publishedCount: published,
      campaignReadyCount: campaignReady,
      blockedCount: blocked,
      minorCount: minors,
      engineHash: this.engineHash,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * Compute deterministic engine hash
   */
  private computeEngineHash(): string {
    const creatorArray = Array.from(this.creators.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((c) => `${c.id}:${c.profileStatus}:${c.mediaReleaseHash || ''}:${c.guardianConsentHash || ''}`)
      .join('|');

    return Buffer.from(creatorArray).toString('base64').substring(0, 64);
  }
}
