export interface PublicBenefitControl {
  id: string;
  control: string;
  purpose: string;
  defaultMode: "simulation-only" | "monitoring-only" | "readiness-only";
}

export const PUBLIC_BENEFIT_RAIL_STATEMENT =
  "Troptions can support the fentanyl-prevention fight by making public-benefit funding more transparent, routing support requests to verified organizations, screening wallet risk, documenting disbursements, and producing audit-ready impact reports.";

export const PUBLIC_BENEFIT_REGISTRY: readonly PublicBenefitControl[] = [
  {
    id: "pb-verified-orgs",
    control: "Verified organization intake",
    purpose: "Route support requests only to verified organizations and approved programs.",
    defaultMode: "readiness-only",
  },
  {
    id: "pb-wallet-screen",
    control: "Wallet screening before routing",
    purpose: "Apply anti-illicit-finance screening before routing recommendations.",
    defaultMode: "monitoring-only",
  },
  {
    id: "pb-disbursement-trace",
    control: "Disbursement traceability",
    purpose: "Track simulated disbursement decisions with blocked-reason transparency.",
    defaultMode: "simulation-only",
  },
  {
    id: "pb-impact-audit",
    control: "Impact reporting and audit export",
    purpose: "Generate audit-ready simulation reports for public-benefit oversight.",
    defaultMode: "simulation-only",
  },
];
