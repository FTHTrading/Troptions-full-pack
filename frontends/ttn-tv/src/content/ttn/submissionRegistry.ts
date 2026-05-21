/**
 * TTN Submission Registry
 *
 * Defines the data model and mock records for creator content submissions.
 *
 * SAFETY INVARIANTS (enforced as TypeScript literal types):
 *   simulationOnly: true
 *   livePublishingEnabled: false
 *
 * WHAT THIS IS NOT:
 * - Not a publishing pipeline (no live IPFS writes)
 * - Not a rights management system (does not replace legal agreements)
 * - Not a revenue engine (no earnings, royalties, or revenue sharing)
 * - Not a token/NFT minting layer
 *
 * Monetization, NFT, and token features are LEGAL-REVIEW-REQUIRED
 * before any implementation can begin.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubmissionType =
  | "channel-application"
  | "video"
  | "blog"
  | "podcast-episode"
  | "film"
  | "sponsor-pitch"
  | "rights-document"
  | "proof-request";

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "needs_rights_review";

export type RightsStatus = "missing" | "pending" | "verified" | "rejected";

export type IpfsStatus = "not_created" | "pending" | "pinned" | "failed";

// ─── Base ─────────────────────────────────────────────────────────────────────

export interface BaseSubmission {
  id: string;
  creatorId: string;
  type: SubmissionType;
  title: string;
  description: string;
  status: SubmissionStatus;
  /** Optional CID if a proof record has been created for this submission */
  proofCid?: string;
  rightsStatus: RightsStatus;
  ipfsStatus: IpfsStatus;
  createdAt: string;
  updatedAt: string;
  /** Admin review notes — simulation only */
  reviewNotes?: string;
  /** SAFETY: always true — no live publishing in this phase */
  simulationOnly: true;
  /** SAFETY: always false — no live publishing in this phase */
  livePublishingEnabled: false;
}

// ─── Typed Submission Variants ────────────────────────────────────────────────

export interface ChannelApplicationSubmission extends BaseSubmission {
  type: "channel-application";
  channelName: string;
  channelCategory: string;
  proposedSchedule?: string;
}

export interface VideoSubmission extends BaseSubmission {
  type: "video";
  channelId?: string;
  videoDuration?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
}

export interface BlogSubmission extends BaseSubmission {
  type: "blog";
  category?: string;
  tags?: string[];
  bodyPreview?: string;
}

export interface PodcastEpisodeSubmission extends BaseSubmission {
  type: "podcast-episode";
  showId?: string;
  episodeNumber?: number;
  guestName?: string;
  audioDuration?: string;
  audioFileRef?: string; // filename only — no real upload
}

export interface FilmSubmission extends BaseSubmission {
  type: "film";
  runtime?: string;
  genre?: string[];
  festivalTarget?: string;
  productionYear?: number;
}

export interface SponsorPitchSubmission extends BaseSubmission {
  type: "sponsor-pitch";
  targetChannelSlug?: string;
  targetShowSlug?: string;
  proposedBudgetNote?: string;
}

export interface RightsDocumentSubmission extends BaseSubmission {
  type: "rights-document";
  relatedContentId?: string;
  documentType?: "creator-agreement" | "licensing" | "release-form" | "clearance" | "other";
}

export interface ProofRequestSubmission extends BaseSubmission {
  type: "proof-request";
  relatedContentId?: string;
  relatedContentType?: "video" | "blog" | "podcast-episode" | "film" | "channel-manifest";
}

export type Submission =
  | ChannelApplicationSubmission
  | VideoSubmission
  | BlogSubmission
  | PodcastEpisodeSubmission
  | FilmSubmission
  | SponsorPitchSubmission
  | RightsDocumentSubmission
  | ProofRequestSubmission;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const TTN_SUBMISSIONS: Submission[] = [
  {
    id: "sub-001",
    creatorId: "creator-001",
    type: "channel-application",
    title: "FTH Daily Markets — New Channel Application",
    description:
      "Proposing a daily market commentary channel covering Troptions, XRPL, and alternative asset trading insights. No investment advice. Educational only.",
    status: "under_review",
    rightsStatus: "verified",
    ipfsStatus: "not_created",
    channelName: "FTH Daily Markets",
    channelCategory: "finance",
    proposedSchedule: "Monday–Friday, 9:00 AM EST",
    createdAt: "2026-04-20T10:00:00Z",
    updatedAt: "2026-04-22T14:30:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-002",
    creatorId: "creator-001",
    type: "video",
    title: "Troptions: The Full Overview — Episode 1",
    description:
      "A 45-minute deep-dive into the Troptions ecosystem, covering infrastructure, XRPL integration, and the CreatorOS platform.",
    status: "submitted",
    rightsStatus: "pending",
    ipfsStatus: "not_created",
    channelId: "ch-001",
    videoDuration: "45:12",
    createdAt: "2026-04-21T08:00:00Z",
    updatedAt: "2026-04-21T08:00:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-003",
    creatorId: "creator-002",
    type: "blog",
    title: "What the GENIUS Act Means for TTN Creators",
    description:
      "An editorial examining proposed stablecoin legislation and its practical implications for content creators operating on Web3 infrastructure.",
    status: "needs_rights_review",
    rightsStatus: "missing",
    ipfsStatus: "not_created",
    category: "policy",
    tags: ["genius-act", "stablecoin", "creator-rights", "regulation"],
    bodyPreview:
      "The proposed GENIUS Act creates a new federal framework for payment stablecoins. For creators building on Web3 rails, the implications are significant...",
    createdAt: "2026-04-22T11:00:00Z",
    updatedAt: "2026-04-23T09:15:00Z",
    reviewNotes: "Author must provide signed content agreement before review can proceed.",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-004",
    creatorId: "creator-001",
    type: "podcast-episode",
    title: "Sovereignty Talks Ep 4 — Kevan Burns on CreatorOS Architecture",
    description:
      "Kevan discusses the TTN CreatorOS build, the IPFS proof layer, and what sovereign media infrastructure means in 2026.",
    status: "draft",
    rightsStatus: "verified",
    ipfsStatus: "not_created",
    showId: "pod-001",
    episodeNumber: 4,
    audioDuration: "58:34",
    createdAt: "2026-04-24T15:00:00Z",
    updatedAt: "2026-04-24T15:00:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-005",
    creatorId: "creator-003",
    type: "film",
    title: "Roots of Value — A Documentary Short",
    description:
      "A 28-minute documentary exploring how real-world asset tokenization changes access to capital for underserved communities.",
    status: "submitted",
    rightsStatus: "pending",
    ipfsStatus: "not_created",
    runtime: "28:15",
    genre: ["documentary", "social-impact"],
    productionYear: 2026,
    createdAt: "2026-04-23T13:00:00Z",
    updatedAt: "2026-04-23T13:00:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-006",
    creatorId: "creator-001",
    type: "proof-request",
    title: "Proof Request — Troptions Overview Episode 1",
    description:
      "Request to register an IPFS proof record for the Troptions Overview video once rights are verified.",
    status: "draft",
    rightsStatus: "pending",
    ipfsStatus: "pending",
    relatedContentId: "sub-002",
    relatedContentType: "video",
    createdAt: "2026-04-25T09:00:00Z",
    updatedAt: "2026-04-25T09:00:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-007",
    creatorId: "creator-002",
    type: "rights-document",
    title: "Content Creator Agreement — Creator 002",
    description:
      "Standard TTN creator agreement covering content rights, licensing, and platform terms for channel operations.",
    status: "under_review",
    rightsStatus: "pending",
    ipfsStatus: "not_created",
    documentType: "creator-agreement",
    createdAt: "2026-04-19T10:00:00Z",
    updatedAt: "2026-04-21T16:00:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-008",
    creatorId: "creator-005",
    type: "channel-application",
    title: "Student Creators — Channel Application",
    description:
      "TTN Student Creators collective applying for a dedicated channel to publish student-produced short films and media projects.",
    status: "approved",
    rightsStatus: "verified",
    ipfsStatus: "not_created",
    channelName: "TTN Student Creators",
    channelCategory: "education",
    proposedSchedule: "Weekly, Fridays",
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-15T12:00:00Z",
    reviewNotes: "Approved. Welcome to TTN.",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
  {
    id: "sub-009",
    creatorId: "creator-004",
    type: "sponsor-pitch",
    title: "FTH Markets Sponsorship Proposal — Q3 2026",
    description:
      "Sponsorship pitch for the FTH Daily Markets channel, proposing a 30-day educational content sponsorship arrangement. No revenue guarantees or investment commitments.",
    status: "submitted",
    rightsStatus: "pending",
    ipfsStatus: "not_created",
    targetChannelSlug: "fth-daily-markets",
    proposedBudgetNote: "Budget range TBD pending rights and compliance review.",
    createdAt: "2026-04-26T10:00:00Z",
    updatedAt: "2026-04-26T10:00:00Z",
    simulationOnly: true,
    livePublishingEnabled: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getSubmission(id: string): Submission | undefined {
  return TTN_SUBMISSIONS.find((s) => s.id === id);
}

export function getSubmissionsByCreator(creatorId: string): Submission[] {
  return TTN_SUBMISSIONS.filter((s) => s.creatorId === creatorId);
}

export function getSubmissionsByType(type: SubmissionType): Submission[] {
  return TTN_SUBMISSIONS.filter((s) => s.type === type);
}

export function getSubmissionsByStatus(status: SubmissionStatus): Submission[] {
  return TTN_SUBMISSIONS.filter((s) => s.status === status);
}

export function getPendingReviewSubmissions(): Submission[] {
  return TTN_SUBMISSIONS.filter(
    (s) => s.status === "submitted" || s.status === "under_review",
  );
}

export function getSubmissionsNeedingRights(): Submission[] {
  return TTN_SUBMISSIONS.filter(
    (s) => s.rightsStatus === "missing" || s.status === "needs_rights_review",
  );
}

export function getSubmissionsNeedingProof(): Submission[] {
  return TTN_SUBMISSIONS.filter(
    (s) => s.ipfsStatus === "not_created" && (s.status === "approved" || s.status === "under_review"),
  );
}

// ─── Status display helpers ───────────────────────────────────────────────────

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  needs_rights_review: "Rights Review Needed",
};

export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  "channel-application": "Channel Application",
  video: "Video",
  blog: "Blog Post",
  "podcast-episode": "Podcast Episode",
  film: "Film",
  "sponsor-pitch": "Sponsor Pitch",
  "rights-document": "Rights Document",
  "proof-request": "Proof Request",
};
