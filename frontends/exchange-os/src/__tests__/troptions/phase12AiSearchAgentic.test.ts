import { AI_SEARCH_REGISTRY, AI_DISCLAIMER } from "@/content/troptions/aiSearchRegistry";
import { AI_ENTITY_REGISTRY, getEntityById, getEntitiesByType } from "@/content/troptions/aiEntityRegistry";
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES, getNodeById, getConnectedNodes } from "@/content/troptions/aiKnowledgeGraph";
import { AI_CITATION_REGISTRY, getCitationsByCategory, getCitationsByTag } from "@/content/troptions/aiCitationRegistry";
import { AI_TOPIC_CLUSTERS } from "@/content/troptions/aiSearchPrompts";
import { ORG_JSONLD, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/content/troptions/aiSchemaRegistry";

describe("Phase 12 — AI Search & Agentic Layer", () => {
  describe("AI Search Registry", () => {
    it("has at least 8 search entries", () => {
      expect(AI_SEARCH_REGISTRY.length).toBeGreaterThanOrEqual(8);
    });

    it("each entry has required fields", () => {
      AI_SEARCH_REGISTRY.forEach((entry) => {
        expect(entry.id).toBeTruthy();
        expect(entry.title).toBeTruthy();
        expect(entry.description).toBeTruthy();
        expect(entry.status).toMatch(/^(live|simulation|gated|planned)$/);
        expect(Array.isArray(entry.keywords)).toBe(true);
      });
    });

    it("exports AI_DISCLAIMER string", () => {
      expect(typeof AI_DISCLAIMER).toBe("string");
      expect(AI_DISCLAIMER.length).toBeGreaterThan(10);
    });
  });

  describe("AI Entity Registry", () => {
    it("has at least 12 entities", () => {
      expect(AI_ENTITY_REGISTRY.length).toBeGreaterThanOrEqual(12);
    });

    it("getEntityById returns entity for valid id", () => {
      const first = AI_ENTITY_REGISTRY[0];
      const result = getEntityById(first.id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it("getEntityById returns undefined for unknown id", () => {
      expect(getEntityById("__nonexistent__")).toBeUndefined();
    });

    it("getEntitiesByType returns array", () => {
      const result = getEntitiesByType("organization");
      expect(Array.isArray(result)).toBe(true);
    });

    it("each entity has name, type, status, description", () => {
      AI_ENTITY_REGISTRY.forEach((e) => {
        expect(e.name).toBeTruthy();
        expect(e.type).toBeTruthy();
        expect(e.status).toBeTruthy();
        expect(e.description).toBeTruthy();
      });
    });
  });

  describe("Knowledge Graph", () => {
    it("has at least 20 nodes", () => {
      expect(KNOWLEDGE_NODES.length).toBeGreaterThanOrEqual(20);
    });

    it("has edges array", () => {
      expect(Array.isArray(KNOWLEDGE_EDGES)).toBe(true);
    });

    it("getNodeById returns node for valid id", () => {
      const first = KNOWLEDGE_NODES[0];
      const result = getNodeById(first.id);
      expect(result?.id).toBe(first.id);
    });

    it("getConnectedNodes returns array", () => {
      const first = KNOWLEDGE_NODES[0];
      const result = getConnectedNodes(first.id);
      expect(Array.isArray(result)).toBe(true);
    });

    it("each node has id, label, category, description", () => {
      KNOWLEDGE_NODES.forEach((n) => {
        expect(n.id).toBeTruthy();
        expect(n.label).toBeTruthy();
        expect(n.type).toBeTruthy();
        expect(n.description).toBeTruthy();
      });
    });
  });

  describe("AI Citation Registry", () => {
    it("has at least 14 citations", () => {
      expect(AI_CITATION_REGISTRY.length).toBeGreaterThanOrEqual(14);
    });

    it("getCitationsByCategory returns array", () => {
      const result = getCitationsByCategory("compliance");
      expect(Array.isArray(result)).toBe(true);
    });

    it("getCitationsByTag returns array", () => {
      const result = getCitationsByTag("rwa");
      expect(Array.isArray(result)).toBe(true);
    });

    it("each citation has id, title, source, category", () => {
      AI_CITATION_REGISTRY.forEach((c) => {
        expect(c.id).toBeTruthy();
        expect(c.title).toBeTruthy();
        expect(c.url).toBeTruthy();
        expect(c.category).toBeTruthy();
      });
    });
  });

  describe("AI Topic Clusters", () => {
    it("has at least 6 topic clusters", () => {
      expect(AI_TOPIC_CLUSTERS.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe("AI Schema Registry", () => {
    it("ORG_JSONLD has @type Organization", () => {
      expect(ORG_JSONLD["@type"]).toBe("Organization");
    });

    it("buildFaqJsonLd returns valid FAQ JSON-LD", () => {
      const result = buildFaqJsonLd();
      expect(result["@type"]).toBe("FAQPage");
      expect(Array.isArray(result.mainEntity)).toBe(true);
    });

    it("buildBreadcrumbJsonLd returns BreadcrumbList", () => {
      const result = buildBreadcrumbJsonLd([{ name: "Home", url: "https://troptions.com" }]);
      expect(result["@type"]).toBe("BreadcrumbList");
    });
  });
});
