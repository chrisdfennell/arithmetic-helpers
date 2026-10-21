/* Keeps a copy of the site so it works offline once it has been opened.
   Pages are fetched fresh whenever there's a connection (so updates show straight away),
   and the saved copy is used when there isn't. Fonts are saved the first time they load.
   Adding a page: put it in PAGES. Change VERSION to throw away everything saved before. */
var VERSION = "v1";
var CACHE = "helpers-" + VERSION;
var FONTS = "helpers-fonts";
var PAGES = [
  "./", "index.html",
  "addition.html", "subtraction.html", "multiplication.html", "division.html",
  "fractions.html", "percents.html", "factors.html", "integers.html", "ratios.html",
  "pemdas.html", "algebra.html", "lines.html", "geometry.html", "stats.html",
  "worksheet.html", "practice.html", "progress.html", "glossary.html", "tests.html",
  "nav.js", "progress.js", "glossary.js", "manifest.webmanifest",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  // save each file on its own, so one missing page doesn't stop the rest being saved
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(PAGES.map(function(u){ return c.add(u).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE && k !== FONTS; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // fonts: use the saved copy if there is one, otherwise fetch it and save it
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    e.respondWith(caches.open(FONTS).then(function(c){
      return c.match(req).then(function(hit){
        return hit || fetch(req).then(function(res){ c.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // the site's own files: fresh when online, saved copy when offline
  e.respondWith(fetch(req).then(function(res){
    if (res && res.ok){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){
        // a page opened with ?q=… is saved once, under its plain address
        var key = url.search ? new Request(url.origin + url.pathname) : req;
        c.put(key, copy);
      });
    }
    return res;
  }).catch(function(){
    return caches.match(req, { ignoreSearch:true }).then(function(hit){
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("index.html");
      return new Response("", { status:504, statusText:"Offline" });
    });
  }));
});
