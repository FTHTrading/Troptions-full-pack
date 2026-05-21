import { insertMetric } from "@/lib/troptions/db";
import { recordMetricEventDurably } from "@/lib/troptions/durableObservabilityStore";
import { incrementMetric } from "@/lib/troptions/metricsRegistry";
import { logStructuredEvent } from "@/lib/troptions/structuredLogger";

const EVENT_TO_METRIC: Record<string, Parameters<typeof incrementMetric>[0] | null> = {
  request_guard_pass: "api_requests_total",
  request_guard_block: "api_request_failures",
  request_guard_error: "api_request_failures",
  auth_failure: "auth_failures",
  rate_limit_block: "rate_limit_blocks",
  idempotency_hit: "idempotency_replays",
  deployment_gate_block: "deployment_gate_blocks",
  approval_requested: "approval_requests",
  approval_approved: "approval_decisions",
  approval_rejected: "approval_decisions",
  workflow_transition: "workflow_transitions",
  exception_resolved: "exception_resolutions",
  audit_export: "audit_exports",
  health_check: "health_check_results",
  db_read_failure: "db_read_failures",
  db_write_failure: "db_write_failures",
};

export function trackControlPlaneEvent(
  eventName: string,
  level: "info" | "warn" | "error",
  tags: Record<string, unknown>,
): void {
  const mappedMetric = EVENT_TO_METRIC[eventName] ?? null;
  if (mappedMetric) {
    incrementMetric(mappedMetric);
  }

  try {
    insertMetric(eventName, level, tags);
  } catch {
    // Metrics should not break control-plane flows.
  }

  void recordMetricEventDurably({
    eventName,
    level,
    tags,
  }).catch(() => {
    // Durable metrics storage must not break control-plane flows.
  });

  const payload = {
    service: "troptions-control-plane",
    route: typeof tags.routeKey === "string" ? tags.routeKey : undefined,
    level,
    actorId: typeof tags.actorId === "string" ? tags.actorId : undefined,
    actorRole: typeof tags.actorRole === "string" ? tags.actorRole : undefined,
    actionType: eventName,
    subjectId: typeof tags.subjectId === "string" ? tags.subjectId : undefined,
    requestId: typeof tags.requestId === "string" ? tags.requestId : undefined,
    correlationId: typeof tags.correlationId === "string" ? tags.correlationId : undefined,
    outcome: level === "error" ? "error" : level === "warn" ? "warn" : "success",
    durationMs: typeof tags.durationMs === "number" ? tags.durationMs : undefined,
    metadata: tags,
  };

  logStructuredEvent(payload);
}
