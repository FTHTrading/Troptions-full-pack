/**
 * Troptions Jurisdiction Registry
 * Per-jurisdiction compliance flags, prohibited jurisdictions,
 * and any jurisdiction-specific disclosure requirements.
 *
 * RULES:
 * - Prohibited jurisdictions: block all token issuance, investor onboarding, and settlement
 * - Restricted jurisdictions: require enhanced due diligence and legal sign-off
 * - All jurisdictions require KYC/AML and sanctions screening regardless of status
 */

export type JurisdictionStatus =
  | "open"
  | "restricted-enhanced-dd"
  | "prohibited";

export interface Jurisdiction {
  code: string;
  name: string;
  region: string;
  status: JurisdictionStatus;
  requirements: string[];
  prohibitedActivities: string[];
  notes: string;
}

export const JURISDICTION_REGISTRY: Jurisdiction[] = [
  // ─── United States ─────────────────────────────────────────────────────────
  {
    code: "US",
    name: "United States",
    region: "North America",
    status: "restricted-enhanced-dd",
    requirements: [
      "Accreditation verification for securities offerings",
      "State blue-sky law review (not pre-cleared by Reg D)",
      "MSB registration / money-transmission licensing for payment flows",
      "KYC/AML (BSA compliant)",
      "OFAC sanctions screening",
      "FinCEN reporting for $10K+ CTRs",
      "Securities counsel sign-off for all token offerings",
    ],
    prohibitedActivities: [
      "Unregistered securities offering to non-accredited investors",
      "Unlicensed money transmission",
      "Unregistered exchange operations",
    ],
    notes: "All Troptions token offerings in the US require Reg D or equivalent exemption analysis. Exchange operations require ATS or broker-dealer registration.",
  },
  // ─── European Union ────────────────────────────────────────────────────────
  {
    code: "EU",
    name: "European Union",
    region: "Europe",
    status: "restricted-enhanced-dd",
    requirements: [
      "MiCA compliance review for crypto-asset services and issuances",
      "GDPR compliance for personal data",
      "AMLD (6th) KYC/AML",
      "Per-member-state securities law review for securities-type tokens",
      "EU sanctions screening (OFAC + EU lists)",
    ],
    prohibitedActivities: [
      "Non-compliant crypto-asset service operations under MiCA",
      "Unlicensed CASP activity",
    ],
    notes: "MiCA is phased in. E-money tokens and asset-referenced tokens have the strictest requirements. Legal counsel required per member state for securities aspects.",
  },
  // ─── United Kingdom ────────────────────────────────────────────────────────
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    status: "restricted-enhanced-dd",
    requirements: [
      "FCA registration for cryptoasset businesses (AML/CTF)",
      "FCA financial promotions approval for UK persons",
      "UK securities law review for tokens that may be specified investments",
      "UK sanctions screening (OFSC)",
    ],
    prohibitedActivities: [
      "Unlicensed cryptoasset business activity",
      "Non-approved financial promotions to UK persons",
    ],
    notes: "UK requires FCA registration for AML/CTF. Financial promotions rules for crypto are strictly enforced.",
  },
  // ─── Singapore ─────────────────────────────────────────────────────────────
  {
    code: "SG",
    name: "Singapore",
    region: "Asia-Pacific",
    status: "restricted-enhanced-dd",
    requirements: [
      "MAS digital token review (utility, payment, securities classification)",
      "MAS PS Act licensing for payment token services",
      "MAS CMS license for securities-type tokens",
      "AML/CFT (MAS notice compliance)",
      "OFAC + MAS sanctions screening",
    ],
    prohibitedActivities: [
      "Unlicensed digital payment token services",
      "Unlicensed capital markets services for securities tokens",
    ],
    notes: "Singapore is a crypto-friendly jurisdiction but has strict licensing requirements for payment token services.",
  },
  // ─── UAE ────────────────────────────────────────────────────────────────────
  {
    code: "AE",
    name: "United Arab Emirates",
    region: "Middle East",
    status: "restricted-enhanced-dd",
    requirements: [
      "VARA (Virtual Assets Regulatory Authority) license review (Dubai)",
      "ADGM / FSRA review (Abu Dhabi)",
      "CBUAE review for payment token services",
      "AML/CFT compliance under UAE AML Law",
      "OFAC + UAE sanctions screening",
    ],
    prohibitedActivities: [
      "Unlicensed virtual asset services in Dubai/Abu Dhabi free zones",
    ],
    notes: "UAE is actively licensing virtual asset service providers. Review free zone vs mainland requirements separately.",
  },
  // ─── Cayman Islands ────────────────────────────────────────────────────────
  {
    code: "KY",
    name: "Cayman Islands",
    region: "Caribbean",
    status: "restricted-enhanced-dd",
    requirements: [
      "CIMA (Cayman Islands Monetary Authority) review for fund structures",
      "VASP registration for virtual asset service providers",
      "AML/CFT compliance under Cayman AML regulations",
      "OFAC sanctions screening",
    ],
    prohibitedActivities: [
      "Unlicensed investment fund activity",
      "Unregistered VASP activity",
    ],
    notes: "Popular for offshore fund structures. Reg S offerings frequently use Cayman structures. Legal counsel required.",
  },
  // ─── Prohibited Jurisdictions ──────────────────────────────────────────────
  {
    code: "KP",
    name: "North Korea",
    region: "Asia-Pacific",
    status: "prohibited",
    requirements: [],
    prohibitedActivities: [
      "All token issuance, investor onboarding, settlement, and service provision",
      "Any transaction or activity",
    ],
    notes: "OFAC comprehensive sanctions. Absolutely prohibited.",
  },
  {
    code: "IR",
    name: "Iran",
    region: "Middle East",
    status: "prohibited",
    requirements: [],
    prohibitedActivities: [
      "All token issuance, investor onboarding, settlement, and service provision",
    ],
    notes: "OFAC comprehensive sanctions. Absolutely prohibited.",
  },
  {
    code: "CU",
    name: "Cuba",
    region: "Caribbean",
    status: "prohibited",
    requirements: [],
    prohibitedActivities: [
      "All token issuance, investor onboarding, settlement, and service provision",
    ],
    notes: "OFAC comprehensive sanctions. Absolutely prohibited.",
  },
  {
    code: "SY",
    name: "Syria",
    region: "Middle East",
    status: "prohibited",
    requirements: [],
    prohibitedActivities: [
      "All token issuance, investor onboarding, settlement, and service provision",
    ],
    notes: "OFAC comprehensive sanctions. Absolutely prohibited.",
  },
  {
    code: "RU",
    name: "Russia",
    region: "Eastern Europe",
    status: "prohibited",
    requirements: [],
    prohibitedActivities: [
      "All token issuance, investor onboarding, settlement, and service provision",
      "Services to sanctioned entities or persons",
    ],
    notes: "OFAC comprehensive and sectoral sanctions. SDN list screening mandatory. Absolutely prohibited.",
  },
];

export function getProhibitedJurisdictions(): Jurisdiction[] {
  return JURISDICTION_REGISTRY.filter((j) => j.status === "prohibited");
}

export function getRestrictedJurisdictions(): Jurisdiction[] {
  return JURISDICTION_REGISTRY.filter((j) => j.status === "restricted-enhanced-dd");
}

export function assertJurisdictionAllowed(jurisdictionCode: string): void {
  const jur = JURISDICTION_REGISTRY.find((j) => j.code === jurisdictionCode);
  if (!jur) {
    throw new Error(`[JurisdictionGuard] Jurisdiction "${jurisdictionCode}" is not registered. Manual review required.`);
  }
  if (jur.status === "prohibited") {
    throw new Error(`[JurisdictionGuard] Jurisdiction "${jur.name}" (${jurisdictionCode}) is PROHIBITED. No activity permitted.`);
  }
}
