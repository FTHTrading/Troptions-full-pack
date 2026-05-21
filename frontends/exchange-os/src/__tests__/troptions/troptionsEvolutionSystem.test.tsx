import fs from "node:fs";
import path from "node:path";
import { LEGACY_SOURCE_REGISTRY } from "@/content/troptions/legacySourceRegistry";
import { LEGACY_CLAIM_REGISTRY } from "@/content/troptions/legacyClaimRegistry";
import { TROPTIONS_THEN_NOW_REGISTRY } from "@/content/troptions/troptionsThenNowRegistry";
import { LEGACY_FUTURE_CTA_LINKS } from "@/components/troptions-evolution/InstitutionalFuturePanel";

describe("Troptions Legacy to Institutional Future System", () => {
  it("legacy source registry exists", () => {
    expect(LEGACY_SOURCE_REGISTRY.length).toBeGreaterThan(0);
  });

  it("then/now registry exists", () => {
    expect(TROPTIONS_THEN_NOW_REGISTRY.length).toBeGreaterThan(0);
  });

  it("every source has verification status", () => {
    LEGACY_SOURCE_REGISTRY.forEach((source) => {
      expect(source.verificationStatus).toBeTruthy();
    });
  });

  it("every legacy claim has approved rewrite or blocked status", () => {
    LEGACY_CLAIM_REGISTRY.forEach((claim) => {
      const hasRewrite = claim.approvedRewrite.trim().length > 0;
      expect(hasRewrite || claim.status === "blocked").toBe(true);
    });
  });

  it("source map route exists", () => {
    const routePath = path.join(process.cwd(), "src", "app", "troptions", "diligence", "source-map", "page.tsx");
    expect(fs.existsSync(routePath)).toBe(true);
  });

  it("then-now route exists", () => {
    const routePath = path.join(process.cwd(), "src", "app", "troptions", "then-now", "page.tsx");
    expect(fs.existsSync(routePath)).toBe(true);
  });

  it("capabilities-expanded route exists", () => {
    const routePath = path.join(process.cwd(), "src", "app", "troptions", "capabilities-expanded", "page.tsx");
    expect(fs.existsSync(routePath)).toBe(true);
  });

  it("has no unsupported guaranteed language", () => {
    const corpus = LEGACY_CLAIM_REGISTRY.map((claim) => `${claim.originalClaim} ${claim.approvedRewrite}`).join(" ").toLowerCase();
    const blockedPhrases = ["guaranteed profit", "guaranteed return", "guaranteed roi"];
    blockedPhrases.forEach((phrase) => {
      expect(corpus.includes(phrase)).toBe(false);
    });
  });

  it("no merchant count appears without verification status", () => {
    const merchantClaims = LEGACY_CLAIM_REGISTRY.filter((claim) => claim.category === "merchant acceptance");
    expect(merchantClaims.length).toBeGreaterThan(0);
    merchantClaims.forEach((claim) => {
      const includesCountPattern = /\d/.test(claim.originalClaim);
      if (includesCountPattern) {
        expect(claim.verificationStatus).not.toBe("");
      }
    });
  });

  it("asset-backed, stable, or humanitarian claim categories include risk note", () => {
    const sensitiveCategories = new Set(["humanitarian impact", "gold / commodity backing", "Troptions Gold"]);
    LEGACY_CLAIM_REGISTRY.filter((claim) => sensitiveCategories.has(claim.category)).forEach((claim) => {
      expect(claim.riskNote.trim().length).toBeGreaterThan(0);
    });
  });

  it("no claim says Troptions is a bank, broker-dealer, exchange, or custodian", () => {
    const corpus = LEGACY_CLAIM_REGISTRY.map((claim) => `${claim.originalClaim} ${claim.approvedRewrite}`).join(" ").toLowerCase();
    expect(corpus.includes("troptions is a bank")).toBe(false);
    expect(corpus.includes("troptions is a broker-dealer")).toBe(false);
    expect(corpus.includes("troptions is an exchange")).toBe(false);
    expect(corpus.includes("troptions is a custodian")).toBe(false);
  });

  it("all CTA hrefs are internal site routes", () => {
    LEGACY_FUTURE_CTA_LINKS.forEach((link) => {
      expect(link.href.startsWith("/")).toBe(true);
      expect(link.href.startsWith("http")).toBe(false);
    });
  });

  it("source map does not expose secrets or local paths", () => {
    LEGACY_SOURCE_REGISTRY.forEach((source) => {
      const url = source.url.toLowerCase();
      expect(url.includes("c:\\")).toBe(false);
      expect(url.includes("/users/")).toBe(false);
      expect(url.includes("localhost")).toBe(false);
      expect(url.includes("api_key")).toBe(false);
      expect(url.includes("password")).toBe(false);
    });
  });
});
