export interface InvestorReadinessProfile {
  subjectId: string;
  investorName: string;
  investorType: "institutional" | "accredited-individual" | "non-accredited";
  requiresAccreditation: boolean;
  kycComplete: boolean;
  sanctionsComplete: boolean;
  accreditationComplete: boolean;
  docsComplete: boolean;
  walletAllowlistComplete: boolean;
  status: "ready" | "blocked";
  blockers: string[];
}

export const INVESTOR_READINESS: InvestorReadinessProfile[] = [
  {
    subjectId: "INV-001",
    investorName: "Alpha Institutional LP",
    investorType: "institutional",
    requiresAccreditation: true,
    kycComplete: true,
    sanctionsComplete: true,
    accreditationComplete: true,
    docsComplete: true,
    walletAllowlistComplete: true,
    status: "ready",
    blockers: [],
  },
  {
    subjectId: "INV-002",
    investorName: "Pending Family Office",
    investorType: "institutional",
    requiresAccreditation: true,
    kycComplete: true,
    sanctionsComplete: false,
    accreditationComplete: true,
    docsComplete: false,
    walletAllowlistComplete: false,
    status: "blocked",
    blockers: ["sanctions-incomplete", "docs-incomplete", "wallet-allowlist-incomplete"],
  },
];

export function isInvestorOperationallyReady(profile: InvestorReadinessProfile): boolean {
  if (!profile.kycComplete) return false;
  if (!profile.sanctionsComplete) return false;
  if (profile.requiresAccreditation && !profile.accreditationComplete) return false;
  if (!profile.docsComplete) return false;
  if (!profile.walletAllowlistComplete) return false;
  return true;
}

export function getBlockedInvestors(): InvestorReadinessProfile[] {
  return INVESTOR_READINESS.filter((profile) => !isInvestorOperationallyReady(profile));
}
