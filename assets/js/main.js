// Theme toggle (persists across visits) + scroll reveal.
(function () {
  var saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeBtn");
    function sync() {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (btn) btn.textContent = dark ? "☀" : "☾";
    }
    sync();
    if (btn) btn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      sync();
    });

    // Reveal on scroll
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  });
})();
