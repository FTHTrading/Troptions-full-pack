/**
 * TTN Sponsor Registry
 * Advertising and sponsorship opportunities — inquiry only.
 * No live ad serving, no programmatic integration.
 */

export type SponsorCategory =
  | "technology"
  | "real-estate"
  | "finance-education"
  | "legal-services"
  | "energy"
  | "media"
  | "retail"
  | "health"
  | "education"
  | "events"
  | "other";

export type SponsorStatus = "active" | "pending" | "paused" | "archived" | "prospective";
export type SponsorTier = "founding" | "premium" | "standard" | "community";

export interface SponsorContact {
  name?: string;
  email?: string;
  website?: string;
  phone?: string;
}

export interface SponsorOpportunity {
  id: string;
  channelSlug?: string;
  showSlug?: string;
  type: "pre-roll" | "mid-roll" | "banner" | "sponsored-segment" | "show-sponsorship" | "event-sponsorship";
  title: string;
  description: string;
  estimatedReachPerMonth: string;
  priceRange: string;
  available: boolean;
  inquiryUrl: string;
}

export interface Sponsor {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  tagline: string;
  category: SponsorCategory;
  tier: SponsorTier;
  website: string;
  contact: SponsorContact;
  opportunities: SponsorOpportunity[];
  channelTargets: string[];
  showTargets: string[];
  status: SponsorStatus;
  partnerSince?: string;
  notes?: string;
}

export const TTN_SPONSORS: Sponsor[] = [
  {
    id: "sponsor-001",
    slug: "fth-trading-house",
    name: "FTH Trading House",
    logoUrl: "/assets/ttn/sponsors/fth-logo-placeholder.png",
    tagline: "Sovereign infrastructure for commerce and media",
    category: "technology",
    tier: "founding",
    website: "https://troptions.unykorn.org",
    contact: {
      website: "https://troptions.unykorn.org",
    },
    opportunities: [
      {
        id: "opp-fth-001",
        channelSlug: "fth-news",
        type: "show-sponsorship",
        title: "FTH News — Primary Show Sponsor",
        description: "Exclusive sponsorship of the FTH News channel on TTN. Pre-roll, banner, and segment mentions.",
        estimatedReachPerMonth: "N/A — estimated future",
        priceRange: "Custom — contact for details",
        available: false,
        inquiryUrl: "/ttn/sponsors",
      },
    ],
    channelTargets: ["fth-news", "troptions-tv"],
    showTargets: ["troptions-sovereignty-podcast"],
    status: "active",
    partnerSince: "2024-01-01",
    notes: "Founding sponsor. Internal Troptions entity.",
  },
];

export const TTN_SPONSOR_OPPORTUNITIES: SponsorOpportunity[] = [
  {
    id: "opp-general-001",
    type: "banner",
    title: "TTN Homepage Banner",
    description: "Rotating banner placement on the TTN CreatorOS homepage. Brand logo, tagline, and link.",
    estimatedReachPerMonth: "Est. 5,000+ monthly visitors (projected)",
    priceRange: "$250–$750 / month",
    available: true,
    inquiryUrl: "/ttn/sponsors",
  },
  {
    id: "opp-general-002",
    channelSlug: "ttn-originals",
    type: "pre-roll",
    title: "TTN Originals — Pre-Roll Sponsor",
    description: "15-second pre-roll sponsor mention on TTN Originals documentary content.",
    estimatedReachPerMonth: "Est. 1,000–3,000 views / title (projected)",
    priceRange: "$150–$500 / placement",
    available: true,
    inquiryUrl: "/ttn/sponsors",
  },
  {
    id: "opp-general-003",
    showSlug: "troptions-sovereignty-podcast",
    type: "show-sponsorship",
    title: "Sovereignty Talks — Show Sponsor",
    description: "Named sponsorship of the Sovereignty Talks podcast: logo on show art, verbal mention in each episode.",
    estimatedReachPerMonth: "Est. 500–1,500 downloads / episode (projected)",
    priceRange: "$500–$2,000 / season",
    available: true,
    inquiryUrl: "/ttn/sponsors",
  },
  {
    id: "opp-general-004",
    channelSlug: "real-estate-tv",
    type: "sponsored-segment",
    title: "Real Estate TV — Sponsored Market Report Segment",
    description: "Sponsor a weekly 3-minute market report segment on Real Estate TV. Brand integration + verbal mention.",
    estimatedReachPerMonth: "Est. 1,000–2,500 views (projected)",
    priceRange: "$300–$900 / month",
    available: true,
    inquiryUrl: "/ttn/sponsors",
  },
];

export function getSponsor(slug: string): Sponsor | undefined {
  return TTN_SPONSORS.find((s) => s.slug === slug);
}

export function getActiveSponsors(): Sponsor[] {
  return TTN_SPONSORS.filter((s) => s.status === "active");
}

export function getOpenOpportunities(): SponsorOpportunity[] {
  return TTN_SPONSOR_OPPORTUNITIES.filter((o) => o.available);
}
