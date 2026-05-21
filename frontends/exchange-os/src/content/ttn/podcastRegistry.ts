/**
 * TTN Podcast Registry
 * Podcast shows + episodes metadata. No live RSS generation — RSS URLs are external.
 */

export type PodcastStatus = "active" | "hiatus" | "complete" | "draft";
export type EpisodeStatus = "published" | "pending-review" | "draft";

export interface PodcastGuest {
  name: string;
  title?: string;
  organization?: string;
}

export interface PodcastSponsorSlot {
  position: "pre-roll" | "mid-roll" | "post-roll";
  available: boolean;
  inquiryUrl: string;
}

export interface PodcastEpisode {
  id: string;
  showId: string;
  slug: string;
  title: string;
  description: string;
  audioEmbedUrl?: string;
  audioMp3Url?: string;
  duration: string;
  episodeNumber: number;
  season: number;
  guest?: PodcastGuest;
  showNotes: string;
  transcript?: string;
  tags: string[];
  proofCid?: string;
  publishedAt: string;
  status: EpisodeStatus;
}

export interface PodcastShow {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline: string;
  hostId: string;
  thumbnailUrl: string;
  category: string;
  rssFeedUrl?: string;
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  sponsorSlots: PodcastSponsorSlot[];
  tags: string[];
  episodeIds: string[];
  status: PodcastStatus;
  launchedAt: string;
}

export const TTN_PODCAST_SHOWS: PodcastShow[] = [
  {
    id: "pod-001",
    slug: "troptions-sovereignty-podcast",
    title: "Sovereignty Talks",
    description:
      "Kevan Burns and guests discuss blockchain infrastructure, Web3 commerce, creator sovereignty, institutional media, and the Troptions ecosystem. No investment advice.",
    tagline: "Own your signal. Own your proof.",
    hostId: "creator-001",
    thumbnailUrl: "/assets/ttn/podcasts/sovereignty-talks-cover-placeholder.jpg",
    category: "technology",
    tags: ["sovereignty", "blockchain", "web3", "creator-economy", "troptions"],
    episodeIds: ["ep-001", "ep-002", "ep-003"],
    sponsorSlots: [
      { position: "pre-roll", available: true, inquiryUrl: "/ttn/sponsors" },
      { position: "mid-roll", available: true, inquiryUrl: "/ttn/sponsors" },
    ],
    status: "active",
    launchedAt: "2025-06-01",
  },
];

export const TTN_PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "ep-001",
    showId: "pod-001",
    slug: "ep-001-what-is-troptions",
    title: "What Is Troptions? A Plain-Language Deep Dive",
    description:
      "Kevan Burns breaks down the Troptions ecosystem from first principles: what it is, what it is not, how the platform works, and where it is going.",
    duration: "52:08",
    episodeNumber: 1,
    season: 1,
    showNotes:
      "Topics: Troptions history, XRPL integration, TSN settlement network, proof architecture, TTN media platform, next milestones. No investment claims.",
    tags: ["troptions", "intro", "explainer", "xrpl"],
    publishedAt: "2025-07-01",
    status: "published",
    proofCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
  },
  {
    id: "ep-002",
    showId: "pod-001",
    slug: "ep-002-ipfs-proof-for-creators",
    title: "IPFS Proof for Creators: What You Need to Know",
    description:
      "A deep dive into IPFS CID proof records, how TTN uses them, and what creator-level proof actually means in practice.",
    duration: "38:45",
    episodeNumber: 2,
    season: 1,
    showNotes:
      "Topics: IPFS architecture, CID generation, Kubo RPC, pinning services, TTN proof registry, creator evidence records. Not legal advice.",
    tags: ["ipfs", "proof", "creators", "cid"],
    publishedAt: "2025-08-01",
    status: "published",
  },
  {
    id: "ep-003",
    showId: "pod-001",
    slug: "ep-003-ttn-creatorOS-walkthrough",
    title: "TTN CreatorOS Walkthrough — All Features Explained",
    description:
      "A walkthrough of every feature in TTN CreatorOS v1: channels, studio, proof registry, blog, podcasts, short films, and admin tools.",
    duration: "1:04:22",
    episodeNumber: 3,
    season: 1,
    showNotes:
      "Topics: TTN CreatorOS feature set, creator onboarding, IPFS proof, admin review, simulation-only flags, roadmap. No financial products discussed.",
    tags: ["creatorOS", "walkthrough", "ttn", "platform"],
    publishedAt: "2026-04-27",
    status: "published",
  },
];

export function getPodcastShow(slug: string): PodcastShow | undefined {
  return TTN_PODCAST_SHOWS.find((s) => s.slug === slug);
}

export function getEpisode(slug: string): PodcastEpisode | undefined {
  return TTN_PODCAST_EPISODES.find((e) => e.slug === slug);
}

export function getEpisodesForShow(showId: string): PodcastEpisode[] {
  return TTN_PODCAST_EPISODES.filter(
    (e) => e.showId === showId && e.status === "published"
  ).sort((a, b) => b.episodeNumber - a.episodeNumber);
}
