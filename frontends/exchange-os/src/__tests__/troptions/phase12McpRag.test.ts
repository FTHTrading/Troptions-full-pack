import {
  MCP_TOOLS,
  BLOCKED_MCP_ACTIONS,
  getAvailableMcpTools,
  getBlockedMcpTools,
  getMcpToolById,
} from "@/content/troptions/mcpToolRegistry";
import { RAG_DOCUMENTS, RAG_CONFIG } from "@/content/troptions/ragConfig";
import {
  CLAWD_CAPABILITIES,
  CLAWD_SYSTEM_PROMPT_CONSTRAINTS,
} from "@/content/troptions/clawdCapabilities";
import {
  X402_CAPABILITIES,
  X402_DISCLAIMER,
  X402_BLOCKED_ACTIONS,
  getReadyCapabilities,
  getGatedCapabilities,
  getX402CapabilityById,
} from "@/content/troptions/x402Registry";
import {
  buildX402ReadinessReport,
  buildX402PaymentIntentDryRun,
} from "@/lib/troptions/x402ReadinessEngine";

describe("Phase 12 — MCP, RAG, Clawd, x402", () => {
  describe("MCP Tool Registry", () => {
    it("has at least 10 tools total", () => {
      expect(MCP_TOOLS.length).toBeGreaterThanOrEqual(10);
    });

    it("getAvailableMcpTools returns only non-blocked tools", () => {
      const available = getAvailableMcpTools();
      available.forEach((t) => {
        expect(t.blocked).toBe(false);
      });
    });

    it("getBlockedMcpTools returns only blocked tools", () => {
      const blocked = getBlockedMcpTools();
      blocked.forEach((t) => {
        expect(t.blocked).toBe(true);
      });
    });

    it("BLOCKED_MCP_ACTIONS includes 'approve'", () => {
      expect(BLOCKED_MCP_ACTIONS).toContain("approve");
    });

    it("BLOCKED_MCP_ACTIONS includes 'settle'", () => {
      expect(BLOCKED_MCP_ACTIONS).toContain("settle");
    });

    it("BLOCKED_MCP_ACTIONS includes 'sign_transaction'", () => {
      expect(BLOCKED_MCP_ACTIONS).toContain("sign_transaction");
    });

    it("getMcpToolById returns tool for valid id", () => {
      const first = MCP_TOOLS[0];
      const result = getMcpToolById(first.id);
      expect(result?.id).toBe(first.id);
    });

    it("getMcpToolById returns undefined for unknown id", () => {
      expect(getMcpToolById("__nonexistent__")).toBeUndefined();
    });
  });

  describe("RAG Config", () => {
    it("RAG_DOCUMENTS has at least 6 documents", () => {
      expect(RAG_DOCUMENTS.length).toBeGreaterThanOrEqual(6);
    });

    it("RAG_CONFIG has embeddingModel defined", () => {
      expect(RAG_CONFIG.embeddingModel).toBeTruthy();
    });

    it("RAG_CONFIG has chunkSize > 0", () => {
      expect(RAG_CONFIG.chunkSize).toBeGreaterThan(0);
    });

    it("each RAG document has id, title, path, type", () => {
      RAG_DOCUMENTS.forEach((doc) => {
        expect(doc.id).toBeTruthy();
        expect(doc.title).toBeTruthy();
        expect(doc.source).toBeTruthy();
        expect(doc.category).toBeTruthy();
      });
    });
  });

  describe("Clawd Capabilities", () => {
    it("has at least 11 capabilities", () => {
      expect(CLAWD_CAPABILITIES.length).toBeGreaterThanOrEqual(11);
    });

    it("has allowed and blocked capabilities", () => {
      const allowed = CLAWD_CAPABILITIES.filter((c) => c.allowed);
      const blocked = CLAWD_CAPABILITIES.filter((c) => !c.allowed);
      expect(allowed.length).toBeGreaterThan(0);
      expect(blocked.length).toBeGreaterThan(0);
    });

    it("CLAWD_SYSTEM_PROMPT_CONSTRAINTS has at least 7 constraints", () => {
      expect(CLAWD_SYSTEM_PROMPT_CONSTRAINTS.length).toBeGreaterThanOrEqual(7);
    });

    it("each capability has id, label, description, blocked", () => {
      CLAWD_CAPABILITIES.forEach((c) => {
        expect(c.id).toBeTruthy();
        expect(c.label).toBeTruthy();
        expect(c.description).toBeTruthy();
        expect(typeof c.allowed).toBe("boolean");
      });
    });
  });

  describe("x402 Registry", () => {
    it("has at least 6 capabilities", () => {
      expect(X402_CAPABILITIES.length).toBeGreaterThanOrEqual(6);
    });

    it("getReadyCapabilities returns only ready caps", () => {
      const ready = getReadyCapabilities();
      ready.forEach((c) => expect(c.status).toBe("ready"));
    });

    it("getGatedCapabilities returns only gated caps", () => {
      const gated = getGatedCapabilities();
      gated.forEach((c) => expect(c.status).toBe("gated"));
    });

    it("X402_BLOCKED_ACTIONS has at least 6 entries", () => {
      expect(X402_BLOCKED_ACTIONS.length).toBeGreaterThanOrEqual(6);
    });

    it("X402_DISCLAIMER is defined", () => {
      expect(typeof X402_DISCLAIMER).toBe("string");
      expect(X402_DISCLAIMER.length).toBeGreaterThan(10);
    });

    it("getX402CapabilityById returns capability for valid id", () => {
      const first = X402_CAPABILITIES[0];
      const result = getX402CapabilityById(first.id);
      expect(result?.id).toBe(first.id);
    });
  });

  describe("x402 Readiness Engine", () => {
    it("buildX402ReadinessReport returns correct shape", () => {
      const report = buildX402ReadinessReport();
      expect(report.overallStatus).toBeTruthy();
      expect(typeof report.readyCount).toBe("number");
      expect(typeof report.gatedCount).toBe("number");
      expect(Array.isArray(report.capabilities)).toBe(true);
      expect(typeof report.disclaimer).toBe("string");
    });

    it("buildX402PaymentIntentDryRun returns status dry-run and simulationOnly true", () => {
      const intent = buildX402PaymentIntentDryRun({
        amount: "100",
        currency: "USD",
        payee: "troptions",
        payer: "client-001",
        idempotencyKey: "idem-12345678",
      });
      expect(intent.status).toBe("dry-run");
      expect(intent.simulationOnly).toBe(true);
      expect(intent.amount).toBe("100");
      expect(intent.currency).toBe("USD");
    });

    it("buildX402PaymentIntentDryRun includes disclaimer", () => {
      const intent = buildX402PaymentIntentDryRun({
        amount: "1",
        currency: "ATP",
        payee: "troptions",
        payer: "client-xyz",
        idempotencyKey: "idem-abcdefgh",
      });
      expect(typeof intent.disclaimer).toBe("string");
      expect(intent.disclaimer.length).toBeGreaterThan(0);
    });
  });
});
