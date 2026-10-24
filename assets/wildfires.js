/* Wildfire data page. Reads public data from NIFC (ArcGIS) and FEMA (OpenFEMA) in the visitor's browser. */
(function () {
  var NIFC = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/";
  var INCIDENTS = NIFC + "WFIGS_Incident_Locations_Current/FeatureServer/0/query";
  var PERIMETERS = NIFC + "WFIGS_Interagency_Perimeters_YearToDate/FeatureServer/0/query";
  var FEMA_DECL = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries";
  var FEMA_SUM = "https://www.fema.gov/api/open/v1/FemaWebDisasterSummaries";

  var STATES = { AL:"Alabama", AK:"Alaska", AZ:"Arizona", AR:"Arkansas", CA:"California", CO:"Colorado", CT:"Connecticut", DE:"Delaware", DC:"District of Columbia", FL:"Florida", GA:"Georgia", HI:"Hawaii", ID:"Idaho", IL:"Illinois", IN:"Indiana", IA:"Iowa", KS:"Kansas", KY:"Kentucky", LA:"Louisiana", ME:"Maine", MD:"Maryland", MA:"Massachusetts", MI:"Michigan", MN:"Minnesota", MS:"Mississippi", MO:"Missouri", MT:"Montana", NE:"Nebraska", NV:"Nevada", NH:"New Hampshire", NJ:"New Jersey", NM:"New Mexico", NY:"New York", NC:"North Carolina", ND:"North Dakota", OH:"Ohio", OK:"Oklahoma", OR:"Oregon", PA:"Pennsylvania", RI:"Rhode Island", SC:"South Carolina", SD:"South Dakota", TN:"Tennessee", TX:"Texas", UT:"Utah", VT:"Vermont", VA:"Virginia", WA:"Washington", WV:"West Virginia", WI:"Wisconsin", WY:"Wyoming", PR:"Puerto Rico", GU:"Guam", VI:"U.S. Virgin Islands", AS:"American Samoa", MP:"Northern Mariana Islands" };
  var YEAR = new Date().getFullYear();

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function num(n) { return Math.round(n).toLocaleString("en-US"); }
  function day(ms, utc) { return ms ? new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: utc ? "UTC" : undefined }) : "Not reported"; }
  function stamp(ms) { return new Date(ms).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }); }
  function st(code) { return String(code || "").replace(/^US-/, ""); }
  function money(n) {
    if (n == null) return "Not reported";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + " billion";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + " million";
    return "$" + Math.round(n).toLocaleString("en-US");
  }
  function fail(el, msg) { if (el) el.innerHTML = '<div class="empty">' + msg + "</div>"; }
  function getJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }).then(function (j) { if (j && j.error) throw new Error(j.error.message || "service error"); return j; });
  }
  function q(base, params) {
    return base + "?" + Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
  }

  /* ---------- 1. current incidents ---------- */
  var incidents = [], retrievedAt = 0, usMap = null;

  function loadIncidents() {
    var url = q(INCIDENTS, {
      where: "IncidentTypeCategory='WF'",
      outFields: "IncidentName,IncidentSize,PercentContained,POOState,POOCounty,FireDiscoveryDateTime,ModifiedOnDateTime_dt",
      returnGeometry: "true", outSR: "4326", resultRecordCount: "2000", f: "json"
    });
    return getJSON(url).then(function (j) {
      incidents = (j.features || []).map(function (f) {
        var a = f.attributes;
        return { name: a.IncidentName, acres: a.IncidentSize, pct: a.PercentContained, state: st(a.POOState), county: a.POOCounty, found: a.FireDiscoveryDateTime, mod: a.ModifiedOnDateTime_dt, x: f.geometry && f.geometry.x, y: f.geometry && f.geometry.y };
      });
      retrievedAt = Date.now();
      drawIncidents();
    }).catch(function () {
      fail($("now-summary"), "The current-incident data from NIFC could not be loaded. Try again later, or see <a href=\"https://nifc.gov/fire-information/nfn\">NIFC National Fire News</a>.");
    });
  }

  function shown() {
    var all = $("show-contained").checked;
    return incidents.filter(function (d) { return all || d.pct == null || d.pct < 100; });
  }
  function colorFor(d) { return d.pct == null ? "none" : d.pct < 50 ? "#C8341A" : d.pct < 100 ? "#F0A92A" : "#8A7B73"; }

  function drawIncidents() {
    var rows = shown();
    var acres = rows.reduce(function (s, d) { return s + (d.acres || 0); }, 0);
    var states = {}; rows.forEach(function (d) { states[d.state] = 1; });
    var noSize = rows.filter(function (d) { return d.acres == null; }).length;
    var latest = incidents.reduce(function (m, d) { return d.mod && d.mod > m ? d.mod : m; }, 0);
    $("now-summary").innerHTML = "<strong>" + num(rows.length) + "</strong> incidents shown in " + num(Object.keys(states).length) + " states, with <strong>" + num(acres) + "</strong> acres reported" +
      (noSize ? " (" + num(noSize) + " have no size reported yet)" : "") + ".";
    $("now-source").innerHTML = "Source: NIFC, WFIGS Current Wildland Fire Incident Locations (wildfires only). Retrieved " + esc(stamp(retrievedAt)) + ". Most recent record update in the feed: " + (latest ? esc(stamp(latest)) : "not reported") + ". Sizes and containment are the latest figures reported by incident managers and may be estimates.";

    var tb = document.querySelector("#incident-table tbody");
    var top = rows.slice().sort(function (a, b) { return (b.acres || 0) - (a.acres || 0); }).slice(0, 15);
    tb.innerHTML = top.length ? top.map(function (d) {
      return "<tr><td>" + esc(d.name) + "</td><td>" + esc(d.state) + "</td><td>" + esc(d.county || "Not reported") + '</td><td class="num">' + (d.acres == null ? "Not reported" : num(d.acres)) +
        '</td><td class="num">' + (d.pct == null ? "Not reported" : Math.round(d.pct) + "%") + "</td><td>" + day(d.found) + "</td></tr>";
    }).join("") : '<tr><td colspan="6">No incidents match the current setting.</td></tr>';
    drawMap(rows);
  }

  function drawMap(rows) {
    var host = $("map");
    if (!usMap) { host.innerHTML = '<div class="empty">Loading map.</div>'; return; }
    var proj = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
    var svg = d3.create("svg").attr("viewBox", "0 0 975 610").attr("class", "usmap");
    svg.append("g").selectAll("path").data(usMap.states).join("path").attr("d", d3.geoPath()).attr("class", "st");
    svg.append("path").attr("d", d3.geoPath()(usMap.borders)).attr("class", "bd");
    var pts = [];
    rows.forEach(function (d) {
      var p = d.x != null && d.y != null ? proj([d.x, d.y]) : null;
      if (p) pts.push({ d: d, p: p });
    });
    pts.sort(function (a, b) { return (b.d.acres || 0) - (a.d.acres || 0); });
    var tip = $("tip"), wrap = host.parentNode;
    function show(ev, d) {
      var r = wrap.getBoundingClientRect(), t = ev.currentTarget.getBoundingClientRect();
      tip.hidden = false;
      tip.innerHTML = "<strong>" + esc(d.name) + "</strong><br>" + esc(d.county ? d.county + " County, " : "") + esc(d.state) + "<br>" + (d.acres == null ? "Size not reported" : num(d.acres) + " acres") + "<br>" + (d.pct == null ? "Containment not reported" : Math.round(d.pct) + "% contained") + "<br>Discovered " + day(d.found);
      var x = t.left - r.left + t.width / 2, y = t.top - r.top;
      tip.style.left = Math.min(Math.max(x, 100), r.width - 100) + "px";
      tip.style.top = y + "px";
    }
    function hide() { tip.hidden = true; }
    svg.append("g").selectAll("circle").data(pts).join("circle")
      .attr("cx", function (o) { return o.p[0]; }).attr("cy", function (o) { return o.p[1]; })
      .attr("r", function (o) { return 3.5 + Math.sqrt(o.d.acres || 0) / 40; })
      .attr("class", function (o) { return o.d.pct == null ? "dot ring" : "dot"; })
      .attr("fill", function (o) { return colorFor(o.d); })
      .attr("tabindex", 0)
      .attr("aria-label", function (o) { return o.d.name + ", " + o.d.state; })
      .on("mousemove", function (ev, o) { show(ev, o.d); }).on("mouseenter", function (ev, o) { show(ev, o.d); }).on("mouseleave", hide)
      .on("focus", function (ev, o) { show(ev, o.d); }).on("blur", hide);
    host.innerHTML = ""; host.appendChild(svg.node());
    var unplaced = rows.length - pts.length;
    if (unplaced > 0) host.insertAdjacentHTML("beforeend", '<p class="muted" style="margin:.5rem 0 0;font-size:.9rem">' + num(unplaced) + " incident" + (unplaced === 1 ? "" : "s") + " outside the 50 states are listed in the table but not placed on the map.</p>");
  }

  function loadMap() {
    return getJSON("https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json").then(function (us) {
      usMap = { states: topojson.feature(us, us.objects.states).features, borders: topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }) };
      if (incidents.length) drawIncidents();
    }).catch(function () { fail($("map"), "The state outlines could not be loaded, so the map is not shown. The table below still lists the largest incidents."); });
  }

  /* ---------- 2a. burned acres this year ---------- */
  function bars(el, rows, valueOf, label, fmtVal) {
    var max = d3.max(rows, valueOf) || 1, rowH = 30, left = 130, right = 90, W = 560;
    var svg = d3.create("svg").attr("viewBox", "0 0 " + W + " " + (rows.length * rowH + 6)).attr("class", "bars");
    rows.forEach(function (r, i) {
      var y = i * rowH + 3, w = (W - left - right) * valueOf(r) / max;
      svg.append("text").attr("x", left - 8).attr("y", y + 19).attr("text-anchor", "end").attr("class", "lab").text(label(r));
      svg.append("rect").attr("x", left).attr("y", y + 4).attr("width", Math.max(w, 1)).attr("height", 18).attr("fill", "#E4572E");
      svg.append("text").attr("x", left + w + 6).attr("y", y + 19).attr("class", "val").text(fmtVal(r));
    });
    el.innerHTML = ""; el.appendChild(svg.node());
  }

  function loadYTD() {
    $("ytd-title").textContent = "This year so far (" + YEAR + ")";
    var stats = JSON.stringify([{ statisticType: "sum", onStatisticField: "poly_GISAcres", outStatisticFieldName: "acres" }, { statisticType: "count", onStatisticField: "OBJECTID", outStatisticFieldName: "n" }]);
    var base = { where: "attr_IncidentTypeCategory='WF'", outStatistics: stats, f: "json" };
    var byState = Object.assign({ groupByFieldsForStatistics: "attr_POOState", orderByFields: "acres desc", resultRecordCount: "12" }, base);
    return Promise.all([getJSON(q(PERIMETERS, base)), getJSON(q(PERIMETERS, byState))]).then(function (res) {
      var t = res[0].features[0].attributes;
      $("ytd-summary").innerHTML = "<strong>" + num(t.acres) + "</strong> acres across <strong>" + num(t.n) + "</strong> mapped wildfire perimeters since January 1. Twelve states with the most acres:";
      var rows = res[1].features.map(function (f) { var c = st(f.attributes.attr_POOState); return { code: c, name: STATES[c] || c || "Not reported", acres: f.attributes.acres }; });
      bars($("chart-acres"), rows, function (r) { return r.acres; }, function (r) { return r.name; }, function (r) { return num(r.acres); });
    }).catch(function () {
      fail($("ytd-summary"), "The year-to-date acreage from NIFC could not be loaded."); $("chart-acres").innerHTML = "";
    });
  }

  /* ---------- 2b and 3. FEMA ---------- */
  function loadFema() {
    var since = (YEAR - 1) + "-01-01T00:00:00.000z";
    var url = FEMA_DECL + "?$filter=" + encodeURIComponent("incidentType eq 'Fire' and declarationDate ge '" + since + "'") +
      "&$select=disasterNumber,declarationType,state,declarationTitle,declarationDate,designatedArea&$top=2000";
    return getJSON(url).then(function (j) {
      var rows = j.DisasterDeclarationsSummaries || [], byNum = {};
      rows.forEach(function (r) {
        var o = byNum[r.disasterNumber] || (byNum[r.disasterNumber] = { n: r.disasterNumber, type: r.declarationType, state: r.state, title: r.declarationTitle, date: r.declarationDate, areas: [] });
        if (o.areas.indexOf(r.designatedArea) < 0) o.areas.push(r.designatedArea);
      });
      var list = Object.keys(byNum).map(function (k) { return byNum[k]; });
      drawFemaChart(list); drawRecovery(list);
    }).catch(function () {
      fail($("fema-summary"), "The FEMA declarations could not be loaded."); $("chart-fema").innerHTML = "";
      fail($("recovery-summary"), "The FEMA recovery figures could not be loaded. See <a href=\"https://www.fema.gov/about/openfema/disaster-declarations-summaries\">OpenFEMA</a>.");
    });
  }

  function drawFemaChart(list) {
    var cur = list.filter(function (o) { return o.date && new Date(o.date).getFullYear() === YEAR; });
    var by = {};
    cur.forEach(function (o) { var s = by[o.state] || (by[o.state] = { state: o.state, FM: 0, DR: 0, EM: 0 }); if (s[o.type] != null) s[o.type]++; });
    var rows = Object.keys(by).map(function (k) { var s = by[k]; s.total = s.FM + s.DR + s.EM; return s; }).sort(function (a, b) { return b.total - a.total || a.state.localeCompare(b.state); }).slice(0, 12);
    var tot = { FM: 0, DR: 0, EM: 0 }; cur.forEach(function (o) { if (tot[o.type] != null) tot[o.type]++; });
    $("fema-summary").innerHTML = "<strong>" + num(cur.length) + "</strong> fire declarations in " + YEAR + ": " + num(tot.FM) + " fire management assistance, " + num(tot.DR) + " major disaster, " + num(tot.EM) + " emergency. Twelve states with the most:";
    var W = 560, rowH = 30, left = 130, right = 40, max = d3.max(rows, function (r) { return r.total; }) || 1, unit = (W - left - right) / max;
    var svg = d3.create("svg").attr("viewBox", "0 0 " + W + " " + (rows.length * rowH + 6)).attr("class", "bars");
    var colors = { FM: "#F0A92A", DR: "#C8341A", EM: "#6B4A3A" };
    rows.forEach(function (r, i) {
      var y = i * rowH + 3, x = left;
      svg.append("text").attr("x", left - 8).attr("y", y + 19).attr("text-anchor", "end").attr("class", "lab").text(STATES[r.state] || r.state);
      ["FM", "DR", "EM"].forEach(function (k) { if (r[k]) { svg.append("rect").attr("x", x).attr("y", y + 4).attr("width", r[k] * unit).attr("height", 18).attr("fill", colors[k]); x += r[k] * unit; } });
      svg.append("text").attr("x", x + 6).attr("y", y + 19).attr("class", "val").text(r.total);
    });
    $("chart-fema").innerHTML = ""; $("chart-fema").appendChild(svg.node());
  }

  function drawRecovery(list) {
    var drs = list.filter(function (o) { return o.type === "DR"; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var tb = document.querySelector("#recovery-table tbody");
    if (!drs.length) { $("recovery-summary").textContent = "FEMA lists no major disaster declarations for fire since January 1, " + (YEAR - 1) + "."; tb.innerHTML = ""; return; }
    $("recovery-summary").textContent = "Major disaster declarations for fire since January 1, " + (YEAR - 1) + " (" + drs.length + "), newest first.";
    var filter = drs.map(function (o) { return "disasterNumber eq " + o.n; }).join(" or ");
    return getJSON(FEMA_SUM + "?$filter=" + encodeURIComponent(filter)).then(function (j) { return j.FemaWebDisasterSummaries || []; }, function () { return null; }).then(function (sums) {
      var map = {}; (sums || []).forEach(function (s) { map[s.disasterNumber] = s; });
      tb.innerHTML = drs.map(function (o) {
        var s = map[o.n] || {}, areas = o.areas.map(function (a) { return a.replace(/ \((County|Parish|Borough)\)$/, ""); });
        var shownAreas = areas.slice(0, 4).join(", ") + (areas.length > 4 ? " and " + (areas.length - 4) + " more" : "");
        var title = o.title.charAt(0) + o.title.slice(1).toLowerCase();
        return "<tr><td>DR-" + o.n + "-" + esc(o.state) + "</td><td>" + esc(title) + "</td><td>" + day(new Date(o.date).getTime(), true) + "</td><td>" + esc(shownAreas) +
          '</td><td class="num">' + (sums ? money(s.totalAmountIhpApproved) : "Not loaded") + '</td><td class="num">' + (sums ? money(s.totalObligatedAmountPa) : "Not loaded") + "</td></tr>";
      }).join("");
    });
  }

  /* ---------- start ---------- */
  $("show-contained").addEventListener("change", function () { if (incidents.length) drawIncidents(); });
  loadMap(); loadIncidents(); loadYTD(); loadFema();
  setInterval(loadIncidents, 10 * 60 * 1000);
})();
