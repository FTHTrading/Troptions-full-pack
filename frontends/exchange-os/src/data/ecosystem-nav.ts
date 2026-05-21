// UNYKORN / TROPTIONS Ecosystem Navigation
// Single source of truth — import this into footers and nav menus across all sites

export interface EcosystemSite {
  id: string;
  name: string;
  tagline: string;
  url: string;
  category: 'exchange' | 'launch' | 'guest_os' | 'token' | 'portfolio' | 'live';
  status: 'live' | 'testnet' | 'preview';
}

export const ECOSYSTEM_SITES: EcosystemSite[] = [
  {
    id: 'exchange-os',
    name: 'TROPTIONS Exchange OS',
    tagline: 'Institutional launch, proof, liquidity, compliance',
    url: 'https://troptionsexchange.unykorn.org/exchange-os',
    category: 'exchange',
    status: 'live',
  },
  {
    id: 'troptions-main',
    name: 'TROPTIONS',
    tagline: 'The Trade Currency of the Real Economy',
    url: 'https://troptions.unykorn.org/troptions',
    category: 'live',
    status: 'live',
  },
  {
    id: 'troptions-live',
    name: 'TROPTIONS Live',
    tagline: 'Event network, sponsors, venues, merchant drops',
    url: 'https://troptionslive.unykorn.org/sports',
    category: 'live',
    status: 'live',
  },
  {
    id: 'launch',
    name: 'DONK AI Launch',
    tagline: 'Fan memories, merchant campaigns, Solana minting',
    url: 'https://launch.unykorn.org',
    category: 'launch',
    status: 'live',
  },
  {
    id: 'goatx',
    name: 'GoatX',
    tagline: 'SPL token · Mainnet live · NFT yield vault',
    url: 'https://goat.unykorn.org',
    category: 'token',
    status: 'live',
  },
  {
    id: 'whichway',
    name: 'WhichWay.live / WWAI',
    tagline: 'AI multilingual guest OS for events and venues',
    url: 'https://whichway.live',
    category: 'guest_os',
    status: 'live',
  },
  {
    id: 'whichway-fifa',
    name: 'WWAI (fifa.unykorn.org)',
    tagline: 'Alternate host for WWAI Guest OS',
    url: 'https://fifa.unykorn.org',
    category: 'guest_os',
    status: 'live',
  },
  {
    id: 'portfolio',
    name: 'UNYKORN Portfolio',
    tagline: 'UNYKORN system book and proof registry',
    url: 'https://portfolio.unykorn.org',
    category: 'portfolio',
    status: 'live',
  },
  {
    id: 'mint-registry',
    name: 'Mint Registry',
    tagline: 'All confirmed Solana mainnet mints',
    url: 'https://launch.unykorn.org/mints',
    category: 'launch',
    status: 'live',
  },
  {
    id: 'system-truth',
    name: 'System Truth',
    tagline: 'What is real, what is testnet, what is preview',
    url: 'https://launch.unykorn.org/system/truth',
    category: 'launch',
    status: 'live',
  },
  {
    id: 'control-center',
    name: 'Exchange Control Center',
    tagline: 'Exchange OS institutional control layer',
    url: 'https://troptionsexchange.unykorn.org/exchange-os/control-center',
    category: 'exchange',
    status: 'live',
  },
];

export const ECOSYSTEM_FOOTER_LINKS = [
  {
    section: 'Exchange OS',
    links: [
      { label: 'Exchange OS Home',  url: 'https://troptionsexchange.unykorn.org/exchange-os' },
      { label: 'Control Center',    url: 'https://troptionsexchange.unykorn.org/exchange-os/control-center' },
      { label: 'Readiness',         url: 'https://troptionsexchange.unykorn.org/exchange-os/readiness' },
      { label: 'Solana DEX Map',    url: 'https://troptionsexchange.unykorn.org/exchange-os/solana-dex-map' },
      { label: 'Compare',           url: 'https://troptionsexchange.unykorn.org/exchange-os/compare' },
      { label: 'Status',            url: 'https://troptionsexchange.unykorn.org/exchange-os/status' },
    ],
  },
  {
    section: 'AI & x402',
    links: [
      { label: 'x402 Intelligence',  url: '/x402' },
      { label: 'x402 Catalog',       url: '/x402/catalog' },
      { label: 'Agent Finder',       url: '/agents/finder' },
      { label: 'Agent Registry',     url: '/agents' },
      { label: 'RAG Status',         url: '/api/rag/index-status' },
      { label: 'Insights',           url: '/insights' },
    ],
  },
  {
    section: 'Proof & Status',
    links: [
      { label: 'Proof Room',       url: 'https://troptionsexchange.unykorn.org/exchange-os/proof-room' },
      { label: 'System Truth',     url: 'https://launch.unykorn.org/system/truth' },
      { label: 'Mint Registry',    url: 'https://launch.unykorn.org/mints' },
      { label: 'Partner Demo',     url: 'https://troptionsexchange.unykorn.org/exchange-os/partner-demo' },
      { label: 'MCP Policy',       url: '/api/mcp/policy' },
    ],
  },
  {
    section: 'Launch & Mint',
    links: [
      { label: 'DONK AI Launcher',    url: 'https://launch.unykorn.org' },
      { label: 'Mint Registry',       url: 'https://launch.unykorn.org/mints' },
      { label: 'Fan Memory Builder',  url: 'https://launch.unykorn.org/#builder' },
      { label: 'Merchant Campaigns',  url: 'https://launch.unykorn.org/sports/merchant' },
      { label: 'System Truth',        url: 'https://launch.unykorn.org/system/truth' },
    ],
  },
  {
    section: 'TROPTIONS Network',
    links: [
      { label: 'TROPTIONS',          url: 'https://troptions.unykorn.org/troptions' },
      { label: 'TROPTIONS Live',     url: 'https://troptionslive.unykorn.org/sports' },
      { label: 'GoatX',             url: 'https://goat.unykorn.org' },
      { label: 'WhichWay.live',     url: 'https://whichway.live' },
      { label: 'WWAI (fifa host)',  url: 'https://fifa.unykorn.org' },
      { label: 'UNYKORN Portfolio', url: 'https://portfolio.unykorn.org' },
    ],
  },
  {
    section: 'Bryan Stone Verticals',
    links: [
      { label: 'TROPTIONS.IO',              url: 'https://troptions.unykorn.org/troptions' },
      { label: 'TROPTIONSXCHANGE',          url: 'https://troptions.unykorn.org/troptions/xchange' },
      { label: 'TROPTIONS University',      url: 'https://troptions.unykorn.org/troptions/university' },
      { label: 'TROPTIONS Television',      url: 'https://troptions.unykorn.org/troptions/media' },
      { label: 'Real Estate Connections',   url: 'https://troptions.unykorn.org/troptions/real-estate' },
      { label: 'Green-N-Go Solar',          url: 'https://troptions.unykorn.org/troptions/solar' },
      { label: 'HOTRCW',                    url: 'https://troptions.unykorn.org/troptions/hotrcw' },
    ],
  },
];

export { BRANDED_DOMAINS } from './troptions-branded-domains';
