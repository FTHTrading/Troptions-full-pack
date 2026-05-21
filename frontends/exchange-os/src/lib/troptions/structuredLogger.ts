export type StructuredLogLevel = "debug" | "info" | "warn" | "error";

import { recordStructuredLogDurably } from "@/lib/troptions/durableObservabilityStore";

export interface StructuredLogEvent {
  timestamp: string;
  level: StructuredLogLevel;
  service: string;
  route?: string;
  actorId?: string;
  actorRole?: string;
  actionType?: string;
  subjectId?: string;
  requestId?: string;
  correlationId?: string;
  outcome?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

const LOG_BUFFER_LIMIT = 500;
const REDACT_KEYS = [
  "authorization",
  "token",
  "secret",
  "password",
  "privatekey",
  "private_key",
  "apikey",
  "api_key",
  "walletmaster",
  "wallet_master",
  "cookie",
];

const recentLogs: StructuredLogEvent[] = [];

function shouldRedactKey(key: string): boolean {
  const lower = key.toLowerCase();
  return REDACT_KEYS.some((fragment) => lower.includes(fragment));
}

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => redactSecrets(entry));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const redacted: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(record)) {
      if (shouldRedactKey(key)) {
        redacted[key] = "[REDACTED]";
      } else {
        redacted[key] = redactSecrets(entry);
      }
    }

    return redacted;
  }

  if (typeof value === "string") {
    if (/bearer\s+/i.test(value)) return "[REDACTED]";
    return value;
  }

  return value;
}

export function logStructuredEvent(input: Omit<StructuredLogEvent, "timestamp">): StructuredLogEvent {
  const event: StructuredLogEvent = {
    ...input,
    timestamp: new Date().toISOString(),
    metadata: input.metadata ? (redactSecrets(input.metadata) as Record<string, unknown>) : undefined,
  };

  recentLogs.push(event);
  if (recentLogs.length > LOG_BUFFER_LIMIT) {
    recentLogs.splice(0, recentLogs.length - LOG_BUFFER_LIMIT);
  }

  const message = JSON.stringify(event);
  if (event.level === "error") {
    console.error(message);
  } else if (event.level === "warn") {
    console.warn(message);
  } else {
    console.log(message);
  }

  void recordStructuredLogDurably(event).catch(() => {
    // Durable store failures must never block control-plane operations.
  });

  return event;
}

export function getRecentStructuredLogs(limit = 100): StructuredLogEvent[] {
  return recentLogs.slice(-Math.max(1, limit)).reverse();
}

export function clearStructuredLogsForTests(): void {
  recentLogs.splice(0, recentLogs.length);
}
