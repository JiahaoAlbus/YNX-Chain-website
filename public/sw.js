const CACHE_NAME = "ynx-web-shell-v7-website-redesign";
const CACHEABLE_DESTINATIONS = new Set(["font", "image", "script", "style"]);

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
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
    event.respondWith(networkFirst(request));
  }
});

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
