// Solana DEX Registry and Competitor Intelligence

export type SolanaDex = {
  id: string;
  name: string;
  category: "aggregator" | "amm" | "clmm" | "dlmm" | "orderbook" | "perps" | "launchpad" | "oracle-amm";
  chain: "solana";
  integrationPriority: "phase_1" | "phase_2" | "phase_3" | "monitor_only";
  troptionsUse: string[];
  openSourceStatus: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  notes: string;
};

export const SOLANA_DEX_REGISTRY: SolanaDex[] = [
  { id: "jupiter", name: "Jupiter", category: "aggregator", chain: "solana", integrationPriority: "phase_1", troptionsUse: ["route_quotes", "liquidity_proof", "route_intelligence"], openSourceStatus: ["open_source", "sdk_available", "api_available", "docs_available"], riskLevel: "medium", notes: "Best execution aggregator for Solana swaps." },
  { id: "meteora", name: "Meteora", category: "dlmm", chain: "solana", integrationPriority: "phase_1", troptionsUse: ["launch_readiness", "liquidity_proof", "pool_monitoring"], openSourceStatus: ["open_source", "sdk_available", "docs_available"], riskLevel: "medium", notes: "DLMM, DAMM, launch and liquidity tools." },
  { id: "raydium", name: "Raydium", category: "amm", chain: "solana", integrationPriority: "phase_1", troptionsUse: ["pool_monitoring", "liquidity_proof"], openSourceStatus: ["open_source", "sdk_available", "docs_available"], riskLevel: "medium", notes: "AMM/CLMM, launch liquidity, public SDK." },
  { id: "orca", name: "Orca Whirlpools", category: "clmm", chain: "solana", integrationPriority: "phase_1", troptionsUse: ["pool_monitoring", "liquidity_proof"], openSourceStatus: ["open_source", "sdk_available", "docs_available"], riskLevel: "medium", notes: "Concentrated liquidity AMM, open-source." },
  { id: "openbook", name: "OpenBook V2", category: "orderbook", chain: "solana", integrationPriority: "phase_2", troptionsUse: ["orderbook_depth", "risk_monitoring"], openSourceStatus: ["open_source", "sdk_available", "docs_available"], riskLevel: "medium", notes: "Central limit order book, Mango/Serum lineage." },
  { id: "phoenix", name: "Phoenix", category: "orderbook", chain: "solana", integrationPriority: "phase_2", troptionsUse: ["orderbook_depth", "risk_monitoring"], openSourceStatus: ["sdk_available", "docs_available", "verify_before_use"], riskLevel: "medium", notes: "Orderbook DEX, verify program status." },
  { id: "drift", name: "Drift", category: "perps", chain: "solana", integrationPriority: "phase_3", troptionsUse: ["market_data_only"], openSourceStatus: ["open_source", "docs_available", "verify_before_use"], riskLevel: "high", notes: "Perps/derivatives DEX, monitor only." },
  { id: "lifinity", name: "Lifinity", category: "oracle-amm", chain: "solana", integrationPriority: "phase_3", troptionsUse: ["pool_monitoring", "market_data_only"], openSourceStatus: ["open_source", "docs_available", "verify_before_use"], riskLevel: "medium", notes: "Oracle-based DEX, monitor pools/pricing." },
  { id: "saros", name: "Saros", category: "amm", chain: "solana", integrationPriority: "phase_3", troptionsUse: ["pool_monitoring", "market_data_only"], openSourceStatus: ["docs_available", "verify_before_use"], riskLevel: "medium", notes: "AMM/liquidity hub, monitor only." }
];

export type SolanaLaunchpadCompetitor = {
  id: string;
  name: string;
  notes: string;
};

export const SOLANA_LAUNCHPAD_COMPETITORS: SolanaLaunchpadCompetitor[] = [
  { id: "pumpfun", name: "Pump.fun", notes: "Competitor/market research only. No fake volume or hype tools." },
  { id: "bonkfun", name: "Bonk.fun", notes: "Competitor/market research only." },
  { id: "moonshot", name: "Moonshot", notes: "Competitor/market research only." },
  { id: "bagsfm", name: "Bags.fm", notes: "Competitor/market research only." },
  { id: "launchlab", name: "LaunchLab", notes: "Competitor/market research only." },
  { id: "smithii", name: "Smithii", notes: "Competitor/market research only." },
  { id: "dxsale", name: "DXSale", notes: "Competitor/market research only." },
  { id: "pinksale", name: "PinkSale", notes: "Competitor/market research only." }
];

export type SolanaOpenSourceStack = {
  id: string;
  name: string;
  purpose: string;
  useCaseInTroptions: string;
  installPackage: string | null;
  licenseNotes: string;
  securityNotes: string;
};

export const SOLANA_OPEN_SOURCE_STACK: SolanaOpenSourceStack[] = [
  { id: "anchor", name: "Anchor", purpose: "Solana smart contract framework.", useCaseInTroptions: "Program analysis, proof, and integration.", installPackage: "@coral-xyz/anchor", licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "token-2022", name: "Solana Token Extensions / Token-2022", purpose: "Advanced SPL token features.", useCaseInTroptions: "Token compliance, proof, and metadata.", installPackage: null, licenseNotes: "verify", securityNotes: "Review extension status." },
  { id: "metaplex", name: "Metaplex Token Metadata", purpose: "Token/NFT metadata standard.", useCaseInTroptions: "Token identity and proof.", installPackage: "@metaplex-foundation/js", licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "jupiter", name: "Jupiter API/SDK", purpose: "Swap routing and quotes.", useCaseInTroptions: "Route intelligence, best execution.", installPackage: "@jup-ag/core", licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "meteora", name: "Meteora DLMM SDK", purpose: "DLMM liquidity and launch tools.", useCaseInTroptions: "Liquidity readiness, pool monitoring.", installPackage: null, licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "raydium", name: "Raydium SDK", purpose: "AMM/CLMM pool monitoring.", useCaseInTroptions: "Liquidity proof, pool monitoring.", installPackage: "@raydium-io/raydium-sdk", licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "orca", name: "Orca Whirlpools", purpose: "CLMM pool monitoring.", useCaseInTroptions: "Liquidity proof, pool monitoring.", installPackage: "@orca-so/whirlpools-sdk", licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "openbook", name: "OpenBook V2", purpose: "Orderbook market intelligence.", useCaseInTroptions: "Orderbook depth, risk monitoring.", installPackage: null, licenseNotes: "verify", securityNotes: "Review before production use." },
  { id: "drift", name: "Drift Protocol SDK/docs", purpose: "Perps/derivatives market data.", useCaseInTroptions: "Market data only.", installPackage: null, licenseNotes: "verify", securityNotes: "Monitor only." },
  { id: "pyth", name: "Pyth price feeds", purpose: "On-chain price oracles.", useCaseInTroptions: "Oracle pricing, proof packets.", installPackage: "@pythnetwork/client", licenseNotes: "verify", securityNotes: "Review before production use." }
];
