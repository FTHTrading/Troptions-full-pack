/**
 * TROPTIONS PayOps — Type Definitions
 *
 * BRAND RULE: TROPTIONS-only. Do not reference FTH, FTHX, FTHG, or Future Tech Holdings.
 *
 * EXECUTION RULE: No payout may reach "executed" status unless a real,
 * configured execution adapter confirms it. Mock and manual_proof adapters
 * cap at "approved_not_executed".
 *
 * COMPLIANCE RULE: Blocked payouts cannot transition to any execution state.
 */

// ─── Enumerations ─────────────────────────────────────────────────────────────

export type PayoutType =
  | "payroll_like_batch"
  | "contractor_payout"
  | "vendor_payment"
  | "sales_commission"
  | "sponsor_revenue_share"
  | "creator_payout"
  | "nil_payout"
  | "member_reward"
  | "refund_or_credit"
  | "event_staff_payout"
  | "affiliate_commission";

export type PayoutStatus =
  | "draft"
  | "pending_approval"
  | "approved_not_executed"
  | "execution_pending"
  | "executed"
  | "failed"
  | "cancelled"
  | "blocked_by_compliance";

export type AdapterCategory =
  | "mock"
  | "manual_proof"
  | "bank_partner"
  | "payroll_partner"
  | "wallet_partner"
  | "stablecoin_partner"
  | "card_partner"
  | "accounting_partner"
  | "compliance_partner"
  | "crm_partner"
  | "event_partner";

export type AdapterStatus =
  | "not_configured"
  | "sandbox"
  | "pending_review"
  | "approved"
  | "disabled"
  | "error";

export type AdapterEnvironment = "mock" | "sandbox" | "production";

export type ComplianceStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "manual_review"
  | "blocked";

export type FundingSourceType =
  | "manual_proof"
  | "bank_wire"
  | "ach_partner"
  | "stablecoin_wallet"
  | "card_offRamp"
  | "internal_credit_ledger";

export type PayeeType =
  | "employee_like"
  | "contractor"
  | "vendor"
  | "creator"
  | "sales_rep"
  | "sponsor"
  | "affiliate"
  | "event_staff"
  | "member"
  | "other";

export type PayoutPreference =
  | "bank_transfer"
  | "stablecoin_wallet"
  | "card_payout"
  | "internal_credit"
  | "manual_check"
  | "not_configured";

export type ApprovalGateStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";

export type ReceiptPacketStatus =
  | "not_generated"
  | "draft"
  | "issued"
  | "acknowledged"
  | "exported";

// ─── Payee ────────────────────────────────────────────────────────────────────

export interface TroptionsPayee {
  id: string;
  namespaceId: string;
  name: string;
  email: string;
  payeeType: PayeeType;
  payoutPreference: PayoutPreference;
  walletAddress?: string;
  bankRailPlaceholder?: string; // e.g. "ACH routing placeholder — adapter required"
  cardRailPlaceholder?: string;
  complianceStatus: ComplianceStatus;
  kycStatus: ComplianceStatus;
  w9w8Status: ComplianceStatus;
  sanctionsScreeningStatus: ComplianceStatus;
  isActive: boolean;
  lastPayoutDate?: string;
  totalPaidAmount: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Funding Source ───────────────────────────────────────────────────────────

export interface TroptionsFundingSource {
  id: string;
  namespaceId: string;
  label: string;
  sourceType: FundingSourceType;
  adapterCategory: AdapterCategory;
  proofOfFundsStatus: "not_submitted" | "submitted" | "verified" | "expired";
  proofReference?: string;
  isConfigured: boolean;
  isApproved: boolean;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
}

// ─── Funding Vault ────────────────────────────────────────────────────────────

export interface TroptionsFundingVault {
  id: string;
  namespaceId: string;
  label: string;
  linkedFundingSourceId: string;
  availableBalance: number; // always 0 unless real adapter confirms
  reservedBalance: number;
  currency: string;
  proofStatus: "manual_record_only" | "adapter_confirmed" | "unverified";
  lastBalanceCheck: string;
  /** When true, balance is manually entered and unconfirmed by any adapter */
  isManualRecord: boolean;
  warningText: string;
}

// ─── Provider Adapter ─────────────────────────────────────────────────────────

export interface TroptionsProviderAdapter {
  id: string;
  namespaceId: string;
  name: string;
  category: AdapterCategory;
  status: AdapterStatus;
  environment: AdapterEnvironment;
  isConfigured: boolean;
  supportsExecution: boolean; // true only for bank_partner/wallet_partner/etc in production
  supportedActions: string[];
  requiredCredentials: string[]; // placeholder labels, no real values stored here
  complianceNotes: string;
  lastHealthCheck?: string;
  healthCheckResult?: "ok" | "degraded" | "error" | "unchecked";
  /** Provider-neutral: only generic descriptions, no official partnership claims */
  description: string;
  configuredAt?: string;
}

// ─── Payout Batch ─────────────────────────────────────────────────────────────

export interface TroptionsPayoutBatch {
  id: string;
  namespaceId: string;
  name: string;
  payoutType: PayoutType;
  status: PayoutStatus;
  adapterId?: string;
  adapterCategory: AdapterCategory;
  payeeIds: string[];
  totalAmount: number;
  currency: string;
  scheduledDate?: string;
  approvalGateStatus: ApprovalGateStatus;
  approvedBy?: string;
  approvedAt?: string;
  complianceStatus: ComplianceStatus;
  complianceBlockReason?: string;
  executionConfirmedAt?: string;
  executionAdapter?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /**
   * EXECUTION RULE: This field is only set when a real configured adapter
   * returns a confirmed execution reference. Never manually set this.
   */
  executionReference?: string;
}

// ─── Payout Item ──────────────────────────────────────────────────────────────

export interface TroptionsPayoutItem {
  id: string;
  batchId: string;
  namespaceId: string;
  payeeId: string;
  payeeName: string;
  payeeEmail: string;
  amount: number;
  currency: string;
  payoutType: PayoutType;
  status: PayoutStatus;
  complianceStatus: ComplianceStatus;
  approvalGateStatus: ApprovalGateStatus;
  scheduledDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /**
   * EXECUTION RULE: Only populated when a real configured adapter confirms execution.
   * Never fake this value.
   */
  transactionHash?: string;
}

// ─── Payout Receipt ───────────────────────────────────────────────────────────

export interface TroptionsPayoutReceipt {
  id: string;
  batchId: string;
  payoutItemId: string;
  namespaceId: string;
  payeeName: string;
  payeeEmail: string;
  amount: number;
  currency: string;
  payoutType: PayoutType;
  status: PayoutStatus;
  proofReference?: string;
  receiptPacketStatus: ReceiptPacketStatus;
  /** Only present if a real adapter confirms. Never fake this. */
  transactionHash?: string;
  issuedAt: string;
  acknowledgedAt?: string;
  exportedAt?: string;
  notes?: string;
}

// ─── Compliance Check ─────────────────────────────────────────────────────────

export interface TroptionsComplianceCheck {
  id: string;
  namespaceId: string;
  entityType: "payee" | "batch" | "namespace";
  entityId: string;
  checkType:
    | "kyc"
    | "kyb"
    | "w9_w8"
    | "sanctions_screening"
    | "approval_gate"
    | "payout_limit"
    | "adapter_approval";
  status: ComplianceStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  expiresAt?: string;
  blockReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit Event ──────────────────────────────────────────────────────────────

export type AuditAction =
  | "payee.created"
  | "payee.updated"
  | "payee.deactivated"
  | "funding_source.created"
  | "funding_source.updated"
  | "vault.balance_record_updated"
  | "payout_batch.created"
  | "payout_batch.submitted_for_approval"
  | "payout_batch.approved"
  | "payout_batch.rejected"
  | "payout_batch.cancelled"
  | "payout_batch.execution_requested"
  | "payout_batch.executed"
  | "payout_batch.failed"
  | "payout_batch.blocked_by_compliance"
  | "payout_item.status_changed"
  | "receipt.generated"
  | "receipt.exported"
  | "compliance.check_created"
  | "compliance.check_updated"
  | "compliance.blocked"
  | "adapter.configured"
  | "adapter.health_checked"
  | "adapter.disabled"
  | "fee_ledger.entry_created"
  | "settings.updated";

export interface TroptionsAuditEvent {
  id: string;
  namespaceId: string;
  action: AuditAction;
  actorId: string;
  actorType: "user" | "system" | "adapter";
  resourceType: string;
  resourceId: string;
  outcome: "success" | "failure" | "blocked";
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

// ─── Fee Ledger ───────────────────────────────────────────────────────────────

export type FeeType =
  | "namespace_subscription"
  | "payout_fee"
  | "compliance_packet_fee"
  | "setup_fee"
  | "adapter_fee"
  | "export_fee"
  | "sponsor_campaign_fee";

export interface TroptionsFeeLedgerEntry {
  id: string;
  namespaceId: string;
  feeType: FeeType;
  description: string;
  amount: number;
  currency: string;
  relatedBatchId?: string;
  relatedPayeeId?: string;
  status: "pending" | "invoiced" | "paid" | "waived";
  createdAt: string;
  paidAt?: string;
}

// ─── Webhook Event ────────────────────────────────────────────────────────────

export interface TroptionsWebhookEvent {
  id: string;
  namespaceId: string;
  eventType: string;
  adapterCategory: AdapterCategory;
  payload: Record<string, unknown>;
  receivedAt: string;
  processedAt?: string;
  status: "received" | "processing" | "processed" | "failed" | "ignored";
  errorMessage?: string;
}

// ─── PayOps Client ────────────────────────────────────────────────────────────

export interface TroptionsPayOpsClient {
  namespaceId: string;
  namespaceSlug: string;
  displayName: string;
  payOpsStatus: "active" | "setup" | "suspended" | "pending_compliance";
  totalPayees: number;
  activePayees: number;
  pendingBatches: number;
  approvedNotExecuted: number;
  executedPayouts: number;
  blockedByCompliance: number;
  fundingVaultStatus: "unfunded" | "manual_record" | "adapter_confirmed";
  estimatedMonthlyFee: number;
  subscriptionTier: "starter" | "growth" | "institutional" | "enterprise";
  activeAdapters: number;
  complianceAlerts: number;
  lastActivity: string;
}

// ─── Dashboard Summary ────────────────────────────────────────────────────────

export interface PayOpsDashboardSummary {
  client: TroptionsPayOpsClient;
  recentAuditEvents: TroptionsAuditEvent[];
  activeAdapters: TroptionsProviderAdapter[];
  complianceAlerts: TroptionsComplianceCheck[];
  pendingBatches: TroptionsPayoutBatch[];
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

export const PAYOUT_TYPE_LABELS: Record<PayoutType, string> = {
  payroll_like_batch: "Payroll-Like Batch",
  contractor_payout: "Contractor Payout",
  vendor_payment: "Vendor Payment",
  sales_commission: "Sales Commission",
  sponsor_revenue_share: "Sponsor Revenue Share",
  creator_payout: "Creator Payout",
  nil_payout: "NIL Payout",
  member_reward: "Member Reward",
  refund_or_credit: "Refund / Credit",
  event_staff_payout: "Event Staff Payout",
  affiliate_commission: "Affiliate Commission",
};

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved_not_executed: "Approved — Not Executed",
  execution_pending: "Execution Pending",
  executed: "Executed",
  failed: "Failed",
  cancelled: "Cancelled",
  blocked_by_compliance: "Blocked by Compliance",
};

export const ADAPTER_CATEGORY_LABELS: Record<AdapterCategory, string> = {
  mock: "Mock Adapter",
  manual_proof: "Manual Proof Adapter",
  bank_partner: "Bank Partner Adapter",
  payroll_partner: "Payroll Partner Adapter",
  wallet_partner: "Wallet Partner Adapter",
  stablecoin_partner: "Stablecoin Partner Adapter",
  card_partner: "Card Partner Adapter",
  accounting_partner: "Accounting Partner Adapter",
  compliance_partner: "Compliance Partner Adapter",
  crm_partner: "CRM Partner Adapter",
  event_partner: "Event Partner Adapter",
};

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  not_started: "Not Started",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
  manual_review: "Manual Review",
  blocked: "Blocked",
};

export const PAYEE_TYPE_LABELS: Record<PayeeType, string> = {
  employee_like: "Employee-Like",
  contractor: "Contractor",
  vendor: "Vendor",
  creator: "Creator",
  sales_rep: "Sales Rep",
  sponsor: "Sponsor",
  affiliate: "Affiliate",
  event_staff: "Event Staff",
  member: "Member",
  other: "Other",
};

export const FUNDING_SOURCE_TYPE_LABELS: Record<FundingSourceType, string> = {
  manual_proof: "Manual Proof of Funds",
  bank_wire: "Bank Wire",
  ach_partner: "ACH Partner",
  stablecoin_wallet: "Stablecoin Wallet",
  card_offRamp: "Card / Off-Ramp",
  internal_credit_ledger: "Internal Credit Ledger",
};

export const FEE_TYPE_LABELS: Record<FeeType, string> = {
  namespace_subscription: "Namespace Subscription",
  payout_fee: "Payout Fee",
  compliance_packet_fee: "Compliance Packet Fee",
  setup_fee: "Setup Fee",
  adapter_fee: "Adapter Fee",
  export_fee: "Export / Receipt Fee",
  sponsor_campaign_fee: "Sponsor Campaign Fee",
};
