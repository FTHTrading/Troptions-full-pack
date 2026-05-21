import {
  clearWorkflowRegistry,
  createWorkflowRecord,
  getWorkflowRecord,
  listWorkflowRecords,
  advanceGate,
  listTransactionCategories,
  getTransactionTypeDef,
  type TransactionCategory,
} from "@/lib/troptions/transactionWorkflowEngine";

beforeEach(() => {
  clearWorkflowRegistry();
});

describe("transactionWorkflowEngine", () => {
  describe("listTransactionCategories", () => {
    it("returns all 8 categories", () => {
      const cats = listTransactionCategories();
      expect(cats).toHaveLength(8);
      const ids = cats.map((c) => c.category);
      expect(ids).toContain("rwa_tokenisation");
      expect(ids).toContain("carbon_credit_sale");
      expect(ids).toContain("carbon_credit_retirement");
      expect(ids).toContain("btc_settlement");
      expect(ids).toContain("collateral_pledge");
      expect(ids).toContain("equity_token_issuance");
      expect(ids).toContain("stablecoin_conversion");
      expect(ids).toContain("administrative_payment");
    });

    it("each category has required fields", () => {
      const cats = listTransactionCategories();
      for (const cat of cats) {
        expect(cat.displayName).toBeTruthy();
        expect(cat.disclosureStatement).toBeTruthy();
        expect(Array.isArray(cat.requiredDocuments)).toBe(true);
        expect(Array.isArray(cat.requiredApprovals)).toBe(true);
        expect(Array.isArray(cat.dueDiligenceSteps)).toBe(true);
        expect(cat.requiredDocuments.length).toBeGreaterThan(0);
        expect(cat.requiredApprovals.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getTransactionTypeDef", () => {
    it("returns correct definition for known category", () => {
      const def = getTransactionTypeDef("rwa_tokenisation");
      expect(def).toBeTruthy();
      expect(def.category).toBe("rwa_tokenisation");
      expect(def.handbookId).toBe("rwa-tokenisation-handbook");
    });

    it("returns undefined for unknown category", () => {
      const def = getTransactionTypeDef("nonexistent_category" as TransactionCategory);
      expect(def).toBeUndefined();
    });
  });

  describe("createWorkflowRecord", () => {
    it("creates a record with correct initial state", () => {
      const record = createWorkflowRecord({
        category: "carbon_credit_sale",
        initiatorAddress: "rInitiator123",
      });
      expect(record.transactionId).toBeTruthy();
      expect(record.category).toBe("carbon_credit_sale");
      expect(record.initiatorAddress).toBe("rInitiator123");
      expect(record.status).toBe("diligence_pending");
      expect(record.simulationOnly).toBe(true);
      expect(record.completedGates).toEqual([]);
      expect(record.pendingGates.length).toBeGreaterThan(0);
    });

    it("creates record with optional fields", () => {
      const record = createWorkflowRecord({
        category: "btc_settlement",
        initiatorAddress: "rSender",
        counterpartyAddress: "rReceiver",
        assetReference: "1 BTC",
        amountUsdCents: 9500000,
      });
      expect(record.counterpartyAddress).toBe("rReceiver");
      expect(record.assetReference).toBe("1 BTC");
      expect(record.amountUsdCents).toBe(9500000);
    });

    it("each created record gets a unique transactionId", () => {
      const r1 = createWorkflowRecord({ category: "administrative_payment", initiatorAddress: "rA" });
      const r2 = createWorkflowRecord({ category: "administrative_payment", initiatorAddress: "rB" });
      expect(r1.transactionId).not.toBe(r2.transactionId);
    });

    it("always marks simulationOnly true", () => {
      const cats: TransactionCategory[] = [
        "rwa_tokenisation", "carbon_credit_sale", "btc_settlement", "collateral_pledge",
        "equity_token_issuance", "stablecoin_conversion",
      ];
      for (const cat of cats) {
        const record = createWorkflowRecord({ category: cat, initiatorAddress: "rTest" });
        expect(record.simulationOnly).toBe(true);
      }
    });
  });

  describe("getWorkflowRecord", () => {
    it("retrieves a created record by transactionId", () => {
      const created = createWorkflowRecord({ category: "rwa_tokenisation", initiatorAddress: "rOwner" });
      const fetched = getWorkflowRecord(created.transactionId);
      expect(fetched).toBeDefined();
      expect(fetched!.transactionId).toBe(created.transactionId);
    });

    it("returns undefined for non-existent ID", () => {
      const result = getWorkflowRecord("TXN-NOTEXIST");
      expect(result).toBeUndefined();
    });
  });

  describe("listWorkflowRecords", () => {
    it("lists all records", () => {
      createWorkflowRecord({ category: "rwa_tokenisation", initiatorAddress: "rA" });
      createWorkflowRecord({ category: "carbon_credit_sale", initiatorAddress: "rB" });
      expect(listWorkflowRecords()).toHaveLength(2);
    });

    it("filters by category", () => {
      createWorkflowRecord({ category: "rwa_tokenisation", initiatorAddress: "rA" });
      createWorkflowRecord({ category: "carbon_credit_sale", initiatorAddress: "rB" });
      createWorkflowRecord({ category: "rwa_tokenisation", initiatorAddress: "rC" });
      const rwaOnly = listWorkflowRecords("rwa_tokenisation");
      expect(rwaOnly).toHaveLength(2);
      expect(rwaOnly.every((r) => r.category === "rwa_tokenisation")).toBe(true);
    });

    it("returns empty array when registry is empty", () => {
      expect(listWorkflowRecords()).toHaveLength(0);
    });
  });

  describe("advanceGate", () => {
    it("advances a pending gate to completed", () => {
      const record = createWorkflowRecord({ category: "administrative_payment", initiatorAddress: "rAdmin" });
      const firstGate = record.pendingGates[0];
      const updated = advanceGate(record.transactionId, firstGate, "compliance-officer");
      expect(updated).not.toBeNull();
      expect(updated!.completedGates).toContain(firstGate);
      expect(updated!.pendingGates).not.toContain(firstGate);
    });

    it("returns null for non-existent record", () => {
      const result = advanceGate("TXN-NOTEXIST", "control_hub_approval", "actor");
      expect(result).toBeNull();
    });

    it("records gate actor in audit trail", () => {
      const record = createWorkflowRecord({ category: "administrative_payment", initiatorAddress: "rAdmin" });
      const firstGate = record.pendingGates[0];
      const updated = advanceGate(record.transactionId, firstGate, "kevan-burns");
      expect(updated!.auditTrail.length).toBeGreaterThan(1); // created + advanced
      const gateEntry = updated!.auditTrail.find((e) => e.action === "gate_advanced");
      expect(gateEntry!.actor).toBe("kevan-burns");
    });
  });
});
