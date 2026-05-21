import fs from "node:fs";
import path from "node:path";
import { MULTI_CHAIN_REGISTRY } from "@/content/troptions/multiChainRegistry";
import { STABLECOIN_ISSUER_REGISTRY } from "@/content/troptions/stablecoinIssuerRegistry";
import { EVM_TREX_PERMISSION_GATES } from "@/content/troptions/evmTrexRegistry";
import { RWA_CHAIN_CAPABILITY_REGISTRY } from "@/content/troptions/rwaChainCapabilityRegistry";

describe("Phase 13 Multichain + Stablecoin + RWA expansion", () => {
  const requiredTroptionsRoutes = [
    "src/app/troptions/chains/page.tsx",
    "src/app/troptions/chains/solana/page.tsx",
    "src/app/troptions/chains/tron/page.tsx",
    "src/app/troptions/chains/xrpl/page.tsx",
    "src/app/troptions/chains/evm-trex/page.tsx",
    "src/app/troptions/stablecoins/page.tsx",
    "src/app/troptions/stablecoins/usdc/page.tsx",
    "src/app/troptions/stablecoins/usdt/page.tsx",
    "src/app/troptions/stablecoins/paxos/page.tsx",
    "src/app/troptions/stablecoins/pyusd/page.tsx",
    "src/app/troptions/stablecoins/usdp/page.tsx",
    "src/app/troptions/stablecoins/paxg/page.tsx",
    "src/app/troptions/rwa/multichain/page.tsx",
    "src/app/troptions/rwa/trex/page.tsx",
    "src/app/troptions/chain-risk/page.tsx",
    "src/app/troptions/payment-rails/page.tsx",
  ];

  const requiredPortalRoutes = [
    "src/app/portal/troptions/chains/page.tsx",
    "src/app/portal/troptions/chains/solana/page.tsx",
    "src/app/portal/troptions/chains/tron/page.tsx",
    "src/app/portal/troptions/chains/evm-trex/page.tsx",
    "src/app/portal/troptions/stablecoin-rails/page.tsx",
  ];

  const requiredAdminRoutes = [
    "src/app/admin/troptions/chains/page.tsx",
    "src/app/admin/troptions/chains/solana/page.tsx",
    "src/app/admin/troptions/chains/tron/page.tsx",
    "src/app/admin/troptions/chains/evm-trex/page.tsx",
    "src/app/admin/troptions/stablecoin-issuers/page.tsx",
    "src/app/admin/troptions/paxos-rails/page.tsx",
    "src/app/admin/troptions/chain-risk/page.tsx",
  ];

  const requiredPostApiRoutes = [
    "src/app/api/troptions/solana/payment-intent/simulate/route.ts",
    "src/app/api/troptions/tron/usdt-risk/check/route.ts",
    "src/app/api/troptions/evm-trex/eligibility/simulate/route.ts",
    "src/app/api/troptions/paxos/rail/simulate/route.ts",
    "src/app/api/troptions/public-benefit/intake/route.ts",
    "src/app/api/troptions/anti-illicit-finance/wallet-risk/simulate/route.ts",
    "src/app/api/troptions/impact/report/simulate/route.ts",
  ];

  it("has all required multichain and stablecoin routes", () => {
    [...requiredTroptionsRoutes, ...requiredPortalRoutes, ...requiredAdminRoutes].forEach((routePath) => {
      expect(fs.existsSync(path.join(process.cwd(), routePath))).toBe(true);
    });
  });

  it("registers all required chains", () => {
    const chainIds = MULTI_CHAIN_REGISTRY.map((chain) => chain.chainId);
    expect(chainIds).toEqual(expect.arrayContaining(["solana", "tron", "xrpl", "evm-trex"]));
  });

  it("keeps USDC as default route and USDT as non-default route", () => {
    const usdc = STABLECOIN_ISSUER_REGISTRY.find((item) => item.symbol === "USDC");
    const usdt = STABLECOIN_ISSUER_REGISTRY.find((item) => item.symbol === "USDT");
    expect(usdc?.defaultInstitutionalRoute).toBe(true);
    expect(usdt?.defaultInstitutionalRoute).toBe(false);
  });

  it("includes T-REX permission gates and marks them required", () => {
    expect(EVM_TREX_PERMISSION_GATES.length).toBeGreaterThanOrEqual(8);
    EVM_TREX_PERMISSION_GATES.forEach((gate) => {
      expect(gate.required).toBe(true);
    });
  });

  it("contains monitoring-only TRON mode in RWA capability registry", () => {
    const tronCapability = RWA_CHAIN_CAPABILITY_REGISTRY.find((item) => item.chain === "TRON");
    expect(tronCapability?.mode).toBe("monitoring-only");
  });

  it("requires control-plane guardrails and idempotency in all POST APIs", () => {
    requiredPostApiRoutes.forEach((routePath) => {
      const content = fs.readFileSync(path.join(process.cwd(), routePath), "utf8");
      expect(content.includes("guardControlPlaneRequest")).toBe(true);
      expect(content.includes('requiredAction: "request-approval"')).toBe(true);
      expect(content.includes("requireIdempotency: true")).toBe(true);
      expect(content.includes("saveIdempotentResponse")).toBe(true);
      expect(content.includes("trackControlPlaneEvent")).toBe(true);
      expect(content.includes("simulationOnly")).toBe(true);
      expect(content.includes("blockedReasons")).toBe(true);
    });
  });

  it("does not contain guaranteed outcome language in phase 13 route and registry corpus", () => {
    const corpus = [
      JSON.stringify(MULTI_CHAIN_REGISTRY),
      JSON.stringify(STABLECOIN_ISSUER_REGISTRY),
      JSON.stringify(RWA_CHAIN_CAPABILITY_REGISTRY),
      ...requiredTroptionsRoutes.map((routePath) => fs.readFileSync(path.join(process.cwd(), routePath), "utf8")),
    ]
      .join(" ")
      .toLowerCase();

    ["guaranteed", "guaranteed return", "guaranteed profit", "risk-free"].forEach((phrase) => {
      expect(corpus.includes(phrase)).toBe(false);
    });
  });

  it("does not claim Troptions is a bank, broker-dealer, exchange, or custodian", () => {
    const corpus = [
      JSON.stringify(MULTI_CHAIN_REGISTRY),
      JSON.stringify(STABLECOIN_ISSUER_REGISTRY),
      ...requiredTroptionsRoutes.map((routePath) => fs.readFileSync(path.join(process.cwd(), routePath), "utf8")),
    ]
      .join(" ")
      .toLowerCase();

    ["troptions is a bank", "troptions is a broker-dealer", "troptions is an exchange", "troptions is a custodian"].forEach((phrase) => {
      expect(corpus.includes(phrase)).toBe(false);
    });
  });

  it("keeps phase 13 APIs simulation-only with no live execution language", () => {
    const corpus = requiredPostApiRoutes
      .map((routePath) => fs.readFileSync(path.join(process.cwd(), routePath), "utf8").toLowerCase())
      .join(" ");

    expect(corpus.includes("simulationonly")).toBe(true);
    ["execute live", "production transfer", "live settlement", "sign transaction"].forEach((phrase) => {
      expect(corpus.includes(phrase)).toBe(false);
    });
  });
});
