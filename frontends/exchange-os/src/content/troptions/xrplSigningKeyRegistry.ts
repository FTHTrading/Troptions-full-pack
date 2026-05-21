export interface XrplSigningKeyRecord {
  readonly wallet: string;
  readonly masterKeyStatus: "enabled" | "disabled" | "unknown";
  readonly regularKey?: string;
  readonly signingKeySeen: boolean;
  readonly riskNote: string;
}

export const XRPL_SIGNING_KEY_REGISTRY: readonly XrplSigningKeyRecord[] = [
  {
    wallet: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    masterKeyStatus: "disabled",
    regularKey: "rpKmcC1PevAxTBRQgkYtakdGVup2K2Luqh",
    signingKeySeen: true,
    riskNote:
      "Regular key set on 2026-02-25 before asfDisableMaster. If this key is not recognized, treat control path as suspicious.",
  },
  {
    wallet: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    masterKeyStatus: "disabled",
    regularKey: "rJpKvdn64acBnVGNQ873JpQKujA4TAVbfN",
    signingKeySeen: true,
    riskNote:
      "Regular key rotated again on 2026-03-05 shortly before AMM withdrawals and the 81.417325 XRP ChangeNOW deposit.",
  },
  {
    wallet: "rDEW3swAxG4iJcBSRBdKLim33TfTciKzxX",
    masterKeyStatus: "unknown",
    regularKey: "rK3SFG4BVWJyNjbMDeEJcEMoRG51ax2CGR",
    signingKeySeen: true,
    riskNote:
      "Signer observed during failed AccountDelete path with tecHAS_OBLIGATIONS. If unrecognized, include in compromise investigation scope.",
  },
];

export const XRPL_SIGNING_KEY_EXPLAINER = {
  title: "Signing key forensics",
  bullets: [
    "Master key disabled means the primary seed is not used for signing.",
    "A regular key can still authorize transactions.",
    "If you do not recognize the signing setup, treat as compromise or misconfiguration.",
    "Do not paste secret keys anywhere.",
    "Move remaining assets only with trusted wallet software and secure operational controls.",
  ] as const,
} as const;
