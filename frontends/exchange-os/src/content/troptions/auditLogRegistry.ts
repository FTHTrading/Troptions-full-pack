import crypto from "node:crypto";
import type { TroptionsRole } from "@/content/troptions/roleRegistry";

export interface AuditEvent {
  eventId: string;
  timestamp: string;
  actorId: string;
  actorRole: TroptionsRole;
  actionType: string;
  subjectId: string;
  subjectType: string;
  previousState: string;
  nextState: string;
  reason: string;
  evidenceIds: string[];
  approvalIds: string[];
  hash: string;
  previousHash: string;
}

function buildHash(input: Omit<AuditEvent, "hash">): string {
  const payload = JSON.stringify(input);
  return crypto.createHash("sha256").update(payload).digest("hex");
}

const genesisInput = {
  eventId: "AUDIT-GENESIS-000",
  timestamp: "2026-04-25T00:00:00.000Z",
  actorId: "system",
  actorRole: "viewer" as TroptionsRole,
  actionType: "genesis",
  subjectId: "system",
  subjectType: "system",
  previousState: "none",
  nextState: "initialized",
  reason: "Initialize Troptions audit chain",
  evidenceIds: [],
  approvalIds: [],
  previousHash: "GENESIS",
};

export const AUDIT_LOG_REGISTRY: AuditEvent[] = [
  {
    ...genesisInput,
    hash: buildHash(genesisInput),
  },
];

export function getLastAuditEvent(): AuditEvent {
  return AUDIT_LOG_REGISTRY[AUDIT_LOG_REGISTRY.length - 1];
}

export function computeAuditHash(input: Omit<AuditEvent, "hash">): string {
  return buildHash(input);
}
