/**
 * TTN Creator Registry
 *
 * CONTENT INFRASTRUCTURE ONLY.
 * Not a financial instrument. Does not confer investment rights,
 * revenue guarantees, or legal ownership claims beyond what a signed
 * creator agreement expressly provides.
 */

export type CreatorStatus = "active" | "pending" | "suspended" | "draft";
export type VerifiedBadge = "none" | "email" | "identity" | "legal";

export interface CreatorSocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  farcaster?: string;
  lens?: string;
  tiktok?: string;
}

export interface Creator {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  bio: string;
  tagline: string;
  status: CreatorStatus;
  verifiedBadge: VerifiedBadge;
  channelIds: string[];
  videoIds: string[];
  blogIds: string[];
  podcastIds: string[];
  filmIds: string[];
  proofRecordIds: string[];
  socialLinks: CreatorSocialLinks;
  joinedAt: string;
  location?: string;
  specialty: string[];
}

export const TTN_CREATORS: Creator[] = [
  {
    id: "creator-001",
    slug: "kevan-burns",
    name: "Kevan Burns",
    avatar: "/assets/troptions/logos/troptions-tt-black.jpg",
    bio: "Founder of Troptions and FTH Trading. Building sovereign media, blockchain infrastructure, and creator tools at the intersection of Web3 and real-world commerce.",
    tagline: "Sovereign infrastructure builder",
    status: "active",
    verifiedBadge: "identity",
    channelIds: ["ch-fth-news", "ch-troptions-tv"],
    videoIds: ["vid-001", "vid-002"],
    blogIds: ["blog-001", "blog-002"],
    podcastIds: ["pod-001"],
    filmIds: [],
    proofRecordIds: ["proof-creator-001"],
    socialLinks: {
      website: "https://troptions.unykorn.org",
      twitter: "https://twitter.com/FTHTrading",
    },
    joinedAt: "2024-01-01",
    location: "Atlanta, GA",
    specialty: ["Web3", "Media Infrastructure", "Blockchain", "Commerce"],
  },
  {
    id: "creator-002",
    slug: "ttn-originals",
    name: "TTN Originals",
    avatar: "/assets/ttn/ttn-logo-placeholder.png",
    bio: "Official original programming channel from Troptions Television Network. Documentaries, series, specials, and ecosystem spotlights.",
    tagline: "The official TTN studio",
    status: "active",
    verifiedBadge: "identity",
    channelIds: ["ch-ttn-originals"],
    videoIds: ["vid-003"],
    blogIds: ["blog-003"],
    podcastIds: [],
    filmIds: ["film-001"],
    proofRecordIds: ["proof-creator-002"],
    socialLinks: {
      website: "https://troptionstelevisionnetwork.tv",
    },
    joinedAt: "2024-01-01",
    location: "Atlanta, GA",
    specialty: ["Documentary", "Original Series", "Ecosystem Reporting"],
  },
  {
    id: "creator-003",
    slug: "real-estate-connections",
    name: "Real Estate Connections",
    avatar: "/assets/ttn/rec-logo-placeholder.png",
    bio: "Property, land, and real estate content channel from the Troptions Real Estate Connections brand. Market updates, listings, and land investment education.",
    tagline: "Real property. Real stories.",
    status: "active",
    verifiedBadge: "email",
    channelIds: ["ch-real-estate"],
    videoIds: [],
    blogIds: ["blog-004"],
    podcastIds: [],
    filmIds: [],
    proofRecordIds: [],
    socialLinks: {},
    joinedAt: "2024-03-01",
    location: "Southeast USA",
    specialty: ["Real Estate", "Land", "Property Education"],
  },
  {
    id: "creator-004",
    slug: "green-n-go-solar",
    name: "Green-N-Go Solar",
    avatar: "/assets/ttn/solar-logo-placeholder.png",
    bio: "Solar energy education and project documentation for homeowners, businesses, and communities. Troptions ecosystem energy channel.",
    tagline: "Clean energy. Clear proof.",
    status: "active",
    verifiedBadge: "email",
    channelIds: ["ch-solar"],
    videoIds: [],
    blogIds: ["blog-005"],
    podcastIds: [],
    filmIds: [],
    proofRecordIds: [],
    socialLinks: {},
    joinedAt: "2024-06-01",
    location: "USA",
    specialty: ["Solar", "Energy", "Sustainability"],
  },
  {
    id: "creator-005",
    slug: "ttn-student-creators",
    name: "TTN Student Creators",
    avatar: "/assets/ttn/students-logo-placeholder.png",
    bio: "A launchpad for emerging student creators to publish films, vlogs, podcasts, and reports through the TTN platform.",
    tagline: "The next generation of creators",
    status: "draft",
    verifiedBadge: "none",
    channelIds: ["ch-students"],
    videoIds: [],
    blogIds: [],
    podcastIds: [],
    filmIds: ["film-002"],
    proofRecordIds: [],
    socialLinks: {},
    joinedAt: "2025-01-01",
    specialty: ["Student Media", "Short Films", "Podcasting"],
  },
];

export function getCreator(slug: string): Creator | undefined {
  return TTN_CREATORS.find((c) => c.slug === slug);
}

export function getActiveCreators(): Creator[] {
  return TTN_CREATORS.filter((c) => c.status === "active");
}
