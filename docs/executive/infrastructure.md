---
layout: executive
title: Infrastructure
permalink: /executive/infrastructure.html
---

<div class="executive-hero glass-hero">
  <h1>Infrastructure</h1>
  <p class="tagline">For senior architects: what is production-shaped vs roadmap.</p>
</div>

<div class="glass-panel executive-panel">
  <h2>High-level topology</h2>
  <pre class="language-mermaid">flowchart TB
  subgraph public["Verified live — unykorn.org"]
    TRO[troptions.unykorn.org]
    LIVE[troptionslive / sports]
    LAUNCH[launch.unykorn.org]
    EDU[fthedu.unykorn.org]
  end
  subgraph edge["Future DNS — troptions.org"]
    AI[ai.troptions.org]
    TTN[ttn.troptions.org]
    DAO[dao.troptions.org]
  end
  subgraph core["Sovereign core — deploy when hosted"]
    L1[TROPTIONS L1]
    BE[Python backends]
  end
  public --> BE --> L1
  edge -.-> BE</pre>
</div>

<div class="glass-panel executive-panel">
  <h2>Production vs roadmap</h2>
  <table>
    <thead><tr><th>Component</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>Cloudflare / Vercel frontends (unykorn)</td><td><strong>Live</strong></td></tr>
      <tr><td>Rust L1 + RocksDB + DAO on-chain modules</td><td><strong>Shipped on main</strong>; host when ops ready</td></tr>
      <tr><td>Python backends (academy, TTN, DONK, DAO)</td><td><strong>Built</strong>; PM2/Docker; public DNS for troptions.org subdomains pending</td></tr>
      <tr><td>nginx TLS templates</td><td><strong>Template</strong> — not deployed until DNS pointed</td></tr>
      <tr><td>BFT validators / live fraud proofs</td><td><strong>Roadmap</strong> (Q4 2026 design track)</td></tr>
      <tr><td>x402 / Apostle full integration</td><td><strong>Feature branch</strong>, not main</td></tr>
    </tbody>
  </table>
  <p>Maturity <strong>9.0 / 10</strong> on <code>main</code> reflects engineering checklist—not claim that every hostname resolves.</p>
</div>

<div class="glass-panel executive-panel">
  <h2>Domain discipline</h2>
  <p>Canonical hostname status: <a href="{{ '/DOMAIN_TRUTH_TABLE.html' | relative_url }}">DOMAIN_TRUTH_TABLE.md</a>. Do not cite <code>ai.troptions.org</code> or <code>ttn.troptions.org</code> as live until DNS verification passes.</p>
</div>

<details class="glass-engineers">
  <summary>For engineers — ports &amp; deep links</summary>
  <p>L1 RPC 9944 · donk 8090 · academy 8091 · TTN 8092 · DAO 8093 · nginx 443</p>
  <p><a href="{{ '/infrastructure/l1.html' | relative_url }}">L1 spec</a> · <a href="{{ '/infrastructure/backends.html' | relative_url }}">Backends</a> · <a href="{{ '/deploy/production-checklist.html' | relative_url }}">Production checklist</a> · <a href="{{ '/DEPLOY_PRODUCTION.html' | relative_url }}">Deploy production</a></p>
</details>
