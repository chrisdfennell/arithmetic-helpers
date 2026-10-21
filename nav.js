/* The bar across the top of every helper page: back to the home page, and a link to each of the others.
   To add a page, add a line to PAGES. A page opened without this file still works; it just has no bar. */
(function(){
  "use strict";
  var PAGES = [
    { href:"addition.html",       sign:"+",      name:"Add",      title:"The Carry Column",   c:"add" },
    { href:"subtraction.html",    sign:"−", name:"Subtract", title:"The Borrow Bank",    c:"sub" },
    { href:"multiplication.html", sign:"×", name:"Multiply", title:"The Product Ladder", c:"mul" },
    { href:"division.html",       sign:"÷", name:"Divide",   title:"The Division House", c:"div" },
    { href:"fractions.html",      sign:"½", name:"Fractions", title:"The Fraction Bar",  c:"fra" },
    { href:"percents.html",       sign:"%",      name:"Percents", title:"The Hundred Grid",   c:"pct" },
    { href:"factors.html",        sign:"⋔", name:"Factors",  title:"The Factor Tree",    c:"fac" },
    { href:"integers.html",       sign:"±", name:"Integers", title:"The Number Line",    c:"int" },
    { href:"pemdas.html",         sign:"( )",    name:"Order",    title:"The Order Stack",    c:"ord" },
    { href:"algebra.html",        sign:"x",      name:"Algebra",  title:"The Balance Scale",  c:"alg", italic:true },
    { href:"geometry.html",       sign:"△", name:"Geometry", title:"The Shape Shop",     c:"geo" },
    { href:"worksheet.html",      sign:"▤", name:"Worksheets", title:"The Worksheet Maker", c:"wks" }
  ];

  var LIGHT = "--nv-add:#0D7361;--nv-sub:#A8412A;--nv-mul:#544696;--nv-div:#A85A0C;--nv-ord:#1F5E8C;--nv-alg:#9B2F6B;--nv-geo:#4F6A17;--nv-fra:#0B6E83;--nv-pct:#8A6D00;--nv-fac:#7B3FA0;--nv-int:#46596E;--nv-wks:var(--ink-2);";
  var DARK  = "--nv-add:#4FCCB0;--nv-sub:#F08A6E;--nv-mul:#A99CF0;--nv-div:#F2A85C;--nv-ord:#7DB8E8;--nv-alg:#F08CC0;--nv-geo:#B5D06A;--nv-fra:#5FC9DE;--nv-pct:#E3C04D;--nv-fac:#C9A0EE;--nv-int:#A9BDD2;--nv-wks:var(--ink-2);";
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
    ".sitenav a:focus-visible{outline:2.5px solid var(--focus,var(--ink));outline-offset:2px}" +
    "@media (max-width:560px){.sitenav .sn-links a{padding:5px 9px;font-size:12.5px}}" +
    "@media print{.sitenav{display:none !important}}";

  function build(){
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
    nav.innerHTML = html + "</ul>";
    page.insertBefore(nav, page.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
