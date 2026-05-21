# Troptions Logo and Brand Asset Folder

**Version:** 1.0.0  
**Owner:** Troptions Institutional OS  
**Status:** Awaiting physical asset upload

---

## Folder Structure

```
public/assets/troptions/
├── logos/                  ← Core Troptions brand logos (all variants)
├── xchange/                ← Troptions Xchange brand assets
├── unity-token/            ← Unity Token brand assets
├── university/             ← Troptions University brand assets
├── media/                  ← TV Network / media brand assets
├── real-estate/            ← The Real Estate Connections brand assets
├── solar/                  ← Green-N-Go Solar brand assets
├── mobile-medical/         ← Troptions Mobile Medical Units brand assets
├── hotrcw/                 ← HOTRCW brand assets
└── README.md               ← This file
```

---

## Expected Logo Files (to be placed in `logos/`)

| Filename | Description |
|---|---|
| `TROPTIONS NEW LOGO.jfif` | Primary Troptions logo (new version) |
| `TROPTIONS T LOGO BLK.jfif` | T-mark, black version |
| `TROPTIONS T.png` | T-mark, transparent |
| `Troptions-facebook-Profile.jpg` | Social/profile logo |
| `powered by troptions trade make logo.png` | "Powered by" lockup |
| `troptons logo white.jpg` | White version logo |
| `back logo.jpg.png` | Back-facing / alternate logo |
| `Troptions university.jpg` | University sub-brand logo |
| `TROPTIONS MOBILE MEDICAL UNITS.png` | Mobile Medical Units sub-brand logo |

---

## File Naming Rules

1. Use the original filenames exactly as provided (preserve case and extension)
2. If a newer/better version replaces a file, append `-v2`, `-v3` etc. to the filename
3. Never delete originals — archive to `logos/archive/` if replacing
4. Preferred delivery formats: **PNG** (transparent) and **SVG** (vector) for primary marks
5. JPEG is acceptable for photos/social variants; `.jfif` files convert cleanly to `.jpg`
6. Maximum dimensions: 2000×2000px for raster; no limit for SVG

---

## Usage in Code

Reference assets using root-relative public paths:

```tsx
// Core mark
<img src="/assets/troptions/logos/TROPTIONS T.png" alt="Troptions" />

// Sub-brand — University
<img src="/assets/troptions/university/Troptions university.jpg" alt="Troptions University" />

// Sub-brand — Mobile Medical
<img src="/assets/troptions/mobile-medical/TROPTIONS MOBILE MEDICAL UNITS.png" alt="Troptions Mobile Medical Units" />
```

---

## Action Items (Manual Steps Required)

- [ ] Kevan or Bryan: drop all logo files listed above into `public/assets/troptions/logos/`
- [ ] Confirm which logos are public vs. internal-only
- [ ] Add mobile medical unit photographs to `mobile-medical/` when available
- [ ] Add university course/facility photos to `university/` when available
- [ ] Provide Green-N-Go Solar installation photos for `solar/`
- [ ] Review and approve logo-to-sub-brand assignments in `troptionsEcosystemRegistry.ts`

---

## Compliance Note

Logo assets should not be used in contexts that imply financial endorsement, investment recommendation, or securities promotion without explicit legal approval.
