export interface AntiIllicitFinanceControl {
  id: string;
  control: string;
  description: string;
  defaultState: "enabled" | "required" | "placeholder";
}

export const ANTI_ILLICIT_FINANCE_REGISTRY: readonly AntiIllicitFinanceControl[] = [
  { id: "aif-wallet-risk", control: "Wallet risk simulation", description: "Risk-score wallets before route recommendations.", defaultState: "enabled" },
  { id: "aif-sanctions", control: "Sanctions screening placeholder", description: "Placeholder integration point for sanctions datasets and provider checks.", defaultState: "placeholder" },
  { id: "aif-suspicious-routes", control: "Suspicious route flags", description: "Flag route patterns that exceed policy risk thresholds.", defaultState: "enabled" },
  { id: "aif-freeze-aware", control: "Freeze-status awareness", description: "Track issuer freeze events and route risk impact.", defaultState: "enabled" },
  { id: "aif-issuer-actions", control: "Stablecoin issuer action tracking", description: "Track issuer-level compliance or enforcement actions.", defaultState: "placeholder" },
  { id: "aif-le-meta", control: "Law-enforcement request metadata placeholder", description: "Metadata-only placeholder without investigative function.", defaultState: "placeholder" },
  { id: "aif-audit", control: "Audit log export", description: "Export compliance and route decision logs for review.", defaultState: "required" },
  { id: "aif-blocked-reasons", control: "Blocked route reasons", description: "Return clear blocked reasons in simulation responses.", defaultState: "required" },
  { id: "aif-escalation", control: "Compliance escalation", description: "Escalate higher-risk simulations to compliance review queues.", defaultState: "required" },
];
