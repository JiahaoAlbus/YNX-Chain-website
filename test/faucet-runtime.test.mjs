import assert from "node:assert/strict";
import test from "node:test";
import { validateFaucetRuntime } from "../src/lib/faucetRuntime.js";

const build = { commit: "ea0e068becd9", release: "ynx-chain-ea0e068becd9", buildTime: "2026-08-20T11:56:29Z" };
const health = {
  ok: true,
  service: "ynx-faucetd",
  chainId: 6423,
  height: 1136415,
  nativeSymbol: "YNXT",
  upstreamOk: true,
  dependencies: [{ name: "chain-rpc", required: true, ok: true }],
  build,
  startedAt: "2026-08-21T00:46:14Z",
  truthfulStatus: "rpc-backed-faucet",
};
const version = { service: "ynx-faucetd", build, startedAt: health.startedAt, dependencies: health.dependencies };

test("accepts only the exact topology-safe Faucet runtime identity", () => {
  const result = validateFaucetRuntime(health, version);
  assert.equal(result.version.build.commit, "ea0e068becd9");
  assert.ok(Object.isFrozen(result));
});

test("rejects topology leaks, wrong chain, mismatched or unknown builds", () => {
  for (const [candidateHealth, candidateVersion] of [
    [{ ...health, rpcUrl: "http://127.0.0.1:6420" }, version],
    [{ ...health, requestLog: "/var/log/ynx-chain/faucet-requests.jsonl" }, version],
    [{ ...health, chainId: 1 }, version],
    [{ ...health, dependencies: [{ name: "chain-rpc", required: true, ok: false }] }, version],
    [health, { ...version, build: { ...build, commit: "unknown" } }],
  ]) {
    assert.throws(() => validateFaucetRuntime(candidateHealth, candidateVersion), /No availability is claimed/);
  }
});
