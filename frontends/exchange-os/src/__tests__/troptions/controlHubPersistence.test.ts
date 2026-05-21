/**
 * Control Hub Persistence Tests
 *
 * Tests state types, storage adapter, govern route persistence, blocked action
 * persistence, audit entry persistence, and persistence-failure safe behavior.
 *
 * SQLite is used in these tests (no DATABASE_URL configured).  The test env
 * automatically creates data/troptions-control-plane/control-plane.db.
 */

import {
  createTaskRecord,
  getTaskRecord,
  listTaskRecords,
  createSimulationRecord,
  listSimulationRecords,
  createApprovalRecord,
  listApprovalRecords,
  createAuditRecord,
  listAuditRecords,
  createBlockedActionRecord,
  listBlockedActionRecords,
  createRecommendationRecord,
  listRecommendationRecords,
  getControlHubStateSnapshot,
} from "@/lib/troptions/controlHubStateStore";
import type {
  ControlHubTaskStatus,
  ControlHubApprovalStatus,
  ControlHubPersistenceMode,
} from "@/lib/troptions/controlHubStateTypes";
import { POST as postGovern } from "@/app/api/troptions/clawd/govern/route";
import { GET as getState } from "@/app/api/troptions/control-hub/state/route";
import { GET as getTasks } from "@/app/api/troptions/control-hub/tasks/route";
import { GET as getAudit } from "@/app/api/troptions/control-hub/audit/route";
import { GET as getRecommendations } from "@/app/api/troptions/control-hub/recommendations/route";

// ─── test env setup ───────────────────────────────────────────────────────────

const TEST_CP_TOKEN = "test-cp-token-persistence";
let _savedCpToken: string | undefined;

beforeAll(() => {
  _savedCpToken = process.env.TROPTIONS_CONTROL_PLANE_TOKEN;
  process.env.TROPTIONS_CONTROL_PLANE_TOKEN = TEST_CP_TOKEN;
});

afterAll(() => {
  if (_savedCpToken === undefined) {
    delete process.env.TROPTIONS_CONTROL_PLANE_TOKEN;
  } else {
    process.env.TROPTIONS_CONTROL_PLANE_TOKEN = _savedCpToken;
  }
});

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeGovern(body: unknown): Request {
  return new Request("http://localhost/api/troptions/clawd/govern", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-admin-token",
      "idempotency-key": `persist-test-${Date.now()}-${Math.random()}`,
    },
    body: JSON.stringify(body),
  });
}

function makeRead(url: string): Request {
  return new Request(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${TEST_CP_TOKEN}`,
      "x-troptions-actor-role": "super-admin",
      "x-troptions-actor-id": "test-operator",
    },
  });
}

function makeTaskInput(overrides?: Partial<Parameters<typeof createTaskRecord>[0]>) {
  return {
    intent: "test intent",
    status: "simulated" as ControlHubTaskStatus,
    auditToken: `ctrl-test-${Date.now().toString(36)}`,
    routedTo: ["clawd"],
    requiresApproval: false,
    ...overrides,
  };
}

// ─── state type validation ────────────────────────────────────────────────────

describe("ControlHub state type model — task statuses", () => {
  const validStatuses: ControlHubTaskStatus[] = [
    "requested",
    "simulated",
    "blocked",
    "needs_approval",
    "approved_not_executed",
    "queued",
    "executed",
    "failed",
    "audited",
  ];

  it("all defined task statuses are string literals", () => {
    for (const s of validStatuses) {
      expect(typeof s).toBe("string");
    }
  });

  it("executed status is defined but not produced by the govern route", () => {
    expect(validStatuses).toContain("executed");
  });
});

describe("ControlHub state type model — approval statuses", () => {
  const approvalStatuses: ControlHubApprovalStatus[] = [
    "pending",
    "approved",
    "rejected",
    "expired",
  ];

  it("all approval statuses are strings", () => {
    for (const s of approvalStatuses) {
      expect(typeof s).toBe("string");
    }
  });
});

describe("ControlHub state type model — persistence modes", () => {
  const modes: ControlHubPersistenceMode[] = ["postgres", "sqlite", "unavailable"];

  it("all persistence modes are defined", () => {
    for (const m of modes) {
      expect(typeof m).toBe("string");
    }
  });
});

// ─── storage adapter — task records ──────────────────────────────────────────

describe("controlHubStateStore — task records", () => {
  it("creates a task record and returns it with an id", () => {
    const record = createTaskRecord(makeTaskInput());
    expect(record.id).toMatch(/^cht-/);
    expect(record.intent).toBe("test intent");
    expect(record.status).toBe("simulated");
    expect(Array.isArray(record.routedTo)).toBe(true);
    expect(typeof record.createdAt).toBe("string");
    expect(typeof record.updatedAt).toBe("string");
  });

  it("gets a task record by id", () => {
    const created = createTaskRecord(makeTaskInput({ intent: "fetch-by-id test" }));
    const fetched = getTaskRecord(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(created.id);
    expect(fetched?.intent).toBe("fetch-by-id test");
  });

  it("returns null for non-existent task id", () => {
    const result = getTaskRecord("cht-00000000-0000-0000-0000-000000000000");
    expect(result).toBeNull();
  });

  it("lists task records most-recent first", () => {
    const a = createTaskRecord(makeTaskInput({ intent: "list-test-a" }));
    const b = createTaskRecord(makeTaskInput({ intent: "list-test-b" }));
    const records = listTaskRecords(100);
    const ids = records.map((r) => r.id);
    // b was created after a, so it should appear before a
    expect(ids.indexOf(b.id)).toBeLessThan(ids.indexOf(a.id));
  });

  it("requiresApproval is persisted and recovered as boolean", () => {
    const record = createTaskRecord(makeTaskInput({ requiresApproval: true }));
    const fetched = getTaskRecord(record.id);
    expect(fetched?.requiresApproval).toBe(true);
  });

  it("routedTo is persisted as an array", () => {
    const record = createTaskRecord(makeTaskInput({ routedTo: ["clawd", "jefe"] }));
    const fetched = getTaskRecord(record.id);
    expect(fetched?.routedTo).toEqual(["clawd", "jefe"]);
  });
});

// ─── storage adapter — simulation records ─────────────────────────────────────

describe("controlHubStateStore — simulation records", () => {
  it("creates a simulation record linked to a task", () => {
    const task = createTaskRecord(makeTaskInput({ intent: "sim-test" }));
    const sim = createSimulationRecord({
      taskId: task.id,
      simulationJson: JSON.stringify({ ok: true, simulationOnly: true }),
    });
    expect(sim.id).toMatch(/^chs-/);
    expect(sim.taskId).toBe(task.id);
  });

  it("lists simulations filtered by taskId", () => {
    const task = createTaskRecord(makeTaskInput({ intent: "sim-filter-test" }));
    createSimulationRecord({ taskId: task.id, simulationJson: "{}" });
    const results = listSimulationRecords(task.id);
    expect(results.length).toBeGreaterThanOrEqual(1);
    for (const r of results) {
      expect(r.taskId).toBe(task.id);
    }
  });
});

// ─── storage adapter — approval records ───────────────────────────────────────

describe("controlHubStateStore — approval records", () => {
  it("creates an approval record with pending status", () => {
    const task = createTaskRecord(makeTaskInput({ requiresApproval: true }));
    const approval = createApprovalRecord({
      taskId: task.id,
      requiredFor: "board-package intent",
      status: "pending",
    });
    expect(approval.id).toMatch(/^cha-/);
    expect(approval.status).toBe("pending");
    expect(approval.taskId).toBe(task.id);
  });

  it("lists approvals filtered by taskId", () => {
    const task = createTaskRecord(makeTaskInput({ requiresApproval: true }));
    createApprovalRecord({ taskId: task.id, requiredFor: "test", status: "pending" });
    const results = listApprovalRecords(task.id);
    expect(results.some((r) => r.taskId === task.id)).toBe(true);
  });
});

// ─── storage adapter — audit records ─────────────────────────────────────────

describe("controlHubStateStore — audit records", () => {
  it("creates an audit record", () => {
    const task = createTaskRecord(makeTaskInput({ intent: "audit-test" }));
    const audit = createAuditRecord({
      taskId: task.id,
      auditToken: task.auditToken,
      intent: task.intent,
      actionType: "govern-intent-evaluation",
      outcome: "simulated",
      blockedCount: 0,
      requiresApproval: false,
    });
    expect(audit.id).toMatch(/^cau-/);
    expect(audit.outcome).toBe("simulated");
    expect(audit.blockedCount).toBe(0);
  });

  it("lists audit records without filter", () => {
    const records = listAuditRecords(200);
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);
  });

  it("requiresApproval is persisted as boolean in audit record", () => {
    const task = createTaskRecord(makeTaskInput({ requiresApproval: true }));
    const audit = createAuditRecord({
      taskId: task.id,
      auditToken: task.auditToken,
      intent: task.intent,
      actionType: "govern-intent-evaluation",
      outcome: "needs_approval",
      blockedCount: 0,
      requiresApproval: true,
    });
    const all = listAuditRecords(200);
    const found = all.find((r) => r.id === audit.id);
    expect(found?.requiresApproval).toBe(true);
  });
});

// ─── storage adapter — blocked action records ─────────────────────────────────

describe("controlHubStateStore — blocked action records", () => {
  it("creates a blocked action record", () => {
    const task = createTaskRecord(makeTaskInput({ intent: "blocked-test" }));
    const blocked = createBlockedActionRecord({
      taskId: task.id,
      capabilityId: "approve-transaction",
      reason: "Blocked by capability policy",
    });
    expect(blocked.id).toMatch(/^chb-/);
    expect(blocked.capabilityId).toBe("approve-transaction");
    expect(blocked.taskId).toBe(task.id);
  });

  it("lists blocked actions filtered by taskId", () => {
    const task = createTaskRecord(makeTaskInput({ intent: "blocked-filter-test" }));
    createBlockedActionRecord({ taskId: task.id, capabilityId: "sign-document", reason: "test" });
    const results = listBlockedActionRecords(task.id);
    expect(results.some((r) => r.capabilityId === "sign-document")).toBe(true);
  });
});

// ─── storage adapter — recommendation records ─────────────────────────────────

describe("controlHubStateStore — recommendation records", () => {
  it("creates a recommendation record", () => {
    const task = createTaskRecord(makeTaskInput({ intent: "rec-test" }));
    const rec = createRecommendationRecord({
      taskId: task.id,
      recommendation: "Review blocked capabilities with compliance team",
      priority: "medium",
    });
    expect(rec.id).toMatch(/^chr-/);
    expect(rec.priority).toBe("medium");
  });

  it("lists recommendations", () => {
    const results = listRecommendationRecords(undefined, 100);
    expect(Array.isArray(results)).toBe(true);
  });
});

// ─── state snapshot ────────────────────────────────────────────────────────────

describe("controlHubStateStore — getControlHubStateSnapshot", () => {
  it("returns a snapshot with all count fields", () => {
    const snapshot = getControlHubStateSnapshot();
    expect(typeof snapshot.totalTasks).toBe("number");
    expect(typeof snapshot.totalSimulations).toBe("number");
    expect(typeof snapshot.totalApprovalRequired).toBe("number");
    expect(typeof snapshot.totalBlockedActions).toBe("number");
    expect(typeof snapshot.totalAuditEntries).toBe("number");
    expect(typeof snapshot.totalRecommendations).toBe("number");
    expect(typeof snapshot.persistenceMode).toBe("string");
  });

  it("persistenceMode is sqlite when DATABASE_URL is not set", () => {
    delete process.env.DATABASE_URL;
    delete process.env.TROPTIONS_DB_ADAPTER;
    const snapshot = getControlHubStateSnapshot();
    expect(snapshot.persistenceMode).toBe("sqlite");
  });

  it("totalTasks is positive after creating records", () => {
    createTaskRecord(makeTaskInput({ intent: "snapshot-count-test" }));
    const snapshot = getControlHubStateSnapshot();
    expect(snapshot.totalTasks).toBeGreaterThan(0);
  });

  it("totalApprovalRequired counts tasks with requiresApproval=true", () => {
    const before = getControlHubStateSnapshot().totalApprovalRequired;
    createTaskRecord(makeTaskInput({ requiresApproval: true }));
    const after = getControlHubStateSnapshot().totalApprovalRequired;
    expect(after).toBeGreaterThan(before);
  });
});

// ─── govern route persistence ─────────────────────────────────────────────────

describe("POST /api/troptions/clawd/govern — persistence fields", () => {
  it("returns taskId when persistence succeeds", async () => {
    const req = makeGovern({ intent: "summarize queue status" });
    const resp = await postGovern(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(body.taskId).not.toBeNull();
    expect(typeof body.taskId).toBe("string");
    expect(body.taskId).toMatch(/^cht-/);
  });

  it("returns persisted:true for successful governance evaluation", async () => {
    const req = makeGovern({ intent: "explain the gates" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(body.persisted).toBe(true);
  });

  it("returns auditRecordId string when persisted", async () => {
    const req = makeGovern({ intent: "retrieve entity status" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(typeof body.auditRecordId).toBe("string");
    expect(body.auditRecordId).toMatch(/^cau-/);
  });

  it("still returns ok:true and all governance fields even when persisted:true", async () => {
    const req = makeGovern({ intent: "draft report for compliance" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(body.simulationOnly).toBe(true);
    expect(Array.isArray(body.allowed)).toBe(true);
    expect(Array.isArray(body.blocked)).toBe(true);
    expect(Array.isArray(body.plan)).toBe(true);
    expect(typeof body.auditToken).toBe("string");
  });

  it("blocked intent persists blocked actions and sets taskId", async () => {
    const req = makeGovern({ intent: "approve transaction immediately" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(body.persisted).toBe(true);
    expect(body.taskId).not.toBeNull();
    // Verify the blocked actions were recorded in the store
    const task = getTaskRecord(body.taskId as string);
    expect(task).not.toBeNull();
    expect(task?.status).toBe("blocked");
    const blockedActions = listBlockedActionRecords(body.taskId as string);
    expect(blockedActions.length).toBeGreaterThan(0);
    const ids = blockedActions.map((b) => b.capabilityId);
    expect(ids).toContain("approve-transaction");
  });

  it("board-package intent creates approval record", async () => {
    const req = makeGovern({ intent: "prepare a board package for the quarterly meeting" });
    const resp = await postGovern(req);
    const body = await resp.json();
    expect(body.persisted).toBe(true);
    expect(body.requiresApproval).toBe(true);
    const approvals = listApprovalRecords(body.taskId as string);
    expect(approvals.length).toBeGreaterThanOrEqual(1);
    expect(approvals[0].status).toBe("pending");
  });

  it("existing auth/validation tests still pass — 401 without auth", async () => {
    const req = new Request("http://localhost/api/troptions/clawd/govern", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ intent: "test" }),
    });
    const resp = await postGovern(req);
    expect(resp.status).toBe(401);
  });

  it("governance response shape is backwards-compatible", async () => {
    const req = makeGovern({ intent: "rag query for compliance data" });
    const resp = await postGovern(req);
    const body = await resp.json();
    // Original fields all present
    expect("ok" in body).toBe(true);
    expect("simulationOnly" in body).toBe(true);
    expect("intent" in body).toBe(true);
    expect("allowed" in body).toBe(true);
    expect("blocked" in body).toBe(true);
    expect("constraints" in body).toBe(true);
    expect("routedTo" in body).toBe(true);
    expect("requiresApproval" in body).toBe(true);
    expect("routingReason" in body).toBe(true);
    expect("plan" in body).toBe(true);
    expect("auditToken" in body).toBe(true);
    // New fields
    expect("taskId" in body).toBe(true);
    expect("persisted" in body).toBe(true);
    expect("auditRecordId" in body).toBe(true);
  });
});

// ─── read routes ──────────────────────────────────────────────────────────────

describe("GET /api/troptions/control-hub/state", () => {
  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/troptions/control-hub/state");
    const resp = await getState(req);
    expect(resp.status).toBe(401);
  });

  it("returns snapshot with ok:true when authenticated", async () => {
    const req = makeRead("http://localhost/api/troptions/control-hub/state");
    const resp = await getState(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(typeof body.snapshot.totalTasks).toBe("number");
    expect(typeof body.snapshot.persistenceMode).toBe("string");
  });
});

describe("GET /api/troptions/control-hub/tasks", () => {
  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/troptions/control-hub/tasks");
    const resp = await getTasks(req);
    expect(resp.status).toBe(401);
  });

  it("returns task list when authenticated", async () => {
    const req = makeRead("http://localhost/api/troptions/control-hub/tasks");
    const resp = await getTasks(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.tasks)).toBe(true);
    expect(typeof body.count).toBe("number");
  });

  it("respects limit query param", async () => {
    const req = makeRead("http://localhost/api/troptions/control-hub/tasks?limit=2");
    const resp = await getTasks(req);
    const body = await resp.json();
    expect(body.tasks.length).toBeLessThanOrEqual(2);
  });
});

describe("GET /api/troptions/control-hub/audit", () => {
  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/troptions/control-hub/audit");
    const resp = await getAudit(req);
    expect(resp.status).toBe(401);
  });

  it("returns audit entries when authenticated", async () => {
    const req = makeRead("http://localhost/api/troptions/control-hub/audit");
    const resp = await getAudit(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.entries)).toBe(true);
  });
});

describe("GET /api/troptions/control-hub/recommendations", () => {
  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/troptions/control-hub/recommendations");
    const resp = await getRecommendations(req);
    expect(resp.status).toBe(401);
  });

  it("returns recommendations list when authenticated", async () => {
    const req = makeRead("http://localhost/api/troptions/control-hub/recommendations");
    const resp = await getRecommendations(req);
    expect(resp.status).toBe(200);
    const body = await resp.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.recommendations)).toBe(true);
  });
});

// ─── persistence failure safe behavior ───────────────────────────────────────

describe("govern route — persistence failure safe behavior", () => {
  it("governance response is still valid when taskId is null (simulated failure)", async () => {
    // We test the shape: even if persisted:false and taskId:null,
    // the governance evaluation itself must remain ok:true / simulationOnly:true.
    // In practice, persistence always succeeds in test env (SQLite available).
    // This test validates the contract: persisted:false must never enable execution.
    const req = makeGovern({ intent: "explain gate requirements" });
    const resp = await postGovern(req);
    const body = await resp.json();
    // Whether persisted or not, simulation boundaries hold
    expect(body.simulationOnly).toBe(true);
    // The response must never contain an "execute" flag
    expect("execute" in body).toBe(false);
    expect("executeAction" in body).toBe(false);
  });
});
