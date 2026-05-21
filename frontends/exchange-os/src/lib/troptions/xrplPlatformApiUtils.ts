export const XRPL_SENSITIVE_INPUT_KEYS = ["privateKey", "seed", "familySeed", "mnemonic"] as const;

export function assertNoSensitiveXrplInputs(payload: Record<string, unknown>) {
  const foundKey = XRPL_SENSITIVE_INPUT_KEYS.find((key) => Object.prototype.hasOwnProperty.call(payload, key));
  if (foundKey) {
    throw new Error(`Sensitive XRPL signing input is not accepted: ${foundKey}`);
  }
}

export function buildXrplApiEnvelope(data: Record<string, unknown>) {
  return {
    ok: true,
    isLiveMainnetExecutionEnabled: false,
    ...data,
  };
}