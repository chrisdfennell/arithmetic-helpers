/* The bar across the top of every helper page: back to the home page, and a link to each of the others.
   To add a page, add a line to PAGES (helpers) or TOOLS, and its folder to site.js. A page opened without this file
   still works; it just has no bar. Every link here is made by HelperSite (site.js, loaded first), so the bar works
   from any folder. This file also lets the site be installed as an app and work offline (manifest + sw.js). */
(function() {
  "use strict";
  var PAGES = [
    { href: "number-sense.html", sign: "#", name: "Place value", title: "The Place Value Chart: number sense", c: "num" },
    { href: "addition.html", sign: "+", name: "Add", title: "The Carry Column", c: "add" },
    { href: "subtraction.html", sign: "−", name: "Subtract", title: "The Borrow Bank", c: "sub" },
    { href: "multiplication.html", sign: "×", name: "Multiply", title: "The Product Ladder", c: "mul" },
    { href: "division.html", sign: "÷", name: "Divide", title: "The Division House", c: "div" },
    { href: "scratch.html", sign: "✍", name: "By hand", title: "The Scratch Paper: do + − × ÷ yourself", c: "scr" },
    { href: "fractions.html", sign: "½", name: "Fractions", title: "The Fraction Bar", c: "fra" },
    { href: "percents.html", sign: "%", name: "Percents", title: "The Hundred Grid", c: "pct" },
    { href: "money-math.html", sign: "$", name: "Money", title: "The Money Jar: interest, loans, paychecks and budgets", c: "mon" },
    { href: "factors.html", sign: "⋔", name: "Factors", title: "The Factor Tree", c: "fac" },
    { href: "integers.html", sign: "±", name: "Integers", title: "The Number Line", c: "int" },
    { href: "ratios.html", sign: "∶", name: "Ratios", title: "The Ratio Table", c: "rat" },
    { href: "unit-conversions.html", sign: "⇄", name: "Units", title: "The Measuring Tape: unit conversions", c: "uni" },
    { href: "exponents.html", sign: "xⁿ", name: "Powers", title: "The Power Tower", c: "exp" },
    { href: "pemdas.html", sign: "( )", name: "Order", title: "The Order Stack", c: "ord" },
    { href: "algebra.html", sign: "x", name: "Algebra", title: "The Balance Scale", c: "alg", italic: true },
    { href: "lines.html", sign: "↗", name: "Lines", title: "The Slope Grid", c: "lin" },
    { href: "graphing.html", sign: "⌗", name: "Graphing", title: "The Graph Paper", c: "gra" },
    { href: "functions.html", sign: "f(x)", name: "Functions", title: "The Function Machine: functions", c: "fun" },
    { href: "radicals.html", sign: "√", name: "Radicals", title: "The Root Cellar: radicals and rational expressions", c: "rad" },
    { href: "complex-numbers.html", sign: "i", name: "Complex", title: "The Complex Plane: complex numbers", c: "cpx" },
    { href: "quadratics.html", sign: "x²", name: "Quadratics", title: "The Area Box: quadratics and polynomials", c: "qua" },
    { href: "logarithms.html", sign: "log", name: "Logs", title: "The Log Ladder: logarithms", c: "log" },
    { href: "sequences.html", sign: "aₙ", name: "Sequences", title: "The Number Staircase: sequences and series", c: "seq" },
    { href: "geometry.html", sign: "△", name: "Geometry", title: "The Shape Shop", c: "geo" },
    { href: "stats.html", sign: "⁘", name: "Statistics", title: "The Dot Plot", c: "sta" },
    { href: "probability.html", sign: "◔", name: "Chance", title: "The Chance Spinner", c: "pro" },
    { href: "counting.html", sign: "n!", name: "Counting", title: "The Counting Tree: counting, arrangements (nPr) and combinations (nCr)", c: "cnt" },
    { href: "trigonometry.html", sign: "∠", name: "Trig", title: "The Unit Circle: trigonometry", c: "tri" },
    { href: "calculus.html", sign: "∫", name: "Calculus", title: "The Rate Machine: calculus", c: "cal" },
    { href: "college-statistics.html", sign: "σ", name: "Statistics II", title: "The Bell Curve: college statistics", c: "bel" },
    { href: "matrices-and-vectors.html", sign: "[ ]", name: "Matrices", title: "The Matrix Grid: matrices and vectors", c: "mat" },
    { href: "wordproblems.html", sign: "✎", name: "Stories", title: "The Story Problem", c: "wrd" }
  ];
  var TOOLS = [
    { href: "worksheet.html", name: "Worksheets", title: "The Worksheet Maker" },
    { href: "practice.html", name: "Practice", title: "Practice sets" },
    { href: "flashcards.html", name: "Flash cards", title: "The Flash Cards: times tables and other facts" },
    { href: "daily.html", name: "Daily", title: "Problem of the day" },
    { href: "progress.html", name: "Progress", title: "Your progress" },
    { href: "results.html", name: "Results", title: "Class results: a teacher's view of a practice set" },
    { href: "reference.html", name: "Reference", title: "Reference sheets to print" },
    { href: "glossary.html", name: "Definitions", title: "The Word List: what the math words mean" },
    { href: "learn/", name: "Lessons", title: "Step-by-step lessons: how to do each kind of problem" },
    { href: "standards.html", name: "Standards", title: "Common Core standards matched to the helpers (unofficial)" },
    { href: "help.html", name: "Help", title: "How to use the site, what each helper reads, and what's not done yet" }
  ];
  /* "Math at work": ONE entry in the bar (a button) that opens a small menu of the work-math pages, each with links
     straight to its tabs (page.html?mode=…). To add a field (nursing doses, carpentry, electrical …), add a group here:
     href = its short name, path = where it lives (used only until site.js knows the page), c = its --nv- color. */
  var WORK = [{
    href: "aviation.html",
    path: "helpers/aviation.html",
    sign: "✈",
    name: "Aviation",
    title: "The Flight Computer",
    c: "avi",
    tabs: [
      ["wind", "Wind triangle", "heading and ground speed"],
      ["runway", "Runway winds", "crosswind and headwind"],
      ["trip", "Time, speed & fuel", ""],
      ["altitude", "Altitude & airspeed", "pressure, density, TAS"],
      ["headings", "Headings", "true, magnetic, compass"],
      ["descent", "Descent", "top of descent, fpm"],
      ["weight", "Weight & balance", "moments and CG"],
      ["turns", "Turns & glide", ""],
      ["units", "Units", "kt, nm, inHg, gal ↔ lb"]
    ]
  }];

  var LIGHT = "--nv-add:#0D7361;--nv-sub:#A8412A;--nv-mul:#544696;--nv-div:#A85A0C;--nv-ord:#1F5E8C;--nv-alg:#9B2F6B;--nv-geo:#4F6A17;" +
    "--nv-fra:#0B6E83;--nv-pct:#8A6D00;--nv-fac:#7B3FA0;--nv-int:#46596E;--nv-rat:#B0263E;--nv-lin:#1E7A3C;--nv-sta:#3346A8;--nv-wrd:#0F766E;--nv-gra:#0369A1;--nv-exp:#BE185D;--nv-pro:#A21CAF;--nv-scr:#B45309;--nv-tri:#4D7C0F;--nv-cal:#7C3AED;--nv-num:#EA580C;--nv-qua:#B91C1C;--nv-log:#1D4ED8;--nv-seq:#15803D;--nv-fun:#0E7490;--nv-rad:#92400E;--nv-cpx:#4F46E5;--nv-bel:#047857;--nv-mat:#57534E;--nv-uni:#BE123C;--nv-mon:#A16207;--nv-avi:#0B5CAD;--nv-cnt:#6B5A2B;";
  var DARK = "--nv-add:#4FCCB0;--nv-sub:#F08A6E;--nv-mul:#A99CF0;--nv-div:#F2A85C;--nv-ord:#7DB8E8;--nv-alg:#F08CC0;--nv-geo:#B5D06A;" +
    "--nv-fra:#5FC9DE;--nv-pct:#E3C04D;--nv-fac:#C9A0EE;--nv-int:#A9BDD2;--nv-rat:#F27D8F;--nv-lin:#6FD38E;--nv-sta:#93A2F2;--nv-wrd:#5EEAD4;--nv-gra:#7DD3FC;--nv-exp:#FDA4AF;--nv-pro:#F0ABFC;--nv-scr:#FCD34D;--nv-tri:#BEF264;--nv-cal:#C4B5FD;--nv-num:#FDBA74;--nv-qua:#FCA5A5;--nv-log:#93C5FD;--nv-seq:#86EFAC;--nv-fun:#67E8F9;--nv-rad:#FBBF24;--nv-cpx:#A5B4FC;--nv-bel:#6EE7B7;--nv-mat:#D6D3D1;--nv-uni:#FDA4AF;--nv-mon:#FDE047;--nv-avi:#8CC4F5;--nv-cnt:#EED9A0;";
  var CSS =
    ":root{" + LIGHT + "}" +
    "@media (prefers-color-scheme: dark){:root:not([data-theme=\"light\"]){" + DARK + "}}" +
    ":root[data-theme=\"dark\"]{" + DARK + "}" +
    ".sitenav{display:flex;align-items:center;gap:8px 14px;flex-wrap:wrap;padding-bottom:14px;margin-bottom:-6px;" +
    "border-bottom:1px solid var(--rule);font-family:var(--f-body,\"IBM Plex Sans\",\"Segoe UI\",Helvetica,Arial,sans-serif)}" +
    ".sitenav a{text-decoration:none;color:var(--ink-2);border-radius:999px;white-space:nowrap}" +
    ".sitenav .sn-home{font-size:13.5px;font-weight:600;color:var(--ink);background:var(--surface);" +
    "border:1px solid var(--rule);padding:6px 14px 6px 11px;display:inline-flex;align-items:center;gap:6px}" +
    ".sitenav .sn-home:hover{border-color:var(--ink-3)}" +
    ".sitenav .sn-home span{font-size:15px;line-height:1}" +
    ".sitenav .sn-links{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}" +
    ".sitenav .sn-links a{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;" +
    "padding:5px 11px;border:1px solid transparent}" +
    ".sitenav .sn-links a b{font-family:var(--f-mono,\"IBM Plex Mono\",Consolas,monospace);font-weight:600;" +
    "font-size:14px;color:var(--nv);line-height:1}" +
    ".sitenav .sn-links a b.it{font-style:italic;font-family:Georgia,\"Times New Roman\",serif;font-size:15px}" +
    ".sitenav .sn-links a:hover{color:var(--ink);border-color:var(--rule);background:var(--surface)}" +
    ".sitenav .sn-links a[aria-current=\"page\"]{color:var(--ink);font-weight:600;background:var(--surface);" +
    "border-color:var(--nv);box-shadow:inset 0 0 0 1px var(--nv)}" +
    ".sitenav .sn-tools{display:flex;gap:4px 12px;flex-wrap:wrap;margin:0 0 0 auto;padding:0;list-style:none;font-size:13px}" +
    ".sitenav .sn-tools a{padding:5px 2px;color:var(--ink-3);font-weight:600}" +
    ".sitenav .sn-tools a:hover{color:var(--ink);text-decoration:underline}" +
    ".sitenav .sn-tools a[aria-current=\"page\"]{color:var(--ink)}" +
    ".sitenav a:focus-visible{outline:2.5px solid var(--focus,var(--ink));outline-offset:2px}" +
    // Math at work: the button and its menu
    ".sitenav .sn-work{position:relative}" +
    ".sitenav .sn-wbtn{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13px;font-weight:500;color:var(--ink-2);" +
    "background:none;padding:5px 11px;border:1px solid transparent;border-radius:999px;cursor:pointer;white-space:nowrap}" +
    ".sitenav .sn-wbtn b{font-family:var(--f-mono,\"IBM Plex Mono\",Consolas,monospace);font-weight:600;font-size:14px;color:var(--nv);line-height:1}" +
    ".sitenav .sn-wbtn .sn-caret{font-size:10px;color:var(--ink-3)}" +
    ".sitenav .sn-wbtn:hover,.sitenav .sn-wbtn[aria-expanded=\"true\"]{color:var(--ink);border-color:var(--rule);background:var(--surface)}" +
    ".sitenav .sn-wbtn.on{color:var(--ink);font-weight:600;background:var(--surface);border-color:var(--nv);box-shadow:inset 0 0 0 1px var(--nv)}" +
    ".sitenav .sn-wbtn:focus-visible{outline:2.5px solid var(--focus,var(--ink));outline-offset:2px}" +
    ".sitenav .sn-wmenu{position:absolute;z-index:80;top:calc(100% + 6px);left:0;width:270px;max-width:calc(100vw - 24px);background:var(--surface);" +
    "color:var(--ink);border:1px solid var(--rule);border-radius:12px;box-shadow:0 18px 36px -18px rgba(0,0,0,.55);padding:6px}" +
    ".sitenav .sn-wgrp + .sn-wgrp{border-top:1px solid var(--rule);margin-top:4px;padding-top:4px}" +
    ".sitenav .sn-wmenu ul{list-style:none;margin:0;padding:0}" +
    ".sitenav .sn-wmenu a{display:block;padding:6px 10px;border-radius:8px;font-size:13.5px;color:var(--ink);white-space:normal}" +
    ".sitenav .sn-wmenu a:hover{background:var(--surface-2)}" +
    ".sitenav .sn-wmenu a small{color:var(--ink-3);font-size:12px;margin-left:4px}" +
    ".sitenav .sn-wmenu a.sn-wh{font-weight:600;padding-top:8px}" +
    ".sitenav .sn-wmenu a.sn-wh b{font-family:var(--f-mono,\"IBM Plex Mono\",Consolas,monospace);color:var(--nv);margin-right:6px}" +
    ".sitenav .sn-wmenu ul a{padding-left:30px}" +
    "@media (max-width:560px){.sitenav .sn-links a{padding:5px 9px;font-size:12.5px}.sitenav .sn-tools{margin-left:0}.sitenav .sn-wbtn{padding:5px 9px;font-size:12.5px}}" +
    // each helper's #statusLine is for screen readers only: the same message is already on screen
    "#statusLine{position:absolute !important;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}" +
    "@media print{.sitenav{display:none !important}}";

  // where a page or file lives (site.js); without it, a name is taken as a file in the same folder
  function U(name) { return window.HelperSite ? window.HelperSite.url(name) : name; }

  function loaded(file) { return !!document.querySelector('script[src$="' + file + '"], script[src*="' + file + '?"]'); }

  // inside a practice set: the page marks itself, because by now it may already have rewritten its address
  function embedded() { return /[?&]embed=1(&|$)/.test(location.search) || document.documentElement.classList.contains("embed"); }

  /* installable and offline: the app manifest, its icons, and the service worker that saves the pages */
  function appBits() {
    var head = document.head;
    if (!head.querySelector('link[rel="manifest"]')) {
      var m = document.createElement("link");
      m.rel = "manifest";
      m.href = U("manifest.webmanifest");
      head.appendChild(m);
    }
    if (!head.querySelector('link[rel="apple-touch-icon"]')) {
      var a = document.createElement("link");
      a.rel = "apple-touch-icon";
      a.href = U("icons/apple-touch-icon.png");
      head.appendChild(a);
    }
    if (!head.querySelector('link[rel="icon"]')) {
      var f = document.createElement("link");
      f.rel = "icon";
      f.type = "image/svg+xml";
      f.href = U("icons/favicon.svg");
      head.appendChild(f);
    }
    if (!head.querySelector('meta[name="theme-color"]')) {
      var t = document.createElement("meta");
      t.name = "theme-color";
      t.content = "#19211D";
      head.appendChild(t);
    }
    // the definitions popups: jargon in the explanations links to the Word List
    if (!window.HelperGlossary && !loaded("glossary.js")) {
      var g = document.createElement("script");
      g.src = U("glossary.js");
      g.defer = true;
      head.appendChild(g);
    }
    // the search box, settings that follow you, read aloud, recent problems, shortcuts, next problem
    ["search.js", "tools.js"].forEach(function(src) {
      if (loaded(src)) return;
      var sc = document.createElement("script");
      sc.src = U(src);
      sc.async = false;
      head.appendChild(sc);
    });
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener("load", function() { navigator.serviceWorker.register(U("sw.js")).catch(function() {}); });
    }
    countVisit();
  }

  /* Counting visits with GoatCounter (no cookies, no personal data). Only real visits count: not a page
     shown inside another one (worksheet problems, practice sets, the self-test), not the self-test page,
     and not local testing. Each page is counted by its name, without the problem in the address. */
  function countVisit() {
    var framed = true;
    try { framed = window.top !== window.self; } catch (e) {}
    var page = ((window.HelperSite && window.HelperSite.here) || location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (framed || embedded() || page === "tests.html" || !/^https?:$/.test(location.protocol) ||
      /^(localhost|127\.[0-9.]+|\[::1\])$/.test(location.hostname)) return;
    if (document.querySelector('script[data-goatcounter]')) return;
    window.goatcounter = window.goatcounter || {};
    window.goatcounter.path = function() { return location.pathname; };
    var gc = document.createElement("script");
    gc.async = true;
    gc.src = "https://gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://fennell.goatcounter.com/count");
    document.head.appendChild(gc);
  }

  function build() {
    if (embedded()) return; // a page shown inside a practice set gets no bar
    var page = document.querySelector(".page");
    if (!page || document.querySelector(".sitenav")) return;
    var here = ((window.HelperSite && window.HelperSite.here) || location.pathname.split("/").pop() || "index.html").toLowerCase();

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var nav = document.createElement("nav");
    nav.className = "sitenav";
    nav.setAttribute("aria-label", "All the helpers");
    var html = '<a class="sn-home" href="' + U("index.html") + '"><span aria-hidden="true">←</span> All helpers</a><ul class="sn-links">';
    PAGES.forEach(function(p) {
      html += '<li><a href="' + U(p.href) + '" title="' + p.title + '" style="--nv:var(--nv-' + p.c + ')"' +
        (p.href === here ? ' aria-current="page"' : "") + '><b' + (p.italic ? ' class="it"' : "") +
        ' aria-hidden="true">' + p.sign + "</b>" + p.name + "</a></li>";
    });
    html += workItem(here);
    html += '</ul><ul class="sn-tools" aria-label="Tools">';
    TOOLS.forEach(function(p) {
      html += '<li><a href="' + U(p.href) + '" title="' + p.title + '"' + (p.href === here ? ' aria-current="page"' : "") + ">" + p.name + "</a></li>";
    });
    nav.innerHTML = html + "</ul>";
    page.insertBefore(nav, page.firstChild);
    try { workMenu(nav); } catch (e) {}
  }

  /* ---- Math at work: one button in the bar, a menu of pages and their tabs ---- */
  // a work page's address: through site.js when it knows the page, else from its folder (until site.js lists it)
  function WU(g, params) {
    var HS = window.HelperSite;
    if (HS && HS.id && HS.id(g.href)) return HS.url(g.href, params);
    if (HS && HS.root) return HS.root + g.path + (params ? "?" + params : "");
    return g.href + (params ? "?" + params : "");
  }

  function workIsHere(g, here) {
    if (g.href === here) return true;
    var base = g.path.replace(/\.html$/, "");
    return new RegExp("/" + base.replace(/[.\/]/g, "\\$&") + "(?:\\.html)?$", "i").test(location.pathname);
  }

  function workItem(here) {
    if (!WORK.length) return "";
    var on = WORK.some(function(g) { return workIsHere(g, here); }),
      one = WORK.length === 1;
    var h = '<li class="sn-work"><button type="button" class="sn-wbtn' + (on ? " on" : "") + '" aria-expanded="false" aria-controls="snWorkMenu"' +
      ' title="Math at work: ' + WORK.map(function(g) { return g.name.toLowerCase(); }).join(", ") + '" style="--nv:var(--nv-' + WORK[0].c + ')"><b aria-hidden="true">'
      // named for its one field while there is just one ("✈ Aviation"); "Math at work" once there are more
      +
      (one ? WORK[0].sign : "⚒") + "</b>" + (one ? WORK[0].name : "Math at work") + '<span class="sn-caret" aria-hidden="true">▾</span></button>' +
      '<div class="sn-wmenu" id="snWorkMenu" hidden>';
    WORK.forEach(function(g) {
      var cur = workIsHere(g, here);
      h += '<div class="sn-wgrp" style="--nv:var(--nv-' + g.c + ')"><a class="sn-wh" href="' + WU(g) + '"' + (cur ? ' aria-current="page"' : "") + '><b aria-hidden="true">' +
        g.sign + "</b>" + g.name + " <small>" + g.title + "</small></a><ul>";
      g.tabs.forEach(function(t) { h += '<li><a href="' + WU(g, "mode=" + t[0]) + '">' + t[1] + (t[2] ? " <small>" + t[2] + "</small>" : "") + "</a></li>"; });
      h += "</ul></div>";
    });
    return h + "</div></li>";
  }

  function workMenu(nav) {
    var btn = nav.querySelector(".sn-wbtn"),
      menu = nav.querySelector(".sn-wmenu"),
      box = btn && btn.parentNode;
    if (!btn || !menu) return;

    function links() { return [].slice.call(menu.querySelectorAll("a")); }

    function place() { // keep the menu on the screen (phones)
      menu.style.left = "0px";
      var r = menu.getBoundingClientRect(),
        vw = document.documentElement.clientWidth,
        x = 0;
      if (r.right > vw - 8) x = vw - 8 - r.right;
      if (r.left + x < 8) x = 8 - r.left;
      menu.style.left = x + "px";
    }

    function open(focus) {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      place();
      var l = links();
      if (focus && l.length) l[focus === "last" ? l.length - 1 : 0].focus();
    }

    function close(back) {
      if (menu.hidden) return;
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (back) btn.focus();
    }
    btn.addEventListener("click", function() {
      if (menu.hidden) open(false);
      else close(false);
    });
    btn.addEventListener("keydown", function(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        open("first");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        open("last");
      } else if (e.key === "Escape" && !menu.hidden) {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      }
    });
    menu.addEventListener("keydown", function(e) {
      var l = links(),
        i = l.indexOf(document.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        l[(i + 1) % l.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        l[(i - 1 + l.length) % l.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        l[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        l[l.length - 1].focus();
      }
    });
    document.addEventListener("click", function(e) { if (!menu.hidden && !box.contains(e.target)) close(false); });
    box.addEventListener("focusout", function(e) { if (e.relatedTarget && !box.contains(e.relatedTarget)) close(false); });
    window.addEventListener("resize", function() { if (!menu.hidden) place(); });
  }

  appBits();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
