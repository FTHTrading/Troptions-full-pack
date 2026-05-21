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

## What gets published

- Showcase nav from `_config.yml` `header_pages`
- Counterparty / investor drafts are **excluded** from nav (still in repo)
- Mermaid diagrams via `_includes/head-custom.html`

## After merge

Verify:

- Home maturity line matches current branch reality
- Run `.\scripts\truth_labels.ps1` and refresh [`proof/truth-labels.md`](proof/truth-labels.md) if labels change
