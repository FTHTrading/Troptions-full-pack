export const METRIC_KEYS = [
  "api_requests_total",
  "api_request_failures",
  "auth_failures",
  "rate_limit_blocks",
  "idempotency_replays",
  "deployment_gate_blocks",
  "release_gate_failures",
  "approval_requests",
  "approval_decisions",
  "workflow_transitions",
  "exception_resolutions",
  "audit_exports",
  "health_check_results",
  "db_read_failures",
  "db_write_failures",
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

const counters: Record<MetricKey, number> = Object.fromEntries(
  METRIC_KEYS.map((key) => [key, 0]),
) as Record<MetricKey, number>;

export function incrementMetric(key: MetricKey, amount = 1): void {
  counters[key] += amount;
}

export function getMetricsSnapshot(): Record<MetricKey, number> {
  return { ...counters };
}

export function resetMetricsForTests(): void {
  for (const key of METRIC_KEYS) {
    counters[key] = 0;
  }
}
