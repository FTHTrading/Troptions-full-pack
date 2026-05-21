/**
 * Troptions Funding Route Registry
 * All evaluated funding routes — private placement, offshore, Centrifuge,
 * Maple, bank, stablecoin, treasury, and bond.
 *
 * STATUS RULES:
 * - Centrifuge and Maple routes cannot be "live" unless legalStatus AND integrationStatus = "approved"
 * - All routes require board approval and legal counsel sign-off before activation
 * - No funding route may guarantee returns or promise liquidity
 */

export type FundingRouteStatus =
  | "evaluation-only"
  | "pending-legal"
  | "pending-board"
  | "pending-integration"
  | "approved-dry-run"
  | "approved-live"
  | "suspended";

export interface FundingRoute {
  routeId: string;
  name: string;
  category: string;
  description: string;
  investorEligibility: string;
  requiredDocuments: string[];
  legalStatus: string;
  integrationStatus: string;
  boardApprovalStatus: string;
  status: FundingRouteStatus;
  chains: string[];
  currencies: string[];
  riskNotes: string;
  disclaimers: string[];
  nextAction: string;
}

export const FUNDING_ROUTE_REGISTRY: FundingRoute[] = [
  {
    routeId: "FUND-PRIV-001",
    name: "Troptions Private Placement Route",
    category: "Securities",
    description: "Private placement to accredited investors under applicable exemptions (e.g., Reg D 506(b)/506(c)). Subject to securities counsel review.",
    investorEligibility: "Accredited investors only (US). Investor eligibility verification required. Subscription documents required. Wallet allowlist required.",
    requiredDocuments: [
      "Private placement memorandum (counsel-reviewed)",
      "Subscription agreement",
      "Investor accreditation verification",
      "KYC/AML clearance",
      "Escrow confirmation",
      "Transfer restriction documentation",
      "Board resolution authorizing offering",
      "Legal opinion on exemption",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: ["Ethereum", "XRPL"],
    currencies: ["USD", "USDC"],
    riskNotes: "Securities law analysis required. Reg D exemption does not pre-clear state blue-sky laws. Transfer restrictions must be enforced on-chain and legally.",
    disclaimers: [
      "This is an evaluation-only route. No securities are being offered.",
      "Subject to securities counsel review, exemption analysis, state law review, and board approval.",
      "Investor eligibility verification required before any subscription.",
    ],
    nextAction: "Engage securities counsel. Draft PPM. Define on-chain transfer restriction mechanism.",
  },
  {
    routeId: "FUND-OFFS-001",
    name: "Troptions Offshore Route (Reg S Evaluation)",
    category: "Securities — Offshore",
    description: "Potential offshore offering to non-US investors under Reg S evaluation. Subject to counsel review on US directed-selling restrictions and local jurisdiction requirements.",
    investorEligibility: "Non-US investors only. No US directed-selling controls. Local jurisdiction review required. Offshore counsel required.",
    requiredDocuments: [
      "Reg S analysis memo from US counsel",
      "Local jurisdiction counsel memo",
      "Non-US investor certification",
      "KYC/AML clearance",
      "Offshore subscription documents",
      "Distribution compliance controls documentation",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: ["Ethereum", "Stellar"],
    currencies: ["USDC", "EURC"],
    riskNotes: "Reg S does not provide automatic exemption. Local jurisdiction securities laws apply. Flow-back restrictions apply.",
    disclaimers: [
      "Evaluation only. No offshore securities are being offered.",
      "Subject to Reg S analysis, local jurisdiction review, and board approval.",
    ],
    nextAction: "Engage US and offshore counsel. Map target jurisdictions. Assess directed-selling restrictions.",
  },
  {
    routeId: "FUND-CENT-001",
    name: "Troptions Centrifuge Route (Evaluation Only)",
    category: "RWA / DeFi Lending",
    description: "RWA pool evaluation on Centrifuge protocol. Troptions assets may be evaluated as Centrifuge pool assets. Status must remain Evaluation Only unless legalStatus and integrationStatus are both approved.",
    investorEligibility: "Subject to Centrifuge protocol eligibility requirements and Troptions KYC/AML.",
    requiredDocuments: [
      "Asset pool documentation",
      "Issuer package (legal, financial, operational)",
      "Legal classification of pool assets",
      "Centrifuge pool setup documentation",
      "Reserve and collateral documentation",
      "Reporting package (monthly)",
      "Legal opinion on structure",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: ["Ethereum", "Centrifuge"],
    currencies: ["USDC", "DAI"],
    riskNotes: "DeFi protocol risk. Smart contract risk. Regulatory classification of Centrifuge pool tokens is evolving. Liquidity is not guaranteed.",
    disclaimers: [
      "Evaluation only. Centrifuge route cannot be activated without legal approval and integration approval.",
      "DeFi protocol risk applies. No guarantee of liquidity, yield, or return.",
    ],
    nextAction: "Evaluate Centrifuge pool structure. Engage DeFi and securities counsel. Complete issuer package.",
  },
  {
    routeId: "FUND-MAPLE-001",
    name: "Troptions Maple Route (Evaluation Only)",
    category: "Institutional Credit",
    description: "Institutional credit evaluation on Maple Finance. Subject to Maple's credit committee and Troptions legal review. Cannot be marked live without both legalStatus and integrationStatus approved.",
    investorEligibility: "Institutional lenders via Maple protocol. Borrower profile required. Collateral package required.",
    requiredDocuments: [
      "Borrower credit profile",
      "Collateral package documentation",
      "Default waterfall description",
      "Lender package",
      "Maple pool legal documents",
      "Legal opinion on structure",
      "Reporting package",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: ["Ethereum", "Solana"],
    currencies: ["USDC"],
    riskNotes: "Credit risk, smart contract risk, DeFi protocol risk. No guaranteed credit terms. Default waterfall must be clearly defined.",
    disclaimers: [
      "Evaluation only. Maple route cannot be activated without legal approval and integration approval.",
      "No guarantee of credit terms, liquidity, or lending capacity.",
    ],
    nextAction: "Prepare borrower profile and collateral package. Engage Maple and DeFi counsel.",
  },
  {
    routeId: "FUND-BANK-001",
    name: "Troptions Bank Route",
    category: "Bank / Wire",
    description: "ACH, domestic wire, FedWire, SWIFT, and SEPA bank settlement for Troptions funding operations. Includes escrow and refund logic.",
    investorEligibility: "KYC/AML cleared participants. US and international banking rules apply.",
    requiredDocuments: [
      "Bank account agreements",
      "Wire instruction documentation",
      "Escrow agreement",
      "Refund policy",
      "AML/KYC clearance records",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: [],
    currencies: ["USD", "EUR", "GBP"],
    riskNotes: "Bank partner agreements required. MSB/money-transmission licensing review required depending on use case.",
    disclaimers: [
      "Bank route subject to banking partner approval, AML compliance, and MSB licensing review.",
    ],
    nextAction: "Identify banking partner. Review MSB licensing requirements. Draft escrow agreement.",
  },
  {
    routeId: "FUND-STABLE-001",
    name: "Troptions Stablecoin Route",
    category: "Stablecoin",
    description: "USDC, EURC, PYUSD, RLUSD stablecoin funding with custody, wallet allowlist, and chain monitoring.",
    investorEligibility: "KYC/AML cleared participants. Wallet allowlist required.",
    requiredDocuments: [
      "Stablecoin custody agreement",
      "Wallet allowlist policy",
      "Chain monitoring setup",
      "AML/KYC clearance records",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: ["Ethereum", "Solana", "XRPL", "Base"],
    currencies: ["USDC", "EURC", "PYUSD", "RLUSD"],
    riskNotes: "Stablecoin regulatory risk varies by issuer and jurisdiction. Wallet allowlist enforcement required.",
    disclaimers: [
      "Stablecoin route subject to issuer regulatory status and Troptions KYC/AML compliance.",
    ],
    nextAction: "Configure wallet allowlist. Implement deposit detection. Complete custody setup.",
  },
  {
    routeId: "FUND-TREAS-001",
    name: "Troptions Treasury Route",
    category: "Treasury",
    description: "T-bills, money market funds, short-duration treasury strategy. Custody and advisor/legal approval required.",
    investorEligibility: "Institutional only. Investment adviser review required.",
    requiredDocuments: [
      "Custody agreement",
      "Investment adviser agreement or exemption analysis",
      "Treasury strategy documentation",
      "Board approval for treasury allocation",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: [],
    currencies: ["USD"],
    riskNotes: "Investment adviser regulation may apply. T-bill and money market risk. Interest rate risk.",
    disclaimers: [
      "Treasury route subject to investment adviser review, custody approval, and board approval.",
      "No guarantee of yield or return.",
    ],
    nextAction: "Engage investment adviser or counsel. Establish custody. Get board approval for treasury policy.",
  },
  {
    routeId: "FUND-BOND-001",
    name: "Troptions Bond Route",
    category: "Debt Securities",
    description: "Institutional bond issuance infrastructure: issuer, trustee, transfer agent, paying agent, indenture, coupon engine, redemption reserve, investor reporting.",
    investorEligibility: "Accredited and institutional investors only. Full KYC/KYB and accreditation required.",
    requiredDocuments: [
      "Indenture agreement",
      "Trustee agreement",
      "Transfer agent agreement",
      "Paying agent agreement",
      "Bond offering documents (legal-reviewed)",
      "Coupon schedule",
      "Redemption reserve documentation",
      "Investor reporting framework",
    ],
    legalStatus: "evaluation",
    integrationStatus: "not-started",
    boardApprovalStatus: "not-started",
    status: "evaluation-only",
    chains: ["XRPL", "Ethereum"],
    currencies: ["USDC", "USD"],
    riskNotes: "Securities law analysis required. Trustee and paying agent agreements required. Coupon and redemption reserve must be funded before issuance.",
    disclaimers: [
      "Bond route is evaluation only. No bonds are being issued or offered.",
      "Subject to full securities counsel review, trustee approval, and board approval.",
    ],
    nextAction: "Engage bond counsel. Draft indenture. Identify trustee and transfer agent.",
  },
];

/** Runtime guard — Centrifuge and Maple cannot go live without both legalStatus and integrationStatus approved */
export function assertFundingRouteCanActivate(route: FundingRoute): void {
  if (route.routeId === "FUND-CENT-001" || route.routeId === "FUND-MAPLE-001") {
    if (route.legalStatus !== "approved" || route.integrationStatus !== "approved") {
      throw new Error(
        `[FundingRouteGuard] "${route.name}" cannot be activated. Both legalStatus and integrationStatus must be "approved". ` +
          `Current: legalStatus="${route.legalStatus}", integrationStatus="${route.integrationStatus}".`,
      );
    }
  }
  if (route.boardApprovalStatus !== "approved") {
    throw new Error(
      `[FundingRouteGuard] "${route.name}" cannot be activated without board approval.`,
    );
  }
}
