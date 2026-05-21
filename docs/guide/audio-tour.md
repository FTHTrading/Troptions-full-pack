---
layout: glass
title: Audio tour
permalink: /guide/audio-tour/
---

<section class="glass-hero">
  <h1>Full audio description</h1>
  <p class="tagline">Structured narration of the Troptions-full-pack monorepo — static GitHub Pages with optional live DONK.</p>
</section>

<section class="glass-section">
  <div class="glass-panel" data-troptions-tour data-troptions-qa data-narration-url="{{ '/assets/data/site-narration.json' | relative_url }}" data-baseurl="{{ site.baseurl }}">
    <h2>Listen to the stack</h2>
    <p class="section-lead">Uses the browser Web Speech API. No server required on GitHub Pages.</p>
    <div class="glass-tour-controls">
      <button type="button" class="glass-btn glass-btn-primary" data-tour-play>Play tour</button>
      <button type="button" class="glass-btn glass-btn-ghost" data-tour-pause>Pause</button>
      <button type="button" class="glass-btn glass-btn-ghost" data-tour-stop>Stop</button>
    </div>
    <p data-tour-status class="glass-api-hint"></p>

    <h2 style="margin-top:2rem;">Ask about TROPTIONS</h2>
    <form class="glass-qa-form">
      <input class="glass-qa-input" type="text" placeholder="Your question" autocomplete="off" />
      <button type="button" class="glass-btn glass-btn-ghost" data-qa-mic>Mic</button>
      <button type="submit" class="glass-btn glass-btn-primary">Ask</button>
    </form>
    <div class="glass-tour-controls">
      <input class="glass-qa-input" data-api-input type="url" placeholder="http://127.0.0.1:8090" />
      <button type="button" class="glass-btn glass-btn-ghost" data-api-save>Save API</button>
    </div>
    <p class="glass-api-hint">
      Offline: keyword FAQ from <code>assets/data/site-narration.json</code> (20+ pairs).
      Live: start <a href="{{ '/deploy/quickstart.html' | relative_url }}">quickstart</a>, then
      <code>?api=http://127.0.0.1:8090</code> on this page or the <a href="{{ '/' | relative_url }}">showcase home</a>.
    </p>
    <div class="glass-chat-log" aria-live="polite"></div>

    <h3 style="margin-top:1.5rem;">Tour script (text)</h3>
    <p class="glass-honesty">The spoken tour follows the same segments as <code>site-narration.json</code> — L1, backends, frontends, revenue, proof, and live links.</p>
    <p><a class="glass-btn glass-btn-ghost" href="{{ '/' | relative_url }}">← Back to showcase</a></p>
  </div>
</section>
