/**
 * Stellar Issuer Control Registry
 *
 * Documents Stellar issuer control patterns including asset authorization,
 * trustline management, clawback, and account flags.
 *
 * SAFETY RULES:
 * - All Stellar public-network actions blocked by default
 * - Asset issuance: simulation-only
 * - Trustline templates: unsigned only
 * - liveExecutionAllowed: false on all entries
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type StellarIssuerControlType =
  | "asset_authorization"
  | "clawback"
  | "trustline_management"
  | "freeze"
  | "account_flag"
  | "reserve_management"
  | "signing_policy";

export type StellarIssuerControlRisk = "low" | "medium" | "high" | "critical";

export type StellarIssuerControlSafety =
  | "safe_reversible"
  | "safe_high_impact"
  | "requires_authority"
  | "irreversible_caution";

export interface StellarIssuerControlDefinition {
  readonly controlId: string;
  readonly controlType: StellarIssuerControlType;
  readonly displayName: string;
  readonly safety: StellarIssuerControlSafety;
  readonly risk: StellarIssuerControlRisk;
  readonly description: string;
  readonly complianceUseCase: string;
  readonly stellarOperationType: string;
  readonly warningIfEnabled: string;
  readonly warningIfDisabled: string;
  readonly reversible: boolean;
  readonly requiresIssuerAuthority: boolean;
  readonly publicNetworkBlocked: true;
  readonly liveExecutionAllowed: false;
  readonly templateOnly: true;
}

// ─── Control Registry ──────────────────────────────────────────────────────────

export const STELLAR_ISSUER_CONTROL_REGISTRY: readonly StellarIssuerControlDefinition[] = [
  {
    controlId: "stellar_auth_required",
    controlType: "asset_authorization",
    displayName: "Authorization Required (AUTH_REQUIRED)",
    safety: "safe_reversible",
    risk: "medium",
    description: "Requires explicit issuer authorization before any account can establish a trustline to the issued asset. Each trustline must be approved via an AllowTrust or SetTrustLineFlags operation.",
    complianceUseCase: "Permissioned asset distribution — ensures only KYC/KYB-verified holders can hold issued assets. Required for institutional asset issuance with holder verification.",
    stellarOperationType: "SetOptions (AUTH_REQUIRED flag)",
    warningIfEnabled: "All new trustlines require explicit issuer authorization. Unauthorized accounts cannot hold the asset.",
    warningIfDisabled: "Any Stellar account can establish a trustline and hold issued assets. Not recommended for regulated asset issuance.",
    reversible: true,
    requiresIssuerAuthority: false,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_auth_revocable",
    controlType: "freeze",
    displayName: "Authorization Revocable (AUTH_REVOCABLE)",
    safety: "requires_authority",
    risk: "high",
    description: "Allows the issuer to freeze individual trustlines (revoke authorization) after they have been approved. Required for OFAC/AML freeze capability.",
    complianceUseCase: "Individual account freeze for AML/sanctions enforcement — freeze specific holders without affecting all holders. Enables targeted compliance actions.",
    stellarOperationType: "SetOptions (AUTH_REVOCABLE flag) + SetTrustLineFlags",
    warningIfEnabled: "Issuer can freeze individual trustlines at any time. Holders aware their trustline can be frozen.",
    warningIfDisabled: "Issuer cannot freeze individual trustlines. Limits AML/regulatory enforcement capability.",
    reversible: true,
    requiresIssuerAuthority: true,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_auth_immutable",
    controlType: "account_flag",
    displayName: "Authorization Immutable (AUTH_IMMUTABLE) — IRREVERSIBLE",
    safety: "irreversible_caution",
    risk: "critical",
    description: "IRREVERSIBLE. Permanently prevents changes to AUTH_REQUIRED and AUTH_REVOCABLE flags. Once set, neither the requiring nor revoking of authorization can be changed.",
    complianceUseCase: "Permanent permission guarantee — used to assure holders that authorization rules will never change. Sacrifices regulatory flexibility for holder trust.",
    stellarOperationType: "SetOptions (AUTH_IMMUTABLE flag)",
    warningIfEnabled: "IRREVERSIBLE. AUTH_REQUIRED and AUTH_REVOCABLE flags can never be changed. Do NOT set if regulatory changes to authorization rules are possible.",
    warningIfDisabled: "Normal operations. AUTH_REQUIRED and AUTH_REVOCABLE can be changed at any time.",
    reversible: false,
    requiresIssuerAuthority: true,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_clawback_enabled",
    controlType: "clawback",
    displayName: "Clawback Enabled",
    safety: "requires_authority",
    risk: "high",
    description: "Enables the issuer to claw back (reclaim) issued tokens from holder accounts via Clawback operations. Must be set on the issuer account. AUTH_REVOCABLE must also be enabled.",
    complianceUseCase: "AML/sanctions enforcement — ability to reclaim issued tokens from sanctioned or suspicious accounts as required by regulatory order.",
    stellarOperationType: "SetOptions (AUTH_CLAWBACK_ENABLED flag) + Clawback operation",
    warningIfEnabled: "Issuer can claw back tokens from holders. Clawback exercise requires legal authorization and documentation.",
    warningIfDisabled: "Issuer cannot reclaim issued tokens from holders. Limits AML/regulatory enforcement capability.",
    reversible: false,
    requiresIssuerAuthority: true,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_home_domain",
    controlType: "account_flag",
    displayName: "Home Domain (Issuer Identity)",
    safety: "safe_reversible",
    risk: "low",
    description: "Sets a home domain on the issuer account, linking to a stellar.toml file with asset metadata, issuer information, and compliance documentation.",
    complianceUseCase: "Issuer disclosure and identity — stellar.toml enables discovery of issuer policies, KYC requirements, terms of service, and compliance contacts. Required for institutional transparency.",
    stellarOperationType: "SetOptions (home_domain)",
    warningIfEnabled: "stellar.toml must be maintained and accurate. Stale or inaccurate stellar.toml creates compliance risk.",
    warningIfDisabled: "Issuer has no discoverable metadata. Reduces holder and exchange trust. Not recommended for institutional issuers.",
    reversible: true,
    requiresIssuerAuthority: false,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_multisig_signing",
    controlType: "signing_policy",
    displayName: "Multisig Signing Policy",
    safety: "safe_high_impact",
    risk: "medium",
    description: "Configures multiple signing keys with thresholds for issuer account operations. Enables governance controls, separation of duties, and HSM-protected key management.",
    complianceUseCase: "Institutional key governance — multisig prevents single-point-of-failure for issuer key management. Required for institutional custody standards.",
    stellarOperationType: "SetOptions (signers, low/med/high threshold)",
    warningIfEnabled: "All transactions must meet signing threshold. Losing access to enough signers can lock the account.",
    warningIfDisabled: "Single master key controls all issuer operations. High-value or institutional accounts should use multisig.",
    reversible: true,
    requiresIssuerAuthority: false,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_trustline_authorization",
    controlType: "trustline_management",
    displayName: "Trustline Authorization (AllowTrust / SetTrustLineFlags)",
    safety: "safe_reversible",
    risk: "medium",
    description: "Grants or revokes authorization for a specific account to hold issued assets. Used in conjunction with AUTH_REQUIRED and AUTH_REVOCABLE flags.",
    complianceUseCase: "Per-account holder authorization — authorize only verified counterparties, freeze non-compliant holders, revoke authorization for sanctioned accounts.",
    stellarOperationType: "SetTrustLineFlags (AUTHORIZED, AUTHORIZED_TO_MAINTAIN_LIABILITIES, CLAWBACK_ENABLED_FLAG)",
    warningIfEnabled: "Account is authorized to hold the issued asset. Ensure KYC/KYB is complete before authorizing.",
    warningIfDisabled: "Account is not authorized to hold the issued asset. Trustline exists but asset cannot be transferred.",
    reversible: true,
    requiresIssuerAuthority: true,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    controlId: "stellar_asset_issuance",
    controlType: "asset_authorization",
    displayName: "Asset Issuance (Payment from Issuer)",
    safety: "requires_authority",
    risk: "high",
    description: "Issues asset tokens by sending Payment operations from the issuer account. Asset supply is created by the issuer sending to authorized holders.",
    complianceUseCase: "Controlled supply issuance — issuer controls total supply by managing payments from the issuing account. Reserve attestation and regulatory approval required before issuance.",
    stellarOperationType: "Payment (from issuer to holder)",
    warningIfEnabled: "Asset is being minted and distributed. Requires reserve documentation, regulatory approval, and holder verification.",
    warningIfDisabled: "No active issuance. Simulation-only mode.",
    reversible: true,
    requiresIssuerAuthority: true,
    publicNetworkBlocked: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
] as const;

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function getAllStellarIssuerControls(): readonly StellarIssuerControlDefinition[] {
  return STELLAR_ISSUER_CONTROL_REGISTRY;
}

export function getStellarIssuerControl(controlId: string): StellarIssuerControlDefinition | undefined {
  return STELLAR_ISSUER_CONTROL_REGISTRY.find((c) => c.controlId === controlId);
}

export function getIrreversibleStellarControls(): readonly StellarIssuerControlDefinition[] {
  return STELLAR_ISSUER_CONTROL_REGISTRY.filter((c) => !c.reversible);
}

export function getCriticalRiskStellarControls(): readonly StellarIssuerControlDefinition[] {
  return STELLAR_ISSUER_CONTROL_REGISTRY.filter((c) => c.risk === "critical");
}

export function getStellarControlsByType(
  type: StellarIssuerControlType
): readonly StellarIssuerControlDefinition[] {
  return STELLAR_ISSUER_CONTROL_REGISTRY.filter((c) => c.controlType === type);
}
