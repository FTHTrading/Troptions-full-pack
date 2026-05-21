---
layout: glass
title: Showcase
permalink: /
---

<div class="glass-hero" id="top">
  <picture>
    <source srcset="{{ '/assets/images/troptions-logo-primary.webp' | relative_url }}" type="image/webp">
    <img class="glass-hero-logo" src="{{ '/assets/images/troptions-logo-primary.png' | relative_url }}" alt="TROPTIONS" width="420" height="358" />
  </picture>
  <h1>Sovereign Stack Showcase</h1>
  <p class="tagline">Operating company and open infrastructure — education, broadcast, governance, and exchange on a sovereign L1. Honest labels; no false BFT claims.</p>
  <p class="glass-badge"><span class="dot" aria-hidden="true"></span> Maturity <strong>9.0 / 10</strong> on <code>main</code></p>
</div>

<section class="glass-section" id="what">
  <div class="glass-panel">
    <h2>What is TROPTIONS</h2>
    <p class="section-lead">Plain English map of the operating co and the repo you can clone today.</p>
    <div class="glass-grid">
      <div class="glass-card">
        <h3>Operating company</h3>
        <p>Domains, FTH Academy, TTN broadcast, Exchange OS surfaces, and partner programs (Avid configure, T-Lev-8 deal room) — brand and GTM live alongside engineering.</p>
      </div>
      <div class="glass-card">
        <h3>Sovereign stack</h3>
        <p><strong>Troptions-full-pack</strong> ships Rust L1, Python backends, frontends, contracts, Docker/nginx templates, and truth-label scripts in one monorepo.</p>
      </div>
      <div class="glass-card">
        <h3>Who it is for</h3>
        <p>Developers integrating APIs; investors needing an honest LIVE vs ROADMAP map; operators running TLS, API keys, and L1 governance before DNS cutover.</p>
      </div>
      <div class="glass-card">
        <h3>What it is not</h3>
        <p>Not BFT multi-validator consensus on <code>main</code>. Not merged public x402 — see <code>feature/x402-full-integration</code> separately.</p>
      </div>
    </div>
  </div>
</section>

<section class="glass-section" id="stack">
  <div class="glass-panel">
    <h2>The stack</h2>
    <p class="section-lead">Layers, ports, and doc deep-links.</p>
    <div class="glass-table-wrap">
      <table>
        <thead>
          <tr><th>Layer</th><th>Role</th><th>Port</th><th>Docs</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>L1 node</strong></td><td>Sovereign sequencer, RocksDB, on-chain DAO/treasury, signed submit RPC</td><td>9944 / 9945</td><td><a href="{{ '/infrastructure/l1.html' | relative_url }}">L1</a></td></tr>
          <tr><td><strong>nginx edge</strong></td><td>TLS termination, path routing</td><td>443</td><td><a href="{{ '/deploy/production-checklist.html' | relative_url }}">Production</a></td></tr>
          <tr><td><strong>fth-academy</strong></td><td>Courses, Stripe, DAO helpers</td><td>8091</td><td><a href="{{ '/infrastructure/backends.html' | relative_url }}">Backends</a></td></tr>
          <tr><td><strong>ttn-launcher</strong></td><td>TTN channels / namespaces</td><td>8092</td><td><a href="{{ '/infrastructure/backends.html' | relative_url }}">Backends</a></td></tr>
          <tr><td><strong>donk-tutor</strong></td><td>AI tutor (live Q&amp;A optional)</td><td>8090</td><td><a href="{{ '/deploy/quickstart.html' | relative_url }}">Quickstart</a></td></tr>
          <tr><td><strong>dao-service</strong></td><td>DAO API, WebSocket, settlement gateway</td><td>8093</td><td><a href="{{ '/infrastructure/backends.html' | relative_url }}">Backends</a></td></tr>
          <tr><td><strong>Frontends</strong></td><td>exchange-os, fth-edu, dao-dashboard</td><td>via nginx</td><td><a href="{{ '/infrastructure/frontends.html' | relative_url }}">Frontends</a></td></tr>
        </tbody>
      </table>
    </div>
    <pre class="language-mermaid">flowchart TB
  subgraph fe["Frontends"]
    EX[exchange-os]
    EDU[fth-edu]
    DAO_UI[dao-dashboard]
  end
  subgraph be["Backends"]
    FTH[fth-academy :8091]
    TTN[ttn-launcher :8092]
    DONK[donk-tutor :8090]
    DAO[dao-service :8093]
  end
  subgraph l1["TROPTIONS L1 :9944"]
    SEQ[Sovereign Sequencer]
    GOV[DAO + treasury]
  end
  fe --> be --> l1</pre>
  </div>
</section>

<section class="glass-section" id="revenue">
  <div class="glass-panel" data-glass-tabs>
    <h2>Revenue &amp; monetization</h2>
    <p class="section-lead">Honest map — built vs billing vs mainnet-gated.</p>
    <div class="glass-tabs" role="tablist">
      <button type="button" class="glass-tab is-active" data-tab="edu" aria-selected="true">Education</button>
      <button type="button" class="glass-tab" data-tab="media">TTN / Sports</button>
      <button type="button" class="glass-tab" data-tab="exchange">Exchange</button>
      <button type="button" class="glass-tab" data-tab="tokens">Tokens</button>
      <button type="button" class="glass-tab" data-tab="other">DAO / RWA / AI</button>
    </div>
    <div class="glass-tab-panel is-active" data-panel="edu">
      <p><strong>FTH Academy</strong> — <a href="https://fthedu.unykorn.org/" target="_blank" rel="noopener">fthedu.unykorn.org</a> · Stripe tiers (free / $19 / $49 / $149 mo patterns). Backend <code>fth-academy :8091</code>.</p>
    </div>
    <div class="glass-tab-panel" data-panel="media">
      <p><strong>TTN channels / namespaces / sponsors</strong> — <a href="https://troptionslive.unykorn.org/sports" target="_blank" rel="noopener">troptionslive sports</a> · WC26 sponsorship tiers ($500 / $2.5K / $10K mo) — pipeline until contracts + venue QR.</p>
    </div>
    <div class="glass-tab-panel" data-panel="exchange">
      <p><strong>Exchange OS / XRPL trade desk</strong> — x402, launch, swap modules. UI may cite large desk figures — treat as <strong>operator attestation</strong> until XRPL/mainnet proofs. Testnet today; mainnet flag gated.</p>
      <p class="glass-honesty">Anthem / brand line “$175M” is narrative — verify via <a href="{{ '/proof/truth-labels.html' | relative_url }}">truth labels</a> and on-chain proof docs.</p>
    </div>
    <div class="glass-tab-panel" data-panel="tokens">
      <p><strong>Token launcher</strong> — <a href="https://launch.unykorn.org/" target="_blank" rel="noopener">launch.unykorn.org</a> (Solana SaaS).</p>
      <p><strong>Polygon KENNY / EVL</strong> — community tokens on mainnet (see truth labels for contract refs).</p>
    </div>
    <div class="glass-tab-panel" data-panel="other">
      <p><strong>DAO governance fees</strong> — on optional ATP / x402 branch (not <code>main</code>).</p>
      <p><strong>RWA / T-Lev-8 deal room</strong> — <a href="https://fthtrading.github.io/T-Lev-8-/" target="_blank" rel="noopener">T-Lev-8 Pages</a> · contracts in <a href="https://github.com/FTHTrading/rwa-realestate" target="_blank" rel="noopener">rwa-realestate</a>.</p>
      <p><strong>NEED AI / phone</strong> — optional Telnyx + Stripe branch (<code>frontends/needai</code>).</p>
    </div>
  </div>
</section>

<section class="glass-section" id="live">
  <div class="glass-panel">
    <h2>Live systems</h2>
    <p class="section-lead">Opens in a new tab — verify each property before external claims.</p>
    <div class="glass-live-grid">
      <a class="glass-btn glass-btn-primary" href="https://troptions.unykorn.org/troptions" target="_blank" rel="noopener">troptions.unykorn.org</a>
      <a class="glass-btn glass-btn-primary" href="https://troptionslive.unykorn.org/sports" target="_blank" rel="noopener">Sports / WC26</a>
      <a class="glass-btn glass-btn-primary" href="https://launch.unykorn.org/" target="_blank" rel="noopener">Token launcher</a>
      <a class="glass-btn glass-btn-ghost" href="https://fthtrading.github.io/T-Lev-8-/" target="_blank" rel="noopener">T-Lev-8 deal room</a>
      <a class="glass-btn glass-btn-ghost" href="https://fthtrading.github.io/Troptions-full-pack/" target="_blank" rel="noopener">This docs site</a>
      <a class="glass-btn glass-btn-ghost" href="https://fthedu.unykorn.org/" target="_blank" rel="noopener">fthedu.unykorn.org</a>
      <a class="glass-btn glass-btn-ghost" href="https://ai.troptions.org/" target="_blank" rel="noopener">ai.troptions.org</a>
      <a class="glass-btn glass-btn-ghost" href="https://ttn.troptions.org/" target="_blank" rel="noopener">ttn.troptions.org</a>
    </div>
  </div>
</section>

<section class="glass-section" id="proof">
  <div class="glass-panel">
    <h2>Proof &amp; maturity</h2>
    <p class="section-lead">9.0 checklist on <code>main</code> — run scripts before you publish new claims.</p>
    <ul class="glass-checklist">
      <li>TLS templates — <code>docker/nginx/</code></li>
      <li>API key auth — <code>backend/shared/auth.py</code></li>
      <li>DAO direct L1 reads + signed submit RPC</li>
      <li>Sovereign Sequencer documented (not BFT)</li>
      <li class="pending">TLS public DNS / certbot (ops)</li>
      <li class="pending">Fraud proofs live (Q4 2026 design)</li>
    </ul>
    <p><a class="glass-btn glass-btn-primary" href="{{ '/proof/truth-labels.html' | relative_url }}">Truth labels</a>
    <a class="glass-btn glass-btn-ghost" href="{{ '/deploy/quickstart.html' | relative_url }}">Deploy quickstart</a></p>
    <p class="glass-honesty">Re-run <code>.\scripts\truth_labels.ps1</code> and <code>.\scripts\verify-9-production.ps1</code> before investor-facing updates.</p>
  </div>
</section>

<section class="glass-section" id="anthem">
  <div class="glass-panel troptions-theme-audio" aria-labelledby="troptions-theme-heading">
    <h2 id="troptions-theme-heading">TROPTIONS anthem</h2>
    <p class="theme-caption">Mainframe Explode — proprietary FTH Trading. Manual play only.</p>
    <div class="theme-player" role="group" aria-label="Theme audio controls">
      <div class="theme-track-select">
        <button type="button" class="theme-track-btn is-active" data-src="{{ '/assets/audio/troptions-theme-primary.mp3' | relative_url }}" aria-pressed="true">Primary</button>
        <button type="button" class="theme-track-btn" data-src="{{ '/assets/audio/troptions-theme-alt.mp3' | relative_url }}" aria-pressed="false">Alt</button>
        <button type="button" class="theme-track-btn" data-src="{{ '/assets/audio/troptions-anthem-mainframe-152254.mp3' | relative_url }}" aria-pressed="false">Mainframe (152254)</button>
      </div>
      <button type="button" class="theme-play-btn" aria-pressed="false">Play</button>
      <audio preload="metadata" src="{{ '/assets/audio/troptions-theme-primary.mp3' | relative_url }}"></audio>
    </div>
    <details class="theme-lyrics">
      <summary>View lyrics</summary>
      <div class="theme-lyrics-body">
        <p class="theme-lyrics-lead"><strong>Mainframe Explode</strong> — <a href="{{ '/media/anthem.html' | relative_url }}">full lyrics</a></p>
        <p>Yeah! (ATL!) · TROPTIONS! (Macon!) · From Rust L1 to the chain…</p>
        <p class="theme-lyrics-footnote"><strong>Honesty:</strong> $175M and agent names in lyrics are brand narrative / optional branches — not automatic <code>main</code> production claims.</p>
      </div>
    </details>
  </div>
</section>

<section class="glass-section" id="guide">
  <div class="glass-panel" data-troptions-tour data-troptions-qa data-narration-url="{{ '/assets/data/site-narration.json' | relative_url }}" data-baseurl="{{ site.baseurl }}">
    <h2>Ask TROPTIONS</h2>
    <p class="section-lead">Audio tour + offline FAQ. Optional live DONK on port 8090.</p>
    <div class="glass-guide">
      <div>
        <h3>Listen to the stack</h3>
        <p>Web Speech API reads the monorepo tour (~2–3 min).</p>
        <div class="glass-tour-controls">
          <button type="button" class="glass-btn glass-btn-primary" data-tour-play>Play tour</button>
          <button type="button" class="glass-btn glass-btn-ghost" data-tour-pause>Pause</button>
          <button type="button" class="glass-btn glass-btn-ghost" data-tour-stop>Stop</button>
        </div>
        <p data-tour-status class="glass-api-hint"></p>
      </div>
      <div>
        <h3>Ask about TROPTIONS</h3>
        <form class="glass-qa-form">
          <input class="glass-qa-input" type="text" placeholder="e.g. Is x402 on main?" autocomplete="off" />
          <button type="button" class="glass-btn glass-btn-ghost" data-qa-mic>Mic</button>
          <button type="submit" class="glass-btn glass-btn-primary">Ask</button>
        </form>
        <div class="glass-tour-controls">
          <input class="glass-qa-input" data-api-input type="url" placeholder="http://127.0.0.1:8090" />
          <button type="button" class="glass-btn glass-btn-ghost" data-api-save>Save API</button>
        </div>
        <p class="glass-api-hint">Live mode: run <a href="{{ '/deploy/quickstart.html' | relative_url }}">quickstart</a>, then <code>?api=http://127.0.0.1:8090</code> or save API above (POST <code>/chat</code>).</p>
        <div class="glass-chat-log" aria-live="polite"></div>
      </div>
    </div>
    <p><a class="glass-btn glass-btn-ghost" href="{{ '/guide/audio-tour.html' | relative_url }}">Full audio description page</a></p>
  </div>
</section>

<section class="glass-section" id="tlev8">
  <div class="glass-panel">
    <h2>T-LEV-8 deal room</h2>
    <p class="section-lead">Partner governance, LEV8 pipeline, and RWA execution — separate repo, linked here for revenue context.</p>
    <div class="glass-grid">
      <div class="glass-card" data-href="https://fthtrading.github.io/T-Lev-8-/">
        <h3>Deal room UI</h3>
        <p>GitHub Pages control plane: gates, conditions precedent, and protocol governor modes (SOLO_LAUNCH default until partner gates clear).</p>
        <span class="glass-btn glass-btn-ghost">Open deal room →</span>
      </div>
      <div class="glass-card">
        <h3>Governance gates</h3>
        <p>Algorithmic modes: 7/7 gates → PARTNER_EXECUTE; 5–6 → negotiate; 3–4 → hold; else SOLO_LAUNCH. Compliance tracks G1–G8 — counsel review required.</p>
      </div>
      <div class="glass-card" data-href="https://github.com/FTHTrading/rwa-realestate">
        <h3>Smart contracts</h3>
        <p>Implementation in <strong>rwa-realestate</strong> — TLEV8GateManager, FTHEnforcer kill switch, compliance registry extensions (paraphrased from T-Lev-8 README).</p>
        <span class="glass-btn glass-btn-ghost">Contracts repo →</span>
      </div>
    </div>
    <p class="glass-honesty">No secrets or internal-only negotiation docs on this public site — see T-Lev-8 repo for operational detail.</p>
  </div>
</section>

