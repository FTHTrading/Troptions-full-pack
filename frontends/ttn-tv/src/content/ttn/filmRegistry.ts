/**
 * TTN Film Registry
 * Short films, documentaries, student films, and TTN originals.
 * RIGHTS NOTICE: All rights status fields are informational only.
 * No live distribution licensing or revenue splits are configured here.
 */

export type FilmStatus = "published" | "in-production" | "post-production" | "pending-review" | "draft" | "archived";
export type RightsStatus = "all-rights-reserved" | "creative-commons" | "pending-clearance" | "licensed" | "under-review";
export type FestivalStatus = "not-submitted" | "submitted" | "accepted" | "screening" | "awarded";

export interface FilmCredit {
  role: string;
  name: string;
}

export interface Film {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  trailerEmbedUrl?: string;
  fullVideoUrl?: string;
  runtime: string;
  genre: string[];
  creatorId: string;
  channelId?: string;
  credits: FilmCredit[];
  productionYear: number;
  rightsStatus: RightsStatus;
  proofCid?: string;
  festivalStatus: FestivalStatus;
  festivalDetails?: string;
  status: FilmStatus;
  tags: string[];
  submittedAt?: string;
  publishedAt?: string;
}

export const TTN_FILMS: Film[] = [
  {
    id: "film-001",
    slug: "ttn-origins",
    title: "TTN Origins",
    tagline: "The network built from proof.",
    synopsis:
      "An inside look at how Troptions Television Network was conceived, built, and launched — from first sketch to Phase 20 genesis lock. The film traces the creation of the TTN CreatorOS platform, the IPFS proof registry, and the vision for creator-first, media-first, Web3-enhanced publishing.",
    posterUrl: "/assets/ttn/films/ttn-origins-poster-placeholder.jpg",
    runtime: "42:07",
    genre: ["documentary", "tech"],
    creatorId: "creator-002",
    channelId: "ch-ttn-originals",
    credits: [
      { role: "Director", name: "TTN Originals Team" },
      { role: "Produced by", name: "Kevan Burns / FTH Trading" },
      { role: "Narration", name: "TTN Originals" },
    ],
    productionYear: 2026,
    rightsStatus: "all-rights-reserved",
    proofCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    festivalStatus: "not-submitted",
    status: "pending-review",
    tags: ["ttn", "documentary", "origins", "web3", "proof"],
    submittedAt: "2026-04-20",
  },
  {
    id: "film-002",
    slug: "first-block-student-short",
    title: "First Block",
    tagline: "Everyone's blockchain story starts somewhere.",
    synopsis:
      "A short film by TTN Student Creators following three young people as they learn about blockchain, wallet security, and digital ownership for the first time. Educational. No financial advice.",
    posterUrl: "/assets/ttn/films/first-block-poster-placeholder.jpg",
    runtime: "12:30",
    genre: ["short-film", "education", "drama"],
    creatorId: "creator-005",
    channelId: "ch-students",
    credits: [
      { role: "Director", name: "Student Creator — TBD" },
      { role: "Written by", name: "TTN Student Writers Room" },
    ],
    productionYear: 2026,
    rightsStatus: "pending-clearance",
    festivalStatus: "not-submitted",
    status: "in-production",
    tags: ["student", "short-film", "blockchain", "education"],
    submittedAt: "2026-03-01",
  },
];

export function getFilm(slug: string): Film | undefined {
  return TTN_FILMS.find((f) => f.slug === slug);
}

export function getPublishedFilms(): Film[] {
  return TTN_FILMS.filter((f) => f.status === "published");
}

export function getFilmsByCreator(creatorId: string): Film[] {
  return TTN_FILMS.filter((f) => f.creatorId === creatorId);
}
