export interface TroptionsHistoryMilestone {
  id: string;
  period: string;
  title: string;
  legacyNarrative: string;
  institutionalInterpretation: string;
  evidenceRequired: readonly string[];
  status: "legacy-archived" | "requires-verification" | "institutionalized";
}

export const TROPTIONS_HISTORY_REGISTRY: readonly TroptionsHistoryMilestone[] = [
  {
    id: "HIST-2003-FOUNDING",
    period: "2003",
    title: "Founding and barter-first orientation",
    legacyNarrative:
      "Public Troptions history describes a 2003 launch focused on barter/trade utility and peer-to-peer exchange ideas.",
    institutionalInterpretation:
      "The founding narrative is preserved as a historical claim and requires archived records before it is used in institutional diligence materials.",
    evidenceRequired: [
      "Formation and operating records",
      "Archived publications",
      "Timeline corroboration package",
    ],
    status: "requires-verification",
  },
  {
    id: "HIST-UTILITY-ERA",
    period: "Early ecosystem phase",
    title: "Proof-of-use and merchant/payment storytelling",
    legacyNarrative:
      "Troptions messaging expanded into merchant utility, payment narratives, and community-focused use statements.",
    institutionalInterpretation:
      "Utility-era claims are being mapped into dated claim records with explicit source and verification status.",
    evidenceRequired: [
      "Payment-rail documentation",
      "Merchant claim reconciliation",
      "Policy and disclosure controls",
    ],
    status: "requires-verification",
  },
  {
    id: "HIST-BRANCH-EXPANSION",
    period: "Expansion phase",
    title: "Troptions Pay, Unity, Gold, and RWA concepts",
    legacyNarrative:
      "Public materials introduced branch narratives across payments, Unity utility, and gold/RWA concept tracks.",
    institutionalInterpretation:
      "Branch narratives are converted into module definitions that require legal classification, custody controls, and evidence-linked status before publication.",
    evidenceRequired: [
      "Branch-specific legal memo",
      "Custody and provider dependency map",
      "Operational readiness checklist",
    ],
    status: "requires-verification",
  },
  {
    id: "HIST-INSTITUTIONAL-TRANSITION",
    period: "Current build",
    title: "Institutional operating system transition",
    legacyNarrative:
      "Legacy claims are no longer published as standalone marketing assertions.",
    institutionalInterpretation:
      "Troptions now centers evidence rooms, source maps, proof-gated workflows, simulation-first settlement logic, and compliance-aware release controls.",
    evidenceRequired: [
      "Claim registry completeness",
      "Source-map traceability",
      "Release gate audit logs",
    ],
    status: "institutionalized",
  },
];
