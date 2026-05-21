import fs from "node:fs";
import path from "node:path";
import { canEnableAlgorithmicTrading } from "@/lib/troptions/algorithmicTradingEngine";
import { canInitiateLiveBankingTransfer } from "@/lib/troptions/bankingRailEngine";
import { evaluateBrokerDealerCoordination } from "@/lib/troptions/brokerDealerEngine";
import { simulateConversionRoute } from "@/lib/troptions/conversionEngine";
import { POF_REGISTRY } from "@/content/troptions/pofRegistry";
import { canApprovePof } from "@/lib/troptions/pofEngine";
import { RWA_OPERATIONS_REGISTRY } from "@/content/troptions/rwaOperationsRegistry";
import { canMarkRwaIssuanceReady } from "@/lib/troptions/rwaOperationsEngine";
import { SBLC_REGISTRY } from "@/content/troptions/sblcRegistry";
import { canVerifySblc } from "@/lib/troptions/sblcEngine";
import { simulateSettlement } from "@/lib/troptions/settlementOpsEngine";
import { STABLECOIN_RAIL_REGISTRY } from "@/content/troptions/stablecoinRailRegistry";
import { canLaunchPublicStableUnit } from "@/lib/troptions/stablecoinRailEngine";
import { canSignXrplTransaction } from "@/lib/troptions/xrplLedgerEngine";

describe("Phase 11 portal safety gates", () => {
  it("client portal routes render via file presence", () => {
    const requiredClientRoutes = [
      "src/app/portal/troptions/page.tsx",
      "src/app/portal/troptions/dashboard/page.tsx",
      "src/app/portal/troptions/onboarding/page.tsx",
      "src/app/portal/troptions/profile/page.tsx",
      "src/app/portal/troptions/entities/page.tsx",
      "src/app/portal/troptions/kyc/page.tsx",
      "src/app/portal/troptions/kyb/page.tsx",
      "src/app/portal/troptions/documents/page.tsx",
      "src/app/portal/troptions/proof-of-funds/page.tsx",
      "src/app/portal/troptions/sblc/page.tsx",
      "src/app/portal/troptions/rwa/page.tsx",
      "src/app/portal/troptions/assets/page.tsx",
      "src/app/portal/troptions/vaults/page.tsx",
      "src/app/portal/troptions/custody/page.tsx",
      "src/app/portal/troptions/banking/page.tsx",
      "src/app/portal/troptions/stablecoins/page.tsx",
      "src/app/portal/troptions/xrpl/page.tsx",
      "src/app/portal/troptions/xrpl/accounts/page.tsx",
      "src/app/portal/troptions/xrpl/trustlines/page.tsx",
      "src/app/portal/troptions/xrpl/amm/page.tsx",
      "src/app/portal/troptions/xrpl/dex/page.tsx",
      "src/app/portal/troptions/xrpl/conversions/page.tsx",
      "src/app/portal/troptions/exchange-routing/page.tsx",
      "src/app/portal/troptions/trading/page.tsx",
      "src/app/portal/troptions/trading/algorithmic/page.tsx",
      "src/app/portal/troptions/trading/simulation/page.tsx",
      "src/app/portal/troptions/settlement/page.tsx",
      "src/app/portal/troptions/reports/page.tsx",
      "src/app/portal/troptions/support/page.tsx",
    ];

    for (const file of requiredClientRoutes) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }
  });

  it("no live trading enabled by default", () => {
    const result = canEnableAlgorithmicTrading({
      legalApproved: false,
      complianceApproved: false,
      riskApproved: false,
      custodyApproved: false,
      venueApproved: false,
      boardApproved: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.simulationOnly).toBe(true);
  });

  it("no live banking transfer enabled by default", () => {
    const result = canInitiateLiveBankingTransfer();
    expect(result.allowed).toBe(false);
  });

  it("no XRPL signing enabled by default", () => {
    const result = canSignXrplTransaction();
    expect(result.allowed).toBe(false);
  });

  it("no broker-dealer claim without licensed provider gate", () => {
    const result = evaluateBrokerDealerCoordination("BD-002");
    expect(result.allowed).toBe(false);
  });

  it("SBLC cannot be verified without bank confirmation", () => {
    const result = canVerifySblc(SBLC_REGISTRY[0]);
    expect(result.allowed).toBe(false);
    expect(result.blockedReasons.join(" ").toLowerCase()).toContain("bank confirmation");
  });

  it("POF cannot be approved without evidence verification", () => {
    const result = canApprovePof(POF_REGISTRY[0]);
    expect(result.allowed).toBe(false);
  });

  it("RWA cannot be issuance-ready without legal/custody/proof approval", () => {
    const result = canMarkRwaIssuanceReady(RWA_OPERATIONS_REGISTRY[0]);
    expect(result.allowed).toBe(false);
  });

  it("stablecoin public unit cannot launch without licensing approval", () => {
    const route = STABLECOIN_RAIL_REGISTRY.find((item) => item.asset === "troptions-accounting-unit");
    expect(route).toBeDefined();
    const result = canLaunchPublicStableUnit(route!);
    expect(result.allowed).toBe(false);
  });

  it("XRPL conversion quote is simulation-only", () => {
    const quote = simulateConversionRoute("USD.rIssuer", "USDC", 1000);
    expect(quote.simulationOnly).toBe(true);
  });

  it("algorithmic trading requires all approvals", () => {
    const result = canEnableAlgorithmicTrading({
      legalApproved: true,
      complianceApproved: true,
      riskApproved: false,
      custodyApproved: true,
      venueApproved: true,
      boardApproved: true,
    });
    expect(result.allowed).toBe(false);
  });

  it("settlement simulation requires counterparty verification", () => {
    const result = simulateSettlement("SETTLE-001");
    expect(result.allowed).toBe(false);
    expect(result.blockedReasons.join(" ").toLowerCase()).toContain("counterparty");
  });

  it("banned phrases do not appear in Phase 11 portal/admin source", () => {
    const banned = [
      "guaranteed returns",
      "risk-free",
      "instant liquidity",
      "fully compliant everywhere",
      "bank replacement",
      "exchange replacement",
    ];

    const roots = [
      path.join(process.cwd(), "src", "app", "portal", "troptions"),
      path.join(process.cwd(), "src", "components", "client-portal"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "client-portal"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "pof"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "sblc"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "rwa"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "banking"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "stablecoins"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "xrpl"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "conversions"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "exchange-routes"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "trading", "simulate"),
      path.join(process.cwd(), "src", "app", "api", "troptions", "settlement", "simulate"),
    ];

    const files: string[] = [];
    const collect = (target: string) => {
      const stat = fs.statSync(target);
      if (stat.isFile()) {
        files.push(target);
        return;
      }

      for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
        const child = path.join(target, entry.name);
        if (entry.isDirectory()) {
          collect(child);
        } else if (entry.isFile() && (child.endsWith(".ts") || child.endsWith(".tsx") || child.endsWith(".css"))) {
          files.push(child);
        }
      }
    };

    for (const root of roots) {
      if (fs.existsSync(root)) {
        collect(root);
      }
    }

    const corpus = files.map((file) => fs.readFileSync(file, "utf8").toLowerCase()).join("\n");
    for (const phrase of banned) {
      expect(corpus).not.toContain(phrase);
    }
  });
});
