import { evaluateClawdIntent, getClawdGovernanceStatus, isActionBlockedByGovernance } from "@/lib/troptions/clawdGovernanceAdapter";
import { POST as postGovern } from "@/app/api/troptions/clawd/govern/route";
import {
  CONTROL_HUB_CONFIG,
  CONTROL_HUB_AGENT_TIERS,
  CLAWD_ROUTING_RULES,
  JEFE_CLAWD_COMMANDS,
  CONTROL_HUB_POLICY_SUMMARY,
} from "@/content/troptions/controlHubRegistry";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown, overrideHeaders?: Record<string, string>): Request {
  return new Request("http://localhost/api/troptions/clawd/govern", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-admin-token",
      "idempotency-key": `govern-${Date.now()}-${Math.random()}`,
      ...(overrideHeaders ?? {}),
    },
    body: JSON.stringify(body),
  });
}

// ─── controlHubRegistry ───────────────────────────────────────────────────────

describe("CONTROL_HUB_CONFIG", () => {
  it("has required fields", () => {
    expect(CONTROL_HUB_CONFIG.id).toBe("troptions-control-hub");
    expect(CONTROL_HUB_CONFIG.clawdAgentId).toBe("clawd");
    expect(CONTROL_HUB_CONFIG.activeMode).toBe("simulation-governed");
    expect(CONTROL_HUB_CONFIG.humanReviewRequired).toBe(true);
    expect(CONTROL_HUB_CONFIG.auditModel).toBe("full-audit");
  });

  it("counts match underlying registries", () => {
    // At least some constraints
    expect(CONTROL_HUB_CONFIG.constraintCount).toBeGreaterThan(0);
    // At least some allowed capabilities
    expect(CONTROL_HUB_CONFIG.allowedCapabilityCount).toBeGreaterThan(0);
    // At least some blocked capabilities
    expect(CONTROL_HUB_CONFIG.blockedCapabilityCount).toBeGreaterThan(0);
    // Blocked action counts are > 0
    expect(CONTROL_HUB_CONFIG.enforcedPolicies.openClawBlocked).toBeGreaterThan(0);
    expect(CONTROL_HUB_CONFIG.enforcedPolicies.jefeBlocked).toBeGreaterThan(0);
  });
});

describe("CONTROL_HUB_AGENT_TIERS", () => {
  it("has three tiers", () => {
    expect(CONTROL_HUB_AGENT_TIERS).toHaveLength(3);
  });

  it("tiers are fast, deep, specialist in order", () => {
    expect(CONTROL_HUB_AGENT_TIERS[0].tier).toBe("fast");
    expect(CONTROL_HUB_AGENT_TIERS[1].tier).toBe("deep");
    expect(CONTROL_HUB_AGENT_TIERS[2].tier).toBe("specialist");
  });

  it("deep tier requires human approval", () => {
    const deepTier = CONTROL_HUB_AGENT_TIERS.find((t) => t.tier === "deep");
    expect(deepTier?.humanApprovalRequired).toBe(true);
  });

  it("fast tier does not require human approval", () => {
    const fastTier = CONTROL_HUB_AGENT_TIERS.find((t) => t.tier === "fast");
    expect(fastTier?.humanApprovalRequired).toBe(false);
  });
});

describe("CLAWD_ROUTING_RULES", () => {
  it("has at least one rule", () => {
    expect(CLAWD_ROUTING_RULES.length).toBeGreaterThan(0);
  });

  it("board-package rule routes to Clawd and requires approval", () => {
    const rule = CLAWD_ROUTING_RULES.find((r) => r.intentPattern === "board-package");
    expect(rule).toBeDefined();
    expect(rule?.routedTo).toContain("clawd");
    expect(rule?.requiresApproval).toBe(true);
  });
});

describe("JEFE_CLAWD_COMMANDS", () => {
  it("only includes commands that route to Clawd", () => {
    for (const cmd of JEFE_CLAWD_COMMANDS) {
      expect(cmd.routedAgents).toContain("clawd");
    }
  });
});

describe("CONTROL_HUB_POLICY_SUMMARY", () => {
  it("has non-empty allowed and blocked lists for all three layers", () => {
    expect(CONTROL_HUB_POLICY_SUMMARY.clawdAllowed.length).toBeGreaterThan(0);
    expect(CONTROL_HUB_POLICY_SUMMARY.clawdBlocked.length).toBeGreaterThan(0);
    expect(CONTROL_HUB_POLICY_SUMMARY.openClawAllowed.length).toBeGreaterThan(0);
    expect(CONTROL_HUB_POLICY_SUMMARY.openClawBlocked.length).toBeGreaterThan(0);
    expect(CONTROL_HUB_POLICY_SUMMARY.jefeAllowed.length).toBeGreaterThan(0);
    expect(CONTROL_HUB_POLICY_SUMMARY.jefeBlocked.length).toBeGreaterThan(0);
    expect(CONTROL_HUB_POLICY_SUMMARY.constraints.length).toBeGreaterThan(0);
  });
});

// ─── clawdGovernanceAdapter ───────────────────────────────────────────────────

describe("getClawdGovernanceStatus", () => {
  it("returns correct shape", () => {
    const status = getClawdGovernanceStatus();
    expect(status.agentId).toBe("clawd");
    expect(status.label).toBe("Clawd");
    expect(status.status).toBe("online");
    expect(status.humanReviewRequired).toBe(true);
    expect(typeof status.constraintCount).toBe("number");
    expect(typeof status.allowedCapabilityCount).toBe("number");
    expect(typeof status.blockedCapabilityCount).toBe("number");
  });

  it("constraint count matches policy summary", () => {
    const status = getClawdGovernanceStatus();
    expect(status.constraintCount).toBe(CONTROL_HUB_POLICY_SUMMARY.constraints.length);
  });
});

describe("evaluateClawdIntent — allowed intents", () => {
  it("returns ok:true and simulationOnly:true for any intent", () => {
    const result = evaluateClawdIntent("summarize queue");
    expect(result.ok).toBe(true);
    expect(result.simulationOnly).toBe(true);
  });

  it("includes intent in response", () => {
    const intent = "retrieve entity status";
    const result = evaluateClawdIntent(intent);
    expect(result.intent).toBe(intent);
  });

  it("returns non-empty allowed capabilities", () => {
    const result = evaluateClawdIntent("summarize queue status");
    expect(result.allowed.length).toBeGreaterThan(0);
  });

  it("always includes system prompt constraints", () => {
    const result = evaluateClawdIntent("explain the gates process");
    expect(result.appliedConstraints.length).toBeGreaterThan(0);
    expect(result.appliedConstraints).toEqual(CONTROL_HUB_POLICY_SUMMARY.constraints);
  });

  it("returns an audit token string", () => {
    const result = evaluateClawdIntent("draft report");
    expect(typeof result.auditToken).toBe("string");
    expect(result.auditToken.length).toBeGreaterThan(0);
    // Starts with the ctrl- prefix
    expect(result.auditToken.startsWith("ctrl-")).toBe(true);
  });

  it("includes a routing decision", () => {
    const result = evaluateClawdIntent("summarize open blockers");
    expect(result.routedTo.length).toBeGreaterThan(0);
    expect(typeof result.routingReason).toBe("string");
  });

  it("returns a simulation plan with at least one step", () => {
    const result = evaluateClawdIntent("retrieve entity data");
    expect(result.plan.length).toBeGreaterThan(0);
    for (const step of result.plan) {
      expect(typeof step.step).toBe("number");
      expect(typeof step.action).toBe("string");
      expect(typeof step.description).toBe("string");
    }
  });
});

describe("evaluateClawdIntent — blocked intents", () => {
  it("flags approve-transaction as blocked", () => {
    const result = evaluateClawdIntent("approve transaction for settlement");
    expect(result.blocked.length).toBeGreaterThan(0);
    const ids = result.blocked.map((b) => b.id);
    expect(ids).toContain("approve-transaction");
  });

  it("still returns ok:true and simulationOnly:true even for blocked intent", () => {
    // The governance adapter returns the plan — it does NOT execute the blocked action.
    // ok:true means the evaluation succeeded, not that the action is permitted.
    const result = evaluateClawdIntent("sign document and execute trade");
    expect(result.ok).toBe(true);
    expect(result.simulationOnly).toBe(true);
    expect(result.blocked.length).toBeGreaterThan(0);
  });

  it("sign-document triggers a blocked entry", () => {
    const result = evaluateClawdIntent("sign document for counterparty");
    const ids = result.blocked.map((b) => b.id);
    expect(ids).toContain("sign-document");
  });
});

describe("evaluateClawdIntent — routing", () => {
  it("routes board-package intent to Clawd", () => {
    const result = evaluateClawdIntent("create a board package for the next meeting");
    expect(result.routedTo).toContain("clawd");
    expect(result.requiresApproval).toBe(true);
  });

  it("unknown intent defaults routing to Clawd", () => {
    const result = evaluateClawdIntent("what is the status of the project");
    expect(result.routedTo).toContain("clawd");
  });
});

describe("isActionBlockedByGovernance", () => {
  it("approve-transaction is blocked at Clawd layer", () => {
    const result = isActionBlockedByGovernance("approve-transaction");
    expect(result.blocked).toBe(true);
    expect(result.blockedBy).toContain("clawd-capability-policy");
  });

  it("retrieve-entity is not blocked", () => {
    const result = isActionBlockedByGovernance("retrieve-entity");
    expect(result.blocked).toBe(false);
    expect(result.blockedBy).toHaveLength(0);
  });

  it("returns blockedBy as an array", () => {
    const result = isActionBlockedByGovernance("some-unknown-action");
    expect(Array.isArray(result.blockedBy)).toBe(true);
  });
});

// ─── /api/troptions/clawd/govern route ────────────────────────────────────────

describe("POST /api/troptions/clawd/govern — auth guards", () => {
  it("returns 401 without authorization header", async () => {
    const req = makeRequest({ intent: "explain the gates" }, { authorization: "" });
    const resp = await postGovern(req);
    expect(resp.status).toBe(401);
    const body = await resp.json();
    expect(body.ok).toBe(false);
  });

  it("returns 400 without idempotency-key header", async () => {
    const req = makeRequest(
      { intent: "explain the gates" },
      { "idempotency-key": "" }
    );
    const resp = await postGovern(req);
    expect(resp.status).toBe(400);
    const body = await resp.json();
    expect(body.ok).toBe(false);
  });
});

describe("POST /api/troptions/clawd/govern — validation", () => {
  it("returns 400 when intent is missing", async () => {
    const req = makeRequest({ context: "some context" });
    const resp = await postGovern(req);
    expect(resp.status).toBe(400);
  });

  it("returns 400 when intent is empty string", async () => {
    const req = makeRequest({ intent: "   " });
    const resp = await postGovern(req);
    expect(resp.status).toBe(400);
  });

  it("returns 400 when intent exceeds 500 characters", async () => {
    const req = makeRequest({ intent: "a".repeat(501) });
    const resp = await postGovern(req);
    expect(resp.status).toBe(400);
  });

  it("returns 400 on invalid JSON", async () => {
    const raw = new Request("http://localhost/api/troptions/clawd/govern", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer test-admin-token",
        "idempotency-key": `govern-invalid-${Date.now()}`,
      },
      body: "{ not valid json",
    });
    const resp = await postGovern(raw);
    expect(resp.status).toBe(400);
  });
});

describe("POST /api/troptions/clawd/govern — success", () => {
  it("returns 200 with governed plan for allowed intent", async () => {
    const req = makeRequest({ intent: "summarize open queue items" });
    const resp = await postGovern(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(body.simulationOnly).toBe(true);
    expect(body.intent).toBe("summarize open queue items");
    expect(Array.isArray(body.allowed)).toBe(true);
    expect(Array.isArray(body.blocked)).toBe(true);
    expect(Array.isArray(body.constraints)).toBe(true);
    expect(Array.isArray(body.routedTo)).toBe(true);
    expect(Array.isArray(body.plan)).toBe(true);
    expect(typeof body.auditToken).toBe("string");
    expect(body.auditToken.startsWith("ctrl-")).toBe(true);
  });

  it("blocked capabilities are included in response for blocked intent", async () => {
    const req = makeRequest({ intent: "approve transaction immediately" });
    const resp = await postGovern(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.blocked.length).toBeGreaterThan(0);
    const blockedIds = body.blocked.map((b: { id: string }) => b.id);
    expect(blockedIds).toContain("approve-transaction");
  });

  it("response includes routing reason string", async () => {
    const req = makeRequest({ intent: "explain x402 policy gates" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(typeof body.routingReason).toBe("string");
    expect(body.routingReason.length).toBeGreaterThan(0);
  });

  it("board-package intent sets requiresApproval to true", async () => {
    const req = makeRequest({ intent: "prepare a board package for the quarterly meeting" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(body.requiresApproval).toBe(true);
    expect(body.routedTo).toContain("clawd");
  });
});
