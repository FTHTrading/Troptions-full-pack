import {
  TRADING_SIMULATIONS,
  TRADING_BLOCKED_ACTIONS,
  TRADING_DISCLAIMER,
} from "@/content/troptions/tradingSimulations";
import {
  X402_CAPABILITIES,
  X402_DISCLAIMER,
  X402_BLOCKED_ACTIONS,
  getReadyCapabilities,
  getGatedCapabilities,
} from "@/content/troptions/x402Registry";
import {
  INSTITUTIONAL_DISCLAIMER,
  WHAT_TROPTIONS_IS_NOT,
  WHAT_TROPTIONS_IS,
  TRUST_GATES,
  RELEASE_GATES,
  buildTrustManifest,
  buildDisclaimers,
} from "@/lib/troptions/machineReadableTrust";
import {
  TELECOM_CAPABILITIES,
  TELECOM_DISCLAIMER,
  TELECOM_COMPLIANCE_REQUIREMENTS,
} from "@/content/troptions/telexRegistry";

describe("Phase 12 — Trading, x402, Telecom, Trust", () => {
  describe("Trading Simulations", () => {
    it("has at least 3 simulations", () => {
      expect(TRADING_SIMULATIONS.length).toBeGreaterThanOrEqual(3);
    });

    it("TRADING_BLOCKED_ACTIONS includes 'execute_trade'", () => {
      expect(TRADING_BLOCKED_ACTIONS).toContain("execute_trade");
    });

    it("TRADING_BLOCKED_ACTIONS includes 'sign_xrpl_transaction'", () => {
      expect(TRADING_BLOCKED_ACTIONS).toContain("sign_xrpl_transaction");
    });

    it("TRADING_DISCLAIMER mentions simulation", () => {
      expect(TRADING_DISCLAIMER.toLowerCase()).toContain("simulation");
    });

    it("each simulation has id, name, description, simulationOnly", () => {
      TRADING_SIMULATIONS.forEach((s) => {
        expect(s.id).toBeTruthy();
        expect(s.label).toBeTruthy();
        expect(s.description).toBeTruthy();
        expect(s.simulationOnly).toBe(true);
      });
    });
  });

  describe("x402 Capabilities (split)", () => {
    it("getReadyCapabilities and getGatedCapabilities together cover all caps", () => {
      const ready = getReadyCapabilities();
      const gated = getGatedCapabilities();
      expect(ready.length + gated.length).toBeLessThanOrEqual(X402_CAPABILITIES.length);
    });

    it("X402 capabilities include at least one 'ready' cap", () => {
      expect(getReadyCapabilities().length).toBeGreaterThan(0);
    });

    it("X402 capabilities include at least one 'gated' cap", () => {
      expect(getGatedCapabilities().length).toBeGreaterThan(0);
    });

    it("X402_DISCLAIMER includes institutional gate phrase", () => {
      expect(X402_DISCLAIMER).toContain("provider, legal, compliance");
    });

    it("X402_BLOCKED_ACTIONS has no duplicates", () => {
      const unique = new Set(X402_BLOCKED_ACTIONS);
      expect(unique.size).toBe(X402_BLOCKED_ACTIONS.length);
    });
  });

  describe("Machine-Readable Trust", () => {
    it("WHAT_TROPTIONS_IS_NOT includes 'a bank'", () => {
      const lower = WHAT_TROPTIONS_IS_NOT.map((s) => s.toLowerCase());
      expect(lower.some((s) => s.includes("bank"))).toBe(true);
    });

    it("WHAT_TROPTIONS_IS_NOT includes 'a broker-dealer'", () => {
      const lower = WHAT_TROPTIONS_IS_NOT.map((s) => s.toLowerCase());
      expect(lower.some((s) => s.includes("broker"))).toBe(true);
    });

    it("WHAT_TROPTIONS_IS has at least 3 entries", () => {
      expect(WHAT_TROPTIONS_IS.length).toBeGreaterThanOrEqual(3);
    });

    it("INSTITUTIONAL_DISCLAIMER contains canonical gate phrase", () => {
      expect(INSTITUTIONAL_DISCLAIMER).toContain("provider, legal, compliance");
    });

    it("TRUST_GATES has at least 6 gates", () => {
      expect(TRUST_GATES.length).toBeGreaterThanOrEqual(6);
    });

    it("RELEASE_GATES has at least 10 capabilities", () => {
      expect(RELEASE_GATES.length).toBeGreaterThanOrEqual(10);
    });

    it("buildTrustManifest returns correct shape", () => {
      const manifest = buildTrustManifest();
      expect(Array.isArray(manifest.whatItIs)).toBe(true);
      expect(Array.isArray(manifest.whatItIsNot)).toBe(true);
      expect(Array.isArray(manifest.trustGates)).toBe(true);
      expect(typeof manifest.disclaimer).toBe("string");
    });

    it("buildDisclaimers returns institutionalDisclaimer string", () => {
      const disclaimers = buildDisclaimers();
      expect(Array.isArray(disclaimers)).toBe(true);
      const institutional = disclaimers.find((d) => d.id === "institutional");
      expect(typeof institutional?.text).toBe("string");
      expect((institutional?.text ?? "").length).toBeGreaterThan(10);
    });
  });

  describe("Telecom Registry", () => {
    it("has at least 5 capabilities", () => {
      expect(TELECOM_CAPABILITIES.length).toBeGreaterThanOrEqual(5);
    });

    it("TELECOM_DISCLAIMER mentions TCPA", () => {
      expect(TELECOM_DISCLAIMER.toUpperCase()).toContain("TCPA");
    });

    it("TELECOM_DISCLAIMER includes institutional gate phrase", () => {
      expect(TELECOM_DISCLAIMER).toContain("provider, legal, compliance");
    });

    it("all capabilities have tcpaRequired field", () => {
      TELECOM_CAPABILITIES.forEach((c) => {
        expect(typeof c.tcpaRequired).toBe("boolean");
      });
    });

    it("TELECOM_COMPLIANCE_REQUIREMENTS has at least 5 rules", () => {
      expect(TELECOM_COMPLIANCE_REQUIREMENTS.length).toBeGreaterThanOrEqual(5);
    });

    it("each compliance req has id, label, description, required", () => {
      TELECOM_COMPLIANCE_REQUIREMENTS.forEach((r) => {
        expect(r.id).toBeTruthy();
        expect(r.label).toBeTruthy();
        expect(r.description).toBeTruthy();
        expect(typeof r.required).toBe("boolean");
      });
    });
  });
});
