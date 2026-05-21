import {
  clearEscrowRegistry,
  createEscrowRecord,
  satisfyCondition,
  recordDeposit,
  getEscrowRecord,
  listEscrowRecords,
  generateEscrowSummary,
  ESCROW_DISCLOSURE,
} from "@/lib/troptions/escrowStateEngine";

beforeEach(() => {
  clearEscrowRegistry();
});

describe("escrowStateEngine", () => {
  describe("ESCROW_DISCLOSURE", () => {
    it("is defined and references simulation", () => {
      expect(ESCROW_DISCLOSURE).toBeTruthy();
      expect(ESCROW_DISCLOSURE.toLowerCase()).toContain("simulation");
    });
  });

  describe("createEscrowRecord", () => {
    it("creates a record with created status and simulationOnly true", () => {
      const record = createEscrowRecord({
        buyerAddress: "rBuyer",
        sellerAddress: "rSeller",
        assetToken: { type: "rwa_token", symbol: "GEM-001", amount: "1" },
        paymentToken: { type: "xrpl_iou", symbol: "TROPTIONS", amount: "250000" },
        conditionSet: "rwa",
      });
      expect(record.escrowId).toBeTruthy();
      expect(record.status).toBe("created");
      expect(record.simulationOnly).toBe(true);
      expect(record.buyerAddress).toBe("rBuyer");
      expect(record.sellerAddress).toBe("rSeller");
    });

    it("initialises standard conditions for rwa type", () => {
      const record = createEscrowRecord({
        buyerAddress: "rA", sellerAddress: "rB",
        assetToken: { type: "rwa_token", symbol: "ASSET-001", amount: "1" },
        paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "100000" },
        conditionSet: "rwa",
      });
      expect(record.pendingConditions.length).toBeGreaterThan(0);
      expect(record.completedConditions).toHaveLength(0);
    });

    it("initialises standard conditions for carbon type", () => {
      const record = createEscrowRecord({
        buyerAddress: "rC", sellerAddress: "rD",
        assetToken: { type: "carbon_credit", symbol: "VCU", amount: "1000" },
        paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "15000" },
        conditionSet: "carbon",
      });
      expect(record.pendingConditions.length).toBeGreaterThan(0);
      expect(record.pendingConditions).toContain("buyer_deposit_received");
    });

    it("initialises standard conditions for btc type", () => {
      const record = createEscrowRecord({
        buyerAddress: "rE", sellerAddress: "rF",
        assetToken: { type: "btc_external", symbol: "BTC", amount: "0.5" },
        paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "47500" },
        conditionSet: "btc",
      });
      expect(record.pendingConditions.length).toBeGreaterThan(0);
    });

    it("assigns unique escrow IDs", () => {
      const r1 = createEscrowRecord({ buyerAddress: "rA", sellerAddress: "rB", assetToken: { type: "rwa_token", symbol: "A", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "100" }, conditionSet: "simple" });
      const r2 = createEscrowRecord({ buyerAddress: "rC", sellerAddress: "rD", assetToken: { type: "rwa_token", symbol: "B", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "200" }, conditionSet: "simple" });
      expect(r1.escrowId).not.toBe(r2.escrowId);
    });

    it("stores transactionId when provided", () => {
      const record = createEscrowRecord({ buyerAddress: "rA", sellerAddress: "rB", assetToken: { type: "rwa_token", symbol: "X", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "500" }, conditionSet: "simple", transactionId: "TXN-12345" });
      expect(record.transactionId).toBe("TXN-12345");
    });
  });

  describe("satisfyCondition", () => {
    it("marks a condition as completed", () => {
      const record = createEscrowRecord({ buyerAddress: "rBuyer", sellerAddress: "rSeller", assetToken: { type: "rwa_token", symbol: "GEM", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "100000" }, conditionSet: "simple" });
      const firstCondition = record.pendingConditions[0];
      const updated = satisfyCondition(record.escrowId, firstCondition, "compliance-officer");
      expect(updated).not.toBeNull();
      expect(updated!.completedConditions).toContain(firstCondition);
      expect(updated!.pendingConditions).not.toContain(firstCondition);
    });

    it("returns null for non-existent escrow ID", () => {
      const result = satisfyCondition("ESC-NOTEXIST", "buyer_kyc_cleared", "actor");
      expect(result).toBeNull();
    });

    it("status advances when deposit condition is met", () => {
      const record = createEscrowRecord({ buyerAddress: "rBuyer", sellerAddress: "rSeller", assetToken: { type: "rwa_token", symbol: "GEM", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "100000" }, conditionSet: "simple" });
      const updated = satisfyCondition(record.escrowId, "buyer_deposit_received", "system");
      expect(updated).not.toBeNull();
      expect(updated!.status).not.toBe("created");
    });
  });

  describe("recordDeposit", () => {
    it("records a buyer deposit and returns updated record", () => {
      const record = createEscrowRecord({ buyerAddress: "rBuyer", sellerAddress: "rSeller", assetToken: { type: "carbon_credit", symbol: "VCU", amount: "1000" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "30000" }, conditionSet: "carbon" });
      const updated = recordDeposit({ escrowId: record.escrowId, party: "buyer", assetType: "xrpl_iou", assetSymbol: "USD", amount: "30000", actor: "rBuyer" });
      expect(updated).not.toBeNull();
      expect(updated!.deposits.length).toBeGreaterThan(0);
      expect(updated!.deposits[0].party).toBe("buyer");
      expect(updated!.deposits[0].amount).toBe("30000");
    });

    it("returns null for non-existent escrow ID", () => {
      const result = recordDeposit({ escrowId: "ESC-NOTEXIST", party: "buyer", assetType: "xrpl_iou", assetSymbol: "USD", amount: "1000", actor: "rBuyer" });
      expect(result).toBeNull();
    });

    it("buyer deposit auto-satisfies buyer_deposit_received condition", () => {
      const record = createEscrowRecord({ buyerAddress: "rBuyer", sellerAddress: "rSeller", assetToken: { type: "btc_external", symbol: "BTC", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "95000" }, conditionSet: "btc" });
      expect(record.pendingConditions).toContain("buyer_deposit_received");
      const updated = recordDeposit({ escrowId: record.escrowId, party: "buyer", assetType: "xrpl_iou", assetSymbol: "USD", amount: "95000", actor: "rBuyer" });
      expect(updated!.completedConditions).toContain("buyer_deposit_received");
      expect(updated!.pendingConditions).not.toContain("buyer_deposit_received");
    });
  });

  describe("getEscrowRecord and listEscrowRecords", () => {
    it("retrieves a created record by escrowId", () => {
      const created = createEscrowRecord({ buyerAddress: "rA", sellerAddress: "rB", assetToken: { type: "rwa_token", symbol: "X", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "500" }, conditionSet: "simple" });
      const fetched = getEscrowRecord(created.escrowId);
      expect(fetched).toBeDefined();
      expect(fetched!.escrowId).toBe(created.escrowId);
    });

    it("returns undefined for non-existent escrow ID", () => {
      expect(getEscrowRecord("ESC-UNKNOWN")).toBeUndefined();
    });

    it("lists all escrow records", () => {
      createEscrowRecord({ buyerAddress: "rA", sellerAddress: "rB", assetToken: { type: "rwa_token", symbol: "A1", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "1000" }, conditionSet: "simple" });
      createEscrowRecord({ buyerAddress: "rC", sellerAddress: "rD", assetToken: { type: "carbon_credit", symbol: "VCU", amount: "500" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "2000" }, conditionSet: "carbon" });
      expect(listEscrowRecords()).toHaveLength(2);
    });

    it("filters by transactionId", () => {
      createEscrowRecord({ buyerAddress: "rA", sellerAddress: "rB", assetToken: { type: "rwa_token", symbol: "A1", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "1000" }, conditionSet: "simple", transactionId: "TXN-ABC" });
      createEscrowRecord({ buyerAddress: "rC", sellerAddress: "rD", assetToken: { type: "carbon_credit", symbol: "VCU", amount: "500" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "2000" }, conditionSet: "carbon", transactionId: "TXN-DEF" });
      createEscrowRecord({ buyerAddress: "rE", sellerAddress: "rF", assetToken: { type: "rwa_token", symbol: "A3", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "3000" }, conditionSet: "simple", transactionId: "TXN-ABC" });
      const abcOnly = listEscrowRecords("TXN-ABC");
      expect(abcOnly).toHaveLength(2);
    });
  });

  describe("generateEscrowSummary", () => {
    it("generates summary with simulationOnly flag", () => {
      const record = createEscrowRecord({ buyerAddress: "rA", sellerAddress: "rB", assetToken: { type: "rwa_token", symbol: "X", amount: "1" }, paymentToken: { type: "xrpl_iou", symbol: "USD", amount: "5000" }, conditionSet: "rwa" });
      const summary = generateEscrowSummary(record.escrowId);
      expect(summary).not.toBeNull();
      expect(summary!.simulationOnly).toBe(true);
      expect(summary!.escrowId).toBe(record.escrowId);
      expect(summary!.pendingConditions.length).toBeGreaterThan(0);
    });

    it("returns null for non-existent escrow ID", () => {
      expect(generateEscrowSummary("ESC-NOTEXIST")).toBeNull();
    });
  });
});
