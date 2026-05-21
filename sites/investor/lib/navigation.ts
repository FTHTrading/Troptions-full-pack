import { assetPath } from "@/lib/base-path";
import {
  DAO_PAGE_URL,
  DOCS_URL,
  ECOSYSTEM_HUB_URL,
  ECOSYSTEM_MAP_URL,
  PAGES_URL,
  TANTHEM_MINT_DAPP_URL,
  TANTHEM_NFT_GALLERY_URL,
} from "@/lib/constants";

export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type NavEntry =
  | { kind: "link"; href: string; label: string; external?: boolean }
  | { kind: "group"; label: string; items: NavLink[] };

const onPages = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);
const technicalHub = onPages
  ? `${PAGES_URL}/technical/index.html`
  : `${DOCS_URL}/`;

/** Hash links that work from any route on the investor site. */
export function homeHash(id: string): string {
  return `${assetPath("/")}#${id}`;
}

/** Slim top bar: 7 items (3 links + 3 dropdowns + home). */
export function getSiteNavigation(): NavEntry[] {
  return [
    { kind: "link", href: "/", label: "Home" },
    { kind: "link", href: homeHash("story"), label: "Story" },
    { kind: "link", href: homeHash("proof-wall"), label: "Proof" },
    {
      kind: "group",
      label: "Stack",
      items: [
        { href: homeHash("infrastructure"), label: "Infrastructure" },
        { href: homeHash("sovereign-dao"), label: "Sovereign DAO" },
        {
          href: onPages ? DAO_PAGE_URL : "/dao/",
          label: "DAO page",
          external: onPages,
        },
        {
          href: ECOSYSTEM_HUB_URL,
          label: "Ecosystem status",
          external: true,
        },
        {
          href: ECOSYSTEM_MAP_URL,
          label: "Ecosystem map",
          external: true,
        },
      ],
    },
    { kind: "link", href: homeHash("opportunities"), label: "Revenue" },
    {
      kind: "group",
      label: "Invest",
      items: [
        { href: homeHash("valuation"), label: "Valuation" },
        { href: homeHash("downloads"), label: "Downloads" },
        { href: homeHash("counterparty"), label: "Counterparty" },
        { href: homeHash("comparables"), label: "Comparables" },
      ],
    },
    {
      kind: "group",
      label: "More",
      items: [
        { href: technicalHub, label: "Technical hub", external: true },
        {
          href: TANTHEM_MINT_DAPP_URL,
          label: "Mint NFTs",
          external: onPages,
        },
        {
          href: TANTHEM_NFT_GALLERY_URL,
          label: "NFT gallery",
          external: onPages,
        },
        { href: homeHash("anthem"), label: "Anthem" },
        { href: "/anthem/", label: "Lyrics" },
        { href: homeHash("competitive"), label: "Competitive" },
        { href: homeHash("verification"), label: "Verification" },
        { href: homeHash("contact"), label: "Contact" },
      ],
    },
  ];
}

/** Footer “On this page” — sections not in the slim top bar. */
export const MORE_NAV: NavLink[] = [
  { href: homeHash("economics"), label: "Economics" },
  { href: homeHash("skyrocket"), label: "Playbook" },
  { href: homeHash("engineering"), label: "Engineering" },
  { href: homeHash("stack"), label: "Three columns" },
  { href: homeHash("pillars"), label: "Revenue pillars" },
  { href: homeHash("clients"), label: "Clients needed" },
  { href: homeHash("truth"), label: "Truth labels" },
];

export const ANTHEM_PAGE: NavLink = {
  href: "/anthem/",
  label: "Anthem lyrics",
};

/** Flat list for before/after reporting. */
export function flattenNav(entries: NavEntry[]): NavLink[] {
  const out: NavLink[] = [];
  for (const e of entries) {
    if (e.kind === "link") {
      out.push({
        href: e.href,
        label: e.label,
        external: e.external,
      });
    } else {
      out.push(...e.items);
    }
  }
  return out;
}
