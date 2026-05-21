/**
 * TTN Video Registry — content metadata only, no live streaming or CDN configuration.
 */

export type VideoStatus = "published" | "pending-review" | "draft" | "archived";
export type VideoType = "episode" | "short" | "trailer" | "documentary" | "tutorial" | "news" | "interview";

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  channelId: string;
  creatorId: string;
  thumbnailUrl: string;
  videoEmbedUrl?: string;
  duration: string;
  type: VideoType;
  tags: string[];
  proofCid?: string;
  publishedAt: string;
  status: VideoStatus;
  viewCount: number;
  episodeNumber?: number;
  seriesId?: string;
}

export const TTN_VIDEOS: Video[] = [
  {
    id: "vid-001",
    slug: "troptions-ecosystem-overview-2026",
    title: "Troptions Ecosystem Overview 2026",
    description:
      "A comprehensive look at the Troptions institutional operating platform — brands, infrastructure, XRPL integration, Stellar accounts, and TSN settlement architecture.",
    channelId: "ch-fth-news",
    creatorId: "creator-001",
    thumbnailUrl: "/assets/ttn/thumbnails/ecosystem-overview-placeholder.jpg",
    duration: "28:14",
    type: "documentary",
    tags: ["troptions", "ecosystem", "xrpl", "stellar", "overview"],
    proofCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    publishedAt: "2026-04-01",
    status: "published",
    viewCount: 1243,
  },
  {
    id: "vid-002",
    slug: "what-is-tut-mpt-explainer",
    title: "What is TUT? XRPL MPT Explainer",
    description:
      "Plain-language explainer on Troptions Unity Token (TUT), XLS-33 Multi-Purpose Token specifications, and the difference between spec-only and live-enabled assets.",
    channelId: "ch-troptions-tv",
    creatorId: "creator-001",
    thumbnailUrl: "/assets/ttn/thumbnails/tut-explainer-placeholder.jpg",
    duration: "14:22",
    type: "tutorial",
    tags: ["tut", "mpt", "xrpl", "xls-33", "explainer"],
    publishedAt: "2026-03-15",
    status: "published",
    viewCount: 887,
  },
  {
    id: "vid-003",
    slug: "ttn-origins-documentary",
    title: "TTN Origins — How Troptions Television Network Was Built",
    description:
      "The story behind Troptions Television Network: from concept to creator platform, proof registry, and Web3 media infrastructure.",
    channelId: "ch-ttn-originals",
    creatorId: "creator-002",
    thumbnailUrl: "/assets/ttn/thumbnails/ttn-origins-placeholder.jpg",
    duration: "42:07",
    type: "documentary",
    tags: ["ttn", "origins", "documentary", "media-infrastructure"],
    publishedAt: "2026-04-15",
    status: "pending-review",
    viewCount: 0,
  },
];

export function getVideo(slug: string): Video | undefined {
  return TTN_VIDEOS.find((v) => v.slug === slug);
}

export function getVideosByChannel(channelId: string): Video[] {
  return TTN_VIDEOS.filter((v) => v.channelId === channelId && v.status === "published");
}
