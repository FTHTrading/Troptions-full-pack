export interface WalletInvite {
  readonly inviteId: string;
  readonly inviteHandle: string;
  readonly invitedBy: string;
  readonly inviterRole: string;
  readonly inviteStatus: "active" | "redeemed" | "expired" | "revoked" | "verified";
  readonly allowedEmailDomain?: string;
  readonly expiresAt: string;
  readonly maxUses: number;
  readonly currentUses: number;
  readonly requiredKycLevel: "none" | "basic" | "enhanced" | "institutional";
  readonly allowedWalletModules: readonly string[];
  readonly riskNote?: string;
  readonly createdAt: string;
  readonly redeemedAt?: string;
}

export const WALLET_INVITE_REGISTRY: readonly WalletInvite[] = [
  {
    inviteId: "invite_kevan_burns_001",
    inviteHandle: "kevan.troptions",
    invitedBy: "Troptions System",
    inviterRole: "Administrator",
    inviteStatus: "verified",
    allowedEmailDomain: "unykorn.org",
    expiresAt: "2026-12-31T23:59:59Z",
    maxUses: 1,
    currentUses: 1,
    requiredKycLevel: "basic",
    allowedWalletModules: [
      "internal-ledger",
      "qr-profile",
      "receive",
      "simulation-send",
      "x402-readiness",
      "balance-view",
      "history",
    ],
    riskNote: "Founder role — full access",
    createdAt: "2026-04-25T00:00:00Z",
    redeemedAt: "2026-04-25T12:00:00Z",
  },
  {
    inviteId: "invite_fth_co_001",
    inviteHandle: "operator.troptions",
    invitedBy: "TROPTIONS Chairman",
    inviterRole: "Chairman",
    inviteStatus: "active",
    allowedEmailDomain: "fthco.com",
    expiresAt: "2026-06-30T23:59:59Z",
    maxUses: 5,
    currentUses: 0,
    requiredKycLevel: "basic",
    allowedWalletModules: [
      "internal-ledger",
      "qr-profile",
      "receive",
      "simulation-send",
      "x402-readiness",
    ],
    riskNote: "Operator tier",
    createdAt: "2026-04-24T00:00:00Z",
  },
  {
    inviteId: "invite_partner_001",
    inviteHandle: "partner.troptions",
    invitedBy: "TROPTIONS Chairman",
    inviterRole: "Chairman",
    inviteStatus: "active",
    expiresAt: "2026-05-31T23:59:59Z",
    maxUses: 10,
    currentUses: 0,
    requiredKycLevel: "enhanced",
    allowedWalletModules: [
      "internal-ledger",
      "qr-profile",
      "receive",
      "x402-readiness",
    ],
    riskNote: "Partner onboarding — enhanced KYC required",
    createdAt: "2026-04-23T00:00:00Z",
  },
];

export function getInviteByHandle(handle: string): WalletInvite | undefined {
  return WALLET_INVITE_REGISTRY.find((invite) => invite.inviteHandle === handle);
}

export function getActiveInvites(): readonly WalletInvite[] {
  return WALLET_INVITE_REGISTRY.filter((invite) => invite.inviteStatus === "active" || invite.inviteStatus === "verified");
}

export function isInviteValid(invite: WalletInvite): boolean {
  return (
    invite.inviteStatus === "active" &&
    invite.currentUses < invite.maxUses &&
    new Date(invite.expiresAt) > new Date()
  );
}
