const CACHE_NAME = "khasi-standalone-v10";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",
  "/apple-touch-icon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/.well-known/assetlinks.json"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
