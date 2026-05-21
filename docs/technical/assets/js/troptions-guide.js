/**
 * TROPTIONS Glass guide — offline FAQ + optional live DONK at http://127.0.0.1:8090
 * Never embed Cloudflare, Telnyx, or ElevenLabs keys in this file or any static JS.
 */
(function () {
  "use strict";

  var DEFAULT_LIVE_API = "http://127.0.0.1:8090";
  var NARRATION_URL = null;
  var narrationData = null;
  var synth = window.speechSynthesis;
  var tourIndex = 0;
  var tourPlaying = false;
  var tourUtterances = [];

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function resolveNarrationUrl() {
    var el = document.querySelector("[data-narration-url]");
    if (el) return el.getAttribute("data-narration-url");
    var root = document.querySelector("[data-baseurl]");
    var base = root ? root.getAttribute("data-baseurl") || "" : "";
    return (base + "/assets/data/site-narration.json").replace(/\/+/g, "/");
  }

  function getApiBase() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("api")) return params.get("api").replace(/\/$/, "");
    try {
      var stored = localStorage.getItem("troptions_guide_api");
      if (stored) return stored.replace(/\/$/, "");
    } catch (e) {}
    return null;
  }

  function setApiBase(url) {
    try {
      if (url) localStorage.setItem("troptions_guide_api", url);
      else localStorage.removeItem("troptions_guide_api");
    } catch (e) {}
  }

  function loadNarration() {
    if (narrationData) return Promise.resolve(narrationData);
    NARRATION_URL = resolveNarrationUrl();
    return fetch(NARRATION_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("narration load failed");
        return r.json();
      })
      .then(function (data) {
        narrationData = data;
        return data;
      });
  }

  function appendBubble(log, text, role, meta) {
    if (!log) return;
    var div = document.createElement("div");
    div.className = "glass-bubble glass-bubble-" + (role === "user" ? "user" : "bot");
    div.textContent = text;
    if (meta) {
      var m = document.createElement("div");
      m.className = "glass-bubble-meta";
      m.textContent = meta;
      div.appendChild(m);
    }
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function matchFaq(question) {
    if (!narrationData || !narrationData.faq) return null;
    var q = question.toLowerCase();
    var words = q.split(/\W+/).filter(Boolean);
    var best = null;
    var bestScore = 0;

    narrationData.faq.forEach(function (item) {
      var score = 0;
      (item.keywords || []).forEach(function (kw) {
        if (q.indexOf(kw.toLowerCase()) !== -1) score += 3;
        words.forEach(function (w) {
          if (w.length > 2 && kw.toLowerCase().indexOf(w) !== -1) score += 1;
        });
      });
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });

    if (bestScore >= 2) return best.answer;
    return null;
  }

  function askLive(apiBase, question, log) {
    appendBubble(log, "Thinking…", "bot", "Live · " + apiBase);
    var chatUrl = apiBase + "/chat";
    var body = { message: question, voice: false };

    return fetch(chatUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var answer = data.reply || data.response || data.message || data.answer || JSON.stringify(data);
        log.removeChild(log.lastChild);
        appendBubble(log, answer, "bot", "Live · DONK");
      })
      .catch(function () {
        log.removeChild(log.lastChild);
        var offline = matchFaq(question);
        appendBubble(
          log,
          offline ||
            "Live API unreachable. Run deploy quickstart, configure .env (see docs/deploy/secrets-setup), start donk-tutor, then set API to " +
              DEFAULT_LIVE_API +
              " — or use offline FAQ mode.",
          "bot",
          "Fallback"
        );
      });
  }

  function askQuestion(question, log) {
    if (!question.trim()) return;
    appendBubble(log, question, "user");
    var api = getApiBase();
    if (api) {
      askLive(api, question, log);
      return;
    }
    loadNarration().then(function () {
      var ans = matchFaq(question);
      appendBubble(
        log,
        ans ||
          "No FAQ match. Try keywords: L1, DAO, x402, revenue, launch, sports, KENNY, maturity, Avid, deploy. For live AI: ?api=" +
            DEFAULT_LIVE_API +
            " (DONK with .env — no provider keys in the browser)",
        "bot",
        "Offline FAQ"
      );
    });
  }

  function stopTour() {
    tourPlaying = false;
    if (synth) synth.cancel();
    tourUtterances = [];
    tourIndex = 0;
  }

  function speakSegment(text, onEnd) {
    if (!synth) {
      onEnd();
      return;
    }
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = onEnd;
    u.onerror = onEnd;
    synth.speak(u);
  }

  function playTour(statusEl) {
    loadNarration().then(function (data) {
      if (!synth) {
        if (statusEl) statusEl.textContent = "Speech synthesis not supported in this browser.";
        return;
      }
      stopTour();
      tourPlaying = true;
      var segments = data.tourSegments || [];
      if (statusEl) statusEl.textContent = "Playing tour…";

      function next(i) {
        if (!tourPlaying || i >= segments.length) {
          tourPlaying = false;
          if (statusEl) statusEl.textContent = "Tour finished.";
          return;
        }
        tourIndex = i;
        if (statusEl) statusEl.textContent = "Segment " + (i + 1) + " of " + segments.length;
        speakSegment(segments[i].text, function () {
          next(i + 1);
        });
      }
      next(0);
    });
  }

  function pauseTour() {
    if (synth) synth.pause();
    tourPlaying = false;
  }

  function resumeTour(statusEl) {
    if (synth && synth.paused) {
      tourPlaying = true;
      synth.resume();
      if (statusEl) statusEl.textContent = "Resumed.";
    }
  }

  function initTour(root) {
    var playBtn = root.querySelector("[data-tour-play]");
    var pauseBtn = root.querySelector("[data-tour-pause]");
    var stopBtn = root.querySelector("[data-tour-stop]");
    var statusEl = root.querySelector("[data-tour-status]");

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        if (synth && synth.paused) resumeTour(statusEl);
        else playTour(statusEl);
      });
    }
    if (pauseBtn) pauseBtn.addEventListener("click", pauseTour);
    if (stopBtn) {
      stopBtn.addEventListener("click", function () {
        stopTour();
        if (statusEl) statusEl.textContent = "Stopped.";
      });
    }

    if (!synth && statusEl) {
      statusEl.textContent = "Web Speech API unavailable — read FAQ or enable live API.";
    }
  }

  function initQa(root) {
    var form = root.querySelector(".glass-qa-form");
    var input = root.querySelector(".glass-qa-input");
    var micBtn = root.querySelector("[data-qa-mic]");
    var log = root.querySelector(".glass-chat-log");
    var apiInput = root.querySelector("[data-api-input]");
    var apiSave = root.querySelector("[data-api-save]");

    if (apiInput) apiInput.value = getApiBase() || "";

    if (apiSave && apiInput) {
      apiSave.addEventListener("click", function () {
        setApiBase(apiInput.value.trim() || null);
        appendBubble(log, "API base saved: " + (getApiBase() || "(cleared — offline FAQ)"), "bot");
      });
    }

    if (form && input) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = input.value.trim();
        if (!q) return;
        askQuestion(q, log);
        input.value = "";
      });
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (micBtn && SpeechRecognition) {
      var rec = new SpeechRecognition();
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      micBtn.addEventListener("click", function () {
        try {
          rec.start();
          micBtn.textContent = "Listening…";
        } catch (err) {
          appendBubble(log, "Mic unavailable.", "bot");
        }
      });
      rec.onresult = function (ev) {
        micBtn.textContent = "Mic";
        var text = ev.results[0][0].transcript;
        if (input) input.value = text;
        askQuestion(text, log);
      };
      rec.onend = function () {
        micBtn.textContent = "Mic";
      };
      rec.onerror = function () {
        micBtn.textContent = "Mic";
      };
    } else if (micBtn) {
      micBtn.disabled = true;
      micBtn.title = "Speech recognition not supported";
    }

    loadNarration().then(function (data) {
      if (!log || !data.faq) return;
      appendBubble(
        log,
        "Ask about TROPTIONS (offline FAQ). Try: What is the L1? How does revenue work? Is x402 on main?",
        "bot",
        data.tourDurationHint || ""
      );
    });
  }

  ready(function () {
    document.querySelectorAll("[data-troptions-tour]").forEach(initTour);
    document.querySelectorAll("[data-troptions-qa]").forEach(initQa);
  });
})();
