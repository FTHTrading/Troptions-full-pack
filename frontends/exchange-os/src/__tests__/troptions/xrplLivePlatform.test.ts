import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import TroptionsXrplPlatformPage from "@/app/troptions/xrpl-platform/page";
import { XRPL_AMM_POOL_REGISTRY } from "@/content/troptions/xrplAmmPoolRegistry";
import { XRPL_EXTERNAL_LINKS_REGISTRY } from "@/content/troptions/xrplExternalLinksRegistry";
import { XRPL_ORDER_BOOK_REGISTRY } from "@/content/troptions/xrplOrderBookRegistry";
import { getXrplMainnetReadinessGate } from "@/lib/troptions/xrplMainnetReadinessGate";
import { createUnsignedTestnetOffer } from "@/lib/troptions/xrplTestnetExecutionEngine";
import { simulateXrplTrade } from "@/lib/troptions/xrplTradeSimulationEngine";
import { inspectXrplDependencySecurity } from "@/lib/troptions/xrplDependencySecurityGuard";

describe("XRPL live platform", () => {
  it("includes official XRPL links plus Troptions GitHub", () => {
    const labels = XRPL_EXTERNAL_LINKS_REGISTRY.map((item) => item.label);
    expect(labels).toEqual(expect.arrayContaining(["XRPL Docs", "XRPL DEX Docs", "XRPL AMM Docs", "xrpl.js GitHub", "Troptions GitHub"]));
  });

  it("has DEX order books and AMM pools configured", () => {
    expect(XRPL_ORDER_BOOK_REGISTRY.length).toBeGreaterThan(0);
    expect(XRPL_AMM_POOL_REGISTRY.length).toBeGreaterThan(0);
  });

  it("blocks mainnet execution by default", () => {
    const gate = getXrplMainnetReadinessGate();
    expect(gate.allowed).toBe(false);
    expect(gate.isLiveMainnetExecutionEnabled).toBe(false);
  });

  it("returns unsigned testnet payloads only", () => {
    const offer = createUnsignedTestnetOffer({ account: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" });
    expect(offer.mode).toBe("testnet-unsigned-offer");
    expect(offer.txJson.TransactionType).toBe("OfferCreate");
    expect(JSON.stringify(offer.txJson)).not.toMatch(/seed|privateKey|familySeed|mnemonic/i);
  });

  it("simulates quotes without signing or submitting", () => {
    const quote = simulateXrplTrade({ fromAsset: "XRP", toAsset: "TROPTIONS", amount: 1000 });
    expect(quote.auditHint).toContain("No XRPL transaction was signed or submitted");
  });

  it("renders a public safety warning", () => {
    const html = renderToStaticMarkup(TroptionsXrplPlatformPage());
    expect(html).toContain("Mainnet signing is disabled");
  });

  it("homepage contains the XRPL platform CTA", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/troptions/page.tsx"), "utf8");
    expect(source).toContain("/troptions/xrpl-platform");
    expect(source).toContain("XRPL Market Data, AMM, and DEX Readiness");
  });

  it("does not use banned marketing phrases in XRPL docs and homepage source", () => {
    const docsText = fs.readFileSync(path.join(process.cwd(), "docs/xrpl-platform.md"), "utf8");
    const pageText = fs.readFileSync(path.join(process.cwd(), "src/app/troptions/page.tsx"), "utf8");
    const combined = `${docsText}\n${pageText}`.toLowerCase();
    ["guaranteed returns", "risk-free", "instant liquidity", "guaranteed profit", "mainnet trading enabled"].forEach((phrase) => {
      expect(combined).not.toContain(phrase);
    });
  });

  it("does not claim Troptions is a broker-dealer, exchange, bank, or custodian in XRPL docs", () => {
    const docsText = fs.readFileSync(path.join(process.cwd(), "docs/xrpl-platform.md"), "utf8").toLowerCase();
    ["troptions is a broker-dealer", "troptions is an exchange", "troptions is a bank", "troptions is a custodian"].forEach((phrase) => {
      expect(docsText).not.toContain(phrase);
    });
  });

  it("reports dependency security result without a blocked installed xrpl version", () => {
    const findings = inspectXrplDependencySecurity();
    expect(findings[0]?.safe).toBe(true);
  });
});