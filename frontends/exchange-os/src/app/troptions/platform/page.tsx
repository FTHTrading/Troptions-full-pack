import Link from "next/link";
import { Card, SectionHeader, Badge } from "@/components/ui";

export const metadata = {
  title: "TROPTIONS Platform - Senior System Overview",
  description: "Master control tower for TROPTIONS compliance, evidence, assets, and Web3 systems.",
};

// Platform taxonomy — matches senior vision
const TROPTIONS_PLATFORM_SYSTEMS = [
  {
    id: "legacy-systems",
    title: "Legacy Systems",
    description: "Original TROPTIONS Pay and asset infrastructure",
    items: [
      {
        name: "TROPTIONS Pay",
        status: "SIMULATION_ONLY",
        description: "430K merchants, payment processing — live claims BLOCKED until evidence verified",
        route: "/troptions/wallet-hub",
        risk: "LEGACY",
      },
      {
        name: "XRPL IOU",
        status: "ACTIVE",
        description: "100M TROPTIONS on XRPL mainnet, live distribution",
        route: "/troptions/xrpl-iou",
        risk: "VERIFIED",
      },
      {
        name: "Stellar IOU",
        status: "ACTIVE",
        description: "TROPTIONS on Stellar, parallel distribution",
        route: "/troptions/xrpl-stellar-compliance",
        risk: "VERIFIED",
      },
    ],
  },
  {
    id: "compliance-gates",
    title: "Compliance & Readiness",
    description: "GENIUS stablecoin framework, readiness scoring, evidence gating",
    items: [
      {
        name: "GENIUS Stablecoin",
        status: "SIMULATION_ONLY",
        description: "Compliance-first readiness layer; sandbox, partner, regulator, live modes",
        route: "/troptions/genius-control-tower",
        risk: "EVIDENCE_REQUIRED",
      },
      {
        name: "GENIUS Yield Opportunities",
        status: "SIMULATION_ONLY",
        description: "Lane-separated yield structures, merchant rewards, PPSI timing",
        route: "/troptions/genius-yield-opportunity",
        risk: "EVIDENCE_REQUIRED",
      },
      {
        name: "KYC Onboarding",
        status: "EVIDENCE_REQUIRED",
        description: "Individual and business KYC flows with identity verification",
        route: "/troptions/kyc",
        risk: "COMPLIANCE_REQUIRED",
      },
    ],
  },
  {
    id: "givbux-integration",
    title: "GivBux Evidence Layer",
    description: "Merchant, charity, and rewards claims verification",
    items: [
      {
        name: "Merchant Count Claims",
        status: "NEEDS_EVIDENCE",
        description: "Merchant acceptance proof, transaction volumes, settlement rates",
        route: "/troptions/givbux",
        risk: "UNVERIFIED",
      },
      {
        name: "Income Guarantee Claims",
        status: "BLOCKED",
        description: "All income/earnings claims default BLOCKED; require explicit evidence",
        route: "/troptions/givbux",
        risk: "HIGH_RISK",
      },
      {
        name: "Charity Partnerships",
        status: "EVIDENCE_REQUIRED",
        description: "Verified nonprofit relationships, donation tracking, impact measurement",
        route: "/troptions/givbux",
        risk: "VERIFICATION_REQUIRED",
      },
    ],
  },
  {
    id: "media-web3-tv",
    title: "Media & Web3 TV",
    description: "Creator content engine with evidence-gated publishing",
    items: [
      {
        name: "TNN Web3 TV",
        status: "ACTIVE",
        description: "TROPTIONS News Network — episodes, guests, sponsor agreements",
        route: "/troptions/media",
        risk: "ACTIVE",
      },
      {
        name: "Episode Publishing",
        status: "EVIDENCE_REQUIRED",
        description: "Guest releases and sponsor agreements required before publish",
        route: "/troptions/media",
        risk: "COMPLIANCE_REQUIRED",
      },
      {
        name: "Creator Onboarding",
        status: "ACTIVE",
        description: "Content creator registration, media release collection",
        route: "/troptions/media",
        risk: "ACTIVE",
      },
    ],
  },
  {
    id: "nil-creators",
    title: "NIL Creator System",
    description: "Name, image, likeness rights with guardian consent for minors",
    items: [
      {
        name: "Creator Registration",
        status: "ACTIVE",
        description: "Athlete, musician, influencer, educator, entrepreneur profiles",
        route: "/troptions/nil",
        risk: "ACTIVE",
      },
      {
        name: "NIL Campaigns",
        status: "ACTIVE",
        description: "NIL deals, sponsorships, content partnerships",
        route: "/troptions/nil",
        risk: "ACTIVE",
      },
      {
        name: "Guardian Consent (Minors)",
        status: "EVIDENCE_REQUIRED",
        description: "Parental/guardian consent required for minor creators",
        route: "/troptions/nil",
        risk: "COMPLIANCE_REQUIRED",
      },
    ],
  },
  {
    id: "sponsor-campaigns",
    title: "Sponsor & Campaign Management",
    description: "Campaign agreements, deliverables, and payment readiness",
    items: [
      {
        name: "Campaign Types",
        status: "ACTIVE",
        description: "NIL deals, interviews, merchant spotlights, charity campaigns, event coverage",
        route: "/troptions/nil",
        risk: "ACTIVE",
      },
      {
        name: "Deliverable Tracking",
        status: "ACTIVE",
        description: "Campaign deliverables must complete before payment ready",
        route: "/troptions/nil",
        risk: "ACTIVE",
      },
      {
        name: "Sponsor Agreements",
        status: "EVIDENCE_REQUIRED",
        description: "Sponsor agreements signed before campaign activation",
        route: "/troptions/nil",
        risk: "COMPLIANCE_REQUIRED",
      },
    ],
  },
  {
    id: "media-rights",
    title: "Media Rights & Signatures",
    description: "Agreement lifecycle and cryptographic signature collection",
    items: [
      {
        name: "Agreement Types",
        status: "ACTIVE",
        description: "NIL rights, media releases, sponsor agreements, content usage rights",
        route: "/troptions/media",
        risk: "ACTIVE",
      },
      {
        name: "Signature Collection",
        status: "ACTIVE",
        description: "Full lifecycle: draft → collecting → executed (simulation-only for planning)",
        route: "/troptions/media",
        risk: "ACTIVE",
      },
      {
        name: "EIP-1271 Validation",
        status: "SIMULATION_ONLY",
        description: "Contract wallet signature validation (planning/testing environment)",
        route: "/troptions/media",
        risk: "SIMULATION",
      },
    ],
  },
  {
    id: "wallets",
    title: "Wallet Hub",
    description: "Multi-chain asset storage and transfer validation",
    items: [
      {
        name: "Multi-Chain Wallets",
        status: "ACTIVE",
        description: "XRPL, Stellar, X402, internal ledger support",
        route: "/troptions/wallets",
        risk: "ACTIVE",
      },
      {
        name: "Transfer Simulation",
        status: "SIMULATION_ONLY",
        description: "All transfers return simulationOnly: true; live execution blocked",
        route: "/troptions/wallets",
        risk: "SAFETY_ENFORCED",
      },
      {
        name: "Asset Balances",
        status: "ACTIVE",
        description: "Read-only balance queries across all chains",
        route: "/troptions/wallets",
        risk: "READ_ONLY",
      },
    ],
  },
  {
    id: "legacy-bitcoin",
    title: "Legacy Bitcoin Holder Audit",
    description: "Provenance and valuation verification for historic assets",
    items: [
      {
        name: "XTROPTIONS.GOLD",
        status: "EVIDENCE_REQUIRED",
        description: "Asset ID A7653053619000933582, 10B supply — provenance unverified",
        route: "/troptions/legacy-btc-holders",
        risk: "UNVERIFIED_VALUATION",
      },
      {
        name: "TROPTIONS.GOLD",
        status: "EVIDENCE_REQUIRED",
        description: "Asset ID A9170398405421512794, 180M supply — reference pricing only",
        route: "/troptions/legacy-btc-holders",
        risk: "UNVERIFIED_VALUATION",
      },
      {
        name: "Bitcoin Custody History",
        status: "SIMULATION_ONLY",
        description: "Holder audit for legacy Bitcoin positions (Kevan wallet analysis)",
        route: "/troptions/legacy-btc-holders",
        risk: "RESEARCH_ONLY",
      },
    ],
  },
  {
    id: "rust-l1",
    title: "Rust L1 Namespaces",
    description: "Namespace registry with compliance status and settlement lanes",
    items: [
      {
        name: "Namespace Registry",
        status: "ACTIVE",
        description: "20+ reserved namespaces: troptions.root, troptions.givbux, troptions.media, etc.",
        route: "/troptions/system-map",
        risk: "ACTIVE",
      },
      {
        name: "Settlement Lanes",
        status: "SIMULATION_ONLY",
        description: "Tokenized deposits, merchant rebates, holder rewards (simulation-only)",
        route: "/troptions/system-map",
        risk: "SIMULATION",
      },
      {
        name: "KYC/KYB Enforcement",
        status: "EVIDENCE_REQUIRED",
        description: "Namespace settlement requires namespace-level KYC/KYB clearance",
        route: "/troptions/system-map",
        risk: "COMPLIANCE_REQUIRED",
      },
    ],
  },
  {
    id: "handbooks",
    title: "Compliance Handbooks",
    description: "Evidence-gated documentation for merchants, charities, creators, reps",
    items: [
      {
        name: "Merchant Handbook",
        status: "EVIDENCE_REQUIRED",
        description: "Settlement requirements, merchant rebate lanes, fraud prevention",
        route: "/troptions/compliance/handbooks",
        risk: "COMPLIANCE_REQUIRED",
      },
      {
        name: "Charity Handbook",
        status: "EVIDENCE_REQUIRED",
        description: "Donation tracking, nonprofit verification, impact measurement",
        route: "/troptions/compliance/handbooks",
        risk: "COMPLIANCE_REQUIRED",
      },
      {
        name: "Creator/NIL Handbook",
        status: "ACTIVE",
        description: "Creator onboarding, guardian consent, campaign framework",
        route: "/troptions/compliance/handbooks",
        risk: "ACTIVE",
      },
    ],
  },
] as const;

function getStatusBadgeVariant(status: string): "gold" | "green" | "amber" | "blue" | "indigo" | "red" | "slate" | "xrpl" | "stellar" | "mono" {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "SIMULATION_ONLY":
    case "EVIDENCE_REQUIRED":
      return "amber";
    case "BLOCKED":
      return "red";
    default:
      return "slate";
  }
}

function getRiskBadgeVariant(risk: string): "gold" | "green" | "amber" | "blue" | "indigo" | "red" | "slate" | "xrpl" | "stellar" | "mono" {
  if (risk.includes("HIGH_RISK") || risk.includes("BLOCKED")) return "red";
  if (risk.includes("EVIDENCE") || risk.includes("UNVERIFIED") || risk.includes("COMPLIANCE")) return "amber";
  if (risk.includes("ACTIVE") || risk.includes("VERIFIED")) return "green";
  return "blue";
}

export default function TroptionsPlatformPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071426] to-[#0a1a2e]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">TROPTIONS Platform</h1>
          <p className="text-xl text-slate-300 mb-6">
            Master control tower for compliance, evidence, assets, and Web3 systems.
          </p>
          <p className="text-base text-slate-400 mb-8">
            All live actions blocked by default. Simulation-only environments enforce evidence-gating across merchants,
            creators, charities, and institutional partners. No private keys. No custody. No buybacks. No LP execution enabled.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/troptions/compliance/handbooks"
              className="inline-flex items-center rounded-lg bg-[#c99a3c] px-6 py-3 font-bold text-[#111827] hover:bg-[#f0cf82] transition-colors"
            >
              View Handbooks
            </Link>
            <Link
              href="/troptions/genius-control-tower"
              className="inline-flex items-center rounded-lg border border-[#C9A84C] px-6 py-3 font-bold text-[#f0cf82] hover:bg-[#C9A84C]/10 transition-colors"
            >
              GENIUS Compliance
            </Link>
          </div>
        </div>

        {/* System Taxonomy */}
        <div className="space-y-12">
          {TROPTIONS_PLATFORM_SYSTEMS.map((section) => (
            <div key={section.id}>
              <SectionHeader heading={section.title} body={section.description} />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {section.items.map((item) => (
                  <Link key={item.name} href={item.route}>
                    <Card className="h-full hover:border-[#C9A84C]/80 hover:bg-white/[0.02] transition-all cursor-pointer">
                      <div className="p-6 space-y-4 h-full flex flex-col">
                        {/* Title + Status */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-white flex-1">{item.name}</h3>
                          <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-400 flex-1">{item.description}</p>

                        {/* Risk Badge */}
                        <div>
                          <Badge variant={getRiskBadgeVariant(item.risk)}>{item.risk}</Badge>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-xl border border-[#C9A84C]/30 bg-gradient-to-r from-[#C9A84C]/5 to-transparent p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Senior Platform Overview</h2>
          <p className="text-slate-300 mb-6">
            This platform integrates GivBux, Web3 TV, NIL creators, merchant claims, and Bitcoin legacy assets
            into a single compliance-first control tower for merchants, charities, creators, and institutions.
          </p>
          <p className="text-sm text-slate-400">
            All systems are simulation-only by default. Evidence-gating prevents live execution until compliance
            gates are verified. For full documentation, see compliance handbooks and GENIUS readiness scores.
          </p>
        </div>
      </div>
    </div>
  );
}
