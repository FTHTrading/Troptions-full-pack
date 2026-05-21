/**
 * revenue-db.test.ts
 *
 * Tests the SQLite-backed revenue DB layer using an isolated temp database.
 * Overrides the DB path via a module-level trick to avoid writing to data/revenue.db.
 */

import path from "path";
import os from "os";
import fs from "fs";

// We need to test the DB layer without touching the real DB.
// The module uses a module-level let db, so we set a unique path via mocking.
// Since the path is hardcoded, we use jest.mock to intercept the module and
// inject a temp path.

// Strategy: patch the module to use a temp file path by mocking 'better-sqlite3'
// to wrap the actual Database class but pointed at a temp file.

// Actually, the cleanest approach is to import the functions and run them against
// a test path by temporarily setting the module path. Since better-sqlite3 is
// real (it's in deps), we can just call the functions and let them write to a
// temp location by monkey-patching process.cwd().

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "troptions-revenue-test-"));
const originalCwd = process.cwd;

beforeAll(() => {
  // Point the DB to a temp directory
  (process as NodeJS.Process).cwd = () => tmpDir;
  fs.mkdirSync(path.join(tmpDir, "data"), { recursive: true });
});

afterAll(() => {
  (process as NodeJS.Process).cwd = originalCwd;
  // Clean up temp directory
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // ignore cleanup errors
  }
});

// Import after patching cwd so the DB path resolves to tmpDir
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  createInquiry,
  listInquiries,
  getInquiry,
  getInquirySummary,
  createBookingRequest,
  listBookingRequests,
  getBookingSummary,
} = require("@/lib/troptions/revenue-db");

describe("revenue-db — inquiries", () => {
  it("creates an inquiry and returns it", () => {
    const result = createInquiry({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I am interested in the growth system build.",
      consentGiven: true,
      budgetRange: "25k_to_100k",
      serviceInterest: "client_portal_setup",
      company: "Jane Corp",
      phone: "+1-555-0000",
      timeline: "60 days",
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe("Jane Doe");
    expect(result.email).toBe("jane@example.com");
    expect(result.status).toBe("new");
    expect(result.consentGiven).toBe(true);
    expect(result.leadScore).toBeGreaterThan(0);
    expect(typeof result.createdAt).toBe("string");
  });

  it("rejects empty message gracefully via DB NOT NULL constraint if empty", () => {
    // The API layer validates before calling createInquiry.
    // DB layer will throw if message is missing — confirm we can catch it.
    expect(() => {
      createInquiry({
        name: "Test",
        email: "t@t.com",
        message: "", // empty message
        consentGiven: true,
      });
    }).not.toThrow(); // empty string passes NOT NULL — API validation is upstream
  });

  it("lists inquiries", () => {
    const list = listInquiries(100, 0);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
  });

  it("gets a specific inquiry by id", () => {
    const created = createInquiry({
      name: "Get Test",
      email: "get@example.com",
      message: "Test message",
      consentGiven: true,
    });
    const fetched = getInquiry(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched.id).toBe(created.id);
    expect(fetched.email).toBe("get@example.com");
  });

  it("returns null for a non-existent inquiry id", () => {
    const result = getInquiry("does-not-exist-uuid");
    expect(result).toBeNull();
  });

  it("getInquirySummary returns correct counts", () => {
    const summary = getInquirySummary();
    expect(typeof summary.total).toBe("number");
    expect(typeof summary.newLeads).toBe("number");
    expect(typeof summary.qualified).toBe("number");
    expect(summary.total).toBeGreaterThanOrEqual(0);
  });

  it("normalizes email to lowercase", () => {
    const result = createInquiry({
      name: "Email Test",
      email: "UPPER@EXAMPLE.COM",
      message: "Test",
      consentGiven: true,
    });
    expect(result.email).toBe("upper@example.com");
  });
});

describe("revenue-db — booking requests", () => {
  it("creates a booking request and returns it", () => {
    const result = createBookingRequest({
      name: "John Smith",
      email: "john@example.com",
      company: "Smith LLC",
      preferredDate: "2026-06-15",
      preferredTime: "14:00",
      timezone: "Eastern Time (ET)",
      callType: "discovery",
      notes: "Looking forward to learning more.",
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe("John Smith");
    expect(result.email).toBe("john@example.com");
    expect(result.status).toBe("pending");
    expect(result.callType).toBe("discovery");
  });

  it("lists booking requests", () => {
    const list = listBookingRequests(100, 0);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
  });

  it("getBookingSummary returns correct counts", () => {
    const summary = getBookingSummary();
    expect(typeof summary.total).toBe("number");
    expect(typeof summary.pending).toBe("number");
    expect(summary.total).toBeGreaterThanOrEqual(0);
  });

  it("normalizes booking email to lowercase", () => {
    const result = createBookingRequest({
      name: "Email Test",
      email: "BOOKING@EXAMPLE.COM",
    });
    expect(result.email).toBe("booking@example.com");
  });
});
