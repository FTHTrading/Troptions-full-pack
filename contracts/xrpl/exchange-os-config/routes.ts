// TROPTIONS Exchange OS — Route Definitions

export interface NavRoute {
  href: string;
  label: string;
  icon: string;
  description: string;
  badge?: string;
}

export const PRIMARY_NAV: NavRoute[] = [
  { href: "/exchange-os", label: "Home", icon: "home", description: "TROPTIONS Live DEX" },
  { href: "/exchange-os/trade", label: "Trade", icon: "chart-candlestick", description: "XRPL swap, order book, AMM" },
  { href: "/exchange-os/tokens", label: "Markets", icon: "list", description: "Live token screener" },
  { href: "/exchange-os/launch", label: "Launch", icon: "rocket", description: "Token launchpad with proof" },
  { href: "/exchange-os/earn", label: "Liquidity", icon: "coins", description: "AMM pools, LP positions, depth" },
  { href: "/exchange-os/x402", label: "Intelligence", icon: "zap", description: "x402 paid reports and APIs", badge: "x402" },
  { href: "/exchange-os/wallet", label: "Wallet", icon: "wallet", description: "Wallet analytics and holdings" },
  { href: "/exchange-os/batch", label: "Batch", icon: "zap", description: "XRPL batch monetization scenarios", badge: "6" },
] as const;

export const SECONDARY_NAV: NavRoute[] = [
  { href: "/exchange-os/creator", label: "Proof", icon: "code", description: "Issuer verification and proof packets" },
  { href: "/exchange-os/sponsor", label: "Sponsor", icon: "megaphone", description: "Sponsor campaign builder" },
  { href: "/exchange-os/pay", label: "FTH Pay", icon: "send", description: "Genesis Wallet · Send · Mint · Multi-chain" },
  { href: "/exchange-os/solana", label: "Solana", icon: "diamond", description: "Deploy SPL tokens on Solana" },
  { href: "/exchange-os/admin", label: "Admin", icon: "settings", description: "Operator dashboard" },
  { href: "/exchange-os/deck", label: "Sales Deck", icon: "presentation", description: "10-slide TROPTIONS pitch deck" },
] as const;

export const MOBILE_NAV: NavRoute[] = [
  { href: "/exchange-os", label: "Home", icon: "home", description: "Home" },
  { href: "/exchange-os/trade", label: "Trade", icon: "chart-candlestick", description: "Trade" },
  { href: "/exchange-os/tokens", label: "Markets", icon: "list", description: "Markets" },
  { href: "/exchange-os/launch", label: "Launch", icon: "rocket", description: "Launch" },
  { href: "/exchange-os/earn", label: "Liquidity", icon: "coins", description: "Liquidity" },
  { href: "/exchange-os/wallet", label: "Wallet", icon: "wallet", description: "Wallet" },
] as const;
