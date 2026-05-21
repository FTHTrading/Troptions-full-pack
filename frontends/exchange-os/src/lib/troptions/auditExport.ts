import crypto from "node:crypto";
import { AUDIT_LOG_REGISTRY } from "@/content/troptions/auditLogRegistry";
import { verifyAuditChain } from "@/lib/troptions/auditLogEngine";

export interface SignedAuditExport {
  payload: {
    exportedAt: string;
    totalEvents: number;
    chainVerification: ReturnType<typeof verifyAuditChain>;
    events: typeof AUDIT_LOG_REGISTRY;
  };
  algorithm: "HMAC-SHA256";
  keyId: string;
  signature: string;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

export function createSignedAuditExport(secret: string, keyId: string): SignedAuditExport {
  if (!secret || secret.length < 32) {
    throw new Error("Audit export secret must be at least 32 characters long.");
  }

  if (!keyId || !keyId.trim()) {
    throw new Error("Audit export key id is required.");
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    totalEvents: AUDIT_LOG_REGISTRY.length,
    chainVerification: verifyAuditChain(),
    events: AUDIT_LOG_REGISTRY,
  };

  const signature = crypto
    .createHmac("sha256", secret)
    .update(stableStringify(payload), "utf8")
    .digest("hex");

  return {
    payload,
    algorithm: "HMAC-SHA256",
    keyId,
    signature,
  };
}
