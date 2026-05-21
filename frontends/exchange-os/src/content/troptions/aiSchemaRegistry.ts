/**
 * AI Schema Registry — JSON-LD schema templates for institutional pages.
 */

export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Troptions",
  description:
    "Troptions provides institutional operating infrastructure subject to provider, legal, compliance, custody, jurisdiction, and board approval gates. Not a bank, broker-dealer, exchange, or custodian.",
  url: "https://troptions.com",
  logo: "https://troptions.com/troptions/rwa/rwa-vault-logo.jpg",
  sameAs: [],
};

export const SOFTWARE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Troptions Institutional Platform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Proof-gated institutional infrastructure for RWA workflow, compliance orchestration, settlement readiness, and custody coordination.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Access subject to compliance and provider approval gates.",
  },
};

export const FAQ_JSONLD_ENTRIES = [
  {
    question: "Is Troptions a bank?",
    answer:
      "No. Troptions is institutional operating infrastructure, not a bank. Banking services require licensed banking providers.",
  },
  {
    question: "Is Troptions a broker-dealer?",
    answer:
      "No. Troptions is not a broker-dealer. Securities activities require licensed broker-dealer entities and regulatory approval.",
  },
  {
    question: "Does Troptions take custody of assets?",
    answer:
      "No. Troptions provides custody coordination workflows. Actual custody is managed by approved third-party custodians.",
  },
  {
    question: "Are trading features live?",
    answer:
    "No. XRPL and Stellar issuances are live on mainnet — USDC (175M), USDT (100M), DAI (50M), EURC (50M), and TROPTIONS (100M) are all issued and verifiable. Advanced trading workflows within the portal are subject to jurisdiction-specific compliance and provider approval.",
  },
  {
    question: "What is proof-gated issuance?",
    answer:
      "Proof-gated issuance means no asset issuance, settlement, or activation occurs without verified proof of funds, compliance clearance, custody confirmation, and board approval.",
  },
];

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_JSONLD_ENTRIES.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(opts: {
  title: string;
  description: string;
  datePublished: string;
  url: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    url: opts.url,
    author: {
      "@type": "Organization",
      name: opts.author ?? "Troptions Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "Troptions",
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
