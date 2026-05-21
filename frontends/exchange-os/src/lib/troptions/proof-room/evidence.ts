/**
 * TROPTIONS Proof Room — Evidence Records
 */

import type { TroptionsEvidenceRecord } from "./types";

export function getMockEvidenceRecords(): TroptionsEvidenceRecord[] {
  return [
    {
      id: "ev-build-001",
      title: "TROPTIONS Infrastructure Build Report — Genesis Build",
      evidenceType: "software_build_report",
      sourceUrl: "/public/troptions-genesis-release.json",
      fileReference: "public/troptions-genesis-release.json",
      description:
        "TROPTIONS Infrastructure Control Plane build report including platform lib files, PayOps module, proof room, and admin pages. Build passes pnpm build and all jest tests.",
      relatedClaimIds: ["claim-002"],
      verificationStatus: "verified",
      reviewedBy: "system",
      reviewedAt: new Date().toISOString(),
      expirationDate: null,
      notes: "Build evidence. Re-verify on each release.",
    },
    {
      id: "ev-build-002",
      title: "TROPTIONS PayOps Module — 46 Tests Passing",
      evidenceType: "software_build_report",
      sourceUrl: null,
      fileReference: "build-output.txt",
      description:
        "TROPTIONS PayOps module: 46 tests passing, build exit 0. Payout status engine, compliance guards, batch management, receipt generation.",
      relatedClaimIds: ["claim-003"],
      verificationStatus: "verified",
      reviewedBy: "system",
      reviewedAt: new Date().toISOString(),
      expirationDate: null,
      notes: "Test evidence on file. Re-run tests to verify.",
    },
    {
      id: "ev-genesis-json",
      title: "TROPTIONS Genesis JSON — Public Proof Index",
      evidenceType: "admin_record",
      sourceUrl: "/public/troptions-genesis.json",
      fileReference: "public/troptions-genesis.json",
      description:
        "TROPTIONS genesis release record documenting platform identity, system scope, and build provenance.",
      relatedClaimIds: ["claim-001", "claim-002"],
      verificationStatus: "verified",
      reviewedBy: "system",
      reviewedAt: new Date().toISOString(),
      expirationDate: null,
      notes: "Public genesis file. Safe to reference.",
    },
  ];
}

export function getEvidenceForClaim(
  records: TroptionsEvidenceRecord[],
  claimId: string
): TroptionsEvidenceRecord[] {
  return records.filter((r) => r.relatedClaimIds.includes(claimId));
}

export function getMissingEvidence(
  records: TroptionsEvidenceRecord[]
): TroptionsEvidenceRecord[] {
  return records.filter((r) => r.verificationStatus === "missing");
}
