(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var page = document.querySelector(".glass-page");
    if (!page) return;

    document.body.classList.add("glass-enabled");

    var nav = document.getElementById("glass-nav");
    var navLinks = document.getElementById("glass-nav-links");
    var toggle = document.querySelector(".glass-nav-toggle");

    if (toggle && navLinks) {
      toggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var sections = page.querySelectorAll(".glass-section[id]");
    var navAnchors = page.querySelectorAll("[data-glass-nav]");

    function setActiveNav(id) {
      navAnchors.forEach(function (a) {
        var match = a.getAttribute("data-glass-nav") === id;
        a.classList.toggle("is-active", match);
      });
    }

    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActiveNav(entry.target.id);
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (s) {
        observer.observe(s);
      });
    }

    navAnchors.forEach(function (a) {
      a.addEventListener("click", function () {
        if (navLinks) navLinks.classList.remove("is-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });

    if (nav) {
      window.addEventListener(
        "scroll",
        function () {
          nav.classList.toggle("scrolled", window.scrollY > 24);
        },
        { passive: true }
      );
    }

    document.querySelectorAll("[data-glass-tabs]").forEach(function (root) {
      var tabs = root.querySelectorAll(".glass-tab");
      var panels = root.querySelectorAll(".glass-tab-panel");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var target = tab.getAttribute("data-tab");
          tabs.forEach(function (t) {
            t.classList.toggle("is-active", t === tab);
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          panels.forEach(function (p) {
            p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
          });
        });
      });
    });

    document.querySelectorAll(".glass-card[data-href]").forEach(function (card) {
      card.style.cursor = "pointer";
      card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        var href = card.getAttribute("data-href");
        if (href) window.open(href, "_blank", "noopener,noreferrer");
      });
    });
  });

  if (!document.querySelector(".glass-page")) {
    document.body.classList.add("glass-nav-only");
  }
})();
