import { getInviteByHandle, isInviteValid } from "@/content/troptions/walletInviteRegistry";

export interface InviteVerificationResult {
  ok: boolean;
  inviteValid: boolean;
  handle: string;
  requiredKycLevel: string;
  allowedModules: readonly string[];
  message: string;
  blockedReason?: string;
}

export function verifyInviteByHandle(handle: string): InviteVerificationResult {
  const invite = getInviteByHandle(handle);

  if (!invite) {
    return {
      ok: false,
      inviteValid: false,
      handle,
      requiredKycLevel: "none",
      allowedModules: [],
      message: "Invite not found",
      blockedReason: "invite-not-found",
    };
  }

  if (!isInviteValid(invite)) {
    return {
      ok: false,
      inviteValid: false,
      handle,
      requiredKycLevel: invite.requiredKycLevel,
      allowedModules: Array.from(invite.allowedWalletModules),
      message: "Invite expired, revoked, or usage limit reached",
      blockedReason: "invite-invalid",
    };
  }

  return {
    ok: true,
    inviteValid: true,
    handle: invite.inviteHandle,
    requiredKycLevel: invite.requiredKycLevel,
    allowedModules: Array.from(invite.allowedWalletModules),
    message: `Invite verified. Welcome, ${invite.inviteHandle}. Required KYC level: ${invite.requiredKycLevel}.`,
  };
}

export function getInviteRequirements(handle: string): {
  kycRequired: boolean;
  kybRequired: boolean;
  sanctionsScreeningRequired: boolean;
  minModulesRequired: number;
} {
  const invite = getInviteByHandle(handle);
  if (!invite) {
    return {
      kycRequired: true,
      kybRequired: true,
      sanctionsScreeningRequired: true,
      minModulesRequired: 0,
    };
  }

  return {
    kycRequired: invite.requiredKycLevel !== "none",
    kybRequired: invite.requiredKycLevel === "enhanced" || invite.requiredKycLevel === "institutional",
    sanctionsScreeningRequired: true,
    minModulesRequired: invite.allowedWalletModules.length > 0 ? 1 : 0,
  };
}
