import {
  clearSignatureRegistry,
  createSignatureCollection,
  recordSignature,
  simulateEip1271Verify,
  getSignatureCollection,
  listSignatureCollections,
  generateSignatureSummary,
  EIP1271_MAGIC_VALUE,
  EIP1271_FAILURE_VALUE,
  CONTRACT_SIGNATURE_DISCLOSURE,
} from "@/lib/troptions/contractSignatureEngine";

beforeEach(() => {
  clearSignatureRegistry();
});

describe("contractSignatureEngine", () => {
  describe("constants", () => {
    it("EIP1271_MAGIC_VALUE is 0x1626ba7e", () => {
      expect(EIP1271_MAGIC_VALUE).toBe("0x1626ba7e");
    });

    it("EIP1271_FAILURE_VALUE is 0xffffffff", () => {
      expect(EIP1271_FAILURE_VALUE).toBe("0xffffffff");
    });

    it("CONTRACT_SIGNATURE_DISCLOSURE references simulation", () => {
      expect(CONTRACT_SIGNATURE_DISCLOSURE.toLowerCase()).toContain("simulation");
    });
  });

  describe("createSignatureCollection", () => {
    it("creates a collection with all signatories pending", () => {
      const collection = createSignatureCollection({
        agreementType: "subscription_agreement",
        documentHash: "a".repeat(64),
        documentName: "RWA Agreement v1",
        signatoryAddresses: [
          { address: "rPartyA", isContractWallet: false, method: "ecdsa_eoa" },
          { address: "rPartyB", isContractWallet: false, method: "ecdsa_eoa" },
        ],
      });
      expect(collection.collectionId).toBeTruthy();
      expect(collection.agreementType).toBe("subscription_agreement");
      expect(collection.signatories).toHaveLength(2);
      expect(collection.signatories.every((s) => s.status === "pending")).toBe(true);
      expect(collection.isComplete).toBe(false);
      expect(collection.simulationOnly).toBe(true);
    });

    it("single signatory collection", () => {
      const collection = createSignatureCollection({
        agreementType: "diligence_acknowledgment",
        documentHash: "b".repeat(64),
        documentName: "Test Agreement",
        signatoryAddresses: [{ address: "rOnlySigner", isContractWallet: false, method: "ecdsa_eoa" }],
      });
      expect(collection.signatories).toHaveLength(1);
      expect(collection.isComplete).toBe(false);
    });

    it("assigns unique collectionIds", () => {
      const c1 = createSignatureCollection({ agreementType: "diligence_acknowledgment", documentHash: "a".repeat(64), documentName: "A", signatoryAddresses: [{ address: "rA", isContractWallet: false, method: "ecdsa_eoa" }] });
      const c2 = createSignatureCollection({ agreementType: "diligence_acknowledgment", documentHash: "b".repeat(64), documentName: "B", signatoryAddresses: [{ address: "rB", isContractWallet: false, method: "ecdsa_eoa" }] });
      expect(c1.collectionId).not.toBe(c2.collectionId);
    });

    it("includes transactionId when provided", () => {
      const collection = createSignatureCollection({
        agreementType: "pledge_agreement",
        documentHash: "c".repeat(64),
        documentName: "Linked",
        signatoryAddresses: [{ address: "rSigner", isContractWallet: false, method: "ecdsa_eoa" }],
        transactionId: "txn-abc-123",
      });
      expect(collection.transactionId).toBe("txn-abc-123");
    });
  });

  describe("recordSignature", () => {
    it("records EOA signature and marks that signatory as signed", () => {
      const collection = createSignatureCollection({
        agreementType: "subscription_agreement",
        documentHash: "d".repeat(64),
        documentName: "EOA Agreement",
        signatoryAddresses: [
          { address: "0xEOAPartyA", isContractWallet: false, method: "ecdsa_eoa" },
          { address: "0xEOAPartyB", isContractWallet: false, method: "ecdsa_eoa" },
        ],
      });
      const result = recordSignature({
        collectionId: collection.collectionId,
        signatoryAddress: "0xEOAPartyA",
      });
      expect(result.success).toBe(true);
      expect(result.isComplete).toBe(false); // second signatory still pending
      const coll = getSignatureCollection(collection.collectionId);
      const signedParty = coll!.signatories.find((s) => s.signatoryAddress === "0xEOAPartyA");
      expect(signedParty?.status).toBe("signed");
    });

    it("marks collection complete when all signatories sign", () => {
      const collection = createSignatureCollection({
        agreementType: "diligence_acknowledgment",
        documentHash: "e".repeat(64),
        documentName: "Complete Agreement",
        signatoryAddresses: [{ address: "rSignerA", isContractWallet: false, method: "ecdsa_eoa" }],
      });
      const result = recordSignature({ collectionId: collection.collectionId, signatoryAddress: "rSignerA" });
      expect(result.success).toBe(true);
      expect(result.isComplete).toBe(true);
    });

    it("returns failure for non-existent collection", () => {
      const result = recordSignature({ collectionId: "SIG-NOTEXIST", signatoryAddress: "rSigner" });
      expect(result.success).toBe(false);
    });
  });

  describe("simulateEip1271Verify", () => {
    it("returns magic value for valid inputs", () => {
      const result = simulateEip1271Verify(
        "0xContractWallet123",
        "a".repeat(64),
        "0x" + "e".repeat(130),
      );
      expect(result.result).toBe(EIP1271_MAGIC_VALUE);
      expect(result.isValid).toBe(true);
    });

    it("returns failure value for empty contract address", () => {
      const result = simulateEip1271Verify("", "a".repeat(64), "0x" + "e".repeat(130));
      expect(result.result).toBe(EIP1271_FAILURE_VALUE);
      expect(result.isValid).toBe(false);
    });

    it("returns failure value for wrong-length message hash", () => {
      const result = simulateEip1271Verify("0xContract", "tooshort", "0x" + "e".repeat(130));
      expect(result.result).toBe(EIP1271_FAILURE_VALUE);
      expect(result.isValid).toBe(false);
    });
  });

  describe("getSignatureCollection and listSignatureCollections", () => {
    it("retrieves collection by ID", () => {
      const created = createSignatureCollection({ agreementType: "diligence_acknowledgment", documentHash: "h".repeat(64), documentName: "Get Test", signatoryAddresses: [{ address: "rA", isContractWallet: false, method: "ecdsa_eoa" }] });
      const fetched = getSignatureCollection(created.collectionId);
      expect(fetched).toBeDefined();
      expect(fetched!.collectionId).toBe(created.collectionId);
    });

    it("returns undefined for unknown collection ID", () => {
      expect(getSignatureCollection("SIG-UNKNOWN")).toBeUndefined();
    });

    it("lists all collections", () => {
      createSignatureCollection({ agreementType: "diligence_acknowledgment", documentHash: "i".repeat(64), documentName: "A1", signatoryAddresses: [{ address: "rA", isContractWallet: false, method: "ecdsa_eoa" }] });
      createSignatureCollection({ agreementType: "diligence_acknowledgment", documentHash: "j".repeat(64), documentName: "A2", signatoryAddresses: [{ address: "rB", isContractWallet: false, method: "ecdsa_eoa" }] });
      expect(listSignatureCollections()).toHaveLength(2);
    });
  });

  describe("generateSignatureSummary", () => {
    it("returns summary with simulationOnly flag", () => {
      const collection = createSignatureCollection({ agreementType: "diligence_acknowledgment", documentHash: "k".repeat(64), documentName: "Summary", signatoryAddresses: [{ address: "rX", isContractWallet: false, method: "ecdsa_eoa" }] });
      const summary = generateSignatureSummary(collection.collectionId);
      expect(summary).not.toBeNull();
      expect(summary!.simulationOnly).toBe(true);
      expect(summary!.collectionId).toBe(collection.collectionId);
    });

    it("returns null for unknown collection", () => {
      expect(generateSignatureSummary("SIG-UNKNOWN")).toBeNull();
    });
  });
});
