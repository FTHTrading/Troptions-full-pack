import { renderToStaticMarkup } from "react-dom/server";
import { JEFE_COMMAND_REGISTRY } from "@/content/troptions/jefeCommandRegistry";
import { JEFE_BLOCKED_ACTIONS } from "@/content/troptions/jefePolicyRegistry";
import JefePage from "@/app/admin/troptions/openclaw/jefe/page";
import JefeCommandsPage from "@/app/admin/troptions/openclaw/jefe/commands/page";
import JefeTasksPage from "@/app/admin/troptions/openclaw/jefe/tasks/page";
import JefeRoutingPage from "@/app/admin/troptions/openclaw/jefe/routing/page";
import JefePoliciesPage from "@/app/admin/troptions/openclaw/jefe/policies/page";

describe("Jefe dashboard routes and commands", () => {
  it("includes required quick commands", () => {
    const prompts = JEFE_COMMAND_REGISTRY.map((c) => c.prompt);
    expect(prompts).toEqual([
      "What needs fixing next?",
      "Check x402 readiness",
      "Check XRPL readiness",
      "Check wallet system",
      "Summarize open blockers",
      "Draft next implementation plan",
      "Run safe site audit",
      "Prepare board package",
    ]);
  });

  it("contains simulation safety blocked actions", () => {
    expect(JEFE_BLOCKED_ACTIONS).toContain("approve");
    expect(JEFE_BLOCKED_ACTIONS).toContain("sign-transaction");
    expect(JEFE_BLOCKED_ACTIONS).toContain("trade");
    expect(JEFE_BLOCKED_ACTIONS).toContain("settle");
    expect(JEFE_BLOCKED_ACTIONS).toContain("send-funds");
    expect(JEFE_BLOCKED_ACTIONS).toContain("enable-live-x402");
    expect(JEFE_BLOCKED_ACTIONS).toContain("enable-live-xrpl-mainnet");
    expect(JEFE_BLOCKED_ACTIONS).toContain("expose-secrets");
  });

  it("exports all required Jefe route pages", () => {
    expect(typeof JefePage).toBe("function");
    expect(typeof JefeCommandsPage).toBe("function");
    expect(typeof JefeTasksPage).toBe("function");
    expect(typeof JefeRoutingPage).toBe("function");
    expect(typeof JefePoliciesPage).toBe("function");
  });

  it("renders without local Windows path leakage", () => {
    const html = renderToStaticMarkup(JefePage());
    expect(html).not.toMatch(/[A-Z]:\\/);
    expect(html).not.toMatch(/\\Users\\/i);
    expect(html).not.toMatch(/onedrive/i);
  });

  it("renders without token or secret leakage", () => {
    const html = renderToStaticMarkup(JefeCommandsPage());
    expect(html).not.toMatch(/token/i);
    expect(html).not.toMatch(/secret/i);
    expect(html).not.toMatch(/api[_-]?key/i);
    expect(html).not.toMatch(/TROPTIONS_/i);
  });
});
