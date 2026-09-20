import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { once } from "node:events";
import { createStandaloneServer, fixedSourceIdentity } from "../server/standalone.mjs";
import { readWebsiteBuildIdentity } from "../lib/build-identity.mjs";

const identity = readWebsiteBuildIdentity({ YNX_WEBSITE_SOURCE_COMMIT: "a".repeat(40), YNX_WEBSITE_SOURCE_TREE: "b".repeat(40), YNX_WEBSITE_RELEASE: "standalone-test-1" });
const routingConfig = {
  redirects: [{ source: "/wallet", destination: "/dapp/wallet", permanent: true }, { source: "/square/:path*", destination: "/dapp/square/:path*", permanent: true }],
  rewrites: [{ source: "/downloads/approved.zip", destination: "https://downloads.ynxweb4.com/fixed.zip" }, { source: "/downloads/retired.apk", destination: "/api/retired-download" }, { source: "/(.*)", destination: "/" }],
  headers: [{ source: "/(.*)", headers: [{ key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data:" }] }, { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }, { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-store" }] }],
};

async function fixture(t, options = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ynx-standalone-test-"));
  const distRoot = path.join(root, "dist");
  await fs.mkdir(path.join(distRoot, "assets"), { recursive: true });
  for (const [file, body] of Object.entries({ "index.html": "<!doctype html><title>Home</title>", "docs.html": "<!doctype html><title>Docs</title>", "404.html": "<!doctype html><title>Not found</title>", "assets/main-AbCdEf12.js": "console.log('hashed')", "assets/plain.js": "console.log('plain')", "sw.js": "// worker", "file.bin": "0123456789" })) await fs.writeFile(path.join(distRoot, file), body);
  const server = await createStandaloneServer({ distRoot, sourceIdentity: identity, environment: {}, routingConfig, ...options });
  await server.listenStandalone(0);
  t.after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  return { root, distRoot, server, port: server.address().port };
}

function request(port, target, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: target, method, headers, agent: false }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("error", reject);
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    req.end(body);
  });
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

async function waitFor(predicate) {
  const deadline = Date.now() + 2000;
  while (!predicate()) {
    assert.ok(Date.now() < deadline, "Local requests did not reach the expected state");
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

test("startup freezes exact identity and refuses non-loopback hosts", async (t) => {
  const { server, port, distRoot } = await fixture(t);
  assert.equal(server.address().address, "127.0.0.1");
  assert.throws(() => fixedSourceIdentity({ environment: {} }), /unavailable/);
  assert.throws(() => fixedSourceIdentity({ sourceIdentity: { ...identity, chainId: 1 }, environment: {} }), /chainId/);
  assert.throws(() => fixedSourceIdentity({ sourceIdentity: identity, environment: { YNX_WEBSITE_RELEASE: "conflict" } }), /Conflicting/);
  await assert.rejects(createStandaloneServer({ distRoot, sourceIdentity: identity, environment: {}, host: "0.0.0.0" }), /127.0.0.1/);
  const response = await request(port, "/build-identity.json", { headers: { "If-None-Match": "*" } });
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), identity);
  assert.match(response.headers["cache-control"], /no-store/);
  assert.equal(response.headers.etag, undefined);
  assert.equal((await request(port, "/health", { method: "HEAD" })).body.length, 0);
});

test("raw path traversal, encoded separators, hidden files and symlink escapes fail closed", async (t) => {
  const { root, distRoot, port } = await fixture(t);
  await fs.writeFile(path.join(root, "private.txt"), "PRIVATE_SENTINEL");
  await fs.writeFile(path.join(distRoot, ".env"), "PRIVATE_SENTINEL");
  await fs.writeFile(path.join(distRoot, "source-identity.json"), "PRIVATE_SENTINEL");
  await fs.symlink(path.join(root, "private.txt"), path.join(distRoot, "escape.txt"));
  for (const target of ["/../private.txt", "/%2e%2e/private.txt", "/%252e%252e/private.txt", "/a/%2f../private.txt", "/a%5cb", "/file%00.bin", "/.env", "/a/.git/config", "/%ZZ", "//example.com/file", "/escape.txt", "/source-identity.json"]) {
    const response = await request(port, target);
    assert.ok([400, 404].includes(response.status), target);
    assert.doesNotMatch(response.body.toString(), /PRIVATE_SENTINEL/, target);
    assert.match(response.headers["cache-control"], /no-store/, target);
  }
});

test("clean routes, fixed redirects and retired downloads preserve exact boundaries", async (t) => {
  const { port } = await fixture(t);
  assert.match((await request(port, "/docs")).body.toString(), /Docs/);
  assert.match((await request(port, "/client/route")).body.toString(), /Home/);
  assert.equal((await request(port, "/missing.js")).status, 404);
  assert.equal((await request(port, "/downloads/missing")).status, 404);
  assert.equal((await request(port, "/api/missing")).status, 404);
  const local = await request(port, "/square/feed?lang=ar");
  assert.equal(local.status, 308);
  assert.equal(local.headers.location, "/dapp/square/feed?lang=ar");
  const download = await request(port, "/downloads/approved.zip?url=https://example.invalid");
  assert.equal(download.status, 302);
  assert.equal(download.headers.location, "https://downloads.ynxweb4.com/fixed.zip");
  assert.match(download.headers["cache-control"], /no-store/);
  const retired = await request(port, "/downloads/retired.apk");
  assert.equal(retired.status, 410);
  assert.equal(JSON.parse(retired.body).automaticRedirect, false);
  assert.equal((await request(port, "/", { method: "POST" })).status, 405);
  assert.equal((await request(port, "/", { headers: { "Content-Length": "1" }, body: "x" })).status, 400);
});

test("HTML revalidates, only hashed assets inherit immutable, and HEAD/ETag return no body", async (t) => {
  const { port } = await fixture(t);
  const html = await request(port, "/");
  assert.match(html.headers["cache-control"], /max-age=0.*must-revalidate/);
  assert.equal(html.headers["x-content-type-options"], "nosniff");
  assert.match(html.headers["content-security-policy"], /default-src 'self'/);
  assert.match((await request(port, "/assets/main-AbCdEf12.js")).headers["cache-control"], /immutable/);
  assert.doesNotMatch((await request(port, "/assets/plain.js")).headers["cache-control"], /immutable/);
  assert.match((await request(port, "/sw.js")).headers["cache-control"], /no-store/);
  const unchanged = await request(port, "/", { headers: { "If-None-Match": html.headers.etag } });
  assert.equal(unchanged.status, 304);
  assert.equal(unchanged.body.length, 0);
  const head = await request(port, "/", { method: "HEAD" });
  assert.equal(Number(head.headers["content-length"]), html.body.length);
  assert.equal(head.body.length, 0);
});

test("streaming single ranges, suffix ranges, If-Range dates and invalid ranges are correct", async (t) => {
  const { port, distRoot } = await fixture(t);
  const modified = new Date("2026-09-02T12:00:00Z"); // Wednesday is a valid If-Range HTTP date.
  await fs.utimes(path.join(distRoot, "file.bin"), modified, modified);
  const partial = await request(port, "/file.bin", { headers: { Range: "bytes=2-5" } });
  assert.equal(partial.status, 206);
  assert.equal(partial.body.toString(), "2345");
  assert.equal(partial.headers["content-range"], "bytes 2-5/10");
  assert.equal((await request(port, "/file.bin", { headers: { Range: "bytes=-3" } })).body.toString(), "789");
  const head = await request(port, "/file.bin", { method: "HEAD", headers: { Range: "bytes=2-5" } });
  assert.equal(head.status, 206);
  assert.equal(head.headers["content-length"], "4");
  assert.equal(head.body.length, 0);
  assert.equal((await request(port, "/file.bin", { headers: { Range: "bytes=2-5", "If-Range": modified.toUTCString() } })).status, 206);
  assert.equal((await request(port, "/file.bin", { headers: { Range: "bytes=2-5", "If-Range": '"not-current"' } })).status, 200);
  for (const range of ["bytes=20-30", "bytes=-0", "bytes=5-2", "bytes=0-1,4-5"]) {
    const bad = await request(port, "/file.bin", { headers: { Range: range } });
    assert.equal(bad.status, 416, range);
    assert.equal(bad.headers["content-range"], "bytes */10");
  }
});

test("API HEAD causes no upstream reads; an aborted waiter retains the work slot and allows another waiter", async (t) => {
  let calls = 0, resolveCollection, began;
  const started = new Promise((resolve) => { began = resolve; });
  const gate = new Promise((resolve) => { resolveCollection = resolve; });
  const { server, port } = await fixture(t, { maxApiConcurrent: 1, collectors: { collectNetworkStatus: async (options) => { calls++; began(); await gate; return options; }, collectServiceHealth: async () => ({ services: {} }) } });
  const head = await request(port, "/api/network/status", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(calls, 0);
  const first = http.get({ hostname: "127.0.0.1", port, path: "/api/network/status?view=summary", agent: false });
  first.on("error", () => {});
  await started;
  first.destroy();
  const busy = await request(port, "/api/services/health");
  assert.equal(busy.status, 503);
  assert.equal(busy.headers["retry-after"], "1");
  assert.equal(server.getRuntimeStats().activeApiRequests, 1);
  const survivor = request(port, "/api/network/status?view=summary");
  await waitFor(() => server.getRuntimeStats().activeRequests === 2);
  assert.equal(calls, 1);
  resolveCollection();
  const shared = await survivor;
  assert.equal(shared.status, 200);
  assert.deepEqual(JSON.parse(shared.body), { detailed: false });
  await new Promise((resolve) => setImmediate(resolve));
  const next = await request(port, "/api/network/status?view=summary");
  assert.equal(calls, 2);
  assert.equal(next.status, 200);
  assert.deepEqual(JSON.parse(next.body), { detailed: false });
  assert.match(next.headers["cache-control"], /no-store/);
});

test("32 summary requests share one work slot, preserve checkedAt, and never cache a completed result", { timeout: 5000 }, async (t) => {
  const gate = deferred();
  let calls = 0;
  const original = { checkedAt: "2026-07-22T00:00:00.000Z", degraded: true, summary: { error: "mock source unavailable" } };
  const fresh = { checkedAt: "2026-07-22T00:00:01.000Z", degraded: false, summary: { indexedHeight: 100 } };
  const { server, port } = await fixture(t, { maxConcurrent: 64, maxApiConcurrent: 4, collectors: {
    collectNetworkStatus: () => ++calls === 1 ? gate.promise : fresh,
    collectServiceHealth: () => { throw new Error("Unexpected services collection"); },
  } });
  const heads = await Promise.all(Array.from({ length: 32 }, () => request(port, "/api/network/status?view=summary", { method: "HEAD" })));
  assert.ok(heads.every((response) => response.status === 200 && response.body.length === 0));
  assert.equal(calls, 0);
  const batch = Promise.all(Array.from({ length: 32 }, (_, index) => request(port, `/api/network/status?view=summary&ignored=${index}`)));
  try {
    await waitFor(() => server.getRuntimeStats().activeRequests === 32);
    assert.equal(calls, 1);
    assert.equal(server.getRuntimeStats().activeApiRequests, 1);
  } finally { gate.resolve(original); }
  const responses = await batch;
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.deepEqual(JSON.parse(response.body), original);
    assert.match(response.headers["cache-control"], /no-store/);
    assert.equal(response.headers.etag, undefined);
  }
  const next = await request(port, "/api/network/status?view=summary", { headers: { "If-None-Match": "*" } });
  assert.equal(next.status, 200);
  assert.deepEqual(JSON.parse(next.body), fresh);
  assert.equal(calls, 2);
  assert.equal(server.getRuntimeStats().activeApiRequests, 0);
});

test("collector variants remain distinct and share the four-work limit with unmerged public API requests", { timeout: 5000 }, async (t) => {
  const gates = { summary: deferred(), detail: deferred(), services: deferred(), app: deferred() };
  const calls = { summary: 0, detail: 0, services: 0, app: 0 };
  const collect = (key) => { calls[key]++; return gates[key].promise; };
  const { server, port } = await fixture(t, { maxConcurrent: 64, maxApiConcurrent: 4, collectors: {
    collectNetworkStatus: ({ detailed }) => collect(detailed ? "detail" : "summary"),
    collectServiceHealth: () => collect("services"),
  }, apiHandlers: { "/api/apps/health": async (req, res) => res.status(200).json(await collect("app")) } });
  const targets = ["/api/network/status?view=summary", "/api/network/status", "/api/services/health"];
  const first = Promise.all([...targets, "/api/apps/health"].map((target) => request(port, target)));
  let joined;
  try {
    await waitFor(() => Object.values(calls).every((count) => count === 1));
    assert.equal(server.getRuntimeStats().activeApiRequests, 4);
    joined = Promise.all(targets.map((target) => request(port, target)));
    await waitFor(() => server.getRuntimeStats().activeRequests === 7);
    assert.deepEqual(calls, { summary: 1, detail: 1, services: 1, app: 1 });
    const busy = await request(port, "/api/apps/health");
    assert.equal(busy.status, 503);
    assert.equal(busy.headers["retry-after"], "1");
    assert.equal(calls.app, 1);
    for (const target of targets) assert.equal((await request(port, target, { method: "HEAD" })).status, 200);
    assert.deepEqual(calls, { summary: 1, detail: 1, services: 1, app: 1 });
  } finally {
    for (const [variant, gate] of Object.entries(gates)) gate.resolve({ variant, checkedAt: "2026-07-22T00:00:00.000Z" });
  }
  const responses = [...await first, ...await joined];
  assert.ok(responses.every((response) => response.status === 200));
  assert.deepEqual(responses.map((response) => JSON.parse(response.body).variant), ["summary", "detail", "services", "app", "summary", "detail", "services"]);
  assert.equal(server.getRuntimeStats().activeApiRequests, 0);
  assert.equal((await request(port, "/api/apps/health")).status, 200);
  assert.equal(calls.app, 2);
});

test("a failed shared collection releases its slot and permits a fresh collection", { timeout: 5000 }, async (t) => {
  const gate = deferred();
  let calls = 0;
  const fresh = { checkedAt: "2026-07-22T00:00:02.000Z", summary: { indexedHeight: 101 } };
  const { server, port } = await fixture(t, { maxConcurrent: 64, maxApiConcurrent: 1, collectors: {
    collectNetworkStatus: () => ++calls === 1 ? gate.promise : fresh,
    collectServiceHealth: () => ({ services: {} }),
  } });
  const batch = Promise.all(Array.from({ length: 8 }, () => request(port, "/api/network/status?view=summary")));
  try {
    await waitFor(() => server.getRuntimeStats().activeRequests === 8);
    assert.equal(calls, 1);
    assert.equal(server.getRuntimeStats().activeApiRequests, 1);
  } finally { gate.reject(new Error("Mock collector failure")); }
  const responses = await batch;
  assert.ok(responses.every((response) => response.status === 503 && JSON.parse(response.body).error === "SERVICE_UNAVAILABLE"));
  assert.equal(server.getRuntimeStats().activeApiRequests, 0);
  const retry = await request(port, "/api/network/status?view=summary");
  assert.equal(retry.status, 200);
  assert.deepEqual(JSON.parse(retry.body), fresh);
  assert.equal(calls, 2);
  assert.equal(server.getRuntimeStats().activeApiRequests, 0);
});

test("large downloads keep bounded read buffers and reject excess active streams", async (t) => {
  const { server, port, distRoot } = await fixture(t, { maxConcurrent: 1 });
  const file = await fs.open(path.join(distRoot, "large.bin"), "w");
  await file.truncate(64 * 1024 * 1024);
  await file.close();
  const pending = http.get({ hostname: "127.0.0.1", port, path: "/large.bin", agent: false });
  pending.on("error", () => {});
  const [response] = await once(pending, "response");
  response.pause();
  const busy = await request(port, "/");
  assert.equal(busy.status, 503);
  assert.equal(busy.headers["retry-after"], "1");
  assert.equal(server.getRuntimeStats().activeStreams, 1);
  assert.equal(server.getRuntimeStats().maxObservedStreams, 1);
  assert.equal(server.getRuntimeStats().streamHighWaterMark, 65536);
  response.destroy();
  pending.destroy();
});

test("the current Vercel route and header configuration loads without dependencies", async (t) => {
  const actual = JSON.parse(await fs.readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const { port } = await fixture(t, { routingConfig: actual });
  assert.equal((await request(port, "/health")).status, 200);
});

test('API documentation remains HTML while the fixed public APIs preserve query and cache boundaries',async(t)=>{
 let calls=0;
 const {port,distRoot}=await fixture(t,{apiHandlers:{'/api/explorer/resolve':async(req,res)=>{calls++;res.status(200).json({query:req.query.q});}}});
 await fs.writeFile(path.join(distRoot,'api.html'),'<!doctype html><title>API reference</title>');
 const page=await request(port,'/api');assert.equal(page.status,200);assert.match(page.headers['content-type'],/text\/html/);assert.match(page.body.toString(),/API reference/);
 const head=await request(port,'/api/explorer/resolve?q=6423',{method:'HEAD'});assert.equal(head.status,200);assert.equal(calls,0);
 const search=await request(port,'/api/explorer/resolve?q=ynx1%2Bexample');assert.equal(calls,1);assert.equal(JSON.parse(search.body).query,'ynx1+example');assert.match(search.headers['cache-control'],/no-store/);
 const economic=await request(port,'/api/economics/evidence');assert.equal(economic.status,200);assert.match(economic.headers['cache-control'],/no-store/);
 assert.equal((await request(port,'/api/arbitrary-proxy?url=https://other.example')).status,404);
});
