import { assetPath } from "@/lib/base-path";
import {
  COMMAND_CENTER_URL,
  DAO_PAGE_URL,
  DOCS_URL,
  ECOSYSTEM_HUB_URL,
  OVERVIEW_URL,
  PAGES_URL,
  REVENUE_PAGE_URL,
  SWIFT_PAGE_URL,
  TELEGRAM_PAGE_URL,
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

/** Bloomberg-style top bar: primary routes + More dropdown. */
export function getSiteNavigation(): NavEntry[] {
  return [
    { kind: "link", href: "/", label: "Home" },
    { kind: "link", href: COMMAND_CENTER_URL, label: "Command Center" },
    { kind: "link", href: OVERVIEW_URL, label: "Overview" },
    { kind: "link", href: SWIFT_PAGE_URL, label: "SWIFT" },
    { kind: "link", href: REVENUE_PAGE_URL, label: "Revenue" },
    { kind: "link", href: TELEGRAM_PAGE_URL, label: "Telegram" },
    {
      kind: "link",
      href: technicalHub,
      label: "Docs",
      external: true,
    },
    {
      kind: "link",
      href: ECOSYSTEM_HUB_URL,
      label: "Ecosystem",
      external: true,
    },
    {
      kind: "link",
      href: onPages ? DAO_PAGE_URL : "/dao/",
      label: "DAO",
      external: onPages,
    },
    {
      kind: "group",
      label: "More",
      items: [
        { href: homeHash("story"), label: "Story" },
        { href: homeHash("proof-wall"), label: "Proof" },
        { href: homeHash("infrastructure"), label: "Infrastructure" },
        { href: homeHash("sovereign-dao"), label: "Sovereign DAO" },
        { href: homeHash("opportunities"), label: "Opportunities (home)" },
        { href: homeHash("valuation"), label: "Valuation" },
        { href: homeHash("downloads"), label: "Downloads" },
        { href: homeHash("counterparty"), label: "Counterparty" },
        { href: homeHash("anthem"), label: "Anthem" },
        { href: "/anthem/", label: "Lyrics" },
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
        { href: homeHash("contact"), label: "Contact" },
        { href: SWIFT_PAGE_URL, label: "Institutional rails" },
        { href: OVERVIEW_URL, label: "What you can do NOW" },
      ],
    },
  ];
}

/** Footer “On this page” — sections not in the slim top bar. */
export const MORE_NAV: NavLink[] = [
  { href: COMMAND_CENTER_URL, label: "Command Center" },
  { href: OVERVIEW_URL, label: "Overview" },
  { href: SWIFT_PAGE_URL, label: "Institutional rails" },
  { href: REVENUE_PAGE_URL, label: "Revenue" },
  { href: TELEGRAM_PAGE_URL, label: "Telegram" },
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

/** Technical HTML on GitHub Pages — footer index. */
export const TECHNICAL_FOOTER_LINKS: NavLink[] = [
  { href: technicalHub, label: "Technical index", external: true },
  {
    href: `${PAGES_URL}/technical/SYSTEM_MANIFEST.html`,
    label: "System manifest",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/TROPTIONS_REVENUE_ENGINE.html`,
    label: "Revenue engine",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/X402_GLOBAL_MESH.html`,
    label: "x402 global mesh",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/AWS_ACTIVATION_RUNBOOK.html`,
    label: "AWS runbook",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/ON_CHAIN_PROOF.html`,
    label: "On-chain proof",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/ECOSYSTEM_MAP.html`,
    label: "Ecosystem map",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/VERIFICATION_STATUS.html`,
    label: "Verification status",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/DAO_ARCHITECTURE.html`,
    label: "DAO architecture",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/ARCHITECTURE.html`,
    label: "Architecture",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/QUICKSTART.html`,
    label: "Quickstart",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/WHAT_YOU_CAN_DO_NOW.html`,
    label: "What you can do NOW",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/OPERATOR_SEED_AND_PARTNER.html`,
    label: "Operator seed (paths only)",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/MSB_FIAT_RAILS.html`,
    label: "MSB fiat rails",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/PARTNER_BANK_MESH.html`,
    label: "Partner bank mesh",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/AGENTIC_RAG_AMM.html`,
    label: "Agentic RAG + AMM",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/DOMAIN_TRUTH_TABLE.html`,
    label: "Domain truth",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/BAAS_BATCH_POOLS.html`,
    label: "BaaS batch pools",
    external: true,
  },
  {
    href: `${PAGES_URL}/technical/TELEGRAM_OPERATOR.html`,
    label: "Telegram operator",
    external: true,
  },
];

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
