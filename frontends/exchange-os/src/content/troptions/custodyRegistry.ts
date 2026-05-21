/**
 * Troptions Custody Registry
 * All custody routes, providers, and vault access controls for
 * Troptions digital and physical assets.
 *
 * RULES:
 * - No asset may be represented as "custodied" without a signed custody agreement
 * - Multi-sig quorum must be documented and board-approved
 * - Hot wallet balances must be under insurance-covered limits
 * - Physical vault entries require vault receipt and chain-of-custody documentation
 */

export type CustodyType =
  | "institutional-digital"
  | "bank-escrow"
  | "physical-vault"
  | "smart-contract-escrow"
  | "self-custody-cold"
  | "multi-sig";

export type CustodyStatus = "active" | "evaluation" | "pending-agreement" | "suspended";

export interface CustodyProvider {
  custodyId: string;
  name: string;
  type: CustodyType;
  supportedAssets: string[];
  chains: string[];
  agreementStatus: string;
  insuranceCoverage: string;
  regulatoryStatus: string;
  multiSigConfig: string;
  hotWalletLimit: string;
  coldWalletPolicy: string;
  reportingCadence: string;
  status: CustodyStatus;
  riskNotes: string;
  nextAction: string;
}

export const CUSTODY_REGISTRY: CustodyProvider[] = [
  {
    custodyId: "CUST-FIREBLOCKS-001",
    name: "Fireblocks",
    type: "institutional-digital",
    supportedAssets: ["BTC", "ETH", "USDC", "USDT", "XRP", "SOL", "Troptions tokens (pending integration)"],
    chains: ["Bitcoin", "Ethereum", "Solana", "XRPL", "Polygon", "Arbitrum", "Base"],
    agreementStatus: "evaluation — agreement required before activation",
    insuranceCoverage: "Fireblocks provides insurance subject to terms. Review specific coverage limits.",
    regulatoryStatus: "Licensed / regulated custodian. Subject to jurisdiction-specific requirements.",
    multiSigConfig: "MPC-based (no traditional multi-sig). Quorum policy must be configured.",
    hotWalletLimit: "Per Fireblocks policy and Troptions internal limits. Define before activation.",
    coldWalletPolicy: "Cold wallet policy must be defined with Fireblocks and board-approved.",
    reportingCadence: "Daily transaction reports. Monthly custody attestation.",
    status: "evaluation",
    riskNotes: "MPC key management risk. Integration engineering required. Policy configuration required before production.",
    nextAction: "Execute Fireblocks MSA. Define quorum, hot wallet limits, cold wallet policy, and reporting cadence.",
  },
  {
    custodyId: "CUST-ANCHORAGE-001",
    name: "Anchorage Digital",
    type: "institutional-digital",
    supportedAssets: ["BTC", "ETH", "USDC", "SOL", "XRP", "selected ERC-20"],
    chains: ["Bitcoin", "Ethereum", "Solana", "XRPL"],
    agreementStatus: "evaluation",
    insuranceCoverage: "Anchorage Digital is a federally chartered digital asset bank (OCC). Subject to bank-level regulatory oversight.",
    regulatoryStatus: "OCC-chartered national trust bank (USA). Highest regulatory custody standard in US.",
    multiSigConfig: "Anchorage proprietary key management with quorum approvals.",
    hotWalletLimit: "Per Anchorage policy and Troptions internal limits.",
    coldWalletPolicy: "Cold storage managed by Anchorage within OCC guidelines.",
    reportingCadence: "Monthly reporting. Custom cadence available.",
    status: "evaluation",
    riskNotes: "Preferred custody provider for US institutional use given OCC charter.",
    nextAction: "Engage Anchorage for institutional onboarding. Prepare KYB and compliance package.",
  },
  {
    custodyId: "CUST-BITGO-001",
    name: "BitGo",
    type: "institutional-digital",
    supportedAssets: ["BTC", "ETH", "USDC", "WBTC", "selected ERC-20", "USDT"],
    chains: ["Bitcoin", "Ethereum", "Polygon"],
    agreementStatus: "evaluation",
    insuranceCoverage: "BitGo provides up to $250M insurance coverage (subject to terms).",
    regulatoryStatus: "Licensed trust company. Review per jurisdiction.",
    multiSigConfig: "3-of-5 or 2-of-3 multi-sig options. Client-controlled key options available.",
    hotWalletLimit: "Defined per client. Must be within insurance coverage limits.",
    coldWalletPolicy: "Cold storage in geographically distributed vaults.",
    reportingCadence: "On-demand and monthly.",
    status: "evaluation",
    riskNotes: "BitGo is well-established. Multi-sig configuration requires quorum documentation and board approval.",
    nextAction: "Evaluate BitGo institutional offering. Compare with Fireblocks and Anchorage.",
  },
  {
    custodyId: "CUST-CB-PRIME-001",
    name: "Coinbase Prime",
    type: "institutional-digital",
    supportedAssets: ["BTC", "ETH", "USDC", "SOL", "MATIC", "selected ERC-20"],
    chains: ["Bitcoin", "Ethereum", "Solana", "Base"],
    agreementStatus: "evaluation",
    insuranceCoverage: "Coinbase carries commercial crime insurance. Subject to terms and sublimits.",
    regulatoryStatus: "Licensed in multiple US states. Review jurisdiction-specific licensing.",
    multiSigConfig: "Coinbase Prime manages keys with institutional access controls.",
    hotWalletLimit: "Subject to Coinbase Prime policy.",
    coldWalletPolicy: "Majority of assets held in cold storage.",
    reportingCadence: "Real-time dashboard + periodic reports.",
    status: "evaluation",
    riskNotes: "Good for liquid assets and settlement. Evaluate integration with Troptions asset types.",
    nextAction: "Evaluate Coinbase Prime for liquid asset custody and settlement.",
  },
  {
    custodyId: "CUST-CIRCLE-001",
    name: "Circle (USDC Custody)",
    type: "institutional-digital",
    supportedAssets: ["USDC", "EURC"],
    chains: ["Ethereum", "Solana", "Base", "Arbitrum", "XRPL"],
    agreementStatus: "evaluation",
    insuranceCoverage: "Circle USDC reserves held at regulated US banks (FDIC-insured deposits).",
    regulatoryStatus: "NY DFS licensed. Reserve attestations by independent auditors.",
    multiSigConfig: "Circle manages USDC issuance keys.",
    hotWalletLimit: "N/A — Circle manages issuance. Troptions manages its own wallets.",
    coldWalletPolicy: "Troptions cold wallet policy applies to USDC holdings.",
    reportingCadence: "Circle reserve attestations monthly.",
    status: "evaluation",
    riskNotes: "Troptions uses Circle as a USDC settlement rail, not as a custody provider for Troptions tokens.",
    nextAction: "Confirm Circle API access for USDC transfers and monitoring.",
  },
  {
    custodyId: "CUST-VAULT-001",
    name: "Physical Vault — Troptions Gold Reserve",
    type: "physical-vault",
    supportedAssets: ["Physical Gold", "Precious Metals"],
    chains: [],
    agreementStatus: "evaluation — requires vault provider agreement and vault receipt",
    insuranceCoverage: "Required: all-risk vault insurance from A-rated carrier. Review coverage per weight and value.",
    regulatoryStatus: "Vault provider must be qualified custodian. Review jurisdiction-specific commodity storage regulations.",
    multiSigConfig: "Physical access: dual-control access policy required. No single-person vault access.",
    hotWalletLimit: "N/A — physical assets.",
    coldWalletPolicy: "All physical assets in cold vault only. No unsecured storage.",
    reportingCadence: "Vault receipt on deposit. Monthly physical count attestation. Annual assay.",
    status: "evaluation",
    riskNotes: "Physical vault provider must be qualified. Chain-of-custody documentation required. Vault receipt must match token supply before any token issuance.",
    nextAction: "Engage physical vault provider (Brink's, Loomis, or equivalent). Execute vault agreement. Obtain vault receipt.",
  },
];

export function getCustodyByType(type: CustodyType): CustodyProvider[] {
  return CUSTODY_REGISTRY.filter((c) => c.type === type);
}

export function assertCustodyAgreementActive(provider: CustodyProvider): void {
  if (provider.agreementStatus !== "active") {
    throw new Error(
      `[CustodyGuard] "${provider.name}" does not have an active custody agreement. Current: "${provider.agreementStatus}".`,
    );
  }
}
