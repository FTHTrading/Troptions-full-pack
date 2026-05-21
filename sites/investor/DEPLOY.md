# TROPTIONS investor showcase — deploy guide

**App path:** `sites/investor/`  
**Stack:** Next.js 15 App Router, Tailwind CSS 4, static export (`out/`)

## Local development

```powershell
cd sites/investor
npm install
npm run dev
```

Open **http://localhost:3000** (landing) and **http://localhost:3000/anthem/** (lyrics).

## Production build

```powershell
cd sites/investor
npm run build
```

Static output: `sites/investor/out/`

## Vercel (recommended for Bryan)

1. Import **FTHTrading/Troptions-full-pack** in [Vercel](https://vercel.com).
2. Set **Root Directory** to `sites/investor`.
3. Framework preset: **Next.js** (uses `vercel.json`).
4. Deploy. No env secrets required for the static showcase.

**Placeholder URL after first deploy:**  
`https://troptions-investor.vercel.app` (rename project / add custom domain in Vercel dashboard)

## Netlify

1. New site from Git → repo **Troptions-full-pack**.
2. Build settings (also in repo `netlify.toml` at monorepo root is **not** used — configure UI or set base):
   - **Base directory:** `sites/investor`
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
3. Deploy.

**Placeholder URL:**  
`https://troptions-investor.netlify.app`

## GitHub Pages (optional fallback)

Static export is compatible with Pages. From repo root:

```powershell
.\scripts\deploy-investor-site.ps1 -CopyToDocs
```

Then enable Pages on `/docs` or commit `out/` contents. Prefer pointing README visitors to Vercel/Netlify for the canonical investor URL.

## Monorepo script

```powershell
.\scripts\deploy-investor-site.ps1
.\scripts\deploy-investor-site.ps1 -VercelProd
.\scripts\deploy-investor-site.ps1 -NetlifyProd
```

Requires Vercel CLI / Netlify CLI installed and authenticated locally.

## Custom domain (operator)

Point `troptions.org` apex or `www` CNAME at Vercel/Netlify when Bryan enables DNS. Keep **unykorn.org** product URLs unchanged (see domain truth on the live site).
