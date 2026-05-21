#!/usr/bin/env python3
"""Convert docs/technical/*.md (with permalink) to static HTML for GitHub Pages (.nojekyll)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
TECH = ROOT / "docs" / "technical"
PAGES_BASE = "https://fthtrading.github.io/Troptions-full-pack"
CSS_HREF = "../downloads/print-shared.css"

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <link rel="stylesheet" href="{css}" />
  <style>
    .site-nav {{ margin-bottom: 1.5rem; font-size: 0.9rem; }}
    .site-nav a {{ color: var(--gold-light, #d4af37); margin-right: 1rem; }}
    .md-body table {{ width: 100%; border-collapse: collapse; margin: 1rem 0; }}
    .md-body th, .md-body td {{ border: 1px solid #333; padding: 0.4rem 0.6rem; text-align: left; }}
    .md-body code {{ background: #1a1f26; padding: 0.1rem 0.35rem; border-radius: 3px; }}
    .md-body pre {{ background: #1a1f26; padding: 1rem; overflow-x: auto; }}
  </style>
</head>
<body>
  <nav class="site-nav no-print">
    <a href="{home}">← Investor showcase</a>
    <a href="{hub}">Technical index</a>
    <a href="{repo}">GitHub repo</a>
  </nav>
  <header class="doc-header">
    <h1>{title}</h1>
    <p class="tagline">TROPTIONS technical — static export for GitHub Pages</p>
  </header>
  <div class="md-body">
{body}
  </div>
  <p style="font-size:0.8rem;color:var(--muted);margin-top:2rem">{canonical}</p>
</body>
</html>
"""


def parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    meta: dict[str, str] = {}
    for line in parts[1].strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, parts[2].lstrip("\n")


def md_link_to_html(html: str) -> str:
    def repl(m: re.Match[str]) -> str:
        href = m.group(1)
        if href.startswith(("http://", "https://", "mailto:", "#")):
            return m.group(0)
        if href.endswith(".md"):
            href = href[:-3] + ".html"
        return f'href="{href}"'

    return re.sub(r'href="([^"]+)"', repl, html)


def output_path_for_permalink(permalink: str) -> Path | None:
    p = permalink.strip().rstrip("/")
    if not p.endswith(".html"):
        return None
    rel = p.lstrip("/")
    if rel.startswith("technical/"):
        return TECH / rel[len("technical/") :]
    if "/" not in rel:
        return TECH / rel
    return None


def collect_md_targets() -> list[tuple[Path, Path, str, str]]:
    out: list[tuple[Path, Path, str, str]] = []
    for md in TECH.rglob("*.md"):
        if "_includes" in md.parts or "_layouts" in md.parts:
            continue
        raw = md.read_text(encoding="utf-8-sig")
        meta, body = parse_front_matter(raw)
        permalink = meta.get("permalink", "")
        if not permalink:
            continue
        dest = output_path_for_permalink(permalink)
        if dest is None:
            continue
        title = meta.get("title", md.stem.replace("_", " "))
        out.append((md, dest, title, permalink))
    return out


def render_md(md_path: Path, dest: Path, title: str, permalink: str) -> str:
    raw = md_path.read_text(encoding="utf-8-sig")
    _, body = parse_front_matter(raw)
    rel = dest.relative_to(ROOT / "docs")
    depth = max(len(rel.parts) - 1, 1)
    css = "../" * depth + "downloads/print-shared.css"
    html_body = markdown.markdown(
        body,
        extensions=["tables", "fenced_code", "nl2br", "sane_lists"],
    )
    html_body = md_link_to_html(html_body)
    canonical = f"{PAGES_BASE}{permalink if permalink.startswith('/') else '/' + permalink}"
    return TEMPLATE.format(
        title=title,
        css=css,
        home=f"{PAGES_BASE}/",
        hub=f"{PAGES_BASE}/technical/index.html",
        repo="https://github.com/FTHTrading/Troptions-full-pack",
        body=html_body,
        canonical=canonical,
    )


def main() -> int:
    targets = collect_md_targets()
    generated = 0
    for md_path, dest, title, permalink in targets:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(render_md(md_path, dest, title, permalink), encoding="utf-8")
        generated += 1
        print(f"  {dest.relative_to(ROOT)}")
    print(f"Generated {generated} HTML files from markdown.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
