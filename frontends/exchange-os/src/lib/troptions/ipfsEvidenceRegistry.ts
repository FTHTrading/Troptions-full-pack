/**
 * IPFS Evidence Registry
 *
 * Defines the data model for content-addressed evidence records.
 * Each record links a document, PDF, or JSON payload to an IPFS CID,
 * providing an immutable proof fingerprint.
 *
 * Workflow:
 *   Document → ipfsAddJson/ipfsAddBuffer → CID → EvidenceRecord stored in DB/ledger
 *   → sha256 + CID together prove the file content has not changed
 */

// ─── Status ───────────────────────────────────────────────────────────────────

export type EvidenceStatus = "draft" | "verified" | "archived";

// ─── Category ─────────────────────────────────────────────────────────────────

export type EvidenceCategory =
  | "funding-packet"
  | "lender-evidence"
  | "asset-photo"
  | "inspection-report"
  | "legal-doc"
  | "token-metadata"
  | "xrpl-proof"
  | "stellar-proof"
  | "polygon-proof"
  | "apostle-proof"
  | "rwa-asset"
  | "kyc-aml"
  | "compliance-filing"
  | "genesis-manifest"
  | "other";

// ─── Record ───────────────────────────────────────────────────────────────────

export interface EvidenceRecord {
  /** Unique record ID (UUID v4 or equivalent) */
  id: string;
  /** Human-readable title */
  title: string;
  /** Category for filtering and display */
  category: EvidenceCategory;
  /** Original filename as provided by the uploader */
  sourceFileName: string;
  /** IPFS CIDv0 (Qm...) or CIDv1 (bafy...) */
  cid: string;
  /** ipfs://{cid} */
  ipfsUri: string;
  /** http://127.0.0.1:8080/ipfs/{cid} — local testing only, not for public links */
  localGatewayUrl: string;
  /** SHA-256 hex digest of the original file, if computed before upload */
  sha256?: string;
  /** Whether the CID is pinned in the local Kubo node */
  pinned: boolean;
  /** ISO 8601 timestamp when this record was created */
  createdAt: string;
  /** Optional free-text notes */
  notes?: string;
  /** Lifecycle status */
  status: EvidenceStatus;
}

// ─── Creation helper ──────────────────────────────────────────────────────────

/**
 * Creates a new EvidenceRecord from an IPFS upload result.
 *
 * @param opts  Partial record fields; `id`, `createdAt`, `ipfsUri`,
 *              `localGatewayUrl` and `status` are filled automatically if absent.
 */
export function createEvidenceRecord(
  opts: Omit<EvidenceRecord, "ipfsUri" | "localGatewayUrl" | "status" | "pinned"> &
    Partial<Pick<EvidenceRecord, "ipfsUri" | "localGatewayUrl" | "status" | "pinned">>,
): EvidenceRecord {
  const gatewayBase =
    process.env.IPFS_GATEWAY_URL ?? "http://127.0.0.1:8080";

  return {
    status: "draft",
    pinned: false,
    ipfsUri: `ipfs://${opts.cid}`,
    localGatewayUrl: `${gatewayBase}/ipfs/${opts.cid}`,
    ...opts,
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface EvidenceValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates an EvidenceRecord for required fields and basic format sanity.
 * Does not check IPFS node connectivity — use ipfsIsPinned for that.
 */
export function validateEvidenceRecord(
  record: Partial<EvidenceRecord>,
): EvidenceValidationResult {
  const errors: string[] = [];

  if (!record.id?.trim()) errors.push("id is required");
  if (!record.title?.trim()) errors.push("title is required");
  if (!record.category) errors.push("category is required");
  if (!record.sourceFileName?.trim()) errors.push("sourceFileName is required");
  if (!record.cid?.trim()) errors.push("cid is required");
  if (record.cid && !/^[Qb][a-zA-Z0-9]{45,99}$/.test(record.cid)) {
    errors.push(`cid format appears invalid: ${record.cid}`);
  }
  if (!record.createdAt) errors.push("createdAt is required");

  return { valid: errors.length === 0, errors };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const EVIDENCE_CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  "funding-packet": "Funding Packet",
  "lender-evidence": "Lender Evidence",
  "asset-photo": "Asset Photo",
  "inspection-report": "Inspection Report",
  "legal-doc": "Legal Document",
  "token-metadata": "Token Metadata",
  "xrpl-proof": "XRPL Proof",
  "stellar-proof": "Stellar Proof",
  "polygon-proof": "Polygon Proof",
  "apostle-proof": "Apostle Chain Proof",
  "rwa-asset": "RWA Asset Record",
  "kyc-aml": "KYC / AML",
  "compliance-filing": "Compliance Filing",
  "genesis-manifest": "Genesis Manifest",
  other: "Other",
};

export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  draft: "Draft",
  verified: "Verified",
  archived: "Archived",
};
