/**
 * TROPTIONS Platform Core — Types
 *
 * SR-engineered platform foundation.
 * Strict discriminated unions, typed errors, no loose `any`.
 * No fake execution. No FTH/FTHX/FTHG references.
 */

// ─── Execution Policy ─────────────────────────────────────────────────────────

export type ExecutionStatus =
  | "design_only"
  | "mock_only"
  | "manual_review"
  | "credentials_required"
  | "sandbox_ready"
  | "production_ready"
  | "execution_disabled"
  | "execution_pending"
  | "executed_confirmed"
  | "failed"
  | "blocked";

export type CapabilityStatus =
  | "design_only"
  | "mock_only"
  | "manual_only"
  | "credentials_required"
  | "sandbox_ready"
  | "production_ready"
  | "blocked";

// ─── Capability Types ─────────────────────────────────────────────────────────

export type CapabilityType =
  | "namespace_registry"
  | "identity_attestation"
  | "payment_readiness"
  | "payout_batching"
  | "receipt_generation"
  | "audit_trail"
  | "wallet_reference"
  | "stablecoin_reference"
  | "token_reference"
  | "rwa_reference"
  | "smart_contract_template"
  | "bridge_readiness"
  | "compliance_check"
  | "kyc_kyb_reference"
  | "proof_of_funds_reference"
  | "deployment_readiness"
  | "provider_webhook"
  | "transaction_monitoring";

// ─── Network Types ────────────────────────────────────────────────────────────

export type NetworkType =
  | "xrpl"
  | "stellar"
  | "evm"
  | "solana"
  | "bitcoin"
  | "lightning"
  | "stablecoin_provider"
  | "bank_partner"
  | "card_partner"
  | "payroll_partner"
  | "manual_proof"
  | "internal_ledger";

export type NetworkEnvironment = "testnet" | "mainnet" | "simulation";

export type AdapterReadinessStatus =
  | "design_only"
  | "mock_only"
  | "testnet_ready"
  | "credentials_required"
  | "mainnet_ready"
  | "disabled";

// ─── Execution Result ─────────────────────────────────────────────────────────

export type ExecutionResult =
  | { status: "executed_confirmed"; providerConfirmation: string; txId: string | null; timestamp: string }
  | { status: "execution_disabled"; reason: string }
  | { status: "credentials_required"; missingCredentials: string[] }
  | { status: "blocked"; reason: string }
  | { status: "failed"; error: string };

// ─── Execution Request ────────────────────────────────────────────────────────

export interface ExecutionRequest {
  requestId: string;
  namespaceId: string;
  adapterCategory: string;
  adapterStatus: string;
  complianceStatus: string;
  credentialsPresent: boolean;
  isSandbox: boolean;
  isMock: boolean;
  isManualProof: boolean;
  requestedBy: string;
  timestamp: string;
}

// ─── Capability Record ────────────────────────────────────────────────────────

export interface PlatformCapabilityRecord {
  id: string;
  capabilityType: CapabilityType;
  displayName: string;
  description: string;
  status: CapabilityStatus;
  modules: string[];
  adapterCategories: string[];
  limitations: string[];
  nextSteps: string[];
  softwareRoute: string | null;
  apiRoute: string | null;
}

// ─── Platform Readiness ───────────────────────────────────────────────────────

export interface PlatformReadinessReport {
  generatedAt: string;
  overallScore: number;
  capabilities: PlatformCapabilityRecord[];
  blockedCapabilities: string[];
  credentialsRequired: string[];
  legalReviewRequired: string[];
  recommendations: string[];
}

// ─── Audit Event ─────────────────────────────────────────────────────────────

export type PlatformAuditAction =
  | "execution_blocked"
  | "execution_requested"
  | "capability_evaluated"
  | "adapter_health_checked"
  | "readiness_scored"
  | "compliance_checked"
  | "guard_triggered"
  | "policy_evaluated";

export interface PlatformAuditEvent {
  id: string;
  action: PlatformAuditAction;
  namespaceId: string | null;
  actorId: string;
  resourceType: string;
  resourceId: string;
  status: ExecutionStatus;
  reason: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

// ─── Error Types ──────────────────────────────────────────────────────────────

export class ExecutionBlockedError extends Error {
  constructor(
    public readonly reason: string,
    public readonly adapterCategory: string
  ) {
    super(`Execution blocked: ${reason} (adapter: ${adapterCategory})`);
    this.name = "ExecutionBlockedError";
  }
}

export class CredentialsRequiredError extends Error {
  constructor(public readonly missingCredentials: string[]) {
    super(
      `Credentials required: ${missingCredentials.join(", ")}`
    );
    this.name = "CredentialsRequiredError";
  }
}

export class ComplianceBlockError extends Error {
  constructor(public readonly complianceStatus: string) {
    super(`Compliance block: status is ${complianceStatus}`);
    this.name = "ComplianceBlockError";
  }
}

export class MockAdapterExecutionError extends Error {
  constructor(public readonly adapterType: string) {
    super(
      `Mock/manual adapter '${adapterType}' cannot produce executed_confirmed status.`
    );
    this.name = "MockAdapterExecutionError";
  }
}

// ─── Labels ──────────────────────────────────────────────────────────────────

export const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string> = {
  design_only: "Design Only",
  mock_only: "Mock Only",
  manual_review: "Manual Review",
  credentials_required: "Credentials Required",
  sandbox_ready: "Sandbox Ready",
  production_ready: "Production Ready",
  execution_disabled: "Execution Disabled",
  execution_pending: "Execution Pending",
  executed_confirmed: "Executed — Confirmed",
  failed: "Failed",
  blocked: "Blocked",
};

export const CAPABILITY_STATUS_LABELS: Record<CapabilityStatus, string> = {
  design_only: "Design Only",
  mock_only: "Mock Only",
  manual_only: "Manual Only",
  credentials_required: "Credentials Required",
  sandbox_ready: "Sandbox Ready",
  production_ready: "Production Ready",
  blocked: "Blocked",
};

export const NETWORK_TYPE_LABELS: Record<NetworkType, string> = {
  xrpl: "XRP Ledger (XRPL)",
  stellar: "Stellar Network",
  evm: "EVM — Ethereum Compatible",
  solana: "Solana",
  bitcoin: "Bitcoin",
  lightning: "Lightning Network",
  stablecoin_provider: "Stablecoin Provider",
  bank_partner: "Bank Partner",
  card_partner: "Card Partner",
  payroll_partner: "Payroll Partner",
  manual_proof: "Manual Proof",
  internal_ledger: "Internal Ledger",
};
