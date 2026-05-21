export interface BrokerDealerProvider {
  providerId: string;
  legalName: string;
  licensedJurisdictions: string[];
  engagementStatus: "pending" | "engaged" | "paused";
  legalApprovalStatus: "pending" | "approved" | "blocked";
}

export const BROKER_DEALER_PROVIDER_REGISTRY: BrokerDealerProvider[] = [
  {
    providerId: "BD-001",
    legalName: "Licensed Capital Markets Partner A",
    licensedJurisdictions: ["US", "GB"],
    engagementStatus: "engaged",
    legalApprovalStatus: "approved",
  },
  {
    providerId: "BD-002",
    legalName: "Licensed Private Placement Partner B",
    licensedJurisdictions: ["US"],
    engagementStatus: "pending",
    legalApprovalStatus: "pending",
  },
];
