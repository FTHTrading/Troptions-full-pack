import { getDefaultFundingBlockers } from "@/content/troptions/walletFundingRequestRegistry";

export interface FundingRequestInput {
  walletId: string;
  amount: string;
  currency: string;
  purpose: string;
  sourceOfFunds: string;
  requestedRail: string;
}

export interface FundingRequestResult {
  ok: boolean;
  fundingRequestId: string;
  status: "submitted" | "blocked";
  message: string;
  blockedUntil: readonly {
    blockerId: string;
    blockerType: string;
    description: string;
    requiredAction: string;
    estimatedTimeToResolve: string;
  }[];
  nextSteps?: readonly string[];
}

export function submitFundingRequest(request: FundingRequestInput): FundingRequestResult {
  const fundingRequestId = `funding_${request.walletId}_${Date.now()}`;
  const blockers = getDefaultFundingBlockers();

  return {
    ok: true,
    fundingRequestId,
    status: "blocked",
    message: `Funding request submitted: ${request.amount} ${request.currency} for ${request.purpose}. Your request is pending verification.`,
    blockedUntil: blockers,
    nextSteps: [
      "Complete KYC verification (if not already done)",
      "Submit source of funds documentation",
      "Pass AML/sanctions screening",
      "Wait for Troptions operator approval",
      "Wait for custody provider approval",
      "Receive funding approval notification",
    ],
  };
}

export function getFundingBlockersForUser(
  kycStatus: string,
  sanctionsStatus: string,
  providerStatus: string
): readonly string[] {
  const blockers: string[] = [];

  if (kycStatus !== "verified") {
    blockers.push("KYC verification incomplete");
  }
  if (sanctionsStatus !== "clear") {
    blockers.push("Sanctions screening pending");
  }
  if (providerStatus !== "approved") {
    blockers.push("Provider funding route not approved");
  }

  return blockers;
}

export function estimateFundingApprovalTime(): string {
  return "5-10 business days for standard funding requests. Expedited requests may take 2-3 business days with enhanced documentation.";
}
