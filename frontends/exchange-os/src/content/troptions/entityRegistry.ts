export interface EntityRecord {
  entityId: string;
  legalName: string;
  jurisdiction: string;
  entityType: string;
  kycKybStatus: string;
  sanctionsStatus: string;
  licensingReviewStatus: string;
}

export const ENTITY_REGISTRY: EntityRecord[] = [
  {
    entityId: "ENT-100",
    legalName: "Hamilton Family Office LLC",
    jurisdiction: "US-NY",
    entityType: "family-office",
    kycKybStatus: "approved",
    sanctionsStatus: "clear",
    licensingReviewStatus: "in-review",
  },
  {
    entityId: "ENT-220",
    legalName: "North Atlantic Infrastructure Partners Ltd",
    jurisdiction: "GB",
    entityType: "institution",
    kycKybStatus: "pending",
    sanctionsStatus: "clear",
    licensingReviewStatus: "pending",
  },
];
