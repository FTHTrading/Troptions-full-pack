/**
 * Institutional Media System — Validation Tests
 * 12 tests verifying registry integrity, security, and route presence.
 */

import {
  MEDIA_REGISTRY,
  MEDIA_STATS,
  getMediaByCategory,
  getMediaByType,
  getMediaForRoute,
  getApprovedMedia,
  type MediaAsset,
} from "@/content/troptions/mediaRegistry";

// ── 1. Registry exists and is non-empty ───────────────────────────────────
describe("MEDIA_REGISTRY existence", () => {
  it("media registry exists and contains assets", () => {
    expect(MEDIA_REGISTRY).toBeDefined();
    expect(Array.isArray(MEDIA_REGISTRY)).toBe(true);
    expect(MEDIA_REGISTRY.length).toBeGreaterThan(0);
  });
});

// ── 2. All src values start with /troptions/ ─────────────────────────────
describe("MEDIA_REGISTRY src path integrity", () => {
  it("every asset src starts with /troptions/", () => {
    for (const asset of MEDIA_REGISTRY) {
      expect(asset.src).toMatch(/^\/troptions\//);
    }
  });
});

// ── 3. No Windows paths (C:\) ────────────────────────────────────────────
describe("MEDIA_REGISTRY security — no Windows paths", () => {
  it("no asset src contains C:\\ Windows path", () => {
    for (const asset of MEDIA_REGISTRY) {
      expect(asset.src).not.toMatch(/^C:\\/i);
      expect(asset.src).not.toMatch(/^[A-Z]:\\/i);
    }
  });
});

// ── 4. No OneDrive paths ─────────────────────────────────────────────────
describe("MEDIA_REGISTRY security — no OneDrive references", () => {
  it("no asset src contains OneDrive in path", () => {
    for (const asset of MEDIA_REGISTRY) {
      expect(asset.src).not.toMatch(/onedrive/i);
      expect(asset.alt).not.toMatch(/onedrive/i);
    }
  });
});

// ── 5. No 'token' in filenames (secret file guard) ───────────────────────
describe("MEDIA_REGISTRY security — no secret token files", () => {
  it("no asset src references token files", () => {
    for (const asset of MEDIA_REGISTRY) {
      // Guard against filenames like "token.txt" or "api-token-was-successful"
      expect(asset.src).not.toMatch(/token.*\.txt/i);
      expect(asset.src).not.toMatch(/successful.*copy/i);
    }
  });
});

// ── 6. No .env or secret file references ────────────────────────────────
describe("MEDIA_REGISTRY security — no env or secret files", () => {
  it("no asset references .env or secret files", () => {
    for (const asset of MEDIA_REGISTRY) {
      expect(asset.src).not.toMatch(/\.env/i);
      expect(asset.src).not.toMatch(/secret/i);
      expect(asset.src).not.toMatch(/password/i);
      expect(asset.src).not.toMatch(/\.key$/i);
    }
  });
});

// ── 7. Media library route page exists (via registry route data) ──────────
describe("Media library route coverage", () => {
  it("media assets include routes for the old-money section", () => {
    const routes = MEDIA_REGISTRY.flatMap((a) => a.routeUse);
    const hasOldMoneyRoute = routes.some((r) => r.startsWith("/troptions-old-money"));
    expect(hasOldMoneyRoute).toBe(true);
  });
});

// ── 8. All assets have compliance notes ──────────────────────────────────
describe("MEDIA_REGISTRY compliance notes", () => {
  it("every asset has a non-empty complianceNote", () => {
    for (const asset of MEDIA_REGISTRY) {
      expect(typeof asset.complianceNote).toBe("string");
      expect(asset.complianceNote.trim().length).toBeGreaterThan(0);
    }
  });
});

// ── 9. No banned hype phrases in descriptions ────────────────────────────
describe("MEDIA_REGISTRY compliance — no hype language", () => {
  const BANNED = [
    /guaranteed return/i,
    /risk[\s-]free/i,
    /instant liquidity/i,
    /fully compliant everywhere/i,
    /to the moon/i,
    /revolutionary/i,
    /replace.*bank/i,
    /guaranteed redemption/i,
  ];

  it("no asset description contains banned hype phrases", () => {
    for (const asset of MEDIA_REGISTRY) {
      const text = `${asset.title} ${asset.description} ${asset.complianceNote}`;
      for (const pattern of BANNED) {
        expect(text).not.toMatch(pattern);
      }
    }
  });
});

// ── 10. Video assets use approved formats ────────────────────────────────
describe("MEDIA_REGISTRY video format validation", () => {
  it("all video type assets use mp4, webm, or mov extension", () => {
    const videos = getMediaByType("video");
    for (const v of videos) {
      expect(v.src).toMatch(/\.(mp4|webm|mov)$/i);
    }
  });
});

// ── 11. Image assets use approved formats ────────────────────────────────
describe("MEDIA_REGISTRY image format validation", () => {
  it("all image type assets use jpg, jpeg, png, or webp extension", () => {
    const images = getMediaByType("image");
    for (const img of images) {
      expect(img.src).toMatch(/\.(jpg|jpeg|png|webp)$/i);
    }
  });
});

// ── 12. All required categories are present ──────────────────────────────
describe("MEDIA_REGISTRY category coverage", () => {
  it("registry includes brand video, rwa, gold, energy, and certificate categories", () => {
    const categories = MEDIA_REGISTRY.map((a) => a.category);
    expect(categories).toContain("video");
    expect(categories).toContain("rwa");
    expect(categories).toContain("gold");
    expect(categories).toContain("energy");
    expect(categories).toContain("certificate");
  });

  it("MEDIA_STATS reflects correct total counts", () => {
    expect(MEDIA_STATS.total).toBe(MEDIA_REGISTRY.length);
    expect(MEDIA_STATS.images).toBe(MEDIA_REGISTRY.filter((a) => a.type === "image").length);
    expect(MEDIA_STATS.videos).toBe(MEDIA_REGISTRY.filter((a) => a.type === "video").length);
  });
});
