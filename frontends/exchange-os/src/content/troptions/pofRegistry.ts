export type PofProofType =
  | "bank-letter"
  | "escrow-confirmation"
  | "wire-confirmation"
  | "custodian-balance"
  | "stablecoin-wallet-balance"
  | "treasury-account-statement"
  | "audited-financial-statement"
  | "proof-of-control-challenge";

export interface PofRecord {
  pofId: string;
  clientId: string;
  proofType: PofProofType;
  evidenceHash: string;
  sourceOfFundsReview: "pending" | "approved" | "blocked";
  jurisdictionReview: "pending" | "approved" | "blocked";
  verificationStatus: "pending" | "verified" | "rejected";
}

export const POF_REGISTRY: PofRecord[] = [
  {
    pofId: "POF-001",
    clientId: "CL-001",
    proofType: "bank-letter",
    evidenceHash: "sha256:8dc8ac18a3e7b0b31f0aafac0df26f8cf33864b6db8be5fbd6e0f65f2c0f1d11",
    sourceOfFundsReview: "pending",
    jurisdictionReview: "pending",
    verificationStatus: "pending",
  },
];
