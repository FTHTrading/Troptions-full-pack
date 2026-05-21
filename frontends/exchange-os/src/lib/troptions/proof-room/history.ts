/**
 * TROPTIONS Proof Room — History Timeline
 */

import type { TroptionsHistoryEvent } from "./types";

export function getMockHistoryTimeline(): TroptionsHistoryEvent[] {
  return [
    {
      id: "hist-001",
      year: 1999,
      title: "TROPTIONS Conceived as Digital Currency Framework",
      summary:
        "TROPTIONS originated as a private digital currency and value-exchange concept before most blockchain platforms existed.",
      category: "founding",
      sourceType: "admin_record",
      sourceReference: null,
      confidenceLevel: "high",
      publicSafe: true,
      reviewStatus: "approved",
      notes: "Core founding narrative. Use with confidence.",
    },
    {
      id: "hist-002",
      year: 2011,
      title: "TROPTIONS Listed on Early Digital Currency Exchanges",
      summary:
        "TROPTIONS was listed on several early digital currency trading platforms as a utility token.",
      category: "digital_currency_framework",
      sourceType: "admin_record",
      sourceReference: null,
      confidenceLevel: "medium",
      publicSafe: true,
      reviewStatus: "pending",
      notes: "Exchange listing history requires source verification.",
    },
    {
      id: "hist-003",
      year: 2015,
      title: "TROPTIONS Expanded to Blockchain Utility Framework",
      summary:
        "TROPTIONS evolved into a broader blockchain utility framework, adding merchant adoption capabilities.",
      category: "blockchain_expansion",
      sourceType: "admin_record",
      sourceReference: null,
      confidenceLevel: "high",
      publicSafe: true,
      reviewStatus: "approved",
      notes: "Blockchain expansion phase. Core to brand history.",
    },
    {
      id: "hist-004",
      year: 2018,
      title: "TROPTIONS Merchant Adoption Program Launch",
      summary:
        "TROPTIONS launched a formal merchant adoption program enabling businesses to accept TROPTIONS as payment.",
      category: "merchant_utility",
      sourceType: "admin_record",
      sourceReference: null,
      confidenceLevel: "medium",
      publicSafe: true,
      reviewStatus: "pending",
      notes: "Merchant adoption documentation requires internal review.",
    },
    {
      id: "hist-005",
      year: 2021,
      title: "TROPTIONS Software Platform Rebuild Initiated",
      summary:
        "Full software rebuild initiated to create a next-generation TROPTIONS infrastructure platform.",
      category: "software_rebuild",
      sourceType: "software_build_report",
      sourceReference: "/public/troptions-genesis.json",
      confidenceLevel: "high",
      publicSafe: true,
      reviewStatus: "approved",
      notes: "Rebuild is documented in genesis release files.",
    },
    {
      id: "hist-006",
      year: 2024,
      title: "TROPTIONS Genesis Build Verified",
      summary:
        "TROPTIONS Infrastructure Control Plane, PayOps module, and proof room passed software build verification.",
      category: "software_rebuild",
      sourceType: "software_build_report",
      sourceReference: "/public/troptions-genesis-release.json",
      confidenceLevel: "high",
      publicSafe: true,
      reviewStatus: "approved",
      notes: "Build verified. See genesis release file for full record.",
    },
  ];
}

export function getHistoryByCategory(
  events: TroptionsHistoryEvent[],
  category: string
): TroptionsHistoryEvent[] {
  return events.filter((e) => e.category === category);
}

export function getApprovedPublicHistory(
  events: TroptionsHistoryEvent[]
): TroptionsHistoryEvent[] {
  return events.filter((e) => e.publicSafe && e.reviewStatus === "approved");
}
