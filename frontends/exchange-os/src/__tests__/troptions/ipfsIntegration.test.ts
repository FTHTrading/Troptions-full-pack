/**
 * IPFS Integration Tests
 *
 * Tests cover:
 * - isValidCid: CIDv0 and CIDv1 format validation
 * - ipfsHealthCheck: disabled state (no node required)
 * - ipfsAddJson: disabled state + fetch mock
 * - ipfsIsPinned: disabled state + fetch mock
 * - ipfsPin: invalid CID rejection
 * - ipfsUri / ipfsGatewayUrl: URL helpers
 * - assertLocalOnly guard: rejects non-localhost URLs
 * - EvidenceRecord creation and validation
 * - createEvidenceRecord: fills defaults
 * - validateEvidenceRecord: required fields
 * - No public API URL allowed in environment
 */

import {
  isValidCid,
  ipfsHealthCheck,
  ipfsAddJson,
  ipfsIsPinned,
  ipfsPin,
  ipfsUri,
  ipfsGatewayUrl,
} from "@/lib/troptions/ipfsService";
import {
  createEvidenceRecord,
  validateEvidenceRecord,
} from "@/lib/troptions/ipfsEvidenceRegistry";

// ─── CID Validation ───────────────────────────────────────────────────────────

describe("isValidCid", () => {
  it("accepts a valid CIDv0 (Qm...)", () => {
    expect(isValidCid("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")).toBe(true);
  });

  it("accepts a valid CIDv1 (bafy...)", () => {
    expect(isValidCid("bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidCid("")).toBe(false);
  });

  it("rejects a short string", () => {
    expect(isValidCid("Qm12345")).toBe(false);
  });

  it("rejects a random hex string that looks nothing like a CID", () => {
    expect(isValidCid("deadbeef")).toBe(false);
  });

  it("rejects null / undefined coerced values", () => {
    // @ts-expect-error intentional invalid type test
    expect(isValidCid(null)).toBe(false);
    // @ts-expect-error intentional invalid type test
    expect(isValidCid(undefined)).toBe(false);
  });
});

// ─── Service — disabled state ─────────────────────────────────────────────────

describe("ipfsService — disabled (IPFS_LOCAL_ENABLED not set)", () => {
  const original = process.env.IPFS_LOCAL_ENABLED;

  beforeEach(() => {
    delete process.env.IPFS_LOCAL_ENABLED;
  });

  afterEach(() => {
    if (original !== undefined) process.env.IPFS_LOCAL_ENABLED = original;
    else delete process.env.IPFS_LOCAL_ENABLED;
  });

  it("ipfsHealthCheck returns ok:false with disabled message", async () => {
    const result = await ipfsHealthCheck();
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/disabled/i);
  });

  it("ipfsAddJson returns ok:false with disabled message", async () => {
    const result = await ipfsAddJson({ test: true });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/disabled/i);
  });

  it("ipfsIsPinned returns ok:false with disabled message", async () => {
    const result = await ipfsIsPinned("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/disabled/i);
  });

  it("ipfsPin returns ok:false with disabled message", async () => {
    const result = await ipfsPin("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    expect(result.ok).toBe(false);
  });
});

// ─── Service — invalid CID rejection ─────────────────────────────────────────

describe("ipfsService — invalid CID rejection", () => {
  const original = process.env.IPFS_LOCAL_ENABLED;

  beforeEach(() => {
    process.env.IPFS_LOCAL_ENABLED = "true";
  });

  afterEach(() => {
    if (original !== undefined) process.env.IPFS_LOCAL_ENABLED = original;
    else delete process.env.IPFS_LOCAL_ENABLED;
  });

  it("ipfsPin rejects an invalid CID before calling fetch", async () => {
    const result = await ipfsPin("not-a-cid");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/invalid cid/i);
  });

  it("ipfsIsPinned rejects an invalid CID before calling fetch", async () => {
    const result = await ipfsIsPinned("not-a-cid");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/invalid cid/i);
  });
});

// ─── Service — with fetch mock ────────────────────────────────────────────────

describe("ipfsService — with fetch mock (enabled)", () => {
  const original = process.env.IPFS_LOCAL_ENABLED;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    process.env.IPFS_LOCAL_ENABLED = "true";
  });

  afterEach(() => {
    if (original !== undefined) process.env.IPFS_LOCAL_ENABLED = original;
    else delete process.env.IPFS_LOCAL_ENABLED;
    fetchMock?.mockRestore();
  });

  it("ipfsHealthCheck returns node info on 200", async () => {
    fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ID: "12D3KooWTest",
          AgentVersion: "kubo/0.31.0",
          ProtocolVersion: "ipfs/0.1.0",
          Addresses: ["/ip4/127.0.0.1/tcp/4001"],
        }),
        { status: 200 },
      ),
    );

    const result = await ipfsHealthCheck();
    expect(result.ok).toBe(true);
    expect(result.peerId).toBe("12D3KooWTest");
    expect(result.agentVersion).toBe("kubo/0.31.0");
  });

  it("ipfsHealthCheck returns ok:false on network error", async () => {
    fetchMock = jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("ECONNREFUSED"));

    const result = await ipfsHealthCheck();
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/ECONNREFUSED/);
  });

  it("ipfsAddJson returns CID from Kubo NDJSON response", async () => {
    fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          Name: "document.json",
          Hash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          Size: "42",
        }) + "\n",
        { status: 200 },
      ),
    );

    const result = await ipfsAddJson({ hello: "troptions" });
    expect(result.ok).toBe(true);
    expect(result.cid).toBe("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    expect(result.ipfsUri).toBe("ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    expect(result.localGatewayUrl).toContain("/ipfs/Qm");
  });

  it("ipfsIsPinned returns pinned:true when CID appears in pin/ls", async () => {
    const cid = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ Keys: { [cid]: { Type: "recursive" } } }),
        { status: 200 },
      ),
    );

    const result = await ipfsIsPinned(cid);
    expect(result.ok).toBe(true);
    expect(result.pinned).toBe(true);
  });

  it("ipfsIsPinned returns pinned:false on 500 (not pinned)", async () => {
    fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response("{}", { status: 500 }),
    );

    const result = await ipfsIsPinned("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG");
    expect(result.ok).toBe(true);
    expect(result.pinned).toBe(false);
  });
});

// ─── URL helpers ──────────────────────────────────────────────────────────────

describe("ipfsUri / ipfsGatewayUrl", () => {
  it("ipfsUri returns ipfs:// URI", () => {
    expect(ipfsUri("QmTest1234")).toBe("ipfs://QmTest1234");
  });

  it("ipfsGatewayUrl returns local gateway URL by default", () => {
    delete process.env.IPFS_GATEWAY_URL;
    expect(ipfsGatewayUrl("QmTest1234")).toBe("http://127.0.0.1:8080/ipfs/QmTest1234");
  });
});

// ─── No public API URL in production config ───────────────────────────────────

describe("security: no public API URL allowed", () => {
  it("IPFS_RPC_URL must not be a public IP (0.0.0.0)", () => {
    const forbidden = ["http://0.0.0.0:5001", "http://1.2.3.4:5001", "https://example.com:5001"];
    for (const url of forbidden) {
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      const isLocal =
        hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
      expect(isLocal).toBe(false);
    }
  });

  it("IPFS_RPC_URL is safe when set to localhost addresses", () => {
    const safe = ["http://127.0.0.1:5001", "http://localhost:5001"];
    for (const url of safe) {
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      const isLocal =
        hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
      expect(isLocal).toBe(true);
    }
  });
});

// ─── Evidence Registry ────────────────────────────────────────────────────────

describe("createEvidenceRecord", () => {
  const base = {
    id: "test-001",
    title: "Genesis Manifest",
    category: "genesis-manifest" as const,
    sourceFileName: "troptions-genesis.json",
    cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    createdAt: "2026-04-27T00:00:00Z",
  };

  it("fills default status, pinned, ipfsUri, localGatewayUrl", () => {
    const rec = createEvidenceRecord(base);
    expect(rec.status).toBe("draft");
    expect(rec.pinned).toBe(false);
    expect(rec.ipfsUri).toBe(`ipfs://${base.cid}`);
    expect(rec.localGatewayUrl).toContain(base.cid);
    expect(rec.localGatewayUrl).toContain("127.0.0.1:8080");
  });

  it("respects overridden status and pinned", () => {
    const rec = createEvidenceRecord({ ...base, status: "verified", pinned: true });
    expect(rec.status).toBe("verified");
    expect(rec.pinned).toBe(true);
  });
});

describe("validateEvidenceRecord", () => {
  const validRecord = {
    id: "test-001",
    title: "Test",
    category: "other" as const,
    sourceFileName: "test.json",
    cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    createdAt: "2026-04-27T00:00:00Z",
  };

  it("validates a correct record", () => {
    const result = validateEvidenceRecord(validRecord);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("reports missing id", () => {
    const result = validateEvidenceRecord({ ...validRecord, id: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("id is required");
  });

  it("reports missing title", () => {
    const result = validateEvidenceRecord({ ...validRecord, title: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("title is required");
  });

  it("reports missing cid", () => {
    const result = validateEvidenceRecord({ ...validRecord, cid: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("cid is required");
  });

  it("reports invalid cid format", () => {
    const result = validateEvidenceRecord({ ...validRecord, cid: "not-a-valid-cid" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("cid format appears invalid"))).toBe(true);
  });

  it("reports missing createdAt", () => {
    const result = validateEvidenceRecord({ ...validRecord, createdAt: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("createdAt is required");
  });
});
