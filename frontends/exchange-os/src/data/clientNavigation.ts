export interface ClientRoute {
  path: string;
  label: string;
  description: string;
  category: string;
  clientVisible: boolean;
  demoOrder?: number;
}

export const CLIENT_NAVIGATION: ClientRoute[] = [
  // Institutional Story
  {
    path: '/troptions',
    label: 'TROPTIONS Platform',
    description: 'Institutional brand front door. What TROPTIONS is, what it stands for, and its operating philosophy.',
    category: 'Institutional Story',
    clientVisible: true,
    demoOrder: 1,
  },
  {
    path: '/exchange-os',
    label: 'Exchange OS',
    description: 'Exchange OS home: the control layer above DEXs for tokenized markets.',
    category: 'Institutional Story',
    clientVisible: true,
    demoOrder: 2,
  },
  {
    path: '/exchange-os/partner-demo',
    label: 'Partner Demo',
    description: 'What TROPTIONS provides and explicitly does not provide. First client touch point.',
    category: 'Institutional Story',
    clientVisible: true,
    demoOrder: 3,
  },

  // Proof Surfaces
  {
    path: '/exchange-os/proof-room',
    label: 'Proof Room',
    description: 'Six proof cards, GoatX anchor, token proof packet requirements, public claim rules.',
    category: 'Proof Surfaces',
    clientVisible: true,
    demoOrder: 4,
  },
  {
    path: '/system/truth',
    label: 'System Truth',
    description: 'Full honest system state: what is live, what is testnet, what is gated.',
    category: 'Proof Surfaces',
    clientVisible: true,
    demoOrder: 6,
  },
  {
    path: '/exchange-os/status',
    label: 'Exchange OS Status',
    description: 'Live route status, feature flags, and what is blocked.',
    category: 'Proof Surfaces',
    clientVisible: true,
    demoOrder: 7,
  },
  {
    path: '/exchange-os/token-proof-packet',
    label: 'Token Proof Packet',
    description: 'Full token proof packet requirements and submission process.',
    category: 'Proof Surfaces',
    clientVisible: true,
  },

  // Exchange Intelligence
  {
    path: '/exchange-os/solana-dex-map',
    label: 'Solana DEX Map',
    description: 'Solana DEX venue intelligence: Raydium, Jupiter, Orca, and open-source stack mapping.',
    category: 'Exchange Intelligence',
    clientVisible: true,
  },
  {
    path: '/exchange-os/xrpl-dex-intelligence',
    label: 'XRPL DEX Intelligence',
    description: 'XRPL DEX market map, AMM pools, and trustline tracking.',
    category: 'Exchange Intelligence',
    clientVisible: true,
  },
  {
    path: '/exchange-os/market-monitoring',
    label: 'Market Monitoring',
    description: 'Real-time DEX monitoring infrastructure and alert framework.',
    category: 'Exchange Intelligence',
    clientVisible: true,
  },
  {
    path: '/exchange-os/compare',
    label: 'DEX Comparison',
    description: 'Side-by-side comparison of DEX venues and their capabilities.',
    category: 'Exchange Intelligence',
    clientVisible: true,
  },

  // Onboarding
  {
    path: '/exchange-os/readiness',
    label: 'Partner Readiness',
    description: 'Partner onboarding pipeline: 5-level readiness matrix from demo to enterprise volume.',
    category: 'Onboarding',
    clientVisible: true,
    demoOrder: 8,
  },
  {
    path: '/exchange-os/partner-onboarding',
    label: 'Partner Onboarding',
    description: 'Step-by-step partner onboarding workflow with document checklist.',
    category: 'Onboarding',
    clientVisible: true,
  },
  {
    path: '/exchange-os/signup',
    label: 'Partner Signup',
    description: 'Partner intake form submission.',
    category: 'Onboarding',
    clientVisible: true,
  },

  // GoatX
  {
    path: '/mints',
    label: 'Mint Registry',
    description: 'Live registry of all TROPTIONS-verified SPL token mints. GoatX is the first.',
    category: 'GoatX',
    clientVisible: true,
    demoOrder: 5,
  },
  {
    path: '/exchange-os/token',
    label: 'Token Explorer',
    description: 'Individual token proof viewer with on-chain verification.',
    category: 'GoatX',
    clientVisible: true,
  },

  // Fan / Merchant Layer
  {
    path: '/exchange-os/earn',
    label: 'Earn Layer',
    description: 'Fan and merchant reward program overview.',
    category: 'Fan / Merchant Layer',
    clientVisible: true,
  },
  {
    path: '/exchange-os/sponsor',
    label: 'Sponsor Campaigns',
    description: 'Campaign builder for sponsors and brand partners.',
    category: 'Fan / Merchant Layer',
    clientVisible: true,
  },
];

export const DEMO_ORDERED_ROUTES = CLIENT_NAVIGATION
  .filter(r => r.demoOrder !== undefined)
  .sort((a, b) => (a.demoOrder ?? 99) - (b.demoOrder ?? 99));

export const ROUTES_BY_CATEGORY = CLIENT_NAVIGATION.reduce<Record<string, ClientRoute[]>>((acc, route) => {
  if (!acc[route.category]) acc[route.category] = [];
  acc[route.category].push(route);
  return acc;
}, {});
