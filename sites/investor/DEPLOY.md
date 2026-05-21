# TROPTIONS investor showcase — deploy guide

**App path:** `sites/investor/`  
**Stack:** Next.js 15 App Router, Tailwind CSS 4, static export (`out/`)

## Local development

```powershell
cd sites/investor
npm install
npm run dev
```

Open **http://localhost:3123** (landing) and **http://localhost:3123/anthem/** (lyrics).

## Production build

```powershell
cd sites/investor
npm run build
```

Static output: `sites/investor/out/` (no `basePath` — for Vercel/Netlify root hosting).

## GitHub Pages (canonical public URL)

From repo root:

```powershell
.\scripts\deploy-investor-site.ps1 -CopyToDocs
```

This sets `GITHUB_PAGES=true`, builds with `basePath: /Troptions-full-pack`, moves legacy Jekyll/markdown under `docs/technical/`, and copies `out/` to `docs/` root (`index.html`, `_next/`, `audio/`, `data/`, `.nojekyll`).

**Live URL:** https://fthtrading.github.io/Troptions-full-pack/

**Preview built Pages export locally:**

```powershell
.\scripts\preview-pages-3123.ps1
```

Then open **http://localhost:3123/Troptions-full-pack/** (paths match production).

## Vercel (optional)

1. Import **FTHTrading/Troptions-full-pack** in [Vercel](https://vercel.com).
2. Set **Root Directory** to `sites/investor`.
3. Framework preset: **Next.js** (uses `vercel.json`).
4. Deploy. No env secrets required for the static showcase.

## Netlify (optional)

1. New site from Git → repo **Troptions-full-pack**.
2. **Base directory:** `sites/investor`
3. **Build command:** `npm run build`
4. **Publish directory:** `out`

## Monorepo script

```powershell
.\scripts\deploy-investor-site.ps1
.\scripts\deploy-investor-site.ps1 -CopyToDocs
.\scripts\deploy-investor-site.ps1 -VercelProd
.\scripts\deploy-investor-site.ps1 -NetlifyProd
```

## Custom domain (operator)

Point `troptions.org` apex or `www` CNAME at Vercel/Netlify when Bryan enables DNS. Keep **unykorn.org** product URLs unchanged (see domain truth on the live site).
