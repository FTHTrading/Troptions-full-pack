/**
 * TROPTIONS PayOps — Adapter Registry
 *
 * Provider-neutral adapter definitions.
 *
 * BRAND SAFETY RULES:
 * - No third-party logos
 * - No official partnership claims
 * - Generic provider language unless a real contract/integration exists
 * - Adapters are "compatible with approved providers" not "official partners"
 */

import type {
  TroptionsProviderAdapter,
  AdapterCategory,
  AdapterStatus,
} from "./types";

// ─── Adapter Catalog ──────────────────────────────────────────────────────────

export const PAYOPS_ADAPTER_CATALOG: Omit<
  TroptionsProviderAdapter,
  "id" | "namespaceId" | "configuredAt" | "lastHealthCheck" | "healthCheckResult"
>[] = [
  {
    name: "Mock Execution Adapter",
    category: "mock",
    status: "approved",
    environment: "mock",
    isConfigured: true,
    supportsExecution: false, // mock cannot produce "executed" status
    supportedActions: ["create_batch", "approve_batch", "generate_receipt"],
    requiredCredentials: [],
    complianceNotes:
      "Mock adapter is for testing and demonstration only. Payouts cap at approved_not_executed.",
    description:
      "Built-in simulation adapter. No real funds are moved. All payouts remain in approved_not_executed state.",
  },
  {
    name: "Manual Proof Adapter",
    category: "manual_proof",
    status: "approved",
    environment: "mock",
    isConfigured: true,
    supportsExecution: false, // manual proof cannot produce "executed" status
    supportedActions: [
      "create_batch",
      "approve_batch",
      "attach_proof_document",
      "generate_receipt",
      "export_audit_packet",
    ],
    requiredCredentials: [],
    complianceNotes:
      "Manual proof records are operator-entered and unconfirmed by any third-party system. Not a substitute for licensed payroll or banking compliance.",
    description:
      "Operator attaches proof-of-funds documents and manually records payment confirmations. Payouts remain approved_not_executed until a live adapter is connected.",
  },
  {
    name: "Bank Partner Adapter",
    category: "bank_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: true,
    supportedActions: [
      "ach_transfer",
      "wire_transfer",
      "batch_payroll",
      "vendor_payment",
      "reconciliation",
    ],
    requiredCredentials: [
      "API_KEY (from approved banking provider)",
      "ROUTING_NUMBER_VAULT",
      "PARTNER_CLIENT_ID",
      "WEBHOOK_SECRET",
    ],
    complianceNotes:
      "Requires a contract with an approved banking partner. KYB verification required before activation. ACH and wire rules apply.",
    description:
      "Compatible with approved bank and ACH payment providers. Requires configuration and compliance review before activation.",
  },
  {
    name: "Payroll Partner Adapter",
    category: "payroll_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: true,
    supportedActions: [
      "payroll_run",
      "contractor_payment",
      "tax_document_management",
      "direct_deposit",
    ],
    requiredCredentials: [
      "PAYROLL_PROVIDER_API_KEY",
      "COMPANY_EIN_VAULT",
      "WORKER_ONBOARDING_TOKEN",
    ],
    complianceNotes:
      "TROPTIONS is not a licensed payroll provider. This adapter routes to an approved third-party payroll provider. W-9/W-8 collection and tax filing are the provider's responsibility.",
    description:
      "Compatible with approved payroll service providers. TROPTIONS manages the approval workflow; the partner provider handles the licensed payroll execution.",
  },
  {
    name: "Wallet Partner Adapter",
    category: "wallet_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: true,
    supportedActions: [
      "wallet_transfer",
      "batch_wallet_payout",
      "balance_query",
      "transaction_confirmation",
    ],
    requiredCredentials: [
      "WALLET_PROVIDER_API_KEY",
      "CUSTODY_ACCOUNT_ID",
      "WEBHOOK_SIGNING_KEY",
    ],
    complianceNotes:
      "Wallet transfers require KYC/AML compliance per the wallet provider's rules. Blockchain settlement is irreversible.",
    description:
      "Compatible with approved digital wallet providers. Supports batch wallet payouts to pre-verified wallet addresses.",
  },
  {
    name: "Stablecoin Partner Adapter",
    category: "stablecoin_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: true,
    supportedActions: [
      "stablecoin_transfer",
      "batch_stablecoin_payout",
      "on_ramp",
      "off_ramp",
      "balance_query",
    ],
    requiredCredentials: [
      "STABLECOIN_PROVIDER_API_KEY",
      "ISSUER_ACCOUNT_ID",
      "COMPLIANCE_PARTNER_TOKEN",
    ],
    complianceNotes:
      "Stablecoin operations require compliance with applicable securities, money transmission, and AML/KYC regulations. Legal review required.",
    description:
      "Compatible with approved stablecoin issuers and settlement providers. Requires compliance review and partner approval before activation.",
  },
  {
    name: "Card Partner Adapter",
    category: "card_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: true,
    supportedActions: [
      "card_payout",
      "virtual_card_issue",
      "off_ramp_settlement",
    ],
    requiredCredentials: [
      "CARD_PROGRAM_API_KEY",
      "ISSUER_BIN",
      "CARDHOLDER_KYC_TOKEN",
    ],
    complianceNotes:
      "Card payouts require a card program agreement and issuing bank approval. Cardholder KYC is required.",
    description:
      "Compatible with approved card payout and virtual card providers. Enables payout to prepaid or virtual card accounts.",
  },
  {
    name: "Accounting Partner Adapter",
    category: "accounting_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: false,
    supportedActions: ["sync_transactions", "export_ledger", "reconcile_payouts", "chart_of_accounts"],
    requiredCredentials: [
      "ACCOUNTING_PLATFORM_API_KEY",
      "ORG_ID",
    ],
    complianceNotes: "Accounting sync does not authorize or execute payments.",
    description:
      "Compatible with approved accounting platforms. Syncs payout records for bookkeeping and reconciliation.",
  },
  {
    name: "Compliance Partner Adapter",
    category: "compliance_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: false,
    supportedActions: [
      "kyc_check",
      "kyb_check",
      "sanctions_screening",
      "w9_collection",
      "id_verification",
    ],
    requiredCredentials: [
      "COMPLIANCE_PROVIDER_API_KEY",
      "PROGRAM_ID",
    ],
    complianceNotes:
      "Compliance checks do not guarantee regulatory approval. Legal counsel required for regulated activities.",
    description:
      "Compatible with approved identity and compliance verification providers. Supports KYC, KYB, sanctions screening, and W-9/W-8 collection.",
  },
  {
    name: "CRM Partner Adapter",
    category: "crm_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: false,
    supportedActions: ["sync_contacts", "push_payout_events", "pull_payee_data"],
    requiredCredentials: ["CRM_API_KEY", "ORG_WORKSPACE_ID"],
    complianceNotes: "CRM sync does not authorize payments.",
    description:
      "Compatible with approved CRM platforms. Syncs payee and payout event data for relationship management.",
  },
  {
    name: "Event Partner Adapter",
    category: "event_partner",
    status: "not_configured",
    environment: "sandbox",
    isConfigured: false,
    supportsExecution: false,
    supportedActions: [
      "pull_event_staff",
      "sync_sponsor_data",
      "push_payout_status",
    ],
    requiredCredentials: ["EVENT_PLATFORM_API_KEY", "EVENT_ID"],
    complianceNotes: "Event data sync does not execute payments.",
    description:
      "Compatible with approved event management platforms. Imports event staff and sponsor data for payout batch creation.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAdaptersByCategory(
  adapters: TroptionsProviderAdapter[],
  category: AdapterCategory
): TroptionsProviderAdapter[] {
  return adapters.filter((a) => a.category === category);
}

export function getActiveAdapters(
  adapters: TroptionsProviderAdapter[]
): TroptionsProviderAdapter[] {
  return adapters.filter(
    (a) => a.status === "approved" && a.isConfigured
  );
}

export function canAdapterExecutePayouts(
  adapter: TroptionsProviderAdapter
): boolean {
  return (
    adapter.supportsExecution &&
    adapter.isConfigured &&
    adapter.status === "approved" &&
    adapter.environment === "production"
  );
}

export const ADAPTER_STATUS_LABELS: Record<AdapterStatus, string> = {
  not_configured: "Not Configured",
  sandbox: "Sandbox",
  pending_review: "Pending Review",
  approved: "Approved",
  disabled: "Disabled",
  error: "Error",
};

export const ADAPTER_STATUS_COLORS: Record<
  AdapterStatus,
  { text: string; bg: string; border: string }
> = {
  not_configured: {
    text: "text-slate-400",
    bg: "bg-slate-800/60",
    border: "border-slate-600/50",
  },
  sandbox: {
    text: "text-blue-300",
    bg: "bg-blue-900/60",
    border: "border-blue-700/50",
  },
  pending_review: {
    text: "text-yellow-300",
    bg: "bg-yellow-900/60",
    border: "border-yellow-700/50",
  },
  approved: {
    text: "text-emerald-300",
    bg: "bg-emerald-900/60",
    border: "border-emerald-700/50",
  },
  disabled: {
    text: "text-gray-400",
    bg: "bg-gray-800/60",
    border: "border-gray-600/50",
  },
  error: {
    text: "text-red-300",
    bg: "bg-red-900/60",
    border: "border-red-700/50",
  },
};
