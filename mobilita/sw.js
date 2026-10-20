// Service worker di Mobilità: tiene l'app disponibile offline.
// VERSION viene sostituita da build.mjs a ogni build: cambia la cache e fa partire l'aggiornamento.
const VERSION = "606fadcc6e5a";
const CACHE = "mobilita-" + VERSION;
const SHELL = [
  "./",
  "index.html",
  "style.css",
  "fig.js",
  "app.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "fonts/fraunces-latin-400-normal.woff2",
  "fonts/fraunces-latin-600-normal.woff2",
  "fonts/nunito-latin-400-normal.woff2",
  "fonts/nunito-latin-600-normal.woff2",
  "fonts/nunito-latin-700-normal.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("mobilita-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

// prima la cache (avvio istantaneo e offline), la rete solo per ciò che manca
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).catch(() => (req.mode === "navigate" ? caches.match("index.html") : Response.error()));
    })
  );
});
