/**
 * TROPTIONS Revenue Layer
 * Client inquiry, booking, and opportunity types + utilities.
 *
 * This file defines the commercial funnel:
 * Client → Inquiry → Qualification → Proposal → Win
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_needed"
  | "proposal_sent"
  | "won"
  | "lost"
  | "archived";

export type LeadSource =
  | "website_contact"
  | "website_booking"
  | "referral"
  | "event"
  | "direct"
  | "sponsor_portal"
  | "admin_entry"
  | "unknown";

export type BudgetRange =
  | "under_5k"
  | "5k_to_25k"
  | "25k_to_100k"
  | "100k_to_500k"
  | "over_500k"
  | "not_specified";

export type ServiceCategory =
  | "ai_systems"
  | "cloud_namespace"
  | "sponsor_activation"
  | "trade_desk_readiness"
  | "web3_rwa_planning"
  | "media_nil_event"
  | "client_portal_setup"
  | "custom_platform"
  | "not_sure";

export type CallType =
  | "discovery"
  | "demo"
  | "proposal_review"
  | "onboarding"
  | "other";

// ─── Service Packages ─────────────────────────────────────────────────────────

export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  startingPrice: number;
  priceLabel: string; // e.g. "Starting at $2,500"
  description: string;
  includes: string[];
  notIncluded: string[];
  targetClient: string;
  deliverable: string;
  cta: string;
  category: ServiceCategory;
  requiresQuote: boolean;
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "starter-client-setup",
    name: "Starter Client Setup",
    tagline: "Get in the door with a qualified, tracked presence",
    startingPrice: 2500,
    priceLabel: "Starting at $2,500",
    description:
      "A structured engagement to establish your client profile, capture your business context, and build the foundation for a digital presence within the TROPTIONS ecosystem.",
    includes: [
      "Discovery call (1 session)",
      "Client intake and profile setup",
      "Basic namespace or profile configuration",
      "Landing page or portal shell",
      "Lead capture form",
      "Admin record creation",
      "Engagement summary document",
    ],
    notIncluded: [
      "Live token issuance or trading",
      "Financial compliance review",
      "Full CRM integration",
      "Custom backend development",
    ],
    targetClient: "Early-stage companies, solo operators, or emerging brands exploring the TROPTIONS platform",
    deliverable: "Client profile, portal shell, intake documentation",
    cta: "Request Starter Package",
    category: "client_portal_setup",
    requiresQuote: false,
  },
  {
    id: "growth-system-build",
    name: "Growth System Build",
    tagline: "A complete commercial presence with sales-ready infrastructure",
    startingPrice: 10000,
    priceLabel: "Starting at $10,000",
    description:
      "A full client-facing system: microsite or portal, CRM-ready inquiry flow, sponsor/partner package page, admin review dashboard, analytics, and documentation packet.",
    includes: [
      "Client-facing microsite or portal",
      "CRM-ready inquiry and lead capture flow",
      "Sponsor or partner package page",
      "Admin review dashboard",
      "Analytics integration setup",
      "Documentation and delivery packet",
      "Up to 3 revision sessions",
    ],
    notIncluded: [
      "Live payment processing (requires separate activation)",
      "Custody or escrow architecture",
      "Regulatory/compliance filings",
      "Ongoing hosting management",
    ],
    targetClient: "Growth-stage businesses, sponsors, and operators ready to begin transacting and marketing",
    deliverable: "Deployed microsite, admin dashboard, analytics, documentation",
    cta: "Request Growth Build",
    category: "client_portal_setup",
    requiresQuote: false,
  },
  {
    id: "institutional-platform-sprint",
    name: "Institutional Platform Sprint",
    tagline: "Production-grade platform for institutional-class clients",
    startingPrice: 50000,
    priceLabel: "Starting at $50,000",
    description:
      "A comprehensive build: custom client portal, namespace/membership architecture, admin workflow, compliance-ready documentation, API architecture, deployment pipeline, and investor/sponsor/trade desk packet support.",
    includes: [
      "Custom client portal (role-based access)",
      "Namespace and membership architecture",
      "Admin workflow and approval flows",
      "Compliance-ready documentation structure",
      "API architecture and integration plan",
      "Deployment pipeline",
      "Investor, sponsor, and trade desk packet support",
      "Post-delivery walkthrough and handoff",
    ],
    notIncluded: [
      "Live financial rails (escrow, clearing, settlement)",
      "Legal filings or regulatory approvals",
      "Ongoing operations support (available separately)",
    ],
    targetClient:
      "Institutional operators, fund managers, enterprise sponsors, and multi-entity platforms",
    deliverable:
      "Full platform deployment with portal, API, admin, compliance docs, and trade desk packet",
    cta: "Request Institutional Sprint",
    category: "custom_platform",
    requiresQuote: false,
  },
  {
    id: "enterprise-custom",
    name: "Enterprise / Custom",
    tagline: "End-to-end architecture for complex, multi-entity operations",
    startingPrice: 0,
    priceLabel: "Custom Quote",
    description:
      "Fully scoped engagements for AI systems, RWA architecture, multi-entity namespace systems, trade desk readiness, event/sponsor integrations, and custom backend planning.",
    includes: [
      "Scoping and architecture sessions",
      "AI systems design and integration planning",
      "RWA infrastructure framework",
      "Multi-entity namespace system design",
      "Trade desk readiness documentation",
      "Event and sponsor integration planning",
      "Custom backend and rails planning",
      "Dedicated engagement lead",
    ],
    notIncluded: [
      "Live token issuance, financial settlement, or custody without separate legal/compliance review",
    ],
    targetClient:
      "Enterprises, institutional partners, family offices, and sovereign-class operators",
    deliverable: "Fully custom — scoped per engagement",
    cta: "Request Enterprise Quote",
    category: "custom_platform",
    requiresQuote: true,
  },
];

// ─── Inquiry ──────────────────────────────────────────────────────────────────

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  budgetRange: BudgetRange;
  serviceInterest: ServiceCategory;
  timeline?: string;
  message: string;
  consentGiven: boolean;
  source: LeadSource;
  status: LeadStatus;
  leadScore?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Booking Request ──────────────────────────────────────────────────────────

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  callType: CallType;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

// ─── Revenue Opportunity ──────────────────────────────────────────────────────

export interface RevenueOpportunity {
  id: string;
  sourceType: "inquiry" | "booking";
  sourceId: string;
  name: string;
  company?: string;
  email: string;
  serviceInterest?: ServiceCategory;
  budgetRange?: BudgetRange;
  estimatedValue: number;
  leadScore: number;
  status: LeadStatus;
  recommendedAction: string;
  createdAt: string;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

const BUDGET_MIDPOINTS: Record<BudgetRange, number> = {
  under_5k: 2500,
  "5k_to_25k": 15000,
  "25k_to_100k": 62500,
  "100k_to_500k": 300000,
  over_500k: 750000,
  not_specified: 0,
};

export function calculateEstimatedOpportunityValue(
  budget: BudgetRange,
  service: ServiceCategory
): number {
  const base = BUDGET_MIDPOINTS[budget] ?? 0;
  // Institutional services have higher close rates, premium estimate
  const multiplier =
    service === "custom_platform" || service === "trade_desk_readiness" ? 0.4
    : service === "ai_systems" || service === "web3_rwa_planning" ? 0.35
    : 0.3;
  return Math.round(base * multiplier);
}

export function qualifyLead(inquiry: ClientInquiry): number {
  let score = 0;

  // Budget
  if (inquiry.budgetRange === "over_500k") score += 40;
  else if (inquiry.budgetRange === "100k_to_500k") score += 30;
  else if (inquiry.budgetRange === "25k_to_100k") score += 20;
  else if (inquiry.budgetRange === "5k_to_25k") score += 10;
  else if (inquiry.budgetRange === "under_5k") score += 5;

  // Service specificity
  if (inquiry.serviceInterest !== "not_sure") score += 15;
  if (
    inquiry.serviceInterest === "institutional_platform_sprint" as ServiceCategory ||
    inquiry.serviceInterest === "custom_platform"
  )
    score += 10;

  // Contact completeness
  if (inquiry.phone) score += 5;
  if (inquiry.company) score += 10;
  if (inquiry.website) score += 5;
  if (inquiry.message && inquiry.message.length > 100) score += 10;
  if (inquiry.timeline) score += 5;

  return Math.min(score, 100);
}

export function getNextRecommendedAction(inquiry: ClientInquiry): string {
  const score = inquiry.leadScore ?? qualifyLead(inquiry);

  if (inquiry.status === "new") {
    if (score >= 60) return "Priority follow-up — email within 4 hours";
    if (score >= 30) return "Send intro email and schedule discovery call";
    return "Send welcome email with service overview";
  }
  if (inquiry.status === "contacted") return "Follow up to schedule discovery call";
  if (inquiry.status === "qualified") return "Prepare and send proposal";
  if (inquiry.status === "proposal_needed") return "Draft proposal based on scope discussed";
  if (inquiry.status === "proposal_sent") return "Follow up on proposal — check for questions";
  if (inquiry.status === "won") return "Begin onboarding — send intake checklist";
  if (inquiry.status === "lost") return "Archive and note reason for loss";
  return "Review and update status";
}

export function formatPackagePrice(pkg: ServicePackage): string {
  if (pkg.requiresQuote) return "Custom Quote";
  return `Starting at $${pkg.startingPrice.toLocaleString()}`;
}

export function getPackageById(id: string): ServicePackage | undefined {
  return SERVICE_PACKAGES.find((p) => p.id === id);
}

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  ai_systems: "AI Systems",
  cloud_namespace: "Cloud / Namespace",
  sponsor_activation: "Sponsor Activation",
  trade_desk_readiness: "Trade Desk Readiness",
  web3_rwa_planning: "Web3 / RWA Planning",
  media_nil_event: "Media / NIL / Events",
  client_portal_setup: "Client Portal Setup",
  custom_platform: "Custom Platform",
  not_sure: "Not Sure Yet",
};

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  under_5k: "Under $5,000",
  "5k_to_25k": "$5,000 – $25,000",
  "25k_to_100k": "$25,000 – $100,000",
  "100k_to_500k": "$100,000 – $500,000",
  over_500k: "Over $500,000",
  not_specified: "Not specified",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_needed: "Proposal Needed",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
  archived: "Archived",
};
