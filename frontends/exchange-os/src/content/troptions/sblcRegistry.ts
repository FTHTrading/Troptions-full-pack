export type SblcStatus = "draft" | "submitted" | "bank-review" | "verified" | "rejected" | "expired" | "blocked";

export interface SblcRecord {
  sblcId: string;
  issuingBank: string;
  beneficiary: string;
  amount: number;
  currency: string;
  expiryDate: string;
  swiftVerificationStatus: "pending" | "verified" | "failed";
  bankConfirmationStatus: "pending" | "confirmed" | "rejected";
  authenticityReviewStatus: "pending" | "approved" | "blocked";
  legalReviewStatus: "pending" | "approved" | "blocked";
  fraudRiskReviewStatus: "pending" | "approved" | "blocked";
  collateralLinkage: string;
  permittedUse: string;
  boardApprovalStatus: "pending" | "approved" | "blocked";
  status: SblcStatus;
}

export const SBLC_REGISTRY: SblcRecord[] = [
  {
    sblcId: "SBLC-001",
    issuingBank: "Institutional Bank A",
    beneficiary: "Hamilton Family Office LLC",
    amount: 15000000,
    currency: "USD",
    expiryDate: "2027-03-31",
    swiftVerificationStatus: "pending",
    bankConfirmationStatus: "pending",
    authenticityReviewStatus: "pending",
    legalReviewStatus: "pending",
    fraudRiskReviewStatus: "pending",
    collateralLinkage: "COLL-889",
    permittedUse: "Collateral support for approved settlement program",
    boardApprovalStatus: "pending",
    status: "submitted",
  },
];
