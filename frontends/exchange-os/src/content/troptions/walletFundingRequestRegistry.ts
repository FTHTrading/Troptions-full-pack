export interface FundingBlocker {
  readonly blockerId: string;
  readonly blockerType:
    | "kyc-incomplete"
    | "kyb-incomplete"
    | "sanctions-pending"
    | "provider-approval-pending"
    | "custody-approval-pending"
    | "admin-gate-pending"
    | "source-of-funds-unreviewed"
    | "jurisdiction-review-pending";
  readonly description: string;
  readonly requiredAction: string;
  readonly estimatedTimeToResolve: string;
}

export interface FundingRequest {
  readonly fundingRequestId: string;
  readonly walletId: string;
  readonly userId: string;
  readonly requestedAmount: string;
  readonly requestedCurrency: string;
  readonly purpose: string;
  readonly sourceOfFunds: string;
  readonly supportingDocuments: readonly string[];
  readonly requestedRail: string;
  readonly notes: string;
  readonly status: "submitted" | "under-review" | "approved" | "denied" | "cancelled";
  readonly blockedUntil: readonly FundingBlocker[];
  readonly submittedAt: string;
  readonly reviewedAt?: string;
  readonly reviewedBy?: string;
}

export const WALLET_FUNDING_REQUEST_REGISTRY: readonly FundingRequest[] = [];

export function getFundingRequestsByWalletId(walletId: string): readonly FundingRequest[] {
  return WALLET_FUNDING_REQUEST_REGISTRY.filter((req) => req.walletId === walletId);
}

export function getFundingRequestById(fundingRequestId: string): FundingRequest | undefined {
  return WALLET_FUNDING_REQUEST_REGISTRY.find((req) => req.fundingRequestId === fundingRequestId);
}

export function getPendingFundingRequests(): readonly FundingRequest[] {
  return WALLET_FUNDING_REQUEST_REGISTRY.filter((req) => req.status === "submitted" || req.status === "under-review");
}

export function getDefaultFundingBlockers(): readonly FundingBlocker[] {
  return [
    {
      blockerId: "blocker_kyc_pending",
      blockerType: "kyc-incomplete",
      description: "KYC verification required",
      requiredAction: "Complete KYC process with identity provider",
      estimatedTimeToResolve: "2-5 business days",
    },
    {
      blockerId: "blocker_sanctions_pending",
      blockerType: "sanctions-pending",
      description: "Sanctions screening in progress",
      requiredAction: "Wait for AML/sanctions screening to complete",
      estimatedTimeToResolve: "1-3 business days",
    },
    {
      blockerId: "blocker_provider_approval",
      blockerType: "provider-approval-pending",
      description: "Provider funding route approval required",
      requiredAction: "Troptions operator to approve provider route",
      estimatedTimeToResolve: "1-5 business days",
    },
    {
      blockerId: "blocker_custody_approval",
      blockerType: "custody-approval-pending",
      description: "Custody provider approval required",
      requiredAction: "Custody provider to approve account onboarding",
      estimatedTimeToResolve: "2-7 business days",
    },
    {
      blockerId: "blocker_admin_gate",
      blockerType: "admin-gate-pending",
      description: "Admin release gate authorization required",
      requiredAction: "Troptions admin to approve funding release",
      estimatedTimeToResolve: "1-3 business days",
    },
  ];
}
