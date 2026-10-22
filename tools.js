/* Quality-of-life tools shared by every helper page (nav.js loads this file):
   - settings that follow you from page to page: light/dark and text size
   - big-screen mode for a projector or smartboard
   - read "Say it out loud" aloud
   - a short list of recent problems on each page
   - keyboard shortcuts (press ? to see them)
   - "Next problem" after a right answer in Check my answer
   - the "type any problem" search box in the bar at the top
   - a QR code for this page's address, to open the same problem on a phone (button QR, key Q); qr.js, next to this
     file, is only fetched the first time it's needed
   Everything is wrapped so a problem here can never break a helper page. */
(function(){
  "use strict";
  if (window.HelperTools) return;

  var KEY = "helpers-settings", RECENT = "helpers-recent";
  var SCALES = [0.9, 1, 1.15, 1.3, 1.5];
  var root = document.documentElement;
  var SELF = (document.currentScript && document.currentScript.src) || "";
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var framed = true;
  try { framed = window.top !== window.self; } catch (e){}
  function embedded(){ return /[?&]embed=1(&|$)/.test(location.search) || root.classList.contains("embed"); }
  // pages shown inside another page (worksheets, practice sets, the self-test) keep their own look and record nothing
  var passive = framed || embedded() || page === "tests.html";

  function load(k, d){ try { var v = JSON.parse(localStorage.getItem(k) || "null"); return v === null ? d : v; } catch (e){ return d; } }
  function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e){} }
  function esc(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function safe(fn){ return function(){ try { return fn.apply(this, arguments); } catch (e){ if (window.console) console.warn("tools.js:", e); } }; }
  var S = load(KEY, {});
  if (typeof S !== "object" || !S) S = {};

  /* ===================== styles ===================== */
  var CSS =
    ".ht-bar{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}" +
    ".ht-btn{font-family:var(--f-body,\"IBM Plex Sans\",Arial,sans-serif);font-size:12.5px;font-weight:600;line-height:1;" +
      "color:var(--ink-2);background:var(--surface);border:1px solid var(--rule);border-radius:999px;padding:6px 10px;cursor:pointer}" +
    ".ht-btn:hover{color:var(--ink);border-color:var(--ink-3)}" +
    ".ht-btn[aria-pressed=\"true\"]{color:var(--ink);border-color:var(--ink-2)}" +
    ".ht-search{display:flex;align-items:center;gap:6px;flex:1 1 240px;max-width:420px;min-width:0}" +
    ".ht-search input{flex:1;min-width:0;font-family:var(--f-mono,\"IBM Plex Mono\",Consolas,monospace);font-size:13px;" +
      "color:var(--ink);background:var(--surface);border:1px solid var(--rule);border-radius:999px;padding:6px 12px;outline:none}" +
    ".ht-search input:focus{border-color:var(--ink-3)}" +
    ".ht-search input::placeholder{color:var(--ink-3)}" +
    ".ht-menu{position:absolute;z-index:60;min-width:240px;max-width:min(360px,92vw);background:var(--surface);color:var(--ink);" +
      "border:1px solid var(--rule);border-radius:12px;box-shadow:0 18px 36px -18px rgba(0,0,0,.55);padding:8px;font-size:14px}" +
    ".ht-menu h3{margin:4px 8px 6px;font-size:11px;font-family:var(--f-mono,monospace);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3)}" +
    ".ht-menu a,.ht-menu button.ht-row{display:block;width:100%;text-align:left;padding:7px 9px;border-radius:8px;color:var(--ink);" +
      "text-decoration:none;background:none;border:0;font:inherit;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".ht-menu a:hover,.ht-menu a:focus,.ht-menu button.ht-row:hover{background:var(--surface-2,rgba(127,127,127,.12));outline:none}" +
    ".ht-menu .ht-empty{padding:6px 9px;color:var(--ink-3)}" +
    ".ht-menu .ht-sm{font-size:12px;color:var(--ink-3)}" +
    ".ht-help table{border-collapse:collapse;width:100%}" +
    ".ht-help td{padding:5px 8px;vertical-align:top}" +
    ".ht-help kbd{font-family:var(--f-mono,monospace);font-size:12px;border:1px solid var(--rule);border-bottom-width:2px;" +
      "border-radius:5px;padding:1px 6px;background:var(--paper,transparent);white-space:nowrap}" +
    ".ht-next{margin-top:10px;font-family:var(--f-body,Arial,sans-serif);font-size:15px;font-weight:600;color:var(--surface);" +
      "background:var(--ink);border:0;border-radius:9px;padding:9px 16px;cursor:pointer}" +
    ".ht-next:hover{filter:brightness(1.15)}" +
    ".ht-reading{outline:3px solid var(--focus,var(--ink-2));outline-offset:2px;border-radius:6px}" +
    "html.ht-big .sitenav,html.ht-big .maker,html.ht-big .examples,html.ht-big .footnote,html.ht-big .theme-btn," +
      "html.ht-big .keys,html.ht-big .hint,html.ht-big .eyebrow,html.ht-big .tagline{display:none !important}" +
    ".ht-exit{position:fixed;top:12px;right:12px;z-index:70;font-family:var(--f-body,Arial,sans-serif);font-size:14px;font-weight:600;" +
      "color:var(--ink);background:var(--surface);border:1px solid var(--rule);border-radius:999px;padding:8px 14px;cursor:pointer;" +
      "box-shadow:0 10px 24px -14px rgba(0,0,0,.6)}" +
    ".ht-pad{position:fixed;left:0;right:0;bottom:0;z-index:80;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;" +
      "padding:8px 8px calc(8px + env(safe-area-inset-bottom));background:var(--surface-2,#e3e7df);border-top:1px solid var(--rule);" +
      "box-shadow:0 -10px 24px -16px rgba(0,0,0,.5)}" +
    ".ht-pad[hidden]{display:none}" +
    ".ht-pad button{min-width:44px;height:44px;padding:0 10px;font-family:var(--f-mono,\"IBM Plex Mono\",Consolas,monospace);" +
      "font-size:19px;font-weight:600;color:var(--ink);background:var(--surface);border:1px solid var(--rule);border-radius:10px;cursor:pointer;" +
      "touch-action:manipulation;user-select:none;-webkit-user-select:none}" +
    ".ht-pad button:active{background:var(--rule)}" +
    ".ht-pad button.wide{min-width:84px;font-size:14px}" +
    ".ht-pad button.done{font-family:var(--f-body,Arial,sans-serif);font-size:15px;background:var(--ink);color:var(--surface);border-color:var(--ink)}" +
    "html.ht-padding body{padding-bottom:120px}" +
    "@media print{.ht-bar,.ht-search,.ht-menu,.ht-next,.ht-exit,.ht-read,.ht-pad{display:none !important}}";

  /* ===================== settings that follow you ===================== */
  var themeBtn = null;
  function isDark(){
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function paintThemeBtn(){
    themeBtn = themeBtn || document.getElementById("themeBtn");
    if (themeBtn) themeBtn.textContent = isDark() ? "Light mode" : "Dark mode";
  }
  function applySettings(){
    if (S.theme === "light" || S.theme === "dark"){
      if (root.getAttribute("data-theme") !== S.theme) root.setAttribute("data-theme", S.theme);
    }
    var scale = SCALES.indexOf(S.scale) >= 0 ? S.scale : 1;
    var z = (root.classList.contains("ht-big") ? 1.3 : 1) * scale;
    var box = document.querySelector(".page") || document.querySelector(".wrap");
    if (box) box.style.zoom = z === 1 ? "" : String(z);
    paintThemeBtn();
  }
  function watchTheme(){
    // a page's own theme button changes data-theme; remember that choice for every page
    new MutationObserver(safe(function(){
      var t = root.getAttribute("data-theme");
      if ((t === "light" || t === "dark") && t !== S.theme){ S.theme = t; save(KEY, S); }
    })).observe(root, { attributes:true, attributeFilter:["data-theme"] });
    window.addEventListener("storage", safe(function(e){
      if (e.key === KEY){ S = load(KEY, {}) || {}; applySettings(); }
    }));
  }
  function setScale(dir){
    var i = SCALES.indexOf(SCALES.indexOf(S.scale) >= 0 ? S.scale : 1);
    i = Math.max(0, Math.min(SCALES.length - 1, i + dir));
    S.scale = SCALES[i]; save(KEY, S); applySettings();
    announce("Text size " + Math.round(S.scale * 100) + "%");
  }

  /* ===================== big-screen mode ===================== */
  var exitBtn = null;
  function setBig(on){
    root.classList.toggle("ht-big", on);
    if (on && !exitBtn){
      exitBtn = document.createElement("button");
      exitBtn.type = "button"; exitBtn.className = "ht-exit"; exitBtn.textContent = "Exit big screen ✕";
      exitBtn.addEventListener("click", function(){ setBig(false); });
      document.body.appendChild(exitBtn);
    }
    if (exitBtn) exitBtn.hidden = !on;
    var b = document.getElementById("htBig");
    if (b) b.setAttribute("aria-pressed", String(on));
    applySettings();
    announce(on ? "Big screen on. Press Escape to leave." : "Big screen off");
  }

  /* ===================== read aloud ===================== */
  var speaking = false, readBtn = null;
  function spoken(el){
    var c = el.cloneNode(true);
    [].forEach.call(c.querySelectorAll("svg, .sr-only, button"), function(x){ x.remove(); });
    [].forEach.call(c.querySelectorAll(".fr, .frac, .fraction"), function(fr){
      var nu = fr.querySelector(".nu, .num, .top"), de = fr.querySelector(".de, .den, .bot, .bottom");
      if (!nu || !de){ var k = fr.children; if (k.length === 2){ nu = k[0]; de = k[1]; } }
      if (nu && de) fr.textContent = " " + nu.textContent.trim() + " over " + de.textContent.trim() + " ";
    });
    [].forEach.call(c.querySelectorAll("sup"), function(s){
      var t = s.textContent.trim();
      s.textContent = t === "2" ? " squared " : t === "3" ? " cubed " : " to the power " + t + " ";
    });
    return words(c.textContent);
  }
  // math symbols said the way a teacher would say them
  function words(t){
    return String(t)
      .replace(/(^|[\s(=,:])[−-](?=\d)/g, "$1negative ")
      .replace(/[−–]/g, " minus ").replace(/\+/g, " plus ").replace(/×/g, " times ").replace(/÷/g, " divided by ")
      .replace(/≤/g, " is less than or equal to ").replace(/≥/g, " is greater than or equal to ")
      .replace(/</g, " is less than ").replace(/>/g, " is greater than ").replace(/≈/g, " about ")
      .replace(/=/g, " equals ").replace(/%/g, " percent").replace(/√/g, " the square root of ")
      .replace(/π/g, " pi ").replace(/²/g, " squared").replace(/³/g, " cubed").replace(/°/g, " degrees")
      .replace(/(\d)\s*\/\s*(\d)/g, "$1 over $2").replace(/\s*…/g, " and so on")
      .replace(/\s+/g, " ").trim();
  }
  function logItems(){
    var log = document.querySelector(".log");
    if (!log) return [];
    return [].filter.call(log.children, function(li){
      return li.offsetParent !== null && !li.classList.contains("veil") && getComputedStyle(li).visibility !== "hidden";
    });
  }
  function stopReading(){
    speaking = false;
    try { window.speechSynthesis.cancel(); } catch (e){}
    [].forEach.call(document.querySelectorAll(".ht-reading"), function(x){ x.classList.remove("ht-reading"); });
    if (readBtn){ readBtn.textContent = "Read aloud"; readBtn.setAttribute("aria-pressed", "false"); }
  }
  function readAloud(){
    if (speaking){ stopReading(); return; }
    var items = logItems();
    if (!items.length){ announce("Nothing to read yet"); return; }
    speaking = true;
    readBtn.textContent = "Stop reading"; readBtn.setAttribute("aria-pressed", "true");
    var i = 0;
    (function next(){
      [].forEach.call(document.querySelectorAll(".ht-reading"), function(x){ x.classList.remove("ht-reading"); });
      if (!speaking || i >= items.length){ stopReading(); return; }
      var li = items[i++];
      li.classList.add("ht-reading");
      if (li.scrollIntoView) li.scrollIntoView({ block:"nearest" });
      var u = new SpeechSynthesisUtterance(spoken(li));
      u.rate = 0.95;
      u.onend = u.onerror = function(){ if (speaking) next(); };
      window.speechSynthesis.speak(u);
    })();
  }
  function addReadButton(){
    if (!("speechSynthesis" in window)) return;
    var heads = document.querySelectorAll(".panel-head h2");
    [].forEach.call(heads, function(h){
      if (!/say it out loud/i.test(h.textContent) || h.parentNode.querySelector(".ht-read")) return;
      readBtn = document.createElement("button");
      readBtn.type = "button"; readBtn.className = "ht-btn ht-read"; readBtn.textContent = "Read aloud";
      readBtn.setAttribute("aria-pressed", "false");
      readBtn.title = "Read the explanation aloud (shortcut: R)";
      readBtn.addEventListener("click", readAloud);
      h.parentNode.appendChild(readBtn);
    });
    window.addEventListener("beforeunload", function(){ try { window.speechSynthesis.cancel(); } catch (e){} });
  }

  /* ===================== recent problems ===================== */
  var recentTimer = null;
  function labelFor(search){
    var u = new URLSearchParams(search), q = u.get("q");
    if (q) return q;
    var bits = [];
    u.forEach(function(v, k){ if (["practice", "embed", "theme"].indexOf(k) < 0) bits.push(k === "mode" || k === "shape" ? v : k + " " + v); });
    return bits.join(" · ");
  }
  function remember(){
    var s = location.search.replace(/([?&])(practice|embed|theme)=[^&]*/g, "$1").replace(/[?&]+$/, "").replace(/\?&+/, "?");
    if (!s || s === "?") return;
    var all = load(RECENT, {}) || {}, list = all[page] || [];
    list = list.filter(function(r){ return r.s !== s; });
    list.unshift({ s:s, l:labelFor(s).slice(0, 80), t:Date.now() });
    all[page] = list.slice(0, 10);
    save(RECENT, all);
  }
  function watchAddress(){
    // the pages keep their address up to date as you type; note the problem once you stop
    ["replaceState", "pushState"].forEach(function(name){
      var orig = history[name];
      if (typeof orig !== "function") return;
      history[name] = function(){
        var r = orig.apply(this, arguments);
        clearTimeout(recentTimer); recentTimer = setTimeout(safe(remember), 1800);
        return r;
      };
    });
    recentTimer = setTimeout(safe(remember), 1800);
  }
  var openMenu = null;
  function closeMenu(){ if (openMenu){ openMenu.remove(); openMenu = null; } }
  function showMenu(anchor, html){
    closeMenu();
    var m = document.createElement("div");
    m.className = "ht-menu"; m.setAttribute("role", "dialog"); m.innerHTML = html;
    document.body.appendChild(m);
    var r = anchor.getBoundingClientRect();
    var left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - m.offsetWidth - 8);
    m.style.left = Math.max(8, left) + "px";
    m.style.top = (r.bottom + window.scrollY + 6) + "px";
    openMenu = m;
    var first = m.querySelector("a, button");
    if (first) first.focus();
    return m;
  }
  function recentMenu(anchor){
    var list = ((load(RECENT, {}) || {})[page] || []);
    var html = "<h3>Recent problems here</h3>" + (list.length
      ? list.map(function(r){ return '<a href="' + esc(page + r.s) + '">' + esc(r.l || r.s) + "</a>"; }).join("")
        + '<button type="button" class="ht-row ht-sm" data-clear="1">Clear this list</button>'
      : '<div class="ht-empty">Nothing yet — problems you work on this page show up here.</div>');
    var m = showMenu(anchor, html);
    var c = m.querySelector("[data-clear]");
    if (c) c.addEventListener("click", function(){
      var all = load(RECENT, {}) || {}; delete all[page]; save(RECENT, all); closeMenu(); announce("Recent list cleared");
    });
  }

  /* ===================== keyboard shortcuts ===================== */
  function helpMenu(anchor){
    showMenu(anchor || document.body, '<div class="ht-help"><h3>Keyboard shortcuts</h3><table>' +
      "<tr><td><kbd>/</kbd></td><td>Jump to the problem box</td></tr>" +
      "<tr><td><kbd>N</kbd></td><td>A new problem (or the next one after a right answer)</td></tr>" +
      "<tr><td><kbd>←</kbd> <kbd>→</kbd></td><td>Back and forward a step in One step at a time</td></tr>" +
      "<tr><td><kbd>R</kbd></td><td>Read the explanation aloud</td></tr>" +
      "<tr><td><kbd>D</kbd></td><td>Switch light and dark</td></tr>" +
      "<tr><td><kbd>+</kbd> <kbd>−</kbd></td><td>Bigger or smaller text</td></tr>" +
      "<tr><td><kbd>B</kbd></td><td>Big screen, for a projector</td></tr>" +
      "<tr><td><kbd>Q</kbd></td><td>A QR code for this page, to open it on a phone</td></tr>" +
      "<tr><td><kbd>K</kbd></td><td>Show or hide the math keys (they come up by themselves on phones)</td></tr>" +
      "<tr><td><kbd>Esc</kbd></td><td>Close this, or leave big screen</td></tr>" +
      "<tr><td><kbd>?</kbd></td><td>Show this list</td></tr></table></div>");
    if (!anchor && openMenu){ openMenu.style.position = "fixed"; openMenu.style.top = "70px"; openMenu.style.left = "50%"; openMenu.style.transform = "translateX(-50%)"; }
  }
  function problemBox(){
    var box = document.querySelector(".problem") || document.querySelector(".page");
    if (!box) return null;
    return [].filter.call(box.querySelectorAll('input[type="text"], input:not([type]), input[type="number"], textarea'), function(i){
      return i.offsetParent !== null && !i.readOnly && !i.disabled;
    })[0] || null;
  }
  function buttonByText(re){
    return [].filter.call(document.querySelectorAll("button"), function(b){ return re.test(b.textContent.trim()); })[0] || null;
  }
  function onKey(e){
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (e.key === "Escape"){
      if (openMenu){ closeMenu(); return; }
      if (root.classList.contains("ht-big")){ setBig(false); return; }
      if (speaking){ stopReading(); return; }
      return;
    }
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    var k = e.key;
    if (k === "/"){ var box = problemBox(); if (box){ e.preventDefault(); box.focus(); if (box.select) box.select(); } }
    else if (k === "n" || k === "N"){
      var nb = document.querySelector(".ht-next:not([hidden])") || buttonByText(/^New problem$/i);
      if (nb){ e.preventDefault(); nb.click(); }
    }
    else if (k === "r" || k === "R"){ if (readBtn){ e.preventDefault(); readAloud(); } }
    else if (k === "d" || k === "D"){ var tb = document.getElementById("themeBtn"); if (tb){ e.preventDefault(); tb.click(); } }
    else if (k === "b" || k === "B"){ e.preventDefault(); setBig(!root.classList.contains("ht-big")); }
    else if (k === "q" || k === "Q"){ e.preventDefault(); closeMenu(); showQR(); }
    else if (k === "+" || k === "="){ e.preventDefault(); setScale(1); }
    else if (k === "-" || k === "_"){ e.preventDefault(); setScale(-1); }
    else if (k === "k" || k === "K"){ e.preventDefault(); togglePad(); }
    else if (k === "?"){ e.preventDefault(); if (openMenu) closeMenu(); else helpMenu(document.getElementById("htKeys")); }
  }

  /* ===================== next problem after a right answer ===================== */
  function onChecked(e){
    var d = e.detail || {};
    if (d.verdict !== "right" || embedded()) return;
    var maker = buttonByText(/^New problem$/i);
    if (!maker) return;
    setTimeout(safe(function(){
      // put the button under the "✓ Correct!" message
      var msg = [].filter.call(document.querySelectorAll("[aria-live]"), function(x){
        return x.offsetParent !== null && /✓|correct/i.test(x.textContent);
      })[0];
      if (!msg) return;
      var old = document.querySelector(".ht-next");
      if (old) old.remove();
      var b = document.createElement("button");
      b.type = "button"; b.className = "ht-next"; b.textContent = "Next problem →";
      b.title = "Another problem with the same settings (shortcut: N)";
      b.addEventListener("click", function(){
        b.remove();
        maker.click();
        setTimeout(function(){ var box = answerBox(); if (box) box.focus(); }, 120);
      });
      msg.parentNode.insertBefore(b, msg.nextSibling);
    }), 60);
  }
  function answerBox(){
    var live = document.querySelector("[aria-live]");
    var box = live && (live.closest("form, section, .ckbox, .try, .check") || live.parentNode);
    if (!box) return null;
    return [].filter.call(box.querySelectorAll("input"), function(i){ return i.offsetParent !== null && !i.readOnly; })[0] || null;
  }


  /* ===================== the maths keypad (phones and tablets) ===================== */
  // the symbols that are awkward to type on a phone, chosen for each page
  var PAD = {
    "addition.html":"+ − / . , space", "subtraction.html":"− + / . , space", "multiplication.html":"× / . , space",
    "division.html":"÷ / . : space", "fractions.html":"/ space . % , − ( )", "percents.html":"% $ . , /",
    "factors.html":", × ^ ²", "integers.html":"− + × ÷ ( ) | ,", "ratios.html":": / = ? x . $ ,",
    "pemdas.html":"+ − × ÷ ( ) ^ ² .", "algebra.html":"x y + − × ÷ ( ) = < > ^ / .",
    "lines.html":"x y ( ) , = + − / .", "geometry.html":". / π √ , °", "stats.html":", . − :",
    "wordproblems.html":". $ / % ,", "flashcards.html":"/ . % − ,"
  };
  var padEl = null, padFor = null, padHide = null;
  function padWanted(){
    if (S.keypad === true) return true;
    if (S.keypad === false) return false;
    return !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }
  function padTarget(el){
    if (!el || el.tagName !== "INPUT" || el.readOnly || el.disabled) return false;
    if (!/^(text|search|)$/i.test(el.getAttribute("type") || "")) return false;
    if (el.closest(".sitenav, .ht-search, .maker, .ht-menu")) return false;   // not the search box or the maker's settings
    return !!el.closest(".page");
  }
  function insertAt(el, text){
    var a = el.selectionStart, b = el.selectionEnd;
    if (typeof a !== "number"){ a = b = el.value.length; }
    if (el.setRangeText) el.setRangeText(text, a, b, "end");
    else el.value = el.value.slice(0, a) + text + el.value.slice(b);
    el.dispatchEvent(new Event("input", { bubbles:true }));
  }
  function padKey(k){
    var el = padFor;
    if (!el) return;
    if (k === "done"){ el.blur(); hidePad(); return; }
    if (k === "back"){
      var a = el.selectionStart, b = el.selectionEnd;
      if (a === b && a > 0) el.setSelectionRange(a - 1, a);
      insertAt(el, ""); return;
    }
    if (k === "left" || k === "right"){
      var p = Math.max(0, Math.min(el.value.length, (el.selectionStart || 0) + (k === "left" ? -1 : 1)));
      el.setSelectionRange(p, p); return;
    }
    insertAt(el, k === "space" ? " " : k);
  }
  function placePad(){
    if (!padEl) return;
    var vv = window.visualViewport, bottom = 0;
    if (vv) bottom = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));   // sit just above the phone's keyboard
    padEl.style.bottom = bottom + "px";
  }
  function showPad(el){
    if (!padWanted()) return;
    clearTimeout(padHide);
    padFor = el;
    if (!padEl){
      padEl = document.createElement("div");
      padEl.className = "ht-pad"; padEl.setAttribute("role", "toolbar"); padEl.setAttribute("aria-label", "Math keys");
      document.body.appendChild(padEl);
      // keep the box focused (and the phone keyboard open) when a key is pressed
      padEl.addEventListener("pointerdown", function(e){ if (e.target.closest("button")) e.preventDefault(); });
      padEl.addEventListener("mousedown", function(e){ if (e.target.closest("button")) e.preventDefault(); });
      padEl.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b) padKey(b.getAttribute("data-k")); });
      if (window.visualViewport){ window.visualViewport.addEventListener("resize", placePad); window.visualViewport.addEventListener("scroll", placePad); }
    }
    var keys = (PAD[page] || "+ − × ÷ / ( ) . = ,").split(" ");
    var label = { space:"space", "^":"xⁿ", "²":"x²" };
    padEl.innerHTML = keys.map(function(k){
      return '<button type="button" data-k="' + esc(k) + '"' + (k === "space" ? ' class="wide"' : "") + ' aria-label="' + esc(k) + '">'
        + esc(label[k] || k) + "</button>";
    }).join("") +
      '<button type="button" data-k="left" aria-label="Move left">←</button>' +
      '<button type="button" data-k="right" aria-label="Move right">→</button>' +
      '<button type="button" data-k="back" aria-label="Delete">⌫</button>' +
      '<button type="button" data-k="done" class="done" aria-label="Done">Done</button>';
    padEl.hidden = false;
    root.classList.add("ht-padding");
    placePad();
  }
  function hidePad(){
    if (padEl) padEl.hidden = true;
    root.classList.remove("ht-padding");
    padFor = null;
  }
  function initPad(){
    document.addEventListener("focusin", safe(function(e){ if (padTarget(e.target)) showPad(e.target); }));
    document.addEventListener("focusout", safe(function(e){
      if (e.target === padFor){ clearTimeout(padHide); padHide = setTimeout(function(){ if (document.activeElement !== padFor) hidePad(); }, 150); }
    }));
  }
  function togglePad(){
    S.keypad = !padWanted(); save(KEY, S);
    if (!S.keypad) hidePad();
    else { var a = document.activeElement; if (padTarget(a)) showPad(a); }
    announce(S.keypad ? "Math keys on" : "Math keys off");
  }

  /* ===================== a QR code for this page ===================== */
  // qr.js sits next to this file; it's fetched the first time a QR code is wanted, not on every page load
  var qrWait = null;
  function qrSrc(){
    var src = SELF;
    if (!src){ var s = document.querySelector('script[src$="tools.js"], script[src*="tools.js?"]'); src = s ? s.src : "tools.js"; }
    return src.replace(/tools\.js([?#].*)?$/, "qr.js");
  }
  function withQR(done){
    if (window.HelperQR){ done(); return; }
    if (qrWait){ qrWait.push(done); return; }
    qrWait = [done];
    var sc = document.createElement("script");
    sc.src = qrSrc(); sc.async = true;
    sc.onload = function(){
      var w = qrWait || []; qrWait = null;
      if (window.HelperQR) w.forEach(function(f){ safe(f)(); }); else announce("Couldn’t load the QR code maker");
    };
    sc.onerror = function(){ qrWait = null; sc.remove(); announce("Couldn’t load the QR code maker. Check the connection and try again."); };
    document.head.appendChild(sc);
  }
  function showQR(){
    withQR(function(){
      var h1 = document.querySelector(".page h1") || document.querySelector("h1"), label = labelFor(location.search);
      window.HelperQR.show(location.href, {
        title:(h1 && h1.textContent.replace(/\s+/g, " ").trim()) || document.title,
        sub:label ? "This problem: " + label.slice(0, 80) : "Open this page on a phone",
        filename:page.replace(/\.html$/, "") + "-qr.svg"
      });
    });
  }

  /* ===================== the bar: search, recent, text size, big screen, shortcuts ===================== */
  function goSearch(text){
    var r = window.HelperSearch && window.HelperSearch.route(text);
    var href = r && !r.none ? r.page + "?" + r.params : "glossary.html?q=" + encodeURIComponent(text);
    location.href = href;
  }
  function addToBar(nav){
    if (nav.querySelector(".ht-search")) return;
    var f = document.createElement("form");
    f.className = "ht-search"; f.setAttribute("role", "search");
    f.innerHTML = '<input type="text" aria-label="Type any problem, or a math word" placeholder="Type any problem…" spellcheck="false" autocomplete="off">';
    f.addEventListener("submit", function(e){ e.preventDefault(); var v = f.firstChild.value.trim(); if (v) goSearch(v); });
    var home = nav.querySelector(".sn-home");
    if (home && home.nextSibling) nav.insertBefore(f, home.nextSibling); else nav.appendChild(f);

    var bar = document.createElement("div");
    bar.className = "ht-bar";
    bar.innerHTML =
      '<button type="button" class="ht-btn" id="htRecent" aria-haspopup="dialog" title="Problems you worked on this page">Recent</button>' +
      '<button type="button" class="ht-btn" id="htSmaller" aria-label="Smaller text" title="Smaller text (−)">A−</button>' +
      '<button type="button" class="ht-btn" id="htBigger" aria-label="Bigger text" title="Bigger text (+)">A+</button>' +
      '<button type="button" class="ht-btn" id="htBig" aria-pressed="false" title="Big screen, for a projector (B)">Big screen</button>' +
      '<button type="button" class="ht-btn" id="htQR" aria-haspopup="dialog" aria-label="QR code for this page" title="A QR code for this page, to open it on a phone (Q)">QR</button>' +
      '<button type="button" class="ht-btn" id="htKeys" aria-haspopup="dialog" aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">?</button>';
    nav.insertBefore(bar, f.nextSibling);
    document.getElementById("htRecent").addEventListener("click", function(e){ e.stopPropagation(); if (openMenu) closeMenu(); else recentMenu(this); });
    document.getElementById("htSmaller").addEventListener("click", function(){ setScale(-1); });
    document.getElementById("htBigger").addEventListener("click", function(){ setScale(1); });
    document.getElementById("htBig").addEventListener("click", function(){ setBig(!root.classList.contains("ht-big")); });
    document.getElementById("htQR").addEventListener("click", safe(showQR));
    document.getElementById("htKeys").addEventListener("click", function(e){ e.stopPropagation(); if (openMenu) closeMenu(); else helpMenu(this); });
  }
  var live = null;
  function announce(t){
    if (!live){
      live = document.createElement("div");
      live.setAttribute("role", "status");
      live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";
      document.body.appendChild(live);
    }
    live.textContent = t;
  }

  /* ===================== start ===================== */
  var main = safe(function(){
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    if (page !== "tests.html") initPad();    // the math keys also help inside practice sets on a phone
    if (passive) return;                     // framed or embedded: nothing else to add, nothing to save
    applySettings();
    watchTheme();
    document.addEventListener("keydown", safe(onKey));
    document.addEventListener("click", function(e){ if (openMenu && !openMenu.contains(e.target)) closeMenu(); });
    document.addEventListener("helper:checked", safe(onChecked));
    if (!document.querySelector(".page")) return;   // the home page: settings only
    addReadButton();
    watchAddress();
    // the bar is drawn by nav.js; wait for it briefly
    var tries = 0;
    (function waitBar(){
      var nav = document.querySelector(".sitenav");
      if (nav) addToBar(nav);
      else if (tries++ < 40) setTimeout(waitBar, 50);
    })();
  });

  window.HelperTools = { settings:function(){ return S; }, setBig:setBig, setScale:setScale, showQR:showQR, words:words, togglePad:togglePad };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();
})();
