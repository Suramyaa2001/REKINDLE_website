(function () {
  var D = window.REKINDLE || {};
  var pages = [
    ["index.html", "Home"], ["project.html", "Project"], ["research.html", "Research"],
    ["team.html", "Team"], ["outreach.html", "Outreach"], ["publications.html", "Publications"],
    ["news.html", "News"], ["contact.html", "Contact"]
  ];
  var here = (location.pathname.split("/").pop() || "index.html");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function fmt(d) {
    var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], p = d.split("-");
    return p.length === 3 ? m[+p[1]-1] + " " + (+p[2]) + ", " + p[0] : m[+p[1]-1] + " " + p[0];
  }

  /* header */
  var h = "";
  if (D.banner) h += '<div class="banner"><a href="' + esc(D.banner.url) + '"><b>' + esc(D.banner.label) + '</b>' + esc(D.banner.text) + ' &rsaquo;</a></div>';
  h += '<header class="site"><div class="wrap"><a class="brand" href="index.html">REKINDLE<small>NSF FIRE &middot; University at Buffalo</small></a>' +
       '<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>' +
       '<nav class="main" id="nav" aria-label="Main"><ul>';
  pages.forEach(function (p) {
    h += '<li><a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '>' + p[1] + '</a></li>';
  });
  h += '</ul></nav></div></header>';
  var top = document.getElementById("site-top"); if (top) top.innerHTML = h;

  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (btn) btn.addEventListener("click", function () {
    var o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o);
  });

  /* footer */
  var f = document.getElementById("site-bottom");
  if (f) f.innerHTML = '<footer class="site"><div class="wrap cols"><div><strong>REKINDLE</strong><br>Collaborative Research: FIRE-WUI. Funded by the National Science Foundation, 2026&ndash;2029.</div>' +
    '<div>Led by the <a href="https://poulomeeub.github.io/OASIS_website_lab/index.html">OASIS Lab</a>, Department of Industrial and Systems Engineering, University at Buffalo<br><a href="mailto:sayantim@buffalo.edu">sayantim@buffalo.edu</a></div></div>' +
    '<div class="wrap" style="margin-top:1rem;font-size:.85rem;opacity:.8">Any opinions, findings and conclusions expressed on this site are those of the project team and do not necessarily reflect the views of the National Science Foundation.</div></footer>';

  /* news list (home shows 3, news page shows all with filters) */
  function newsItem(n) {
    return '<li data-type="' + esc(n.type) + '"><div><time>' + fmt(n.date) + '</time><span class="kind">' + esc(n.type) + '</span></div><div><h3>' + esc(n.title) + '</h3><p>' + esc(n.text) + '</p>' +
      (n.url ? '<a href="' + esc(n.url) + '">' + esc(n.source || "Read more") + ' &rsaquo;</a>' : '') + '</div></li>';
  }
  var sorted = (D.news || []).map(function (n, i) { n._i = i; return n; }).sort(function (a, b) { return a.date === b.date ? a._i - b._i : (a.date < b.date ? 1 : -1); });
  var latest = document.getElementById("news-latest");
  if (latest) latest.innerHTML = sorted.slice(0, 3).map(newsItem).join("");
  var all = document.getElementById("news-all");
  if (all) {
    all.innerHTML = sorted.map(newsItem).join("");
    var fb = document.getElementById("news-filters");
    if (fb) {
      var types = ["All"]; sorted.forEach(function (n) { if (types.indexOf(n.type) < 0) types.push(n.type); });
      fb.innerHTML = types.map(function (t, i) { return '<button aria-pressed="' + (i === 0) + '" data-t="' + esc(t) + '">' + esc(t) + '</button>'; }).join("");
      fb.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        fb.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        all.querySelectorAll("li").forEach(function (li) { li.hidden = !(b.dataset.t === "All" || li.dataset.type === b.dataset.t); });
      });
    }
  }

  /* publications */
  [["paper", "pub-papers", "No papers yet. The project began in September 2026, and papers that acknowledge REKINDLE will be listed here."],
   ["presentation", "pub-talks", "No presentations or slide decks yet. Talks, posters and slides that mention REKINDLE will be listed here."],
   ["other", "pub-other", "No reports or other outputs yet."]].forEach(function (s) {
    var el = document.getElementById(s[1]); if (!el) return;
    var items = (D.outputs || []).filter(function (o) { return o.kind === s[0]; }).sort(function (a, b) { return b.year - a.year; });
    el.innerHTML = items.length ? items.map(function (o) {
      return '<li><div><time>' + esc(o.year) + '</time></div><div><h3>' + esc(o.title) + '</h3><p>' + esc(o.authors || "") + (o.venue ? '. <em>' + esc(o.venue) + '</em>' : '') + '</p>' +
        (o.url ? '<a href="' + esc(o.url) + '">Open &rsaquo;</a>' : '') + '</div></li>';
    }).join("") : '<li style="display:block;border:0;padding:0"><div class="empty">' + s[2] + '</div></li>';
  });

  /* students */
  var st = document.getElementById("students");
  if (st) {
    var list = D.students || [];
    st.innerHTML = list.length ? list.map(function (p) {
      var ini = p.name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("");
      return '<div class="person"><div class="avatar">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : esc(ini)) + '</div><div><h3>' + esc(p.name) + '</h3><p class="role">' + esc(p.role || "") + '</p><p class="inst">' + esc(p.inst || "") + '</p></div></div>';
    }).join("") : '<div class="empty" style="grid-column:1/-1">Student and staff researchers will be listed here as they join the project.</div>';
  }
})();
