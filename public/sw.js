const CACHE_PREFIX = "ynx-web-shell-";
const CACHE_NAME = "ynx-web-shell-v10-resource-mime";
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
    // Direct evidence/download/file links are resources, not offline HTML pages.
    if (!new RegExp("^/((?!api/|downloads/|(?:assets|releases|docs-authority|document-library|learning-search|third-party)(?:/|$)|.*[.]).*)$").test(url.pathname)) return;
    event.respondWith(networkFirst(request));
    return;
  }
  if (CACHEABLE_DESTINATIONS.has(request.destination)) {
    // Vite names are content-hashed. Their URL changes whenever bytes change.
    event.respondWith(/^\/assets\/.+-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2?)$/.test(url.pathname) ? immutableAsset(request) : networkFirst(request));
  }
});

function expectedMime(request, response) {
  const type = (response.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (request.mode === "navigate") return type === "text/html" || type === "application/xhtml+xml";
  if (request.destination === "script") return /^(?:text|application)\/(?:javascript|ecmascript|x-javascript)$/.test(type);
  if (request.destination === "style") return type === "text/css";
  if (request.destination === "image") return /^image\/[a-z0-9.+-]+$/.test(type);
  if (request.destination === "font") return /^font\/(?:woff2?|ttf|otf|collection|sfnt)$/.test(type) || /^(?:application\/(?:font-woff|vnd\.ms-fontobject|x-font-(?:woff|ttf|opentype)))$/.test(type);
  return false;
}

function cacheableResponse(request, response) {
  return response.ok && expectedMime(request, response) && !/no-store/i.test(response.headers.get("cache-control") || "");
}

async function ownCachedResponse(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(request);
    if (!response) return { response: null, invalid: false };
    if (cacheableResponse(request, response)) return { response, invalid: false };
    try { await cache.delete(request); } catch { /* A rejected entry is never served, even if deletion fails. */ }
    return { response: null, invalid: true };
  } catch {
    return { response: null, invalid: false };
  }
}

async function immutableAsset(request) {
  const cached = await ownCachedResponse(request);
  return cached.response || networkFirst(request, cached.invalid);
}

async function networkFirst(request, reload = false) {
  try {
    let response = await fetch(request, reload ? { cache: "reload" } : undefined);
    // An old HTTP cache may contain a homepage under a chunk URL. Bypass it once.
    if (!expectedMime(request, response) && !reload) response = await fetch(request, { cache: "reload" });
    if (!expectedMime(request, response)) throw new Error("Unexpected resource MIME type");
    if (cacheableResponse(request, response)) {
      try { await (await caches.open(CACHE_NAME)).put(request, response.clone()); } catch { /* Cache capacity must never discard a fresh network response. */ }
    }
    return response;
  } catch {
    return (await ownCachedResponse(request)).response || Response.error();
  }
}
