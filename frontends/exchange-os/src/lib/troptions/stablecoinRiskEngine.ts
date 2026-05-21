import { STABLECOIN_ISSUER_REGISTRY } from "@/content/troptions/stablecoinIssuerRegistry";

export function buildStablecoinSummary() {
  return {
    stablecoins: STABLECOIN_ISSUER_REGISTRY,
    defaultInstitutionalRoutes: STABLECOIN_ISSUER_REGISTRY.filter((item) => item.defaultInstitutionalRoute).map((item) => item.symbol),
  };
}

export function evaluateStablecoinRisk(symbol: string) {
  const record = STABLECOIN_ISSUER_REGISTRY.find((item) => item.symbol === symbol);
  if (!record) {
    return {
      ok: false,
      simulationOnly: true,
      blockedReasons: ["Unknown stablecoin symbol"],
    };
  }

  return {
    ok: false,
    simulationOnly: true,
    blockedReasons: ["Provider approval required", "Jurisdiction approval required"],
    riskProfile: {
      symbol: record.symbol,
      issuer: record.issuer,
      controls: record.riskControls,
    },
  };
}
