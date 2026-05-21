/**
 * Migration Notice Registry
 *
 * Approved migration-notice text for legacy Troptions domains.
 * Each legacy domain must display the relevant notice prominently.
 *
 * Audit date: 2026-04-27
 * See: docs/troptions/troptions-domain-map.md — Legacy Domains section
 * See: docs/brand-system.md — Legacy Domain Brand Alignment
 */

export type LegacyDomainId =
  | "troptions-org"
  | "troptionsxchange-io"
  | "troptions-unitytoken-com";

export type MigrationNoticeVariant = "banner" | "full-page" | "inline";

export interface MigrationNotice {
  /** Unique identifier for this notice */
  noticeId: string;
  /** The legacy domain this notice applies to */
  legacyDomain: LegacyDomainId;
  /** Human-readable legacy domain string */
  legacyDomainLabel: string;
  /** The canonical successor domain / portal destination */
  canonicalDomain: string;
  /** Canonical portal route within the institutional OS */
  portalRoute: string;
  /** Short headline for banner variant */
  bannerHeadline: string;
  /** One-sentence summary for banner variant */
  bannerSummary: string;
  /** Full-page migration notice heading */
  pageHeading: string;
  /** Full multi-sentence notice body */
  pageBody: string;
  /** Compliance disclaimer to append */
  complianceNote: string;
  /** CTA button label */
  ctaLabel: string;
  /** CTA destination URL */
  ctaUrl: string;
  /** Risk level from the site audit */
  riskLevel: "high" | "medium" | "low";
  /** Whether this domain's content has been fully migrated */
  migrationComplete: boolean;
  /** Date the notice was authored */
  auditDate: string;
}

export const MIGRATION_NOTICES: readonly MigrationNotice[] = [
  {
    noticeId: "MN-TROPTIONS-ORG",
    legacyDomain: "troptions-org",
    legacyDomainLabel: "troptions.org",
    canonicalDomain: "troptions.com",
    portalRoute: "/troptions/legacy",
    bannerHeadline: "You are viewing a legacy Troptions site.",
    bannerSummary:
      "This page (troptions.org) contains legacy content that has not been updated to current institutional compliance standards. Visit the Troptions compliance portal for verified, current information.",
    pageHeading: "Troptions Legacy Site — troptions.org",
    pageBody:
      "The domain troptions.org is a legacy Troptions web property. Content on this site reflects historical marketing materials and may include claims that have not been independently verified or updated to current institutional compliance standards. " +
      "Merchant-count figures, token-readiness claims, balance-sheet impact language, and global-expansion statements require documentary corroboration before institutional use. " +
      "The Troptions ecosystem has been rebuilt on a proof-gated, custody-aware institutional OS. For current, compliance-reviewed information — including live on-chain verification, legal review queues, and RWA intake documentation — please visit the institutional compliance portal.",
    complianceNote:
      "Nothing on troptions.org constitutes financial advice, securities offerings, or guarantees of liquidity, returns, or compliance. All legacy claims are subject to independent verification.",
    ctaLabel: "Visit the Institutional Compliance Portal",
    ctaUrl: "/troptions",
    riskLevel: "high",
    migrationComplete: false,
    auditDate: "2026-04-27",
  },
  {
    noticeId: "MN-XCHANGE-IO",
    legacyDomain: "troptionsxchange-io",
    legacyDomainLabel: "troptionsxchange.io",
    canonicalDomain: "troptionsxchange.com",
    portalRoute: "/troptions/legacy",
    bannerHeadline: "You are viewing a legacy Troptions Xchange site.",
    bannerSummary:
      "This page (troptionsxchange.io) is a legacy domain. The canonical Troptions Xchange domain is troptionsxchange.com. Exchange-platform and liquidity claims on this legacy site have not been updated to current compliance standards.",
    pageHeading: "Troptions Xchange Legacy Site — troptionsxchange.io",
    pageBody:
      "The domain troptionsxchange.io is a legacy web property associated with the Troptions Xchange sub-brand. " +
      "This domain contains exchange-readiness, liquidity, and trading-platform language that has not been reviewed against current regulatory requirements. " +
      "No live exchange operations are being conducted through this legacy domain. Troptions Xchange is currently in the licensing-analysis phase. " +
      "The canonical Troptions Xchange domain is troptionsxchange.com. For current information about the Troptions Xchange initiative, please visit the institutional compliance portal.",
    complianceNote:
      "Nothing on troptionsxchange.io constitutes an offer to trade, access exchange services, or a guarantee of liquidity. No exchange services are operational. All content is legacy and subject to compliance review.",
    ctaLabel: "Visit troptionsxchange.com",
    ctaUrl: "/troptions/xchange",
    riskLevel: "high",
    migrationComplete: false,
    auditDate: "2026-04-27",
  },
  {
    noticeId: "MN-UNITYTOKEN-COM",
    legacyDomain: "troptions-unitytoken-com",
    legacyDomainLabel: "troptions-unitytoken.com",
    canonicalDomain: "unitytoken.io",
    portalRoute: "/troptions/legacy",
    bannerHeadline: "You are viewing a legacy Troptions Unity Token site.",
    bannerSummary:
      "This page (troptions-unitytoken.com) is a legacy domain. Token-sale, ICO, and asset-backed language on this site has not been updated to current compliance standards. No active token offering exists. Visit the canonical domain at unitytoken.io.",
    pageHeading: "Troptions Unity Token Legacy Site — troptions-unitytoken.com",
    pageBody:
      "The domain troptions-unitytoken.com is a legacy web property associated with the Troptions Unity Token (TUT). " +
      "This site contains token-sale framing, asset-backed claims, and social-impact narratives that have not been reviewed against current securities, token-classification, and consumer-protection standards. " +
      "No public token offering or sale is currently active. Any token sale or offering is subject to legal classification, securities analysis, investor eligibility verification, and applicable regulatory approval in each jurisdiction. " +
      "Asset-backed and value-preservation claims require independent custody evidence, reserve audit, and accounting review before publication. " +
      "The canonical Troptions Unity Token domain is unitytoken.io. For current information, please visit the institutional compliance portal.",
    complianceNote:
      "Nothing on troptions-unitytoken.com constitutes a current token offering, investment advice, or a guarantee of value, returns, or charitable impact. All legacy content is subject to legal review. Consult independent legal and financial counsel.",
    ctaLabel: "Visit unitytoken.io",
    ctaUrl: "/troptions/unity-token",
    riskLevel: "high",
    migrationComplete: false,
    auditDate: "2026-04-27",
  },
] as const;

/** Return the migration notice for a given legacy domain */
export function getMigrationNotice(domain: LegacyDomainId): MigrationNotice | undefined {
  return MIGRATION_NOTICES.find((n) => n.legacyDomain === domain);
}

/** Return all migration notices with incomplete migration */
export function getPendingMigrations(): MigrationNotice[] {
  return MIGRATION_NOTICES.filter((n) => !n.migrationComplete);
}

/** Return all high-risk migration notices */
export function getHighRiskMigrations(): MigrationNotice[] {
  return MIGRATION_NOTICES.filter((n) => n.riskLevel === "high");
}
