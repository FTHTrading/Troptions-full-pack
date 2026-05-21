import { GET as getOpenClawStatus } from "@/app/api/troptions/openclaw/status/route";
import { POST as postOpenClawChat } from "@/app/api/troptions/openclaw/chat/route";
import { POST as postOpenClawTaskCreate } from "@/app/api/troptions/openclaw/task/create/route";
import { POST as postX402Simulate } from "@/app/api/troptions/openclaw/x402/simulate/route";
import { POST as postJefeCommand } from "@/app/api/troptions/jefe/command/route";
import { POST as postJefeXrplCheck } from "@/app/api/troptions/jefe/xrpl-check/route";

const originalEnv = { ...process.env };

describe("OpenClaw and Jefe APIs", () => {
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

  it("openclaw status route is available", async () => {
    const response = await getOpenClawStatus(new Request("http://localhost/api/troptions/openclaw/status", {
      method: "GET",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "viewer",
        "x-troptions-actor-id": "viewer",
      },
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, mode: "simulation" });
  });

  it("openclaw chat requires auth", async () => {
    const response = await postOpenClawChat(new Request("http://localhost/api/troptions/openclaw/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "what is broken?" }),
    }));
    expect(response.status).toBe(401);
  });

  it("openclaw task create requires idempotency", async () => {
    const response = await postOpenClawTaskCreate(new Request("http://localhost/api/troptions/openclaw/task/create", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "content-type": "application/json",
      },
      body: JSON.stringify({ label: "create task" }),
    }));
    expect(response.status).toBe(400);
  });

  it("x402 simulate is dry-run by default", async () => {
    const response = await postX402Simulate(new Request("http://localhost/api/troptions/openclaw/x402/simulate", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "idempotency-key": "oc-x402-1",
        "content-type": "application/json",
      },
      body: JSON.stringify({ amount: "10", currency: "USD", payer: "a", payee: "b" }),
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      mode: "simulation",
      simulation: { intent: { status: "dry-run", simulationOnly: true } },
    });
  });

  it("jefe command requires idempotency and stays simulation mode", async () => {
    const responseNoId = await postJefeCommand(new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "content-type": "application/json",
      },
      body: JSON.stringify({ command: "Check x402 readiness" }),
    }));
    expect(responseNoId.status).toBe(400);

    const response = await postJefeCommand(new Request("http://localhost/api/troptions/jefe/command", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "idempotency-key": "jefe-cmd-1",
        "content-type": "application/json",
      },
      body: JSON.stringify({ command: "Check x402 readiness" }),
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ mode: "simulation", jefeStatus: "online" });
  });

  it("jefe XRPL check reports mainnet disabled", async () => {
    const response = await postJefeXrplCheck(new Request("http://localhost/api/troptions/jefe/xrpl-check", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "x-troptions-actor-role": "super-admin",
        "x-troptions-actor-id": "spec-user",
        "idempotency-key": "jefe-xrpl-1",
        "content-type": "application/json",
      },
      body: JSON.stringify({}),
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      mode: "simulation",
      readiness: { isLiveMainnetExecutionEnabled: false },
    });
  });
});
