const CACHE_PREFIX = "ynx-web-shell-";
const CACHE_NAME = "ynx-web-shell-v9-scoped-cleanup";
const CACHEABLE_DESTINATIONS = new Set(["font", "image", "script", "style"]);

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/") || url.pathname === "/build-identity.json" || request.cache === "no-store") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (CACHEABLE_DESTINATIONS.has(request.destination)) {
    // Vite names are content-hashed. Their URL changes whenever bytes change.
    event.respondWith(/^\/assets\/.+-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2?)$/.test(url.pathname) ? immutableAsset(request) : networkFirst(request));
  }
});

async function immutableAsset(request) {
  const cached = await caches.match(request);
  return cached || networkFirst(request);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && !/no-store/i.test(response.headers.get("cache-control") || "")) {
      try { await (await caches.open(CACHE_NAME)).put(request, response.clone()); } catch { /* Cache capacity must never discard a fresh network response. */ }
    }
    return response;
  } catch {
    return (await caches.match(request)) || Response.error();
  }
}
