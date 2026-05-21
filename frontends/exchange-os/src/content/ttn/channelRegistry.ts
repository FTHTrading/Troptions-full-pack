/**
 * TTN Channel Registry
 *
 * CONTENT INFRASTRUCTURE ONLY.
 * Channel scheduling and metadata — not a broadcast license or financial product.
 */

export type ChannelCategory =
  | "news"
  | "education"
  | "entertainment"
  | "real-estate"
  | "technology"
  | "finance-education"
  | "solar-energy"
  | "sports"
  | "music"
  | "student"
  | "blockchain"
  | "lifestyle"
  | "documentary";

export type ChannelStatus = "live" | "scheduled" | "draft" | "paused" | "archived";
export type ProofStatus = "none" | "pending" | "verified" | "flagged";

export interface ScheduleSlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" | "Daily" | "Weekdays" | "Weekends";
  time: string;
  title: string;
}

export interface SponsorSlot {
  position: "pre-roll" | "mid-roll" | "banner" | "sponsored-segment";
  available: boolean;
  inquiryUrl: string;
}

export interface Channel {
  id: string;
  slug: string;
  title: string;
  description: string;
  tagline: string;
  category: ChannelCategory;
  creatorId: string;
  thumbnailColor: string;
  iconEmoji: string;
  schedule: ScheduleSlot[];
  videoIds: string[];
  podcastIds: string[];
  sponsorSlots: SponsorSlot[];
  proofStatus: ProofStatus;
  proofCid?: string;
  status: ChannelStatus;
  tags: string[];
  launchedAt: string;
}

export const TTN_CHANNELS: Channel[] = [
  {
    id: "ch-fth-news",
    slug: "fth-news",
    title: "FTH News",
    description:
      "Breaking news, ecosystem updates, partner announcements, and market commentary from FTH Trading and the Troptions network.",
    tagline: "Your network. Your news.",
    category: "news",
    creatorId: "creator-001",
    thumbnailColor: "#1E3A5F",
    iconEmoji: "📡",
    schedule: [
      { day: "Daily", time: "8:00 AM EST", title: "Morning Briefing" },
      { day: "Weekdays", time: "5:00 PM EST", title: "Market Close" },
    ],
    videoIds: ["vid-001"],
    podcastIds: [],
    sponsorSlots: [
      { position: "pre-roll", available: true, inquiryUrl: "/ttn/sponsors" },
      { position: "banner", available: true, inquiryUrl: "/ttn/sponsors" },
    ],
    proofStatus: "verified",
    proofCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    status: "live",
    tags: ["news", "troptions", "fth", "blockchain"],
    launchedAt: "2024-01-01",
  },
  {
    id: "ch-troptions-tv",
    slug: "troptions-tv",
    title: "Troptions TV",
    description:
      "Educational content, platform walkthroughs, governance updates, and ecosystem deep dives for the Troptions institutional community.",
    tagline: "Institutional knowledge. Creator access.",
    category: "education",
    creatorId: "creator-001",
    thumbnailColor: "#2A1A00",
    iconEmoji: "🎓",
    schedule: [
      { day: "Weekdays", time: "10:00 AM EST", title: "Platform Update" },
      { day: "Wed", time: "2:00 PM EST", title: "Deep Dive Wednesday" },
    ],
    videoIds: ["vid-002"],
    podcastIds: ["pod-001"],
    sponsorSlots: [
      { position: "sponsored-segment", available: true, inquiryUrl: "/ttn/sponsors" },
    ],
    proofStatus: "verified",
    status: "live",
    tags: ["troptions", "education", "web3", "institutional"],
    launchedAt: "2024-01-01",
  },
  {
    id: "ch-ttn-originals",
    slug: "ttn-originals",
    title: "TTN Originals",
    description:
      "Original programming produced by Troptions Television Network — documentaries, creator features, ecosystem spotlights, and TTN specials.",
    tagline: "Original. Owned. Proof-backed.",
    category: "documentary",
    creatorId: "creator-002",
    thumbnailColor: "#1A0A2E",
    iconEmoji: "🎬",
    schedule: [
      { day: "Sat", time: "8:00 PM EST", title: "TTN Original Feature" },
    ],
    videoIds: ["vid-003"],
    podcastIds: [],
    sponsorSlots: [
      { position: "pre-roll", available: true, inquiryUrl: "/ttn/sponsors" },
      { position: "mid-roll", available: true, inquiryUrl: "/ttn/sponsors" },
    ],
    proofStatus: "verified",
    status: "live",
    tags: ["originals", "documentary", "ttn", "creators"],
    launchedAt: "2024-06-01",
  },
  {
    id: "ch-real-estate",
    slug: "real-estate-tv",
    title: "Real Estate TV",
    description:
      "Property markets, land investment education, listing spotlights, and real estate strategy from The Real Estate Connections brand.",
    tagline: "Property insights. Real stories.",
    category: "real-estate",
    creatorId: "creator-003",
    thumbnailColor: "#0A2010",
    iconEmoji: "🏠",
    schedule: [
      { day: "Tue", time: "11:00 AM EST", title: "Market Spotlight" },
      { day: "Thu", time: "3:00 PM EST", title: "Listing Feature" },
    ],
    videoIds: [],
    podcastIds: [],
    sponsorSlots: [
      { position: "banner", available: true, inquiryUrl: "/ttn/sponsors" },
    ],
    proofStatus: "pending",
    status: "scheduled",
    tags: ["real-estate", "property", "land", "investment-education"],
    launchedAt: "2024-09-01",
  },
  {
    id: "ch-solar",
    slug: "solar-energy-tv",
    title: "Solar Energy TV",
    description:
      "Residential and commercial solar projects, energy education, cost savings stories, and clean energy news from Green-N-Go Solar.",
    tagline: "Power your story with clean energy.",
    category: "solar-energy",
    creatorId: "creator-004",
    thumbnailColor: "#1A2A00",
    iconEmoji: "☀️",
    schedule: [
      { day: "Fri", time: "12:00 PM EST", title: "Clean Energy Weekly" },
    ],
    videoIds: [],
    podcastIds: [],
    sponsorSlots: [
      { position: "pre-roll", available: true, inquiryUrl: "/ttn/sponsors" },
    ],
    proofStatus: "none",
    status: "draft",
    tags: ["solar", "energy", "sustainability", "green"],
    launchedAt: "2025-01-01",
  },
  {
    id: "ch-blockchain-101",
    slug: "blockchain-101",
    title: "Blockchain 101",
    description:
      "Plain-language blockchain education: XRPL, Stellar, Polygon, Web3 basics, wallet security, and ecosystem explainers. No financial advice.",
    tagline: "Understand it. Don't just use it.",
    category: "blockchain",
    creatorId: "creator-001",
    thumbnailColor: "#0A0E2A",
    iconEmoji: "⛓",
    schedule: [
      { day: "Mon", time: "9:00 AM EST", title: "Blockchain Basics" },
    ],
    videoIds: [],
    podcastIds: [],
    sponsorSlots: [],
    proofStatus: "none",
    status: "draft",
    tags: ["blockchain", "education", "xrpl", "web3"],
    launchedAt: "2025-06-01",
  },
  {
    id: "ch-students",
    slug: "student-creators",
    title: "Student Creators",
    description:
      "Showcase channel for emerging student filmmakers, journalists, podcasters, and digital creators publishing through the TTN platform.",
    tagline: "Your voice. Your channel.",
    category: "student",
    creatorId: "creator-005",
    thumbnailColor: "#1A0A1A",
    iconEmoji: "🎤",
    schedule: [],
    videoIds: [],
    podcastIds: [],
    sponsorSlots: [],
    proofStatus: "none",
    status: "draft",
    tags: ["student", "emerging-creators", "films", "shorts"],
    launchedAt: "2025-09-01",
  },
];

export function getChannel(slug: string): Channel | undefined {
  return TTN_CHANNELS.find((c) => c.slug === slug);
}

export function getLiveChannels(): Channel[] {
  return TTN_CHANNELS.filter((c) => c.status === "live");
}

export function getChannelsByCategory(category: ChannelCategory): Channel[] {
  return TTN_CHANNELS.filter((c) => c.category === category);
}
