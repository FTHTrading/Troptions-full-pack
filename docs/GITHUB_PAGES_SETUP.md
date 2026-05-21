# GitHub Pages setup (for Bryan)

**Canonical public URL (share this):** **https://fthtrading.github.io/Troptions-full-pack/**

Do **not** link to `…/Troptions-full-pack/Troptions-full-pack` — that path 404s without redirects. **`docs/Troptions-full-pack/index.html`** and **`docs/Troptions-full-pack.html`** (meta refresh + canonical to the root URL) catch stray double-segment hits. Internal `next/link` hrefs must use `/` paths only; `assetPath()` is for plain `<a>`, `fetch`, and assets.

**Build:** [`sites/investor/`](../sites/investor/) static export copied into `docs/` via [`scripts/deploy-investor-site.ps1`](../scripts/deploy-investor-site.ps1) `-CopyToDocs`. Optional Vercel/Netlify: [`sites/investor/DEPLOY.md`](../sites/investor/DEPLOY.md).

## Enable in GitHub UI

1. Open **https://github.com/FTHTrading/Troptions-full-pack/settings/pages**
2. **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`main`**
   - Folder: **`/docs`**
3. Save. First build may take 2–10 minutes.
4. Confirm **pages build and deployment** is green in Actions.
5. Site URL in settings should show: `https://fthtrading.github.io/Troptions-full-pack/`

## Custom domain (optional)

Uncomment or add in [`CNAME`](CNAME):

```
troptions.io
```

Then add DNS records at your registrar (GitHub docs: apex `A` + `www` `CNAME` to `fthtrading.github.io`).

## Local preview (optional)

```bash
cd docs
bundle install
bundle exec jekyll serve --baseurl "/Troptions-full-pack"
```

Open http://127.0.0.1:4000/Troptions-full-pack/

## Liquid glass showcase

- **Home** uses `layout: glass` — frosted panels, section nav, revenue tabs, live links, anthem player, Ask TROPTIONS panel.
- **Assets:** `assets/css/glass.css`, `assets/js/glass-site.js`, `assets/js/troptions-guide.js`, `assets/data/site-narration.json`
- **Audio tour page:** `/guide/audio-tour/`
- **Anthem catalog:** Five tracks in `#anthem` on home — Primary, Alt, Mainframe (152254), 22-years, 151853 edit (~16 MB total; manual play, no autoplay). See `assets/audio/README.md`.

### Audio tour + Q&A (static)

| Mode | How |
|------|-----|
| **Tour** | Home or Audio tour → **Play tour** (Web Speech API) |
| **Offline Q&A** | Type or mic → keyword match against `site-narration.json` FAQ |
| **Live Q&A** | Run [quickstart](deploy/quickstart.html), start donk-tutor on **8090**, then `?api=http://127.0.0.1:8090` or save API in the panel |

## Primary landing page

**Investor home:** [`docs/index.html`](index.html) (Next.js export from `sites/investor/out/`).

- [`docs/.nojekyll`](.nojekyll) — skip Jekyll; serve static HTML and `_next/` as-is.
- [`docs/404.html`](404.html) — custom not-found page with link to home.
- [`docs/Troptions-full-pack/index.html`](Troptions-full-pack/index.html) — redirect if someone uses the doubled path segment.
- Technical markdown/HTML lives under [`docs/technical/`](technical/).

## What gets published

- **Home URL** → `index.html` (single-page investor site)
- Showcase nav from `_config.yml` `header_pages` (executive + proof subpages)
- Infra pages use shared `glass.css` nav accents via `head-custom.html`
- Counterparty / investor drafts are **excluded** from nav (still in repo)
- Mermaid diagrams via `_includes/head-custom.html`

## After merge

Verify:

- Home loads glass showcase and section anchors
- Anthem **Mainframe (152254)** plays
- Ask panel answers offline FAQ (try “Is x402 on main?”)
- Run `.\scripts\truth_labels.ps1` and refresh [`proof/truth-labels.md`](proof/truth-labels.md) if labels change
