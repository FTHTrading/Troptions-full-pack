export type SystemStatus =
  | 'live'
  | 'tunnel_down'
  | 'dev_only'
  | 'minted'
  | 'stub'
  | 'pending';

export interface MintedSystem {
  id: string;
  name: string;
  namespace: string;
  url: string;
  internalUrl?: string;
  port?: number;
  category:
    | 'ai_core'
    | 'ai_agents'
    | 'campaign_layer'
    | 'guest_experience'
    | 'blockchain'
    | 'payment'
    | 'communication'
    | 'admin';
  deployTarget:
    | 'cloudflare_pages'
    | 'vercel'
    | 'cloudflare_worker'
    | 'cloudflare_tunnel'
    | 'local'
    | 'docker';
  solanaMintStatus: 'minted' | 'devnet_stub' | 'pending' | 'not_applicable';
  mintAddress?: string;
  network?: 'mainnet-beta' | 'devnet';
  liveStatus: SystemStatus;
  description: string;
  repo: string;
  lastVerified?: string;
}

export const MINTED_SYSTEMS: MintedSystem[] = [
  // ── Live deployments ───────────────────────────────────────────────────────
  {
    id: 'troptions-launch',
    name: 'TROPTIONS Campaign Launcher',
    namespace: 'troptions',
    url: 'https://launch.unykorn.org',
    deployTarget: 'vercel',
    solanaMintStatus: 'pending',
    liveStatus: 'live',
    category: 'campaign_layer',
    description:
      'DONK AI campaign launcher — merchant namespaces, QR campaigns, fan tributes, NFT coupons, VIP passes',
    repo: 'FTHTrading/solana-launcher',
    lastVerified: '2026-05-15',
  },
  {
    id: 'troptions-exchange',
    name: 'TROPTIONS Exchange OS',
    namespace: 'troptions-exchange',
    url: 'https://troptions.unykorn.org',
    deployTarget: 'cloudflare_worker',
    solanaMintStatus: 'pending',
    liveStatus: 'live',
    category: 'blockchain',
    description:
      'TROPTIONS Exchange OS — XRPL, Solana, x402 payment rails',
    repo: 'kevanbtc/troptions',
    lastVerified: '2026-05-15',
  },
  {
    id: 'whichway-fifa',
    name: 'WhichWay.live / WWAI Guest OS',
    namespace: 'wwai',
    url: 'https://fifa.unykorn.org',
    deployTarget: 'vercel',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'guest_experience',
    description:
      'WhichWay.live fan/guest event-city OS — AI wayfinding, merchant discovery, QR offers',
    repo: 'kevanbtc/fifa-troptions',
    lastVerified: '2026-05-15',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw Gateway',
    namespace: 'openclaw',
    url: 'http://127.0.0.1:18789',
    internalUrl: 'http://127.0.0.1:18789',
    port: 18789,
    deployTarget: 'local',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'ai_core',
    description: 'OpenClaw AI agent orchestrator — Ollama/gemma4 backend',
    repo: 'local',
    lastVerified: '2026-05-15',
  },
  {
    id: 'ollama',
    name: 'Ollama Local LLM',
    namespace: 'ollama',
    url: 'http://127.0.0.1:11434',
    port: 11434,
    deployTarget: 'local',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'ai_core',
    description: 'Local LLM server — gemma4:latest',
    repo: 'local',
    lastVerified: '2026-05-15',
  },
  {
    id: 'openwebui',
    name: 'Open WebUI',
    namespace: 'openwebui',
    url: 'http://127.0.0.1:3000',
    port: 3000,
    deployTarget: 'docker',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'ai_core',
    description: 'Chat UI for local Ollama',
    repo: 'docker:open-webui',
    lastVerified: '2026-05-15',
  },
  {
    id: 'jefe-x402',
    name: 'JEFE x402 Gateway',
    namespace: 'jefe',
    url: 'http://127.0.0.1:8402',
    port: 8402,
    deployTarget: 'local',
    solanaMintStatus: 'pending',
    liveStatus: 'live',
    category: 'payment',
    description: 'JEFE kernel — x402 credit gateway, ATP settlement',
    repo: 'kevanbtc/UnyKorn-X402-aws',
    lastVerified: '2026-05-15',
  },
  {
    id: 'apostle-shim',
    name: 'Apostle Chain Dev Shim',
    namespace: 'apostle',
    url: 'http://127.0.0.1:7332',
    port: 7332,
    deployTarget: 'local',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'blockchain',
    description: 'Apostle chain ATP settlement dev shim (chain 7332)',
    repo: 'kevanbtc/apostle-7332-shim',
    lastVerified: '2026-05-15',
  },
  {
    id: 'sovereign-ai',
    name: 'Sovereign AI Backend',
    namespace: 'sovereign',
    url: 'http://127.0.0.1:8999',
    port: 8999,
    deployTarget: 'local',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'ai_core',
    description: 'Sovereign AI FastAPI backend',
    repo: 'kevanbtc/sovereign-ai',
    lastVerified: '2026-05-15',
  },
  {
    id: 'portfolio-unykorn',
    name: 'UNYKORN Portfolio',
    namespace: 'portfolio',
    url: 'https://portfolio.unykorn.org',
    deployTarget: 'cloudflare_pages',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'admin',
    description: 'UNYKORN portfolio and system book',
    repo: 'kevanbtc/portfolio-unykorn',
    lastVerified: '2026-05-15',
  },

  // ── GoatX SPL Token — LIVE ─────────────────────────────────────────────────
  {
    id: 'goatx',
    name: 'GoatX ($GOATX)',
    namespace: 'goat',
    url: 'https://goat.unykorn.org',
    internalUrl: 'http://127.0.0.1:8850',
    port: 8850,
    deployTarget: 'cloudflare_tunnel',
    solanaMintStatus: 'minted',
    mintAddress: '9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
    network: 'mainnet-beta',
    liveStatus: 'live',
    category: 'blockchain',
    description:
      'GoatX SPL token — 1B fixed supply, mint/freeze revoked, NFT yield vault, AI agents, Genesis Wallet integration. Launched May 12, 2026 via Donk X launcher.',
    repo: 'kevanbtc/goat-site',
    lastVerified: '2026-05-15',
  },
  {
    id: 'goatx-market-maker',
    name: 'GoatX Market Maker Agent',
    namespace: 'goatx-market-maker',
    url: 'http://127.0.0.1:7332/agents/market-maker',
    port: 7332,
    category: 'ai_agents',
    deployTarget: 'local',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    description:
      'AI market making agent on Apostle chain-7332. Keeps buy/sell spread tight on GoatX.',
    repo: 'kevanbtc/goat-site',
    lastVerified: '2026-05-15',
  },
  {
    id: 'finn-family-agent',
    name: 'Finn Family Agent',
    namespace: 'finn',
    url: 'http://127.0.0.1:8999',
    port: 8999,
    category: 'ai_agents',
    deployTarget: 'local',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    description:
      'Finn AI family agent — manages GoatX Kids wallets, daily spending limits, family controls. Runs on sovereign-local.',
    repo: 'kevanbtc/sovereign-ai',
    lastVerified: '2026-05-15',
  },

  // ── Cloudflare tunnels currently running ───────────────────────────────────
  {
    id: 'junior-tilden',
    name: 'Junior / Tilden OS',
    namespace: 'junior',
    url: 'https://junior.unykorn.org',
    port: 4099,
    deployTarget: 'cloudflare_tunnel',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'ai_core',
    description:
      'Junior AI node (3 active ATL connections) — tilden.unykorn.org, jr.unykorn.org, junior.unykorn.org → :4099; tilden-api → :4001',
    repo: 'kevanbtc/junior-tilden',
    lastVerified: '2026-05-15',
  },
  {
    id: 'unykorn-x402',
    name: 'UNYKORN x402 Gateway',
    namespace: 'x402',
    url: 'https://x402-origin.unykorn.org',
    port: 4020,
    deployTarget: 'cloudflare_tunnel',
    solanaMintStatus: 'not_applicable',
    liveStatus: 'live',
    category: 'payment',
    description:
      'x402 payment gateway (8 active CF connections) — x402-origin.unykorn.org → :4020, needai/ada → :3000',
    repo: 'kevanbtc/UnyKorn-X402-aws',
    lastVerified: '2026-05-15',
  },

  // ── Pending / dev-only ─────────────────────────────────────────────────────
  {
    id: 'needai',
    name: 'NeedAI Platform',
    namespace: 'needai',
    url: 'https://needai.com',
    deployTarget: 'vercel',
    solanaMintStatus: 'pending',
    liveStatus: 'dev_only',
    category: 'communication',
    description:
      'NeedAI — Telnyx phone, Telegram, x402, Moltbook, TROPTIONS intake layer',
    repo: 'kevanbtc/needai',
    lastVerified: '2026-05-15',
  },
];

export function getSystemByNamespace(ns: string): MintedSystem | undefined {
  return MINTED_SYSTEMS.find((s) => s.namespace === ns);
}

export function getSystemsByStatus(status: SystemStatus): MintedSystem[] {
  return MINTED_SYSTEMS.filter((s) => s.liveStatus === status);
}

export function getSystemsByCategory(
  category: MintedSystem['category']
): MintedSystem[] {
  return MINTED_SYSTEMS.filter((s) => s.category === category);
}
