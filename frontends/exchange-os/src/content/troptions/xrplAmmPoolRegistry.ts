export interface XrplAmmPoolRecord {
  readonly id: string;
  readonly pair: string;
  readonly poolAddress: string;
  readonly lpTokenSymbol: string;
  readonly depth: string;
  readonly feeBps: number;
  readonly status: "live-documented" | "simulation-ready";
  readonly risk: "low" | "medium" | "high";
}

export const XRPL_AMM_POOL_REGISTRY: readonly XrplAmmPoolRecord[] = [
  { id: "amm-troptions", pair: "TROPTIONS / XRP", poolAddress: "xrpl-amm-troptions-xrp", lpTokenSymbol: "LP-TROPTIONS-XRP", depth: "4.8M XRP eq", feeBps: 30, status: "simulation-ready", risk: "low" },
  { id: "amm-1", pair: "LEGACY-TOKEN / XRP", poolAddress: "xrpl-amm-legacy-xrp", lpTokenSymbol: "LP-LEGACY-XRP", depth: "2.4M XRP eq", feeBps: 30, status: "live-documented", risk: "medium" },
  { id: "amm-2", pair: "SOVBND / XRP", poolAddress: "xrpl-amm-sovbnd-xrp", lpTokenSymbol: "LP-SOVBND-XRP", depth: "1.1M XRP eq", feeBps: 35, status: "live-documented", risk: "medium" },
  { id: "amm-3", pair: "IMPERIA / XRP", poolAddress: "xrpl-amm-imperia-xrp", lpTokenSymbol: "LP-IMPERIA-XRP", depth: "790k XRP eq", feeBps: 35, status: "live-documented", risk: "medium" },
  { id: "amm-4", pair: "GEMVLT / XRP", poolAddress: "xrpl-amm-gemvlt-xrp", lpTokenSymbol: "LP-GEMVLT-XRP", depth: "510k XRP eq", feeBps: 40, status: "live-documented", risk: "high" },
  { id: "amm-5", pair: "TERRAVL / XRP", poolAddress: "xrpl-amm-terravl-xrp", lpTokenSymbol: "LP-TERRAVL-XRP", depth: "630k XRP eq", feeBps: 40, status: "live-documented", risk: "high" },
  { id: "amm-6", pair: "PETRO / XRP", poolAddress: "xrpl-amm-petro-xrp", lpTokenSymbol: "LP-PETRO-XRP", depth: "870k XRP eq", feeBps: 45, status: "live-documented", risk: "high" },
];