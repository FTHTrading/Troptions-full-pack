import fs from "node:fs";
import path from "node:path";
import { PUBLIC_BENEFIT_REGISTRY, PUBLIC_BENEFIT_RAIL_STATEMENT } from "@/content/troptions/publicBenefitRegistry";
import { ANTI_ILLICIT_FINANCE_REGISTRY } from "@/content/troptions/antiIllicitFinanceRegistry";
import { IMPACT_FUNDING_REGISTRY } from "@/content/troptions/impactFundingRegistry";

describe("Phase 13 Public Benefit + Anti-Illicit-Finance expansion", () => {
  const requiredRoutes = [
    "src/app/troptions/public-benefit/page.tsx",
    "src/app/troptions/public-benefit/fentanyl-prevention/page.tsx",
    "src/app/troptions/anti-illicit-finance/page.tsx",
    "src/app/portal/troptions/public-benefit/page.tsx",
    "src/app/portal/troptions/anti-illicit-finance/page.tsx",
    "src/app/portal/troptions/impact-reporting/page.tsx",
    "src/app/admin/troptions/public-benefit/page.tsx",
    "src/app/admin/troptions/anti-illicit-finance/page.tsx",
    "src/app/admin/troptions/impact-reporting/page.tsx",
  ];

  const requiredApiRoutes = [
    "src/app/api/troptions/public-benefit/intake/route.ts",
    "src/app/api/troptions/anti-illicit-finance/wallet-risk/simulate/route.ts",
    "src/app/api/troptions/impact/report/simulate/route.ts",
  ];

  it("contains required route files", () => {
    requiredRoutes.forEach((routePath) => {
      expect(fs.existsSync(path.join(process.cwd(), routePath))).toBe(true);
    });
  });

  it("has required public benefit and anti-illicit-finance registries", () => {
    expect(PUBLIC_BENEFIT_REGISTRY.length).toBeGreaterThan(0);
    expect(ANTI_ILLICIT_FINANCE_REGISTRY.length).toBeGreaterThan(0);
    expect(IMPACT_FUNDING_REGISTRY.length).toBeGreaterThan(0);
  });

  it("public benefit statement is prevention-support oriented", () => {
    const statement = PUBLIC_BENEFIT_RAIL_STATEMENT.toLowerCase();
    expect(statement.includes("fentanyl-prevention")).toBe(true);
    expect(statement.includes("transparent")).toBe(true);
    expect(statement.includes("audit")).toBe(true);
  });

  it("fentanyl prevention page explicitly excludes illegal operational content", () => {
    const pagePath = path.join(process.cwd(), "src/app/troptions/public-benefit/fentanyl-prevention/page.tsx");
    const content = fs.readFileSync(pagePath, "utf8").toLowerCase();
    expect(content.includes("does not provide illegal operational content")).toBe(true);
    expect(content.includes("does not provide medical advice")).toBe(true);
  });

  it("public-benefit and anti-illicit API stubs enforce request guardrails", () => {
    requiredApiRoutes.forEach((routePath) => {
      const content = fs.readFileSync(path.join(process.cwd(), routePath), "utf8");
      expect(content.includes("guardControlPlaneRequest")).toBe(true);
      expect(content.includes('requiredAction: "request-approval"')).toBe(true);
      expect(content.includes("saveIdempotentResponse")).toBe(true);
      expect(content.includes("blockedReasons")).toBe(true);
      expect(content.includes("simulationOnly")).toBe(true);
    });
  });

  it("registry and route corpus contains no restricted institutional identity claims", () => {
    const corpus = [
      JSON.stringify(PUBLIC_BENEFIT_REGISTRY),
      JSON.stringify(ANTI_ILLICIT_FINANCE_REGISTRY),
      JSON.stringify(IMPACT_FUNDING_REGISTRY),
      ...requiredRoutes.map((routePath) => fs.readFileSync(path.join(process.cwd(), routePath), "utf8")),
    ]
      .join(" ")
      .toLowerCase();

    ["troptions is a bank", "troptions is a broker-dealer", "troptions is an exchange", "troptions is a custodian"].forEach((phrase) => {
      expect(corpus.includes(phrase)).toBe(false);
    });
  });

  it("corpus contains no guaranteed-outcome language", () => {
    const corpus = [
      JSON.stringify(PUBLIC_BENEFIT_REGISTRY),
      JSON.stringify(ANTI_ILLICIT_FINANCE_REGISTRY),
      JSON.stringify(IMPACT_FUNDING_REGISTRY),
      ...requiredRoutes.map((routePath) => fs.readFileSync(path.join(process.cwd(), routePath), "utf8")),
    ]
      .join(" ")
      .toLowerCase();

    ["guaranteed", "guaranteed return", "guaranteed profit", "risk-free"].forEach((phrase) => {
      expect(corpus.includes(phrase)).toBe(false);
    });
  });
});
