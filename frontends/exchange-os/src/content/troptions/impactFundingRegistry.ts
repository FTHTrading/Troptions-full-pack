export interface ImpactFundingTrack {
  id: string;
  track: string;
  description: string;
  verificationRequirements: readonly string[];
}

export const IMPACT_FUNDING_REGISTRY: readonly ImpactFundingTrack[] = [
  {
    id: "if-donations",
    track: "Donations",
    description: "Track incoming public-benefit donations with source and policy metadata.",
    verificationRequirements: ["Donor route metadata", "Wallet screening result", "Program designation"],
  },
  {
    id: "if-grants",
    track: "Grant disbursements",
    description: "Simulate grant disbursements to verified prevention and support organizations.",
    verificationRequirements: ["Recipient verification", "Disbursement policy gate", "Impact report reference"],
  },
  {
    id: "if-reporting",
    track: "Impact transparency reporting",
    description: "Generate standardized impact and funding transparency reports.",
    verificationRequirements: ["Audit log references", "Program and period tagging"],
  },
];
