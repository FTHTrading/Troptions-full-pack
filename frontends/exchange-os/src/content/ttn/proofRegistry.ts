/**
 * TTN Proof Registry
 *
 * CRITICAL SAFETY INVARIANTS:
 * - simulation_only: true  on ALL records (no live IPFS execution through this registry)
 * - live_execution_enabled: false  on ALL records
 * - This registry is informational indexing of content proof records only.
 * - It does NOT replace legal rights agreements, copyright registration, or licensed custody.
 *
 * COMPLIANCE NOTICE:
 * Proof CIDs listed here represent content fingerprints only.
 * They do not constitute ownership proof, licensing, or securities instruments.
 */

export type ContentType =
  | "video"
  | "blog"
  | "podcast-episode"
  | "film"
  | "channel-manifest"
  | "creator-identity"
  | "genesis-manifest"
  | "xrpl-proof"
  | "evidence-record";

export type ApprovalStatus = "approved" | "pending" | "rejected" | "flagged" | "draft";
export type RightsDocumentStatus = "signed" | "unsigned" | "pending" | "disputed" | "not-required";

export interface ProofRecord {
  id: string;
  contentId: string;
  title: string;
  contentType: ContentType;
  creatorId: string;
  sha256Hash: string;
  ipfsCid: string;
  ipfsUri: string;
  localGatewayUrl: string;
  rightsDocumentStatus: RightsDocumentStatus;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  /** ALWAYS true in v1 — no live IPFS pinning through this interface */
  simulation_only: true;
  /** ALWAYS false in v1 — live execution requires separate authorization */
  live_execution_enabled: false;
  notes?: string;
}

export const TTN_PROOF_RECORDS: ProofRecord[] = [
  {
    id: "proof-genesis-001",
    contentId: "troptions-genesis",
    title: "Troptions Platform Genesis Manifest (Phase 20 Lock)",
    contentType: "genesis-manifest",
    creatorId: "creator-001",
    sha256Hash: "5c0a395f3a83008c8a644325145ac44679747fdd880c9c260ac7781613f4cd29",
    ipfsCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    ipfsUri: "ipfs://QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    localGatewayUrl:
      "http://127.0.0.1:8080/ipfs/QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    rightsDocumentStatus: "not-required",
    approvalStatus: "approved",
    createdAt: "2026-04-25T20:06:24.462Z",
    simulation_only: true,
    live_execution_enabled: false,
    notes:
      "Phase 20 canonical genesis lock. SHA-256 of troptions-genesis.locked.json (key-sorted). IPFS pinned via local Kubo node.",
  },
  {
    id: "proof-creator-001",
    contentId: "creator-kevan-burns",
    title: "Creator Identity Record — Kevan Burns",
    contentType: "creator-identity",
    creatorId: "creator-001",
    sha256Hash: "0000000000000000000000000000000000000000000000000000000000000001",
    ipfsCid: "QmPlaceholderCreator001",
    ipfsUri: "ipfs://QmPlaceholderCreator001",
    localGatewayUrl: "http://127.0.0.1:8080/ipfs/QmPlaceholderCreator001",
    rightsDocumentStatus: "signed",
    approvalStatus: "approved",
    createdAt: "2026-04-27T00:00:00.000Z",
    simulation_only: true,
    live_execution_enabled: false,
    notes: "Placeholder — replace with real CID once creator identity JSON is pinned.",
  },
  {
    id: "proof-creator-002",
    contentId: "creator-ttn-originals",
    title: "Creator Identity Record — TTN Originals",
    contentType: "creator-identity",
    creatorId: "creator-002",
    sha256Hash: "0000000000000000000000000000000000000000000000000000000000000002",
    ipfsCid: "QmPlaceholderCreator002",
    ipfsUri: "ipfs://QmPlaceholderCreator002",
    localGatewayUrl: "http://127.0.0.1:8080/ipfs/QmPlaceholderCreator002",
    rightsDocumentStatus: "signed",
    approvalStatus: "approved",
    createdAt: "2026-04-27T00:00:00.000Z",
    simulation_only: true,
    live_execution_enabled: false,
    notes: "Placeholder — replace with real CID once creator identity JSON is pinned.",
  },
  {
    id: "proof-vid-001",
    contentId: "vid-001",
    title: "Video Proof — Troptions Ecosystem Overview 2026",
    contentType: "video",
    creatorId: "creator-001",
    sha256Hash: "0000000000000000000000000000000000000000000000000000000000000010",
    ipfsCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    ipfsUri: "ipfs://QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    localGatewayUrl:
      "http://127.0.0.1:8080/ipfs/QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    rightsDocumentStatus: "signed",
    approvalStatus: "approved",
    createdAt: "2026-04-01T00:00:00.000Z",
    simulation_only: true,
    live_execution_enabled: false,
    notes: "Demo record using Phase 20 CID as placeholder until real video pin is complete.",
  },
  {
    id: "proof-blog-001",
    contentId: "blog-001",
    title: "Blog Proof — TTN CreatorOS Launch",
    contentType: "blog",
    creatorId: "creator-001",
    sha256Hash: "0000000000000000000000000000000000000000000000000000000000000020",
    ipfsCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    ipfsUri: "ipfs://QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    localGatewayUrl:
      "http://127.0.0.1:8080/ipfs/QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    rightsDocumentStatus: "not-required",
    approvalStatus: "approved",
    createdAt: "2026-04-27T00:00:00.000Z",
    simulation_only: true,
    live_execution_enabled: false,
  },
  {
    id: "proof-ep-001",
    contentId: "ep-001",
    title: "Podcast Episode Proof — What Is Troptions?",
    contentType: "podcast-episode",
    creatorId: "creator-001",
    sha256Hash: "0000000000000000000000000000000000000000000000000000000000000030",
    ipfsCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    ipfsUri: "ipfs://QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    localGatewayUrl:
      "http://127.0.0.1:8080/ipfs/QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    rightsDocumentStatus: "not-required",
    approvalStatus: "approved",
    createdAt: "2025-07-01T00:00:00.000Z",
    simulation_only: true,
    live_execution_enabled: false,
  },
  {
    id: "proof-film-001",
    contentId: "film-001",
    title: "Film Proof — TTN Origins Documentary",
    contentType: "film",
    creatorId: "creator-002",
    sha256Hash: "0000000000000000000000000000000000000000000000000000000000000040",
    ipfsCid: "QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    ipfsUri: "ipfs://QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    localGatewayUrl:
      "http://127.0.0.1:8080/ipfs/QmeDKjm5ovtHycSQzfhC35iNU1niEFTKBq2Yxc49kZsZ3H",
    rightsDocumentStatus: "pending",
    approvalStatus: "pending",
    createdAt: "2026-04-20T00:00:00.000Z",
    simulation_only: true,
    live_execution_enabled: false,
    notes: "Rights clearance pending. Film still in post-production review.",
  },
];

export function getProofRecord(id: string): ProofRecord | undefined {
  return TTN_PROOF_RECORDS.find((r) => r.id === id);
}

export function getProofRecordByCid(cid: string): ProofRecord | undefined {
  return TTN_PROOF_RECORDS.find((r) => r.ipfsCid === cid);
}

export function getProofRecordsForCreator(creatorId: string): ProofRecord[] {
  return TTN_PROOF_RECORDS.filter((r) => r.creatorId === creatorId);
}

export function getApprovedProofRecords(): ProofRecord[] {
  return TTN_PROOF_RECORDS.filter((r) => r.approvalStatus === "approved");
}
