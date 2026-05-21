export interface ChainAccount {
  readonly chain: string;
  readonly status: "active" | "simulation" | "testnet-ready" | "provider-required" | "disabled";
  readonly addressPlaceholder?: string;
  readonly publicKeyHex?: string;
  readonly readinessLevel: number;
}

export interface WalletAccount {
  readonly walletId: string;
  readonly userId: string;
  readonly handle: string;
  readonly accountLabel: string;
  readonly accountType: "personal" | "institutional" | "treasury" | "test";
  readonly environment: "simulation" | "testnet" | "production-ready" | "production";
  readonly internalLedgerId: string;
  readonly qrCodeId: string;
  readonly chainAccounts: readonly ChainAccount[];
  readonly allowedActions: readonly string[];
  readonly blockedActions: readonly string[];
  readonly dailyLimit: string;
  readonly usedDailyLimit: string;
  readonly walletStatus: "created" | "activated" | "locked" | "suspended";
  readonly riskStatus: "low" | "medium" | "high";
  readonly custodyStatus: "none" | "pending" | "approved" | "rejected";
  readonly providerStatus: "none" | "pending" | "approved" | "rejected";
  readonly createdAt: string;
}

export const WALLET_ACCOUNT_REGISTRY: readonly WalletAccount[] = [
  {
    walletId: "wallet_kevan_main",
    userId: "user_kevan_burns",
    handle: "kevan.troptions",
    accountLabel: "Troptions Main",
    accountType: "personal",
    environment: "production-ready",
    internalLedgerId: "ledger_kevan_001",
    qrCodeId: "qr_kevan_001",
    chainAccounts: [
      { chain: "internal-ledger", status: "simulation",        readinessLevel: 100 },
      { chain: "xrpl",            status: "active",            readinessLevel: 100 },
      { chain: "stellar",         status: "active",            readinessLevel: 100 },
      { chain: "polygon",         status: "active",            readinessLevel: 95  },
      { chain: "solana",          status: "provider-required", readinessLevel: 50  },
      { chain: "tron",            status: "provider-required", readinessLevel: 50  },
      { chain: "ethereum",        status: "disabled",          readinessLevel: 0   },
      { chain: "x402",            status: "simulation",        readinessLevel: 80  },
    ],
    allowedActions: [
      "view-balances",
      "receive",
      "view-history",
      "request-funding",
      "view-qr",
      "simulation-send",
      "simulation-convert",
      "live-balance-read",
      "live-trustline-read",
    ],
    blockedActions: [
      "live-send",
      "live-withdraw",
      "card-funding",
      "payment-settlement",
    ],
    dailyLimit: "50000.00",
    usedDailyLimit: "0.00",
    walletStatus: "activated",
    riskStatus: "low",
    custodyStatus: "none",
    providerStatus: "none",
    createdAt: "2026-04-25T12:00:00Z",
  },
];

export function getWalletAccountByHandle(handle: string): WalletAccount | undefined {
  return WALLET_ACCOUNT_REGISTRY.find((account) => account.handle === handle);
}

export function getWalletAccountsByUserId(userId: string): readonly WalletAccount[] {
  return WALLET_ACCOUNT_REGISTRY.filter((account) => account.userId === userId);
}

export function isActionAllowed(account: WalletAccount, action: string): boolean {
  return account.allowedActions.includes(action) && !account.blockedActions.includes(action);
}
