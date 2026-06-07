/* Draws a vector outline of India into the #india-logo badge (digital-health venture).
   Uses the same world-atlas data as the travel map. Falls back to "IN" text if offline. */
(function () {
  function draw() {
    if (typeof d3 === "undefined" || typeof topojson === "undefined") return;
    var host = document.getElementById("india-logo");
    if (!host) return;
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function (w) {
      var feats = topojson.feature(w, w.objects.countries).features;
      var india = feats.filter(function (f) {
        return String(f.id) === "356" || (f.properties && f.properties.name === "India");
      })[0];
      if (!india) return;
      var size = 54;
      host.textContent = "";
      var svg = d3.select(host).append("svg")
        .attr("viewBox", "0 0 " + size + " " + size)
        .style("width", "100%").style("height", "100%").style("display", "block");
      var proj = d3.geoMercator().fitExtent([[9, 9], [size - 9, size - 9]], india);
      svg.append("path").attr("d", d3.geoPath(proj)(india))
        .attr("fill", "#fff").attr("stroke", "rgba(0,0,0,.12)").attr("stroke-width", 0.5);
    }).catch(function () { /* keep the IN fallback */ });
  }
  if (document.readyState !== "loading") draw();
  else document.addEventListener("DOMContentLoaded", draw);
})();
