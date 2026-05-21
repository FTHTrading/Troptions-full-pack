/**
 * TROPTIONS Web3 TV / TNN Content Engine
 *
 * Tracks episodes, shows, guests, sponsors, media rights, and status.
 * Simulation-only: no live streaming, video delivery, or payment processing.
 */

import { v4 as uuidv4 } from 'uuid';

export type GuestType =
  | 'CREATOR'
  | 'ATHLETE'
  | 'MERCHANT'
  | 'CHARITY'
  | 'SPONSOR'
  | 'FOUNDER'
  | 'EDUCATOR';

export type EpisodeStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'RECORDED'
  | 'EDITING'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'BLOCKED';

export interface EpisodeEvidence {
  type: 'guest_release' | 'sponsor_agreement' | 'transcript' | 'media_hash' | 'risk_flag';
  hash: string;
  attachedAt: Date;
  source?: string;
}

export interface TnnEpisodeRecord {
  id: string;
  showName: string;
  episodeNumber: number;
  episodeTitle: string;
  guestType: GuestType;
  guestName: string;
  status: EpisodeStatus;
  guestReleaseHash?: string;
  sponsorAgreementHash?: string;
  transcriptHash?: string;
  mediaUrl?: string;
  evidence: EpisodeEvidence[];
  riskFlags: string[];
  createdAt: Date;
  updatedAt: Date;
  releasedAt?: Date;
}

export interface TnnContentEngineSummary {
  totalEpisodes: number;
  publishedCount: number;
  draftCount: number;
  blockedCount: number;
  engineHash: string;
  disclaimer: string;
  simulationOnly: boolean;
}

const DISCLAIMER = `
TROPTIONS Media / TNN / Web3 TV is content and episode documentation only.
No live streaming, video delivery, media rights sale, sponsorship payment,
or token minting is enabled. All live media operations require platform approval.
This is simulation-only and for planning purposes.
`;

export class TnnContentEngine {
  private episodes: Map<string, TnnEpisodeRecord> = new Map();
  private engineHash: string = '';

  constructor() {
    this.engineHash = this.computeEngineHash();
  }

  /**
   * Create new episode record
   */
  createEpisodeRecord(
    showName: string,
    episodeNumber: number,
    title: string,
    guestType: GuestType,
    guestName: string
  ): TnnEpisodeRecord {
    const episode: TnnEpisodeRecord = {
      id: uuidv4(),
      showName,
      episodeNumber,
      episodeTitle: title,
      guestType,
      guestName,
      status: 'DRAFT',
      evidence: [],
      riskFlags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.episodes.set(episode.id, episode);
    this.engineHash = this.computeEngineHash();
    return episode;
  }

  /**
   * Attach evidence to episode (guest release, sponsor agreement, etc)
   */
  attachEpisodeEvidence(
    episodeId: string,
    evidenceType: 'guest_release' | 'sponsor_agreement' | 'transcript' | 'media_hash' | 'risk_flag',
    hash: string,
    source?: string
  ): boolean {
    const episode = this.episodes.get(episodeId);
    if (!episode) return false;

    // Track evidence separately
    if (evidenceType === 'guest_release') {
      episode.guestReleaseHash = hash;
    } else if (evidenceType === 'sponsor_agreement') {
      episode.sponsorAgreementHash = hash;
    } else if (evidenceType === 'transcript') {
      episode.transcriptHash = hash;
    } else if (evidenceType === 'media_hash') {
      episode.mediaUrl = hash;
    }

    episode.evidence.push({
      type: evidenceType,
      hash,
      attachedAt: new Date(),
      source,
    });

    episode.updatedAt = new Date();
    this.engineHash = this.computeEngineHash();
    return true;
  }

  /**
   * Update episode status with validation
   */
  updateEpisodeStatus(episodeId: string, newStatus: EpisodeStatus): { success: boolean; error?: string } {
    const episode = this.episodes.get(episodeId);
    if (!episode) return { success: false, error: 'Episode not found' };

    // Validation rules
    if (newStatus === 'PUBLISHED') {
      // Must have guest release
      if (!episode.guestReleaseHash) {
        return { success: false, error: 'Cannot publish: missing guest media release' };
      }
      // Sponsored episodes must have agreement
      if (episode.sponsorAgreementHash === undefined && episode.status === 'DRAFT') {
        return { success: false, error: 'Sponsored episodes require sponsor agreement before publishing' };
      }
    }

    if (newStatus === 'BLOCKED') {
      // Can block from any state
    }

    episode.status = newStatus;
    episode.updatedAt = new Date();

    if (newStatus === 'PUBLISHED') {
      episode.releasedAt = new Date();
    }

    this.engineHash = this.computeEngineHash();
    return { success: true };
  }

  /**
   * Generate episode packet summary for distribution
   */
  generateEpisodePacketSummary(episodeId: string): Record<string, unknown> | null {
    const episode = this.episodes.get(episodeId);
    if (!episode) return null;

    return {
      episodeId: episode.id,
      showName: episode.showName,
      episodeNumber: episode.episodeNumber,
      title: episode.episodeTitle,
      guestType: episode.guestType,
      guestName: episode.guestName,
      status: episode.status,
      hasGuestRelease: !!episode.guestReleaseHash,
      hasSponsorAgreement: !!episode.sponsorAgreementHash,
      hasTranscript: !!episode.transcriptHash,
      evidenceCount: episode.evidence.length,
      riskFlags: episode.riskFlags,
      releasedAt: episode.releasedAt,
      createdAt: episode.createdAt,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * List episodes by status
   */
  listByStatus(status: EpisodeStatus): TnnEpisodeRecord[] {
    return Array.from(this.episodes.values()).filter((ep) => ep.status === status);
  }

  /**
   * Get episode by ID
   */
  getEpisode(episodeId: string): TnnEpisodeRecord | undefined {
    return this.episodes.get(episodeId);
  }

  /**
   * Generate engine summary
   */
  generateSummary(): TnnContentEngineSummary {
    const published = this.listByStatus('PUBLISHED').length;
    const draft = this.listByStatus('DRAFT').length;
    const blocked = this.listByStatus('BLOCKED').length;

    return {
      totalEpisodes: this.episodes.size,
      publishedCount: published,
      draftCount: draft,
      blockedCount: blocked,
      engineHash: this.engineHash,
      disclaimer: DISCLAIMER,
      simulationOnly: true,
    };
  }

  /**
   * Compute deterministic engine hash
   */
  private computeEngineHash(): string {
    // In production, this would be a proper cryptographic hash
    // For simulation, we use a simplified version
    const episodeArray = Array.from(this.episodes.values())
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((ep) => `${ep.id}:${ep.status}:${ep.guestReleaseHash || ''}`)
      .join('|');

    return Buffer.from(episodeArray).toString('base64').substring(0, 64);
  }
}
