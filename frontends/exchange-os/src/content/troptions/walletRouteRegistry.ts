export interface WalletRouteDefinition {
  readonly path: string;
  readonly label: string;
  readonly description: string;
  readonly audience: "member" | "admin" | "shared";
  readonly simulationOnly: boolean;
}

export const MEMBER_WALLET_ROUTES: readonly WalletRouteDefinition[] = [
  {
    path: "/join-troptions",
    label: "Join Troptions",
    description: "Public entry page for simulation-first Genesis Wallet onboarding.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/join-troptions/invite",
    label: "Verify Invite",
    description: "Confirms invite handle requirements before wallet creation.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/join-troptions/create-wallet",
    label: "Create Wallet",
    description: "Simulation-only wallet creation flow gated by invite context.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/join-troptions/success",
    label: "Creation Success",
    description: "Post-onboarding confirmation and next steps.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/join-troptions/qr",
    label: "Wallet QR",
    description: "Displays a simulation QR profile for internal-ledger receipt flows.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/dashboard",
    label: "Wallet Dashboard",
    description: "Primary wallet overview for balances, risk, card preview, and action routing.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/receive",
    label: "Receive Funds",
    description: "Shows wallet receipt instructions and simulation deposit details.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/send",
    label: "Send Funds",
    description: "Dry-run send workflow. No chain signing or live settlement.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/convert",
    label: "Convert",
    description: "Stablecoin conversion preview with provider approvals still required.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/funding-request",
    label: "Funding Request",
    description: "Request-only funding workflow with compliance and custody blockers.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/history",
    label: "History",
    description: "Transaction history view for simulation-only activity records.",
    audience: "member",
    simulationOnly: true,
  },
  {
    path: "/portal/troptions/wallet/x402",
    label: "x402",
    description: "Readiness-only x402 payment intent screen with no live ATP settlement.",
    audience: "member",
    simulationOnly: true,
  },
];

export const ADMIN_WALLET_ROUTES: readonly WalletRouteDefinition[] = [
  {
    path: "/admin/troptions/wallets",
    label: "Wallet Control Tower",
    description: "Board-level wallet command center with operational status and route coverage.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/users",
    label: "Wallet Users",
    description: "Wallet-user review desk with KYC, sanctions, and access summaries.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/accounts",
    label: "Wallet Accounts",
    description: "Account-level environment, chain, provider, and custody status review.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/invites",
    label: "Wallet Invites",
    description: "Invite governance, expiration, and onboarding entitlement review.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/balances",
    label: "Wallet Balances",
    description: "Balance review by chain and status, limited to demo and pending records.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/cards",
    label: "Wallet Cards",
    description: "Virtual card status, funding state, and request-only enablement review.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/funding",
    label: "Funding Requests",
    description: "Funding queue and blocker review. No live rail activation here.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/risk",
    label: "Wallet Risk",
    description: "Aggregated risk posture, flags, and operator recommendations.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/qr",
    label: "QR Profiles",
    description: "Review QR receipt identities and simulation disclaimers.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/wallets/x402",
    label: "Wallet x402",
    description: "x402 readiness oversight with dry-run-only operating posture.",
    audience: "admin",
    simulationOnly: true,
  },
  {
    path: "/admin/troptions/navigation-audit",
    label: "Navigation Audit",
    description: "Link inventory and route coverage for Troptions and wallet surfaces.",
    audience: "admin",
    simulationOnly: true,
  },
];

export const CRITICAL_RUNTIME_URLS = [
  "/troptions",
  "/join-troptions",
  "/join-troptions/create-wallet",
  "/portal/troptions/wallet/dashboard",
  "/portal/troptions/wallet/send",
  "/portal/troptions/wallet/convert",
  "/portal/troptions/wallet/x402",
  "/admin/troptions/wallets",
  "/admin/troptions/navigation-audit",
] as const;

export function getWalletRouteByPath(path: string): WalletRouteDefinition | undefined {
  return [...MEMBER_WALLET_ROUTES, ...ADMIN_WALLET_ROUTES].find((route) => route.path === path);
}