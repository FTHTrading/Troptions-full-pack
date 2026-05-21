export type OldMoneyPageSpec = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  route: string;
  quote: string;
  quoteAttribution: string;
  cards: Array<{
    heading: string;
    body: string;
  }>;
  ctaLabel: string;
  ctaHref: string;
  media?: {
    src: string;
    alt: string;
    caption: string;
  };
};

export const OLD_MONEY_DISCLAIMER =
  "For informational and governance coordination purposes only. Nothing on this website is an offer to sell, a solicitation to buy, financial advice, or legal advice. Access to instruments, settlement workflows, and custody controls remains subject to jurisdictional policy, onboarding, and formal approvals.";

export const OLD_MONEY_NAV = [
  { label: "Overview", href: "/troptions-old-money/overview" },
  { label: "Institutional", href: "/troptions-old-money/institutional" },
  { label: "RWA", href: "/troptions-old-money/rwa" },
  { label: "Gold", href: "/troptions-old-money/gold" },
  { label: "Energy", href: "/troptions-old-money/energy" },
  { label: "Proof", href: "/troptions-old-money/proof" },
  { label: "Settlement", href: "/troptions-old-money/settlement" },
  { label: "Custody", href: "/troptions-old-money/custody" },
  { label: "Reports", href: "/troptions-old-money/reports" },
  { label: "Annual Letter", href: "/troptions-old-money/annual-letter" },
  { label: "Governance", href: "/troptions-old-money/governance" },
  { label: "Contact", href: "/troptions-old-money/contact" },
  { label: "Media Library", href: "/troptions-old-money/media" },
] as const;

export const OLD_MONEY_EVIDENCE_ROWS = [
  {
    item: "Reserve composition attestations",
    cadence: "Quarterly",
    authority: "Independent assurance partner",
    status: "Scheduled",
  },
  {
    item: "Operational control matrices",
    cadence: "Monthly",
    authority: "Internal audit and governance council",
    status: "Published",
  },
  {
    item: "Settlement exception register",
    cadence: "Weekly",
    authority: "Treasury operations",
    status: "In review",
  },
];

export const OLD_MONEY_PAGES: Record<string, OldMoneyPageSpec> = {
  home: {
    id: "home",
    title: "Troptions Old-Money Institutional",
    subtitle: "Discipline, settlement integrity, and measured growth",
    intro:
      "Troptions presents digital-asset infrastructure with the posture of a long-duration institution: policy-first onboarding, verifiable controls, and conservative execution windows.",
    route: "/troptions-old-money",
    quote: "Endurance is built on process, not prediction.",
    quoteAttribution: "Institutional Operating Note",
    cards: [
      {
        heading: "Stewardship",
        body: "Every launch path is treated as a fiduciary workflow with traceability, approvals, and retained evidence.",
      },
      {
        heading: "Settlement Assurance",
        body: "Transfers remain policy-gated with deterministic controls, exception flags, and operator accountability.",
      },
      {
        heading: "Measured Deployment",
        body: "We scale in audited stages and prefer consistency over velocity theatrics.",
      },
    ],
    ctaLabel: "Enter Institutional Overview",
    ctaHref: "/troptions-old-money/overview",
    media: {
      src: "/troptions/video/troptions-brand-story-a.mp4",
      alt: "Institutional brand motion sequence",
      caption: "Institutional narrative reel",
    },
  },
  overview: {
    id: "overview",
    title: "Institutional Overview",
    subtitle: "A governance-led digital asset operating model",
    intro:
      "This platform aligns issuance, proof, settlement, and custody into one reviewable institutional framework.",
    route: "/troptions-old-money/overview",
    quote: "Policy is the architecture of trust.",
    quoteAttribution: "Governance Desk",
    cards: [
      {
        heading: "Public posture, private rigor",
        body: "We maintain plain-language communication while preserving institutional control depth.",
      },
      {
        heading: "Evidence before narrative",
        body: "Any material representation must be supported by artifacts in the proof and diligence track.",
      },
      {
        heading: "Operating continuity",
        body: "Runbooks and drill records are maintained to sustain service quality across event conditions.",
      },
    ],
    ctaLabel: "Review Institutional Track",
    ctaHref: "/troptions-old-money/institutional",
  },
  institutional: {
    id: "institutional",
    title: "Institutional Track",
    subtitle: "Jurisdiction-aware onboarding and operational controls",
    intro:
      "Institutional participation is coordinated through structured onboarding, policy checks, and role-based access controls.",
    route: "/troptions-old-money/institutional",
    quote: "Governance quality determines capital durability.",
    quoteAttribution: "Risk Committee",
    cards: [
      {
        heading: "Onboarding controls",
        body: "Counterparty and operator scopes are provisioned via explicit role boundaries and recurring review.",
      },
      {
        heading: "Escalation pathways",
        body: "Incidents are routed through formal escalation tiers with operator sign-offs and retained logs.",
      },
      {
        heading: "Operational transparency",
        body: "Material control events are timestamped and exportable for diligence workflows.",
      },
    ],
    ctaLabel: "View RWA Infrastructure",
    ctaHref: "/troptions-old-money/rwa",
  },
  rwa: {
    id: "rwa",
    title: "Real-World Asset Infrastructure",
    subtitle: "From physical infrastructure to governed digital representation",
    intro:
      "RWA tracks are designed for staged intake, documentary evidence, valuation governance, and controlled issuance workflows.",
    route: "/troptions-old-money/rwa",
    quote: "Conversion requires controls, not slogans.",
    quoteAttribution: "Asset Desk",
    cards: [
      {
        heading: "Evidence bundles",
        body: "Each intake path ties legal, operational, and technical documents to review gates before progression.",
      },
      {
        heading: "Registry fidelity",
        body: "Asset records are versioned and reconciled with issuance statuses under controlled change management.",
      },
      {
        heading: "Lifecycle governance",
        body: "Issuance and maintenance workflows preserve auditability from intake through report publication.",
      },
    ],
    ctaLabel: "Proceed to Gold Program",
    ctaHref: "/troptions-old-money/gold",
    media: {
      src: "/troptions/rwa/rwa-vault-logo.jpg",
      alt: "RWA vault institutional emblem",
      caption: "RWA vault mark",
    },
  },
  gold: {
    id: "gold",
    title: "Gold Program",
    subtitle: "Physical reserve logic with digital operating controls",
    intro:
      "The gold track emphasizes provenance, serial-level documentation, custody process assurance, and controlled digital twin mechanics.",
    route: "/troptions-old-money/gold",
    quote: "Credibility starts with verifiable custody.",
    quoteAttribution: "Reserve Operations",
    cards: [
      {
        heading: "Serial traceability",
        body: "Reserve records maintain serial-level references with reconciliation checkpoints and review logs.",
      },
      {
        heading: "Custody governance",
        body: "Custody actions require policy alignment, role-based controls, and multi-step validation.",
      },
      {
        heading: "Conservative issuance windows",
        body: "Release sequencing is tied to documentary completeness and governance sign-off.",
      },
    ],
    ctaLabel: "Review Energy Programs",
    ctaHref: "/troptions-old-money/energy",
    media: {
      src: "/troptions/gold/gold-digital-twin.jpg",
      alt: "Gold reserve and digital twin composition",
      caption: "Gold reserve twin concept",
    },
  },
  energy: {
    id: "energy",
    title: "Energy Programs",
    subtitle: "Operationally grounded commodity-adjacent governance",
    intro:
      "Energy-linked namespaces and programs are introduced with strict representation controls and operational reporting constraints.",
    route: "/troptions-old-money/energy",
    quote: "Prudence is a production discipline.",
    quoteAttribution: "Energy Oversight",
    cards: [
      {
        heading: "Namespace discipline",
        body: "Energy identifiers are treated as governance primitives with strict publication and review protocols.",
      },
      {
        heading: "Operational context",
        body: "Program communications remain factual, measured, and anchored to operational status.",
      },
      {
        heading: "Risk contouring",
        body: "Exposure pathways are monitored against policy thresholds and escalation criteria.",
      },
    ],
    ctaLabel: "Open Proof Track",
    ctaHref: "/troptions-old-money/proof",
    media: {
      src: "/troptions/energy/oil-namespace-logo.jpg",
      alt: "Energy namespace emblem",
      caption: "Energy namespace identity",
    },
  },
  proof: {
    id: "proof",
    title: "Proof and Diligence",
    subtitle: "Controlled publication of evidence and attestation trails",
    intro:
      "Proof workflows organize documentary support, attestations, and disclosures into reviewer-ready packages.",
    route: "/troptions-old-money/proof",
    quote: "Evidence is the operating language.",
    quoteAttribution: "Proof Desk",
    cards: [
      {
        heading: "Publication standards",
        body: "Materials are staged through quality checks before institutional distribution.",
      },
      {
        heading: "Source integrity",
        body: "Evidence artifacts are linked to controlled records to preserve traceability.",
      },
      {
        heading: "Disclosure discipline",
        body: "Disclosures prioritize clear language and avoid promotional framing.",
      },
    ],
    ctaLabel: "Review Settlement",
    ctaHref: "/troptions-old-money/settlement",
  },
  settlement: {
    id: "settlement",
    title: "Settlement Infrastructure",
    subtitle: "Deterministic processes and operational contingency",
    intro:
      "Settlement pathways emphasize policy gates, deterministic processing, and documented exception handling.",
    route: "/troptions-old-money/settlement",
    quote: "Reliability is a process commitment.",
    quoteAttribution: "Settlement Operations",
    cards: [
      {
        heading: "Control gates",
        body: "Settlement actions must satisfy policy checks before execution windows are opened.",
      },
      {
        heading: "Exception response",
        body: "Anomaly pathways are monitored with escalation tiers and retained operator context.",
      },
      {
        heading: "Operational records",
        body: "Structured logs and metric events support after-action review and continuity planning.",
      },
    ],
    ctaLabel: "Inspect Custody Controls",
    ctaHref: "/troptions-old-money/custody",
  },
  custody: {
    id: "custody",
    title: "Custody Controls",
    subtitle: "Policy-managed access, segregation, and verifiable stewardship",
    intro:
      "Custody operations follow explicit role boundaries, procedural controls, and auditable approvals.",
    route: "/troptions-old-money/custody",
    quote: "Stewardship is measured by controls kept under stress.",
    quoteAttribution: "Custody Program",
    cards: [
      {
        heading: "Access segregation",
        body: "Duties are segmented to reduce concentration risk and preserve control integrity.",
      },
      {
        heading: "Approval pathways",
        body: "Material custody actions require accountable approvals with immutable timestamps.",
      },
      {
        heading: "Review cadence",
        body: "Control reviews are performed on a fixed cadence with documented outcomes.",
      },
    ],
    ctaLabel: "Open Reports",
    ctaHref: "/troptions-old-money/reports",
    media: {
      src: "/troptions/certificates/power-genesis-certificate.jpg",
      alt: "Program certificate preview",
      caption: "Illustrative program certificate",
    },
  },
  reports: {
    id: "reports",
    title: "Institutional Reports",
    subtitle: "Operating updates for governance and diligence participants",
    intro:
      "Reporting focuses on controls, exceptions, remediation tracks, and process outcomes.",
    route: "/troptions-old-money/reports",
    quote: "Reports should clarify reality, not decorate it.",
    quoteAttribution: "Operations Review",
    cards: [
      {
        heading: "Control health",
        body: "Routine disclosures summarize control performance and review outcomes.",
      },
      {
        heading: "Exception cadence",
        body: "Escalation and incident trends are tracked for governance visibility.",
      },
      {
        heading: "Action accountability",
        body: "Remediation items are linked to owners, timelines, and closure signals.",
      },
    ],
    ctaLabel: "Read Annual Letter",
    ctaHref: "/troptions-old-money/annual-letter",
  },
  annualLetter: {
    id: "annual-letter",
    title: "Annual Letter",
    subtitle: "A measured account of the operating year",
    intro:
      "Our annual letter records what was executed, what was corrected, and where governance tightened over the period.",
    route: "/troptions-old-money/annual-letter",
    quote: "The durable institution speaks plainly and keeps receipts.",
    quoteAttribution: "Chair Office",
    cards: [
      {
        heading: "Execution summary",
        body: "We report completed milestones and unresolved work with equal precision.",
      },
      {
        heading: "Governance upgrades",
        body: "Control changes are documented with rationale and expected operational impact.",
      },
      {
        heading: "Forward posture",
        body: "Upcoming objectives are framed as accountable programs, not slogans.",
      },
    ],
    ctaLabel: "Inspect Governance",
    ctaHref: "/troptions-old-money/governance",
  },
  governance: {
    id: "governance",
    title: "Governance Framework",
    subtitle: "Policy layers, committee accountability, and escalation order",
    intro:
      "The governance framework defines decision authority, evidence thresholds, and escalation rules for critical operations.",
    route: "/troptions-old-money/governance",
    quote: "Good governance is visible in difficult moments.",
    quoteAttribution: "Governance Council",
    cards: [
      {
        heading: "Committee structure",
        body: "Decision rights are distributed across focused committees with explicit mandates.",
      },
      {
        heading: "Policy lifecycle",
        body: "Policies are versioned, reviewed, and retired through controlled governance motions.",
      },
      {
        heading: "Escalation doctrine",
        body: "Critical events follow predefined routing with operator-level accountability.",
      },
    ],
    ctaLabel: "Contact Institutional Desk",
    ctaHref: "/troptions-old-money/contact",
  },
  contact: {
    id: "contact",
    title: "Institutional Contact",
    subtitle: "Formal channel for governance and diligence requests",
    intro:
      "Use this channel for institutional diligence coordination, policy clarifications, and governance-bound operational inquiries.",
    route: "/troptions-old-money/contact",
    quote: "Serious inquiries deserve structured responses.",
    quoteAttribution: "Institutional Office",
    cards: [
      {
        heading: "Diligence intake",
        body: "Provide entity profile, review scope, and required timelines for triage and scheduling.",
      },
      {
        heading: "Governance inquiries",
        body: "Policy and control questions are routed to the relevant governance owner for formal response.",
      },
      {
        heading: "Operational coordination",
        body: "Settlement and custody coordination remains subject to approved onboarding state.",
      },
    ],
    ctaLabel: "Return to Home",
    ctaHref: "/troptions-old-money",
    media: {
      src: "/troptions/video/troptions-brand-story-b.mp4",
      alt: "Institutional desk media loop",
      caption: "Institutional desk motion",
    },
  },
};
