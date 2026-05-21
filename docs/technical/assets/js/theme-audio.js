document.addEventListener("DOMContentLoaded", function () {
  var section = document.querySelector(".troptions-theme-audio");
  if (!section) return;

  var audio = section.querySelector("audio");
  var playBtn = section.querySelector(".theme-play-btn");
  var trackBtns = section.querySelectorAll(".theme-track-btn");
  if (!audio || !playBtn) return;

  function activeSrc() {
    var active = section.querySelector(".theme-track-btn.is-active");
    return active ? active.getAttribute("data-src") : audio.getAttribute("src");
  }

  function setPlayLabel() {
    var playing = !audio.paused;
    playBtn.textContent = playing ? "Pause" : "Play";
    playBtn.setAttribute("aria-pressed", playing ? "true" : "false");
  }

  playBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", setPlayLabel);
  audio.addEventListener("pause", setPlayLabel);
  audio.addEventListener("ended", setPlayLabel);

  trackBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-src");
      if (!src || btn.classList.contains("is-active")) return;

      var wasPlaying = !audio.paused;
      audio.pause();
      audio.src = src;
      audio.load();
      trackBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      if (wasPlaying) {
        audio.play();
      }
    });
  });
});
