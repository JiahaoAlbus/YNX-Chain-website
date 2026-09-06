#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { readWebsiteBuildIdentity } from "../lib/build-identity.mjs";
import { collectNetworkStatus, collectServiceHealth } from "./network-status.mjs";

import appHealthHandler from "../api/apps/health.js";
import squareFeedHandler from "../api/apps/square/feed.js";
import squarePostHandler from "../api/apps/square/post.js";
import explorerResolveHandler from "../api/explorer/resolve.js";
import economicsHandler from "../api/economics/evidence.js";
const PUBLIC_API_HANDLERS = Object.freeze({"/api/apps/health": appHealthHandler, "/api/apps/square/feed": squareFeedHandler, "/api/apps/square/post": squarePostHandler, "/api/explorer/resolve": explorerResolveHandler, "/api/economics/evidence": economicsHandler});

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const NO_STORE = "no-store, max-age=0";
const REVALIDATE = "public, max-age=0, must-revalidate";
const IMMUTABLE = "public, max-age=31536000, immutable";
const TEXT_EXTENSIONS = new Set([".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".webmanifest", ".txt", ".md", ".csv"]);
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".xml": "application/xml; charset=utf-8", ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".csv": "text/csv; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".ico": "image/vnd.microsoft.icon",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".pdf": "application/pdf", ".zip": "application/zip", ".gz": "application/gzip",
  ".apk": "application/vnd.android.package-archive", ".exe": "application/vnd.microsoft.portable-executable", ".dmg": "application/x-apple-diskimage",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg", ".wasm": "application/wasm",
};

export function fixedSourceIdentity({ sourceIdentity, identityFile, environment = process.env } = {}) {
  const file = identityFile || environment.YNX_WEBSITE_IDENTITY_FILE;
  const input = sourceIdentity || (file ? JSON.parse(fs.readFileSync(file, "utf8")) : null);
  if (!input) return readWebsiteBuildIdentity(environment);
  const identity = readWebsiteBuildIdentity({
    YNX_WEBSITE_SOURCE_COMMIT: input.sourceCommit,
    YNX_WEBSITE_SOURCE_TREE: input.sourceTree,
    YNX_WEBSITE_RELEASE: input.release,
  });
  for (const key of ["schemaVersion", "chainId", "chainIdHex", "nativeAsset"]) {
    if (input[key] !== identity[key]) throw new Error(`Invalid source identity: ${key}`);
  }
  for (const [key, envKey] of [["sourceCommit", "YNX_WEBSITE_SOURCE_COMMIT"], ["sourceTree", "YNX_WEBSITE_SOURCE_TREE"], ["release", "YNX_WEBSITE_RELEASE"]]) {
    if (environment[envKey] && environment[envKey] !== identity[key]) throw new Error(`Conflicting source identity: ${key}`);
  }
  return identity;
}

function boundedInteger(value, fallback, maximum) {
  const number = value === undefined || value === "" ? fallback : Number(value);
  if (!Number.isInteger(number) || number < 1 || number > maximum) throw new Error(`Expected an integer between 1 and ${maximum}`);
  return number;
}

// Inspect the raw target before URL normalisation can erase dot segments.
export function parseRequestTarget(target) {
  if (typeof target !== "string" || target.length > 8192 || !target.startsWith("/") || target.startsWith("//") || /[\x00-\x20\x7f\\#]/.test(target)) throw new Error("Invalid request target");
  const queryAt = target.indexOf("?");
  const rawPath = queryAt < 0 ? target : target.slice(0, queryAt);
  if (/%(?:2f|5c)/i.test(rawPath)) throw new Error("Encoded separator");
  const pathname = decodeURIComponent(rawPath);
  if (/[\x00-\x20\x7f\\%]/.test(pathname) || pathname.includes("//") || pathname.split("/").some((segment) => segment.startsWith("."))) throw new Error("Forbidden path");
  return { pathname, search: queryAt < 0 ? "" : target.slice(queryAt), query: new URLSearchParams(queryAt < 0 ? "" : target.slice(queryAt + 1)) };
}

function routeMatcher(source) {
  if (source === "/(.*)") return () => "";
  for (const suffix of ["/:path*", "/(.*)"]) {
    if (source.endsWith(suffix)) {
      const prefix = source.slice(0, -suffix.length);
      return (pathname) => pathname === prefix ? "" : pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length + 1) : null;
    }
  }
  if (!source.startsWith("/") || /[:*()]/.test(source)) throw new Error(`Unsupported configured route: ${source}`);
  return (pathname) => pathname === source ? "" : null;
}

function compileRouting(configuration) {
  const headers = (configuration.headers || []).map((entry) => ({ ...entry, match: routeMatcher(entry.source) }));
  const redirects = (configuration.redirects || []).map((entry) => {
    if (!entry.destination.startsWith("/") || entry.destination.startsWith("//")) throw new Error("Only configured local redirects are supported");
    return { ...entry, match: routeMatcher(entry.source) };
  });
  const rewrites = new Map();
  for (const entry of configuration.rewrites || []) {
    if (entry.source === "/(.*)" && entry.destination === "/") continue;
    if (/[:*()]/.test(entry.source) || !entry.source.startsWith("/")) throw new Error("Rewrite sources must be exact paths");
    if (entry.destination.startsWith("https://")) {
      const target = new URL(entry.destination);
      if (target.username || target.password || target.hash || !entry.source.startsWith("/downloads/")) throw new Error("Invalid configured download destination");
    } else if (!entry.destination.startsWith("/") || entry.destination.startsWith("//")) throw new Error("Unsupported configured rewrite destination");
    rewrites.set(entry.source, entry.destination);
  }
  return { headers, redirects, rewrites };
}

function acceptsEncoding(header, encoding) {
  const values = new Map();
  for (const item of String(header || "").toLowerCase().split(",")) {
    const [name, ...parameters] = item.trim().split(";");
    if (!name) continue;
    const quality = parameters.find((part) => part.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    values.set(name, Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0);
  }
  if (values.has(encoding)) return values.get(encoding);
  if (encoding === "identity") return values.get("*") === 0 ? 0 : 1;
  return values.get("*") || 0;
}

function byteRange(value, size) {
  if (value.length > 128 || !/^bytes=\d*-\d*$/.test(value)) return null;
  const [first, last] = value.slice(6).split("-");
  if (!first && !last) return null;
  let start = first ? Number(first) : Math.max(0, size - Number(last));
  let end = first && last ? Number(last) : size - 1;
  if (!first && Number(last) === 0) return null;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return null;
  return { start, end: Math.min(end, size - 1) };
}

function matchesEtag(value, etag) {
  return String(value || "").split(",").some((candidate) => candidate.trim() === "*" || candidate.trim().replace(/^W\//, "") === etag.replace(/^W\//, ""));
}

export async function createStandaloneServer(options = {}) {
  const environment = options.environment || process.env;
  const host = options.host || environment.HOST || "127.0.0.1";
  if (host !== "127.0.0.1") throw new Error("Standalone website must bind to HOST=127.0.0.1");
  const distRoot = await fsp.realpath(options.distRoot || environment.YNX_WEBSITE_DIST || path.join(ROOT, "dist"));
  if (!(await fsp.stat(path.join(distRoot, "index.html"))).isFile()) throw new Error("dist/index.html is required");
  const identity = fixedSourceIdentity({ ...options, environment });
  const configuration = options.routingConfig || JSON.parse(await fsp.readFile(options.configPath || environment.YNX_WEBSITE_CONFIG || path.join(ROOT, "vercel.json"), "utf8"));
  const routing = compileRouting(configuration);
  const maxConcurrent = boundedInteger(options.maxConcurrent ?? environment.YNX_WEBSITE_MAX_CONCURRENT, 32, 128);
  const maxApiConcurrent = boundedInteger(options.maxApiConcurrent ?? environment.YNX_WEBSITE_MAX_API_CONCURRENT, 4, 8);
  const highWaterMark = 64 * 1024;
  const collectors = options.collectors || { collectNetworkStatus, collectServiceHealth };
  const collectionFlights = new Map();
  // Keep the public stats field name; it counts actual API work, not waiters
  // joining one of the three fixed collector variants.
  const stats = { activeRequests: 0, activeApiRequests: 0, activeStreams: 0, maxObservedStreams: 0, maxConcurrent, maxApiConcurrent, streamHighWaterMark: highWaterMark };
  let manifest = {};
  const manifestFile = options.assetManifestPath || environment.YNX_WEBSITE_ASSET_MANIFEST || path.join(path.dirname(distRoot), "asset-manifest.json");
  try {
    if ((await fsp.stat(manifestFile)).size > 8 * 1024 * 1024) throw new Error("Asset manifest is too large");
    manifest = JSON.parse(await fsp.readFile(manifestFile, "utf8")).files || {};
  } catch (error) { if (error.code !== "ENOENT") throw error; }

  function acquireCollectionFlight(key, collect) {
    const existing = collectionFlights.get(key);
    if (existing) return existing;
    if (stats.activeApiRequests >= maxApiConcurrent) return null;
    stats.activeApiRequests += 1;
    const promise = Promise.resolve().then(collect).finally(() => {
      if (collectionFlights.get(key) === promise) collectionFlights.delete(key);
      stats.activeApiRequests -= 1;
    });
    collectionFlights.set(key, promise);
    return promise;
  }

  function headers(response, pathname) {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    for (const entry of routing.headers) if (entry.match(pathname) !== null) {
      for (const { key, value } of entry.headers) response.setHeader(key, value);
    }
  }

  function json(request, response, status, payload, extra = {}) {
    if (response.destroyed) return;
    const body = Buffer.from(JSON.stringify(payload));
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": NO_STORE, "Content-Length": body.length, ...extra });
    response.end(request.method === "HEAD" ? undefined : body);
  }

  async function fileAt(relative) {
    const candidate = path.resolve(distRoot, `.${relative}`);
    if (!candidate.startsWith(`${distRoot}${path.sep}`)) return null;
    try {
      const real = await fsp.realpath(candidate);
      // Reject symlinks, including symlinks to another file inside the release.
      if (real !== candidate) return null;
      const stat = await fsp.stat(real);
      return stat.isFile() ? { path: real, stat, relative } : null;
    } catch (error) {
      if (["ENOENT", "ENOTDIR", "EACCES", "ELOOP"].includes(error.code)) return null;
      throw error;
    }
  }

  async function serveFile(request, response, original, status = 200) {
    const extension = path.extname(original.relative).toLowerCase();
    const compressible = TEXT_EXTENSIONS.has(extension);
    let selected = original;
    let encoding = "identity";
    if (compressible) response.setHeader("Vary", "Accept-Encoding");
    const variants = [{ encoding: "identity", quality: acceptsEncoding(request.headers["accept-encoding"], "identity"), file: original }];
    if (compressible && !request.headers.range) {
      for (const [name, suffix] of [["br", ".br"], ["gzip", ".gz"]]) {
        const quality = acceptsEncoding(request.headers["accept-encoding"], name);
        if (quality > 0) {
          const file = await fileAt(original.relative + suffix);
          if (file) variants.unshift({ encoding: name, quality, file });
        }
      }
    }
    const chosen = variants.filter((variant) => variant.quality > 0).sort((a, b) => b.quality - a.quality || (a.encoding === "br" ? -1 : b.encoding === "br" ? 1 : a.encoding === "gzip" ? -1 : 1))[0];
    if (!chosen) return json(request, response, 406, { error: "ENCODING_NOT_ACCEPTABLE" });
    ({ file: selected, encoding } = chosen);
    if (encoding !== "identity") response.setHeader("Content-Encoding", encoding);
    const metadata = manifest[selected.relative];
    const etag = metadata?.bytes === selected.stat.size && /^[a-f0-9]{64}$/.test(metadata.sha256 || "")
      ? `"${metadata.sha256}"`
      : `W/"${selected.stat.size.toString(16)}-${selected.stat.mtimeMs.toString(16)}-${encoding}"`;
    const configuredCache = String(response.getHeader("Cache-Control") || "");
    const hashed = /\/sha256-[a-f0-9]{64}\//.test(original.relative) || /^\/assets\/.+[-.][A-Za-z0-9_-]{8,}\.[a-z0-9]+$/.test(original.relative);
    const cache = status !== 200 || request.headers.authorization || /no-store/i.test(configuredCache) ? NO_STORE
      : extension === ".html" ? REVALIDATE
        : hashed || (/immutable/.test(configuredCache) && !original.relative.startsWith("/assets/")) ? IMMUTABLE : REVALIDATE;
    response.setHeader("Cache-Control", cache);
    response.setHeader("Content-Type", MIME[extension] || "application/octet-stream");
    response.setHeader("ETag", etag);
    response.setHeader("Last-Modified", selected.stat.mtime.toUTCString());
    response.setHeader("Accept-Ranges", "bytes");
    const modifiedSince = Date.parse(request.headers["if-modified-since"] || "");
    if (status === 200 && (matchesEtag(request.headers["if-none-match"], etag) || (!request.headers["if-none-match"] && Number.isFinite(modifiedSince) && Math.floor(selected.stat.mtimeMs / 1000) * 1000 <= modifiedSince))) {
      response.writeHead(304);
      return response.end();
    }
    let range;
    if (status === 200 && request.headers.range) {
      const ifRange = request.headers["if-range"];
      const rangeMatches = !ifRange || (!etag.startsWith("W/") && ifRange === etag) || (!ifRange.startsWith('"') && !ifRange.startsWith("W/") && Number.isFinite(Date.parse(ifRange)) && Math.floor(selected.stat.mtimeMs / 1000) * 1000 <= Date.parse(ifRange));
      if (rangeMatches) {
        range = byteRange(request.headers.range, selected.stat.size);
        if (!range) return json(request, response, 416, { error: "RANGE_NOT_SATISFIABLE" }, { "Content-Range": `bytes */${selected.stat.size}` });
        status = 206;
        response.setHeader("Content-Range", `bytes ${range.start}-${range.end}/${selected.stat.size}`);
      }
    }
    response.setHeader("Content-Length", range ? range.end - range.start + 1 : selected.stat.size);
    response.writeHead(status);
    if (request.method === "HEAD" || selected.stat.size === 0) return response.end();
    stats.activeStreams += 1;
    stats.maxObservedStreams = Math.max(stats.maxObservedStreams, stats.activeStreams);
    try {
      await pipeline(fs.createReadStream(selected.path, { highWaterMark, ...range }), response);
    } finally { stats.activeStreams -= 1; }
  }

  async function handle(request, response) {
    headers(response, "/");
    if (!["GET", "HEAD"].includes(request.method)) return json(request, response, 405, { error: "METHOD_NOT_ALLOWED" }, { Allow: "GET, HEAD", Connection: "close" });
    if (request.headers["transfer-encoding"] || Number(request.headers["content-length"] || 0) > 0) return json(request, response, 400, { error: "REQUEST_BODY_NOT_ALLOWED" }, { Connection: "close" });
    let target;
    try { target = parseRequestTarget(request.url); } catch { return json(request, response, 400, { error: "INVALID_PATH" }); }
    let { pathname } = target;
    headers(response, pathname);
    if (pathname === "/health") return json(request, response, 200, { ok: true, service: "ynx-website", release: identity.release, sourceCommit: identity.sourceCommit });
    if (["/build-identity.json", "/api/build-identity"].includes(pathname)) return json(request, response, 200, identity);
    if (["/source-identity.json", "/asset-manifest.json", "/package-manifest.json"].includes(pathname)) return json(request, response, 404, { error: "NOT_FOUND" });
    if (["/api/network/status", "/api/services/health"].includes(pathname)) {
      if (request.method === "HEAD") { response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": NO_STORE }); return response.end(); }
      const network = pathname === "/api/network/status";
      const detailed = target.query.get("view") !== "summary";
      const key = network ? (detailed ? "network-detail" : "network-summary") : "services";
      const pending = acquireCollectionFlight(key, () => network ? collectors.collectNetworkStatus({ detailed }) : collectors.collectServiceHealth());
      if (!pending) return json(request, response, 503, { error: "SERVER_BUSY" }, { "Retry-After": "1" });
      return json(request, response, 200, await pending);
    }
    if (Object.hasOwn(PUBLIC_API_HANDLERS, pathname)) {
      if (request.method === "HEAD") { response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": NO_STORE }); return response.end(); }
      if (stats.activeApiRequests >= maxApiConcurrent) return json(request, response, 503, { error: "SERVER_BUSY" }, { "Retry-After": "1" });
      stats.activeApiRequests += 1;
      try {
        request.query = Object.fromEntries(target.query);
        let status = 200;
        const adapter = {
          setHeader: (name, value) => { if (!response.destroyed) response.setHeader(name, value); },
          status: value => { status = value; return adapter; },
          json: payload => json(request, response, status, payload),
        };
        return await (options.apiHandlers?.[pathname] || PUBLIC_API_HANDLERS[pathname])(request, adapter);
      } finally { stats.activeApiRequests -= 1; }
    }
    for (const redirect of routing.redirects) {
      const tail = redirect.match(pathname);
      if (tail !== null) {
        const destination = redirect.destination.replace(":path*", tail);
        response.writeHead(redirect.permanent ? 308 : 307, { Location: encodeURI(destination) + target.search, "Cache-Control": REVALIDATE });
        return response.end();
      }
    }
    const visited = new Set();
    while (routing.rewrites.has(pathname)) {
      if (visited.has(pathname) || visited.size >= 8) throw new Error("Configured rewrite cycle");
      visited.add(pathname);
      const destination = routing.rewrites.get(pathname);
      if (destination.startsWith("https://")) {
        response.writeHead(302, { Location: destination, "Cache-Control": NO_STORE });
        return response.end();
      }
      pathname = destination;
    }
    if (pathname === "/api/retired-download") return json(request, response, 410, { code: "CLIENT_RETIRED", message: "YNX Shop for Android is retired and is no longer distributed.", replacementUrl: "https://shop.ynxweb4.com/shop/", automaticRedirect: false }, { Link: '<https://shop.ynxweb4.com/shop/>; rel="alternate"' });
    if (pathname.startsWith("/api/")) return json(request, response, 404, { error: "NOT_FOUND" });
    const candidates = pathname.endsWith("/") ? [`${pathname}index.html`] : [pathname, `${pathname}.html`, `${pathname}/index.html`];
    for (const relative of candidates) {
      const file = await fileAt(relative);
      if (file) return serveFile(request, response, file);
    }
    if (!path.extname(pathname) && !/^\/(downloads|releases|docs-authority|assets)(\/|$)/.test(pathname)) return serveFile(request, response, await fileAt("/index.html"));
    const notFound = await fileAt("/404.html");
    if (notFound) return serveFile(request, response, notFound, 404);
    return json(request, response, 404, { error: "NOT_FOUND" });
  }

  const server = http.createServer({ maxHeaderSize: 16 * 1024, requestTimeout: 15000, headersTimeout: 10000, keepAliveTimeout: 5000 }, async (request, response) => {
    if (stats.activeRequests >= maxConcurrent) { headers(response, "/"); return json(request, response, 503, { error: "SERVER_BUSY" }, { "Retry-After": "1", Connection: "close" }); }
    stats.activeRequests += 1;
    try { await handle(request, response); }
    catch (error) {
      if (!response.headersSent) json(request, response, 503, { error: "SERVICE_UNAVAILABLE" });
      else if (!response.destroyed) response.destroy();
      if (options.onError && !["ERR_STREAM_PREMATURE_CLOSE", "ECONNRESET"].includes(error.code)) options.onError(error);
    } finally { stats.activeRequests -= 1; }
  });
  server.maxConnections = 128;
  server.maxRequestsPerSocket = 100;
  server.getRuntimeStats = () => ({ ...stats });
  server.sourceIdentity = identity;
  server.listenStandalone = (port = boundedInteger(environment.PORT, 18880, 65535)) => new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => { server.off("error", reject); resolve(server); });
  });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 3) throw new Error("Usage: node server/standalone.mjs [dist-directory]");
    const server = await createStandaloneServer({ distRoot: process.argv[2] });
    await server.listenStandalone();
    process.stdout.write(`${JSON.stringify({ event: "listening", address: server.address(), sourceIdentity: server.sourceIdentity })}\n`);
    for (const signal of ["SIGTERM", "SIGINT"]) process.once(signal, () => {
      server.close(() => process.exit(0));
      setTimeout(() => { server.closeAllConnections(); process.exit(0); }, 10000).unref();
    });
  } catch (error) { process.stderr.write(`Standalone startup failed: ${error.message}\n`); process.exitCode = 1; }
}
