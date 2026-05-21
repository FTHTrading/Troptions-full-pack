export interface XrplTrustlineForensicsRecord {
  readonly trustlineId: string;
  readonly wallet: string;
  readonly currency: string;
  readonly issuer: string;
  readonly state: "open" | "closed" | "unknown";
  readonly note: string;
}

export const XRPL_TRUSTLINE_FORENSICS_REGISTRY: readonly XrplTrustlineForensicsRecord[] = [
  {
    trustlineId: "rDEW3-USDT-50000000-20260218",
    wallet: "rDEW3swAxG4iJcBSRBdKLim33TfTciKzxX",
    currency: "USDT",
    issuer: "unknown",
    state: "open",
    note:
      "TrustSet limit 50,000,000 USDT succeeded. This is permission to hold issuer IOU and can contribute to AccountDelete obligations if not cleaned.",
  },
];

export const XRPL_TRUSTLINE_EXPLAINER = {
  title: "Trustline forensics",
  bullets: [
    "Trustlines allow an account to hold a specific issuer IOU.",
    "Setting a trustline does not mean funds are real or redeemable.",
    "Trustlines are common causes of tecHAS_OBLIGATIONS when attempting AccountDelete.",
    "Removing a trustline can happen when balance reaches zero.",
    "Trustlines affect account reserve requirements.",
    "Trustlines are not proof of value by themselves.",
  ] as const,
} as const;
