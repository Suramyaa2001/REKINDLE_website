(function () {
  var D = window.REKINDLE || {};
  var pages = [["index.html", "Home"], ["project.html", "Project"], ["research.html", "Research"]];
  if (D.showWildfireData) pages.push(["wildfires.html", "Wildfire data"]);
  pages.push(["team.html", "Team"], ["institutions.html", "Partners"], ["publications.html", "Publications"], ["news.html", "News"], ["contact.html", "Contact"]);
  var here = (location.pathname.split("/").pop() || "index.html");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function fmt(d) {
    var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], p = d.split("-");
    return p.length === 3 ? m[+p[1]-1] + " " + (+p[2]) + ", " + p[0] : m[+p[1]-1] + " " + p[0];
  }
  function awardLink(a) { return '<a href="https://www.nsf.gov/awardsearch/show-award?AWD_ID=' + esc(a.id) + '">' + esc(a.id) + '</a>'; }

  /* header: left rail */
  var h = '<aside class="rail"><a class="brand" href="index.html">REKINDLE<small>Wildfire hazards and resilient lifelines<br>Funded by the National Science Foundation</small></a>' +
       '<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>' +
       '<nav class="main" id="nav" aria-label="Main"><ul>';
  pages.forEach(function (p) {
    h += '<li><a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '>' + p[1] + '</a></li>';
  });
  h += '</ul></nav>';
  if (D.banner) h += '<div class="note"><a href="' + esc(D.banner.url) + '"><b>' + esc(D.banner.label) + '</b>' + esc(D.banner.text) + '</a></div>';
  h += '</aside>';
  var top = document.getElementById("site-top"); if (top) top.innerHTML = h;

  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (btn) btn.addEventListener("click", function () {
    var o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o);
  });

  /* NSF award numbers, wherever a page asks for them */
  var awards = D.awards || [];
  var nums = awards.slice().sort(function (a, b) { return a.id < b.id ? -1 : 1; }).map(awardLink);
  var list = nums.length > 1 ? nums.slice(0, -1).join(", ") + " and " + nums[nums.length - 1] : nums.join("");
  Array.prototype.forEach.call(document.querySelectorAll(".award-numbers"), function (el) { el.innerHTML = list; });
  Array.prototype.forEach.call(document.querySelectorAll(".award-table"), function (at) {
    at.innerHTML = awards.map(function (a) {
      return '<tr><td>' + esc(a.inst) + '</td><td>' + esc(a.pi) + '<br><span class="muted">' + esc(a.role || "") + '</span></td><td>' + awardLink(a) + '</td></tr>';
    }).join("");
  });

  /* footer */
  var f = document.getElementById("site-bottom");
  if (f) f.innerHTML = '<footer class="site"><div class="wrap cols"><div><strong>REKINDLE</strong><br>Collaborative Research: FIRE-WUI. Funded by the National Science Foundation, awards ' + list + '.</div>' +
    '<div>Questions about the project? Use the <a href="contact.html">contact form</a>.</div></div>' +
    '<div class="wrap" style="margin-top:1rem;font-size:.85rem;opacity:.8">Any opinions, findings and conclusions expressed on this site are those of the project team and do not necessarily reflect the views of the National Science Foundation.</div></footer>';

  /* contact form link */
  var cf = document.getElementById("contact-form-link");
  if (cf) {
    if (D.contactForm) { cf.href = D.contactForm; cf.target = "_blank"; cf.rel = "noopener"; }
    else { cf.outerHTML = '<span class="empty" style="display:inline-block">The contact form link will be added here soon.</span>'; }
  }

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
  [["paper", "pub-papers", "No papers yet. Papers that acknowledge REKINDLE will be listed here."],
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
    st.innerHTML = (D.students || []).map(function (p) {
      var ini = p.name.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("");
      return '<div class="person"><div class="avatar"><span aria-hidden="true">' + esc(ini) + '</span>' +
        (p.photo ? '<img src="' + esc(p.photo) + '" alt="" onerror="this.remove()">' : '') + '</div>' +
        '<div><h3>' + esc(p.name) + '</h3><p class="inst">' + esc(p.inst || "") + '</p>' + (p.role ? '<p class="role">' + esc(p.role) + '</p>' : '') + '</div></div>';
    }).join("");
  }

  /* partner logos */
  var pl = document.getElementById("partners");
  if (pl) {
    pl.innerHTML = (D.partners || []).map(function (p) {
      return '<li><a href="' + esc(p.url) + '" aria-label="' + esc(p.name) + '"><img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.outerHTML=\'<span>' + esc(p.name).replace(/'/g, "") + '</span>\'"></a></li>';
    }).join("");
  }
  /* external collaborators */
  var cl = document.getElementById("collaborators");
  if (cl) cl.innerHTML = (D.collaborators || []).map(function (c) {
    return '<li><div class="tile"><img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" loading="lazy"></div><p>' + esc(c.name) + '</p></li>';
  }).join("");
})();
