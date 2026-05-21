// DONK AI / TROPTIONS — Merchant Campaign data layer
// Safe language: no prediction markets, no betting, no gambling, no staking, no investment claims.

export const SAFE_CAMPAIGN_LANGUAGE = {
  allowed: [
    "campaign", "merchant launch", "QR campaign", "loyalty reward", "coupon",
    "VIP pass", "fan tribute", "local business activation", "customer engagement",
    "sponsor activation", "community reward", "collectible coupon", "access pass",
    "promotional utility", "proof of campaign", "namespace", "NFT coupon",
    "digital moment", "fan reward", "event pass", "merchant namespace",
    "QR giveaway", "offer page", "fan drop", "commemorative asset", "tribute page",
  ],
  forbidden: [
    "prediction market", "predict", "bet", "betting", "gambling", "wager", "odds",
    "stake", "staking", "pick market", "win money", "profit", "investment",
    "securities", "guaranteed returns", "trading outcome", "sportsbook",
  ],
};

export type CampaignType =
  | "loyalty_reward"
  | "nft_coupon"
  | "vip_pass"
  | "fan_tribute"
  | "sponsor_offer"
  | "local_giveaway"
  | "event_promo"
  | "qr_campaign"
  | "merchant_namespace";

export interface MerchantProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  campaignType: CampaignType;
  customerType: "merchant" | "fan" | "sponsor" | "local_business";
  price?: string;
  cta: string;
  status: "live" | "coming_soon" | "beta";
  features: string[];
  disclaimer: string;
}

export const MERCHANT_PRODUCTS: MerchantProduct[] = [
  {
    id: "merchant-namespace",
    name: "Merchant Namespace",
    tagline: "Your business gets a branded campaign identity",
    description:
      "Every local business gets a branded namespace on the TROPTIONS operating layer. Your QR campaigns, loyalty offers, VIP passes, and fan moments all live under one verified identity.",
    campaignType: "merchant_namespace",
    customerType: "merchant",
    price: "$299 setup + $49/mo",
    cta: "Launch My Merchant Namespace",
    status: "live",
    features: [
      "Branded campaign identity (business.unykorn.org or custom)",
      "QR campaign builder",
      "Loyalty reward / coupon / VIP pass creation",
      "Customer capture and analytics",
      "Delivery screenshots and proof",
      "AI campaign assistant (DONK AI)",
      "Monthly support and campaign updates",
    ],
    disclaimer:
      "Merchant namespaces are for campaign identity, loyalty programs, promotional utilities, and customer engagement only. Not an investment product, not a security, not a financial instrument.",
  },
  {
    id: "qr-campaign",
    name: "QR Campaign",
    tagline: "Customer scans, customer engages, you win",
    description:
      "Create a QR campaign in minutes. Customer scans the code to access your offer, coupon, VIP pass, reward, or tribute. Trackable, shareable, on-chain provable.",
    campaignType: "qr_campaign",
    customerType: "local_business",
    price: "Included in Merchant Namespace",
    cta: "Create QR Campaign",
    status: "live",
    features: [
      "Unique QR code per campaign",
      "Custom landing offer page",
      "Scan analytics",
      "Coupon / reward delivery",
      "NFT coupon optional mint on Solana",
      "Campaign proof screenshot",
    ],
    disclaimer:
      "QR campaigns deliver promotional offers, loyalty rewards, coupons, and access passes. Not a gambling product, not an investment, not a prediction market.",
  },
  {
    id: "nft-coupon",
    name: "NFT Coupon",
    tagline: "A collectible coupon your customer actually keeps",
    description:
      "Issue NFT coupons as collectible promotional utilities — discounts, event access, local promos, sponsor activations, and commemorative drops. Optional Solana mint, always off-chain first.",
    campaignType: "nft_coupon",
    customerType: "merchant",
    cta: "Create NFT Coupon",
    status: "live",
    features: [
      "Collectible coupon with custom artwork",
      "Discount or offer embedded in metadata",
      "Optional Solana mint (devnet → mainnet June 2026)",
      "QR redemption flow",
      "Expiry date and usage limits",
      "Sponsor branding overlay",
    ],
    disclaimer:
      "NFT coupons are promotional utility tokens — collectible coupons, access passes, and loyalty rewards. They are not securities, investments, gambling products, or prediction markets.",
  },
  {
    id: "vip-pass",
    name: "VIP Pass",
    tagline: "Access, recognition, and fan perks — on-chain",
    description:
      "Create VIP passes for events, venues, sponsor activations, fan communities, and merchant loyalty programs. Digital or physical — always verifiable.",
    campaignType: "vip_pass",
    customerType: "merchant",
    cta: "Create VIP Pass",
    status: "live",
    features: [
      "Digital VIP pass with QR scan",
      "Event or venue access tier",
      "Fan community recognition",
      "Sponsor perks and activations",
      "Merchant loyalty tier",
      "On-chain verification optional (Solana)",
    ],
    disclaimer:
      "VIP passes are access and recognition utilities for events, communities, and merchant programs. Not an investment, not a security, not a financial product.",
  },
  {
    id: "fan-tribute",
    name: "Fan Tribute",
    tagline: "Celebrate your team, city, or moment — forever",
    description:
      "Create fan and community tribute pages with commemorative assets, team/city/event culture activation, QR code, collectible coupon, and optional sponsor tie-in. No gambling, no betting, no prediction markets.",
    campaignType: "fan_tribute",
    customerType: "fan",
    cta: "Create Fan Tribute",
    status: "live",
    features: [
      "Tribute name and city/team/event",
      "Community message",
      "Image / media placeholder",
      "QR code for fan sharing",
      "Collectible coupon or VIP access",
      "Optional sponsor / local merchant tie-in",
      "Non-gambling community engagement",
    ],
    disclaimer:
      "Fan tributes are commemorative, community, and engagement assets. They are not prediction markets, gambling products, investments, or securities.",
  },
  {
    id: "local-business-launch-kit",
    name: "Local Business Launch Kit",
    tagline: "Everything a local business needs to launch a campaign in minutes",
    description:
      "Full campaign kit: namespace, QR campaign, loyalty reward or coupon or VIP pass, customer capture, analytics, and delivery proof. DONK AI builds the campaign. TROPTIONS powers the operating layer.",
    campaignType: "loyalty_reward",
    customerType: "local_business",
    price: "$299 setup + $49/mo",
    cta: "Launch My Business Kit",
    status: "live",
    features: [
      "$299 one-time setup",
      "$49/month ongoing support",
      "Merchant namespace",
      "QR campaign",
      "Loyalty reward or coupon or VIP pass",
      "Customer capture form",
      "Delivery screenshots / proof of campaign",
      "Monthly follow-up campaign support",
      "DONK AI campaign assistant",
    ],
    disclaimer:
      "The Local Business Launch Kit delivers campaign infrastructure, promotional utilities, loyalty programs, and customer engagement tools. Not an investment product, not a security, not a prediction market, not a financial instrument.",
  },
  {
    id: "sponsor-activation",
    name: "Sponsor Activation",
    tagline: "Brands activate at the intersection of fans and commerce",
    description:
      "Sponsor activations place brand content, offers, and rewards inside fan tributes, QR campaigns, and merchant moments. Real engagement, measurable proof.",
    campaignType: "sponsor_offer",
    customerType: "sponsor",
    cta: "Launch Sponsor Activation",
    status: "live",
    features: [
      "Brand overlay on fan tributes",
      "Sponsor offer inside QR campaign",
      "Sponsored NFT coupon or VIP pass",
      "Proof of activation (screenshots, scans)",
      "Fan reach analytics",
      "Atlanta WC2026 venue activation",
    ],
    disclaimer:
      "Sponsor activations are promotional and advertising utilities. Not an investment, security, gambling product, or prediction market.",
  },
];

export const CAMPAIGN_STEPS = [
  { step: 1, label: "Business name / namespace",   detail: "Your brand identity on the TROPTIONS operating layer" },
  { step: 2, label: "Campaign type",               detail: "Loyalty reward, NFT coupon, VIP pass, fan tribute, sponsor offer, local giveaway, or event promo" },
  { step: 3, label: "Offer / reward",              detail: "Define what the customer receives — discount, access, collectible, or recognition" },
  { step: 4, label: "QR campaign",                 detail: "Generate your QR code and campaign landing page" },
  { step: 5, label: "Publish / deliver proof",     detail: "Launch campaign, capture scans, deliver rewards, screenshot proof of activation" },
];

export const CAMPAIGN_TYPES: { id: CampaignType; label: string; icon: string }[] = [
  { id: "loyalty_reward",    label: "Loyalty Reward",       icon: "star" },
  { id: "nft_coupon",        label: "NFT Coupon",           icon: "ticket" },
  { id: "vip_pass",          label: "VIP Pass",             icon: "badge" },
  { id: "fan_tribute",       label: "Fan Tribute",          icon: "heart" },
  { id: "sponsor_offer",     label: "Sponsor Offer",        icon: "zap" },
  { id: "local_giveaway",    label: "Local Giveaway",       icon: "gift" },
  { id: "event_promo",       label: "Event Promo",          icon: "calendar" },
  { id: "qr_campaign",       label: "QR Campaign",          icon: "qr-code" },
  { id: "merchant_namespace",label: "Merchant Namespace",   icon: "store" },
];

export const SAFETY_DISCLAIMER =
  "Campaign assets are for loyalty, access, rewards, coupons, collectibles, fan engagement, " +
  "and promotional utility only. They are not investments, securities, gambling products, " +
  "prediction markets, or financial instruments. Campaign utilities do not confer equity, " +
  "profit-sharing, or guaranteed returns.";
