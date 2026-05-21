import {
  clearKycRegistry,
  createKycRecord,
  submitDocument,
  recordOracleAttestation,
  isKycCleared,
  generateKycSummary,
  getKycRecord,
  findKycByAddress,
  listKycRecords,
  KYC_ONBOARDING_DISCLOSURE,
} from "@/lib/troptions/kycOnboardingEngine";

beforeEach(() => {
  clearKycRegistry();
});

describe("kycOnboardingEngine", () => {
  describe("KYC_ONBOARDING_DISCLOSURE", () => {
    it("is defined and references simulation", () => {
      expect(KYC_ONBOARDING_DISCLOSURE).toBeTruthy();
      expect(KYC_ONBOARDING_DISCLOSURE.toLowerCase()).toContain("simulation");
    });
  });

  describe("createKycRecord", () => {
    it("creates a record with basic fields", () => {
      const record = createKycRecord({
        subjectAddress: "rTest000ABC",
        entityType: "individual",
      });
      expect(record.kycId).toBeTruthy();
      expect(record.subjectAddress).toBe("rTest000ABC");
      expect(record.entityType).toBe("individual");
      expect(record.kycTier).toBe("unknown");
      expect(record.simulationOnly).toBe(true);
    });

    it("creates a record for entity type", () => {
      const record = createKycRecord({ subjectAddress: "rEntity001", entityType: "entity" });
      expect(record.entityType).toBe("entity");
    });

    it("assigns unique IDs", () => {
      const r1 = createKycRecord({ subjectAddress: "rA", entityType: "individual" });
      const r2 = createKycRecord({ subjectAddress: "rB", entityType: "individual" });
      expect(r1.kycId).not.toBe(r2.kycId);
    });
  });

  describe("submitDocument", () => {
    it("stores hash of document content, not raw content", () => {
      const record = createKycRecord({ subjectAddress: "rDocTest", entityType: "individual" });
      const rawContent = "John Doe Passport Number 12345";
      const result = submitDocument({
        kycId: record.kycId,
        documentType: "government_id",
        documentName: "passport_test.pdf",
        documentContent: rawContent,
      });

      expect(result.success).toBe(true);
      expect(result.sha256Hash).toBeTruthy();
      // Hash is 64-char hex (SHA-256)
      expect(result.sha256Hash).toHaveLength(64);
      // Raw content must NOT be stored
      expect(JSON.stringify(result)).not.toContain(rawContent);
    });

    it("returns failure for non-existent KYC ID", () => {
      const result = submitDocument({
        kycId: "KYC-NOTEXIST",
        documentType: "government_id",
        documentName: "test.pdf",
        documentContent: "content",
      });
      expect(result.success).toBe(false);
    });

    it("same content produces same hash (deterministic SHA-256)", () => {
      const record = createKycRecord({ subjectAddress: "rHashTest", entityType: "individual" });
      const content = "deterministic content for hashing";
      const r1 = submitDocument({ kycId: record.kycId, documentType: "government_id", documentName: "doc1.pdf", documentContent: content });
      const r2 = submitDocument({ kycId: record.kycId, documentType: "proof_of_address", documentName: "doc2.pdf", documentContent: content });
      expect(r1.sha256Hash).toBe(r2.sha256Hash);
    });

    it("different content produces different hashes", () => {
      const record = createKycRecord({ subjectAddress: "rHashTest2", entityType: "individual" });
      const r1 = submitDocument({ kycId: record.kycId, documentType: "government_id", documentName: "doc1.pdf", documentContent: "content A" });
      const r2 = submitDocument({ kycId: record.kycId, documentType: "government_id", documentName: "doc2.pdf", documentContent: "content B" });
      expect(r1.sha256Hash).not.toBe(r2.sha256Hash);
    });

    it("submission advances KYC status to documents_submitted", () => {
      const record = createKycRecord({ subjectAddress: "rStatusTest", entityType: "individual" });
      expect(record.status).toBe("not_started");
      submitDocument({ kycId: record.kycId, documentType: "government_id", documentName: "passport.pdf", documentContent: "abc" });
      const updated = getKycRecord(record.kycId);
      expect(updated!.status).toBe("documents_submitted");
    });
  });

  describe("recordOracleAttestation", () => {
    it("records attestation and advances tier", () => {
      const record = createKycRecord({ subjectAddress: "rOracle", entityType: "individual" });
      const updated = recordOracleAttestation({
        kycId: record.kycId,
        providerName: "compliance-oracle-v1",
        attestedKycTier: "basic",
        actor: "oracle-system",
      });
      expect(updated).not.toBeNull();
      expect(updated!.kycId).toBe(record.kycId);
      expect(updated!.kycTier).toBe("basic");
      expect(updated!.status).toBe("oracle_attested");
    });

    it("returns null for non-existent KYC ID", () => {
      const result = recordOracleAttestation({
        kycId: "KYC-NOTEXIST",
        providerName: "test",
        attestedKycTier: "basic",
        actor: "system",
      });
      expect(result).toBeNull();
    });

    it("sets onchain flag for basic/enhanced/institutional tiers", () => {
      const record = createKycRecord({ subjectAddress: "rFlagTest", entityType: "individual" });
      const updated = recordOracleAttestation({
        kycId: record.kycId,
        providerName: "test-oracle",
        attestedKycTier: "enhanced",
        actor: "system",
      });
      expect(updated!.oracleAttestation!.onchainFlagSet).toBe(true);
    });
  });

  describe("isKycCleared", () => {
    it("returns false for unregistered address", () => {
      expect(isKycCleared("rUnknown000")).toBe(false);
    });

    it("returns false for address with no attestation (unknown tier)", () => {
      createKycRecord({ subjectAddress: "rNotAttested", entityType: "individual" });
      expect(isKycCleared("rNotAttested")).toBe(false);
    });

    it("returns true after oracle attestation with clear sanctions", () => {
      const record = createKycRecord({ subjectAddress: "rCleared", entityType: "individual" });
      recordOracleAttestation({
        kycId: record.kycId,
        providerName: "oracle-v1",
        attestedKycTier: "basic",
        actor: "system",
      });
      // Directly set sanctionsStatus to "clear" via the returned record (engine exposes mutable object)
      const rec = findKycByAddress("rCleared");
      rec!.sanctionsStatus = "clear";
      expect(isKycCleared("rCleared")).toBe(true);
    });
  });

  describe("findKycByAddress", () => {
    it("finds existing KYC record by address", () => {
      createKycRecord({ subjectAddress: "rFindMe", entityType: "individual" });
      const found = findKycByAddress("rFindMe");
      expect(found).toBeDefined();
      expect(found!.subjectAddress).toBe("rFindMe");
    });

    it("returns undefined for unknown address", () => {
      expect(findKycByAddress("rNobody")).toBeUndefined();
    });
  });

  describe("getKycRecord and listKycRecords", () => {
    it("retrieves record by ID", () => {
      const created = createKycRecord({ subjectAddress: "rGetById", entityType: "entity" });
      const fetched = getKycRecord(created.kycId);
      expect(fetched!.kycId).toBe(created.kycId);
    });

    it("lists all KYC records", () => {
      createKycRecord({ subjectAddress: "rA", entityType: "individual" });
      createKycRecord({ subjectAddress: "rB", entityType: "individual" });
      expect(listKycRecords()).toHaveLength(2);
    });
  });

  describe("generateKycSummary", () => {
    it("generates summary with simulationOnly flag", () => {
      const record = createKycRecord({ subjectAddress: "rSummary", entityType: "individual" });
      const summary = generateKycSummary(record.kycId);
      expect(summary).not.toBeNull();
      expect(summary!.simulationOnly).toBe(true);
      expect(summary!.kycId).toBe(record.kycId);
    });

    it("returns null for non-existent KYC ID", () => {
      expect(generateKycSummary("nonexistent")).toBeNull();
    });
  });
});
