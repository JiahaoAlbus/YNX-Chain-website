import assert from "node:assert/strict";
import test from "node:test";
import { validateFaucetClaim, validateFaucetRuntime } from "../src/lib/faucetRuntime.js";

const build = { commit: "d644c0821b61", release: "ynx-chain-d644c0821b61", buildTime: "2026-08-21T11:34:38Z" };
const health = {
  ok: true,
  service: "ynx-faucetd",
  chainId: 6423,
  height: 1136415,
  nativeSymbol: "YNXT",
  upstreamMode: "authoritative",
  upstreamOk: true,
  build,
  startedAt: "2026-08-21T00:46:14Z",
  truthfulStatus: "rpc-backed-faucet",
};
const version = { service: "ynx-faucetd", build, startedAt: health.startedAt, dependencies: health.dependencies };

test("accepts only the exact topology-safe Faucet runtime identity", () => {
  const result = validateFaucetRuntime(health, version);
  assert.equal(result.version.build.commit, "d644c0821b61");
  assert.ok(Object.isFrozen(result));
});

test("accepts only a claim response bound to the requested address and amount", () => {
  const address = "ynx10e0525sfrf53yh2aljmm3sn9jq5njk7llqhn80";
  const evmAddress = "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf";
  const payload = {
    transaction: { hash: `0x${"8".repeat(64)}`, to: evmAddress, amount: 100 },
    address,
    canonicalAddress: address,
    evmAddress,
    amount: 100,
    nativeSymbol: "YNXT",
    truthfulStatus: "rpc-backed-faucet",
  };
  assert.equal(validateFaucetClaim(payload, address, 100).hash, payload.transaction.hash);
  assert.throws(() => validateFaucetClaim({ ...payload, amount: 99 }, address, 100), /No success is claimed/);
  assert.throws(() => validateFaucetClaim({ ...payload, address: "ynx1other" }, address, 100), /No success is claimed/);
});

test("rejects topology leaks, wrong chain, mismatched or unknown builds", () => {
  for (const [candidateHealth, candidateVersion] of [
    [{ ...health, rpcUrl: "http://127.0.0.1:6420" }, version],
    [{ ...health, requestLog: "/var/log/ynx-chain/faucet-requests.jsonl" }, version],
    [{ ...health, chainId: 1 }, version],
    [{ ...health, upstreamOk: false }, version],
    [health, { ...version, build: { ...build, commit: "unknown" } }],
  ]) {
    assert.throws(() => validateFaucetRuntime(candidateHealth, candidateVersion), /No availability is claimed/);
  }
});
