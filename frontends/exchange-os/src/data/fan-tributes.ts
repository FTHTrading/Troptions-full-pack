// DONK AI / TROPTIONS — Fan Tribute data layer
// Fan tributes are commemorative, community, and engagement assets.
// Not prediction markets, not gambling, not securities.

export interface FanTribute {
  id: string;
  tributeName: string;
  community: string; // city / team / event / culture
  message: string;
  mediaPlaceholder: string;
  qrCampaign: boolean;
  couponOrPass: "coupon" | "vip_pass" | "collectible" | "none";
  sponsorTieIn: boolean;
  status: "template" | "active" | "archived";
}

export const FAN_TRIBUTE_TEMPLATES: FanTribute[] = [
  {
    id: "tribute-atlanta-wc2026",
    tributeName: "Atlanta World Cup 2026 Fan Tribute",
    community: "Atlanta · WC2026",
    message:
      "Celebrating Atlanta as a host city for the 2026 FIFA World Cup. For fans, local business, and community.",
    mediaPlaceholder: "Atlanta skyline + soccer ball",
    qrCampaign: true,
    couponOrPass: "collectible",
    sponsorTieIn: true,
    status: "template",
  },
  {
    id: "tribute-local-hero",
    tributeName: "Local Hero Fan Tribute",
    community: "Your City",
    message:
      "Honoring a local athlete, coach, team, or community figure. Commemorative digital tribute with QR share.",
    mediaPlaceholder: "Custom photo or team logo",
    qrCampaign: true,
    couponOrPass: "vip_pass",
    sponsorTieIn: false,
    status: "template",
  },
  {
    id: "tribute-merchant-fan",
    tributeName: "Merchant Fan Tribute",
    community: "Local Business + Fans",
    message:
      "Local business celebrates community moment with a fan tribute — includes a loyalty coupon or VIP offer.",
    mediaPlaceholder: "Business logo + event photo",
    qrCampaign: true,
    couponOrPass: "coupon",
    sponsorTieIn: true,
    status: "template",
  },
];

export const FAN_TRIBUTE_FLOW = [
  { step: 1, label: "Tribute name",             detail: "Name the tribute (team, city, moment, person)" },
  { step: 2, label: "Community / occasion",      detail: "Tag the city, team, event, or cultural moment" },
  { step: 3, label: "Message",                   detail: "Write a short tribute or community message" },
  { step: 4, label: "Media",                     detail: "Upload image, use team/event art, or pick from gallery" },
  { step: 5, label: "QR code",                   detail: "Generate shareable QR for fans to scan" },
  { step: 6, label: "Collectible or VIP access", detail: "Attach optional NFT coupon, collectible, or VIP access pass" },
  { step: 7, label: "Sponsor tie-in (optional)", detail: "Link a local merchant offer or sponsor activation" },
  { step: 8, label: "Publish",                   detail: "Go live — fans scan, claim, and share" },
];

export const FAN_TRIBUTE_DISCLAIMER =
  "Fan tributes are commemorative and community engagement assets — fan pages, digital moments, " +
  "collectibles, and access passes. They are not prediction markets, gambling products, " +
  "investments, securities, or financial instruments. Fans do not wager, stake, or invest.";
