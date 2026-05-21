/**
 * TTN Blog / News Registry
 *
 * INFORMATIONAL CONTENT ONLY.
 * Articles, press releases, and reports must not contain financial advice,
 * investment solicitations, or earnings promises.
 */

export type BlogCategory =
  | "news"
  | "press-release"
  | "creator-update"
  | "ecosystem"
  | "education"
  | "sponsor-story"
  | "event-recap"
  | "research"
  | "opinion";

export type BlogStatus = "published" | "pending-review" | "draft" | "archived";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  category: BlogCategory;
  tags: string[];
  imageUrl: string;
  proofCid?: string;
  publishedAt: string;
  updatedAt?: string;
  status: BlogStatus;
  seoTitle: string;
  seoDescription: string;
  readingTimeMinutes: number;
}

export const TTN_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-001",
    slug: "ttn-creatorOS-launch",
    title: "Introducing TTN CreatorOS: A Creator-Powered Media Platform Built on Proof",
    excerpt:
      "Troptions Television Network is launching CreatorOS — a full media platform for channels, blogs, podcasts, short films, and proof-backed content publishing.",
    content: `Troptions Television Network has always been about more than just streaming. Today, we are introducing TTN CreatorOS — a creator-powered media infrastructure that gives anyone the tools to launch a channel, publish content, and prove their creative output on a permanent record.

TTN CreatorOS v1 includes creator profiles, channel pages, a blog and newsroom, podcast system, short film studio, IPFS proof registry, creator studio dashboard, and an admin review hub. Every piece of content can receive an IPFS CID proof record, connecting each creation to a content-addressed, permanent fingerprint.

This is not a financial product. TTN CreatorOS is a publishing, proof, and distribution platform — creator-first, media-first, and Web3-enhanced where it adds real value.`,
    authorId: "creator-001",
    category: "press-release",
    tags: ["ttn", "creator-os", "launch", "web3-media", "ipfs"],
    imageUrl: "/assets/ttn/blog/creatorOS-launch-placeholder.jpg",
    proofCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    publishedAt: "2026-04-27",
    status: "published",
    seoTitle: "TTN CreatorOS Launch — Troptions Television Network",
    seoDescription:
      "Troptions Television Network launches CreatorOS — channels, blogs, podcasts, short films, and IPFS proof registry for creators.",
    readingTimeMinutes: 4,
  },
  {
    id: "blog-002",
    slug: "ipfs-proof-registry-what-it-means-for-creators",
    title: "IPFS Proof Registry: What It Means for Creators",
    excerpt:
      "Every content item on TTN can now receive an IPFS CID proof record. Here is what that means, what it proves, and what it does not prove.",
    content: `When you publish content on TTN CreatorOS, you now have the option to register an IPFS proof record. But what does that actually mean?

An IPFS CID (Content Identifier) is a unique fingerprint of a file's content. It is generated from the content itself — not from a database ID or timestamp. This means that if two pieces of content have the same CID, they are identical. If anything in the file changes, the CID changes.

For creators, this means:
- You can prove what version of a file existed at a point in time.
- You can compare a CID to any copy of your content to verify authenticity.
- The record is permanent as long as the file is pinned.

What it does NOT mean:
- It does not prove legal copyright ownership.
- It is not a substitute for a rights agreement.
- It does not mean the content has been reviewed or approved.
- It is not a financial instrument.

Use it as one layer of your proof stack — alongside signed agreements, upload timestamps, and creator profile verification.`,
    authorId: "creator-001",
    category: "education",
    tags: ["ipfs", "proof", "creators", "cid", "rights"],
    imageUrl: "/assets/ttn/blog/ipfs-proof-placeholder.jpg",
    publishedAt: "2026-04-20",
    status: "published",
    seoTitle: "IPFS Proof Registry for Creators — TTN",
    seoDescription:
      "What IPFS CID proof records mean for TTN creators: what they prove, what they do not prove, and how to use them.",
    readingTimeMinutes: 5,
  },
  {
    id: "blog-003",
    slug: "ttn-originals-first-documentary-announcement",
    title: "TTN Originals Announces First Documentary: 'TTN Origins'",
    excerpt:
      "The first TTN Originals documentary — 'TTN Origins' — tells the story of how Troptions Television Network was built, from concept to creator infrastructure.",
    content: `TTN Originals is proud to announce its first full-length documentary: TTN Origins.

Over the course of 42 minutes, the documentary walks through the conception, planning, and execution of Troptions Television Network — from the first draft of the brand concept through the Phase 20 genesis lock and CreatorOS launch.

The documentary features commentary from the Troptions founding team and a detailed walkthrough of the IPFS proof architecture, TSN evidence system, and creator infrastructure that now powers TTN.

Production is currently pending final review. Expected premiere: Q3 2026.`,
    authorId: "creator-002",
    category: "creator-update",
    tags: ["ttn-originals", "documentary", "origins", "media"],
    imageUrl: "/assets/ttn/blog/ttn-origins-placeholder.jpg",
    publishedAt: "2026-04-22",
    status: "published",
    seoTitle: "TTN Origins Documentary — TTN Originals",
    seoDescription:
      "TTN Originals announces its first documentary — the story of how Troptions Television Network was built.",
    readingTimeMinutes: 3,
  },
  {
    id: "blog-004",
    slug: "real-estate-connections-channel-launch",
    title: "Real Estate Connections Launches on TTN",
    excerpt:
      "The Real Estate Connections brand is joining TTN with a dedicated channel for property markets, listings, and real estate education.",
    content: `The Real Estate Connections brand is officially joining Troptions Television Network with a dedicated channel.

Real Estate TV on TTN will feature weekly market spotlights, property listings, and real estate education segments. No financial advice is provided — all content is educational and informational only.

The channel launches officially in September 2026. Creator applications to feature your real estate content are now open.`,
    authorId: "creator-003",
    category: "creator-update",
    tags: ["real-estate", "channel-launch", "ttn", "rec"],
    imageUrl: "/assets/ttn/blog/rec-channel-placeholder.jpg",
    publishedAt: "2026-04-25",
    status: "published",
    seoTitle: "Real Estate Connections Channel on TTN",
    seoDescription:
      "The Real Estate Connections brand launches on Troptions Television Network with weekly property and market content.",
    readingTimeMinutes: 2,
  },
  {
    id: "blog-005",
    slug: "solar-energy-tv-coming-soon",
    title: "Solar Energy TV — Coming to TTN This Fall",
    excerpt:
      "Green-N-Go Solar is bringing residential and commercial solar education content to TTN starting Fall 2025.",
    content: `Green-N-Go Solar is preparing its Solar Energy TV channel on TTN. The channel will cover residential solar installations, commercial projects, clean energy incentives, and sustainability education.

All content is educational. No investment solicitation. Launch expected Fall 2025.`,
    authorId: "creator-004",
    category: "creator-update",
    tags: ["solar", "green-n-go", "channel", "sustainability"],
    imageUrl: "/assets/ttn/blog/solar-channel-placeholder.jpg",
    publishedAt: "2026-03-10",
    status: "published",
    seoTitle: "Solar Energy TV — Green-N-Go Solar on TTN",
    seoDescription:
      "Green-N-Go Solar brings solar energy education and project documentation to Troptions Television Network.",
    readingTimeMinutes: 2,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return TTN_BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPublishedPosts(): BlogPost[] {
  return TTN_BLOG_POSTS.filter((p) => p.status === "published").sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return TTN_BLOG_POSTS.filter((p) => p.category === category && p.status === "published");
}
