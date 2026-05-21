/**
 * src/lib/troptions/asset-provisioning/assetProvisioningPolicyEngine.ts
 *
 * Pure policy engine: given an operation descriptor and an approval context,
 * returns a decision. Currently every live operation is BLOCKED until the
 * Control Hub bridge wires real approval evaluation.
 */

import type {
  ProvisioningOpDescriptor,
  ProvisioningOpKind,
  ProvisioningApprovalContext,
  ProvisioningDecision,
} from "./assetProvisioningTypes";

const LIVE_WRITE_KINDS: readonly ProvisioningOpKind[] = [
  "AccountSet",
  "TrustSet",
  "Payment",
  "NFTokenMint",
  "MPTokenIssuanceCreate",
  "OfferCreate",
  "SetOptions",
  "ChangeTrust",
  "SetTrustLineFlags",
  "ManageSellOffer",
  "ManageBuyOffer",
];

const REQUIRED_APPROVALS: ReadonlyArray<keyof ProvisioningApprovalContext> = [
  "controlHubApprovalId",
  "legalReviewId",
  "custodyReviewId",
  "complianceReviewId",
];

export function evaluateProvisioningOp(
  op: ProvisioningOpDescriptor,
  ctx: ProvisioningApprovalContext,
): ProvisioningDecision {
  const reasons: string[] = [];
  const missing: string[] = [];

  // Read-only modes always allowed.
  if (!ctx.executeFlag) {
    return {
      outcome: "allowed-dry-run",
      reasons: ["execute flag absent — dry-run only"],
      missingApprovals: [],
    };
  }

  // Live writes are gated.
  const isLiveWrite = LIVE_WRITE_KINDS.includes(op.kind);
  if (!isLiveWrite) {
    return {
      outcome: "allowed-plan-only",
      reasons: [`op kind ${op.kind} is non-mutating`],
      missingApprovals: [],
    };
  }

  for (const k of REQUIRED_APPROVALS) {
    const v = ctx[k];
    if (typeof v !== "string" || v.trim() === "") missing.push(String(k));
  }
  if (ctx.executeEnvAck !== "YES_I_UNDERSTAND") {
    missing.push("executeEnvAck");
    reasons.push("TROPTIONS_PROVISIONING_EXECUTE must equal YES_I_UNDERSTAND");
  }
  if (ctx.network !== "testnet" && ctx.network !== "mainnet") {
    missing.push("network");
    reasons.push("network must be 'testnet' or 'mainnet'");
  }

  if (missing.length > 0) {
    return {
      outcome: "blocked",
      reasons: ["one or more required approvals missing", ...reasons],
      missingApprovals: missing,
    };
  }

  // Even with all approvals present, the policy currently blocks live mainnet
  // writes until the Control Hub bridge is wired. This is intentional.
  if (ctx.network === "mainnet") {
    return {
      outcome: "blocked",
      reasons: [
        "live mainnet writes are blocked by default policy",
        "Control Hub bridge not yet wired — see docs/troptions/asset-provisioning-approval-policy.md",
      ],
      missingApprovals: [],
    };
  }

  return {
    outcome: "allowed-with-approval",
    reasons: ["all approvals present; testnet write permitted"],
    missingApprovals: [],
  };
}

export const __policyInternals = { LIVE_WRITE_KINDS, REQUIRED_APPROVALS };
