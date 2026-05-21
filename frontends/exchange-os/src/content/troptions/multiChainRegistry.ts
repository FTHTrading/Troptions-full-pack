export type ChainId = "solana" | "tron" | "xrpl" | "evm-trex";

export interface MultiChainRecord {
  chainId: ChainId;
  displayName: string;
  role: string;
  supportMode: "simulation-only" | "monitoring-only" | "readiness-only";
  strengths: readonly string[];
  blockedByDefault: readonly string[];
}

export const MULTI_CHAIN_REGISTRY: readonly MultiChainRecord[] = [
  {
    chainId: "solana",
    displayName: "Solana",
    role: "High-throughput payment and stablecoin route simulation",
    supportMode: "simulation-only",
    strengths: ["Solana Pay requests", "USDC payment simulation", "Token-extension readiness", "x402 micro-payment readiness"],
    blockedByDefault: ["Live settlement execution", "Live custody movement", "Live token issuance"],
  },
  {
    chainId: "tron",
    displayName: "TRON",
    role: "USDT route monitoring and risk-scored settlement evaluation",
    supportMode: "monitoring-only",
    strengths: ["USDT route monitoring", "Wallet risk scoring", "Freeze-status awareness", "Jurisdiction risk controls"],
    blockedByDefault: ["Default institutional rail designation", "Live transfer execution"],
  },
  {
    chainId: "xrpl",
    displayName: "XRPL",
    role: "AMM/DEX and route simulation layer",
    supportMode: "simulation-only",
    strengths: ["Route simulation", "Conversion simulation", "AMM and DEX analysis"],
    blockedByDefault: ["Live transaction signing", "Production liquidity routing"],
  },
  {
    chainId: "evm-trex",
    displayName: "EVM / T-REX / ERC-3643",
    role: "Permissioned tokenized-asset readiness",
    supportMode: "readiness-only",
    strengths: ["Identity and eligibility gates", "Transfer restrictions", "Issuer controls"],
    blockedByDefault: ["Live securities issuance", "Production redemption flows"],
  },
];
