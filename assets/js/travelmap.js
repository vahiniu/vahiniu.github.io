/* Travel world map — D3 + TopoJSON vector world map with labeled pins.
   Two kinds of pin:
     • with `href`  -> solid, clickable (has a trip write-up)
     • without href -> hollow, "visited" only
   To add a place, append to `places` (label, lat, lon, and href if it has a page). */
(function () {
  var places = [
    // --- trips with write-ups (solid, clickable) ---
    { label: "San Diego",        lat: 32.72,  lon: -117.16, href: "trips/san-diego.html" },
    { label: "Lassen",           lat: 40.49,  lon: -121.51, href: "trips/lassen.html" },
    { label: "Lost Coast",       lat: 40.10,  lon: -124.07, href: "trips/lost-coast.html" },
    { label: "Sonoma/Ukiah",     lat: 39.15,  lon: -123.21, href: "trips/sonoma-ukiah.html" },
    { label: "Bend",             lat: 44.06,  lon: -121.31, href: "trips/bend-oregon.html" },
    { label: "Pacific NW",       lat: 47.80,  lon: -123.60, href: "trips/pacific-northwest.html" },
    { label: "Glacier",          lat: 48.70,  lon: -113.72, href: "trips/glacier.html" },
    { label: "Utah/Yellowstone", lat: 41.60,  lon: -110.00, href: "trips/utah-yellowstone.html" },
    { label: "Vegas & Page",     lat: 36.50,  lon: -114.50, href: "trips/vegas-page.html" },
    { label: "Hawaii",           lat: 20.80,  lon: -156.33, href: "trips/hawaii.html" },
    { label: "St. Lucia",        lat: 13.91,  lon:  -60.98, href: "trips/st-lucia.html" },
    { label: "Colombia",         lat:  5.00,  lon:  -74.00, href: "trips/colombia.html" },
    { label: "Peru",             lat: -13.20, lon:  -72.50, href: "trips/peru.html" },
    { label: "Everest BC",       lat: 28.00,  lon:   86.85, href: "trips/everest-base-camp.html" },
    { label: "Sikkim",           lat: 27.33,  lon:   88.61, href: "trips/sikkim.html" },
    // --- visited, no write-up yet (hollow) ---
    { label: "Canada",       lat: 43.65, lon:  -79.38 },
    { label: "Mexico",       lat: 19.43, lon:  -99.13 },
    { label: "France",       lat: 48.86, lon:    2.35 },
    { label: "Belgium",      lat: 50.85, lon:    4.35 },
    { label: "Netherlands",  lat: 52.37, lon:    4.90 },
    { label: "Sweden",       lat: 59.33, lon:   18.07 },
    { label: "South Korea",  lat: 37.57, lon:  126.98 }
  ];

  /* US national parks visited (green dots, hover for name).
     Add or remove entries here as you like. */
  var parks = [
    { name: "Lassen Volcanic",   lat: 40.49, lon: -121.51 },
    { name: "Redwood",           lat: 41.21, lon: -124.00 },
    { name: "Crater Lake",       lat: 42.94, lon: -122.15 },
    { name: "Mount Rainier",     lat: 46.85, lon: -121.75 },
    { name: "Olympic",           lat: 47.80, lon: -123.60 },
    { name: "Glacier",           lat: 48.70, lon: -113.72 },
    { name: "Yellowstone",       lat: 44.60, lon: -110.50 },
    { name: "Grand Teton",       lat: 43.79, lon: -110.68 },
    { name: "Arches",            lat: 38.73, lon: -109.59 },
    { name: "Canyonlands",       lat: 38.20, lon: -109.93 },
    { name: "Bryce Canyon",      lat: 37.59, lon: -112.19 },
    { name: "Grand Canyon",      lat: 36.11, lon: -112.11 },
    { name: "Hawaii Volcanoes",  lat: 19.42, lon: -155.29 },
    { name: "Haleakala",         lat: 20.72, lon: -156.17 },
    { name: "Pinnacles",         lat: 36.49, lon: -121.16 },
    { name: "Yosemite",          lat: 37.85, lon: -119.54 },
    { name: "Kings Canyon",      lat: 36.89, lon: -118.55 },
    { name: "Sequoia",           lat: 36.49, lon: -118.57 },
    { name: "Zion",              lat: 37.30, lon: -113.03 },
    { name: "Rocky Mountain",    lat: 40.34, lon: -105.68 },
    { name: "Great Sand Dunes",  lat: 37.79, lon: -105.51 },
    { name: "White Sands",       lat: 32.78, lon: -106.17 }
  ];

  function build() {
    if (typeof d3 === "undefined" || typeof topojson === "undefined") return;
    var svg = d3.select("#travelmap");
    if (svg.empty() || !svg.node()) return;
    var vb = svg.attr("viewBox").split(/\s+/).map(Number);
    var W = vb[2], H = vb[3];

    var root  = svg.append("g");
    var gMap  = root.append("g");
    var gPark = root.append("g");
    var gLink = root.append("g");
    var gPin  = root.append("g");

    var projection = d3.geoNaturalEarth1();
    var path = d3.geoPath(projection);

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function (world) {
      var land = topojson.feature(world, world.objects.countries);
      projection.fitExtent([[12, 12], [W - 12, H - 12]], land);

      gMap.append("path").datum(d3.geoGraticule10()).attr("class", "tm-graticule").attr("d", path);
      gMap.selectAll("path.tm-land").data(land.features).join("path")
        .attr("class", "tm-land").attr("d", path);

      // tooltip element (reliable hover names — native SVG <title> is slow/flaky)
      var card = svg.node().closest(".map-card") || svg.node().parentNode;
      var tip = document.createElement("div");
      tip.className = "map-tip";
      card.appendChild(tip);
      function showTip(text, e) {
        var r = card.getBoundingClientRect();
        tip.textContent = text;
        tip.style.left = (e.clientX - r.left) + "px";
        tip.style.top = (e.clientY - r.top) + "px";
        tip.classList.add("show");
      }
      function hideTip() { tip.classList.remove("show"); }

      // national parks visited — green dots; name appears on hover
      parks.forEach(function (p) { var xy = projection([p.lon, p.lat]); p.x = xy[0]; p.y = xy[1]; });
      var pk = gPark.selectAll("g.tm-park-g").data(parks).join("g").attr("class", "tm-park-g");
      pk.append("circle").attr("class", "tm-park-halo")
        .attr("cx", function (p) { return p.x; }).attr("cy", function (p) { return p.y; }).attr("r", 6);
      pk.append("circle").attr("class", "tm-park")
        .attr("cx", function (p) { return p.x; }).attr("cy", function (p) { return p.y; }).attr("r", 3.6);
      // larger transparent hit area + hover handlers
      pk.append("circle")
        .attr("cx", function (p) { return p.x; }).attr("cy", function (p) { return p.y; }).attr("r", 9)
        .attr("fill", "transparent").style("cursor", "pointer")
        .on("mousemove", function (e, p) { showTip(p.name + " National Park", e); })
        .on("mouseleave", hideTip);

      // project anchor points and seed label positions above each anchor
      places.forEach(function (p) {
        var xy = projection([p.lon, p.lat]);
        p.ax = xy[0]; p.ay = xy[1];
        p.x = xy[0];  p.y = xy[1] - 20;
        p.w = p.label.length * 6.3 + 16;
        p.h = 19;
      });

      // force layout so labels don't overlap (handles dense clusters)
      var sim = d3.forceSimulation(places)
        .force("x", d3.forceX(function (p) { return p.ax; }).strength(0.2))
        .force("y", d3.forceY(function (p) { return p.ay - 18; }).strength(0.2))
        .force("collide", d3.forceCollide(function (p) {
          return Math.max(p.h / 2, p.w * 0.5) + 4;
        }).strength(1).iterations(3))
        .stop();
      for (var i = 0; i < 500; i++) sim.tick();

      // deterministic rectangle de-overlap pass
      for (var pass = 0; pass < 120; pass++) {
        var moved = false;
        for (var a = 0; a < places.length; a++) {
          for (var b = a + 1; b < places.length; b++) {
            var p1 = places[a], p2 = places[b];
            var ox = (p1.w + p2.w) / 2 + 4 - Math.abs(p1.x - p2.x);
            var oy = (p1.h + p2.h) / 2 + 3 - Math.abs(p1.y - p2.y);
            if (ox > 0 && oy > 0) {
              moved = true;
              if (ox < oy) {
                var sx = (p1.x <= p2.x ? -1 : 1) * ox / 2;
                p1.x += sx; p2.x -= sx;
              } else {
                var sy = (p1.y <= p2.y ? -1 : 1) * oy / 2;
                p1.y += sy; p2.y -= sy;
              }
            }
          }
        }
        if (!moved) break;
      }

      // keep labels inside the frame
      places.forEach(function (p) {
        p.x = Math.max(p.w / 2 + 2, Math.min(W - p.w / 2 - 2, p.x));
        p.y = Math.max(p.h / 2 + 2, Math.min(H - p.h / 2 - 2, p.y));
      });

      gLink.selectAll("line").data(places).join("line").attr("class", "tm-leader")
        .attr("x1", function (p) { return p.ax; }).attr("y1", function (p) { return p.ay; })
        .attr("x2", function (p) { return p.x; }).attr("y2", function (p) { return p.y; });

      function draw(sel, soft) {
        sel.append("title").text(function (p) { return p.label + (soft ? " — visited" : ""); });
        sel.append("circle").attr("class", soft ? "tm-halo tm-halo-soft" : "tm-halo")
          .attr("cx", function (p) { return p.ax; }).attr("cy", function (p) { return p.ay; }).attr("r", 7);
        sel.append("circle").attr("class", soft ? "tm-marker-soft" : "tm-marker")
          .attr("cx", function (p) { return p.ax; }).attr("cy", function (p) { return p.ay; }).attr("r", 4);
        sel.append("rect").attr("class", soft ? "tm-chip tm-chip-soft" : "tm-chip")
          .attr("x", function (p) { return p.x - p.w / 2; }).attr("y", function (p) { return p.y - p.h / 2; })
          .attr("width", function (p) { return p.w; }).attr("height", function (p) { return p.h; }).attr("rx", 8);
        sel.append("text").attr("class", soft ? "tm-label tm-label-soft" : "tm-label")
          .attr("x", function (p) { return p.x; }).attr("y", function (p) { return p.y + 4; })
          .attr("text-anchor", "middle").text(function (p) { return p.label; });
      }

      var linked = places.filter(function (p) { return p.href; });
      var soft   = places.filter(function (p) { return !p.href; });

      var aPins = gPin.selectAll("a.tm-pin").data(linked).join("a")
        .attr("class", "tm-pin").attr("href", function (p) { return p.href; });
      draw(aPins, false);

      var gPins = gPin.selectAll("g.tm-pin-soft").data(soft).join("g")
        .attr("class", "tm-pin tm-pin-soft");
      draw(gPins, true);

      var zoom = d3.zoom().scaleExtent([1, 8])
        .translateExtent([[0, 0], [W, H]])
        .on("zoom", function (e) { root.attr("transform", e.transform); hideTip(); });
      svg.call(zoom);
    }).catch(function () {
      svg.append("text").attr("x", 500).attr("y", 260).attr("text-anchor", "middle")
        .attr("class", "tm-label").text("Map couldn't load — check your connection.");
    });
  }

  if (document.readyState !== "loading") build();
  else document.addEventListener("DOMContentLoaded", build);
})();
