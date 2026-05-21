/**
 * TROPTIONS Proof Room — Mock Data Aggregator
 */

import { getMockHistoryTimeline } from "./history";
import { getMockPublicClaims } from "./claims";
import { getMockEvidenceRecords } from "./evidence";
import { getMockRegulatoryRecords } from "./regulatory";
import { getMockCapabilityRecords } from "./capabilities";
import { getMockApprovedCopy } from "./approvedCopy";
import { getMockRiskReviews } from "./riskReview";
import type { TroptionsProofPacket } from "./types";
import { randomUUID } from "crypto";

export function getMockProofRoomData() {
  return {
    history: getMockHistoryTimeline(),
    claims: getMockPublicClaims(),
    evidence: getMockEvidenceRecords(),
    regulatory: getMockRegulatoryRecords(),
    capabilities: getMockCapabilityRecords(),
    approvedCopy: getMockApprovedCopy(),
    riskReviews: getMockRiskReviews(),
  };
}

export function generateProofPacket(namespaceId: string | null): TroptionsProofPacket {
  const claims = getMockPublicClaims().filter(
    (c) =>
      c.publicUseStatus === "approved_public" ||
      c.publicUseStatus === "approved_with_disclaimer"
  );
  const evidence = getMockEvidenceRecords();
  const capabilities = getMockCapabilityRecords().filter((c) => c.canBeClaimedPublicly);

  const warnings: string[] = [];
  for (const claim of getMockPublicClaims()) {
    if (claim.claimStatus === "do_not_claim") {
      warnings.push(`DO NOT PUBLISH: ${claim.claimText}`);
    }
  }

  return {
    id: `proof-${randomUUID()}`,
    namespaceId,
    title: "TROPTIONS Proof Packet — Build Verified",
    claims,
    evidence,
    capabilities,
    generatedAt: new Date().toISOString(),
    overallStatus: warnings.length > 0 ? "warnings" : "clean",
    warnings,
    disclaimers: [
      "This proof packet reflects software-build verified capabilities.",
      "Live execution requires production-ready provider adapters.",
      "Not a legal opinion. Consult counsel for regulatory questions.",
    ],
  };
}
