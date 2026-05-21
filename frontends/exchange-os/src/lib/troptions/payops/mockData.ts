/**
 * TROPTIONS PayOps — Mock Seed Data
 *
 * Provides realistic seed data so all pages render without a live database.
 * This is demonstration data only. No real funds, real payees, or real transactions.
 *
 * BRAND RULE: TROPTIONS-only. No FTH, FTHX, FTHG references.
 */

import type {
  TroptionsPayee,
  TroptionsFundingSource,
  TroptionsFundingVault,
  TroptionsPayoutBatch,
  TroptionsPayoutItem,
  TroptionsPayoutReceipt,
  TroptionsComplianceCheck,
  TroptionsAuditEvent,
  TroptionsFeeLedgerEntry,
  TroptionsProviderAdapter,
  TroptionsPayOpsClient,
} from "./types";
import { PAYOPS_ADAPTER_CATALOG } from "./adapters";

// ─── Namespace Client ─────────────────────────────────────────────────────────

export function getMockPayOpsClient(namespaceSlug: string): TroptionsPayOpsClient {
  return {
    namespaceId: `ns-payops-${namespaceSlug}`,
    namespaceSlug,
    displayName: namespaceSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    payOpsStatus: "setup",
    totalPayees: 6,
    activePayees: 4,
    pendingBatches: 2,
    approvedNotExecuted: 1,
    executedPayouts: 0, // Always 0 — no live adapter configured
    blockedByCompliance: 1,
    fundingVaultStatus: "manual_record",
    estimatedMonthlyFee: 499,
    subscriptionTier: "growth",
    activeAdapters: 2, // mock + manual_proof
    complianceAlerts: 3,
    lastActivity: "2026-05-04T09:00:00Z",
  };
}

// ─── Payees ───────────────────────────────────────────────────────────────────

export function getMockPayees(namespaceId: string): TroptionsPayee[] {
  return [
    {
      id: "payee-001",
      namespaceId,
      name: "Jordan M. Williams",
      email: "jordan.williams@example.com",
      payeeType: "contractor",
      payoutPreference: "bank_transfer",
      complianceStatus: "approved",
      kycStatus: "approved",
      w9w8Status: "approved",
      sanctionsScreeningStatus: "approved",
      isActive: true,
      lastPayoutDate: undefined,
      totalPaidAmount: 0,
      currency: "USD",
      notes: "Technical contractor — systems integration",
      createdAt: "2026-04-01T10:00:00Z",
      updatedAt: "2026-04-15T10:00:00Z",
    },
    {
      id: "payee-002",
      namespaceId,
      name: "Alexis R. Carter",
      email: "alexis.carter@example.com",
      payeeType: "creator",
      payoutPreference: "stablecoin_wallet",
      walletAddress: "0x...placeholder",
      complianceStatus: "pending",
      kycStatus: "pending",
      w9w8Status: "not_started",
      sanctionsScreeningStatus: "not_started",
      isActive: true,
      totalPaidAmount: 0,
      currency: "USD",
      notes: "Content creator — NIL campaign",
      createdAt: "2026-04-05T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "payee-003",
      namespaceId,
      name: "Summit Events LLC",
      email: "billing@summitevents.example.com",
      payeeType: "vendor",
      payoutPreference: "bank_transfer",
      complianceStatus: "approved",
      kycStatus: "approved",
      w9w8Status: "approved",
      sanctionsScreeningStatus: "approved",
      isActive: true,
      totalPaidAmount: 0,
      currency: "USD",
      notes: "Venue and event logistics vendor",
      createdAt: "2026-03-20T10:00:00Z",
      updatedAt: "2026-04-20T10:00:00Z",
    },
    {
      id: "payee-004",
      namespaceId,
      name: "Marcus D. Thompson",
      email: "marcus.thompson@example.com",
      payeeType: "sales_rep",
      payoutPreference: "bank_transfer",
      complianceStatus: "approved",
      kycStatus: "approved",
      w9w8Status: "approved",
      sanctionsScreeningStatus: "approved",
      isActive: true,
      totalPaidAmount: 0,
      currency: "USD",
      notes: "Enterprise sales — commission eligible",
      createdAt: "2026-04-10T10:00:00Z",
      updatedAt: "2026-04-10T10:00:00Z",
    },
    {
      id: "payee-005",
      namespaceId,
      name: "Priya Nair",
      email: "priya.nair@example.com",
      payeeType: "affiliate",
      payoutPreference: "not_configured",
      complianceStatus: "blocked",
      kycStatus: "rejected",
      w9w8Status: "not_started",
      sanctionsScreeningStatus: "blocked",
      isActive: false,
      totalPaidAmount: 0,
      currency: "USD",
      notes: "BLOCKED — compliance review required",
      createdAt: "2026-04-12T10:00:00Z",
      updatedAt: "2026-05-03T10:00:00Z",
    },
    {
      id: "payee-006",
      namespaceId,
      name: "Cornerstone Sponsors Inc.",
      email: "payments@cornerstonesponsors.example.com",
      payeeType: "sponsor",
      payoutPreference: "bank_transfer",
      complianceStatus: "pending",
      kycStatus: "pending",
      w9w8Status: "not_started",
      sanctionsScreeningStatus: "pending",
      isActive: true,
      totalPaidAmount: 0,
      currency: "USD",
      notes: "Sponsor revenue share — Q2 campaign",
      createdAt: "2026-04-28T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
  ];
}

// ─── Funding Sources ──────────────────────────────────────────────────────────

export function getMockFundingSources(namespaceId: string): TroptionsFundingSource[] {
  return [
    {
      id: "fsrc-001",
      namespaceId,
      label: "Operating Account — Manual Proof Record",
      sourceType: "manual_proof",
      adapterCategory: "manual_proof",
      proofOfFundsStatus: "submitted",
      proofReference: "POF-2026-04-001",
      isConfigured: true,
      isApproved: false, // Manual records are not approved by a third party
      notes: "Manually entered proof of funds. Not confirmed by a banking adapter.",
      lastUpdated: "2026-04-15T10:00:00Z",
      createdAt: "2026-04-15T10:00:00Z",
    },
    {
      id: "fsrc-002",
      namespaceId,
      label: "Bank Wire — Adapter Not Configured",
      sourceType: "bank_wire",
      adapterCategory: "bank_partner",
      proofOfFundsStatus: "not_submitted",
      isConfigured: false,
      isApproved: false,
      notes: "Bank partner adapter required. Contact TROPTIONS to configure.",
      lastUpdated: "2026-05-01T10:00:00Z",
      createdAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "fsrc-003",
      namespaceId,
      label: "Stablecoin Wallet — Adapter Not Configured",
      sourceType: "stablecoin_wallet",
      adapterCategory: "stablecoin_partner",
      proofOfFundsStatus: "not_submitted",
      isConfigured: false,
      isApproved: false,
      notes: "Stablecoin adapter requires compliance review and partner approval.",
      lastUpdated: "2026-05-01T10:00:00Z",
      createdAt: "2026-05-01T10:00:00Z",
    },
  ];
}

// ─── Funding Vault ────────────────────────────────────────────────────────────

export function getMockFundingVault(namespaceId: string): TroptionsFundingVault {
  return {
    id: "vault-001",
    namespaceId,
    label: "Primary PayOps Vault",
    linkedFundingSourceId: "fsrc-001",
    availableBalance: 0, // Always 0 until a real adapter confirms
    reservedBalance: 0,
    currency: "USD",
    proofStatus: "manual_record_only",
    lastBalanceCheck: "2026-05-04T09:00:00Z",
    isManualRecord: true,
    warningText:
      "Vault balance is a manual record only. No banking adapter is configured. Actual available funds are not confirmed by TROPTIONS.",
  };
}

// ─── Payout Batches ───────────────────────────────────────────────────────────

export function getMockPayoutBatches(namespaceId: string): TroptionsPayoutBatch[] {
  return [
    {
      id: "batch-001",
      namespaceId,
      name: "Q2 Contractor Payout — May 2026",
      payoutType: "contractor_payout",
      status: "pending_approval",
      adapterCategory: "manual_proof",
      payeeIds: ["payee-001", "payee-004"],
      totalAmount: 7500,
      currency: "USD",
      scheduledDate: "2026-05-15",
      approvalGateStatus: "pending",
      complianceStatus: "approved",
      notes: "Monthly contractor payout — two payees",
      createdAt: "2026-05-01T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "batch-002",
      namespaceId,
      name: "Sales Commission — April 2026",
      payoutType: "sales_commission",
      status: "approved_not_executed",
      adapterCategory: "manual_proof",
      payeeIds: ["payee-004"],
      totalAmount: 3200,
      currency: "USD",
      scheduledDate: "2026-05-10",
      approvalGateStatus: "approved",
      approvedBy: "operator-admin",
      approvedAt: "2026-05-02T10:00:00Z",
      complianceStatus: "approved",
      notes: "April commission — awaiting bank adapter configuration",
      createdAt: "2026-04-30T10:00:00Z",
      updatedAt: "2026-05-02T10:00:00Z",
    },
    {
      id: "batch-003",
      namespaceId,
      name: "Creator NIL Payout — Spring Campaign",
      payoutType: "nil_payout",
      status: "blocked_by_compliance",
      adapterCategory: "mock",
      payeeIds: ["payee-002"],
      totalAmount: 1500,
      currency: "USD",
      approvalGateStatus: "pending",
      complianceStatus: "blocked",
      complianceBlockReason:
        "Payee KYC not completed. W-9 not collected. Sanctions screening not performed.",
      notes: "NIL payout — blocked pending compliance",
      createdAt: "2026-05-02T10:00:00Z",
      updatedAt: "2026-05-03T10:00:00Z",
    },
    {
      id: "batch-004",
      namespaceId,
      name: "Vendor Settlement — Summit Events LLC",
      payoutType: "vendor_payment",
      status: "draft",
      adapterCategory: "manual_proof",
      payeeIds: ["payee-003"],
      totalAmount: 12000,
      currency: "USD",
      approvalGateStatus: "not_required",
      complianceStatus: "approved",
      notes: "Event venue invoice — awaiting final approval",
      createdAt: "2026-05-03T10:00:00Z",
      updatedAt: "2026-05-03T10:00:00Z",
    },
  ];
}

// ─── Payout Items ─────────────────────────────────────────────────────────────

export function getMockPayoutItems(namespaceId: string): TroptionsPayoutItem[] {
  return [
    {
      id: "item-001",
      batchId: "batch-001",
      namespaceId,
      payeeId: "payee-001",
      payeeName: "Jordan M. Williams",
      payeeEmail: "jordan.williams@example.com",
      amount: 5000,
      currency: "USD",
      payoutType: "contractor_payout",
      status: "pending_approval",
      complianceStatus: "approved",
      approvalGateStatus: "pending",
      scheduledDate: "2026-05-15",
      createdAt: "2026-05-01T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "item-002",
      batchId: "batch-001",
      namespaceId,
      payeeId: "payee-004",
      payeeName: "Marcus D. Thompson",
      payeeEmail: "marcus.thompson@example.com",
      amount: 2500,
      currency: "USD",
      payoutType: "contractor_payout",
      status: "pending_approval",
      complianceStatus: "approved",
      approvalGateStatus: "pending",
      scheduledDate: "2026-05-15",
      createdAt: "2026-05-01T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "item-003",
      batchId: "batch-002",
      namespaceId,
      payeeId: "payee-004",
      payeeName: "Marcus D. Thompson",
      payeeEmail: "marcus.thompson@example.com",
      amount: 3200,
      currency: "USD",
      payoutType: "sales_commission",
      status: "approved_not_executed",
      complianceStatus: "approved",
      approvalGateStatus: "approved",
      scheduledDate: "2026-05-10",
      createdAt: "2026-04-30T10:00:00Z",
      updatedAt: "2026-05-02T10:00:00Z",
    },
  ];
}

// ─── Receipts ─────────────────────────────────────────────────────────────────

export function getMockReceipts(namespaceId: string): TroptionsPayoutReceipt[] {
  return [
    {
      id: "rcpt-001",
      batchId: "batch-002",
      payoutItemId: "item-003",
      namespaceId,
      payeeName: "Marcus D. Thompson",
      payeeEmail: "marcus.thompson@example.com",
      amount: 3200,
      currency: "USD",
      payoutType: "sales_commission",
      status: "approved_not_executed",
      proofReference: "MANUAL-PROOF-2026-05-001",
      receiptPacketStatus: "draft",
      issuedAt: "2026-05-02T10:00:00Z",
      notes: "Approved — awaiting bank adapter for execution",
    },
  ];
}

// ─── Compliance Checks ────────────────────────────────────────────────────────

export function getMockComplianceChecks(namespaceId: string): TroptionsComplianceCheck[] {
  return [
    {
      id: "comp-001",
      namespaceId,
      entityType: "namespace",
      entityId: namespaceId,
      checkType: "kyb",
      status: "pending",
      notes: "KYB documentation requested — awaiting submission",
      createdAt: "2026-04-01T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "comp-002",
      namespaceId,
      entityType: "payee",
      entityId: "payee-002",
      checkType: "kyc",
      status: "pending",
      notes: "KYC verification in progress for creator payee",
      createdAt: "2026-04-05T10:00:00Z",
      updatedAt: "2026-05-01T10:00:00Z",
    },
    {
      id: "comp-003",
      namespaceId,
      entityType: "payee",
      entityId: "payee-005",
      checkType: "sanctions_screening",
      status: "blocked",
      blockReason: "Sanctions screening returned a potential match — manual review required",
      createdAt: "2026-04-12T10:00:00Z",
      updatedAt: "2026-05-03T10:00:00Z",
    },
    {
      id: "comp-004",
      namespaceId,
      entityType: "batch",
      entityId: "batch-003",
      checkType: "approval_gate",
      status: "blocked",
      blockReason: "Batch blocked — payee compliance incomplete",
      createdAt: "2026-05-02T10:00:00Z",
      updatedAt: "2026-05-03T10:00:00Z",
    },
  ];
}

// ─── Audit Events ─────────────────────────────────────────────────────────────

export function getMockAuditEvents(namespaceId: string): TroptionsAuditEvent[] {
  return [
    {
      id: "audit-p-001",
      namespaceId,
      action: "payout_batch.created",
      actorId: "operator-admin",
      actorType: "user",
      resourceType: "payout_batch",
      resourceId: "batch-001",
      outcome: "success",
      metadata: { batchName: "Q2 Contractor Payout — May 2026" },
      timestamp: "2026-05-01T10:00:00Z",
    },
    {
      id: "audit-p-002",
      namespaceId,
      action: "payout_batch.approved",
      actorId: "operator-admin",
      actorType: "user",
      resourceType: "payout_batch",
      resourceId: "batch-002",
      outcome: "success",
      metadata: { batchName: "Sales Commission — April 2026" },
      timestamp: "2026-05-02T10:00:00Z",
    },
    {
      id: "audit-p-003",
      namespaceId,
      action: "payout_batch.blocked_by_compliance",
      actorId: "system",
      actorType: "system",
      resourceType: "payout_batch",
      resourceId: "batch-003",
      outcome: "blocked",
      metadata: { reason: "Payee KYC not completed" },
      timestamp: "2026-05-03T10:00:00Z",
    },
    {
      id: "audit-p-004",
      namespaceId,
      action: "payee.created",
      actorId: "operator-admin",
      actorType: "user",
      resourceType: "payee",
      resourceId: "payee-006",
      outcome: "success",
      metadata: { payeeName: "Cornerstone Sponsors Inc." },
      timestamp: "2026-04-28T10:00:00Z",
    },
    {
      id: "audit-p-005",
      namespaceId,
      action: "compliance.blocked",
      actorId: "system",
      actorType: "system",
      resourceType: "payee",
      resourceId: "payee-005",
      outcome: "blocked",
      metadata: { reason: "Sanctions screening match" },
      timestamp: "2026-05-03T10:00:00Z",
    },
    {
      id: "audit-p-006",
      namespaceId,
      action: "receipt.generated",
      actorId: "system",
      actorType: "system",
      resourceType: "receipt",
      resourceId: "rcpt-001",
      outcome: "success",
      metadata: { batchId: "batch-002" },
      timestamp: "2026-05-02T10:05:00Z",
    },
  ];
}

// ─── Fee Ledger ───────────────────────────────────────────────────────────────

export function getMockFeeLedger(namespaceId: string): TroptionsFeeLedgerEntry[] {
  return [
    {
      id: "fee-001",
      namespaceId,
      feeType: "namespace_subscription",
      description: "TROPTIONS PayOps — Growth Tier — May 2026",
      amount: 499,
      currency: "USD",
      status: "invoiced",
      createdAt: "2026-05-01T00:00:00Z",
    },
    {
      id: "fee-002",
      namespaceId,
      feeType: "setup_fee",
      description: "PayOps namespace setup and onboarding",
      amount: 1000,
      currency: "USD",
      status: "paid",
      createdAt: "2026-04-01T00:00:00Z",
      paidAt: "2026-04-05T00:00:00Z",
    },
    {
      id: "fee-003",
      namespaceId,
      feeType: "payout_fee",
      description: "Estimated payout fee — batch-002 ($3,200 × 1%)",
      amount: 32,
      currency: "USD",
      relatedBatchId: "batch-002",
      status: "pending",
      createdAt: "2026-05-02T10:00:00Z",
    },
  ];
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

export function getMockAdapters(namespaceId: string): TroptionsProviderAdapter[] {
  return PAYOPS_ADAPTER_CATALOG.map((template, i) => ({
    ...template,
    id: `adapter-${String(i + 1).padStart(3, "0")}`,
    namespaceId,
    lastHealthCheck:
      template.category === "mock" || template.category === "manual_proof"
        ? "2026-05-04T09:00:00Z"
        : undefined,
    healthCheckResult:
      template.category === "mock" || template.category === "manual_proof"
        ? ("ok" as const)
        : ("unchecked" as const),
    configuredAt:
      template.category === "mock" || template.category === "manual_proof"
        ? "2026-04-01T10:00:00Z"
        : undefined,
  }));
}
