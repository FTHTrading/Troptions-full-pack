/**
 * TROPTIONS Networks — Registry of all network adapter shells.
 *
 * These are SAFE adapter shells — no real keys, no fake tx hashes.
 * executionEnabled is always false until real credentials are configured
 * and a real provider confirms.
 */

import { createNetworkAdapterShell } from "../platform/networkAdapters";
import type { TroptionsNetworkAdapter } from "../platform/networkAdapters";

export const NETWORK_ADAPTER_REGISTRY: TroptionsNetworkAdapter[] = [
  createNetworkAdapterShell({
    adapterId: "net-xrpl",
    networkName: "XRP Ledger",
    networkType: "xrpl",
    supportedCapabilities: [
      "wallet_reference",
      "token_reference",
      "proof_of_funds_reference",
      "bridge_readiness",
    ],
    requiredCredentials: ["XRPL_WALLET_SEED", "XRPL_NODE_URL"],
    supportedEnvironments: ["testnet", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "XRP Ledger integration requires legal review for money transmission.",
      "TROPTIONS does not claim to be a licensed XRP issuer.",
    ],
    auditNotes: "All XRPL transactions must be recorded in audit ledger.",
    notes:
      "XRPL adapter shell ready. Credentials and compliance review required before mainnet.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-stellar",
    networkName: "Stellar Network",
    networkType: "stellar",
    supportedCapabilities: [
      "wallet_reference",
      "stablecoin_reference",
      "bridge_readiness",
    ],
    requiredCredentials: ["STELLAR_SECRET_KEY", "STELLAR_HORIZON_URL"],
    supportedEnvironments: ["testnet", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "Stellar integration requires compliance review for cross-border payments.",
    ],
    auditNotes: "All Stellar transactions must be recorded in audit ledger.",
    notes: "Stellar adapter shell ready. Credentials required.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-evm",
    networkName: "EVM — Ethereum Compatible",
    networkType: "evm",
    supportedCapabilities: [
      "wallet_reference",
      "stablecoin_reference",
      "token_reference",
      "smart_contract_template",
    ],
    requiredCredentials: ["EVM_PRIVATE_KEY", "EVM_RPC_URL", "EVM_CHAIN_ID"],
    supportedEnvironments: ["testnet", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "EVM smart contract deployment requires legal review.",
      "Token issuance on EVM requires securities/utility analysis.",
    ],
    auditNotes: "All EVM transactions require audit records.",
    notes: "EVM adapter shell ready. Legal review required before mainnet.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-solana",
    networkName: "Solana",
    networkType: "solana",
    supportedCapabilities: ["wallet_reference", "token_reference"],
    requiredCredentials: ["SOLANA_PRIVATE_KEY", "SOLANA_RPC_URL"],
    supportedEnvironments: ["testnet", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "Solana integration requires compliance review for token operations.",
    ],
    auditNotes: "All Solana transactions must be recorded.",
    notes: "Solana adapter shell ready. Credentials required.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-bitcoin",
    networkName: "Bitcoin",
    networkType: "bitcoin",
    supportedCapabilities: ["wallet_reference", "proof_of_funds_reference"],
    requiredCredentials: ["BITCOIN_XPUB_OR_DESCRIPTOR", "BITCOIN_NODE_URL"],
    supportedEnvironments: ["mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "Bitcoin wallet operations require AML review.",
      "Large bitcoin transactions may require suspicious activity monitoring.",
    ],
    auditNotes: "Bitcoin address references must be logged in audit trail.",
    notes: "Bitcoin adapter shell ready. Credentials required.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-stablecoin",
    networkName: "Stablecoin Provider",
    networkType: "stablecoin_provider",
    supportedCapabilities: [
      "stablecoin_reference",
      "payout_batching",
      "payment_readiness",
    ],
    requiredCredentials: [
      "STABLECOIN_PROVIDER_KEY",
      "STABLECOIN_PROVIDER_SECRET",
      "PROVIDER_ACCOUNT_ID",
    ],
    supportedEnvironments: ["simulation", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "Stablecoin execution requires provider agreement and compliance approval.",
      "TROPTIONS is not a stablecoin issuer unless legal structure exists.",
    ],
    auditNotes: "All stablecoin payout batches must generate audit events.",
    notes:
      "Stablecoin provider adapter shell ready. Provider agreement and credentials required.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-bank-partner",
    networkName: "Bank Partner (ACH/Wire)",
    networkType: "bank_partner",
    supportedCapabilities: [
      "payment_readiness",
      "payout_batching",
    ],
    requiredCredentials: [
      "BANK_PARTNER_API_KEY",
      "BANK_PARTNER_SECRET",
      "BANK_ACCOUNT_ID",
    ],
    supportedEnvironments: ["simulation", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "ACH/wire execution requires bank partner agreement.",
      "TROPTIONS is not a bank or money transmitter.",
    ],
    auditNotes: "All ACH/wire batches must generate audit events.",
    notes: "Bank partner adapter shell ready. Agreement and credentials required.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-payroll-partner",
    networkName: "Payroll Partner",
    networkType: "payroll_partner",
    supportedCapabilities: ["payout_batching", "receipt_generation"],
    requiredCredentials: ["PAYROLL_PARTNER_KEY", "PAYROLL_COMPANY_ID"],
    supportedEnvironments: ["simulation", "mainnet"],
    readinessStatus: "credentials_required",
    isConfigured: false,
    complianceNotes: [
      "Payroll execution requires a licensed payroll partner agreement.",
      "TROPTIONS is not a licensed payroll provider.",
    ],
    auditNotes: "All payroll batches must generate audit events with receipts.",
    notes:
      "Payroll partner adapter shell ready. Licensed payroll partner agreement required.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-manual-proof",
    networkName: "Manual Proof",
    networkType: "manual_proof",
    supportedCapabilities: [
      "proof_of_funds_reference",
      "audit_trail",
    ],
    requiredCredentials: [],
    supportedEnvironments: ["simulation"],
    readinessStatus: "mock_only",
    isConfigured: true,
    complianceNotes: [
      "Manual proof adapter does not execute live transactions.",
      "Cannot produce executed_confirmed status.",
      "Use for documentation and planning only.",
    ],
    auditNotes: "Manual proof events are audit-only records.",
    notes:
      "Manual proof adapter — simulation only. No real money movement. Cannot produce executed_confirmed.",
  }),
  createNetworkAdapterShell({
    adapterId: "net-internal-ledger",
    networkName: "Internal Ledger",
    networkType: "internal_ledger",
    supportedCapabilities: ["audit_trail", "receipt_generation"],
    requiredCredentials: [],
    supportedEnvironments: ["simulation"],
    readinessStatus: "mock_only",
    isConfigured: true,
    complianceNotes: [
      "Internal ledger is for record-keeping only.",
      "Does not represent settled funds.",
    ],
    auditNotes: "Internal ledger entries are operational records, not legal settlements.",
    notes:
      "Internal ledger adapter — mock/simulation only. No external settlement.",
  }),
];

export function getNetworkAdapterById(
  adapterId: string
): TroptionsNetworkAdapter | undefined {
  return NETWORK_ADAPTER_REGISTRY.find((a) => a.adapterId === adapterId);
}

export function getAdaptersByNetworkType(
  networkType: string
): TroptionsNetworkAdapter[] {
  return NETWORK_ADAPTER_REGISTRY.filter((a) => a.networkType === networkType);
}

export function generateNetworkReadinessReport(): {
  adapters: TroptionsNetworkAdapter[];
  configuredCount: number;
  requiresCredentials: string[];
  mockOnly: string[];
  readyForMainnet: string[];
} {
  const adapters = NETWORK_ADAPTER_REGISTRY;
  const configuredCount = adapters.filter((a) => a.isConfigured).length;
  const requiresCredentials = adapters
    .filter((a) => a.readinessStatus === "credentials_required")
    .map((a) => a.networkName);
  const mockOnly = adapters
    .filter((a) => a.readinessStatus === "mock_only")
    .map((a) => a.networkName);
  const readyForMainnet = adapters
    .filter((a) => a.readinessStatus === "mainnet_ready")
    .map((a) => a.networkName);

  return { adapters, configuredCount, requiresCredentials, mockOnly, readyForMainnet };
}
