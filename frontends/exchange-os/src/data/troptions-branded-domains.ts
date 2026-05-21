/**
 * TROPTIONS Branded Domains — single source of truth
 * Bryan Stone / TROPTIONS ecosystem (Est. 2003)
 * Used by middleware host routing, footers, and DNS/Vercel setup checklists.
 */

export type DomainStatus =
  | "live_unykorn"      // Served on *.unykorn.org today
  | "live_external"     // Live on other host (launch, whichway, etc.)
  | "dns_pending"       // Owned; not wired to Worker/Vercel
  | "legacy_redirect"   // Legacy content — redirect to canonical
  | "planned";

export interface BrandedDomain {
  id: string;
  host: string; // lowercase, no www
  displayName: string;
  canonicalPath: string; // path on troptions Worker when wired
  canonicalUrl: string; // full https URL users should bookmark
  status: DomainStatus;
  vertical: string;
  owner: "Bryan Stone" | "TROPTIONS" | "UNYKORN";
  notes?: string;
}

const ORIGIN = "https://troptions.unykorn.org";

export const BRANDED_DOMAINS: BrandedDomain[] = [
  // —— Primary institutional ——
  {
    id: "troptions-io",
    host: "troptions.io",
    displayName: "TROPTIONS.IO",
    canonicalPath: "/troptions",
    canonicalUrl: `${ORIGIN}/troptions`,
    status: "dns_pending",
    vertical: "Institutional portal",
    owner: "Bryan Stone",
    notes: "Primary brand domain — wire to Vercel troptions project",
  },
  {
    id: "troptions-org",
    host: "troptions.org",
    displayName: "TROPTIONS.ORG",
    canonicalPath: "/troptions/legacy",
    canonicalUrl: `${ORIGIN}/troptions/legacy`,
    status: "legacy_redirect",
    vertical: "Legacy institutional",
    owner: "Bryan Stone",
    notes: "Migration banner required — see migrationNoticeRegistry",
  },
  {
    id: "troptions-unykorn",
    host: "troptions.unykorn.org",
    displayName: "TROPTIONS (UNYKORN)",
    canonicalPath: "/troptions",
    canonicalUrl: `${ORIGIN}/troptions`,
    status: "live_unykorn",
    vertical: "Institutional OS",
    owner: "TROPTIONS",
  },
  {
    id: "troptions-exchange",
    host: "troptionsexchange.unykorn.org",
    displayName: "TROPTIONS Exchange OS",
    canonicalPath: "/exchange-os",
    canonicalUrl: "https://troptionsexchange.unykorn.org/exchange-os",
    status: "live_unykorn",
    vertical: "Exchange OS",
    owner: "TROPTIONS",
  },
  {
    id: "troptions-live",
    host: "troptionslive.unykorn.org",
    displayName: "TROPTIONS Live",
    canonicalPath: "/sports",
    canonicalUrl: "https://troptionslive.unykorn.org/sports",
    status: "live_unykorn",
    vertical: "Events / sports / merchants",
    owner: "TROPTIONS",
  },

  // —— Bryan domain list (verticals) ——
  {
    id: "troptionsxchange-io",
    host: "troptionsxchange.io",
    displayName: "TROPTIONSXCHANGE.IO",
    canonicalPath: "/troptions/xchange",
    canonicalUrl: `${ORIGIN}/troptions/xchange`,
    status: "legacy_redirect",
    vertical: "Exchange / Xchange",
    owner: "Bryan Stone",
    notes: "Legacy — redirect to .com or canonical path",
  },
  {
    id: "troptionsxchange-com",
    host: "troptionsxchange.com",
    displayName: "TROPTIONSXCHANGE.COM",
    canonicalPath: "/troptions/xchange",
    canonicalUrl: `${ORIGIN}/troptions/xchange`,
    status: "dns_pending",
    vertical: "Exchange / Xchange",
    owner: "Bryan Stone",
  },
  {
    id: "troptions-university",
    host: "troptions-university.com",
    displayName: "TROPTIONS University",
    canonicalPath: "/troptions/university",
    canonicalUrl: `${ORIGIN}/troptions/university`,
    status: "dns_pending",
    vertical: "Education",
    owner: "Bryan Stone",
  },
  {
    id: "troptions-tv",
    host: "troptionstelevisionnetwork.tv",
    displayName: "TROPTIONS Television Network",
    canonicalPath: "/troptions/media",
    canonicalUrl: `${ORIGIN}/troptions/media`,
    status: "dns_pending",
    vertical: "Media / TTN",
    owner: "Bryan Stone",
  },
  {
    id: "real-estate-connections",
    host: "therealestateconnections.com",
    displayName: "The Real Estate Connections",
    canonicalPath: "/troptions/real-estate",
    canonicalUrl: `${ORIGIN}/troptions/real-estate`,
    status: "dns_pending",
    vertical: "Real estate / RWA",
    owner: "Bryan Stone",
  },
  {
    id: "green-n-go",
    host: "green-n-go.solar",
    displayName: "Green-N-Go Solar",
    canonicalPath: "/troptions/solar",
    canonicalUrl: `${ORIGIN}/troptions/solar`,
    status: "dns_pending",
    vertical: "Solar energy",
    owner: "Bryan Stone",
  },
  {
    id: "hotrcw",
    host: "hotrcw.com",
    displayName: "HOTRCW",
    canonicalPath: "/troptions/hotrcw",
    canonicalUrl: `${ORIGIN}/troptions/hotrcw`,
    status: "dns_pending",
    vertical: "HOTRCW vertical",
    owner: "Bryan Stone",
    notes: "Stub page live at canonical path",
  },

  // —— Satellite apps (separate deploys) ——
  {
    id: "launch",
    host: "launch.unykorn.org",
    displayName: "TROPTIONS Token Launcher",
    canonicalPath: "/",
    canonicalUrl: "https://launch.unykorn.org",
    status: "live_external",
    vertical: "Solana mint / campaigns",
    owner: "UNYKORN",
  },
  {
    id: "whichway",
    host: "whichway.live",
    displayName: "WhichWay.live / WWAI",
    canonicalPath: "/",
    canonicalUrl: "https://whichway.live",
    status: "live_external",
    vertical: "Guest OS / venues",
    owner: "TROPTIONS",
    notes: "Also reachable via fifa.unykorn.org in some deploys",
  },
  {
    id: "fifa",
    host: "fifa.unykorn.org",
    displayName: "WWAI (FIFA host)",
    canonicalPath: "/",
    canonicalUrl: "https://fifa.unykorn.org",
    status: "live_external",
    vertical: "Guest OS / WC2026",
    owner: "TROPTIONS",
  },
  {
    id: "goatx",
    host: "goat.unykorn.org",
    displayName: "GoatX",
    canonicalPath: "/",
    canonicalUrl: "https://goat.unykorn.org",
    status: "live_external",
    vertical: "SPL token",
    owner: "TROPTIONS",
  },
  {
    id: "portfolio",
    host: "portfolio.unykorn.org",
    displayName: "UNYKORN Portfolio",
    canonicalPath: "/",
    canonicalUrl: "https://portfolio.unykorn.org",
    status: "live_external",
    vertical: "System book / proof registry",
    owner: "UNYKORN",
  },
];

/** Hostname (no www) → pathname on current origin for middleware */
export const HOST_TO_CANONICAL_PATH: Record<string, string> = Object.fromEntries(
  BRANDED_DOMAINS.filter((d) => d.status !== "live_external").map((d) => [
    d.host,
    d.canonicalPath,
  ])
);

export function getDomainByHost(host: string): BrandedDomain | undefined {
  const h = host.toLowerCase().replace(/^www\./, "");
  return BRANDED_DOMAINS.find((d) => d.host === h);
}
