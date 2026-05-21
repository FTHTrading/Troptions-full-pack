/**
 * Carbon Credit Registry Engine.
 *
 * Tracks carbon credit RWA records: inventory, evidence, registry status,
 * ownership, retirement, and monetization readiness. SIMULATION ONLY —
 * TROPTIONS does not act as a registry, broker, exchange, custodian, or
 * money transmitter. No claim of guaranteed offset validity is made.
 */

import { appendCarbonBitcoinAuditEvent } from "@/lib/troptions/carbonBitcoinAuditLog";

export type CarbonCreditStatus =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "VERIFIED_ACTIVE"
  | "PLEDGED"
  | "SOLD"
  | "RETIRED"
  | "REJECTED"
  | "BLOCKED";

export type CarbonVerificationStatus =
  | "unverified"
  | "in-review"
  | "verified"
  | "rejected";

export type CarbonRetirementStatus =
  | "unknown"
  | "active"
  | "retired"
  | "pending-retirement";

export type CarbonCustodyStatus =
  | "unknown"
  | "owner-controlled"
  | "custodian-held"
  | "registry-held";

export type CarbonApprovalStatus = "pending" | "approved" | "rejected" | "blocked";

export interface CarbonCreditRecord {
  carbonAssetId: string;
  registryName: string;
  registryAccount: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  projectType: string;
  methodology: string;
  vintageYear: number;
  creditQuantity: number;
  unitType: string;
  serialNumbers: string[];
  ownerName: string;
  beneficiaryName: string;
  custodyStatus: CarbonCustodyStatus;
  verificationStatus: CarbonVerificationStatus;
  retirementStatus: CarbonRetirementStatus;
  retirementCertificateUrl: string | null;
  evidenceHash: string | null;
  ipfsCid: string | null;
  xrplAttestationTx: string | null;
  stellarMirrorTx: string | null;
  sourceDocuments: string[];
  approvalStatus: CarbonApprovalStatus;
  riskFlags: string[];
  status: CarbonCreditStatus;
  createdAt: string;
  updatedAt: string;
}

export const CARBON_CREDIT_DISCLOSURE =
  "Carbon credit records are environmental asset records only. TROPTIONS does not guarantee carbon neutrality, offset validity, registry acceptance, price, liquidity, resale value, or environmental claims unless independently verified and properly retired.";

// ─── Validation ──────────────────────────────────────────────────────────────

export interface CarbonValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCarbonCreditRecord(
  record: Partial<CarbonCreditRecord>
): CarbonValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record.carbonAssetId) errors.push("carbonAssetId is required");
  if (!record.registryName) errors.push("registryName is required");
  if (!record.projectId) errors.push("projectId is required");
  if (!record.projectName) errors.push("projectName is required");
  if (!record.methodology) warnings.push("methodology missing — readiness will be capped");
  if (!record.vintageYear || record.vintageYear < 1990 || record.vintageYear > 2100)
    errors.push("vintageYear must be a plausible year");
  if (!record.creditQuantity || record.creditQuantity <= 0)
    errors.push("creditQuantity must be > 0");
  if (!record.unitType) errors.push("unitType is required (e.g. tCO2e)");
  if (!record.serialNumbers || record.serialNumbers.length === 0)
    warnings.push("serialNumbers missing — readiness capped at 60");
  if (!record.ownerName) warnings.push("ownerName missing — ownership evidence weak");
  if (!record.evidenceHash && !record.ipfsCid)
    warnings.push("no evidence hash or IPFS CID attached");

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Readiness Score ─────────────────────────────────────────────────────────

export function calculateCarbonReadinessScore(record: CarbonCreditRecord): number {
  if (record.status === "BLOCKED" || record.status === "REJECTED") return 0;

  let score = 0;
  if (record.registryName) score += 15;
  if (record.projectId) score += 15;
  if (record.serialNumbers && record.serialNumbers.length > 0) score += 20;
  const ownershipEvidence =
    !!record.ownerName &&
    (record.custodyStatus === "owner-controlled" ||
      record.custodyStatus === "custodian-held" ||
      record.custodyStatus === "registry-held");
  if (ownershipEvidence) score += 15;
  if (record.retirementStatus === "retired" || record.retirementStatus === "active") score += 15;
  if (record.evidenceHash || record.ipfsCid) score += 10;
  if (record.approvalStatus === "approved") score += 10;

  // Caps
  if (!record.serialNumbers || record.serialNumbers.length === 0) score = Math.min(score, 60);
  if (!ownershipEvidence) score = Math.min(score, 70);
  if (record.retirementStatus === "unknown") score = Math.min(score, 80);

  return Math.max(0, Math.min(100, score));
}

// ─── Registry (in-memory, simulation-only) ───────────────────────────────────

const REGISTRY: CarbonCreditRecord[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export interface CreateCarbonAssetInput {
  carbonAssetId: string;
  registryName: string;
  registryAccount?: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  projectType: string;
  methodology: string;
  vintageYear: number;
  creditQuantity: number;
  unitType?: string;
  serialNumbers?: string[];
  ownerName: string;
  beneficiaryName?: string;
  sourceDocuments?: string[];
  actor?: string;
}

export function createCarbonAssetRecord(input: CreateCarbonAssetInput): CarbonCreditRecord {
  const timestamp = nowIso();
  const record: CarbonCreditRecord = {
    carbonAssetId: input.carbonAssetId,
    registryName: input.registryName,
    registryAccount: input.registryAccount ?? "",
    projectId: input.projectId,
    projectName: input.projectName,
    projectLocation: input.projectLocation,
    projectType: input.projectType,
    methodology: input.methodology,
    vintageYear: input.vintageYear,
    creditQuantity: input.creditQuantity,
    unitType: input.unitType ?? "tCO2e",
    serialNumbers: input.serialNumbers ?? [],
    ownerName: input.ownerName,
    beneficiaryName: input.beneficiaryName ?? input.ownerName,
    custodyStatus: "unknown",
    verificationStatus: "unverified",
    retirementStatus: "unknown",
    retirementCertificateUrl: null,
    evidenceHash: null,
    ipfsCid: null,
    xrplAttestationTx: null,
    stellarMirrorTx: null,
    sourceDocuments: input.sourceDocuments ?? [],
    approvalStatus: "pending",
    riskFlags: [],
    status: "DRAFT",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const validation = validateCarbonCreditRecord(record);
  if (!validation.valid) {
    record.status = "BLOCKED";
    record.riskFlags = [...record.riskFlags, ...validation.errors.map((e) => `validation:${e}`)];
  }

  REGISTRY.push(record);
  appendCarbonBitcoinAuditEvent({
    eventType: "CARBON_ASSET_CREATED",
    actor: input.actor ?? "system",
    relatedAssetId: record.carbonAssetId,
    newStatus: record.status,
    reason: `Carbon asset record created (validation ${validation.valid ? "ok" : "blocked"})`,
    riskFlags: record.riskFlags,
  });
  return record;
}

export function listCarbonAssets(): CarbonCreditRecord[] {
  return [...REGISTRY];
}

export function getCarbonAsset(carbonAssetId: string): CarbonCreditRecord | undefined {
  return REGISTRY.find((r) => r.carbonAssetId === carbonAssetId);
}

export function clearCarbonRegistry(): void {
  REGISTRY.length = 0;
}

// ─── Status / evidence / retirement transitions ──────────────────────────────

const ALLOWED_TRANSITIONS: Record<CarbonCreditStatus, CarbonCreditStatus[]> = {
  DRAFT: ["PENDING_VERIFICATION", "BLOCKED", "REJECTED"],
  PENDING_VERIFICATION: ["VERIFIED_ACTIVE", "REJECTED", "BLOCKED"],
  VERIFIED_ACTIVE: ["PLEDGED", "SOLD", "RETIRED", "BLOCKED"],
  PLEDGED: ["SOLD", "VERIFIED_ACTIVE", "BLOCKED"],
  SOLD: ["RETIRED", "BLOCKED"],
  RETIRED: ["BLOCKED"],
  REJECTED: ["BLOCKED"],
  BLOCKED: [],
};

export interface UpdateCarbonStatusInput {
  carbonAssetId: string;
  newStatus: CarbonCreditStatus;
  actor?: string;
  reason?: string;
  overrideApprovalId?: string;
}

export function updateCarbonAssetStatus(
  input: UpdateCarbonStatusInput
): { ok: boolean; record?: CarbonCreditRecord; error?: string } {
  const record = getCarbonAsset(input.carbonAssetId);
  if (!record) return { ok: false, error: "carbon asset not found" };

  const allowed = ALLOWED_TRANSITIONS[record.status];
  if (!allowed.includes(input.newStatus)) {
    // Re-selling a retired credit always requires explicit override approval.
    if (record.status === "RETIRED" && input.newStatus === "SOLD") {
      if (!input.overrideApprovalId) {
        return { ok: false, error: "retired carbon credit cannot be sold again without override approval" };
      }
    } else {
      return {
        ok: false,
        error: `transition ${record.status} → ${input.newStatus} not allowed`,
      };
    }
  }

  const previousStatus = record.status;
  record.status = input.newStatus;
  record.updatedAt = nowIso();

  appendCarbonBitcoinAuditEvent({
    eventType: "CARBON_STATUS_UPDATED",
    actor: input.actor ?? "system",
    relatedAssetId: record.carbonAssetId,
    previousStatus,
    newStatus: record.status,
    reason: input.reason ?? "status update",
    riskFlags: record.riskFlags,
  });
  return { ok: true, record };
}

export interface AttachCarbonEvidenceInput {
  carbonAssetId: string;
  evidenceHash?: string;
  ipfsCid?: string;
  xrplAttestationTx?: string;
  stellarMirrorTx?: string;
  sourceDocuments?: string[];
  actor?: string;
}

export function attachCarbonEvidence(
  input: AttachCarbonEvidenceInput
): { ok: boolean; record?: CarbonCreditRecord; error?: string } {
  const record = getCarbonAsset(input.carbonAssetId);
  if (!record) return { ok: false, error: "carbon asset not found" };
  if (input.evidenceHash) record.evidenceHash = input.evidenceHash;
  if (input.ipfsCid) record.ipfsCid = input.ipfsCid;
  if (input.xrplAttestationTx) record.xrplAttestationTx = input.xrplAttestationTx;
  if (input.stellarMirrorTx) record.stellarMirrorTx = input.stellarMirrorTx;
  if (input.sourceDocuments) {
    record.sourceDocuments = Array.from(
      new Set([...record.sourceDocuments, ...input.sourceDocuments])
    );
  }
  record.updatedAt = nowIso();
  appendCarbonBitcoinAuditEvent({
    eventType: "CARBON_EVIDENCE_ATTACHED",
    actor: input.actor ?? "system",
    relatedAssetId: record.carbonAssetId,
    newStatus: record.status,
    reason: "evidence attached",
    evidenceRefs: [
      record.evidenceHash ?? "",
      record.ipfsCid ?? "",
      record.xrplAttestationTx ?? "",
      record.stellarMirrorTx ?? "",
    ].filter(Boolean),
  });
  return { ok: true, record };
}

export interface RetireCarbonCreditInput {
  carbonAssetId: string;
  retirementCertificateUrl: string;
  actor?: string;
}

export function markCarbonCreditRetired(
  input: RetireCarbonCreditInput
): { ok: boolean; record?: CarbonCreditRecord; error?: string } {
  const record = getCarbonAsset(input.carbonAssetId);
  if (!record) return { ok: false, error: "carbon asset not found" };
  if (record.status === "BLOCKED" || record.status === "REJECTED")
    return { ok: false, error: "blocked/rejected credits cannot be retired" };
  if (!input.retirementCertificateUrl)
    return { ok: false, error: "retirementCertificateUrl required" };

  const previousStatus = record.status;
  record.retirementStatus = "retired";
  record.retirementCertificateUrl = input.retirementCertificateUrl;
  record.status = "RETIRED";
  record.updatedAt = nowIso();

  appendCarbonBitcoinAuditEvent({
    eventType: "CARBON_RETIREMENT_RECORDED",
    actor: input.actor ?? "system",
    relatedAssetId: record.carbonAssetId,
    previousStatus,
    newStatus: "RETIRED",
    reason: "retirement certificate recorded",
    evidenceRefs: [input.retirementCertificateUrl],
  });
  return { ok: true, record };
}

// ─── Proof / readiness summary ───────────────────────────────────────────────

export interface CarbonProofSummary {
  carbonAssetId: string;
  status: CarbonCreditStatus;
  readinessScore: number;
  verificationStatus: CarbonVerificationStatus;
  retirementStatus: CarbonRetirementStatus;
  evidence: {
    hash: string | null;
    ipfsCid: string | null;
    xrplAttestationTx: string | null;
    stellarMirrorTx: string | null;
    retirementCertificateUrl: string | null;
  };
  riskFlags: string[];
  disclosure: string;
  generatedAt: string;
}

export function generateCarbonProofSummary(
  carbonAssetId: string
): CarbonProofSummary | { error: string } {
  const record = getCarbonAsset(carbonAssetId);
  if (!record) return { error: "carbon asset not found" };
  return {
    carbonAssetId: record.carbonAssetId,
    status: record.status,
    readinessScore: calculateCarbonReadinessScore(record),
    verificationStatus: record.verificationStatus,
    retirementStatus: record.retirementStatus,
    evidence: {
      hash: record.evidenceHash,
      ipfsCid: record.ipfsCid,
      xrplAttestationTx: record.xrplAttestationTx,
      stellarMirrorTx: record.stellarMirrorTx,
      retirementCertificateUrl: record.retirementCertificateUrl,
    },
    riskFlags: record.riskFlags,
    disclosure: CARBON_CREDIT_DISCLOSURE,
    generatedAt: nowIso(),
  };
}

// ─── Seed data (for UI rendering only — clearly demo) ────────────────────────

export function seedCarbonRegistryIfEmpty(): void {
  if (REGISTRY.length > 0) return;
  const a = createCarbonAssetRecord({
    carbonAssetId: "CRB-DEMO-001",
    registryName: "Verra (demo)",
    registryAccount: "demo-account-001",
    projectId: "VCS-DEMO-1234",
    projectName: "Demo Reforestation Project (Atlantic Forest)",
    projectLocation: "Brazil",
    projectType: "Reforestation",
    methodology: "VM0007",
    vintageYear: 2024,
    creditQuantity: 25000,
    serialNumbers: ["DEMO-2024-000001-025000"],
    ownerName: "TROPTIONS Demo Holder LLC",
    actor: "seed",
  });
  attachCarbonEvidence({
    carbonAssetId: a.carbonAssetId,
    evidenceHash: "sha256:demo-0001",
    ipfsCid: "bafy-demo-carbon-001",
    actor: "seed",
  });
  updateCarbonAssetStatus({
    carbonAssetId: a.carbonAssetId,
    newStatus: "PENDING_VERIFICATION",
    actor: "seed",
    reason: "demo seed",
  });

  const b = createCarbonAssetRecord({
    carbonAssetId: "CRB-DEMO-002",
    registryName: "Gold Standard (demo)",
    projectId: "GS-DEMO-5678",
    projectName: "Demo Cookstove Distribution",
    projectLocation: "Kenya",
    projectType: "Energy efficiency",
    methodology: "GS-TPDDTEC",
    vintageYear: 2023,
    creditQuantity: 8000,
    serialNumbers: ["DEMO-2023-000001-008000"],
    ownerName: "TROPTIONS Demo Holder LLC",
    actor: "seed",
  });
  attachCarbonEvidence({
    carbonAssetId: b.carbonAssetId,
    evidenceHash: "sha256:demo-0002",
    ipfsCid: "bafy-demo-carbon-002",
    actor: "seed",
  });
  updateCarbonAssetStatus({
    carbonAssetId: b.carbonAssetId,
    newStatus: "PENDING_VERIFICATION",
    actor: "seed",
    reason: "demo seed",
  });
  updateCarbonAssetStatus({
    carbonAssetId: b.carbonAssetId,
    newStatus: "VERIFIED_ACTIVE",
    actor: "seed",
    reason: "demo seed",
  });
  // Mark as owner-controlled / active so readiness score climbs
  const rec = getCarbonAsset(b.carbonAssetId);
  if (rec) {
    rec.custodyStatus = "owner-controlled";
    rec.verificationStatus = "verified";
    rec.retirementStatus = "active";
    rec.approvalStatus = "approved";
  }

  // Blocked example
  createCarbonAssetRecord({
    carbonAssetId: "CRB-DEMO-003",
    registryName: "",
    projectId: "",
    projectName: "Incomplete Demo",
    projectLocation: "Unknown",
    projectType: "Unknown",
    methodology: "",
    vintageYear: 2022,
    creditQuantity: 1000,
    ownerName: "",
    actor: "seed",
  });
}
