/* The bar across the top of every helper page: back to the home page, and a link to each of the others.
   To add a page, add a line to PAGES (helpers) or TOOLS. A page opened without this file still works; it just has no bar.
   This file also lets the site be installed as an app and work offline (manifest + sw.js). */
(function(){
  "use strict";
  var PAGES = [
    { href:"addition.html",       sign:"+",  name:"Add",       title:"The Carry Column",   c:"add" },
    { href:"subtraction.html",    sign:"−",  name:"Subtract",  title:"The Borrow Bank",    c:"sub" },
    { href:"multiplication.html", sign:"×",  name:"Multiply",  title:"The Product Ladder", c:"mul" },
    { href:"division.html",       sign:"÷",  name:"Divide",    title:"The Division House", c:"div" },
    { href:"fractions.html",      sign:"½",  name:"Fractions", title:"The Fraction Bar",   c:"fra" },
    { href:"percents.html",       sign:"%",  name:"Percents",  title:"The Hundred Grid",   c:"pct" },
    { href:"factors.html",        sign:"⋔",  name:"Factors",   title:"The Factor Tree",    c:"fac" },
    { href:"integers.html",       sign:"±",  name:"Integers",  title:"The Number Line",    c:"int" },
    { href:"ratios.html",         sign:"∶",  name:"Ratios",    title:"The Ratio Table",    c:"rat" },
    { href:"exponents.html",       sign:"xⁿ",  name:"Powers",     title:"The Power Tower", c:"exp" },
    { href:"pemdas.html",         sign:"( )", name:"Order",    title:"The Order Stack",    c:"ord" },
    { href:"algebra.html",        sign:"x",  name:"Algebra",   title:"The Balance Scale",  c:"alg", italic:true },
    { href:"lines.html",          sign:"↗",  name:"Lines",     title:"The Slope Grid",     c:"lin" },
    { href:"geometry.html",       sign:"△",  name:"Geometry",  title:"The Shape Shop",     c:"geo" },
    { href:"stats.html",          sign:"⁘",  name:"Statistics", title:"The Dot Plot",      c:"sta" },
    { href:"probability.html",     sign:"◔",  name:"Chance",     title:"The Chance Spinner", c:"pro" },
    { href:"wordproblems.html",   sign:"✎",  name:"Stories",   title:"The Story Problem",  c:"wrd" }
  ];
  var TOOLS = [
    { href:"worksheet.html", name:"Worksheets", title:"The Worksheet Maker" },
    { href:"practice.html",  name:"Practice",   title:"Practice sets" },
    { href:"flashcards.html", name:"Flash cards", title:"The Flash Cards: times tables and other facts" },
    { href:"daily.html",     name:"Daily",      title:"Problem of the day" },
    { href:"progress.html",  name:"Progress",   title:"Your progress" },
    { href:"results.html",   name:"Results",    title:"Class results: a teacher's view of a practice set" },
    { href:"reference.html", name:"Reference",  title:"Reference sheets to print" },
    { href:"glossary.html",  name:"Definitions", title:"The Word List: what the math words mean" }
  ];

  var LIGHT = "--nv-add:#0D7361;--nv-sub:#A8412A;--nv-mul:#544696;--nv-div:#A85A0C;--nv-ord:#1F5E8C;--nv-alg:#9B2F6B;--nv-geo:#4F6A17;"
            + "--nv-fra:#0B6E83;--nv-pct:#8A6D00;--nv-fac:#7B3FA0;--nv-int:#46596E;--nv-rat:#B0263E;--nv-lin:#1E7A3C;--nv-sta:#3346A8;--nv-wrd:#0F766E;--nv-exp:#BE185D;--nv-pro:#A21CAF;";
  var DARK  = "--nv-add:#4FCCB0;--nv-sub:#F08A6E;--nv-mul:#A99CF0;--nv-div:#F2A85C;--nv-ord:#7DB8E8;--nv-alg:#F08CC0;--nv-geo:#B5D06A;"
            + "--nv-fra:#5FC9DE;--nv-pct:#E3C04D;--nv-fac:#C9A0EE;--nv-int:#A9BDD2;--nv-rat:#F27D8F;--nv-lin:#6FD38E;--nv-sta:#93A2F2;--nv-wrd:#5EEAD4;--nv-exp:#FDA4AF;--nv-pro:#F0ABFC;";
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
    "@media (max-width:560px){.sitenav .sn-links a{padding:5px 9px;font-size:12.5px}.sitenav .sn-tools{margin-left:0}}" +
    "@media print{.sitenav{display:none !important}}";

  // inside a practice set: the page marks itself, because by now it may already have rewritten its address
  function embedded(){ return /[?&]embed=1(&|$)/.test(location.search) || document.documentElement.classList.contains("embed"); }

  /* installable and offline: the app manifest, its icons, and the service worker that saves the pages */
  function appBits(){
    var head = document.head;
    if (!head.querySelector('link[rel="manifest"]')){
      var m = document.createElement("link"); m.rel = "manifest"; m.href = "manifest.webmanifest"; head.appendChild(m);
    }
    if (!head.querySelector('link[rel="apple-touch-icon"]')){
      var a = document.createElement("link"); a.rel = "apple-touch-icon"; a.href = "icons/apple-touch-icon.png"; head.appendChild(a);
    }
    if (!head.querySelector('link[rel="icon"]')){
      var f = document.createElement("link"); f.rel = "icon"; f.type = "image/svg+xml"; f.href = "icons/favicon.svg"; head.appendChild(f);
    }
    if (!head.querySelector('meta[name="theme-color"]')){
      var t = document.createElement("meta"); t.name = "theme-color"; t.content = "#19211D"; head.appendChild(t);
    }
    // the definitions popups: jargon in the explanations links to the Word List
    if (!window.HelperGlossary && !head.querySelector('script[src="glossary.js"]')){
      var g = document.createElement("script"); g.src = "glossary.js"; g.defer = true; head.appendChild(g);
    }
    // the search box, settings that follow you, read aloud, recent problems, shortcuts, next problem
    ["search.js", "tools.js"].forEach(function(src){
      if (head.querySelector('script[src="' + src + '"]')) return;
      var sc = document.createElement("script"); sc.src = src; sc.async = false; head.appendChild(sc);
    });
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)){
      window.addEventListener("load", function(){ navigator.serviceWorker.register("sw.js").catch(function(){}); });
    }
    countVisit();
  }

  /* Counting visits with GoatCounter (no cookies, no personal data). Only real visits count: not a page
     shown inside another one (worksheet problems, practice sets, the self-test), not the self-test page,
     and not local testing. Each page is counted by its name, without the problem in the address. */
  function countVisit(){
    var framed = true;
    try { framed = window.top !== window.self; } catch (e){}
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (framed || embedded() || page === "tests.html" || !/^https?:$/.test(location.protocol)
        || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
    if (document.querySelector('script[data-goatcounter]')) return;
    window.goatcounter = window.goatcounter || {};
    window.goatcounter.path = function(){ return location.pathname; };
    var gc = document.createElement("script");
    gc.async = true; gc.src = "https://gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://fennell.goatcounter.com/count");
    document.head.appendChild(gc);
  }

  function build(){
    if (embedded()) return;               // a page shown inside a practice set gets no bar
    var page = document.querySelector(".page");
    if (!page || document.querySelector(".sitenav")) return;
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var nav = document.createElement("nav");
    nav.className = "sitenav";
    nav.setAttribute("aria-label", "All the helpers");
    var html = '<a class="sn-home" href="index.html"><span aria-hidden="true">←</span> All helpers</a><ul class="sn-links">';
    PAGES.forEach(function(p){
      html += '<li><a href="' + p.href + '" title="' + p.title + '" style="--nv:var(--nv-' + p.c + ')"'
            + (p.href === here ? ' aria-current="page"' : "") + '><b' + (p.italic ? ' class="it"' : "")
            + ' aria-hidden="true">' + p.sign + "</b>" + p.name + "</a></li>";
    });
    html += '</ul><ul class="sn-tools" aria-label="Tools">';
    TOOLS.forEach(function(p){
      html += '<li><a href="' + p.href + '" title="' + p.title + '"' + (p.href === here ? ' aria-current="page"' : "") + ">" + p.name + "</a></li>";
    });
    nav.innerHTML = html + "</ul>";
    page.insertBefore(nav, page.firstChild);
  }

  appBits();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
