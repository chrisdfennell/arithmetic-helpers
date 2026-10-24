/* "Add to assignment": a button beside Copy link on every helper page (tools.js loads this file).
   It puts THE PROBLEM ON THE SCREEN, by its link (this page and its address, without practice/embed/theme), into the
   assignment the teacher is building on this device, and shows how many are in it, with a link to the builder
   (practice/sets.html?assignment). Nothing leaves the browser: the draft is kept in localStorage["assignment-draft"]:
     { v:1, items:[ { p:"fractions", q:"mode=simplify&q=18%2F24", t:"18/24", at:time added }, … ],
       title, instr, due:"2026-10-30", steps:true, retries:true }
   p is the page's short name without .html (the name practice sets use), q its address, t a readable label.
   sets.html reads and edits the same draft (reorder, remove, title, instructions, due date, options, Share).
   HelperAssign.load() / .save(d) / .add(page, params, label) / .count() / .builder() for other pages. */
(function() {
  "use strict";
  if (window.HelperAssign) return;
  var KEY = "assignment-draft",
    MAX = 100;
  var SITE = window.HelperSite;

  function U(name, params) { return SITE ? SITE.url(name, params) : name + (params ? "?" + params : ""); }

  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (v && typeof v === "object" && Array.isArray(v.items)) {
        v.items = v.items.filter(function(x) { return x && typeof x.p === "string" && typeof x.q === "string"; });
        return v;
      }
    } catch (e) {}
    return { v: 1, items: [] };
  }

  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (e) { return false; } }

  function clean(search) {
    return String(search || "").replace(/^\?/, "").split("&").filter(function(kv) { return kv && !/^(practice|embed|theme)=/.test(kv); }).join("&");
  }

  function labelOf(params) {
    var bits = [],
      q = "";
    String(params || "").split("&").forEach(function(kv) {
      if (!kv) return;
      var i = kv.indexOf("="),
        k = i < 0 ? kv : kv.slice(0, i),
        v = i < 0 ? "" : kv.slice(i + 1);
      try { v = decodeURIComponent(v.replace(/\+/g, " ")); } catch (e) {}
      if (k === "q") q = v;
      else bits.push(k === "mode" || k === "shape" ? v : k + " " + v);
    });
    return (q || bits.join(" · ")).slice(0, 120);
  }
  // the label kept with a problem: what was typed (q=…); otherwise the builder words it from the link itself
  function itemLabel(params) { return /(?:^|&)q=/.test(params) ? labelOf(params) : ""; }
  // → "added", "already" or "full" (or "error" when the device won't keep it)
  function add(page, params, label) {
    var d = load(),
      p = String(page || "").replace(/\.html$/, ""),
      q = clean(params);
    if (!p) return "error";
    if (d.items.some(function(x) { return x.p === p && x.q === q; })) return "already";
    if (d.items.length >= MAX) return "full";
    d.items.push({ p: p, q: q, t: String(label === undefined ? itemLabel(q) : label).slice(0, 140), at: Date.now() });
    return save(d) ? "added" : "error";
  }

  function count() { return load().items.length; }

  function builder() { return U("practice.html", "assignment"); }
  window.HelperAssign = { KEY: KEY, load: load, save: save, add: add, count: count, builder: builder, label: labelOf };

  /* ---- the button, on the helper pages only ---- */
  function here() { return (SITE && SITE.here) || ""; }

  function isHelper() {
    var h = here();
    if (!h || !SITE) return false;
    return /^helpers\//.test(SITE.path(h)) || h === "flashcards.html";
  }
  var btn = null,
    link = null,
    timer = 0;

  function paintCount() {
    if (!link) return;
    var n = count();
    link.hidden = !n;
    link.textContent = n + " in your assignment";
    link.href = builder();
    link.title = "Open the assignment builder: put the problems in order, add a due date and share one link";
  }

  function onAdd() {
    var page = here(),
      what = add(page, location.search);
    var txt = { added: "Added ✓", already: "Already in it ✓", full: "Assignment full (100)", error: "Couldn’t save it here" } [what] || "Added ✓";
    btn.textContent = txt;
    clearTimeout(timer);
    timer = setTimeout(function() { btn.textContent = "Add to assignment"; }, 2200);
    paintCount();
  }

  function setup() {
    if (!isHelper() || document.getElementById("htAssign")) return;
    var copy = document.getElementById("copyBtn");
    if (!copy) return;
    var st = document.createElement("style");
    st.textContent = "a.ha-count{font-size:13px;font-weight:600;color:var(--ink-2);text-decoration:underline;text-underline-offset:2px;white-space:nowrap;align-self:center}" +
      "a.ha-count:hover{color:var(--ink)}a.ha-count[hidden]{display:none}" +
      "@media print{#htAssign,a.ha-count{display:none !important}}";
    document.head.appendChild(st);
    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "htAssign";
    btn.className = copy.className;
    btn.textContent = "Add to assignment";
    btn.title = "Add this problem, just as it is, to the assignment you’re building on this device";
    btn.addEventListener("click", onAdd);
    link = document.createElement("a");
    link.className = "ha-count";
    copy.parentNode.insertBefore(btn, copy.nextSibling);
    btn.parentNode.insertBefore(link, btn.nextSibling);
    paintCount();
    window.addEventListener("storage", function(e) { if (!e.key || e.key === KEY) paintCount(); });
    window.addEventListener("pageshow", paintCount);
  }
  try {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
    else setup();
  } catch (e) { if (window.console) console.warn("assign.js:", e); }
})();
