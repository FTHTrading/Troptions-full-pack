---
title: Local preview (port 3123)
layout: default
permalink: /technical/LOCAL_PREVIEW.html
---

# Local preview — fix `ERR_CONNECTION_REFUSED` on localhost:3123

GitHub Pages HTML under `docs/` and the investor Next.js app both use port **3123** for local preview. Nothing listens until you start a server.

---

## Option A — static docs (GitHub Pages export)

From repo root:

```powershell
cd docs
npx --yes serve . -l 3123
```

Or use the helper script:

```powershell
.\scripts\preview-pages-3123.ps1
```

Open:

- http://localhost:3123/technical/SYSTEM_MANIFEST.html  
- http://localhost:3123/technical/ARBITRAGE_AND_BAAS.html  

If you previously opened `http://localhost:3123` with no path and saw **ERR_CONNECTION_REFUSED**, the fix is simply running one of the commands above first.

---

## Option B — investor Next.js dev server

```powershell
cd sites\investor
npm install
npm run dev
```

`package.json` sets `next dev -p 3123`. Use the app's `basePath` when testing production-like URLs (see `sites/investor/DEPLOY.md`).

---

## Option C — full technical HTML sync

After editing `docs/technical/*.md`:

```powershell
npm run docs:update
```

Then serve with Option A.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ERR_CONNECTION_REFUSED` | Start `serve` or `npm run dev` — port 3123 is not started by PM2 |
| Wrong paths / 404 | Use `serve` from `docs/` folder, or investor `basePath` per DEPLOY.md |
| Firewall block | Allow Node on private network once |
