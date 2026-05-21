export interface TrexPermissionGate {
  id: string;
  gate: string;
  required: boolean;
  description: string;
}

export const EVM_TREX_PERMISSION_GATES: readonly TrexPermissionGate[] = [
  { id: "trex-identity", gate: "Investor identity", required: true, description: "Identity verification and participant mapping before eligibility checks." },
  { id: "trex-eligibility", gate: "Eligibility", required: true, description: "Rule-based investor eligibility checks by jurisdiction and instrument class." },
  { id: "trex-transfer", gate: "Transfer restrictions", required: true, description: "Transfer controls for permissioned secondary movement." },
  { id: "trex-recovery", gate: "Token recovery", required: true, description: "Issuer-managed recovery and override logic under policy controls." },
  { id: "trex-docs", gate: "Document attachment", required: true, description: "Attach legal and disclosure documents to tokenized asset records." },
  { id: "trex-issuer", gate: "Issuer controls", required: true, description: "Issuer role controls, approvals, and policy assertions." },
  { id: "trex-redemption", gate: "Redemption tracking", required: true, description: "Lifecycle tracking for redemption and retirement events." },
  { id: "trex-legal", gate: "Legal classification", required: true, description: "Legal treatment and instrument classification by jurisdiction." },
  { id: "trex-jurisdiction", gate: "Jurisdiction restrictions", required: true, description: "Geographic and regulatory restriction controls." },
];
