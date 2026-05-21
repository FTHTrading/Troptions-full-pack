// TROPTIONS Exchange OS — Partner Packages

export interface PartnerPackage {
  id: string;
  name: string;
  targetType: string;
  price: string;
  priceNote: string;
  features: string[];
  cta: string;
}

export const PARTNER_PACKAGES: PartnerPackage[] = [
  {
    id: "creator-launch",
    name: "Creator Launch",
    targetType: "Token Creator",
    price: "Contact",
    priceNote: "Priced based on token parameters and launch scope",
    features: [
      "XRPL token configuration",
      "Trustline setup",
      "Token page on TROPTIONS Exchange OS",
      "Launch readiness report",
      "Creator reward policy",
      "Basic x402 report access",
    ],
    cta: "Launch Your Token",
  },
  {
    id: "verified-issuer",
    name: "Verified Issuer",
    targetType: "Established Token Issuer",
    price: "Contact",
    priceNote: "Annual verification and listing",
    features: [
      "Everything in Creator Launch",
      "TROPTIONS issuer verification badge",
      "Verified badge on all token cards",
      "Issuer profile page",
      "Priority listing in token discovery",
      "Proof packet generation",
    ],
    cta: "Get Verified",
  },
  {
    id: "sponsor-campaign",
    name: "Sponsor Campaign",
    targetType: "Sponsor / Merchant",
    price: "Contact",
    priceNote: "Per campaign, based on budget and scope",
    features: [
      "Sponsor offer builder",
      "QR campaign codes",
      "Reward budget management",
      "Audience targeting",
      "Redemption tracking",
      "x402 campaign report",
    ],
    cta: "Create Campaign",
  },
  {
    id: "merchant-rewards",
    name: "Merchant Rewards",
    targetType: "Local Merchant / Event Operator",
    price: "Contact",
    priceNote: "Monthly, based on transaction volume",
    features: [
      "Merchant offer panel",
      "QR reward codes",
      "City/event activation",
      "Coupon token option",
      "Redemption analytics",
    ],
    cta: "Activate Merchant",
  },
  {
    id: "api-access",
    name: "API Access",
    targetType: "Developer",
    price: "Pay-per-use via x402",
    priceNote: "From $0.01/call via x402 protocol",
    features: [
      "Full Exchange OS API access",
      "Token risk reports",
      "Launch readiness reports",
      "Wallet analytics",
      "x402 pay-per-call billing",
      "No subscription required",
    ],
    cta: "Get API Access",
  },
  {
    id: "enterprise-exchange-os",
    name: "Enterprise Exchange OS",
    targetType: "Enterprise Partner",
    price: "Contact",
    priceNote: "White-label licensing, volume pricing",
    features: [
      "Full white-label deployment",
      "Custom branding",
      "Dedicated issuer registry",
      "Operator revenue share",
      "Enterprise SLA",
      "Custom x402 service catalog",
      "Priority support",
    ],
    cta: "Talk to Sales",
  },
];

export const PARTNER_TYPES = [
  "Token Creator",
  "Developer",
  "Sponsor",
  "Merchant",
  "Event Operator",
  "Liquidity Provider",
  "API Customer",
  "Media Partner",
  "Enterprise Partner",
] as const;

export type PartnerType = typeof PARTNER_TYPES[number];
