// DONK AI / TROPTIONS — Namespace products data layer
// Namespaces give merchants and campaigns a branded identity on the TROPTIONS operating layer.

export interface NamespaceProduct {
  id: string;
  name: string;
  example: string;
  description: string;
  customerType: "merchant" | "sponsor" | "fan_community" | "event";
  price: string;
  includes: string[];
}

export const NAMESPACE_PRODUCTS: NamespaceProduct[] = [
  {
    id: "merchant-namespace-starter",
    name: "Merchant Namespace — Starter",
    example: "yourbusiness.unykorn.org",
    description:
      "A branded campaign identity for local businesses. Launch QR campaigns, loyalty offers, and VIP passes under one verified namespace.",
    customerType: "merchant",
    price: "$299 setup + $49/month",
    includes: [
      "Branded namespace (yourbusiness.unykorn.org or similar)",
      "QR campaign builder (1 active campaign)",
      "Loyalty reward / coupon / VIP pass",
      "Customer capture",
      "Proof screenshots",
      "DONK AI assistant",
      "Monthly support",
    ],
  },
  {
    id: "event-namespace",
    name: "Event Namespace",
    example: "event.troptions.com/your-event",
    description:
      "Campaign identity for events — concerts, sports, local festivals, or community gatherings. Includes QR check-in, fan tribute, and sponsor activation slots.",
    customerType: "event",
    price: "$499 setup + $99/month",
    includes: [
      "Event namespace",
      "QR check-in / fan scan flow",
      "Fan tribute page",
      "Sponsor activation slots (3)",
      "NFT coupon or VIP pass creation",
      "Proof of event activation",
    ],
  },
  {
    id: "sponsor-namespace",
    name: "Sponsor Namespace",
    example: "sponsor.unykorn.org/brand",
    description:
      "Brands and sponsors get a namespace to activate at fan touchpoints — tribute pages, QR campaigns, merchant activations, and digital moments.",
    customerType: "sponsor",
    price: "$999 setup + $199/month",
    includes: [
      "Sponsor namespace",
      "Brand overlay on 5 fan tributes",
      "Sponsored QR campaign",
      "Sponsored NFT coupon or VIP pass",
      "Fan reach analytics",
      "Proof of activation package",
    ],
  },
  {
    id: "fan-community-namespace",
    name: "Fan Community Namespace",
    example: "fans.unykorn.org/your-city",
    description:
      "Fan communities, team supporter groups, and local culture hubs get a namespace for tribute pages, collectibles, and community rewards.",
    customerType: "fan_community",
    price: "$99 setup + $19/month",
    includes: [
      "Community namespace",
      "Fan tribute page builder",
      "Collectible drop (1 per quarter)",
      "QR fan share flow",
      "Community reward utility",
    ],
  },
];
