export function getXrplExternalSignerGate() {
  return {
    allowed: false,
    mode: "external-signer-required",
    isLiveMainnetExecutionEnabled: false,
    blockedReason: "External signer approval required. In-app signing and key import remain blocked.",
    requiredApprovals: [
      "External signer integration approved",
      "Custody approval",
      "Compliance approval",
      "Board approval",
    ],
    blockedInputs: ["privateKey", "seed", "familySeed", "mnemonic"],
  } as const;
}