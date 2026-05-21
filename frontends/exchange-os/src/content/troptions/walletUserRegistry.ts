export interface WalletUser {
  readonly userId: string;
  readonly handle: string;
  readonly displayName: string;
  readonly email: string;
  readonly role: "admin" | "operator" | "partner" | "member";
  readonly inviteId: string;
  readonly kycStatus: "none" | "pending" | "verified" | "failed" | "expired";
  readonly kybStatus: "none" | "pending" | "verified" | "failed";
  readonly sanctionsStatus: "pending" | "clear" | "flagged" | "escalated";
  readonly walletStatus: "created" | "activated" | "locked" | "suspended";
  readonly riskStatus: "low" | "medium" | "high" | "critical";
  readonly walletLocked: boolean;
  readonly modulesEnabled: readonly string[];
  readonly createdAt: string;
  readonly lastLoginAt: string;
}

export const WALLET_USER_REGISTRY: readonly WalletUser[] = [
  {
    userId: "user_kevan_burns",
    handle: "kevan.troptions",
    displayName: "TROPTIONS Chairman",
    email: "ops@unykorn.org",
    role: "admin",
    inviteId: "invite_kevan_burns_001",
    kycStatus: "verified",
    kybStatus: "verified",
    sanctionsStatus: "clear",
    walletStatus: "activated",
    riskStatus: "low",
    walletLocked: false,
    modulesEnabled: [
      "internal-ledger",
      "qr-profile",
      "receive",
      "simulation-send",
      "x402-readiness",
      "balance-view",
      "history",
      "funding-request",
    ],
    createdAt: "2026-04-25T12:00:00Z",
    lastLoginAt: "2026-04-25T23:10:00Z",
  },
];

export function getWalletUserByHandle(handle: string): WalletUser | undefined {
  return WALLET_USER_REGISTRY.find((user) => user.handle === handle);
}

export function getWalletUserByEmail(email: string): WalletUser | undefined {
  return WALLET_USER_REGISTRY.find((user) => user.email === email);
}

export function getUsersByRole(role: string): readonly WalletUser[] {
  return WALLET_USER_REGISTRY.filter((user) => user.role === role);
}

export function isUserKycVerified(user: WalletUser): boolean {
  return user.kycStatus === "verified" && user.sanctionsStatus === "clear";
}
