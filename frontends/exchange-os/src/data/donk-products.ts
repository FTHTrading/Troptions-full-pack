// DONK AI — Product catalog
// DONK AI is the intelligent campaign builder and operating assistant.
// Powered by TROPTIONS. Settled optionally on Solana.

export interface DonkProduct {
  id: string;
  name: string;
  headline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  audience: string;
  priceLabel: string;
  status: "live" | "beta" | "coming_soon";
  highlights: string[];
}

export const DONK_PRODUCTS: DonkProduct[] = [
  {
    id: "donk-merchant-builder",
    name: "DONK AI Merchant Builder",
    headline: "Launch your business campaign in minutes",
    description:
      "DONK AI builds the campaign. TROPTIONS powers the operating layer. UNYKORN gives every merchant and fan experience a namespace.",
    ctaPrimary: "Launch My Merchant Campaign",
    ctaSecondary: "See how it works",
    audience: "Local businesses, shops, restaurants, service providers",
    priceLabel: "$299 setup · $49/mo support",
    status: "live",
    highlights: [
      "AI-guided campaign setup in under 10 minutes",
      "QR campaign + loyalty reward + VIP pass",
      "Merchant namespace on TROPTIONS",
      "Customer capture and analytics",
      "Proof of campaign delivered",
    ],
  },
  {
    id: "donk-fan-tribute",
    name: "DONK AI Fan Tribute Builder",
    headline: "Create a fan tribute, community reward, or commemorative campaign",
    description:
      "Build fan tribute pages, community rewards, and commemorative campaigns. No prediction markets, no betting, no investment framing — pure fan and community engagement.",
    ctaPrimary: "Create Fan Tribute",
    audience: "Fans, supporter groups, local communities, event organizers",
    priceLabel: "Free for basic · $49 for custom",
    status: "live",
    highlights: [
      "Tribute page with message and media",
      "QR code for fan sharing",
      "Collectible coupon or VIP access attachment",
      "Optional sponsor tie-in",
      "Community reward flow",
    ],
  },
  {
    id: "donk-qr-giveaway",
    name: "DONK AI QR Giveaway",
    headline: "The fastest way to run a customer giveaway",
    description:
      "Create a QR giveaway campaign for your business or event. Customer scans → enters → wins a reward, coupon, or access pass. No betting, no odds, no gambling.",
    ctaPrimary: "Create QR Giveaway",
    audience: "Local businesses, event organizers, sponsors",
    priceLabel: "Included in Merchant Namespace",
    status: "live",
    highlights: [
      "QR code generator",
      "Giveaway landing page",
      "Winner selection (random or first-scan)",
      "Reward delivery (coupon, pass, collectible)",
      "Campaign proof report",
    ],
  },
  {
    id: "donk-nft-coupon",
    name: "DONK AI NFT Coupon Creator",
    headline: "A coupon your customer will actually keep",
    description:
      "Issue collectible NFT coupons for discounts, event access, local promos, and sponsor activations. Optional Solana mint. Always off-chain first.",
    ctaPrimary: "Create NFT Coupon",
    audience: "Merchants, sponsors, event organizers",
    priceLabel: "$49 per campaign",
    status: "live",
    highlights: [
      "Custom coupon artwork",
      "Offer value embedded",
      "Optional Solana mint",
      "QR redemption",
      "Expiry and usage limits",
    ],
  },
  {
    id: "donk-vip-pass",
    name: "DONK AI VIP Pass",
    headline: "Give your best customers VIP access",
    description:
      "Create digital VIP passes for events, venues, communities, and merchant loyalty programs. Scannable, shareable, on-chain verifiable.",
    ctaPrimary: "Build VIP Pass",
    audience: "Merchants, event organizers, fan communities, sponsors",
    priceLabel: "$49 per campaign",
    status: "live",
    highlights: [
      "Digital pass with QR scan",
      "Event or venue access tier",
      "Fan community recognition",
      "Sponsor perks",
      "On-chain verification optional",
    ],
  },
];

export const DONK_HERO = {
  headline: "Launch your business campaign in minutes.",
  subline:
    "DONK AI builds the campaign. TROPTIONS powers the operating layer. UNYKORN gives every merchant and fan experience a namespace.",
  disclaimer:
    "Campaign assets are for loyalty, access, rewards, coupons, collectibles, fan engagement, and promotional utility only. Not investments, not securities, not gambling products, not prediction markets.",
};
