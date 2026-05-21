import {
  PDF_DOCUMENT_REGISTRY,
  PDF_SAFETY_DISCLAIMER,
  PDF_FILENAMES,
} from "@/lib/troptions/pdfDocumentRegistry";

describe("PDF_DOCUMENT_REGISTRY", () => {
  it("has at least 20 documents", () => {
    expect(PDF_DOCUMENT_REGISTRY.length).toBeGreaterThanOrEqual(20);
  });

  it("every document has a pdfPath", () => {
    for (const doc of PDF_DOCUMENT_REGISTRY) {
      expect(typeof doc.pdfPath).toBe("string");
      expect(doc.pdfPath.length).toBeGreaterThan(0);
    }
  });

  it("every primaryCtaLabel is 'Download PDF'", () => {
    for (const doc of PDF_DOCUMENT_REGISTRY) {
      expect(doc.primaryCtaLabel).toBe("Download PDF");
    }
  });

  it("JSON is never the only option — every doc has a pdfPath", () => {
    for (const doc of PDF_DOCUMENT_REGISTRY) {
      expect(doc.pdfPath).toBeTruthy();
    }
  });

  it("has exactly 4 PATE-COAL-001 documents", () => {
    const pateDocs = PDF_DOCUMENT_REGISTRY.filter(
      (d) => d.category === "PATE-COAL-001"
    );
    expect(pateDocs.length).toBe(4);
  });

  it("includes the XRPL IOU issuance handbook", () => {
    const doc = PDF_DOCUMENT_REGISTRY.find(
      (d) => d.id === "xrpl-iou-issuance-handbook"
    );
    expect(doc).toBeDefined();
    expect(doc?.category).toBe("XRPL / IOU / Wallets");
  });

  it("includes the funding route matrix", () => {
    const doc = PDF_DOCUMENT_REGISTRY.find(
      (d) => d.id === "funding-route-matrix"
    );
    expect(doc).toBeDefined();
    expect(doc?.category).toBe("Funding Routes");
  });

  it("includes the wallet mint noncustodial guide", () => {
    const doc = PDF_DOCUMENT_REGISTRY.find(
      (d) => d.id === "wallet-mint-noncustodial-guide"
    );
    expect(doc).toBeDefined();
  });

  it("every document has required fields", () => {
    for (const doc of PDF_DOCUMENT_REGISTRY) {
      expect(doc.id).toBeTruthy();
      expect(doc.title).toBeTruthy();
      expect(doc.subtitle).toBeTruthy();
      expect(doc.audience).toBeTruthy();
      expect(doc.category).toBeTruthy();
      expect(doc.description).toBeTruthy();
      expect(doc.version).toBeTruthy();
      expect(["READY", "PDF_PENDING", "INTERNAL_ONLY"]).toContain(doc.status);
    }
  });

  it("PDF_SAFETY_DISCLAIMER is non-empty and contains required legal language", () => {
    expect(PDF_SAFETY_DISCLAIMER.length).toBeGreaterThan(50);
    expect(PDF_SAFETY_DISCLAIMER.toLowerCase()).toContain("informational");
    expect(PDF_SAFETY_DISCLAIMER.toLowerCase()).toContain("not a bank");
  });

  it("PDF_FILENAMES has the same count as the registry", () => {
    expect(PDF_FILENAMES.length).toBe(PDF_DOCUMENT_REGISTRY.length);
  });

  it("all pdfPath values point to the downloads directory", () => {
    for (const doc of PDF_DOCUMENT_REGISTRY) {
      expect(doc.pdfPath).toContain("/troptions/downloads/");
      expect(doc.pdfPath).toMatch(/\.pdf$/);
    }
  });

  it("no two documents share the same id", () => {
    const ids = PDF_DOCUMENT_REGISTRY.map((d) => d.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
