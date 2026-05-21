# GitHub Pages setup (for Bryan)

Target URL: **https://fthtrading.github.io/Troptions-full-pack/**

## Enable in GitHub UI

1. Open **https://github.com/fthtrading/Troptions-full-pack/settings/pages**
2. **Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`main`**
   - Folder: **`/docs`**
3. Save. First build may take 2–10 minutes.
4. Confirm Actions tab shows **pages build and deployment** green.

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
- **Anthem tracks:** Primary, Alt, **Mainframe (152254)** — `assets/audio/troptions-anthem-mainframe-152254.mp3` (manual play, no autoplay)

### Audio tour + Q&A (static)

| Mode | How |
|------|-----|
| **Tour** | Home or Audio tour → **Play tour** (Web Speech API) |
| **Offline Q&A** | Type or mic → keyword match against `site-narration.json` FAQ |
| **Live Q&A** | Run [quickstart](deploy/quickstart.html), start donk-tutor on **8090**, then `?api=http://127.0.0.1:8090` or save API in the panel |

## Primary landing page

**Investor home:** static [`index.html`](index.html) at repo root of `/docs`.

- GitHub Pages serves `index.html` before any Jekyll `index` when both exist at `/docs` root.
- Former glass Jekyll home: [`index.jekyll.md.bak`](index.jekyll.md.bak) (archived).
- Optional: [`docs/.nojekyll`](.nojekyll) ensures static assets and `index.html` are not overridden.

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
