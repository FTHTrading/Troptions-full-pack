/**
 * TROPTIONS Sponsor Campaign Engine
 *
 * Tracks sponsor campaigns, NIL deals, deliverables, proof of performance,
 * and payment readiness.
 * Simulation-only: no live payments or settlement.
 */

import { v4 as uuidv4 } from 'uuid';

export type CampaignType =
  | 'NIL_DEAL'
  | 'INTERVIEW_SPONSOR'
  | 'MERCHANT_SPOTLIGHT'
  | 'CHARITY_CAMPAIGN'
  | 'EVENT_COVERAGE';

export type CampaignStatus =
  | 'DRAFT'
  | 'AGREEMENT_PENDING'
  | 'ACTIVE'
  | 'IN_DELIVERY'
  | 'PROOF_SUBMITTED'
  | 'PAYMENT_READY'
  | 'COMPLETED'
  | 'BLOCKED';

export interface Deliverable {
  id: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  proofHash?: string;
  status: 'PENDING' | 'DELIVERED' | 'VERIFIED' | 'DISPUTED';
}

export interface CampaignEvidence {
  type: 'agreement' | 'proof' | 'deliverable' | 'payment_proof' | 'risk_flag';
  hash: string;
  attachedAt: Date;
  source?: string;
}

export interface SponsorCampaignRecord {
  id: string;
  campaignName: string;
  sponsorName: string;
  sponsorId?: string;
  creatorId: string;
  creatorName: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  agreementHash?: string;
  deliverables: Deliverable[];
  deliverablesCompleted: number;
  proofOfPerformanceHash?: string;
  paymentReadinessStatus: 'NOT_READY' | 'PENDING_REVIEW' | 'READY' | 'BLOCKED';
  evidence: CampaignEvidence[];
  riskFlags: string[];
  campaignValue: string; // In native currency, string for precision
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface SponsorCampaignSummary {
  totalCampaigns: number;
  activeCount: number;
  paymentReadyCount: number;
  completedCount: number;
  blockedCount: number;
  totalValue: string;
  engineHash: string;
  disclaimer: string;
  simulationOnly: boolean;
}

const DISCLAIMER = `
TROPTIONS Sponsor Campaign Engine is campaign planning and proof tracking only.
No live payments, sponsorship guarantees, or settlement is enabled.
All live campaign payouts require agreement verification, proof submission,
and Control Hub approval.
This is simulation-only and for planning purposes.
`;

export class SponsorCampaignEngine {
  private campaigns: Map<string, SponsorCampaignRecord> = new Map();
  private engineHash: string = '';

  constructor() {
    this.engineHash = this.computeEngineHash();
  }

  /**
   * Create new sponsor campaign
   */
  createSponsorCampaign(
    campaignName: string,
    sponsorName: string,
    creatorId: string,
    creatorName: string,
    campaignType: CampaignType,
    campaignValue: string
  ): SponsorCampaignRecord {
    const campaign: SponsorCampaignRecord = {
      id: uuidv4(),
      campaignName,
      sponsorName,
      creatorId,
      creatorName,
      campaignType,
      status: 'DRAFT',
      deliverables: [],
      deliverablesCompleted: 0,
      paymentReadinessStatus: 'NOT_READY',
      evidence: [],
      riskFlags: [],
      campaignValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);
    this.engineHash = this.computeEngineHash();
    return campaign;
  }

  /**
   * Add deliverable to campaign
   */
  addDeliverable(
    campaignId: string,
    description: string,
    dueDate: Date
  ): { success: boolean; deliverableId?: string; error?: string } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    const deliverable: Deliverable = {
      id: uuidv4(),
      description,
      dueDate,
      status: 'PENDING',
    };

    campaign.deliverables.push(deliverable);
    campaign.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();

    return { success: true, deliverableId: deliverable.id };
  }

  /**
   * Mark deliverable as completed with proof
   */
  markDeliverableCompleted(
    campaignId: string,
    deliverableId: string,
    proofHash: string
  ): { success: boolean; error?: string } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    const deliverable = campaign.deliverables.find((d) => d.id === deliverableId);
    if (!deliverable) return { success: false, error: 'Deliverable not found' };

    deliverable.status = 'DELIVERED';
    deliverable.completedDate = new Date();
    deliverable.proofHash = proofHash;
    campaign.deliverablesCompleted += 1;

    campaign.evidence.push({
      type: 'deliverable',
      hash: proofHash,
      attachedAt: new Date(),
      source: `Deliverable: ${deliverable.description}`,
    });

    campaign.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();

    return { success: true };
  }

  /**
   * Attach campaign agreement
   */
  attachCampaignAgreement(campaignId: string, agreementHash: string): { success: boolean; error?: string } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    campaign.agreementHash = agreementHash;
    campaign.evidence.push({
      type: 'agreement',
      hash: agreementHash,
      attachedAt: new Date(),
    });

    campaign.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Attach proof of performance
   */
  attachProofOfPerformance(campaignId: string, proofHash: string): { success: boolean; error?: string } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    campaign.proofOfPerformanceHash = proofHash;
    campaign.evidence.push({
      type: 'proof',
      hash: proofHash,
      attachedAt: new Date(),
    });

    campaign.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Evaluate campaign payment readiness
   */
  evaluatePaymentReadiness(campaignId: string): {
    ready: boolean;
    blockers: string[];
    allDeliverables: string;
  } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { ready: false, blockers: ['Campaign not found'], allDeliverables: '0/0' };

    const blockers: string[] = [];

    // Need agreement
    if (!campaign.agreementHash) {
      blockers.push('Sponsor agreement required');
    }

    // Need proof of performance
    if (!campaign.proofOfPerformanceHash) {
      blockers.push('Proof of performance required');
    }

    // All deliverables must be completed
    const allCompleted = campaign.deliverables.every((d) => d.status === 'DELIVERED');
    const allDeliverables = `${campaign.deliverablesCompleted}/${campaign.deliverables.length}`;
    if (!allCompleted && campaign.deliverables.length > 0) {
      blockers.push(`Deliverables not complete: ${allDeliverables}`);
    }

    return {
      ready: blockers.length === 0,
      blockers,
      allDeliverables,
    };
  }

  /**
   * Update campaign status
   */
  updateCampaignStatus(campaignId: string, newStatus: CampaignStatus): { success: boolean; error?: string } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    if (newStatus === 'PAYMENT_READY') {
      const { ready, blockers } = this.evaluatePaymentReadiness(campaignId);
      if (!ready) {
        return { success: false, error: `Not payment-ready: ${blockers.join('; ')}` };
      }
    }

    campaign.status = newStatus;
    campaign.updatedAt = new Date();

    if (newStatus === 'COMPLETED') {
      campaign.completedAt = new Date();
    }

    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Generate sponsor packet summary
   */
  generateSponsorPacketSummary(campaignId: string): Record<string, unknown> | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    const { ready, blockers, allDeliverables } = this.evaluatePaymentReadiness(campaignId);

    return {
      campaignId: campaign.id,
      campaignName: campaign.campaignName,
      sponsorName: campaign.sponsorName,
      creatorName: campaign.creatorName,
      campaignType: campaign.campaignType,
      status: campaign.status,
      campaignValue: campaign.campaignValue,
      deliverablesStatus: allDeliverables,
      hasAgreement: !!campaign.agreementHash,
      hasProofOfPerformance: !!campaign.proofOfPerformanceHash,
      paymentReady: ready,
      paymentReadinessBlockers: blockers,
      evidenceCount: campaign.evidence.length,
      riskFlags: campaign.riskFlags,
      completedAt: campaign.completedAt,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * List campaigns by status
   */
  listByStatus(status: CampaignStatus): SponsorCampaignRecord[] {
    return Array.from(this.campaigns.values()).filter((c) => c.status === status);
  }

  /**
   * Get campaign by ID
   */
  getCampaign(campaignId: string): SponsorCampaignRecord | undefined {
    return this.campaigns.get(campaignId);
  }

  /**
   * Generate engine summary
   */
  generateSummary(): SponsorCampaignSummary {
    const active = this.listByStatus('ACTIVE').length;
    const paymentReady = this.listByStatus('PAYMENT_READY').length;
    const completed = this.listByStatus('COMPLETED').length;
    const blocked = this.listByStatus('BLOCKED').length;

    // Sum campaign values (simplified for simulation)
    const totalValue = Array.from(this.campaigns.values())
      .reduce((sum, c) => {
        try {
          return sum + BigInt(c.campaignValue);
        } catch {
          return sum;
        }
      }, BigInt(0))
      .toString();

    return {
      totalCampaigns: this.campaigns.size,
      activeCount: active,
      paymentReadyCount: paymentReady,
      completedCount: completed,
      blockedCount: blocked,
      totalValue,
      engineHash: this.engineHash,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * Compute deterministic engine hash
   */
  private computeEngineHash(): string {
    const campaignArray = Array.from(this.campaigns.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(
        (c) =>
          `${c.id}:${c.status}:${c.agreementHash || ''}:${c.proofOfPerformanceHash || ''}:${c.deliverablesCompleted}/${c.deliverables.length}`
      )
      .join('|');

    return Buffer.from(campaignArray).toString('base64').substring(0, 64);
  }
}
