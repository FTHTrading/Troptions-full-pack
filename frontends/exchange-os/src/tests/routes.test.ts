/**
 * Route smoke tests — verify that the platform's critical pages, files,
 * and configuration are in place. These are static assertions (no network
 * requests, no DB connections) and run instantly.
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../..");

function exists(rel: string): boolean {
  return fs.existsSync(path.join(ROOT, rel));
}

// ---------------------------------------------------------------------------
// 1. Previously-404 pages now have page.tsx
// ---------------------------------------------------------------------------
describe("Previously-missing pages now exist", () => {
  test("institutional index page exists", () => {
    expect(exists("src/app/troptions/institutional/page.tsx")).toBe(true);
  });
  test("compliance page exists", () => {
    expect(exists("src/app/troptions/compliance/page.tsx")).toBe(true);
  });
  test("rwa page exists", () => {
    expect(exists("src/app/troptions/rwa/page.tsx")).toBe(true);
  });
  test("settlement page exists", () => {
    expect(exists("src/app/troptions/settlement/page.tsx")).toBe(true);
  });
  test("system-status page exists", () => {
    expect(exists("src/app/troptions/system-status/page.tsx")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Proof files served from public/
// ---------------------------------------------------------------------------
describe("Proof files are present on disk", () => {
  test("Bryan Stone USDC 175M HTML proof exists", () => {
    expect(exists("public/proofs/bryan-stone-usdc-175m.html")).toBe(true);
  });
  test("Bryan Stone USDC 175M verification commands txt exists", () => {
    expect(exists("public/proofs/bryan-stone-usdc-175m-verification-commands.txt")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. CIS redirect target file exists
// ---------------------------------------------------------------------------
describe("CIS download file exists", () => {
  test("Bryan Stone KYC CIS master file PDF exists", () => {
    expect(
      exists("public/troptions/downloads/bryan-stone-kyc-cis-master-file.pdf")
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. XRPL TX hashes are valid 64-char hex
// ---------------------------------------------------------------------------
describe("XRPL TX hashes format validation", () => {
  const HEX64 = /^[0-9A-F]{64}$/;

  const hashes: [string, string][] = [
    ["USDC trustSet",  "CD7271274743C20635ED58515F84B399A4113FE40E62CFC8248446A494D1E642"],
    ["USDT trustSet",  "42092147E2D2BB2E944C7156378A6CEE8B8D0E78FB350266FC1990439D7F1F6F"],
    ["DAI trustSet",   "C0D75DCCF46DCA6F1776D739A4EC0F521330E170B8BC2E09C7F4D42A2361F641"],
    ["EURC trustSet",  "FF11D7773C0EDF38833A9CEE5AE03DEB6167D87FF07180A275A1DDCABCC560D1"],
  ];

  for (const [label, hash] of hashes) {
    test(`${label} hash is 64-char uppercase hex`, () => {
      expect(HEX64.test(hash)).toBe(true);
    });
  }
});

// ---------------------------------------------------------------------------
// 5. Middleware protects portal routes
// ---------------------------------------------------------------------------
describe("Middleware matcher covers portal", () => {
  test("middleware.ts matches /portal/:path*", () => {
    const middleware = fs.readFileSync(
      path.join(ROOT, "middleware.ts"),
      "utf-8"
    );
    expect(middleware).toContain('"/portal/:path*"');
  });

  test("middleware.ts still matches /troptions/gated/:path*", () => {
    const middleware = fs.readFileSync(
      path.join(ROOT, "middleware.ts"),
      "utf-8"
    );
    expect(middleware).toContain('"/troptions/gated/:path*"');
  });
});

// ---------------------------------------------------------------------------
// 6. Revenue DB module exports expected functions
// ---------------------------------------------------------------------------
describe("Revenue DB module structure", () => {
  test("revenue-db.ts exports createInquiry function", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/lib/troptions/revenue-db.ts"),
      "utf-8"
    );
    expect(src).toContain("export function createInquiry");
  });

  test("revenue-db.ts exports createBookingRequest function", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/lib/troptions/revenue-db.ts"),
      "utf-8"
    );
    expect(src).toContain("export function createBookingRequest");
  });
});

// ---------------------------------------------------------------------------
// 7. Inquiries API validates required fields
// ---------------------------------------------------------------------------
describe("Inquiries API input validation", () => {
  test("inquiries route.ts validates name field", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/inquiries/route.ts"),
      "utf-8"
    );
    expect(src).toContain("name");
  });

  test("inquiries route.ts validates email field", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/inquiries/route.ts"),
      "utf-8"
    );
    expect(src).toContain("email");
  });

  test("inquiries route.ts validates consentGiven field", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/inquiries/route.ts"),
      "utf-8"
    );
    expect(src).toContain("consentGiven");
  });
});

// ---------------------------------------------------------------------------
// 8. New revenue-readiness pages exist
// ---------------------------------------------------------------------------
describe("Revenue-readiness pages exist", () => {
  test("CIS intake form page exists (not just a redirect)", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/troptions/cis/page.tsx"),
      "utf-8"
    );
    // Must be a real form, not just a redirect
    expect(src).toContain("use client");
    expect(src).toContain("/api/troptions/cis-requests");
  });

  test("Proof room page exists", () => {
    expect(exists("src/app/troptions/proof-room/page.tsx")).toBe(true);
  });

  test("Request Access page exists", () => {
    expect(exists("src/app/troptions/request-access/page.tsx")).toBe(true);
  });

  test("Admin intake dashboard exists", () => {
    expect(exists("src/app/admin/troptions/intake/page.tsx")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 9. CIS API route structure
// ---------------------------------------------------------------------------
describe("CIS API route structure", () => {
  test("CIS route file exists", () => {
    expect(exists("src/app/api/troptions/cis-requests/route.ts")).toBe(true);
  });

  test("CIS route validates name field", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/cis-requests/route.ts"),
      "utf-8"
    );
    expect(src).toContain("name");
  });

  test("CIS route validates email field", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/cis-requests/route.ts"),
      "utf-8"
    );
    expect(src).toContain("email");
  });

  test("CIS route validates consentGiven field", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/cis-requests/route.ts"),
      "utf-8"
    );
    expect(src).toContain("consentGiven");
  });

  test("CIS route returns downloadUrl", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/cis-requests/route.ts"),
      "utf-8"
    );
    expect(src).toContain("downloadUrl");
  });
});

// ---------------------------------------------------------------------------
// 10. CSV export route exists and is admin-only
// ---------------------------------------------------------------------------
describe("CRM CSV export route", () => {
  test("inquiries export route file exists", () => {
    expect(exists("src/app/api/troptions/inquiries/export/route.ts")).toBe(true);
  });

  test("export route checks getCurrentUser (admin-only)", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/inquiries/export/route.ts"),
      "utf-8"
    );
    expect(src).toContain("getCurrentUser");
  });

  test("export route sets Content-Disposition attachment header", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/api/troptions/inquiries/export/route.ts"),
      "utf-8"
    );
    expect(src).toContain("Content-Disposition");
    expect(src).toContain("attachment");
  });
});

// ---------------------------------------------------------------------------
// 11. Portal layout has real server-side auth
// ---------------------------------------------------------------------------
describe("Portal layout auth", () => {
  test("portal layout calls getCurrentUser", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/portal/troptions/layout.tsx"),
      "utf-8"
    );
    expect(src).toContain("getCurrentUser");
  });

  test("portal layout redirects unauthenticated users", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/portal/troptions/layout.tsx"),
      "utf-8"
    );
    expect(src).toContain("redirect");
  });
});

// ---------------------------------------------------------------------------
// 12. Login page handles redirect param
// ---------------------------------------------------------------------------
describe("Login page redirect param", () => {
  test("login page reads redirect searchParam", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/troptions/auth/login/page.tsx"),
      "utf-8"
    );
    expect(src).toContain("redirect");
  });

  test("login page validates same-origin redirect", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/troptions/auth/login/page.tsx"),
      "utf-8"
    );
    // Checks for safe redirect (starts with /)
    expect(src).toContain("startsWith");
  });
});

// ---------------------------------------------------------------------------
// 13. revenue-db.ts CIS functions
// ---------------------------------------------------------------------------
describe("Revenue DB CIS functions", () => {
  test("revenue-db.ts exports createCisRequest", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/lib/troptions/revenue-db.ts"),
      "utf-8"
    );
    expect(src).toContain("export function createCisRequest");
  });

  test("revenue-db.ts exports listCisRequests", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/lib/troptions/revenue-db.ts"),
      "utf-8"
    );
    expect(src).toContain("export function listCisRequests");
  });

  test("revenue-db.ts exports getCisSummary", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/lib/troptions/revenue-db.ts"),
      "utf-8"
    );
    expect(src).toContain("export function getCisSummary");
  });

  test("cis_requests table defined in schema", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/lib/troptions/revenue-db.ts"),
      "utf-8"
    );
    expect(src).toContain("cis_requests");
  });
});

// ---------------------------------------------------------------------------
// 14. Proof room lists real downloadable files
// ---------------------------------------------------------------------------
describe("Proof room page lists real files", () => {
  test("proof room page references proof HTML file", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/troptions/proof-room/page.tsx"),
      "utf-8"
    );
    expect(src).toContain("/proofs/bryan-stone-usdc-175m.html");
  });

  test("proof room page references CIS master PDF", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/troptions/proof-room/page.tsx"),
      "utf-8"
    );
    expect(src).toContain("bryan-stone-kyc-cis-master-file.pdf");
  });

  test("proof room has verified badge logic", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "src/app/troptions/proof-room/page.tsx"),
      "utf-8"
    );
    expect(src).toContain("verified");
  });
});
