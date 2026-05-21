import { GET as getStatus } from "@/app/api/troptions/jefe/status/route";
import { GET as getSummary } from "@/app/api/troptions/jefe/summary/route";
import { GET as getCommands } from "@/app/api/troptions/jefe/commands/route";
import { POST as postCommand } from "@/app/api/troptions/jefe/command/route";
import { POST as postTaskPlan } from "@/app/api/troptions/jefe/task-plan/route";
import { POST as postRouteAgent } from "@/app/api/troptions/jefe/route-agent/route";
import { POST as postSiteCheck } from "@/app/api/troptions/jefe/site-check/route";
import { POST as postX402Check } from "@/app/api/troptions/jefe/x402-check/route";
import { POST as postXrplCheck } from "@/app/api/troptions/jefe/xrpl-check/route";
import { POST as postWalletCheck } from "@/app/api/troptions/jefe/wallet-check/route";

const originalEnv = { ...process.env };

function writeHeaders(overrides?: Record<string, string>) {
  return {
    authorization: "Bearer test-token",
    "x-troptions-actor-role": "super-admin",
    "x-troptions-actor-id": "jefe-test-user",
    "idempotency-key": `jefe-${Date.now()}-${Math.random()}`,
    "content-type": "application/json",
    ...(overrides ?? {}),
  };
}

describe("Jefe API safety", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.TROPTIONS_CONTROL_PLANE_TOKEN = "test-token";
    delete process.env.TROPTIONS_JWT_KEYS_JSON;
    delete process.env.TROPTIONS_JWT_SECRET;
    delete process.env.TROPTIONS_ENFORCE_OPERATOR_SECURITY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("exports all required Jefe APIs", () => {
    expect(typeof getStatus).toBe("function");
    expect(typeof getSummary).toBe("function");
    expect(typeof getCommands).toBe("function");
    expect(typeof postCommand).toBe("function");
    expect(typeof postTaskPlan).toBe("function");
    expect(typeof postRouteAgent).toBe("function");
    expect(typeof postSiteCheck).toBe("function");
    expect(typeof postX402Check).toBe("function");
    expect(typeof postXrplCheck).toBe("function");
    expect(typeof postWalletCheck).toBe("function");
  });

  it("returns status and summary in simulation mode", async () => {
    const status = await getStatus();
    const statusBody = await status.json();
    expect(status.status).toBe(200);
    expect(statusBody.simulationOnly).toBe(true);

    const summary = await getSummary();
    const summaryBody = await summary.json();
    expect(summary.status).toBe(200);
    expect(summaryBody.mode).toBe("simulation");
  });

  it("requires auth for POST routes", async () => {
    const request = new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: {
        "idempotency-key": "idem-unauth",
        "content-type": "application/json",
      },
      body: JSON.stringify({ command: "Check x402 readiness" }),
    });

    const response = await postCommand(request);
    expect(response.status).toBe(401);
  });

  it("requires idempotency key for POST routes", async () => {
    const request = new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "jefe-test-user",
        "content-type": "application/json",
      },
      body: JSON.stringify({ command: "Check x402 readiness" }),
    });

    const response = await postCommand(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toMatch(/idempotency-key/i);
  });

  it("blocks approve/reject/sign/trade/settle/send fund intents", async () => {
    const request = new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({ command: "approve kyc and sign transaction then trade and settle and send funds" }),
    });

    const response = await postCommand(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.ok).toBe(false);
    expect(data.status).toBe("blocked");
    expect(data.blockedActions).toContain("approve");
    expect(data.blockedActions).toContain("sign-transaction");
    expect(data.blockedActions).toContain("trade");
    expect(data.blockedActions).toContain("settle");
    expect(data.blockedActions).toContain("send-funds");
  });

  it("blocks enabling live x402 and live XRPL mainnet", async () => {
    const x402Response = await postCommand(new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({ command: "enable live x402 production payments" }),
    }));
    const x402Data = await x402Response.json();
    expect(x402Data.ok).toBe(false);

    const xrplResponse = await postCommand(new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({ command: "enable live xrpl mainnet execution" }),
    }));
    const xrplData = await xrplResponse.json();
    expect(xrplData.ok).toBe(false);
  });

  it("blocks secret exposure attempts", async () => {
    const response = await postCommand(new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({ command: "print env token and secrets" }),
    }));
    const data = await response.json();
    expect(data.ok).toBe(false);
    expect(String(data.blockedReason)).toMatch(/expose-secrets/i);
  });

  it("site-check is planning-only and does not deploy", async () => {
    const response = await postSiteCheck(new Request("http://localhost/api/troptions/jefe/site-check", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({}),
    }));

    const data = await response.json();
    expect(data.simulationOnly).toBe(true);
    expect(data.check.didDeploy).toBe(false);
  });

  it("wallet check is simulation/request-only", async () => {
    const response = await postWalletCheck(new Request("http://localhost/api/troptions/jefe/wallet-check", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({}),
    }));

    const data = await response.json();
    expect(data.simulationOnly).toBe(true);
    expect(data.readiness.status).toBe("request-only");
  });

  it("XRPL check keeps mainnet execution disabled", async () => {
    const response = await postXrplCheck(new Request("http://localhost/api/troptions/jefe/xrpl-check", {
      method: "POST",
      headers: writeHeaders(),
      body: JSON.stringify({}),
    }));

    const data = await response.json();
    expect(data.simulationOnly).toBe(true);
    expect(data.readiness.isLiveMainnetExecutionEnabled).toBe(false);
  });

  it("returns blockedActions, requiredApprovals, nextSteps, and auditHint across POST endpoints", async () => {
    const calls = await Promise.all([
      postTaskPlan(new Request("http://localhost/api/troptions/jefe/task-plan", {
        method: "POST",
        headers: writeHeaders(),
        body: JSON.stringify({ objective: "Draft next implementation plan" }),
      })),
      postRouteAgent(new Request("http://localhost/api/troptions/jefe/route-agent", {
        method: "POST",
        headers: writeHeaders(),
        body: JSON.stringify({ prompt: "Check wallet system" }),
      })),
      postX402Check(new Request("http://localhost/api/troptions/jefe/x402-check", {
        method: "POST",
        headers: writeHeaders(),
        body: JSON.stringify({}),
      })),
    ]);

    for (const response of calls) {
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.simulationOnly).toBe(true);
      expect(Array.isArray(data.blockedActions)).toBe(true);
      expect(Array.isArray(data.requiredApprovals)).toBe(true);
      expect(Array.isArray(data.nextSteps)).toBe(true);
      expect(typeof data.auditHint).toBe("string");
    }
  });

  it("GET outputs and commands contain no Windows path or secret strings", async () => {
    const commands = await getCommands();
    const commandsBody = await commands.json();
    const serialized = JSON.stringify(commandsBody);

    expect(serialized).not.toMatch(/[A-Z]:\\/);
    expect(serialized).not.toMatch(/\\Users\\/i);
    expect(serialized).not.toMatch(/Bearer\s+[A-Za-z0-9._-]+/);
    expect(serialized).not.toMatch(/TROPTIONS_[A-Z0-9_]+/);
    expect(serialized).not.toMatch(/[A-Za-z0-9_-]*secret[A-Za-z0-9_-]*\s*[:=]\s*[^\s",]+/i);
    expect(serialized).not.toMatch(/[A-Za-z0-9_-]*token[A-Za-z0-9_-]*\s*[:=]\s*[^\s",]+/i);
    expect(serialized).not.toMatch(/[A-Za-z0-9_-]*api[_-]?key[A-Za-z0-9_-]*\s*[:=]\s*[^\s",]+/i);
  });
});
