export interface SolanaRailCapability {
  id: string;
  capability: string;
  mode: "simulation-only";
  description: string;
}

export const SOLANA_RAIL_CAPABILITIES: readonly SolanaRailCapability[] = [
  { id: "sol-pay", capability: "Solana Pay simulation", mode: "simulation-only", description: "Encode payment-intent requests as links or QR simulation payloads." },
  { id: "sol-usdc-intent", capability: "USDC payment-intent simulation", mode: "simulation-only", description: "Institutional invoice and payment-intent simulation for USDC workflows." },
  { id: "sol-token-ext", capability: "Token extension readiness", mode: "simulation-only", description: "Readiness controls for token extensions including transfer hooks and confidential transfers." },
  { id: "sol-transfer-hook", capability: "Transfer hook readiness", mode: "simulation-only", description: "Policy logic simulation for transfer hook controls." },
  { id: "sol-confidential", capability: "Confidential transfer readiness", mode: "simulation-only", description: "Readiness notes for privacy-preserving transfer designs under compliance constraints." },
  { id: "sol-x402", capability: "x402 payment readiness", mode: "simulation-only", description: "Machine-payable API simulation support over Solana-aligned payment rails." },
  { id: "sol-impact", capability: "Impact funding rail simulation", mode: "simulation-only", description: "Public-benefit disbursement simulation and reporting workflows." },
  { id: "sol-benefit", capability: "Public benefit disbursement simulation", mode: "simulation-only", description: "Simulation-only disbursement planning with recipient verification controls." },
];
