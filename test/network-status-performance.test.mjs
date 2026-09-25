import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate as nextTurn } from "node:timers/promises";
import { collectNetworkStatus, collectServiceHealth } from "../server/network-status.mjs";
import { YNX_SERVICE_DIRECTORY as directory } from "../src/lib/api/ynxApi.js";

const identityUrls = [directory.rpc.healthEndpoint, directory.explorer.healthEndpoint, directory.evm.healthEndpoint];
function validBody(url, height = 100) {
  if (url === identityUrls[0]) return { chainId: 6423, nativeCurrencySymbol: "YNXT", height, latestBlockHash: "a".repeat(64), latestBlockTime: new Date(Date.now() - 8000).toISOString() };
  if (url === identityUrls[1]) return { ok: true, network: { chainId: 6423 }, rpcHeight: height, indexedHeight: height, indexerOk: true, indexedTxCount: 12 };
  if (url === identityUrls[2]) return { jsonrpc: "2.0", id: 1, result: "0x1917" };
  return { ok: true, records: [] };
}
function mockUpstream(t, getBody = url => validBody(url)) {
  const stats = { calls: [], active: 0, peak: 0 };
  t.mock.method(globalThis, "fetch", async (url, init) => {
    stats.calls.push({ url, init }); stats.active++;
    stats.peak = Math.max(stats.peak, stats.active);
    return { ok: true, status: 200, json: async () => {
      try { await nextTurn(); return await getBody(url, init); }
      finally { stats.active--; }
    } };
  });
  return stats;
}

test("100 simultaneous visitors share three fast reads; single-snapshot growth remains unverified", async t => {
  let height = 100;
  const stats = mockUpstream(t, url => validBody(url, height));
  const started = performance.now();
  const results = await Promise.all(Array.from({ length: 100 }, () => collectNetworkStatus({ detailed: false })));
  assert.ok(performance.now() - started < 1000, "collector must not wait for a progression timer");
  assert.equal(stats.calls.length, 3); assert.ok(stats.peak <= 2);
  assert.deepEqual(stats.calls.map(call => call.url).sort(), [...identityUrls].sort());
  for (const result of results) {
    assert.equal(result, results[0]); assert.equal(result.ok, false); assert.equal(result.degraded, true);
    assert.equal(result.chainVerified, true); assert.equal(result.indexerVerified, true); assert.equal(result.progressionVerified, false);
    assert.equal(result.observations.progressionState, "unverified"); assert.equal(result.indexerLagBlocks, 0);
    assert.ok(Number.isFinite(result.observations.rpcCollectionMs)); assert.ok(Number.isFinite(result.observations.blockAgeMs));
    assert.equal(result.serviceDirectory.rpc.officialUrl, "https://rpc-testnet.ynxweb4.com");
    assert.equal(result.serviceDirectory.rpc.compatibilityUrl, "https://rpc.ynxweb4.com");
    assert.deepEqual(result.latestBlocks, {}); assert.deepEqual(result.latestTransactions, {}); assert.deepEqual(result.validators, {});
  }
  assert.ok(stats.calls.every(call => call.init.cache === "no-store" && call.init.signal instanceof AbortSignal));
  const evm = stats.calls.find(call => call.url === identityUrls[2]);
  assert.equal(evm.init.method, "POST"); assert.equal(JSON.parse(evm.init.body).method, "eth_chainId");
  height = 101;
  const fresh = await collectNetworkStatus({ detailed: false });
  assert.equal(stats.calls.length, 6); assert.equal(fresh.status.height, 101); assert.notEqual(fresh, results[0]);
});

test("chain identity remains distinct when Explorer Indexer lags", async t => {
  mockUpstream(t, url => url === identityUrls[1]
    ? { ...validBody(url), indexedHeight: 98, indexerOk: false }
    : validBody(url));
  const result = await collectNetworkStatus({ detailed: false });
  assert.equal(result.chainVerified, true); assert.equal(result.indexerVerified, false);
  assert.equal(result.indexerLagBlocks, 2); assert.equal(result.ok, false);
  assert.match(result.degradedReason, /Indexer/);
});

test("missing block time leaves age unknown and never proves growth", async t => {
  mockUpstream(t, url => url === identityUrls[0] ? { ...validBody(url), latestBlockTime: null } : validBody(url));
  const result = await collectNetworkStatus({ detailed: false });
  assert.equal(result.chainVerified, true); assert.equal(result.indexerVerified, true);
  assert.equal(result.observations.blockAgeMs, null);
  assert.equal(result.observations.progressionState, "unverified"); assert.equal(result.ok, false);
});

test("slow EVM read is measured separately from block age and does not claim a stall", async t => {
  mockUpstream(t, async url => {
    if (url === identityUrls[2]) await new Promise(resolve => setTimeout(resolve, 25));
    return validBody(url);
  });
  const result = await collectNetworkStatus({ detailed: false });
  assert.equal(result.chainVerified, true); assert.equal(result.observations.evmReadState, "ok");
  assert.ok(result.observations.evmCollectionMs >= 20);
  assert.equal(result.observations.progressionState, "unverified");
  assert.equal(result.ok, false);
});

test("summary, detail and services share a global two-read limit across visitor bursts", async t => {
  const stats = mockUpstream(t);
  const results = await Promise.all(Array.from({ length: 100 }, () => Promise.all([
    collectNetworkStatus({ detailed: false }), collectNetworkStatus({ detailed: true }), collectServiceHealth(),
  ])));
  assert.equal(stats.calls.length, 3 + 6 + 5); assert.ok(stats.peak <= 2, `observed ${stats.peak} simultaneous reads`);
  assert.equal(stats.active, 0);
  assert.equal(results[0][0].chainVerified, true); assert.equal(results[0][1].chainVerified, true);
  assert.equal(Object.keys(results[0][2].services).length, 5);
  for (let variant = 0; variant < 3; variant++) assert.ok(results.every(result => result[variant] === results[0][variant]));
});

test("failed identities, malformed payloads and fetch errors stay unverified", async t => {
  const cases = [
    [identityUrls[0], { chainId: 9102, nativeCurrencySymbol: "YNXT", height: 100 }],
    [identityUrls[0], { chainId: 6423, nativeCurrencySymbol: "wrong", height: 100 }],
    [identityUrls[0], { ...validBody(identityUrls[0]), height: 98 }],
    [identityUrls[1], { ...validBody(identityUrls[1]), ok: false }],
    [identityUrls[1], { ...validBody(identityUrls[1]), indexerOk: false }],
    [identityUrls[1], { ...validBody(identityUrls[1]), indexedHeight: 99 }],
    [identityUrls[2], { result: "0x238e" }],
    [identityUrls[0], null], [identityUrls[1], []], [identityUrls[2], "0x1917"],
    [identityUrls[0], new Error("Upstream unavailable")],
  ];
  for (const [url, replacement] of cases) await t.test(`${url} / ${JSON.stringify(replacement)}`, async subtest => {
    const stats = mockUpstream(subtest, target => {
      if (target !== url) return validBody(target);
      if (replacement instanceof Error) throw replacement;
      return replacement;
    });
    const result = await collectNetworkStatus({ detailed: false });
    assert.equal(result.ok, false); assert.equal(result.degraded, true); assert.equal(stats.calls.length, 3); assert.equal(stats.active, 0);
  });
});

test("timeouts release global slots and do not poison the next collection", async t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let stalls = true, calls = 0;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    calls++;
    if (!stalls) return { ok: true, json: async () => validBody(url) };
    return new Promise((resolve, reject) => init.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true }));
  });
  const pending = collectNetworkStatus({ detailed: false });
  await nextTurn(); assert.equal(calls, 2);
  t.mock.timers.tick(3500); await nextTurn(); assert.equal(calls, 3);
  t.mock.timers.tick(8000);
  const result = await pending;
  assert.equal(result.ok, false); assert.match(result.status.error, /Timed out after 3.5s/);
  assert.equal(result.observations.rpcReadState, "timeout"); assert.equal(result.observations.evmReadState, "timeout");
  stalls = false;
  const recovered = await collectNetworkStatus({ detailed: false });
  assert.equal(recovered.chainVerified, true); assert.equal(recovered.observations.rpcReadState, "ok"); assert.equal(calls, 6);
});
