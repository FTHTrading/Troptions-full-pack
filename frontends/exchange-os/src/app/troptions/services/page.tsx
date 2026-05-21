import type { Metadata } from "next";
import Link from "next/link";
import { SystemStatusBadge } from "@/components/troptions/SystemStatusBadge";
import { ComplianceNotice } from "@/components/troptions/ComplianceNotice";

export const metadata: Metadata = {
  title: "Services — TROPTIONS",
  description:
    "Explore TROPTIONS services: AI systems, cloud namespace, sponsor activation, trade desk readiness, Web3 infrastructure, media and NIL, and custom platform builds.",
  openGraph: {
    title: "TROPTIONS Services",
    description:
      "AI systems, cloud namespace, sponsor activation, trade desk readiness, Web3/RWA infrastructure, media/NIL, and custom platform buildouts for institutional clients.",
  },
};

const SERVICES = [
  {
    id: "ai-systems",
    title: "AI Systems",
    status: "Client Ready" as const,
    tagline: "Operational AI infrastructure for your business",
    description:
      "TROPTIONS designs and builds AI-powered systems: intelligent dashboards, automated reporting, conversational interfaces, and custom model integrations for business operations.",
    forWho: "Businesses, operators, and institutions looking to deploy AI within their workflow",
    whatYouGet: [
      "AI system architecture and design",
      "Custom model integration planning",
      "Operational workflow automation",
      "Admin dashboard with AI-powered insights",
      "Documentation and handoff packet",
    ],
    notIncluded: ["Ongoing model hosting (unless contracted)", "Consumer-facing AI products"],
    price: "Starting at $10,000",
    cta: "/troptions/contact?service=ai_systems",
    ctaLabel: "Request AI Systems Scope",
  },
  {
    id: "cloud-namespace",
    title: "Cloud / Namespace Systems",
    status: "Client Ready" as const,
    tagline: "Private digital infrastructure under your brand",
    description:
      "Build a branded namespace within the TROPTIONS Cloud ecosystem. Access-controlled, role-based, and configurable for clients, sponsors, teams, or members.",
    forWho: "Platforms, operators, and institutions needing controlled, branded digital environments",
    whatYouGet: [
      "Namespace architecture and setup",
      "Role-based access controls",
      "Client or member portal shell",
      "API access configuration",
      "Deployment and documentation",
    ],
    notIncluded: [
      "Live blockchain namespace (requires separate chain activation)",
      "Payment processing (activatable separately)",
    ],
    price: "Starting at $10,000",
    cta: "/troptions/contact?service=cloud_namespace",
    ctaLabel: "Request Namespace Scope",
  },
  {
    id: "sponsor-activation",
    title: "Sponsor Activation Systems",
    status: "Client Ready" as const,
    tagline: "Connect sponsors, events, and media into one trackable system",
    description:
      "End-to-end sponsor management: activation pages, proposal generation, sponsor packages, engagement tracking, and admin reporting.",
    forWho: "Event organizers, leagues, media companies, and brands managing sponsor relationships",
    whatYouGet: [
      "Sponsor portal or activation microsite",
      "Sponsor package pages",
      "Lead capture and sponsor inquiry flow",
      "Admin sponsor management dashboard",
      "Reporting and analytics",
    ],
    notIncluded: ["Live contract signing (requires legal integration)", "Payment processing (activatable)"],
    price: "Starting at $10,000",
    cta: "/troptions/contact?service=sponsor_activation",
    ctaLabel: "Request Sponsor Scope",
  },
  {
    id: "trade-desk-readiness",
    title: "Trade Desk Readiness Documents",
    status: "Client Ready" as const,
    tagline: "Structured documentation for institutional-grade readiness reviews",
    description:
      "TROPTIONS prepares the documentation infrastructure businesses need before engaging with institutional counterparties, trade desks, or compliance reviewers. This is documentation and planning — not live trading.",
    forWho: "Companies preparing for institutional discussions, compliance review, or capital structure planning",
    whatYouGet: [
      "Trade desk readiness documentation package",
      "Capability and asset overview documents",
      "Compliance and jurisdiction awareness review",
      "Stakeholder-facing summary packets",
      "Delivery in structured PDF and digital format",
    ],
    notIncluded: [
      "Live trading or execution",
      "Legal or regulatory filings",
      "Securities brokerage services",
      "Guaranteed funding or approvals",
    ],
    price: "Starting at $10,000",
    cta: "/troptions/contact?service=trade_desk_readiness",
    ctaLabel: "Request Trade Desk Package",
    complianceNote: true,
  },
  {
    id: "web3-rwa-planning",
    title: "Web3 / RWA Infrastructure Planning",
    status: "Planning" as const,
    tagline: "Framework design for tokenization and real-world asset readiness",
    description:
      "Architecture planning for tokenization workflows, real-world asset (RWA) systems, smart contract scaffolding, and multi-chain infrastructure. This is planning and design — not live issuance.",
    forWho: "Operators, funds, and institutions planning RWA, tokenization, or multi-chain infrastructure",
    whatYouGet: [
      "RWA infrastructure architecture plan",
      "Tokenization workflow design",
      "Smart contract scaffolding review",
      "Multi-chain integration planning",
      "Compliance pathway documentation",
    ],
    notIncluded: [
      "Live token issuance or sale",
      "On-chain execution",
      "Legal filings or regulatory approvals",
      "Guaranteed liquidity or market access",
    ],
    price: "Custom Quote",
    cta: "/troptions/contact?service=web3_rwa_planning",
    ctaLabel: "Request RWA Planning Scope",
    complianceNote: true,
  },
  {
    id: "media-nil-event",
    title: "Media / NIL / Event Activation",
    status: "Client Ready" as const,
    tagline: "Digital infrastructure for media, athlete, and event brands",
    description:
      "Build the digital layer for media companies, NIL athletes, and event brands: profile systems, activation portals, sponsor integration, and content management.",
    forWho: "Athletes, agents, event organizers, leagues, and media companies",
    whatYouGet: [
      "NIL or media profile system",
      "Event or activation portal",
      "Sponsor and partner integration",
      "Content management setup",
      "Analytics and reporting",
    ],
    notIncluded: ["Legal NIL contract management (available via partners)", "Payment processing (activatable)"],
    price: "Starting at $2,500",
    cta: "/troptions/contact?service=media_nil_event",
    ctaLabel: "Request Media / NIL Scope",
  },
  {
    id: "client-portal-setup",
    title: "Client Portal Setup",
    status: "Client Ready" as const,
    tagline: "Your clients, your brand, your portal",
    description:
      "A branded client portal with login, profile, documents, status tracking, and admin management. Full handoff with documentation.",
    forWho: "Businesses needing a branded, secure portal for their own clients or members",
    whatYouGet: [
      "Role-based client portal",
      "Document and resource center",
      "Status and onboarding tracking",
      "Admin management interface",
      "Branding and customization",
    ],
    notIncluded: [
      "Complex financial transactions (activatable via payment rails planning)",
    ],
    price: "Starting at $10,000",
    cta: "/troptions/contact?service=client_portal_setup",
    ctaLabel: "Request Portal Scope",
  },
  {
    id: "custom-platform",
    title: "Custom Platform Buildouts",
    status: "Client Ready" as const,
    tagline: "Enterprise and institutional systems built end-to-end",
    description:
      "Fully scoped, custom platform engagements for complex, multi-entity, or institutional clients. AI systems, blockchain-ready infrastructure, admin workflows, compliance architecture, and deployment pipelines.",
    forWho: "Enterprises, institutional operators, family offices, and multi-entity platforms",
    whatYouGet: [
      "Full scoping and architecture sessions",
      "Custom platform design and build",
      "Admin, compliance, and API architecture",
      "Deployment pipeline",
      "Post-delivery support and documentation",
    ],
    notIncluded: [
      "Live financial rails without separate compliance review",
    ],
    price: "Custom Quote",
    cta: "/troptions/contact?service=custom_platform",
    ctaLabel: "Request Enterprise Quote",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#071426] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 bg-[#071426]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">
            TROPTIONS Platform
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Services</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 leading-relaxed">
            Real infrastructure for real business. Each engagement is scoped, delivered, and documented.
            No live financial rails unless proven and labeled as such.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/troptions/pricing"
              className="rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
            >
              View Pricing
            </Link>
            <Link
              href="/troptions/contact"
              className="rounded-lg border border-[#C9A84C]/50 px-5 py-2.5 text-sm font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition"
            >
              Submit Inquiry
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
        {/* Services Grid */}
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-white/10 bg-white/5 p-6 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{service.title}</h2>
                <p className="text-sm text-[#C9A84C] mt-1">{service.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <SystemStatusBadge status={service.status} />
                <span className="text-sm font-semibold text-white bg-white/10 rounded px-3 py-1">
                  {service.price}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">{service.description}</p>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Who It&apos;s For</p>
                <p className="text-xs text-slate-300 leading-relaxed">{service.forWho}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">What You Get</p>
                <ul className="space-y-1">
                  {service.whatYouGet.map((item) => (
                    <li key={item} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Not Included</p>
                <ul className="space-y-1">
                  {service.notIncluded.map((item) => (
                    <li key={item} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className="text-slate-600 mt-0.5 shrink-0">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {service.complianceNote && (
              <div className="mt-4">
                <ComplianceNotice compact />
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href={service.cta}
                className="inline-flex items-center rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#071426] hover:bg-[#e0bd6a] transition"
              >
                {service.ctaLabel} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
