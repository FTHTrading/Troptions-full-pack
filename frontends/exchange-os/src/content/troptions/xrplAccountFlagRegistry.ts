/**
 * XRPL Account Flag Registry
 *
 * Documents all XRPL AccountSet flags with compliance implications.
 *
 * SAFETY RULES:
 * - All AccountSet outputs are unsigned templates only
 * - NoFreeze is IRREVERSIBLE — never recommend casually
 * - GlobalFreeze and Clawback require issuer authority confirmation
 * - liveExecutionAllowed: false on all entries
 * - MasterKeyDisabled requires multisig/RegularKey in place first
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type XrplAccountFlagSafety =
  | "safe_reversible"        // Can be set/unset freely
  | "safe_high_impact"       // Reversible but high operational impact
  | "requires_authority"     // Requires issuer/special authorization
  | "irreversible_caution";  // Cannot be undone — review carefully

export type XrplAccountFlagRisk = "low" | "medium" | "high" | "critical";

export interface XrplAccountFlagDefinition {
  readonly flagName: string;
  readonly asfHex: string;
  readonly displayName: string;
  readonly safety: XrplAccountFlagSafety;
  readonly risk: XrplAccountFlagRisk;
  readonly description: string;
  readonly complianceUseCase: string;
  readonly warningIfSet: string;
  readonly warningIfUnset: string;
  readonly reversible: boolean;
  readonly requiresIssuerAuthority: boolean;
  readonly requiresMultisigOrRegularKey: boolean;
  readonly liveExecutionAllowed: false;
  readonly templateOnly: true;
}

// ─── Flag Registry ─────────────────────────────────────────────────────────────

export const XRPL_ACCOUNT_FLAG_REGISTRY: readonly XrplAccountFlagDefinition[] = [
  {
    flagName: "asfRequireAuth",
    asfHex: "0x0002",
    displayName: "Require Authorization (RequireAuth)",
    safety: "safe_reversible",
    risk: "medium",
    description: "When set, users must be authorized by the issuer before they can hold IOUs issued by this account. Provides permissioned distribution control.",
    complianceUseCase: "Permissioned asset distribution — ensures only KYC/KYB-verified holders can establish trustlines. Required for institutional asset issuance with holder verification.",
    warningIfSet: "New trustlines require explicit issuer authorization (TrustSet + AccountSet). Existing unauthorized trustlines cannot receive issued assets.",
    warningIfUnset: "Any XRPL account can establish a trustline and receive issued assets without verification. Not recommended for institutional or regulated asset issuance.",
    reversible: true,
    requiresIssuerAuthority: false,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfRequireDestTag",
    asfHex: "0x0001",
    displayName: "Require Destination Tag (DestinationTag)",
    safety: "safe_reversible",
    risk: "low",
    description: "When set, incoming payments to this account must include a DestinationTag. Used for exchange-style routing, user identification, and payment attribution.",
    complianceUseCase: "Customer payment attribution for exchanges and custodians. Helps identify which customer a deposit belongs to for AML/recordkeeping.",
    warningIfSet: "Payments without a DestinationTag will be rejected. Senders must always include a tag.",
    warningIfUnset: "Incoming payments cannot be attributed to specific customers by tag alone. Reduces operational traceability for high-volume accounts.",
    reversible: true,
    requiresIssuerAuthority: false,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfDisableMaster",
    asfHex: "0x0004",
    displayName: "Disable Master Key",
    safety: "requires_authority",
    risk: "critical",
    description: "Disables the master keypair for transaction signing. Once disabled, a RegularKey or multisig must be set up FIRST, or the account becomes permanently inaccessible.",
    complianceUseCase: "Security hardening — disabling master key forces use of hardware-protected signing keys, HSMs, or multisig governance. Required for institutional key custody policies.",
    warningIfSet: "IRREVERSIBLE if no RegularKey or multisig is configured. Account will be permanently locked. ALWAYS configure RegularKey or multisig before setting this flag.",
    warningIfUnset: "Master private key can sign all transactions. High-value or institutional accounts should use RegularKey or multisig instead.",
    reversible: true,
    requiresIssuerAuthority: false,
    requiresMultisigOrRegularKey: true,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfAccountTxnID",
    asfHex: "0x0005",
    displayName: "Track Account Transaction ID",
    safety: "safe_reversible",
    risk: "low",
    description: "Tracks the ID of the last transaction sent from this account. Used by AccountTxnID field to prevent replay attacks on specific transaction sequences.",
    complianceUseCase: "Transaction integrity — prevents replay of specific transaction sequences. Useful for high-security signing workflows.",
    warningIfSet: "AccountTxnID field becomes available and enforceable.",
    warningIfUnset: "AccountTxnID replay protection is not active.",
    reversible: true,
    requiresIssuerAuthority: false,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfNoFreeze",
    asfHex: "0x0006",
    displayName: "No Freeze (NoFreeze) — IRREVERSIBLE",
    safety: "irreversible_caution",
    risk: "critical",
    description: "IRREVERSIBLE. Once set, the issuer permanently waives the ability to freeze any trustline. Cannot be unset under any circumstances. Provides holders with assurance that issued assets cannot be frozen.",
    complianceUseCase: "Consumer assurance and decentralized asset guarantee. Used when issuer wants to signal permanent non-interference with holder balances.",
    warningIfSet: "IRREVERSIBLE. Issuer cannot freeze any trustline, including for AML/sanctions compliance. Do NOT set if regulatory freeze obligations exist. This waives AML freeze authority permanently.",
    warningIfUnset: "Issuer retains freeze capability. Required for compliance with AML/sanctions regulations requiring ability to freeze suspicious accounts.",
    reversible: false,
    requiresIssuerAuthority: true,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfGlobalFreeze",
    asfHex: "0x0007",
    displayName: "Global Freeze",
    safety: "requires_authority",
    risk: "high",
    description: "Freezes all trustlines issued by this account. All holders are frozen — no one can send or receive the frozen asset (except back to the issuer). Used for emergency AML/regulatory response.",
    complianceUseCase: "Emergency AML/sanctions response — freeze all issued asset activity when required by regulators. Institutional issuers may be required to implement GlobalFreeze in response to regulatory order.",
    warningIfSet: "ALL holders of issued assets are frozen. Significant operational and customer impact. Should only be set with legal authorization.",
    warningIfUnset: "Normal operations continue. GlobalFreeze can be set at any time if needed.",
    reversible: true,
    requiresIssuerAuthority: true,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfDefaultRipple",
    asfHex: "0x0008",
    displayName: "Default Ripple (Rippling)",
    safety: "safe_high_impact",
    risk: "medium",
    description: "When set on an issuer account, rippling is enabled by default for all trustlines. Allows issued IOUs to flow through the issuer account via pathfinding. Required for most IOU issuance use cases.",
    complianceUseCase: "IOU liquidity — required for issued assets to be tradable via DEX pathfinding. Without rippling, IOUs cannot move through the issuer account.",
    warningIfSet: "IOUs can ripple through this account. Ensure issuer is prepared to handle all rippling flows for compliance purposes.",
    warningIfUnset: "Issued IOUs cannot be traded via pathfinding through this account. Significantly limits liquidity.",
    reversible: true,
    requiresIssuerAuthority: false,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfDepositAuth",
    asfHex: "0x0009",
    displayName: "Deposit Authorization (DepositAuth)",
    safety: "safe_reversible",
    risk: "medium",
    description: "When set, only pre-authorized accounts can send payments to this account. All other incoming payments are rejected. Used for whitelisting-based payment controls.",
    complianceUseCase: "Permissioned incoming payments — whitelist-only receipt of funds. Useful for institutional treasury accounts that should only receive from verified counterparties.",
    warningIfSet: "Non-whitelisted accounts cannot send payments to this account. Any unwhitelisted senders will have transactions rejected.",
    warningIfUnset: "Any XRPL account can send payments to this account.",
    reversible: true,
    requiresIssuerAuthority: false,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
  {
    flagName: "asfAllowTrustLineClawback",
    asfHex: "0x0010",
    displayName: "Allow Clawback",
    safety: "requires_authority",
    risk: "high",
    description: "Enables the issuer to claw back (reclaim) issued tokens from holder accounts. Must be set BEFORE any trustlines are created — cannot be enabled if trustlines already exist.",
    complianceUseCase: "AML/sanctions enforcement — ability to reclaim issued tokens from sanctioned or suspicious accounts as required by regulatory order. Required for compliance with certain VASP regulations.",
    warningIfSet: "Issuer can claw back tokens from holder accounts. Clawback exercise requires legal authorization and documentation. Holders are aware that clawback is possible.",
    warningIfUnset: "Issuer cannot reclaim issued tokens from holders. Limits AML/regulatory enforcement capability.",
    reversible: false,
    requiresIssuerAuthority: true,
    requiresMultisigOrRegularKey: false,
    liveExecutionAllowed: false,
    templateOnly: true,
  },
] as const;

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function getAllXrplAccountFlags(): readonly XrplAccountFlagDefinition[] {
  return XRPL_ACCOUNT_FLAG_REGISTRY;
}

export function getXrplAccountFlag(flagName: string): XrplAccountFlagDefinition | undefined {
  return XRPL_ACCOUNT_FLAG_REGISTRY.find((f) => f.flagName === flagName);
}

export function getIrreversibleFlags(): readonly XrplAccountFlagDefinition[] {
  return XRPL_ACCOUNT_FLAG_REGISTRY.filter((f) => !f.reversible);
}

export function getCriticalRiskFlags(): readonly XrplAccountFlagDefinition[] {
  return XRPL_ACCOUNT_FLAG_REGISTRY.filter((f) => f.risk === "critical");
}

export function getFlagsRequiringMultisig(): readonly XrplAccountFlagDefinition[] {
  return XRPL_ACCOUNT_FLAG_REGISTRY.filter((f) => f.requiresMultisigOrRegularKey);
}
