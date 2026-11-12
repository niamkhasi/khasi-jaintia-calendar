const CACHE_NAME = "khasi-calendar-offline-v14";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/khasi-jaintia-logo-2026.png",
  "/logo.png",
  "/apple-touch-icon.png",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/.well-known/assetlinks.json"
];

// Install: Pre-cache essential app shell
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn("Pre-cache partially skipped:", err);
      });
    })
  );
});

// Activate: Remove stale caches & claim clients immediately
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

// Fetch: Stale-While-Revalidate & offline fallback
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Only handle HTTP/HTTPS GET requests
  if (req.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Bypass Firebase Firestore, Auth, AdSense and Monetag live endpoints so SDK manages its own state
  if (
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com") ||
    url.hostname.includes("securetoken.googleapis.com") ||
    url.hostname.includes("firebaseio.com") ||
    url.hostname.includes("pagead2.googlesyndication.com") ||
    url.hostname.includes("googleads.g.doubleclick.net") ||
    url.hostname.includes("adservice.google.com") ||
    url.hostname.includes("googlesyndication.com") ||
    url.hostname.includes("nap5k.com") ||
    url.hostname.includes("monetag.com")
  ) {
    return;
  }

  // Navigation requests (HTML page loads): Try network, fallback to cached /index.html if offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // OFFLINE: Return cached index.html or root so app opens without blank screen!
          return caches.match("/index.html").then((cached) => cached || caches.match("/"));
        })
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images, manifest):
  // Check cache first; if found, return it and update cache in background.
  // If not found, fetch from network and cache for next offline use.
  e.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate cache if online
        fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              caches.open(CACHE_NAME).then((c) => c.put(req, networkRes));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache: fetch from network and store in cache
      return fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // Return offline placeholder or empty response
          return new Response("", { status: 408, statusText: "Offline" });
        });
    })
  );
});

