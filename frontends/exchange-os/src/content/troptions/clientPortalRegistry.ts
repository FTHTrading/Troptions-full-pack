export const TROPTIONS_PORTAL_COMPLIANCE_NOTICE =
  "Troptions provides institutional operating infrastructure. Broker-dealer, custody, banking, exchange, SBLC, POF, stablecoin, RWA, and trading workflows are subject to provider approval, legal review, licensing review, KYC/KYB, AML, sanctions screening, jurisdiction controls, risk approval, and board authorization.";

export interface PortalRouteItem {
  route: string;
  label: string;
  moduleKey: string;
  dryRunOnly: boolean;
  requiresBoardApproval: boolean;
}

export const CLIENT_PORTAL_ROUTES: PortalRouteItem[] = [
  { route: "/portal/troptions", label: "Portal Home", moduleKey: "dashboard", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/dashboard", label: "Dashboard", moduleKey: "dashboard", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/onboarding", label: "Onboarding", moduleKey: "onboarding", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/profile", label: "Profile", moduleKey: "profile", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/entities", label: "Entities", moduleKey: "entities", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/kyc", label: "KYC", moduleKey: "kyc", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/kyb", label: "KYB", moduleKey: "kyb", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/documents", label: "Documents", moduleKey: "documents", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/proof-of-funds", label: "Proof of Funds", moduleKey: "pof", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/sblc", label: "SBLC", moduleKey: "sblc", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/rwa", label: "RWA", moduleKey: "rwa", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/assets", label: "Assets", moduleKey: "assets", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/vaults", label: "Vaults", moduleKey: "vaults", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/custody", label: "Custody", moduleKey: "custody", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/banking", label: "Banking", moduleKey: "banking", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/stablecoins", label: "Stablecoins", moduleKey: "stablecoins", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/xrpl", label: "XRPL", moduleKey: "xrpl", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/xrpl/accounts", label: "XRPL Accounts", moduleKey: "xrpl-accounts", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/xrpl/trustlines", label: "XRPL Trustlines", moduleKey: "xrpl-trustlines", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/xrpl/amm", label: "XRPL AMM", moduleKey: "xrpl-amm", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/xrpl/dex", label: "XRPL DEX", moduleKey: "xrpl-dex", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/xrpl/conversions", label: "XRPL Conversions", moduleKey: "xrpl-conversions", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/exchange-routing", label: "Exchange Routing", moduleKey: "exchange-routing", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/trading", label: "Trading", moduleKey: "trading", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/trading/algorithmic", label: "Algorithmic Trading", moduleKey: "algorithmic-trading", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/trading/simulation", label: "Trading Simulation", moduleKey: "trading-simulation", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/settlement", label: "Settlement", moduleKey: "settlement", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/portal/troptions/reports", label: "Reports", moduleKey: "reports", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/portal/troptions/support", label: "Support", moduleKey: "support", dryRunOnly: true, requiresBoardApproval: false },
];

export const ADMIN_PORTAL_ROUTES: PortalRouteItem[] = [
  { route: "/admin/troptions/client-portal", label: "Client Portal Ops", moduleKey: "client-portal", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/clients", label: "Clients", moduleKey: "clients", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/entities", label: "Entities", moduleKey: "entities", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/broker-dealer", label: "Broker-Dealer", moduleKey: "broker-dealer", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/sblc", label: "SBLC Operations", moduleKey: "sblc", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/pof", label: "Proof of Funds Ops", moduleKey: "pof", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/rwa-operations", label: "RWA Operations", moduleKey: "rwa-operations", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/banking-rails", label: "Banking Rails", moduleKey: "banking-rails", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/stablecoin-rails", label: "Stablecoin Rails", moduleKey: "stablecoin-rails", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/xrpl", label: "XRPL Ops", moduleKey: "xrpl", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/xrpl/accounts", label: "XRPL Accounts", moduleKey: "xrpl-accounts", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/xrpl/ledger-monitor", label: "XRPL Ledger Monitor", moduleKey: "xrpl-ledger", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/xrpl/trustlines", label: "XRPL Trustlines", moduleKey: "xrpl-trustlines", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/xrpl/amm", label: "XRPL AMM", moduleKey: "xrpl-amm", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/xrpl/dex", label: "XRPL DEX", moduleKey: "xrpl-dex", dryRunOnly: true, requiresBoardApproval: false },
  { route: "/admin/troptions/xrpl/conversions", label: "XRPL Conversions", moduleKey: "xrpl-conversions", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/exchange-routing", label: "Exchange Routing", moduleKey: "exchange-routing", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/trading", label: "Trading", moduleKey: "trading", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/trading/algorithmic", label: "Algorithmic Trading", moduleKey: "algorithmic-trading", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/trading/risk", label: "Trading Risk", moduleKey: "trading-risk", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/settlement-ops", label: "Settlement Ops", moduleKey: "settlement-ops", dryRunOnly: true, requiresBoardApproval: true },
  { route: "/admin/troptions/global-rails", label: "Global Rails", moduleKey: "global-rails", dryRunOnly: true, requiresBoardApproval: true },
];
