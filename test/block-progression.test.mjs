import test from "node:test";
import assert from "node:assert/strict";
import { collectBrowserProgression, observeBlockProgression, PROGRESSION_WAIT_MS } from "../src/lib/blockProgression.js";
import { networkConnectionState } from "../src/lib/networkConnectionState.js";

const at = "2026-09-25T02:00:00.000Z";
function snapshot({ height = 100, hash = "a".repeat(64), blockTime = "2026-09-25T01:59:58.000Z", checkedAt = at, chainVerified = true, indexerVerified = true } = {}) {
  return { checkedAt, chainVerified, indexerVerified, status: { chainId: 6423, nativeCurrencySymbol: "YNXT", height, latestBlockHash: hash, latestBlockTime: blockTime }, observations: { rpcReadState: "ok", rpcCollectionMs: 20 }, ok: false, degraded: true };
}
const first = snapshot();
const progressed = snapshot({ height: 101, hash: "b".repeat(64), blockTime: "2026-09-25T02:00:08.000Z", checkedAt: "2026-09-25T02:00:10.000Z" });

test("two bounded browser snapshots prove observed growth without delaying the first publication", async () => {
  const published = [];
  let calls = 0, resume;
  const pending = collectBrowserProgression({
    fetchSnapshot: async () => ++calls === 1 ? first : progressed,
    publish: value => published.push(value),
    wait: ms => { assert.equal(ms, PROGRESSION_WAIT_MS); return new Promise(resolve => { resume = resolve; }); },
  });
  await Promise.resolve(); await Promise.resolve();
  assert.equal(calls, 1); assert.equal(published.length, 1);
  assert.equal(published[0].ok, false);
  resume();
  const final = await pending;
  assert.equal(calls, 2); assert.equal(published.length, 2);
  assert.equal(final.ok, true); assert.equal(final.progressionVerified, true);
  assert.equal(final.observations.progressionState, "observed");
  assert.equal(final.observations.progressionWindowMs, 10_000);
  assert.equal(final.observations.progressionSource, "browser-two-snapshot");
});

test("same block, missing time, bad timing and lost identity never turn green", () => {
  const cases = [
    [snapshot({ checkedAt: "2026-09-25T02:00:10.000Z" }), "not_observed"],
    [snapshot({ ...progressed, blockTime: null }), "unverified"],
    [snapshot({ ...progressed, checkedAt: "2026-09-25T02:00:01.000Z" }), "unverified"],
    [snapshot({ ...progressed, checkedAt: "2026-09-25T02:01:40.000Z" }), "unverified"],
    [snapshot({ ...progressed, chainVerified: false }), "unverified"],
  ];
  for (const [second, expected] of cases) {
    const result = observeBlockProgression(first, second);
    assert.equal(result.ok, false); assert.equal(result.progressionVerified, false);
    assert.equal(result.observations.progressionState, expected);
  }
  const lagging = observeBlockProgression(first, { ...progressed, indexerVerified: false });
  assert.equal(lagging.progressionVerified, true); assert.equal(lagging.ok, false);
});

test("invalid first snapshot does not schedule a second request", async () => {
  let calls = 0, waited = false;
  const value = await collectBrowserProgression({
    fetchSnapshot: async () => { calls++; return snapshot({ blockTime: null }); },
    publish: () => {},
    wait: async () => { waited = true; },
  });
  assert.equal(calls, 1); assert.equal(waited, false);
  assert.equal(value.chainVerified, true);
});

test("network badge checks only while a valid first sample awaits comparison", () => {
  assert.equal(networkConnectionState(first, true), "loading");
  assert.equal(networkConnectionState({ ...first, ok: true }, true), "loading", "server status alone does not prove browser-observed growth");
  assert.equal(networkConnectionState({ ...first, chainVerified: false }, true), "error");
  assert.equal(networkConnectionState({ ...first, indexerVerified: false }, true), "error");
  assert.equal(networkConnectionState({ error: "timeout" }, true), "error");
  assert.equal(networkConnectionState(observeBlockProgression(first, progressed), false), "live");
  assert.equal(networkConnectionState(observeBlockProgression(first, snapshot({ checkedAt: "2026-09-25T02:00:10.000Z" })), false), "error", "bounded no-growth outcome is unavailable, not a perpetual spinner");
  assert.equal(networkConnectionState(observeBlockProgression(first, { ...progressed, indexerVerified: false }), false), "error");
  assert.equal(networkConnectionState({ ...progressed, degraded: true, ok: false }, false), "error");
});
