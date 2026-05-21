export interface StablecoinIssuerRecord {
  symbol: "USDC" | "USDT" | "DAI" | "EURC" | "PYUSD" | "USDP" | "PAXG" | "TRU-UNIT" | "TRU-GOLD" | "TRU-TREASURY";
  issuer: string;
  chainSupport: readonly string[];
  chainSupportNote: string;
  useCases: readonly string[];
  riskControls: readonly string[];
  defaultInstitutionalRoute: boolean;
}

export const STABLECOIN_ISSUER_REGISTRY: readonly StablecoinIssuerRecord[] = [
  {
    symbol: "USDC",
    issuer: "Circle",
    chainSupport: ["Solana", "Ethereum", "Base", "Arbitrum", "Polygon", "Avalanche", "Optimism"],
    chainSupportNote: "Chain list is configurable and non-exhaustive.",
    useCases: ["USD deal settlement", "x402 payment rail", "RWA deal funding", "Institutional payment default"],
    riskControls: ["Issuer approval", "Provider approval", "Jurisdiction approval"],
    defaultInstitutionalRoute: true,
  },
  {
    symbol: "USDT",
    issuer: "Tether",
    chainSupport: ["TRON", "Ethereum", "Solana"],
    chainSupportNote: "Chain list is configurable and non-exhaustive.",
    useCases: ["High-volume USD liquidity", "Cross-chain settlement", "Deep-liquidity deal funding"],
    riskControls: ["Reserve transparency review", "Freeze and sanctions awareness", "Illicit-finance monitoring"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "DAI",
    issuer: "MakerDAO / Sky Protocol",
    chainSupport: ["Ethereum", "XRPL", "Stellar"],
    chainSupportNote: "DAI issued as XRPL + Stellar IOU from TROPTIONS Gateway (2026-04-28). AAVE v3 native collateral.",
    useCases: ["AAVE v3 collateral", "aDAI yield generation", "Deal settlement", "DeFi-native proof workflow"],
    riskControls: ["Issuer verification", "Reserve audit", "Redemption path confirmation", "AAVE pool smart contract risk"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "EURC",
    issuer: "Circle Internet Financial, LLC",
    chainSupport: ["Ethereum", "XRPL", "Stellar"],
    chainSupportNote: "EURC issued as XRPL + Stellar IOU from TROPTIONS Gateway (2026-04-28). EUR-denominated cross-border settlement.",
    useCases: ["EUR-denominated settlement", "Cross-border deal closing", "FX risk mitigation"],
    riskControls: ["Issuer verification", "Reserve audit", "Jurisdiction compliance review", "EUR redemption confirmation"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "PYUSD",
    issuer: "Paxos / PayPal route",
    chainSupport: ["Ethereum", "Solana"],
    chainSupportNote: "Configurable support based on provider enablement.",
    useCases: ["PayPal-linked payment rail", "Institutional USD payments", "Consumer-to-business settlement"],
    riskControls: ["Provider approval", "Jurisdiction review"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "USDP",
    issuer: "Paxos",
    chainSupport: ["Ethereum"],
    chainSupportNote: "Configurable support based on issuer/provider status.",
    useCases: ["Regulated dollar treasury reserve", "Treasury-grade USD reserve", "Compliance-first deal funding"],
    riskControls: ["Provider approval", "Chain support review", "Jurisdiction review"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "PAXG",
    issuer: "Paxos",
    chainSupport: ["Ethereum"],
    chainSupportNote: "Configurable support based on provider status.",
    useCases: ["Gold-linked reference", "Reserve and proof comparison"],
    riskControls: ["Custody review", "Redemption policy review", "Commodity classification review"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "TRU-UNIT",
    issuer: "Troptions internal accounting",
    chainSupport: ["Internal ledger"],
    chainSupportNote: "Internal accounting unit for simulation and reporting only.",
    useCases: ["Internal accounting", "Scenario simulation"],
    riskControls: ["No public issuance", "Policy gate required"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "TRU-GOLD",
    issuer: "Troptions internal accounting",
    chainSupport: ["Internal ledger"],
    chainSupportNote: "Gold-linked internal accounting reference for simulations.",
    useCases: ["Gold-linked scenario modeling", "Internal reporting"],
    riskControls: ["No reserve claim without evidence", "No redemption function"],
    defaultInstitutionalRoute: false,
  },
  {
    symbol: "TRU-TREASURY",
    issuer: "Troptions internal accounting",
    chainSupport: ["Internal ledger"],
    chainSupportNote: "Treasury-linked internal unit for evaluation workflows.",
    useCases: ["Treasury scenario analysis", "Internal exposure tracking"],
    riskControls: ["No live transfer", "No external market representation"],
    defaultInstitutionalRoute: false,
  },
];
